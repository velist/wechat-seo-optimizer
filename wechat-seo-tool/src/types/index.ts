export interface TitleAnalysis {
  title: string
  score: number
  issues: string[]
  suggestions: string[]
  keywordDensity: number
  length: number
  optimizedVersions: OptimizedTitle[]
}

export interface OptimizedTitle {
  title: string
  score: number
  changes: string[]
}

export interface KeywordData {
  keyword: string
  density: number
  count: number
  positions: number[]
}

export interface ContentAnalysis {
  score: number
  wordCount: number
  keywords: KeywordData[]
  readabilityScore: number
  issues: string[]
  suggestions: string[]
}

export interface SEOScore {
  overall: number
  title: number
  keywords: number
  content: number
  readability: number
}