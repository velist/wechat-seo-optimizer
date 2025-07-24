'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface MetricData {
  category: string
  value: number
  maxValue: number
  description: string
}

interface MetricsChartProps {
  data: MetricData[]
  title: string
}

export default function MetricsChart({ data, title }: MetricsChartProps) {
  // 转换数据为图表格式
  const chartData = data.map((item, index) => ({
    name: item.category,
    value: item.value,
    percentage: (item.value / item.maxValue) * 100,
    index
  }))

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">各维度表现评估</p>
      </div>
      
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            fontSize={12}
            angle={-15}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            domain={[0, 100]}
            fontSize={12}
            label={{ value: '得分 (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value) => [`${Number(value).toFixed(1)}%`, '完成度']}
          />
          <Area 
            type="monotone" 
            dataKey="percentage" 
            stroke="#3b82f6" 
            fill="#3b82f6"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="mt-6 space-y-3">
        {data.map((item, index) => {
          const percentage = (item.value / item.maxValue) * 100
          const getColor = (pct: number) => {
            if (pct >= 80) return 'bg-green-500'
            if (pct >= 60) return 'bg-yellow-500'  
            return 'bg-red-500'
          }
          
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">{item.category}</span>
                  <span className="text-sm text-gray-600">{item.value}/{item.maxValue}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getColor(percentage)}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="font-semibold text-green-900">优秀</div>
          <div className="text-green-700">
            {data.filter(d => (d.value / d.maxValue) >= 0.8).length} 项
          </div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="font-semibold text-yellow-900">良好</div>
          <div className="text-yellow-700">
            {data.filter(d => {
              const pct = d.value / d.maxValue
              return pct >= 0.6 && pct < 0.8
            }).length} 项
          </div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="font-semibold text-red-900">待改进</div>
          <div className="text-red-700">
            {data.filter(d => (d.value / d.maxValue) < 0.6).length} 项
          </div>
        </div>
      </div>
    </div>
  )
}