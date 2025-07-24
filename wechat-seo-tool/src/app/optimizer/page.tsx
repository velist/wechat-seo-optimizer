'use client'

import { useState } from 'react'
import { analyzeTitle } from '@/lib/titleAnalyzer'
import { TitleAnalysis } from '@/types'

export default function OptimizerPage() {
  const [title, setTitle] = useState('')
  const [keywords, setKeywords] = useState('')
  const [analysis, setAnalysis] = useState<TitleAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!title.trim()) return
    
    setIsAnalyzing(true)
    
    // 模拟分析过程
    setTimeout(() => {
      const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k)
      const result = analyzeTitle(title, keywordList)
      setAnalysis(result)
      setIsAnalyzing(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">标题优化器</h1>
            <p className="text-gray-600">智能分析您的文章标题，提供专业的SEO优化建议</p>
          </header>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* 输入区域 */}
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">输入标题信息</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    文章标题 *
                  </label>
                  <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    rows={3}
                    placeholder="请输入您的文章标题..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    当前长度: {title.length} 字符
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目标关键词
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="请输入主要关键词，用逗号分隔"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    例如: 微信公众号, SEO优化, 搜一搜
                  </div>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!title.trim() || isAnalyzing}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  {isAnalyzing ? '分析中...' : '开始分析'}
                </button>
              </div>

              {/* 优化建议 */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">优化建议</h2>
                {analysis ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">📏 标题长度</h3>
                      <p className="text-blue-700 text-sm">
                        当前长度: {analysis.length} 字符 - {
                          analysis.length >= 15 && analysis.length <= 25 
                            ? '长度合适' 
                            : analysis.length < 15 
                              ? '建议增加到15-25字符' 
                              : '建议精简到25字符以内'
                        }
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-medium text-green-900 mb-2">🔑 关键词密度</h3>
                      <p className="text-green-700 text-sm">
                        关键词覆盖率: {analysis.keywordDensity.toFixed(1)}%
                      </p>
                    </div>
                    
                    {analysis.issues.length > 0 && (
                      <div className="p-4 bg-red-50 rounded-lg">
                        <h3 className="font-medium text-red-900 mb-2">⚠️ 需要改进</h3>
                        <ul className="text-red-700 text-sm space-y-1">
                          {analysis.issues.map((issue, index) => (
                            <li key={index}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {analysis.suggestions.length > 0 && (
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <h3 className="font-medium text-yellow-900 mb-2">💡 优化建议</h3>
                        <ul className="text-yellow-700 text-sm space-y-1">
                          {analysis.suggestions.map((suggestion, index) => (
                            <li key={index}>• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    输入标题后点击"开始分析"查看优化建议
                  </p>
                )}
              </div>
            </div>

            {/* 结果区域 */}
            <div className="space-y-6">
              {/* 评分显示 */}
              {analysis && (
                <div className="card">
                  <h2 className="text-xl font-semibold mb-4">评分结果</h2>
                  <div className="text-center mb-6">
                    <div className={`text-5xl font-bold mb-2 ${
                      analysis.score >= 80 ? 'text-green-600' :
                      analysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {analysis.score}
                    </div>
                    <div className="text-sm text-gray-600">综合评分</div>
                    <div className={`text-sm font-medium ${
                      analysis.score >= 80 ? 'text-green-600' :
                      analysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {analysis.score >= 80 ? '优秀' :
                       analysis.score >= 60 ? '良好' : '需要改进'}
                    </div>
                  </div>
                </div>
              )}

              {/* 优化版本 */}
              {analysis && analysis.optimizedVersions.length > 0 && (
                <div className="card">
                  <h2 className="text-xl font-semibold mb-4">推荐标题</h2>
                  <div className="space-y-4">
                    {analysis.optimizedVersions.map((version, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">优化版本 {index + 1}</h3>
                          <span className={`text-xs px-2 py-1 rounded ${
                            version.score >= 80 ? 'bg-green-100 text-green-800' :
                            version.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            评分: {version.score}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2 font-medium">{version.title}</p>
                        <div className="text-xs text-gray-600">
                          <strong>优化内容:</strong> {version.changes.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}