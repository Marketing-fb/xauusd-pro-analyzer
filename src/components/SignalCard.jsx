import React from 'react';
import { Target, ShieldAlert, ArrowUpRight, ArrowDownRight, CheckCircle2, AlertTriangle, Zap, Award } from 'lucide-react';

export default function SignalCard({ signalData }) {
  if (!signalData) return null;

  const isBuy = signalData.signal.includes('BUY');
  const isSell = signalData.signal.includes('SELL');
  const isNeutral = signalData.signal === 'NEUTRAL';

  const badgeClass = isBuy
    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/25 border-emerald-400'
    : isSell
    ? 'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-lg shadow-rose-500/25 border-rose-400'
    : 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white shadow-lg shadow-amber-500/25 border-amber-400';

  return (
    <div className={`glass-panel p-5 ${
      isBuy ? 'glass-panel-glow-bull' : isSell ? 'glass-panel-glow-bear' : 'glass-panel-glow-gold'
    }`}>
      {/* Header Signal Badge */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> AI Confluence Signal Engine
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            {signalData.symbol} Signal
          </h2>
        </div>

        <div className={`px-4 py-2 rounded-xl font-black text-sm tracking-wider flex items-center gap-1.5 border border-white/20 animate-pulse-glow ${badgeClass}`}>
          {isBuy && <ArrowUpRight className="w-5 h-5" />}
          {isSell && <ArrowDownRight className="w-5 h-5" />}
          {signalData.signal}
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="bg-gray-900/80 p-3 rounded-xl border border-gray-800 mb-4">
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="text-gray-400 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" /> AI Confidence Score
          </span>
          <span className="font-extrabold text-amber-300">{signalData.confidence}%</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isBuy ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : isSell ? 'bg-gradient-to-r from-rose-500 to-red-400' : 'bg-amber-500'
            }`}
            style={{ width: `${signalData.confidence}%` }}
          />
        </div>
      </div>

      {/* Recommended Trade Plan Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Entry Price */}
        <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
          <span className="text-[11px] text-gray-400 block mb-0.5">ราคาเข้าเทรด (Entry)</span>
          <span className="text-base font-mono font-bold text-amber-400">{signalData.entry_price}</span>
        </div>

        {/* Stop Loss (SL) */}
        <div className="bg-gray-900/60 p-3 rounded-xl border border-rose-900/40">
          <span className="text-[11px] text-rose-400 flex items-center gap-1 mb-0.5">
            <ShieldAlert className="w-3 h-3" /> Stop Loss (SL)
          </span>
          <span className="text-base font-mono font-bold text-rose-300">{signalData.sl}</span>
        </div>

        {/* Take Profit 1 */}
        <div className="bg-gray-900/60 p-3 rounded-xl border border-emerald-900/30">
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mb-0.5">
            <Target className="w-3 h-3" /> Take Profit 1 (TP1)
          </span>
          <span className="text-base font-mono font-bold text-emerald-300">{signalData.tp1}</span>
        </div>

        {/* Take Profit 2 */}
        <div className="bg-gray-900/60 p-3 rounded-xl border border-emerald-900/30">
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mb-0.5">
            <Target className="w-3 h-3" /> Take Profit 2 (TP2)
          </span>
          <span className="text-base font-mono font-bold text-emerald-300">{signalData.tp2}</span>
        </div>
      </div>

      {/* R:R Ratio & ATR */}
      <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg text-xs mb-4">
        <span className="text-amber-300 font-semibold">Risk : Reward Ratio:</span>
        <span className="font-mono font-extrabold text-white text-sm">{signalData.rr_ratio}</span>
      </div>

      {/* Confluence Checklists */}
      <div>
        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
          ปัจจัยการยืนยันสัญญาณ (Confluence Factors)
        </h4>
        <div className="space-y-1.5">
          {signalData.confluence_reasons?.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-gray-300 bg-gray-950/40 p-2 rounded-lg border border-gray-800/50">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
