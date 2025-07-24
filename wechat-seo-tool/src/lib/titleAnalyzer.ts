import { TitleAnalysis, OptimizedTitle, KeywordData } from '@/types'
import { aiService } from './aiService'

const TITLE_LENGTH_OPTIMAL = { min: 15, max: 25 }
const HIGH_VALUE_WORDS = ['如何', '方法', '技巧', '秘诀', '攻略', '教程', '指南', '揭秘', '解析']
const QUESTION_WORDS = ['什么', '怎么', '为什么', '如何', '哪些', '怎样']
const EMOTIONAL_WORDS = ['惊人', '震撼', '神奇', '完美', '实用', '高效', '简单', '必备', '重要']

export function analyzeTitle(title: string, targetKeywords: string[] = [], useAI: boolean = false): TitleAnalysis {
  const issues: string[] = []
  const suggestions: string[] = []
  let score = 100
  let aiInsights: string[] = []

  // 基础分析逻辑保持不变
  if (title.length < TITLE_LENGTH_OPTIMAL.min) {
    issues.push('标题过短，可能影响信息传达')
    suggestions.push('建议增加描述性词汇，长度控制在15-25字')
    score -= 15
  } else if (title.length > TITLE_LENGTH_OPTIMAL.max) {
    issues.push('标题过长，可能在搜索结果中被截断')
    suggestions.push('建议精简表达，突出核心关键词')
    score -= 10
  }

  // 关键词密度分析
  let keywordDensity = 0
  if (targetKeywords.length > 0) {
    const keywordCount = targetKeywords.reduce((count, keyword) => {
      return count + (title.toLowerCase().includes(keyword.toLowerCase()) ? 1 : 0)
    }, 0)
    keywordDensity = (keywordCount / targetKeywords.length) * 100
    
    if (keywordDensity === 0) {
      issues.push('标题中未包含目标关键词')
      suggestions.push('建议在标题中自然融入主要关键词')
      score -= 20
    } else if (keywordDensity < 50) {
      suggestions.push('可以增加更多相关关键词')
      score -= 5
    }
  }

  // 高价值词汇检查
  const hasHighValueWord = HIGH_VALUE_WORDS.some(word => title.includes(word))
  if (!hasHighValueWord) {
    suggestions.push('添加"如何"、"方法"、"技巧"等高价值词汇可提升点击率')
    score -= 5
  }

  // 疑问句检查
  const hasQuestionWord = QUESTION_WORDS.some(word => title.includes(word))
  if (hasQuestionWord) {
    score += 5
  }

  // 情感词汇检查
  const hasEmotionalWord = EMOTIONAL_WORDS.some(word => title.includes(word))
  if (hasEmotionalWord) {
    score += 3
  } else {
    suggestions.push('适当添加情感词汇如"实用"、"高效"可增加吸引力')
  }

  // 数字检查
  if (/\d+/.test(title)) {
    score += 5
  } else {
    suggestions.push('添加具体数字可以提升吸引力，如"5个方法"、"10个技巧"')
  }

  // AI增强分析
  if (useAI && aiService.isConfigured()) {
    try {
      // 简化为同步调用
      aiInsights = ['AI分析功能正在开发中，即将上线']
    } catch (error) {
      console.warn('AI analysis failed for title:', error)
      aiInsights = ['AI分析暂时不可用，使用基础算法分析']
    }
  }

  // 生成优化版本
  const optimizedVersions = generateOptimizedTitles(title, targetKeywords)

  return {
    title,
    score: Math.max(0, Math.min(100, score)),
    issues,
    suggestions: [...new Set(suggestions)], // 去重
    keywordDensity,
    length: title.length,
    optimizedVersions,
    aiInsights
  }
}

function generateOptimizedTitles(originalTitle: string, keywords: string[]): OptimizedTitle[] {
  const optimized: OptimizedTitle[] = []

  // 基础优化版本
  if (!QUESTION_WORDS.some(word => originalTitle.includes(word))) {
    const questionTitle = `如何${originalTitle}`
    optimized.push({
      title: questionTitle,
      score: analyzeTitle(questionTitle, keywords).score,
      changes: ['添加疑问词"如何"提升搜索匹配度']
    })
  }

  if (!/\d+/.test(originalTitle)) {
    const numberTitle = `5个${originalTitle}的方法`
    optimized.push({
      title: numberTitle,
      score: analyzeTitle(numberTitle, keywords).score,
      changes: ['添加具体数字增加吸引力']
    })
  }

  if (!EMOTIONAL_WORDS.some(word => originalTitle.includes(word))) {
    const emotionalTitle = `实用的${originalTitle}技巧`
    optimized.push({
      title: emotionalTitle,
      score: analyzeTitle(emotionalTitle, keywords).score,
      changes: ['添加情感词"实用"增强吸引力']
    })
  }

  return optimized.sort((a, b) => b.score - a.score)
}

export function extractKeywords(text: string): KeywordData[] {
  // 使用高级分析器进行关键词提取
  try {
    const { keywordAnalyzer } = require('./advancedAnalyzer')
    return keywordAnalyzer.analyze(text, 'combined', 10)
  } catch (error) {
    console.warn('Advanced analyzer not available, falling back to simple extraction:', error)
    // 简单的关键词提取作为后备方案
    const words = text.match(/[\u4e00-\u9fa5]{2,}/g) || []
    const wordCount: { [key: string]: { count: number; positions: number[] } } = {}
    
    words.forEach((word, index) => {
      if (!wordCount[word]) {
        wordCount[word] = { count: 0, positions: [] }
      }
      wordCount[word].count++
      wordCount[word].positions.push(index)
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
      .sort((a, b) => b.density - a.density)
      .slice(0, 10)
  }
}