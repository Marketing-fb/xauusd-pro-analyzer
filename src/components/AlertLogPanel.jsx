import React from 'react';
import { Radio, Zap, Bell, CheckCircle } from 'lucide-react';

export default function AlertLogPanel({ alertLogs }) {
  if (!alertLogs || alertLogs.length === 0) {
    return (
      <div className="glass-panel p-4 text-center">
        <div className="flex items-center gap-2 mb-2">
          <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Live Triggered Alert Feed
          </h3>
        </div>
        <p className="text-xs text-gray-500 py-3">
          ยังไม่มีการ Trigger การเตือนราคาในขณะนี้ ระบบกำลังเฝ้าระดับราคา Real-time...
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Live Triggered Alert Feed ({alertLogs.length})
          </h3>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
          Active Monitoring
        </span>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {alertLogs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-2.5 bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-xs text-amber-200 animate-pulse-glow"
          >
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between font-bold text-white mb-0.5">
                <span>{log.title}</span>
                <span className="text-[10px] font-mono text-gray-400">{log.time}</span>
              </div>
              <p className="text-[11px] text-gray-300">{log.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
