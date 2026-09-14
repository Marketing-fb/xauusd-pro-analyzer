import React from 'react';
import { Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function MultiTimeframeMatrix({ matrixData }) {
  if (!matrixData || !matrixData.matrix) return null;

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Multi-Timeframe Trend Matrix
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {matrixData.matrix.map((tf) => {
          const isBullish = tf.bias === 'BULLISH';
          const isBearish = tf.bias === 'BEARISH';
          
          return (
            <div
              key={tf.timeframe}
              className={`p-3 rounded-xl border transition-all ${
                isBullish
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : isBearish
                  ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  : 'bg-gray-900/60 border-gray-800 text-gray-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-extrabold text-white text-xs">{tf.timeframe}</span>
                {isBullish && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
                {isBearish && <TrendingDown className="w-3.5 h-3.5 text-rose-400" />}
                {!isBullish && !isBearish && <Minus className="w-3.5 h-3.5 text-gray-500" />}
              </div>

              <div className="font-bold text-xs mb-1">
                {tf.bias}
              </div>

              <div className="text-[10px] text-gray-400 space-y-0.5 font-mono">
                <div>RSI: <strong className="text-amber-400">{tf.rsi}</strong></div>
                <div>{tf.ema_trend}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
