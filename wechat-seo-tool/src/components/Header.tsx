'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: '首页', href: '/' },
  { name: '标题优化', href: '/optimizer' },
  { name: '内容分析', href: '/analyzer' },
  { name: '关键词研究', href: '/keywords' },
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
          
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {item.name}
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