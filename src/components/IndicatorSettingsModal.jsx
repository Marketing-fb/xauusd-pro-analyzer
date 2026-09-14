import React, { useState } from 'react';
import { Settings, X, RotateCcw, Check } from 'lucide-react';

export default function IndicatorSettingsModal({ isOpen, onClose, config, onSaveConfig }) {
  if (!isOpen) return null;

  const [formConfig, setFormConfig] = useState({ ...config });

  const handleReset = () => {
    const defaultConfig = {
      emaFast: 20,
      emaMedium: 50,
      emaSlow: 200,
      rsiPeriod: 14,
      rsiUpper: 70,
      rsiLower: 30,
      macdFast: 12,
      macdSlow: 26,
      macdSignal: 9,
    };
    setFormConfig(defaultConfig);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveConfig(formConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-lg p-6 relative border border-amber-500/30 shadow-2xl animate-pulse-glow">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
              ปรับแต่งอินดิเคเตอร์ (Indicator Settings)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* EMA Settings */}
          <div className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-800">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2.5">
              Exponential Moving Average (EMA)
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Fast EMA</label>
                <input
                  type="number"
                  value={formConfig.emaFast}
                  onChange={(e) => setFormConfig({ ...formConfig, emaFast: Number(e.target.value) })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-2 text-xs font-mono text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Medium EMA</label>
                <input
                  type="number"
                  value={formConfig.emaMedium}
                  onChange={(e) => setFormConfig({ ...formConfig, emaMedium: Number(e.target.value) })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-2 text-xs font-mono text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Slow EMA</label>
                <input
                  type="number"
                  value={formConfig.emaSlow}
                  onChange={(e) => setFormConfig({ ...formConfig, emaSlow: Number(e.target.value) })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-2 text-xs font-mono text-purple-300 font-bold focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* RSI Settings */}
          <div className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-800">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5">
              Relative Strength Index (RSI)
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Period</label>
                <input
                  type="number"
                  value={formConfig.rsiPeriod}
                  onChange={(e) => setFormConfig({ ...formConfig, rsiPeriod: Number(e.target.value) })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-2 text-xs font-mono text-white font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-rose-400 block mb-1">Overbought Upper</label>
                <input
                  type="number"
                  value={formConfig.rsiUpper}
                  onChange={(e) => setFormConfig({ ...formConfig, rsiUpper: Number(e.target.value) })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-2 text-xs font-mono text-rose-300 font-bold focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-emerald-400 block mb-1">Oversold Lower</label>
                <input
                  type="number"
                  value={formConfig.rsiLower}
                  onChange={(e) => setFormConfig({ ...formConfig, rsiLower: Number(e.target.value) })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-2 text-xs font-mono text-emerald-300 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* MACD Settings */}
          <div className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-800">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2.5">
              MACD Parameters
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Fast EMA</label>
                <input
                  type="number"
                  value={formConfig.macdFast}
                  onChange={(e) => setFormConfig({ ...formConfig, macdFast: Number(e.target.value) })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-2 text-xs font-mono text-white font-bold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Slow EMA</label>
                <input
                  type="number"
                  value={formConfig.macdSlow}
                  onChange={(e) => setFormConfig({ ...formConfig, macdSlow: Number(e.target.value) })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-2 text-xs font-mono text-white font-bold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Signal Line</label>
                <input
                  type="number"
                  value={formConfig.macdSignal}
                  onChange={(e) => setFormConfig({ ...formConfig, macdSignal: Number(e.target.value) })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-2 text-xs font-mono text-white font-bold focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-800">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> รีเซ็ตเป็นค่าเริ่มต้น
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 text-xs font-semibold hover:bg-gray-800"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:opacity-90"
              >
                <Check className="w-4 h-4" /> บันทึกการตั้งค่า
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
