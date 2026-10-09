export class Mp4Unsupported extends Error {
  constructor(message = 'mp4Unsupported') {
    super(message)
    this.name = 'Mp4Unsupported'
  }
}

export type VideoSample = { offset: number; size: number; pts: number; sync: boolean }
export type VideoRotation = 0 | 90 | 180 | 270
export type VideoTrack = {
  codec: string
  description: Uint8Array
  codedWidth: number
  codedHeight: number
  rotation: VideoRotation
  samples: VideoSample[]
}

type Box = { type: string; bodyStart: number; bodyEnd: number }

async function readBytes(file: Blob, offset: number, length: number) {
  if (length < 0 || offset < 0 || offset + length > file.size) throw new Mp4Unsupported()
  return new Uint8Array(await file.slice(offset, offset + length).arrayBuffer())
}

function fourcc(data: Uint8Array, offset: number) {
  return String.fromCharCode(data[offset], data[offset + 1], data[offset + 2], data[offset + 3])
}

function boxes(data: Uint8Array, begin: number, end: number): Box[] {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength)
  const found: Box[] = []
  let offset = begin
  while (offset + 8 <= end) {
    const size32 = view.getUint32(offset)
    const type = fourcc(data, offset + 4)
    let header = 8
    let size = size32
    if (size32 === 1) {
      if (offset + 16 > end) break
      const large = view.getBigUint64(offset + 8)
      if (large > Number.MAX_SAFE_INTEGER) throw new Mp4Unsupported()
      size = Number(large)
      header = 16
    } else if (size32 === 0) size = end - offset
    if (size < header || offset + size > end) break
    found.push({ type, bodyStart: offset + header, bodyEnd: offset + size })
    offset += size
  }
  return found
}

function findBox(data: Uint8Array, begin: number, end: number, type: string) {
  return boxes(data, begin, end).find(box => box.type === type)
}

function viewOf(data: Uint8Array) {
  return new DataView(data.buffer, data.byteOffset, data.byteLength)
}

function timescaleOf(data: Uint8Array, bodyStart: number) {
  const view = viewOf(data)
  const version = data[bodyStart]
  const timescaleAt = bodyStart + (version === 1 ? 20 : 12)
  return view.getUint32(timescaleAt)
}

function rotationOf(data: Uint8Array, bodyStart: number, bodyEnd: number): VideoRotation {
  const version = data[bodyStart]
  const matrixAt = bodyStart + (version === 1 ? 52 : 40)
  if (matrixAt + 36 > bodyEnd) return 0
  const view = viewOf(data)
  const fixed = (index: number) => view.getInt32(matrixAt + index * 4) / 65536
  const a = fixed(0), b = fixed(1), c = fixed(3), d = fixed(4)
  if (Math.abs(a) < .2 && b > .8 && c < -.8 && Math.abs(d) < .2) return 90
  if (a < -.8 && Math.abs(b) < .2 && Math.abs(c) < .2 && d < -.8) return 180
  if (Math.abs(a) < .2 && b < -.8 && c > .8 && Math.abs(d) < .2) return 270
  return 0
}

function avcCodec(description: Uint8Array, prefix: string) {
  if (description.length < 4) throw new Mp4Unsupported()
  const hex = (value: number) => value.toString(16).padStart(2, '0')
  return `${prefix}.${hex(description[1])}${hex(description[2])}${hex(description[3])}`
}

function hevcCodec(description: Uint8Array, prefix: string) {
  if (description.length < 13) throw new Mp4Unsupported()
  const view = viewOf(description)
  const profileSpace = ['', 'A', 'B', 'C'][(description[1] >> 6) & 3]
  const profile = description[1] & 0x1f
  const compatibility = view.getUint32(2).toString(16)
  const tier = description[1] & 0x20 ? 'H' : 'L'
  const constraints: string[] = []
  for (let index = 6; index <= 11; index++) constraints.push(description[index].toString(16))
  while (constraints.length && constraints.at(-1) === '0') constraints.pop()
  const suffix = constraints.length ? '.' + constraints.join('.') : ''
  return `${prefix}.${profileSpace}${profile}.${compatibility}.${tier}${description[12]}${suffix}`
}

function sampleEntry(data: Uint8Array, stsd: Box) {
  const view = viewOf(data)
  if (stsd.bodyStart + 8 > stsd.bodyEnd) throw new Mp4Unsupported()
  const entries = boxes(data, stsd.bodyStart + 8, stsd.bodyEnd)
  const entry = entries.find(box => box.type === 'avc1' || box.type === 'avc3' || box.type === 'hvc1' || box.type === 'hev1')
  if (!entry) throw new Mp4Unsupported()
  const contentStart = entry.bodyStart - 8
  if (contentStart + 86 > entry.bodyEnd) throw new Mp4Unsupported()
  const codedWidth = view.getUint16(contentStart + 32)
  const codedHeight = view.getUint16(contentStart + 34)
  const configType = entry.type === 'hvc1' || entry.type === 'hev1' ? 'hvcC' : 'avcC'
  const config = findBox(data, contentStart + 86, entry.bodyEnd, configType)
  if (!config || codedWidth <= 0 || codedHeight <= 0) throw new Mp4Unsupported()
  const description = data.subarray(config.bodyStart, config.bodyEnd)
  const codec = configType === 'hvcC' ? hevcCodec(description, entry.type) : avcCodec(description, entry.type)
  return { codec, description, codedWidth, codedHeight }
}

