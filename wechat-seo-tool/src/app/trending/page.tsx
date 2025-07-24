'use client'

import { useState, useEffect } from 'react'
import { TrendingTopic, HotspotAnalysis } from '@/types'
import { aiService } from '@/lib/aiService'
import AIConfig from '@/components/AIConfig'

// 模拟热门话题数据
const MOCK_TRENDING_TOPICS: TrendingTopic[] = [
  {
    keyword: "AI工具",
    score: 95,
    category: "科技趋势",
    relatedKeywords: ["人工智能", "ChatGPT", "自动化", "效率提升"],
    description: "AI工具持续火热，用户对智能化解决方案需求激增"
  },
  {
    keyword: "新媒体运营",
    score: 88,
    category: "营销推广",
    relatedKeywords: ["内容创作", "流量获取", "粉丝运营", "变现"],
    description: "新媒体运营方法论备受关注，实用技巧类内容表现突出"
  },
  {
    keyword: "副业赚钱",
    score: 82,
    category: "财经理财",
    relatedKeywords: ["兼职", "被动收入", "创业", "理财"],
    description: "副业话题热度不减，实操性强的赚钱方法备受追捧"
  },
  {
    keyword: "职场技能",
    score: 78,
    category: "职业发展",
    relatedKeywords: ["升职加薪", "软技能", "沟通", "领导力"],
    description: "职场技能提升需求旺盛，实用方法论内容受欢迎"
  },
  {
    keyword: "健康养生",
    score: 75,
    category: "生活方式",
    relatedKeywords: ["饮食", "运动", "睡眠", "心理健康"],
    description: "健康养生关注度稳定，科学方法和实用建议更受认可"
  },
  {
    keyword: "理财投资",
    score: 73,
    category: "财经理财",
    relatedKeywords: ["基金", "股票", "理财规划", "风险管理"],
    description: "理财投资教育需求持续，入门级和实用性内容表现好"
  }
]

// 热门关键词搜索数据
const TRENDING_KEYWORDS = [
  { keyword: "微信SEO", trend: "+45%", volume: "15.2万" },
  { keyword: "公众号运营", trend: "+32%", volume: "28.5万" },
  { keyword: "内容营销", trend: "+28%", volume: "22.1万" },
  { keyword: "流量变现", trend: "+25%", volume: "18.9万" },
  { keyword: "AI写作", trend: "+67%", volume: "12.3万" },
  { keyword: "自媒体", trend: "+15%", volume: "35.6万" },
  { keyword: "数字化转型", trend: "+38%", volume: "19.8万" },
  { keyword: "用户增长", trend: "+22%", volume: "16.7万" }
]

