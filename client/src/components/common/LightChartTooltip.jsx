import React from 'react';

export const LightPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    const name = item.name;
    const value = item.value;
    const color = name === 'Pass' || name === 'Correct' ? '#16A34A' : (name === 'Fail' || name === 'Wrong' ? '#DC2626' : '#64748B');

    return (
      <div className="bg-white border border-gray-200 p-3.5 rounded-xl shadow-xl z-50 min-w-[150px] transition-all duration-150 pointer-events-none text-left">
        <div className="text-sm font-semibold text-gray-900 mb-2 border-b border-gray-100 pb-1 flex items-center justify-between gap-4">
          <span>{name} Breakdown</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="font-medium text-gray-700">{name}</span>
          </div>
          <span className="font-bold text-gray-900">{value}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const LightLineTooltip = ({ active, payload, label, title = 'Performance Trend', valueSuffix = '%' }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;

    return (
      <div className="bg-white border border-gray-200 p-3.5 rounded-xl shadow-xl z-50 min-w-[160px] transition-all duration-150 pointer-events-none text-left">
        <div className="flex items-center justify-between gap-3 mb-1.5 border-b border-gray-100 pb-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {label}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Live
          </span>
        </div>
        <div className="text-2xl font-black text-gray-900 tracking-tight">
          {value}{valueSuffix}
        </div>
        <div className="text-xs font-semibold text-gray-500 mt-0.5">
          {title}
        </div>
      </div>
    );
  }
  return null;
};

export default LightPieTooltip;
