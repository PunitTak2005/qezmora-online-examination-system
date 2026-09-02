import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const FULL_MONTH_NAMES_MAP = {
  Jan: 'January',
  Feb: 'February',
  Mar: 'March',
  Apr: 'April',
  May: 'May',
  Jun: 'June',
  Jul: 'July',
  Aug: 'August',
  Sep: 'September',
  Oct: 'October',
  Nov: 'November',
  Dec: 'December'
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const fullMonthName = FULL_MONTH_NAMES_MAP[label] || label;

    return (
      <div className="bg-white border border-gray-200 p-3.5 rounded-xl shadow-xl z-50 min-w-[160px] transition-all duration-150 pointer-events-none text-left">
        <div className="flex items-center justify-between gap-3 mb-1.5 border-b border-gray-100 pb-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {fullMonthName}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Live
          </span>
        </div>
        <div className="text-2xl font-black text-gray-900 tracking-tight">
          {value}%
        </div>
        <div className="text-xs font-semibold text-gray-500 mt-0.5">
          Average Score
        </div>
      </div>
    );
  }
  return null;
};

const PerformanceTrendChart = ({ data = [], dataKey = "score" }) => {
  return (
    <div className="w-full h-full min-h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#94A3B8" 
            opacity={0.2} 
            vertical={false} 
          />
          <XAxis 
            dataKey="month" 
            stroke="#6B7280" 
            tick={{ fontSize: 11, fontWeight: 700, fill: '#6B7280' }} 
            interval={0}
            axisLine={false}
            tickLine={false}
            dy={8}
          />
          <YAxis 
            stroke="#6B7280" 
            domain={[0, 100]} 
            tick={{ fontSize: 11, fill: '#6B7280' }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: '#0F5132', strokeWidth: 1.5, strokeDasharray: '4 4', opacity: 0.35 }} 
          />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke="#0F5132" 
            strokeWidth={2} 
            strokeOpacity={0.7}
            dot={{ fill: '#FFFFFF', stroke: '#0F5132', strokeWidth: 2, r: 4.5 }} 
            activeDot={{ fill: '#D4A017', stroke: '#0F5132', strokeWidth: 2, r: 6.5 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceTrendChart;
