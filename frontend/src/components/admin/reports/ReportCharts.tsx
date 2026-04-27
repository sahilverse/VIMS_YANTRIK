import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { ReportDataPoint } from '@/types';

interface ReportChartsProps {
  data: ReportDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-950 text-white p-4 rounded-xl shadow-xl border border-zinc-800">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-6 mt-1">
            <span className="text-sm font-medium flex items-center gap-2">
              <span 
                className="w-2 h-2 rounded-full block" 
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}
            </span>
            <span className="text-sm font-bold tracking-tight">Rs. {entry.value.toFixed(2)}</span>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t border-zinc-800 flex items-center justify-between gap-6">
          <span className="text-sm font-medium text-zinc-300">Net Profit</span>
          <span className="text-sm font-bold tracking-tight text-emerald-400">
            Rs. {(payload[0].value - payload[1].value).toFixed(2)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function ReportCharts({ data }: ReportChartsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 w-full flex items-center justify-center bg-zinc-50 rounded-3xl border border-zinc-100">
        <p className="text-sm font-bold text-zinc-400">No chart data available for this period.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Area Chart for Trend */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
        <div className="mb-6">
          <h3 className="text-sm font-extrabold tracking-tight">Financial Trend</h3>
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Revenue vs Expense over time</p>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#71717a', fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#71717a', fontWeight: 600 }}
                tickFormatter={(value) => `Rs.${value}`}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingTop: '20px' }} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                name="Revenue" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                name="Expenses" 
                stroke="#ef4444" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorExpense)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#ef4444' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart for Comparison */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
        <div className="mb-6">
          <h3 className="text-sm font-extrabold tracking-tight">Period Comparison</h3>
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Side-by-side breakdown</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#71717a', fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#71717a', fontWeight: 600 }}
                tickFormatter={(value) => `Rs.${value}`}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f4f4f5', opacity: 0.4 }} />
              <Bar dataKey="revenue" name="Revenue" fill="#18181b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expenses" fill="#a1a1aa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
