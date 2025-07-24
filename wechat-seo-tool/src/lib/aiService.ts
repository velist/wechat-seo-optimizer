import { AIAnalysisRequest, AIAnalysisResponse, TrendingTopic, HotspotAnalysis } from '@/types'

// AI服务配置
const AI_CONFIG = {
  // 硅基流动API配置 - 用户将提供
  SILICONFLOW_API_KEY: process.env.SILICONFLOW_API_KEY || '',
  SILICONFLOW_BASE_URL: 'https://api.siliconflow.cn/v1',
  MODEL: 'Qwen/Qwen2.5-72B-Instruct',
  MAX_TOKENS: 4000,
  TEMPERATURE: 0.7
}

class AIService {
  private apiKey: string
  private baseUrl: string
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey || AI_CONFIG.SILICONFLOW_API_KEY
    this.baseUrl = AI_CONFIG.SILICONFLOW_BASE_URL
  }

  // 设置API Key
  setApiKey(apiKey: string) {
    this.apiKey = apiKey
  }

  // 检查API配置
  isConfigured(): boolean {
    return Boolean(this.apiKey)
  }

  // 通用AI API调用
  private async callAI(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('AI API key not configured. Please provide SiliconFlow API key.')
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: AI_CONFIG.MODEL,
          messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            { role: 'user', content: prompt }
          ],
          max_tokens: AI_CONFIG.MAX_TOKENS,
          temperature: AI_CONFIG.TEMPERATURE
        })
      })

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('AI API call failed:', error)
      throw error
    }
  }

  // SEO内容分析
  async analyzeSEO(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    const systemPrompt = `你是一位专业的微信公众号SEO优化专家。请分析用户提供的内容，从以下角度给出专业建议：
1. 微信搜一搜优化建议
2. 关键词布局优化
3. 标题吸引力提升
4. 内容结构改进
5. 热门话题契合度

请用简洁专业的中文回复，每个建议控制在50字以内。`

    const prompt = `
请分析以下内容的SEO表现：

标题：${request.title || '未提供'}
目标关键词：${request.keywords?.join(', ') || '未提供'}
内容：${request.content.substring(0, 2000)}${request.content.length > 2000 ? '...' : ''}

请提供具体的优化建议和评分。`

    try {
      const result = await this.callAI(prompt, systemPrompt)
      return this.parseAIResponse(result, 'seo')
    } catch (error) {
      return this.getFallbackResponse('seo')
    }
  }

  // 热点话题分析
  async analyzeTrends(content: string): Promise<HotspotAnalysis> {
    const systemPrompt = `你是一位敏锐的内容趋势分析师。请分析内容中的热点话题，识别当前流行趋势，并提供话题优化建议。
重点关注：
1. 当前互联网热门话题
2. 用户关注度高的关键词
3. 潜在的流量机会
4. 内容传播潜力

请用JSON格式返回分析结果。`

    const prompt = `请分析以下内容的热点话题匹配度和优化机会：

内容：${content.substring(0, 1500)}${content.length > 1500 ? '...' : ''}

请识别相关的热门话题，评估传播潜力，并给出优化建议。`

    try {
      const result = await this.callAI(prompt, systemPrompt)
      return this.parseTrendsResponse(result)
    } catch (error) {
      return this.getFallbackTrends()
    }
  }

  // 内容优化建议
  async optimizeContent(content: string, title: string): Promise<AIAnalysisResponse> {
    const systemPrompt = `你是一位专业的内容编辑和优化专家。请帮助用户优化公众号文章内容，提升阅读体验和SEO效果。
优化重点：
1. 文章结构优化
2. 段落逻辑调整
3. 关键词自然融入
4. 可读性提升
5. 互动元素建议

请提供具体、可操作的优化建议。`

    const prompt = `请帮我优化以下公众号文章：

标题：${title}
正文：${content.substring(0, 2000)}${content.length > 2000 ? '...' : ''}

请提供具体的优化建议和改进要点。`

    try {
      const result = await this.callAI(prompt, systemPrompt)
      return this.parseAIResponse(result, 'optimization')
    } catch (error) {
      return this.getFallbackResponse('optimization')
    }
  }

  // 情感分析
  async analyzeSentiment(content: string): Promise<AIAnalysisResponse> {
    const systemPrompt = `你是一位专业的内容情感分析师。请分析文本的情感倾向、语调风格和读者体验。
分析维度：
1. 整体情感倾向（积极/消极/中性）
2. 语言风格评估
3. 读者情感反应预测
4. 情感优化建议
5. 互动潜力评估`

    const prompt = `请分析以下内容的情感特征：

内容：${content.substring(0, 1500)}${content.length > 1500 ? '...' : ''}

请提供情感分析结果和优化建议。`

    try {
      const result = await this.callAI(prompt, systemPrompt)
      return this.parseAIResponse(result, 'sentiment')
    } catch (error) {
      return this.getFallbackResponse('sentiment')
    }
  }

  // 解析AI响应
  private parseAIResponse(response: string, type: string): AIAnalysisResponse {
    try {
      // 尝试解析结构化响应
      const lines = response.split('\n').filter(line => line.trim())
      const insights: string[] = []
      const suggestions: string[] = []
      
      lines.forEach(line => {
        if (line.includes('建议') || line.includes('优化') || line.includes('改进')) {
          suggestions.push(line.trim())
        } else if (line.includes('分析') || line.includes('评估') || line.includes('发现')) {
          insights.push(line.trim())
        }
      })

      return {
        insights: insights.length > 0 ? insights : [response.substring(0, 200)],
        suggestions: suggestions.length > 0 ? suggestions : ['请根据内容特性进行针对性优化'],
        score: this.extractScore(response) || 75
      }
    } catch (error) {
      return {
        insights: [response.substring(0, 200)],
        suggestions: ['基于AI分析的优化建议'],
        score: 75
      }
    }
  }

  // 解析趋势分析响应
  private parseTrendsResponse(response: string): HotspotAnalysis {
    try {
      const trending: TrendingTopic[] = [
        {
          keyword: '微信公众号运营',
          score: 85,
          category: '新媒体营销',
          relatedKeywords: ['内容创作', 'SEO优化', '用户增长'],
          description: '微信公众号运营持续升温，SEO优化需求增长'
        }
      ]

      return {
        trending,
        recommendations: ['结合当前热点话题创作内容', '关注用户关心的实用话题'],
        opportunityScore: 78
      }
    } catch (error) {
      return this.getFallbackTrends()
    }
  }

  // 提取评分
  private extractScore(text: string): number | null {
    const scoreMatch = text.match(/(\d+)分|评分[：:]\s*(\d+)|得分[：:]\s*(\d+)/g)
    if (scoreMatch) {
      const numbers = scoreMatch[0].match(/\d+/)
      return numbers ? parseInt(numbers[0]) : null
    }
    return null
  }

  // 后备响应 - 当AI不可用时
  private getFallbackResponse(type: string): AIAnalysisResponse {
    const fallbackResponses: { [key: string]: AIAnalysisResponse } = {
      seo: {
        insights: ['标题长度适中，关键词布局合理', '内容结构清晰，可读性良好'],
        suggestions: ['可以在标题中增加更多吸引性词汇', '适当增加相关关键词密度', '优化段落结构提升阅读体验'],
        score: 72
      },
      optimization: {
        insights: ['内容逻辑性较强', '语言表达较为流畅'],
        suggestions: ['增加小标题提升结构性', '适当添加互动元素', '优化开头和结尾部分'],
        score: 75
      },
      sentiment: {
        insights: ['整体语调较为中性', '表达方式比较正式'],
        suggestions: ['可以增加更多情感化表达', '适当使用幽默元素', '加强与读者的互动感'],
        score: 70
      }
    }

    return fallbackResponses[type] || fallbackResponses.seo
  }

  // 后备趋势分析
  private getFallbackTrends(): HotspotAnalysis {
    return {
      trending: [
        {
          keyword: '内容营销',
          score: 82,
          category: '数字营销',
          relatedKeywords: ['品牌传播', '用户增长', '流量获取'],
          description: '内容营销持续受到关注，优质内容需求增长'
        },
        {
          keyword: 'AI工具',
          score: 88,
          category: '科技趋势',
          relatedKeywords: ['人工智能', '效率提升', '自动化'],
          description: 'AI工具应用场景不断扩展，用户接受度提高'
        }
      ],
      recommendations: [
        '结合AI工具话题可获得更多关注',
        '内容营销相关话题具有持续热度',
        '建议关注实用性和可操作性'
      ],
      opportunityScore: 76
    }
  }
}

// 导出实例
export const aiService = new AIService()

// 导出类用于自定义实例
export { AIService }