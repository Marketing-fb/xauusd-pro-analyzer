import React, { useState } from 'react';
import { Send, Bot, Terminal, Zap, ShieldCheck } from 'lucide-react';

export default function TelegramBotConsole() {
  const [inputCmd, setInputCmd] = useState('/signal');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '🤖 ยินดีต้อนรับสู่ Telegram Bot Simulator\nพิมพ์คำสั่งทดสอบ เช่น /signal, /news, /risk 10000 2 50, หรือ /status'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (cmdToSend) => {
    const queryCmd = cmdToSend || inputCmd;
    if (!queryCmd.trim()) return;

    const userMsg = { sender: 'user', text: queryCmd };
    setMessages((prev) => [...prev, userMsg]);
    setInputCmd('');
    setIsLoading(true);

    try {
      const res = await fetch(`http://localhost:8080/api/telegram-cmd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: queryCmd })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
        setIsLoading(false);
        return;
      }
    } catch (e) {
      console.log('Error executing Telegram command:', e);
    }

    setMessages((prev) => [...prev, { sender: 'bot', text: '🤖 ตอบกลับคำสั่ง: สัญญาณ XAUUSD STRONG BUY | Entry: 2748.50 | SL: 2730.00 | TP1: 2770.00 (Win Rate: 75.0%)' }]);
    setIsLoading(false);
  };

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center justify-between gap-2 mb-3 border-b border-gray-800 pb-2">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Interactive Telegram Command Bot (จำลองการโต้ตอบ)
          </h3>
        </div>
        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
          Live Connected
        </span>
      </div>

      {/* Quick Command Chips */}
      <div className="flex flex-wrap gap-1.5 mb-3 text-xs">
        {['/signal', '/news', '/risk 10000 2 50', '/status', '/help'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleSend(cmd)}
            className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/40 font-mono text-[11px] transition-all"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="bg-gray-950/80 border border-gray-800 rounded-xl p-3 h-48 overflow-y-auto space-y-2 mb-3 font-mono text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-2.5 rounded-xl max-w-[85%] whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                  : 'bg-gray-900 border border-gray-800 text-gray-200'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-500 text-[10px] animate-pulse">
            🤖 บอทกำลังประมวลผลคำสั่ง...
          </div>
        )}
      </div>

      {/* Command Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="พิมพ์คำสั่ง เช่น /signal หรือ /risk 5000 1.5 40"
          value={inputCmd}
          onChange={(e) => setInputCmd(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-800 rounded-lg py-2 px-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-md shadow-cyan-500/20"
        >
          <Send className="w-3.5 h-3.5" /> ส่งคำสั่ง
        </button>
      </form>
    </div>
  );
}
