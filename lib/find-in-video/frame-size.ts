export const analysisLongestSide = 1280

export function fitAnalysisSize(width: number, height: number) {
  const longest = Math.max(width, height)
  if (longest <= analysisLongestSide) return { width: Math.max(1, width), height: Math.max(1, height) }
  const scale = analysisLongestSide / longest
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}