function sampleTable(data: Uint8Array, stbl: Box, mediaTimescale: number, mediaShift: number) {
  const view = viewOf(data)
  const stts = findBox(data, stbl.bodyStart, stbl.bodyEnd, 'stts')
  const stsc = findBox(data, stbl.bodyStart, stbl.bodyEnd, 'stsc')
  const stsz = findBox(data, stbl.bodyStart, stbl.bodyEnd, 'stsz')
  const chunkBox = findBox(data, stbl.bodyStart, stbl.bodyEnd, 'stco') ?? findBox(data, stbl.bodyStart, stbl.bodyEnd, 'co64')
  const stsd = findBox(data, stbl.bodyStart, stbl.bodyEnd, 'stsd')
  if (!stts || !stsc || !stsz || !chunkBox || !stsd || mediaTimescale <= 0) throw new Mp4Unsupported()
  const visual = sampleEntry(data, stsd)

  const sttsCount = view.getUint32(stts.bodyStart + 4)
  const decodeTimes: number[] = []
  let decodeTime = 0
  for (let index = 0; index < sttsCount; index++) {
    const count = view.getUint32(stts.bodyStart + 8 + index * 8)
    const delta = view.getUint32(stts.bodyStart + 12 + index * 8)
    for (let sample = 0; sample < count; sample++) {
      decodeTimes.push(decodeTime)
      decodeTime += delta
    }
  }
  const sampleCount = decodeTimes.length
  const offsets = new Int32Array(sampleCount)
  const ctts = findBox(data, stbl.bodyStart, stbl.bodyEnd, 'ctts')
  if (ctts) {
    const version = data[ctts.bodyStart]
    const entries = view.getUint32(ctts.bodyStart + 4)
    let cursor = 0
    for (let index = 0; index < entries; index++) {
      const count = view.getUint32(ctts.bodyStart + 8 + index * 8)
      const offset = version === 1
        ? view.getInt32(ctts.bodyStart + 12 + index * 8)
        : view.getUint32(ctts.bodyStart + 12 + index * 8)
      for (let sample = 0; sample < count && cursor < sampleCount; sample++) offsets[cursor++] = offset
    }
  }

  const sizes = new Array<number>(sampleCount)
  const constantSize = view.getUint32(stsz.bodyStart + 4)
  const counted = view.getUint32(stsz.bodyStart + 8)
  if (counted !== sampleCount) throw new Mp4Unsupported()
  for (let index = 0; index < sampleCount; index++) {
    sizes[index] = constantSize || view.getUint32(stsz.bodyStart + 12 + index * 4)
  }

  const chunkCount = view.getUint32(chunkBox.bodyStart + 4)
  const chunkOffsets: number[] = []
  for (let index = 0; index < chunkCount; index++) {
    const offset = chunkBox.type === 'co64'
      ? Number(view.getBigUint64(chunkBox.bodyStart + 8 + index * 8))
      : view.getUint32(chunkBox.bodyStart + 8 + index * 4)
    chunkOffsets.push(offset)
  }

  const stscCount = view.getUint32(stsc.bodyStart + 4)
  const groups: { firstChunk: number; perChunk: number }[] = []
  for (let index = 0; index < stscCount; index++) {
    groups.push({
      firstChunk: view.getUint32(stsc.bodyStart + 8 + index * 12),
      perChunk: view.getUint32(stsc.bodyStart + 12 + index * 12),
    })
  }
  if (!groups.length) throw new Mp4Unsupported()

  const sync = new Set<number>()
  const stss = findBox(data, stbl.bodyStart, stbl.bodyEnd, 'stss')
  if (!stss) for (let index = 0; index < sampleCount; index++) sync.add(index)
  else {
    const entries = view.getUint32(stss.bodyStart + 4)
    for (let index = 0; index < entries; index++) sync.add(view.getUint32(stss.bodyStart + 8 + index * 4) - 1)
  }

  const samples: VideoSample[] = []
  let sampleIndex = 0
  let groupIndex = 0
  for (let chunk = 0; chunk < chunkOffsets.length && sampleIndex < sampleCount; chunk++) {
    const chunkNumber = chunk + 1
    while (groupIndex + 1 < groups.length && groups[groupIndex + 1].firstChunk <= chunkNumber) groupIndex++
    let position = chunkOffsets[chunk]
    for (let index = 0; index < groups[groupIndex].perChunk && sampleIndex < sampleCount; index++) {
      const size = sizes[sampleIndex]
      samples.push({
        offset: position, size,
        pts: (decodeTimes[sampleIndex] + offsets[sampleIndex]) / mediaTimescale - mediaShift,
        sync: sync.has(sampleIndex),
      })
      position += size
      sampleIndex++
    }
  }
  if (sampleIndex !== sampleCount || !samples.some(sample => sample.sync && sample.size > 0)) throw new Mp4Unsupported()
  return { visual, samples }
}

