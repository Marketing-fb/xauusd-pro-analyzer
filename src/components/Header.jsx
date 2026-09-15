import React from 'react';
import { Activity, Coins, TrendingUp, TrendingDown, RefreshCw, Zap, Settings, Brain } from 'lucide-react';

export default function Header({ 
  tickers, 
  activeSymbol, 
  setActiveSymbol, 
  activeTimeframe, 
  setActiveTimeframe,
  isRefreshing,
  onRefresh,
  onOpenSettings,
  onOpenLearningModal
}) {
  return (
    <header className="w-full glass-panel border-b border-gray-800 p-3 mb-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Logo & System Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Coins className="w-6 h-6 text-gray-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-amber-400 via-yellow-200 to-white bg-clip-text text-transparent">
                XAUUSD AI QUANT PRO
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3 fill-amber-300" /> V2.5 PRO
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                LIVE • 5S
              </span>
            </div>
            <p className="text-xs text-gray-400">ระบบวิเคราะห์เทคนิคัล & สัญญาณเทรดทองคำ XAUUSD / Forex AI</p>
          </div>
        </div>

        {/* Live Ticker Strip */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 px-2 max-w-full">
          {tickers.map((t) => {
            const isSelected = t.symbol === activeSymbol;
            const isUp = t.change_pct >= 0;
            return (
              <button
                key={t.symbol}
                onClick={() => setActiveSymbol(t.symbol)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                  isSelected 
                    ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10' 
                    : 'bg-gray-900/60 border border-gray-800 text-gray-300 hover:bg-gray-800/60'
                }`}
              >
                <span className="font-bold">{t.symbol}</span>
                <span className="font-mono">{t.price}</span>
                <span className={`flex items-center text-[10px] font-semibold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {isUp ? '+' : ''}{t.change_pct}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Timeframe selector, Settings, AI Learning & Refresh */}
        <div className="flex items-center gap-2">
          {/* Timeframes */}
          <div className="flex items-center bg-gray-900/80 p-1 rounded-lg border border-gray-800">
            {["M15", "H1", "H4", "D1"].map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  activeTimeframe === tf
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-950 font-bold shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* AI Self-Learning Button */}
          <button
            onClick={onOpenLearningModal}
            className="px-2.5 py-1.5 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-300 hover:bg-purple-900/60 font-bold text-xs flex items-center gap-1 transition-all"
            title="ป้อนผลการเทรดให้ AI เรียนรู้"
          >
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">AI Learning</span>
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-gray-900/80 border border-gray-800 text-gray-300 hover:text-amber-400 hover:border-amber-500/40 transition-all flex items-center gap-1"
            title="ปรับตั้งค่าอินดิเคเตอร์"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-gray-900/80 border border-gray-800 text-gray-300 hover:text-amber-400 hover:border-amber-500/40 transition-all"
            title="อัปเดตข้อมูลราคาสุดสด"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>

      </div>
    </header>
  );
}