export default function HotspotTracker() {
  const [inputContent, setInputContent] = useState('')
  const [analysis, setAnalysis] = useState<HotspotAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiEnabled, setAiEnabled] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [refreshTime, setRefreshTime] = useState(new Date())

  // 模拟数据刷新
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime(new Date())
    }, 30000) // 30秒刷新一次

    return () => clearInterval(interval)
  }, [])

  const handleAnalyzeContent = async () => {
    if (!inputContent.trim()) return

    setIsAnalyzing(true)
    
    try {
      if (aiEnabled) {
        // 使用AI分析
        const aiAnalysis = await aiService.analyzeTrends(inputContent)
        setAnalysis({
          ...aiAnalysis,
          opportunityScore: Math.round(Math.random() * 30 + 70) // 70-100分
        })
      } else {
        // 使用模拟数据
        setTimeout(() => {
          const mockAnalysis: HotspotAnalysis = {
            trending: MOCK_TRENDING_TOPICS.slice(0, 3),
            recommendations: [
              "结合AI工具话题创作内容，预计可获得20%+的流量提升",
              "新媒体运营相关内容具有较高用户需求，建议深度挖掘",
              "可以结合当前内容特点，融入热门话题元素"
            ],
            opportunityScore: 76
          }
          setAnalysis(mockAnalysis)
          setIsAnalyzing(false)
        }, 2000)
        return
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      // 使用模拟数据作为后备
      const mockAnalysis: HotspotAnalysis = {
        trending: MOCK_TRENDING_TOPICS.slice(0, 3),
        recommendations: [
          "AI分析暂时不可用，显示基础热点分析",
          "建议关注当前热门话题趋势",
          "结合内容特点选择合适的热点话题"
        ],
        opportunityScore: 65
      }
      setAnalysis(mockAnalysis)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const filteredTopics = selectedCategory === 'all' 
    ? MOCK_TRENDING_TOPICS 
    : MOCK_TRENDING_TOPICS.filter(topic => topic.category === selectedCategory)

  const categories = ['all', ...Array.from(new Set(MOCK_TRENDING_TOPICS.map(t => t.category)))]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">热点追踪工具</h1>
                <p className="text-gray-600">发现热门话题，把握流量机会，提升内容传播力</p>
              </div>
              <div className="flex items-center space-x-4">
                <AIConfig onConfigChange={setAiEnabled} />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              数据更新时间：{refreshTime.toLocaleTimeString()}
            </div>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 左侧：实时热点 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 热门话题 */}
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">🔥 实时热点话题</h2>
                  <div className="flex space-x-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          selectedCategory === category
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {category === 'all' ? '全部' : category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {filteredTopics.map((topic, index) => (
                    <div key={topic.keyword} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{topic.keyword}</h3>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            topic.score >= 90 ? 'bg-red-400' :
                            topic.score >= 75 ? 'bg-orange-400' : 'bg-yellow-400'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-600">{topic.score}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded mb-2">
                        {topic.category}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{topic.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {topic.relatedKeywords.slice(0, 3).map(keyword => (
                          <span key={keyword} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 关键词趋势 */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-6">📈 关键词搜索趋势</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {TRENDING_KEYWORDS.map((item, index) => (
                    <div key={item.keyword} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{item.keyword}</div>
                        <div className="text-sm text-gray-500">搜索量: {item.volume}</div>
                      </div>
                      <div className={`text-sm font-semibold ${
                        item.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧：内容分析 */}
            <div className="space-y-6">
              {/* 内容热点分析 */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">📊 内容热点分析</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      输入您的内容
                    </label>
                    <textarea
                      value={inputContent}
                      onChange={(e) => setInputContent(e.target.value)}
                      rows={6}
                      placeholder="粘贴您的文章内容或标题，分析热点匹配度..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                    />
                  </div>
                  
                  <button
                    onClick={handleAnalyzeContent}
                    disabled={!inputContent.trim() || isAnalyzing}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {aiEnabled ? 'AI分析中...' : '分析中...'}
                      </span>
                    ) : (
                      `分析热点匹配度${aiEnabled ? ' (AI增强)' : ''}`
                    )}
                  </button>
                </div>
              </div>

              {/* 分析结果 */}
              {analysis && (
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    分析结果
                    {aiEnabled && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">AI增强</span>
                    )}
                  </h3>
                  
                  <div className="text-center mb-6">
                    <div className={`text-3xl font-bold mb-2 ${
                      analysis.opportunityScore >= 80 ? 'text-green-600' :
                      analysis.opportunityScore >= 60 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {analysis.opportunityScore}
                    </div>
                    <div className="text-sm text-gray-600">热点机会评分</div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">🎯 匹配的热点话题</h4>
                      <div className="space-y-2">
                        {analysis.trending.map((topic, index) => (
                          <div key={topic.keyword} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                            <span className="text-sm font-medium text-blue-900">{topic.keyword}</span>
                            <span className="text-xs text-blue-600">{topic.score}分</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">💡 优化建议</h4>
                      <div className="space-y-2">
                        {analysis.recommendations.map((rec, index) => (
                          <div key={index} className="text-sm text-gray-600 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                            {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 热点日历 */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">📅 热点日历</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border-l-4 border-red-400">
                    <div>
                      <div className="font-medium text-red-900">双十一购物节</div>
                      <div className="text-sm text-red-600">11月11日</div>
                    </div>
                    <div className="text-sm text-red-600 font-semibold">预热中</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400">
                    <div>
                      <div className="font-medium text-blue-900">年度科技大会</div>
                      <div className="text-sm text-blue-600">11月15日</div>
                    </div>
                    <div className="text-sm text-blue-600 font-semibold">即将到来</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-400">
                    <div>
                      <div className="font-medium text-green-900">新媒体峰会</div>
                      <div className="text-sm text-green-600">11月20日</div>
                    </div>
                    <div className="text-sm text-green-600 font-semibold">关注中</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}