import React from 'react';
import { Calendar, Globe, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function EconomicNews({ newsData }) {
  if (!newsData || !newsData.events) return null;

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Economic Calendar & News Sentiment (USD / Gold)
          </h3>
        </div>
        <span className="text-[10px] text-gray-400 bg-gray-900 border border-gray-800 px-2 py-0.5 rounded">
          Updated: {newsData.updated_at?.split(' ')[1] || 'Real-time'}
        </span>
      </div>

      {/* Sentiment Overview Box */}
      <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div>
          <span className="text-gray-400 block mb-0.5">ภาพรวม Sentiment ราคาทองคำ:</span>
          <span className="font-bold text-amber-300">{newsData.overall_gold_sentiment}</span>
        </div>
        <div className="sm:text-right">
          <span className="text-gray-400 block mb-0.5">ดัชนี US Dollar Index (DXY):</span>
          <span className="font-bold text-cyan-300">{newsData.usd_index_bias}</span>
        </div>
      </div>

      {/* Events Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 font-semibold">
              <th className="pb-2">เวลา</th>
              <th className="pb-2">สกุลเงิน</th>
              <th className="pb-2">เหตุการณ์เศรษฐกิจ</th>
              <th className="pb-2">ผลกระทบ</th>
              <th className="pb-2 text-right">คาดการณ์ / ก่อนหน้า</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {newsData.events.map((evt) => {
              const isHigh = evt.impact === 'HIGH';
              return (
                <tr key={evt.id} className="hover:bg-gray-900/40 transition-colors">
                  <td className="py-2.5 font-mono text-gray-300">{evt.time}</td>
                  <td className="py-2.5">
                    <span className="px-1.5 py-0.5 bg-gray-800 text-amber-300 font-bold rounded text-[10px]">
                      {evt.currency}
                    </span>
                  </td>
                  <td className="py-2.5 font-medium text-white">{evt.event}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isHigh ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {evt.impact}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-mono text-gray-300">
                    {evt.forecast} <span className="text-gray-500">({evt.previous})</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
