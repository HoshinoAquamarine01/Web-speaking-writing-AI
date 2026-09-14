import React from 'react';
import type { WritingChartData } from '../types';
import { BarChart3, Table as TableIcon } from 'lucide-react';

interface WritingChartProps {
  chartData: WritingChartData;
}

const DEFAULT_COLORS = [
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899'  // pink
];

export const WritingChart: React.FC<WritingChartProps> = ({ chartData }) => {
  const { chartTitle, unit, categories, series } = chartData;

  // Find max value for bar height scaling
  const allValues = series.flatMap((s) => s.values);
  const maxValue = Math.max(...allValues, 10);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 my-4 space-y-5 shadow-xl">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          <h4 className="font-bold text-sm text-white">{chartTitle}</h4>
        </div>
        <span className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1 rounded-full border border-slate-800 self-start sm:self-auto">
          Đơn vị: <strong className="text-purple-300">{unit}</strong>
        </span>
      </div>

      {/* Visual Bar Chart Render */}
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-1 gap-4">
          {categories.map((cat, catIdx) => (
            <div key={catIdx} className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
              <div className="text-xs font-extrabold text-slate-300 mb-2.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span>Mốc / Hạng mục: <strong className="text-white">{cat}</strong></span>
              </div>

              <div className="space-y-2.5">
                {series.map((s, sIdx) => {
                  const val = s.values[catIdx] ?? 0;
                  const percentage = Math.min(Math.round((val / maxValue) * 100), 100);
                  const barColor = s.color || DEFAULT_COLORS[sIdx % DEFAULT_COLORS.length];

                  return (
                    <div key={sIdx} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300 font-medium">{s.name}</span>
                        <span className="font-bold text-white">{val} {unit}</span>
                      </div>
                      <div className="h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                        <div
                          className="h-full rounded-full transition-all duration-500 shadow-sm"
                          style={{
                            width: `${Math.max(percentage, 4)}%`,
                            backgroundColor: barColor
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Table View */}
      <div className="pt-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
          <TableIcon className="w-4 h-4 text-indigo-400" /> Bảng Số Liệu Chi Tiết (Data Summary):
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900 text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Đối tượng / Hạng mục</th>
                {categories.map((cat, idx) => (
                  <th key={idx} className="px-4 py-3 text-center">{cat}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
              {series.map((s, sIdx) => (
                <tr key={sIdx} className="hover:bg-slate-900/40">
                  <td className="px-4 py-2.5 font-bold text-purple-300 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: s.color || DEFAULT_COLORS[sIdx % DEFAULT_COLORS.length] }}
                    ></span>
                    {s.name}
                  </td>
                  {s.values.map((v, vIdx) => (
                    <td key={vIdx} className="px-4 py-2.5 text-center font-bold">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
