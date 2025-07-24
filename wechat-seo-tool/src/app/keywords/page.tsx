export default function KeywordsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">关键词研究</h1>
          <p className="text-gray-600">发现热门关键词，分析竞争情况，提升您的搜索排名</p>
        </header>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">1,250</div>
            <div className="text-sm text-gray-600">热门关键词</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">320</div>
            <div className="text-sm text-gray-600">低竞争词</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-2">580</div>
            <div className="text-sm text-gray-600">长尾关键词</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">95%</div>
            <div className="text-sm text-gray-600">覆盖率</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">关键词搜索</h2>
                <div className="flex space-x-2">
                  <button className="btn-secondary text-sm">导出</button>
                  <button className="btn-primary text-sm">刷新数据</button>
                </div>
              </div>
              
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="输入种子关键词进行研究..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">关键词</th>
                      <th className="text-left py-3 px-4">搜索量</th>
                      <th className="text-left py-3 px-4">竞争度</th>
                      <th className="text-left py-3 px-4">难度</th>
                      <th className="text-left py-3 px-4">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">微信公众号运营</td>
                      <td className="py-3 px-4">8,900</td>
                      <td className="py-3 px-4">
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">高</span>
                      </td>
                      <td className="py-3 px-4">75</td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 text-xs">
                          分析
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">公众号SEO优化</td>
                      <td className="py-3 px-4">2,400</td>
                      <td className="py-3 px-4">
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">中</span>
                      </td>
                      <td className="py-3 px-4">45</td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 text-xs">
                          分析
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">微信搜一搜排名</td>
                      <td className="py-3 px-4">1,200</td>
                      <td className="py-3 px-4">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">低</span>
                      </td>
                      <td className="py-3 px-4">25</td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 text-xs">
                          分析
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <div className="card mb-6">
              <h2 className="text-xl font-semibold mb-4">搜索趋势</h2>
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">趋势图表将在这里显示</span>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4">推荐关键词</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                  <span>公众号涨粉技巧</span>
                  <span className="text-green-600 font-medium">+25%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                  <span>微信文章写作</span>
                  <span className="text-green-600 font-medium">+18%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                  <span>内容营销策略</span>
                  <span className="text-green-600 font-medium">+12%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                  <span>用户增长方法</span>
                  <span className="text-green-600 font-medium">+8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}