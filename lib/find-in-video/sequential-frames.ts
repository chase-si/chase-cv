import { CodedError } from './coded-error'
import { fitAnalysisSize } from './frame-size'
import { Mp4Unsupported, readVideoTrack, type VideoRotation, type VideoSample } from './mp4-track'

export { Mp4Unsupported }

export type SampledBitmap = { seconds: number[]; bitmap: ImageBitmap; width: number; height: number }

function midpointSamples(samples: VideoSample[], duration: number, lastSecond: number) {
  const order = samples.map((sample, index) => ({ index, pts: sample.pts })).sort((a, b) => a.pts - b.pts)
  if (!order.length) throw new CodedError('noFrames')
  const chosen = new Map<number, number[]>()
  let cursor = 0
  for (let second = 0; second <= lastSecond; second++) {
    const target = Math.min(second + .5, Math.max(0, duration - .01))
    while (cursor + 1 < order.length &&
        Math.abs(order[cursor + 1].pts - target) < Math.abs(order[cursor].pts - target)) cursor++
    const seconds = chosen.get(order[cursor].index) ?? []
    seconds.push(second)
    chosen.set(order[cursor].index, seconds)
  }
  return chosen
}

function drawUpright(
  context: OffscreenCanvasRenderingContext2D, frame: VideoFrame,
  rotation: VideoRotation, width: number, height: number,
) {
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, width, height)
  if (rotation === 90) {
    context.translate(width, 0)
    context.rotate(Math.PI / 2)
    context.drawImage(frame, 0, 0, height, width)
  } else if (rotation === 180) {
    context.translate(width, height)
    context.rotate(Math.PI)
    context.drawImage(frame, 0, 0, width, height)
  } else if (rotation === 270) {
    context.translate(0, height)
    context.rotate(-Math.PI / 2)
    context.drawImage(frame, 0, 0, height, width)
  } else context.drawImage(frame, 0, 0, width, height)
  context.setTransform(1, 0, 0, 1, 0, 0)
}

export async function* sampleAnalysisFrames(
  file: Blob, duration: number, cancelled: () => boolean,
): AsyncGenerator<SampledBitmap> {
  if (typeof VideoDecoder === 'undefined') throw new Mp4Unsupported()
  const track = await readVideoTrack(file)
  const config: VideoDecoderConfig = {
    codec: track.codec, codedWidth: track.codedWidth, codedHeight: track.codedHeight,
    description: track.description,
  }
  if (!(await VideoDecoder.isConfigSupported(config)).supported) throw new Mp4Unsupported()
  const lastSecond = Math.floor(duration - .001)
  if (lastSecond < 0) throw new CodedError('noFrames')
  const wanted = midpointSamples(track.samples, duration, lastSecond)
  const uprightWidth = track.rotation % 180 ? track.codedHeight : track.codedWidth
  const uprightHeight = track.rotation % 180 ? track.codedWidth : track.codedHeight
  const fitted = fitAnalysisSize(uprightWidth, uprightHeight)
  const canvas = new OffscreenCanvas(fitted.width, fitted.height)
  const context = canvas.getContext('2d')
  if (!context) throw new CodedError('noCanvas')

  const queue: VideoFrame[] = []
  let failed: Error | null = null
  let decodeDone = false
  const listeners = new Set<() => void>()
  const wake = () => { for (const listener of [...listeners]) listener() }
  const fail = (error: unknown) => {
    failed = error instanceof Error ? error : new Error(String(error))
    wake()
  }
  const decoder = new VideoDecoder({
    output(frame) {
      if (!wanted.has(frame.timestamp)) { frame.close(); wake(); return }
      queue.push(frame)
      wake()
    },
    error: fail,
  })
  decoder.configure(config)
  let feeding = true
  const backpressured = () => queue.length >= 2
  const pump = (async () => {
    try {
      for (let index = 0; index < track.samples.length; index++) {
        if (cancelled()) throw new DOMException('分析已取消', 'AbortError')
        const sample = track.samples[index]
        if (sample.size <= 0) continue
        while (feeding && backpressured()) {
          if (cancelled()) throw new DOMException('分析已取消', 'AbortError')
          await new Promise<void>(resolve => {
            let settled = false
            const done = () => {
              if (settled || backpressured()) return
              settled = true
              listeners.delete(done)
              resolve()
            }
            listeners.add(done)
            done()
          })
        }
        if (!feeding || failed) return
        const data = new Uint8Array(await file.slice(sample.offset, sample.offset + sample.size).arrayBuffer())
        decoder.decode(new EncodedVideoChunk({
          type: sample.sync ? 'key' : 'delta', timestamp: index, data,
        }))
      }
      if (feeding) await decoder.flush()
    } catch (error) { fail(error) }
    finally { decodeDone = true; wake() }
  })()

  const take = () => new Promise<VideoFrame>((resolve, reject) => {
    let settled = false
    const attempt = () => {
      if (settled) return
      if (cancelled()) { settled = true; listeners.delete(attempt); reject(new DOMException('分析已取消', 'AbortError')); return }
      if (failed) { settled = true; listeners.delete(attempt); reject(failed); return }
      const frame = queue.shift()
      if (frame) { settled = true; listeners.delete(attempt); wake(); resolve(frame); return }
      if (decodeDone) { settled = true; listeners.delete(attempt); reject(new CodedError('framesShort')); return }
    }
    listeners.add(attempt)
    attempt()
  })

  let yielded = false
  try {
    const pending = [...wanted.values()].reduce((total, seconds) => total + seconds.length, 0)
    let produced = 0
    while (produced < pending) {
      const frame = await take()
      const seconds = wanted.get(frame.timestamp) ?? []
      drawUpright(context, frame, track.rotation, fitted.width, fitted.height)
      frame.close()
      const bitmap = await createImageBitmap(canvas)
      produced += seconds.length
      yielded = true
      yield { seconds, bitmap, width: fitted.width, height: fitted.height }
    }
  } catch (error) {
    if (!yielded && !(error instanceof DOMException && error.name === 'AbortError')) throw new Mp4Unsupported()
    throw error
  } finally {
    feeding = false
    wake()
    try { decoder.close() } catch { /* Already closed after a decode error. */ }
    for (const frame of queue) frame.close()
    queue.length = 0
    await pump.catch(() => undefined)
  }
}
