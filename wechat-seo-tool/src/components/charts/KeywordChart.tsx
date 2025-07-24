'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface KeywordData {
  keyword: string
  density: number
  frequency: number
  target?: number // 目标密度
}

interface KeywordChartProps {
  data: KeywordData[]
  title: string
}

export default function KeywordChart({ data, title }: KeywordChartProps) {
  // 限制显示前10个关键词
  const chartData = data.slice(0, 10).map(item => ({
    ...item,
    density: Number(item.density.toFixed(2)),
    target: item.target || 3 // 默认目标密度3%
  }))

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">关键词密度分布（理想密度: 2-5%）</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="keyword" 
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={12}
          />
          <YAxis 
            label={{ value: '密度 (%)', angle: -90, position: 'insideLeft' }}
            fontSize={12}
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'density') return [`${value}%`, '当前密度']
              if (name === 'target') return [`${value}%`, '目标密度']
              if (name === 'frequency') return [value, '出现次数']
              return [value, name]
            }}
          />
          <Legend />
          <Bar 
            dataKey="density" 
            fill="#3b82f6" 
            name="当前密度"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="target" 
            fill="#10b981" 
            name="目标密度" 
            opacity={0.6}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div className="text-center p-2 bg-blue-50 rounded">
          <div className="font-semibold text-blue-900">总关键词</div>
          <div className="text-blue-700">{data.length} 个</div>
        </div>
        <div className="text-center p-2 bg-green-50 rounded">
          <div className="font-semibold text-green-900">理想密度</div>
          <div className="text-green-700">{data.filter(d => d.density >= 2 && d.density <= 5).length} 个</div>
        </div>
        <div className="text-center p-2 bg-yellow-50 rounded">
          <div className="font-semibold text-yellow-900">密度过低</div>
          <div className="text-yellow-700">{data.filter(d => d.density < 2).length} 个</div>
        </div>
        <div className="text-center p-2 bg-red-50 rounded">
          <div className="font-semibold text-red-900">密度过高</div>
          <div className="text-red-700">{data.filter(d => d.density > 5).length} 个</div>
        </div>
      </div>
    </div>
  )
}