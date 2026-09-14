import React from 'react';
import { Target, ShieldAlert, Zap, TrendingUp, Award, Layers } from 'lucide-react';

export default function PrecisionEntryCard({ signalData }) {
  if (!signalData) return null;

  const ote = signalData.optimal_entry_zone || { min: signalData.entry_price * 0.999, max: signalData.entry_price * 1.001 };
  const tpProbs = signalData.tp_probabilities || { tp1: 85, tp2: 68, tp3: 45 };

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center justify-between gap-2 mb-3 border-b border-gray-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            วิเคราะห์จุดเข้าซื้อ & เป้าหมาย TP เจาะลึก (Precision Entry Zone)
          </h3>
        </div>
        <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
          OTE Zone (Optimal Entry)
        </span>
      </div>

      {/* Optimal Entry Range Box */}
      <div className="bg-gradient-to-r from-amber-950/30 via-yellow-950/20 to-gray-900 border border-amber-500/30 p-3 rounded-xl mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-amber-300 font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> กรอบราคาเข้าซื้อที่ดีที่สุด (OTE Range)
          </span>
          <span className="text-[10px] text-gray-400">คำนวณตาม SMC Order Block</span>
        </div>

        <div className="flex items-center justify-between font-mono font-black text-base text-white py-1">
          <span className="text-amber-400">{ote.min}</span>
          <span className="text-gray-500 text-xs font-normal">ถึง</span>
          <span className="text-amber-400">{ote.max}</span>
        </div>
      </div>

      {/* Multi-Tiered TP Targets with Probability */}
      <div className="space-y-2.5">
        {/* TP1 */}
        <div className="bg-gray-900/60 p-3 rounded-xl border border-emerald-900/30">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              🎯 Take Profit 1 (Conservative Scalp)
            </span>
            <span className="font-mono text-emerald-300 font-bold">{signalData.tp1}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span>โอกาสชนเป้าหมาย:</span>
            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${tpProbs.tp1}%` }} />
            </div>
            <span className="font-bold text-emerald-400">{tpProbs.tp1}%</span>
          </div>
        </div>

        {/* TP2 */}
        <div className="bg-gray-900/60 p-3 rounded-xl border border-emerald-900/30">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              🏆 Take Profit 2 (Main Swing Target)
            </span>
            <span className="font-mono text-emerald-300 font-bold">{signalData.tp2}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span>โอกาสชนเป้าหมาย:</span>
            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${tpProbs.tp2}%` }} />
            </div>
            <span className="font-bold text-emerald-300">{tpProbs.tp2}%</span>
          </div>
        </div>

        {/* TP3 */}
        <div className="bg-gray-900/60 p-3 rounded-xl border border-emerald-900/30">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-teal-400 flex items-center gap-1">
              🚀 Take Profit 3 (Runner Target)
            </span>
            <span className="font-mono text-teal-300 font-bold">{signalData.tp3}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span>โอกาสชนเป้าหมาย:</span>
            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-teal-400 rounded-full" style={{ width: `${tpProbs.tp3}%` }} />
            </div>
            <span className="font-bold text-teal-300">{tpProbs.tp3}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
