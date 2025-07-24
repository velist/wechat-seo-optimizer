export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          微信SEO工具测试页面
        </h1>
        <p className="text-gray-700 mb-4">
          如果您能看到这个页面，说明服务器正在正常运行！
        </p>
        <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
          <p className="text-blue-800">
            ✅ Next.js 应用已成功启动<br/>
            ✅ Tailwind CSS 样式正常加载<br/>
            ✅ TypeScript 编译成功
          </p>
        </div>
        <div className="mt-6">
          <a 
            href="/" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            访问主页
          </a>
        </div>
      </div>
    </div>
  )
}