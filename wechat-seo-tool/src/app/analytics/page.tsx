'use client'

import { useState, useEffect } from 'react'
import { ScoreChart, KeywordChart, TrendChart, MetricsChart } from '@/components/charts'

// 模拟数据
const MOCK_TREND_DATA = [
  { date: '01-15', score: 65, views: 1200, engagement: 3.2 },
  { date: '01-16', score: 68, views: 1450, engagement: 3.8 },
  { date: '01-17', score: 72, views: 1680, engagement: 4.1 },
  { date: '01-18', score: 75, views: 1820, engagement: 4.5 },
  { date: '01-19', score: 78, views: 2100, engagement: 4.8 },
  { date: '01-20', score: 82, views: 2350, engagement: 5.2 },
  { date: '01-21', score: 85, views: 2680, engagement: 5.6 }
]

const MOCK_KEYWORD_DATA = [
  { keyword: 'AI工具', density: 4.2, frequency: 15, target: 3.5 },
  { keyword: '微信SEO', density: 3.8, frequency: 12, target: 4.0 },
  { keyword: '内容优化', density: 2.9, frequency: 9, target: 3.0 },
  { keyword: '流量增长', density: 2.1, frequency: 7, target: 2.5 },
  { keyword: '关键词研究', density: 1.8, frequency: 6, target: 2.0 },
  { keyword: '数据分析', density: 1.5, frequency: 5, target: 2.0 },
  { keyword: '用户体验', density: 1.2, frequency: 4, target: 1.5 },
  { keyword: '搜索排名', density: 0.9, frequency: 3, target: 1.5 }
]

const MOCK_METRICS_DATA = [
  { category: '标题优化', value: 85, maxValue: 100, description: '标题长度、关键词密度、吸引力评估' },
  { category: '内容质量', value: 78, maxValue: 100, description: '原创性、可读性、信息价值' },
  { category: '关键词覆盖', value: 72, maxValue: 100, description: '目标关键词的覆盖和分布' },
  { category: '结构化程度', value: 88, maxValue: 100, description: '文章结构、段落层次、格式规范' },
  { category: '用户体验', value: 65, maxValue: 100, description: '阅读体验、视觉呈现、交互性' },
  { category: '搜索友好度', value: 80, maxValue: 100, description: '搜索引擎优化程度' }
]

export default function DataVisualization() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d')
  const [refreshTime, setRefreshTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime(new Date())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getTimeRangeData = (range: string) => {
    switch (range) {
      case '24h':
        return MOCK_TREND_DATA.slice(-1)
      case '7d':
        return MOCK_TREND_DATA
      case '30d':
        return [...MOCK_TREND_DATA, 
          { date: '01-22', score: 87, views: 2950, engagement: 5.9 },
          { date: '01-23', score: 89, views: 3200, engagement: 6.1 }
        ]
      default:
        return MOCK_TREND_DATA
    }
  }

  const currentScore = MOCK_TREND_DATA[MOCK_TREND_DATA.length - 1].score

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">数据可视化中心</h1>
                <p className="text-gray-600">直观了解内容优化效果，基于数据驱动决策</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="24h">最近24小时</option>
                  <option value="7d">最近7天</option>
                  <option value="30d">最近30天</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              数据更新时间：{refreshTime.toLocaleString()}
            </div>
          </header>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* 总体SEO评分 */}
            <div className="lg:col-span-1">
              <ScoreChart 
                score={currentScore}
                title="当前SEO评分"
                subtitle="基于多维度综合评估"
              />
            </div>

            {/* 关键指标卡片 */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {MOCK_TREND_DATA[MOCK_TREND_DATA.length - 1].views.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mb-1">总浏览量</div>
                <div className="text-xs text-green-600">↑ +12.5%</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {MOCK_TREND_DATA[MOCK_TREND_DATA.length - 1].engagement}%
                </div>
                <div className="text-sm text-gray-600 mb-1">互动率</div>
                <div className="text-xs text-green-600">↑ +8.3%</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">{MOCK_KEYWORD_DATA.length}</div>
                <div className="text-sm text-gray-600 mb-1">关键词数量</div>
                <div className="text-xs text-green-600">↑ +15.0%</div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* 趋势图表 */}
            <TrendChart 
              data={getTimeRangeData(selectedTimeRange)}
              title="SEO表现趋势"
              subtitle={`${selectedTimeRange === '24h' ? '最近24小时' : selectedTimeRange === '7d' ? '最近7天' : '最近30天'}数据`}
            />

            {/* 关键词密度分析 */}
            <KeywordChart 
              data={MOCK_KEYWORD_DATA}
              title="关键词密度分析"
            />
          </div>

          <div className="mb-8">
            {/* 综合指标评估 */}
            <MetricsChart 
              data={MOCK_METRICS_DATA}
              title="多维度内容评估"
            />
          </div>

          {/* 优化建议面板 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 text-lg">📈</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">表现优秀</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 标题优化效果显著，评分达到85分</li>
                <li>• 内容结构化程度良好，层次清晰</li>
                <li>• 搜索友好度表现优秀</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-yellow-600 text-lg">⚠️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">需要关注</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 关键词覆盖率有待提升至75%以上</li>
                <li>• 内容质量分数可进一步优化</li>
                <li>• 用户体验指标需要改善</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-lg">💡</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">优化建议</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 增加长尾关键词的使用</li>
                <li>• 优化文章开头和结尾部分</li>
                <li>• 提升内容的可读性和互动性</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}