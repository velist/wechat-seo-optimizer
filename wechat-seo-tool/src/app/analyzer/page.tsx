'use client'

import { useState } from 'react'
import { analyzeContent, calculateSEOScore } from '@/lib/contentAnalyzer'
import { ContentAnalysis, SEOScore } from '@/types'

export default function AnalyzerPage() {
  const [content, setContent] = useState('')
  const [keywords, setKeywords] = useState('')
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null)
  const [seoScore, setSeoScore] = useState<SEOScore | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!content.trim()) return
    
    setIsAnalyzing(true)
    
    setTimeout(async () => {
      const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k)
      const contentResult = await analyzeContent(content, keywordList)
      const seoResult = calculateSEOScore(85, contentResult.score, 75)
      
      setAnalysis(contentResult)
      setSeoScore(seoResult)
      setIsAnalyzing(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">内容分析器</h1>
            <p className="text-gray-600">全面分析您的文章内容，获得专业的SEO优化评估</p>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="card mb-6">
                <h2 className="text-xl font-semibold mb-4">文章内容分析</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目标关键词
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="请输入目标关键词，用逗号分隔"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    文章内容 *
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    placeholder="请粘贴您的文章内容..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">字数统计: {content.length}</span>
                  <button
                    onClick={handleAnalyze}
                    disabled={!content.trim() || isAnalyzing}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                  >
                    {isAnalyzing ? '分析中...' : '开始分析'}
                  </button>
                </div>
              </div>

              {analysis && (
                <div className="card">
                  <h2 className="text-xl font-semibold mb-4">关键词分布</h2>
                  <div className="space-y-3">
                    {analysis.keywords.slice(0, 8).map((keyword, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">{keyword.keyword}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            出现{keyword.count}次 · 密度: {keyword.density.toFixed(2)}%
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            keyword.density >= 2 ? 'bg-green-100 text-green-800' :
                            keyword.density >= 1 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {keyword.density >= 2 ? '优秀' : keyword.density >= 1 ? '良好' : '偏低'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {seoScore && (
                <div className="card">
                  <h2 className="text-xl font-semibold mb-4">SEO综合评分</h2>
                  <div className="text-center mb-6">
                    <div className={`text-4xl font-bold mb-2 ${
                      seoScore.overall >= 80 ? 'text-green-600' :
                      seoScore.overall >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {seoScore.overall}
                    </div>
                    <div className="text-sm text-gray-600">综合评分</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>标题优化</span>
                        <span className="font-medium">{seoScore.title}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{width: `${seoScore.title}%`}}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>内容质量</span>
                        <span className="font-medium">{seoScore.content}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{width: `${seoScore.content}%`}}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>关键词优化</span>
                        <span className="font-medium">{seoScore.keywords}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{width: `${seoScore.keywords}%`}}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>可读性</span>
                        <span className="font-medium">{seoScore.readability}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{width: `${seoScore.readability}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {analysis && (
                <div className="card">
                  <h2 className="text-xl font-semibold mb-4">内容统计</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">总字数</span>
                      <span className="font-medium">{analysis.wordCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">关键词数量</span>
                      <span className="font-medium">{analysis.keywords.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">可读性评分</span>
                      <span className={`font-medium ${
                        analysis.readabilityScore >= 80 ? 'text-green-600' :
                        analysis.readabilityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {analysis.readabilityScore}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {analysis && (
                <div className="card">
                  <h2 className="text-xl font-semibold mb-4">优化建议</h2>
                  <div className="space-y-3 text-sm">
                    {analysis.issues.length > 0 && (
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="font-medium text-red-900 mb-2">⚠️ 需要改进</div>
                        <ul className="text-red-700 space-y-1">
                          {analysis.issues.map((issue, index) => (
                            <li key={index}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {analysis.suggestions.length > 0 && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="font-medium text-blue-900 mb-2">💡 优化建议</div>
                        <ul className="text-blue-700 space-y-1">
                          {analysis.suggestions.map((suggestion, index) => (
                            <li key={index}>• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-900 mb-2">✅ 当前优势</div>
                      <p className="text-green-700">
                        {analysis.wordCount >= 300 ? '内容长度充足' : ''}
                        {analysis.readabilityScore >= 70 ? '，文章可读性良好' : ''}
                        {analysis.keywords.length >= 5 ? '，关键词分布合理' : ''}
                      </p>
                    </div>
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