import React, { useState } from 'react';
import { Calculator, DollarSign, Percent, ShieldCheck, AlertCircle } from 'lucide-react';

export default function RiskCalculator({ activeSymbol, currentPrice }) {
  const [balance, setBalance] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(1.5);
  const [stopLossPips, setStopLossPips] = useState(activeSymbol === 'XAUUSD' ? 50 : 30);
  const [contractSize, setContractSize] = useState(activeSymbol === 'XAUUSD' ? 100 : 100000);

  // Lot Size calculation formula:
  // Risk Amount ($) = Balance * (Risk% / 100)
  // Lot Size = Risk Amount / (SL Pips * Pip Value per Lot)
  const riskAmount = (balance * (riskPercent / 100));
  
  // Pip value per 1 lot for XAUUSD ($1 per 0.01 move for 100 oz contract = $1 per 1 pip)
  const pipValuePerLot = activeSymbol === 'XAUUSD' ? 1.0 : (activeSymbol === 'USDJPY' ? 6.5 : 10.0);
  const calculatedLot = (riskAmount / (stopLossPips * pipValuePerLot)).toFixed(2);
  const potentialReward = (riskAmount * 2).toFixed(2); // 1:2 R:R assumption

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Position & Risk Calculator (คำนวณ Lot Size)
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Account Balance */}
        <div>
          <label className="text-[11px] text-gray-400 block mb-1">เงินทุนในพอร์ต ($ Account Balance)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-bold">$</span>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2 pl-7 pr-3 text-xs font-mono text-white font-bold focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Risk Percentage */}
        <div>
          <label className="text-[11px] text-gray-400 block mb-1">สัดส่วนความเสี่ยง (% Risk per Trade)</label>
          <div className="relative">
            <span className="absolute right-3 top-2.5 text-xs text-gray-500 font-bold">%</span>
            <input
              type="number"
              step="0.1"
              value={riskPercent}
              onChange={(e) => setRiskPercent(Number(e.target.value))}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2 px-3 text-xs font-mono text-white font-bold focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Stop Loss Distance in Pips */}
        <div>
          <label className="text-[11px] text-gray-400 block mb-1">ระยะ Cut Loss (Pips / Points)</label>
          <input
            type="number"
            value={stopLossPips}
            onChange={(e) => setStopLossPips(Number(e.target.value))}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2 px-3 text-xs font-mono text-white font-bold focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Calculated Results */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-950/60 p-3 rounded-xl border border-gray-800">
        <div className="text-center p-2 rounded-lg bg-gray-900/60 border border-gray-800">
          <span className="text-[10px] text-gray-400 block mb-0.5">ขนาด Lot แนะนำ</span>
          <span className="text-lg font-mono font-black text-amber-400">{calculatedLot} Lots</span>
        </div>

        <div className="text-center p-2 rounded-lg bg-gray-900/60 border border-gray-800">
          <span className="text-[10px] text-gray-400 block mb-0.5">เงินรับความเสี่ยงสูงสุด</span>
          <span className="text-base font-mono font-bold text-rose-400">${riskAmount.toFixed(2)}</span>
        </div>

        <div className="text-center p-2 rounded-lg bg-gray-900/60 border border-gray-800">
          <span className="text-[10px] text-gray-400 block mb-0.5">กำไรคาดการณ์ (1:2 R:R)</span>
          <span className="text-base font-mono font-bold text-emerald-400">${potentialReward}</span>
        </div>

        <div className="text-center p-2 rounded-lg bg-gray-900/60 border border-gray-800">
          <span className="text-[10px] text-gray-400 block mb-0.5">สถานะพอร์ตความเสี่ยง</span>
          <span className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1 mt-1">
            <ShieldCheck className="w-3.5 h-3.5" /> ปลอดภัย (Safe)
          </span>
        </div>
      </div>
    </div>
  );
}
