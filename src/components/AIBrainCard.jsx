import React from 'react';
import { Brain, Cpu, Zap, Activity, CheckCircle2, Award, Terminal } from 'lucide-react';

export default function AIBrainCard({ brainData }) {
  if (!brainData) return null;

  const { regime, neural_win_probability, neural_weights, ai_thought_chain } = brainData;

  return (
    <div className="glass-panel p-4 border border-purple-500/30 glass-panel-glow-gold relative overflow-hidden">
      
      {/* Background Subtle Glowing Pulse */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 border-b border-gray-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-md shadow-purple-500/30 animate-pulse">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              AI Brain Engine (สมองกลเรียนรู้อัจฉริยะ)
            </h3>
            <p className="text-[10px] text-gray-400">โครงข่ายประสาทประมวลผลสภาวะตลาด & ทำนายโอกาสชนะ Real-Time</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-purple-950/60 border border-purple-500/40 px-2.5 py-1 rounded-full text-xs font-extrabold text-purple-300">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>Active Neural Network</span>
        </div>
      </div>

      {/* Top Banner: Market Regime & Neural Win-Prob Score */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        
        {/* Market Regime */}
        <div className="sm:col-span-2 bg-gray-950/70 p-3 rounded-xl border border-gray-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-gray-400">สภาวะตลาดปัจจุบัน (Market Regime Network):</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Confidence: {regime?.confidence}%
            </span>
          </div>

          <div className="font-extrabold text-base text-white mb-1">
            {regime?.label || '🟢 Strong Bullish Trend'}
          </div>

          <p className="text-xs text-amber-300 font-medium">
            💡 <strong>กลยุทธ์สมองกล:</strong> {regime?.strategy}
          </p>
        </div>

        {/* Win-Probability Score */}
        <div className="bg-gradient-to-tr from-purple-950/40 to-indigo-950/30 p-3 rounded-xl border border-purple-500/30 text-center flex flex-col items-center justify-center">
          <span className="text-[10px] text-purple-300 block mb-1 flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-400" /> Neural Win-Probability
          </span>

          <span className="text-2xl font-mono font-black text-amber-400 mb-1">
            {neural_win_probability || 84.5}%
          </span>

          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-amber-400 to-emerald-400 rounded-full"
              style={{ width: `${neural_win_probability || 84.5}%` }}
            />
          </div>
        </div>

      </div>

      {/* AI Thought Process Chain (สายการคิดของ AI) */}
      <div className="bg-gray-950/80 p-3 rounded-xl border border-gray-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
          <Terminal className="w-3.5 h-3.5" /> สายการคิดและเหตุผลของสมองกล (AI Thought Chain)
        </div>

        <div className="space-y-1.5 font-mono text-xs text-gray-300">
          {ai_thought_chain?.map((thought, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-gray-900/60 p-2 rounded-lg border border-gray-800/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{thought}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
