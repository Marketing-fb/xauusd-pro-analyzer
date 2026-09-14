import React, { useState } from 'react';
import { Brain, X, Check, AlertCircle } from 'lucide-react';

export default function TradeSimulatorModal({ isOpen, onClose, currentPrice, activeSymbol, onRecordTrade }) {
  if (!isOpen) return null;

  const [tradeType, setTradeType] = useState('BUY');
  const [entryPrice, setEntryPrice] = useState(currentPrice || 2748.50);
  const [slPrice, setSlPrice] = useState((currentPrice ? currentPrice - 15 : 2733.50).toFixed(2));
  const [tpPrice, setTpPrice] = useState((currentPrice ? currentPrice + 25 : 2773.50).toFixed(2));
  const [outcome, setOutcome] = useState('WIN');
  const [errorReason, setErrorReason] = useState('News Volatility Spike');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRecordTrade({
      symbol: activeSymbol,
      type: tradeType,
      entry: Number(entryPrice),
      sl: Number(slPrice),
      tp: Number(tpPrice),
      outcome,
      error_reason: outcome === 'LOSS' ? errorReason : ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-md p-6 relative border border-purple-500/40 shadow-2xl">
        
        <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              บันทึกผลการเทรดป้อน AI (Feed Trade Memory)
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-gray-400 block mb-1">ฝั่งคำสั่งเทรด (Trade Type)</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTradeType('BUY')}
                className={`py-2 rounded-lg font-bold transition-all ${
                  tradeType === 'BUY' ? 'bg-emerald-500 text-gray-950 shadow-md shadow-emerald-500/20' : 'bg-gray-900 text-gray-400'
                }`}
              >
                BUY
              </button>
              <button
                type="button"
                onClick={() => setTradeType('SELL')}
                className={`py-2 rounded-lg font-bold transition-all ${
                  tradeType === 'SELL' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' : 'bg-gray-900 text-gray-400'
                }`}
              >
                SELL
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-gray-400 block mb-1">ราคาเข้าซื้อ</label>
              <input
                type="number"
                step="0.01"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 font-mono font-bold text-white"
              />
            </div>
            <div>
              <label className="text-rose-400 block mb-1">Stop Loss (SL)</label>
              <input
                type="number"
                step="0.01"
                value={slPrice}
                onChange={(e) => setSlPrice(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 font-mono font-bold text-rose-300"
              />
            </div>
            <div>
              <label className="text-emerald-400 block mb-1">Take Profit (TP)</label>
              <input
                type="number"
                step="0.01"
                value={tpPrice}
                onChange={(e) => setTpPrice(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 font-mono font-bold text-emerald-300"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 block mb-1">ผลลัพธ์ของคำสั่งเทรด (Outcome)</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOutcome('WIN')}
                className={`py-2 rounded-lg font-bold transition-all ${
                  outcome === 'WIN' ? 'bg-emerald-600 text-white border border-emerald-400' : 'bg-gray-900 text-gray-400'
                }`}
              >
                WIN (ชนะกำไร 🎯)
              </button>
              <button
                type="button"
                onClick={() => setOutcome('LOSS')}
                className={`py-2 rounded-lg font-bold transition-all ${
                  outcome === 'LOSS' ? 'bg-rose-600 text-white border border-rose-400' : 'bg-gray-900 text-gray-400'
                }`}
              >
                LOSS (แพ้ขาดทุน 🛑)
              </button>
            </div>
          </div>

          {outcome === 'LOSS' && (
            <div>
              <label className="text-rose-400 block mb-1">สาเหตุความผิดพลาด (Error Cause for AI Learning)</label>
              <select
                value={errorReason}
                onChange={(e) => setErrorReason(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-white font-semibold"
              >
                <option value="News Volatility Spike">โดนแรงกระชากจากข่าวเศรษฐกิจ (News Spike)</option>
                <option value="RSI False Breakout in Range">RSI เกิดสัญญาณหลอกในภาวะ Sideways</option>
                <option value="Order Block Liquidity Trap">โดนกวาดสภาพคล่อง Liquidity Trap</option>
                <option value="Premature Entry before Confirmation">เข้าเทรดเร็วเกินไปก่อนแท่งเทียนยืนยัน</option>
              </select>
            </div>
          )}

          <div className="pt-3 border-t border-gray-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-gray-900 text-gray-300 font-semibold"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold flex items-center gap-1 shadow-md shadow-purple-500/20"
            >
              <Check className="w-4 h-4" /> บันทึกให้ AI เรียนรู้
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