function mediaShift(data: Uint8Array, trak: Box, movieTimescale: number, mediaTimescale: number) {
  const edts = findBox(data, trak.bodyStart, trak.bodyEnd, 'edts')
  const elst = edts && findBox(data, edts.bodyStart, edts.bodyEnd, 'elst')
  if (!elst || movieTimescale <= 0) return 0
  const view = viewOf(data)
  const version = data[elst.bodyStart]
  const count = view.getUint32(elst.bodyStart + 4)
  let delay = 0
  for (let index = 0; index < count; index++) {
    const duration = version === 1
      ? Number(view.getBigUint64(elst.bodyStart + 8 + index * 20))
      : view.getUint32(elst.bodyStart + 8 + index * 12)
    const mediaTime = version === 1
      ? Number(view.getBigInt64(elst.bodyStart + 16 + index * 20))
      : view.getInt32(elst.bodyStart + 12 + index * 12)
    if (mediaTime === -1) delay += duration / movieTimescale
    else return mediaTime / mediaTimescale - delay
  }
  return -delay
}

export async function readVideoTrack(file: Blob): Promise<VideoTrack> {
  const header = await readBytes(file, 0, Math.min(file.size, 12))
  if (header.length < 8 || fourcc(header, 4) !== 'ftyp') throw new Mp4Unsupported()
  let offset = 0
  let moov: Uint8Array | null = null
  while (offset + 8 <= file.size) {
    const boxHeader = await readBytes(file, offset, Math.min(16, file.size - offset))
    const view = viewOf(boxHeader)
    const size32 = view.getUint32(0)
    const type = fourcc(boxHeader, 4)
    let size = size32
    if (size32 === 1) {
      const large = view.getBigUint64(8)
      if (large > Number.MAX_SAFE_INTEGER) throw new Mp4Unsupported()
      size = Number(large)
    } else if (size32 === 0) size = file.size - offset
    if (size < 8 || offset + size > file.size) throw new Mp4Unsupported()
    if (type === 'moov') {
      if (size > 64 * 1024 * 1024) throw new Mp4Unsupported()
      moov = await readBytes(file, offset, size)
      break
    }
    offset += size
  }
  if (!moov) throw new Mp4Unsupported()
  const moovBoxes = boxes(moov, 0, moov.length)
  const moovBox = moovBoxes.find(box => box.type === 'moov') ?? { type: 'moov', bodyStart: 8, bodyEnd: moov.length }
  const mvhd = findBox(moov, moovBox.bodyStart, moovBox.bodyEnd, 'mvhd')
  const movieTimescale = mvhd ? timescaleOf(moov, mvhd.bodyStart) : 0
  for (const trak of boxes(moov, moovBox.bodyStart, moovBox.bodyEnd).filter(box => box.type === 'trak')) {
    const mdia = findBox(moov, trak.bodyStart, trak.bodyEnd, 'mdia')
    if (!mdia) continue
    const hdlr = findBox(moov, mdia.bodyStart, mdia.bodyEnd, 'hdlr')
    const mdhd = findBox(moov, mdia.bodyStart, mdia.bodyEnd, 'mdhd')
    if (!hdlr || !mdhd || fourcc(moov, hdlr.bodyStart + 8) !== 'vide') continue
    const minf = findBox(moov, mdia.bodyStart, mdia.bodyEnd, 'minf')
    const stbl = minf && findBox(moov, minf.bodyStart, minf.bodyEnd, 'stbl')
    const tkhd = findBox(moov, trak.bodyStart, trak.bodyEnd, 'tkhd')
    if (!stbl) continue
    const mediaTimescale = timescaleOf(moov, mdhd.bodyStart)
    const parsed = sampleTable(moov, stbl, mediaTimescale, mediaShift(moov, trak, movieTimescale, mediaTimescale))
    return {
      codec: parsed.visual.codec,
      description: parsed.visual.description,
      codedWidth: parsed.visual.codedWidth,
      codedHeight: parsed.visual.codedHeight,
      rotation: tkhd ? rotationOf(moov, tkhd.bodyStart, tkhd.bodyEnd) : 0,
      samples: parsed.samples,
    }
  }
  throw new Mp4Unsupported()
}
