import { ContentAnalysis, KeywordData, SEOScore } from '@/types'
import { aiService } from './aiService'

export async function analyzeContent(content: string, targetKeywords: string[] = [], useAI: boolean = false): Promise<ContentAnalysis> {
  const wordCount = content.length
  const issues: string[] = []
  const suggestions: string[] = []
  let score = 100
  let aiSummary: string | undefined
  let trendingTopics: string[] | undefined

  // 基础内容长度分析
  if (wordCount < 300) {
    issues.push('内容过短，搜索引擎可能认为内容价值不高')
    suggestions.push('建议内容至少300字以上，提供更丰富的信息')
    score -= 20
  } else if (wordCount > 2000) {
    suggestions.push('内容较长，建议添加小标题和段落分隔，提升可读性')
  }

  // 关键词分析
  const keywords = extractContentKeywords(content)
  
  if (targetKeywords.length > 0) {
    const keywordAnalysis = analyzeKeywordUsage(content, targetKeywords)
    if (keywordAnalysis.density < 1) {
      issues.push('目标关键词密度过低')
      suggestions.push('适当增加目标关键词的使用频率，建议密度在1-3%之间')
      score -= 15
    } else if (keywordAnalysis.density > 5) {
      issues.push('关键词密度过高，可能被认为是关键词堆砌')  
      suggestions.push('减少关键词使用频率，保持自然的表达方式')
      score -= 10
    }
  }

  // 可读性分析
  const readabilityScore = calculateReadability(content)
  if (readabilityScore < 60) {
    issues.push('内容可读性较低')
    suggestions.push('使用shorter sentences, 添加标点符号，使用简单词汇')
    score -= 10
  }

  // 结构分析
  const hasSubheadings = /#{1,6}\s/.test(content) || /\d+[、\.]\s/.test(content)
  if (!hasSubheadings && wordCount > 500) {
    suggestions.push('添加小标题或列表结构，提升内容组织性')
    score -= 5
  }

  // AI增强分析
  if (useAI && aiService.isConfigured()) {
    try {
      // 并行执行多个AI分析
      const [seoAnalysis, trendsAnalysis] = await Promise.all([
        aiService.analyzeSEO({
          content,
          title: content.substring(0, 50),
          keywords: targetKeywords,
          analysisType: 'seo'
        }),
        aiService.analyzeTrends(content)
      ])
      
      // AI生成摘要
      aiSummary = seoAnalysis.insights?.[0] || '内容分析完成'
      
      // AI识别热门话题
      trendingTopics = trendsAnalysis.trending.map(t => t.keyword).slice(0, 5)
      
      // 合并AI建议
      if (seoAnalysis.suggestions) {
        suggestions.push(...seoAnalysis.suggestions.slice(0, 3))
      }
      
      // AI评分调整
      if (seoAnalysis.score) {
        score = Math.round((score + seoAnalysis.score) / 2)
      }
      
      // 热点匹配度加分
      const hotTopicsBonus = Math.min(10, trendingTopics.length * 2)
      score += hotTopicsBonus
      
    } catch (error) {
      console.warn('AI analysis failed for content:', error)
      aiSummary = 'AI分析暂时不可用，使用基础算法分析'
    }
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    wordCount,
    keywords: await enhanceKeywordsWithAI(keywords, useAI),
    readabilityScore,
    issues,
    suggestions: [...new Set(suggestions)], // 去重
    aiSummary,
    trendingTopics
  }
}

// AI增强关键词分析
async function enhanceKeywordsWithAI(keywords: KeywordData[], useAI: boolean): Promise<KeywordData[]> {
  if (!useAI || !aiService.isConfigured()) {
    return keywords
  }
  
  try {
    // 为关键词添加AI评估的相关性和情感倾向
    return keywords.map(keyword => ({
      ...keyword,
      relevance: Math.random() * 40 + 60, // 模拟AI评分 60-100
      sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as 'positive' | 'negative' | 'neutral'
    }))
  } catch (error) {
    console.warn('AI keyword enhancement failed:', error)
    return keywords
  }
}

function extractContentKeywords(content: string): KeywordData[] {
  // 使用高级分析器进行关键词提取
  try {
    const { keywordAnalyzer } = require('./advancedAnalyzer')
    return keywordAnalyzer.analyze(content, 'combined', 15)
  } catch (error) {
    console.warn('Advanced analyzer not available, falling back to simple extraction:', error)
    // 提取中文关键词 - 后备方案
    const words = content.match(/[\u4e00-\u9fa5]{2,}/g) || []
    const wordCount: { [key: string]: { count: number; positions: number[] } } = {}
    
    words.forEach((word, index) => {
      if (word.length >= 2 && word.length <= 6) { // 过滤长度合适的词
        if (!wordCount[word]) {
          wordCount[word] = { count: 0, positions: [] }
        }
        wordCount[word].count++
        wordCount[word].positions.push(index)
      }
    })

    const totalWords = words.length
    return Object.entries(wordCount)
      .map(([keyword, data]) => ({
        keyword,
        density: (data.count / totalWords) * 100,
        count: data.count,
        positions: data.positions
      }))
      .filter(item => item.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 15)
  }
}

function analyzeKeywordUsage(content: string, keywords: string[]) {
  const totalWords = content.length
  let keywordCount = 0
  
  keywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'gi')
    const matches = content.match(regex) || []
    keywordCount += matches.length
  })
  
  return {
    count: keywordCount,
    density: (keywordCount * keywords.join('').length / totalWords) * 100
  }
}

function calculateReadability(content: string): number {
  // 简化的可读性计算
  const sentences = content.split(/[。！？]/).filter(s => s.trim().length > 0)
  const words = content.match(/[\u4e00-\u9fa5]/g) || []
  
  if (sentences.length === 0) return 0
  
  const avgWordsPerSentence = words.length / sentences.length
  const avgSentenceLength = content.length / sentences.length
  
  // 基于平均句子长度的简单可读性评分
  let score = 100
  if (avgWordsPerSentence > 20) score -= 20
  if (avgWordsPerSentence > 30) score -= 20
  if (avgSentenceLength > 50) score -= 10
  
  return Math.max(0, score)
}

export function calculateSEOScore(titleScore: number, contentScore: number, keywordScore: number, trendingScore: number = 0): SEOScore {
  const readabilityScore = 85 // 默认值，实际中从内容分析获取
  const overall = Math.round((titleScore * 0.3 + contentScore * 0.35 + keywordScore * 0.2 + readabilityScore * 0.1 + trendingScore * 0.05))
  
  return {
    overall,
    title: titleScore,
    keywords: keywordScore,
    content: contentScore,
    readability: readabilityScore,
    trending: trendingScore
  }
}