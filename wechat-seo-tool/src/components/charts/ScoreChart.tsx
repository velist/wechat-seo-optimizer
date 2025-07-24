'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface ScoreChartProps {
  score: number
  title: string
  subtitle?: string
}

export default function ScoreChart({ score, title, subtitle }: ScoreChartProps) {
  const data = [
    { name: '已获得分数', value: score, color: '#3b82f6' },
    { name: '待提升空间', value: 100 - score, color: '#e5e7eb' }
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981' // green-500
    if (score >= 60) return '#f59e0b' // amber-500
    return '#ef4444' // red-500
  }

  const scoreColor = getScoreColor(score)

  // 更新数据颜色
  data[0].color = scoreColor

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      
      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%" 
              innerRadius={50}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        
        {/* 中心显示分数 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div 
              className="text-3xl font-bold"
              style={{ color: scoreColor }}
            >
              {score}
            </div>
            <div className="text-sm text-gray-500">分</div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-center space-x-6">
        <div className="flex items-center text-sm">
          <div 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: scoreColor }}
          ></div>
          <span className="text-gray-600">当前得分</span>
        </div>
        <div className="flex items-center text-sm">
          <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
          <span className="text-gray-600">提升空间</span>
        </div>
      </div>
    </div>
  )
}