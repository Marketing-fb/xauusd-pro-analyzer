import React, { useState } from 'react';
import { Bell, Plus, Trash2, CheckCircle2, ShieldAlert, Zap } from 'lucide-react';

export default function PriceAlertManager({ activeSymbol, currentPrice, alerts, onAddAlert, onDeleteAlert }) {
  const [targetPrice, setTargetPrice] = useState(currentPrice ? (currentPrice * 1.002).toFixed(2) : '2750.00');
  const [condition, setCondition] = useState('CROSSES_ABOVE');
  const [note, setNote] = useState('เตือนแนวต้านย่อย');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!targetPrice) return;
    
    onAddAlert({
      id: Date.now(),
      symbol: activeSymbol,
      targetPrice: Number(targetPrice),
      condition, // 'CROSSES_ABOVE' | 'CROSSES_BELOW'
      note,
      createdAt: new Date().toLocaleTimeString()
    });
    
    setNote('');
  };

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          ระบบตั้งการแจ้งเตือนราคา (Price Alerts)
        </h3>
      </div>

      {/* Add Alert Form */}
      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-4 bg-gray-950/60 p-3 rounded-xl border border-gray-800">
        <div>
          <label className="text-[10px] text-gray-400 block mb-1">เงื่อนไขการเตือน</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
          >
            <option value="CROSSES_ABOVE">ราคาตัดขึ้นเหนือ (&gt;)</option>
            <option value="CROSSES_BELOW">ราคาตัดลงต่ำกว่า (&lt;)</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] text-gray-400 block mb-1">ระดับราคาเป้าหมาย</label>
          <input
            type="number"
            step="0.01"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-2 text-xs font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-[10px] text-gray-400 block mb-1">บันทึกความจำ / หมายเหตุ</label>
          <input
            type="text"
            placeholder="เช่น แนวต้าน Order Block"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> เพิ่มจุดเตือน
          </button>
        </div>
      </form>

      {/* Active Alerts List */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {alerts.length === 0 ? (
          <div className="text-center py-4 text-xs text-gray-500 border border-dashed border-gray-800 rounded-xl">
            ยังไม่มีรายการแจ้งเตือนที่ตั้งไว้ กดเพิ่มจุดเตือนราคาด้านบนได้เลยครับ
          </div>
        ) : (
          alerts.map((al) => (
            <div
              key={al.id}
              className="flex items-center justify-between bg-gray-900/60 p-2.5 rounded-lg border border-gray-800 hover:border-amber-500/40 transition-colors text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  al.condition === 'CROSSES_ABOVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {al.condition === 'CROSSES_ABOVE' ? 'ตัดขึ้น >' : 'ตัดลง <'}
                </span>

                <span className="font-mono font-bold text-amber-300 text-sm">
                  {al.symbol} @ {al.targetPrice}
                </span>

                <span className="text-gray-400 text-ellipsis overflow-hidden max-w-[140px]">
                  {al.note || 'ไม่มีบันทึก'}
                </span>
              </div>

              <button
                onClick={() => onDeleteAlert(al.id)}
                className="p-1 rounded text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="ลบการเตือน"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
