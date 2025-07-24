'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface TrendData {
  date: string
  score: number
  views?: number
  engagement?: number
}

interface TrendChartProps {
  data: TrendData[]
  title: string
  subtitle?: string
}

export default function TrendChart({ data, title, subtitle }: TrendChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            fontSize={12}
          />
          <YAxis fontSize={12} />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'score') return [`${value}分`, 'SEO评分']
              if (name === 'views') return [`${value}`, '浏览量']
              if (name === 'engagement') return [`${value}%`, '互动率']
              return [value, name]
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            name="SEO评分"
          />
          {data.some(d => d.views !== undefined) && (
            <Line 
              type="monotone" 
              dataKey="views" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              name="浏览量"
              yAxisId="right"
            />
          )}
          {data.some(d => d.engagement !== undefined) && (
            <Line 
              type="monotone" 
              dataKey="engagement" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
              name="互动率"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="font-semibold text-blue-900">平均评分</div>
          <div className="text-xl font-bold text-blue-700">
            {(data.reduce((sum, d) => sum + d.score, 0) / data.length).toFixed(1)}
          </div>
        </div>
        
        {data.some(d => d.views !== undefined) && (
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="font-semibold text-green-900">总浏览量</div>
            <div className="text-xl font-bold text-green-700">
              {data.reduce((sum, d) => sum + (d.views || 0), 0).toLocaleString()}
            </div>
          </div>
        )}
        
        {data.some(d => d.engagement !== undefined) && (
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="font-semibold text-yellow-900">平均互动率</div>
            <div className="text-xl font-bold text-yellow-700">
              {(data.reduce((sum, d) => sum + (d.engagement || 0), 0) / data.length).toFixed(1)}%
            </div>
          </div>
        )}
      </div>
    </div>
  )
}