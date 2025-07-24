'use client'

import { useState } from 'react'
import Link from 'next/link'
import { analyzeTitle } from '@/lib/titleAnalyzer'
import { analyzeContent } from '@/lib/contentAnalyzer'
import { TitleAnalysis, ContentAnalysis } from '@/types'

export default function HomePage() {
  const [title, setTitle] = useState('')
  const [keywords, setKeywords] = useState('')
  const [content, setContent] = useState('')
  const [titleResult, setTitleResult] = useState<TitleAnalysis | null>(null)
  const [contentResult, setContentResult] = useState<ContentAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleQuickAnalysis = async () => {
    if (!title.trim() && !content.trim()) return
    
    setIsAnalyzing(true)
    
    setTimeout(() => {
      const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k)
      
      if (title.trim()) {
        const titleAnalysis = analyzeTitle(title, keywordList)
        setTitleResult(titleAnalysis)
      }
      
      if (content.trim()) {
        const contentAnalysis = analyzeContent(content, keywordList)
        setContentResult(contentAnalysis)
      }
      
      setIsAnalyzing(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            微信公众号SEO优化工具
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            专业的微信搜一搜流量优化工具，帮助您的公众号文章获得更多曝光
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <h3 className="text-xl font-semibold mb-3">📝 标题优化</h3>
            <p className="text-gray-600 mb-4">
              智能分析标题关键词密度，提供优化建议
            </p>
            <Link href="/optimizer">
              <button className="btn-primary w-full">
                开始优化
              </button>
            </Link>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-3">📊 内容分析</h3>
            <p className="text-gray-600 mb-4">
              全面分析文章内容，评估SEO表现
            </p>
            <Link href="/analyzer">
              <button className="btn-primary w-full">
                分析内容
              </button>
            </Link>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-3">🔍 关键词研究</h3>
            <p className="text-gray-600 mb-4">
              发现热门关键词，提升搜索排名
            </p>
            <Link href="/keywords">
              <button className="btn-primary w-full">
                研究关键词
              </button>
            </Link>
          </div>
        </div>

        <div className="card max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold mb-6">快速开始</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">输入文章标题</h3>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入您的文章标题..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">目标关键词</h3>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="请输入目标关键词..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">文章内容（可选）</h3>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请粘贴您的文章内容..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleQuickAnalysis}
              disabled={(!title.trim() && !content.trim()) || isAnalyzing}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium px-8 py-3 text-lg rounded-lg transition-colors duration-200"
            >
              {isAnalyzing ? '分析中...' : '开始分析优化'}
            </button>
          </div>
        </div>

        {/* 快速分析结果 */}
        {(titleResult || contentResult) && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">分析结果</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {titleResult && (
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4">标题分析结果</h3>
                  <div className="text-center mb-4">
                    <div className={`text-3xl font-bold mb-2 ${
                      titleResult.score >= 80 ? 'text-green-600' :
                      titleResult.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {titleResult.score}
                    </div>
                    <div className="text-sm text-gray-600">标题评分</div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-900">📏 长度: {titleResult.length} 字符</div>
                      <div className="text-blue-700">关键词覆盖: {titleResult.keywordDensity.toFixed(1)}%</div>
                    </div>
                    
                    {titleResult.suggestions.length > 0 && (
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="font-medium text-yellow-900 mb-1">💡 建议</div>
                        <div className="text-yellow-700">{titleResult.suggestions[0]}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <Link href="/optimizer" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      查看详细分析 →
                    </Link>
                  </div>
                </div>
              )}

              {contentResult && (
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4">内容分析结果</h3>
                  <div className="text-center mb-4">
                    <div className={`text-3xl font-bold mb-2 ${
                      contentResult.score >= 80 ? 'text-green-600' :
                      contentResult.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {contentResult.score}
                    </div>
                    <div className="text-sm text-gray-600">内容评分</div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-900">📝 字数: {contentResult.wordCount}</div>
                      <div className="text-green-700">关键词: {contentResult.keywords.length} 个</div>
                    </div>
                    
                    {contentResult.suggestions.length > 0 && (
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="font-medium text-yellow-900 mb-1">💡 建议</div>
                        <div className="text-yellow-700">{contentResult.suggestions[0]}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <Link href="/analyzer" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      查看详细分析 →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 特性介绍 */}
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">核心特性</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2">精准分析</h3>
              <p className="text-gray-600 text-sm">基于微信搜一搜算法的精准SEO分析</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">快速优化</h3>
              <p className="text-gray-600 text-sm">一键生成多个优化版本供您选择</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold mb-2">数据驱动</h3>
              <p className="text-gray-600 text-sm">提供详细的数据分析和评分系统</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-semibold mb-2">提升排名</h3>
              <p className="text-gray-600 text-sm">帮助您的内容在搜一搜中获得更好排名</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}