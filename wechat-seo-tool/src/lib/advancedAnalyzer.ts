// 高级分析器 - 支持静态部署的版本
import { KeywordData } from '@/types'

// 中文停用词列表
const CHINESE_STOPWORDS = [
  '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这'
]

// 简单的中文分词函数（用于静态部署）
function simpleChineseTokenizer(text: string): string[] {
  // 移除标点符号并分割
  const cleanText = text.replace(/[，。！？；：""''（）【】《》、]/g, ' ')
  
  // 提取中文字符和英文单词
  const matches = cleanText.match(/[\u4e00-\u9fa5]+|[a-zA-Z]+/g) || []
  
  // 简单的二字词组合（模拟分词效果）
  const tokens: string[] = []
  
  for (const match of matches) {
    if (/[\u4e00-\u9fa5]/.test(match)) {
      // 中文：添加二字和三字组合
      for (let i = 0; i < match.length - 1; i++) {
        // 二字词
        if (i < match.length - 1) {
          tokens.push(match.substring(i, i + 2))
        }
        // 三字词
        if (i < match.length - 2) {
          tokens.push(match.substring(i, i + 3))
        }
      }
    } else {
      // 英文：直接添加
      tokens.push(match.toLowerCase())
    }
  }
  
  // 过滤停用词和短词
  return tokens.filter(token => 
    token.length >= 2 && 
    token.length <= 6 && 
    !CHINESE_STOPWORDS.includes(token)
  )
}

// TF-IDF算法实现
export class TFIDFAnalyzer {
  private documents: string[] = []
  private vocabulary: Set<string> = new Set()

  // 中文分词和清理
  tokenize(text: string): string[] {
    return simpleChineseTokenizer(text)
  }

  // 计算词频(TF)
  calculateTF(tokens: string[]): Map<string, number> {
    const tfMap = new Map<string, number>()
    const totalTokens = tokens.length
    
    tokens.forEach(token => {
      tfMap.set(token, (tfMap.get(token) || 0) + 1)
    })
    
    // 归一化词频
    tfMap.forEach((count, token) => {
      tfMap.set(token, count / totalTokens)
    })
    
    return tfMap
  }

  // 计算逆文档频率(IDF)
  calculateIDF(documents: string[][]): Map<string, number> {
    const idfMap = new Map<string, number>()
    const totalDocs = documents.length
    
    // 构建词汇表
    const vocabulary = new Set<string>()
    documents.forEach(doc => doc.forEach(token => vocabulary.add(token)))
    
    // 计算每个词在多少文档中出现
    vocabulary.forEach(token => {
      const docsWithToken = documents.filter(doc => doc.includes(token)).length
      const idf = Math.log(totalDocs / (docsWithToken + 1))
      idfMap.set(token, idf)
    })
    
    return idfMap
  }

  // 提取关键词
  extractKeywords(text: string, topK: number = 10): KeywordData[] {
    const tokens = this.tokenize(text)
    if (tokens.length === 0) return []
    
    const tfMap = this.calculateTF(tokens)
    
    // 简化版IDF计算（基于词长度和常见程度）
    const keywordScores: Array<{keyword: string, score: number, count: number}> = []
    
    tfMap.forEach((tf, token) => {
      const count = tokens.filter(t => t === token).length
      // 简化评分：结合词频、词长度和位置权重
      let score = tf
      
      // 词长度权重：2-3字词权重高
      if (token.length === 2 || token.length === 3) {
        score *= 1.2
      }
      
      // 高频词降权
      if (count > tokens.length * 0.1) {
        score *= 0.7
      }
      
      keywordScores.push({
        keyword: token,
        score,
        count
      })
    })
    
    // 排序并返回前K个
    return keywordScores
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((item, index) => ({
        keyword: item.keyword,
        density: (item.count / tokens.length) * 100,
        count: item.count,
        positions: tokens.map((token, idx) => token === item.keyword ? idx : -1)
                         .filter(pos => pos !== -1)
      }))
  }
}

// TextRank算法实现
export class TextRankAnalyzer {
  private windowSize: number = 5
  private damping: number = 0.85
  private iterations: number = 50

  tokenize(text: string): string[] {
    return simpleChineseTokenizer(text)
  }

