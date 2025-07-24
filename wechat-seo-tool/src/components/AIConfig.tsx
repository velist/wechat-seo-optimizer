'use client'

import { useState, useEffect } from 'react'
import { aiService } from '@/lib/aiService'

interface AIConfigProps {
  onConfigChange?: (configured: boolean) => void
}

export default function AIConfig({ onConfigChange }: AIConfigProps) {
  const [apiKey, setApiKey] = useState('')
  const [isConfigured, setIsConfigured] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)
  const [showConfig, setShowConfig] = useState(false)

  useEffect(() => {
    // 检查本地存储的API Key
    const savedApiKey = localStorage.getItem('siliconflow_api_key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
      aiService.setApiKey(savedApiKey)
      setIsConfigured(true)
      onConfigChange?.(true)
    }
  }, [onConfigChange])

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      setTestResult('请输入有效的API Key')
      return
    }

    setIsLoading(true)
    setTestResult(null)

    try {
      // 设置API Key
      aiService.setApiKey(apiKey.trim())
      
      // 测试API连接
      await aiService.analyzeSEO({
        content: '测试内容',
        analysisType: 'seo'
      })

      // 保存到本地存储
      localStorage.setItem('siliconflow_api_key', apiKey.trim())
      setIsConfigured(true)
      setTestResult('✅ API配置成功！AI功能已启用')
      onConfigChange?.(true)
      
      // 3秒后隐藏配置面板
      setTimeout(() => setShowConfig(false), 3000)
    } catch (error) {
      console.error('API test failed:', error)
      setTestResult('❌ API配置失败，请检查API Key是否正确')
      setIsConfigured(false)
      onConfigChange?.(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveApiKey = () => {
    localStorage.removeItem('siliconflow_api_key')
    setApiKey('')
    setIsConfigured(false)
    setTestResult(null)
    onConfigChange?.(false)
  }

  if (!showConfig && isConfigured) {
    return (
      <div className="flex items-center space-x-2 text-sm">
        <div className="flex items-center text-green-600">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          AI已启用
        </div>
        <button
          onClick={() => setShowConfig(true)}
          className="text-blue-600 hover:text-blue-800 text-xs"
        >
          配置
        </button>
      </div>
    )
  }

  if (!showConfig && !isConfigured) {
    return (
      <button
        onClick={() => setShowConfig(true)}
        className="flex items-center space-x-2 text-sm text-orange-600 hover:text-orange-800 border border-orange-200 rounded-lg px-3 py-1 hover:bg-orange-50 transition-colors"
      >
        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
        <span>启用AI功能</span>
      </button>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">AI功能配置</h3>
        <button
          onClick={() => setShowConfig(false)}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            硅基流动 API Key
          </label>
          <div className="flex space-x-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="请输入您的硅基流动API Key"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              onClick={handleSaveApiKey}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white text-sm rounded-lg transition-colors"
            >
              {isLoading ? '测试中...' : '保存'}
            </button>
          </div>
        </div>

        {testResult && (
          <div className={`text-sm p-3 rounded-lg ${
            testResult.includes('✅') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {testResult}
          </div>
        )}

        {isConfigured && (
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-600">当前状态：AI功能已启用</span>
            <button
              onClick={handleRemoveApiKey}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              移除配置
            </button>
          </div>
        )}

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="mb-2"><strong>获取API Key：</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>访问 <a href="https://cloud.siliconflow.cn" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">硅基流动官网</a></li>
            <li>注册并登录账户</li>
            <li>在控制台中创建API Key</li>
            <li>将API Key粘贴到上方输入框</li>
          </ol>
          <p className="mt-2 text-xs">
            <strong>隐私说明：</strong>API Key仅存储在您的浏览器本地，不会上传到服务器。
          </p>
        </div>
      </div>
    </div>
  )
}