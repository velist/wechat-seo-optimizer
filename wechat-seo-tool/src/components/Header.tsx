'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: '首页', href: '/', icon: '🏠' },
  { name: '标题优化', href: '/optimizer', icon: '📝' },
  { name: '内容分析', href: '/analyzer', icon: '📊' },
  { name: '关键词研究', href: '/keywords', icon: '🔍' },
  { name: '热点追踪', href: '/trending', icon: '🔥' },
  { name: '排版美化', href: '/formatter', icon: '🎨' },
  { name: '数据分析', href: '/analytics', icon: '📈' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              微信SEO工具
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button className="btn-secondary text-sm">
              使用教程
            </button>
            <button className="btn-primary text-sm">
              立即体验
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}