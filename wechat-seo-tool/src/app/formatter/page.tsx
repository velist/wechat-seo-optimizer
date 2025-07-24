'use client'

import { useState } from 'react'
import { FormattingOptions, FormattedContent } from '@/types'

// 预设主题样式
const THEMES = {
  default: {
    name: '默认风格',
    titleColor: '#1a1a1a',
    textColor: '#333333',
    accentColor: '#007bff',
    backgroundColor: '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  professional: {
    name: '商务专业',
    titleColor: '#2c3e50',
    textColor: '#34495e',
    accentColor: '#3498db',
    backgroundColor: '#ffffff',
    fontFamily: 'Georgia, serif'
  },
  creative: {
    name: '创意活泼',
    titleColor: '#e74c3c',
    textColor: '#2c3e50',
    accentColor: '#f39c12',
    backgroundColor: '#f8f9fa',
    fontFamily: 'Helvetica, sans-serif'
  },
  minimalist: {
    name: '极简风格',
    titleColor: '#212529',
    textColor: '#495057',
    accentColor: '#6c757d',
    backgroundColor: '#ffffff',
    fontFamily: 'Arial, sans-serif'
  }
}

// 预设样式模板
const STYLE_TEMPLATES = [
  {
    name: '标准文章',
    description: '适合大多数文章类型',
    fontSize: 16,
    lineHeight: 1.8,
    paragraphSpacing: 20,
    titleSize: 24
  },
  {
    name: '深度阅读',
    description: '适合长文和深度内容',
    fontSize: 17,
    lineHeight: 2.0,
    paragraphSpacing: 25,
    titleSize: 26
  },
  {
    name: '快速浏览',
    description: '适合列表和要点内容',
    fontSize: 15,
    lineHeight: 1.6,
    paragraphSpacing: 15,
    titleSize: 22
  },
  {
    name: '移动优先',
    description: '针对手机阅读优化',
    fontSize: 16,
    lineHeight: 1.7,
    paragraphSpacing: 18,
    titleSize: 20
  }
]

