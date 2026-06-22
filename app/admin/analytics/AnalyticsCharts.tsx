'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'

const COLORS = ['#F97316', '#16A34A', '#C2410C', '#3B82F6', '#A855F7', '#DC2626']

export default function AnalyticsCharts({
  revenue,
  statusData,
}: {
  revenue: { m: string; r: number }[]
  statusData: { name: string; value: number }[]
}) {
  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-lg font-bold">Monthly Revenue</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer>
            <BarChart data={revenue}>
              <XAxis dataKey="m" stroke="#78716C" />
              <YAxis stroke="#78716C" />
              <Tooltip />
              <Bar dataKey="r" fill="#F97316" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-lg font-bold">Order Status Mix</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}
