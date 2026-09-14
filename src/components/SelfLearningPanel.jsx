import React from 'react';
import { Brain, Award, AlertTriangle, TrendingUp, RefreshCw, CheckCircle2, Plus } from 'lucide-react';

export default function SelfLearningPanel({ learningStats, onOpenSimulator }) {
  if (!learningStats) return null;

  const { stats, history, error_causes, weights } = learningStats;

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center justify-between gap-2 mb-3 border-b border-gray-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              ระบบเรียนรู้จากความผิดพลาด (AI Self-Learning Engine)
            </h3>
            <p className="text-[10px] text-gray-400">เรียนรู้และปรับน้ำหนักความเชื่อมั่นอัตโนมัติจากผลการเทรด</p>
          </div>
        </div>

        <button
          onClick={onOpenSimulator}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> บันทึกผลเทรด (Feed AI)
        </button>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="bg-gray-900/60 p-2.5 rounded-xl border border-gray-800 text-center">
          <span className="text-[10px] text-gray-400 block mb-0.5">อัตราการชนะ (Win Rate)</span>
          <span className="text-lg font-mono font-black text-emerald-400">{stats?.win_rate || 75.0}%</span>
        </div>

        <div className="bg-gray-900/60 p-2.5 rounded-xl border border-gray-800 text-center">
          <span className="text-[10px] text-gray-400 block mb-0.5">จำนวนคำสั่งเทรดสะสม</span>
          <span className="text-lg font-mono font-black text-amber-400">{stats?.total_trades || 24} ออเดอร์</span>
        </div>

        <div className="bg-gray-900/60 p-2.5 rounded-xl border border-gray-800 text-center">
          <span className="text-[10px] text-gray-400 block mb-0.5">Profit Factor</span>
          <span className="text-lg font-mono font-black text-cyan-400">{stats?.profit_factor || 2.45}</span>
        </div>

        <div className="bg-gray-900/60 p-2.5 rounded-xl border border-gray-800 text-center">
          <span className="text-[10px] text-gray-400 block mb-0.5">อัตราส่วนกำไร (Win/Loss)</span>
          <span className="text-xs font-mono font-bold text-white mt-1 block">
            <span className="text-emerald-400">{stats?.wins || 18}W</span> / <span className="text-rose-400">{stats?.losses || 6}L</span>
          </span>
        </div>
      </div>

      {/* Adaptive Weights & Error Lessons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {/* Adaptive Weights */}
        <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800">
          <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-purple-400" /> ค่าน้ำหนัก Indicator ที่ AI ปรับสมดุลย์ (Adaptive Weights)
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="flex justify-between bg-gray-900/60 p-1.5 rounded border border-gray-800">
              <span className="text-gray-400">SMC Order Block:</span>
              <strong className="text-emerald-400">w = {weights?.smc_ob || 1.8}</strong>
            </div>
            <div className="flex justify-between bg-gray-900/60 p-1.5 rounded border border-gray-800">
              <span className="text-gray-400">EMA Trend:</span>
              <strong className="text-cyan-400">w = {weights?.ema_trend || 1.5}</strong>
            </div>
            <div className="flex justify-between bg-gray-900/60 p-1.5 rounded border border-gray-800">
              <span className="text-gray-400">RSI Oscillator:</span>
              <strong className="text-amber-400">w = {weights?.rsi || 1.2}</strong>
            </div>
            <div className="flex justify-between bg-gray-900/60 p-1.5 rounded border border-gray-800">
              <span className="text-gray-400">MACD Histogram:</span>
              <strong className="text-purple-400">w = {weights?.macd || 1.0}</strong>
            </div>
          </div>
        </div>

        {/* Top Error Causes */}
        <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> สาเหตุหลักของความผิดพลาดในอดีต (Error Causes)
          </h4>
          <div className="space-y-1.5 text-xs">
            {error_causes && Object.entries(error_causes).map(([cause, count]) => (
              <div key={cause} className="flex justify-between items-center bg-rose-950/20 border border-rose-500/30 p-1.5 rounded text-rose-300">
                <span>{cause}</span>
                <span className="font-mono font-bold bg-rose-500/20 px-2 py-0.5 rounded text-[10px]">{count} ครั้ง</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Retrospective Lessons History */}
      <div>
        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
          ประวัติบทเรียนการเทรดล่าสุด (AI Lessons Learned Log)
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {history?.map((t) => {
            const isWin = t.outcome === 'WIN';
            return (
              <div
                key={t.id}
                className={`p-2.5 rounded-xl border text-xs ${
                  isWin ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      isWin ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {t.outcome}
                    </span>
                    <span className="text-white">{t.symbol} {t.type} @ {t.entry}</span>
                  </span>
                  <span className="font-mono text-gray-400 text-[10px]">{t.timestamp}</span>
                </div>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  💡 <strong>บทเรียน AI:</strong> {t.lesson}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