  // 构建词汇共现图
  buildGraph(tokens: string[]): Map<string, Map<string, number>> {
    const graph = new Map<string, Map<string, number>>()
    
    // 初始化图
    const uniqueTokens = Array.from(new Set(tokens))
    uniqueTokens.forEach(token => {
      graph.set(token, new Map<string, number>())
    })
    
    // 在窗口内建立边
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      const start = Math.max(0, i - this.windowSize)
      const end = Math.min(tokens.length, i + this.windowSize + 1)
      
      for (let j = start; j < end; j++) {
        if (i !== j) {
          const neighbor = tokens[j]
          const tokenMap = graph.get(token)!
          tokenMap.set(neighbor, (tokenMap.get(neighbor) || 0) + 1)
        }
      }
    }
    
    return graph
  }

  // TextRank迭代计算
  calculateTextRank(graph: Map<string, Map<string, number>>): Map<string, number> {
    const nodes = Array.from(graph.keys())
    const scores = new Map<string, number>()
    
    // 初始化分数
    nodes.forEach(node => scores.set(node, 1.0))
    
    // 迭代计算
    for (let iter = 0; iter < this.iterations; iter++) {
      const newScores = new Map<string, number>()
      
      nodes.forEach(node => {
        let score = (1 - this.damping)
        const neighbors = graph.get(node)!
        
        nodes.forEach(otherNode => {
          if (node !== otherNode) {
            const otherNeighbors = graph.get(otherNode)!
            const edgeWeight = otherNeighbors.get(node) || 0
            
            if (edgeWeight > 0) {
              const totalWeight = Array.from(otherNeighbors.values())
                                      .reduce((sum, weight) => sum + weight, 0)
              if (totalWeight > 0) {
                score += this.damping * (scores.get(otherNode)! * edgeWeight / totalWeight)
              }
            }
          }
        })
        
        newScores.set(node, score)
      })
      
      // 更新分数
      newScores.forEach((score, node) => scores.set(node, score))
    }
    
    return scores
  }

  // 提取关键词
  extractKeywords(text: string, topK: number = 10): KeywordData[] {
    const tokens = this.tokenize(text)
    if (tokens.length === 0) return []
    
    const graph = this.buildGraph(tokens)
    const scores = this.calculateTextRank(graph)
    
    // 计算词频和位置
    const tokenCounts = new Map<string, number>()
    const tokenPositions = new Map<string, number[]>()
    
    tokens.forEach((token, index) => {
      tokenCounts.set(token, (tokenCounts.get(token) || 0) + 1)
      if (!tokenPositions.has(token)) {
        tokenPositions.set(token, [])
      }
      tokenPositions.get(token)!.push(index)
    })
    
    // 组合结果
    const results: KeywordData[] = []
    scores.forEach((score, keyword) => {
      const count = tokenCounts.get(keyword) || 0
      const positions = tokenPositions.get(keyword) || []
      const density = (count / tokens.length) * 100
      
      results.push({
        keyword,
        density,
        count,
        positions
      })
    })
    
    return results
      .sort((a, b) => scores.get(b.keyword)! - scores.get(a.keyword)!)
      .slice(0, topK)
  }
}

// 组合分析器
export class AdvancedKeywordAnalyzer {
  private tfidf: TFIDFAnalyzer
  private textrank: TextRankAnalyzer
  
  constructor() {
    this.tfidf = new TFIDFAnalyzer()
    this.textrank = new TextRankAnalyzer()
  }
  
  // 综合分析
  analyze(text: string, method: 'tfidf' | 'textrank' | 'combined' = 'combined', topK: number = 15): KeywordData[] {
    switch (method) {
      case 'tfidf':
        return this.tfidf.extractKeywords(text, topK)
      case 'textrank':
        return this.textrank.extractKeywords(text, topK)
      case 'combined':
      default:
        return this.combineResults(text, topK)
    }
  }
  
  private combineResults(text: string, topK: number): KeywordData[] {
    const tfidfResults = this.tfidf.extractKeywords(text, topK * 2)
    const textrankResults = this.textrank.extractKeywords(text, topK * 2)
    
    // 合并和重新评分
    const combinedMap = new Map<string, KeywordData>()
    
    tfidfResults.forEach(item => {
      combinedMap.set(item.keyword, {
        ...item,
        density: item.density * 0.6 // TF-IDF权重
      })
    })
    
    textrankResults.forEach(item => {
      if (combinedMap.has(item.keyword)) {
        const existing = combinedMap.get(item.keyword)!
        existing.density += item.density * 0.4 // TextRank权重
      } else {
        combinedMap.set(item.keyword, {
          ...item,
          density: item.density * 0.4
        })
      }
    })
    
    return Array.from(combinedMap.values())
      .sort((a, b) => b.density - a.density)
      .slice(0, topK)
  }
}

// 导出实例
export const keywordAnalyzer = new AdvancedKeywordAnalyzer()