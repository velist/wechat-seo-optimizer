export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">微信SEO工具</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              专业的微信公众号搜一搜流量优化工具，帮助您的内容获得更多曝光和流量。
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">核心功能</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>标题优化分析</li>
              <li>内容SEO评分</li>
              <li>关键词研究</li>
              <li>竞品分析</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">使用指南</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>快速上手教程</li>
              <li>优化技巧分享</li>
              <li>常见问题解答</li>
              <li>最佳实践案例</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">联系我们</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>技术支持</li>
              <li>功能建议</li>
              <li>合作咨询</li>
              <li>用户反馈</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 微信SEO优化工具. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  )
}