export default function ArticleFormatter() {
  const [content, setContent] = useState(`# 如何提升公众号文章的阅读体验

在信息爆炸的时代，读者的注意力越来越稀缺。一篇好的公众号文章，不仅要有优质的内容，更要有良好的排版和视觉呈现。

## 为什么排版很重要？

良好的排版能够：
- 提升读者的阅读体验
- 增加文章的专业感
- 提高内容的传播效果
- 降低读者的阅读疲劳

## 排版的基本原则

### 1. 层次分明
使用标题、副标题来构建清晰的内容层次，让读者能够快速抓住文章的重点。

### 2. 留白适当
适当的留白能够给读者视觉上的休息，避免密集的文字造成阅读压力。

### 3. 字体统一
保持字体风格的一致性，避免在一篇文章中使用过多不同的字体。

**记住**：好的排版是为内容服务的，不应该喧宾夺主。

> 优秀的设计是显而易见的，卓越的设计是透明的。

希望这些建议能够帮助你创作出更具吸引力的公众号文章！`)

  const [selectedTheme, setSelectedTheme] = useState<keyof typeof THEMES>('default')
  const [selectedTemplate, setSelectedTemplate] = useState(0)
  const [customOptions, setCustomOptions] = useState<FormattingOptions>({
    fontSize: 'medium',
    lineSpacing: 1.8,
    paragraphSpacing: 20,
    titleStyle: 'bold',
    highlightColor: '#007bff',
    theme: 'default'
  })

  // 应用样式模板
  const applyTemplate = (templateIndex: number) => {
    const template = STYLE_TEMPLATES[templateIndex]
    setSelectedTemplate(templateIndex)
    setCustomOptions(prev => ({
      ...prev,
      lineSpacing: template.lineHeight,
      paragraphSpacing: template.paragraphSpacing
    }))
  }

  // 生成CSS样式
  const generateCSS = () => {
    const theme = THEMES[selectedTheme]
    const template = STYLE_TEMPLATES[selectedTemplate]
    
    return `
.article-content {
  font-family: ${theme.fontFamily};
  color: ${theme.textColor};
  background-color: ${theme.backgroundColor};
  line-height: ${customOptions.lineSpacing};
  font-size: ${template.fontSize}px;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.article-content h1 {
  color: ${theme.titleColor};
  font-size: ${template.titleSize}px;
  font-weight: bold;
  margin: 30px 0 20px 0;
  text-align: center;
  border-bottom: 2px solid ${theme.accentColor};
  padding-bottom: 10px;
}

.article-content h2 {
  color: ${theme.titleColor};
  font-size: ${template.titleSize - 4}px;
  font-weight: bold;
  margin: 25px 0 15px 0;
  padding-left: 10px;
  border-left: 4px solid ${theme.accentColor};
}

.article-content h3 {
  color: ${theme.titleColor};
  font-size: ${template.titleSize - 6}px;
  font-weight: bold;
  margin: 20px 0 10px 0;
}

.article-content p {
  margin-bottom: ${customOptions.paragraphSpacing}px;
  text-align: justify;
}

.article-content ul, .article-content ol {
  margin: 15px 0;
  padding-left: 25px;
}

.article-content li {
  margin-bottom: 8px;
}

.article-content strong {
  color: ${theme.accentColor};
  font-weight: bold;
}

.article-content blockquote {
  border-left: 4px solid ${theme.accentColor};
  background-color: ${theme.backgroundColor === '#ffffff' ? '#f8f9fa' : '#ffffff'};
  margin: 20px 0;
  padding: 15px 20px;
  font-style: italic;
  color: ${theme.textColor};
}

.article-content code {
  background-color: #f1f3f4;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: ${template.fontSize - 1}px;
}
    `.trim()
  }

  // 将Markdown转换为HTML
  const convertToHTML = (markdown: string) => {
    return markdown
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.+)$/gm, '<p>$1</p>')
      .replace(/<p><h/g, '<h')
      .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
      .replace(/<p><ul>/g, '<ul>')
      .replace(/<\/ul><\/p>/g, '</ul>')
      .replace(/<p><blockquote>/g, '<blockquote>')
      .replace(/<\/blockquote><\/p>/g, '</blockquote>')
  }

  const formattedHTML = convertToHTML(content)
  const css = generateCSS()

  // 复制格式化内容
  const copyFormattedContent = (type: 'html' | 'css' | 'all') => {
    let textToCopy = ''
    
    switch (type) {
      case 'html':
        textToCopy = `<div class="article-content">\n${formattedHTML}\n</div>`
        break
      case 'css':
        textToCopy = css
        break
      case 'all':
        textToCopy = `<style>\n${css}\n</style>\n\n<div class="article-content">\n${formattedHTML}\n</div>`
        break
    }
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('已复制到剪贴板！')
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">排版美化工具</h1>
            <p className="text-gray-600">专业的公众号文章格式化工具，一键生成美观的文章样式</p>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 左侧：编辑区 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 内容编辑 */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">📝 内容编辑</h2>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  placeholder="在此输入或粘贴您的文章内容，支持Markdown格式..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                />
                <div className="mt-3 text-xs text-gray-500">
                  支持Markdown语法：# 标题、**粗体**、*斜体*、&gt; 引用、- 列表
                </div>
              </div>

              {/* 样式模板 */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">🎨 样式模板</h2>
                <div className="grid grid-cols-1 gap-3">
                  {STYLE_TEMPLATES.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => applyTemplate(index)}
                      className={`p-3 text-left border rounded-lg transition-colors ${
                        selectedTemplate === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{template.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{template.description}</div>
                      <div className="text-xs text-gray-500 mt-2">
                        字号: {template.fontSize}px | 行高: {template.lineHeight}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 主题选择 */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">🎭 主题风格</h2>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(THEMES).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTheme(key as keyof typeof THEMES)}
                      className={`p-3 text-left border rounded-lg transition-colors ${
                        selectedTheme === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{theme.name}</span>
                        <div className="flex space-x-1">
                          <div 
                            className="w-4 h-4 rounded-full border" 
                            style={{ backgroundColor: theme.titleColor }}
                          ></div>
                          <div 
                            className="w-4 h-4 rounded-full border" 
                            style={{ backgroundColor: theme.accentColor }}
                          ></div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧：预览区 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 预览窗口 */}
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">👀 实时预览</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyFormattedContent('html')}
                      className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      复制HTML
                    </button>
                    <button
                      onClick={() => copyFormattedContent('css')}
                      className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      复制CSS
                    </button>
                    <button
                      onClick={() => copyFormattedContent('all')}
                      className="text-sm bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
                    >
                      复制全部
                    </button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600 border-b">
                    预览效果 - 点击右上角按钮复制代码到公众号编辑器
                  </div>
                  <div className="p-4 bg-white max-h-96 overflow-y-auto">
                    <style dangerouslySetInnerHTML={{ __html: css }} />
                    <div 
                      className="article-content"
                      dangerouslySetInnerHTML={{ __html: formattedHTML }}
                    />
                  </div>
                </div>
              </div>

              {/* 使用说明 */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">📖 使用说明</h2>
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-start space-x-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">1</span>
                    <div>
                      <div className="font-medium text-gray-900">编辑内容</div>
                      <div>在左侧文本框中输入或粘贴您的文章内容，支持Markdown语法</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">2</span>
                    <div>
                      <div className="font-medium text-gray-900">选择样式</div>
                      <div>从预设的样式模板中选择适合您内容的排版风格</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">3</span>
                    <div>
                      <div className="font-medium text-gray-900">选择主题</div>
                      <div>选择符合您品牌调性的颜色主题</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">4</span>
                    <div>
                      <div className="font-medium text-gray-900">复制代码</div>
                      <div>点击"复制全部"获取完整的HTML+CSS代码，粘贴到公众号编辑器的代码模式中</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-yellow-800">
                    <span>💡</span>
                    <span className="font-medium">小贴士</span>
                  </div>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="space-y-1">
                      <li>• 建议在公众号编辑器中先切换到"代码模式"再粘贴</li>
                      <li>• 粘贴后可以切回可视化模式继续编辑</li>
                      <li>• 不同的公众号编辑器可能会有样式差异，请根据实际效果微调</li>
                      <li>• 建议保存常用的CSS样式，方便重复使用</li>
                    </ul>
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