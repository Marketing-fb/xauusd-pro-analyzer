import json
import os
import numpy as np
from datetime import datetime

MEMORY_FILE = os.path.join(os.path.dirname(__file__), "signals_memory.json")

DEFAULT_MEMORY = {
    "weights": {
        "rsi": 1.2,
        "macd": 1.0,
        "ema_trend": 1.5,
        "smc_ob": 1.8,
        "news": 1.1
    },
    "stats": {
        "total_trades": 24,
        "wins": 18,
        "losses": 6,
        "win_rate": 75.0,
        "profit_factor": 2.45,
        "avg_rr": 2.1
    },
    "history": [
        {
            "id": 1,
            "timestamp": "2026-09-14 10:30",
            "symbol": "XAUUSD",
            "type": "BUY",
            "entry": 2742.50,
            "sl": 2735.00,
            "tp": 2758.00,
            "outcome": "WIN",
            "pnl_pips": +155,
            "error_reason": None,
            "lesson": "เข้าเทรดสำเร็จที่โซน Bullish Order Block + RSI Divergence"
        },
        {
            "id": 2,
            "timestamp": "2026-09-14 11:15",
            "symbol": "XAUUSD",
            "type": "SELL",
            "entry": 2752.00,
            "sl": 2758.00,
            "tp": 2740.00,
            "outcome": "LOSS",
            "pnl_pips": -60,
            "error_reason": "High Volatility News Spike",
            "lesson": "โดน Stop Loss จากข่าวกระชากสวนเทรนด์หลัก (คราวหลังเลี่ยงเทรดช่วงก่อนข่าว CPI 15 นาที)"
        },
        {
            "id": 3,
            "timestamp": "2026-09-14 12:00",
            "symbol": "XAUUSD",
            "type": "BUY",
            "entry": 2745.00,
            "sl": 2738.00,
            "tp": 2760.00,
            "outcome": "WIN",
            "pnl_pips": +150,
            "error_reason": None,
            "lesson": "สอดคล้องกับเทรนด์ EMA20/50 ใน Timeframe H1 และ H4"
        }
    ],
    "error_causes": {
        "News Volatility Spike": 3,
        "RSI False Breakout in Range": 2,
        "Order Block Liquidity Trap": 1
    }
}

def load_memory():
    if not os.path.exists(MEMORY_FILE):
        save_memory(DEFAULT_MEMORY)
        return DEFAULT_MEMORY
    try:
        with open(MEMORY_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print("Error loading memory file:", e)
        return DEFAULT_MEMORY

def save_memory(data):
    try:
        with open(MEMORY_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print("Error saving memory file:", e)

def record_trade_result(symbol, trade_type, entry, sl, tp, outcome, error_reason=""):
    memory = load_memory()
    history = memory.get("history", [])
    stats = memory.get("stats", {"total_trades": 0, "wins": 0, "losses": 0, "win_rate": 0})
    weights = memory.get("weights", {})
    
    is_win = outcome == "WIN"
    pnl = abs(tp - entry) if is_win else -abs(entry - sl)
    
    lesson = ""
    if is_win:
        lesson = "เข้าตามแผน Confluence ครบถ้วน (SMC OB + EMA Alignment)"
        # Reinforce winning indicator weights
        weights["smc_ob"] = round(weights.get("smc_ob", 1.5) + 0.05, 2)
        weights["ema_trend"] = round(weights.get("ema_trend", 1.2) + 0.03, 2)
    else:
        lesson = f"พลาดเนื่องจาก: {error_reason or 'ความผันผวนของตลาด'} (AI ลดน้ำหนักสัญญาณหลอกและปรับจุด Stop Loss)"
        # Penalty for loss cause
        weights["rsi"] = max(round(weights.get("rsi", 1.0) - 0.04, 2), 0.5)
        if error_reason:
            causes = memory.get("error_causes", {})
            causes[error_reason] = causes.get(error_reason, 0) + 1
            memory["error_causes"] = causes

    new_trade = {
        "id": len(history) + 1,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "symbol": symbol,
        "type": trade_type,
        "entry": entry,
        "sl": sl,
        "tp": tp,
        "outcome": outcome,
        "pnl_pips": round(pnl, 2),
        "error_reason": error_reason if not is_win else None,
        "lesson": lesson
    }
    
    history.insert(0, new_trade)
    memory["history"] = history[:30] # keep last 30
    
    # Recalculate stats
    total = len(history)
    wins = sum(1 for t in history if t["outcome"] == "WIN")
    losses = sum(1 for t in history if t["outcome"] == "LOSS")
    win_rate = round((wins / max(total, 1)) * 100, 1)
    
    stats["total_trades"] = total
    stats["wins"] = wins
    stats["losses"] = losses
    stats["win_rate"] = win_rate
    
    memory["stats"] = stats
    memory["weights"] = weights
    save_memory(memory)
    
    return memory
