export interface TitleAnalysis {
  title: string
  score: number
  issues: string[]
  suggestions: string[]
  keywordDensity: number
  length: number
  optimizedVersions: OptimizedTitle[]
  aiInsights?: string[] // AI生成的深度洞察
}

export interface OptimizedTitle {
  title: string
  score: number
  changes: string[]
  aiReasoning?: string // AI优化理由
}

export interface KeywordData {
  keyword: string
  density: number
  count: number
  positions: number[]
  sentiment?: 'positive' | 'negative' | 'neutral' // 情感倾向
  relevance?: number // AI评估的相关性评分
}

export interface ContentAnalysis {
  score: number
  wordCount: number
  keywords: KeywordData[]
  readabilityScore: number
  issues: string[]
  suggestions: string[]
  aiSummary?: string // AI生成的内容摘要
  trendingTopics?: string[] // AI识别的热门话题
}

export interface SEOScore {
  overall: number
  title: number
  keywords: number
  content: number
  readability: number
  trending?: number // 热点匹配度
}

// 新增AI分析相关类型
export interface AIAnalysisRequest {
  content: string
  title?: string
  keywords?: string[]
  analysisType: 'seo' | 'trending' | 'optimization' | 'sentiment'
}

export interface AIAnalysisResponse {
  insights: string[]
  suggestions: string[]
  score?: number
  trends?: string[]
  optimizedContent?: string
}

// 热点追踪相关类型
export interface TrendingTopic {
  keyword: string
  score: number
  category: string
  relatedKeywords: string[]
  description: string
}

export interface HotspotAnalysis {
  trending: TrendingTopic[]
  recommendations: string[]
  opportunityScore: number
}

// 排版美化相关类型
export interface FormattingOptions {
  fontSize: 'small' | 'medium' | 'large'
  lineSpacing: number
  paragraphSpacing: number
  titleStyle: string
  highlightColor: string
  theme: 'default' | 'professional' | 'creative' | 'minimalist'
}

export interface FormattedContent {
  html: string
  css: string
  preview: string
}

// 用户系统相关类型
export interface User {
  id: string
  username: string
  email: string
  plan: 'free' | 'pro' | 'enterprise'
  usageCount: number
  maxUsage: number
  createdAt: Date
  lastLoginAt: Date
}

export interface UserAnalysisHistory {
  id: string
  userId: string
  title: string
  content: string
  analysis: ContentAnalysis & TitleAnalysis
  createdAt: Date
}