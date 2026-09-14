from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import pandas as pd
import random
from datetime import datetime, timedelta

from indicators import (
    calculate_ema, calculate_rsi, calculate_macd,
    calculate_bollinger_bands, calculate_atr, calculate_volume_profile,
    calculate_supertrend, analyze_candle_wick_rejection, detect_smc_patterns
)
from learning_engine import load_memory, record_trade_result
from telegram_bot import TelegramBotHandler
from ai_brain import AIBrainEngine

app = FastAPI(title="XAUUSD Forex AI Analysis & Self-Learning Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

telegram_bot = TelegramBotHandler()
ai_brain = AIBrainEngine()

SYMBOL_MAP = {
    "XAUUSD": {"yf": "GC=F", "name": "Gold / US Dollar", "base_price": 2745.50, "pip_size": 0.01},
    "EURUSD": {"yf": "EURUSD=X", "name": "Euro / US Dollar", "base_price": 1.0850, "pip_size": 0.0001},
    "GBPUSD": {"yf": "GBPUSD=X", "name": "British Pound / US Dollar", "base_price": 1.2980, "pip_size": 0.0001},
    "USDJPY": {"yf": "JPY=X", "name": "US Dollar / Japanese Yen", "base_price": 152.30, "pip_size": 0.01},
    "DXY": {"yf": "DX-Y.NYB", "name": "US Dollar Index", "base_price": 104.20, "pip_size": 0.01}
}

class TradeRecordRequest(BaseModel):
    symbol: str = "XAUUSD"
    type: str = "BUY"
    entry: float
    sl: float
    tp: float
    outcome: str = "WIN"
    error_reason: str = ""

class TelegramCmdRequest(BaseModel):
    command: str = "/signal"

def generate_simulated_candles(symbol: str, timeframe: str = "H1", count: int = 120):
    base = SYMBOL_MAP.get(symbol, SYMBOL_MAP["XAUUSD"])["base_price"]
    volatility = base * 0.0025
    
    now = datetime.now()
    minutes_map = {"M1": 1, "M5": 5, "M15": 15, "H1": 60, "H4": 240, "D1": 1440}
    step_minutes = minutes_map.get(timeframe, 60)
    
    candles = []
    current_price = base
    start_time = now - timedelta(minutes=step_minutes * count)
    trend = random.choice([0.0002, -0.0002, 0.0001, 0.0003, -0.0001])
    
    for i in range(count):
        candle_time = start_time + timedelta(minutes=step_minutes * i)
        change = np.random.normal(0, volatility) + (trend * base)
        open_p = current_price
        close_p = open_p + change
        high_p = max(open_p, close_p) + abs(np.random.normal(0, volatility * 0.5))
        low_p = min(open_p, close_p) - abs(np.random.normal(0, volatility * 0.5))
        
        volume = random.randint(1200, 8500)
        candles.append({
            "time": candle_time.strftime("%Y-%m-%d %H:%M"),
            "timestamp": int(candle_time.timestamp()),
            "open": round(open_p, 2 if symbol in ["XAUUSD", "USDJPY", "DXY"] else 4),
            "high": round(high_p, 2 if symbol in ["XAUUSD", "USDJPY", "DXY"] else 4),
            "low": round(low_p, 2 if symbol in ["XAUUSD", "USDJPY", "DXY"] else 4),
            "close": round(close_p, 2 if symbol in ["XAUUSD", "USDJPY", "DXY"] else 4),
            "volume": volume
        })
        current_price = close_p
        
    return candles

@app.get("/api/tickers")
def get_tickers():
    results = []
    for sym, info in SYMBOL_MAP.items():
        base = info["base_price"]
        change_pct = round(random.uniform(-0.85, 1.25), 2)
        change_amt = round(base * (change_pct / 100), 2 if sym in ["XAUUSD", "USDJPY", "DXY"] else 4)
        results.append({
            "symbol": sym,
            "name": info["name"],
            "price": base,
            "change_pct": change_pct,
            "change_amt": change_amt,
            "high_24h": round(base * 1.008, 2 if sym in ["XAUUSD", "USDJPY", "DXY"] else 4),
            "low_24h": round(base * 0.992, 2 if sym in ["XAUUSD", "USDJPY", "DXY"] else 4)
        })
    return {"tickers": results}

@app.get("/api/market-data")
def get_market_data(
    symbol: str = "XAUUSD", 
    timeframe: str = "H1",
    ema_fast: int = 20,
    ema_medium: int = 50,
    ema_slow: int = 200,
    rsi_period: int = 14,
    macd_fast: int = 12,
    macd_slow: int = 26,
    macd_signal: int = 9
):
    if symbol not in SYMBOL_MAP:
        symbol = "XAUUSD"
        
    candles = generate_simulated_candles(symbol, timeframe, count=120)
    df_candles = pd.DataFrame(candles)
    closes = df_candles['close'].tolist()
    
    ema20 = calculate_ema(closes, ema_fast)
    ema50 = calculate_ema(closes, ema_medium)
    ema200 = calculate_ema(closes, ema_slow)
    rsi = calculate_rsi(closes, rsi_period)
    macd = calculate_macd(closes, macd_fast, macd_slow, macd_signal)
    bb = calculate_bollinger_bands(closes)
    atr = calculate_atr(df_candles)
    smc = detect_smc_patterns(df_candles)
    vp = calculate_volume_profile(df_candles, bins=16)
    supertrend = calculate_supertrend(df_candles)
    candle_quality = analyze_candle_wick_rejection(df_candles)
    
    last_price = closes[-1]
    prev_price = closes[-2] if len(closes) > 1 else last_price
    change = round(last_price - prev_price, 2 if symbol in ["XAUUSD", "USDJPY", "DXY"] else 4)
    change_pct = round((change / prev_price) * 100, 2)
    
    return {
        "symbol": symbol,
        "timeframe": timeframe,
        "last_price": last_price,
        "change": change,
        "change_pct": change_pct,
        "candles": candles,
        "indicators": {
            "ema20": round(ema20[-1], 2 if symbol in ["XAUUSD", "USDJPY", "DXY"] else 4),
            "ema50": round(ema50[-1], 2 if symbol in ["XAUUSD", "USDJPY", "DXY"] else 4),
            "ema200": round(ema200[-1], 2 if symbol in ["XAUUSD", "USDJPY", "DXY"] else 4),
            "rsi": rsi,
            "macd": macd,
            "bollinger": bb,
            "atr": round(atr, 2 if symbol in ["XAUUSD", "USDJPY", "DXY"] else 4),
            "supertrend": supertrend,
            "candle_quality": candle_quality
        },
        "smc": smc,
        "volume_profile": vp
    }

@app.get("/api/ai-brain")
def get_ai_brain_status(symbol: str = "XAUUSD"):
    market_data = get_market_data(symbol=symbol, timeframe="H1")
    candles = market_data["candles"]
    df_candles = pd.DataFrame(candles)
    indicators = market_data["indicators"]
    smc = market_data["smc"]
    vp = market_data["volume_profile"]
    memory = load_memory()
    weights = memory.get("weights", {})
    
    regime = ai_brain.detect_market_regime(df_candles, indicators)
    win_prob = ai_brain.calculate_neural_win_probability(regime, indicators, smc, vp, weights)
    thoughts = ai_brain.generate_ai_thought_chain(regime, win_prob, indicators, symbol)
    
    return {
        "symbol": symbol,
        "regime": regime,
        "neural_win_probability": win_prob,
        "neural_weights": ai_brain.neural_weights,
        "ai_thought_chain": thoughts,
        "brain_status": "ACTIVE_NEURAL_REINFORCEMENT"
    }

@app.get("/api/signals")
def get_ai_signals(
    symbol: str = "XAUUSD",
    ema_fast: int = 20,
    ema_medium: int = 50,
    rsi_period: int = 14,
    rsi_upper: float = 70.0,
    rsi_lower: float = 30.0
):
    memory = load_memory()
    weights = memory.get("weights", {"rsi": 1.0, "macd": 1.0, "ema_trend": 1.5, "smc_ob": 1.8})
    
    market_data = get_market_data(symbol=symbol, timeframe="H1", ema_fast=ema_fast, ema_medium=ema_medium, rsi_period=rsi_period)
    df_candles = pd.DataFrame(market_data["candles"])
    last_p = market_data["last_price"]
    rsi = market_data["indicators"]["rsi"]
    macd = market_data["indicators"]["macd"]
    ema20 = market_data["indicators"]["ema20"]
    ema50 = market_data["indicators"]["ema50"]
    atr = market_data["indicators"]["atr"]
    st = market_data["indicators"]["supertrend"]
    cq = market_data["indicators"]["candle_quality"]
    
    regime = ai_brain.detect_market_regime(df_candles, market_data["indicators"])
    win_prob = ai_brain.calculate_neural_win_probability(regime, market_data["indicators"], market_data["smc"], market_data["volume_profile"], weights)
    
    bullish_factors = 0.0
    bearish_factors = 0.0
    
    w_rsi = weights.get("rsi", 1.0)
    w_macd = weights.get("macd", 1.0)
    w_ema = weights.get("ema_trend", 1.5)
    w_smc = weights.get("smc_ob", 1.8)
    
    if rsi < rsi_lower + 10:
        bullish_factors += 2.0 * w_rsi
    elif rsi > rsi_upper - 10:
        bearish_factors += 2.0 * w_rsi
        
    if macd["hist"] > 0:
        bullish_factors += 2.0 * w_macd
    else:
        bearish_factors += 2.0 * w_macd
        
    if last_p > ema20 > ema50:
        bullish_factors += 3.0 * w_ema
    elif last_p < ema20 < ema50:
        bearish_factors += 3.0 * w_ema
        
    if st["direction"] == "BULLISH":
        bullish_factors += 2.5
    else:
        bearish_factors += 2.5
        
    bullish_factors += 2.5 * w_smc
    
    total = bullish_factors + bearish_factors
    confidence = int((max(bullish_factors, bearish_factors) / max(total, 1)) * 100)
    
    if bullish_factors > bearish_factors + 1.5:
        signal_type = "STRONG BUY" if confidence >= 78 else "BUY"
        direction = "BULLISH"
        entry_min = round(last_p * 0.9985, 2)
        entry_max = round(last_p * 1.0005, 2)
        sl = round(last_p - (atr * 1.5), 2)
        tp1 = round(last_p + (atr * 1.5), 2)
        tp2 = round(last_p + (atr * 3.0), 2)
        tp3 = round(last_p + (atr * 4.8), 2)
    elif bearish_factors > bullish_factors + 1.5:
        signal_type = "STRONG SELL" if confidence >= 78 else "SELL"
        direction = "BEARISH"
        entry_min = round(last_p * 0.9995, 2)
        entry_max = round(last_p * 1.0015, 2)
        sl = round(last_p + (atr * 1.5), 2)
        tp1 = round(last_p - (atr * 1.5), 2)
        tp2 = round(last_p - (atr * 3.0), 2)
        tp3 = round(last_p - (atr * 4.8), 2)
    else:
        signal_type = "NEUTRAL"
        direction = "SIDEWAYS"
        entry_min = round(last_p * 0.9990, 2)
        entry_max = round(last_p * 1.0010, 2)
        sl = round(last_p - atr, 2)
        tp1 = round(last_p + atr, 2)
        tp2 = round(last_p + (atr * 2), 2)
        tp3 = round(last_p + (atr * 3), 2)
        
    risk_dist = abs(last_p - sl)
    reward_dist = abs(tp2 - last_p)
    rr_ratio = round(reward_dist / max(risk_dist, 0.01), 2)
    
    return {
        "symbol": symbol,
        "signal": signal_type,
        "direction": direction,
        "confidence": confidence,
        "neural_win_prob": win_prob,
        "market_regime": regime["label"],
        "entry_price": last_p,
        "optimal_entry_zone": {"min": entry_min, "max": entry_max},
        "sl": sl,
        "tp1": tp1,
        "tp2": tp2,
        "tp3": tp3,
        "tp_probabilities": {"tp1": int(win_prob * 0.9), "tp2": int(win_prob * 0.75), "tp3": int(win_prob * 0.5)},
        "rr_ratio": f"1:{rr_ratio}",
        "atr": atr,
        "supertrend": st,
        "candle_quality": cq,
        "confluence_reasons": [
            f"AI Brain Regime: {regime['label']}",
            f"Neural Win Probability = {win_prob}%",
            f"SuperTrend (10, 3.0) = {st['value']} ({st['direction']} Confirm)",
            f"Candle Quality: {cq['text']}",
            f"RSI ({rsi_period}) = {rsi:.1f} (w={w_rsi}) | SMC Order Block Bounce (w={w_smc})"
        ]
    }

@app.post("/api/telegram-cmd")
def execute_telegram_cmd(req: TelegramCmdRequest):
    sig = get_ai_signals("XAUUSD")
    news = get_economic_news()
    stats = load_memory()
    reply = telegram_bot.process_command(req.command, sig, news, stats)
    return {"command": req.command, "reply": reply}

@app.get("/api/learning-stats")
def get_learning_stats():
    return load_memory()

@app.post("/api/trade-memory")
def add_trade_record(req: TradeRecordRequest):
    updated = record_trade_result(
        symbol=req.symbol,
        trade_type=req.type,
        entry=req.entry,
        sl=req.sl,
        tp=req.tp,
        outcome=req.outcome,
        error_reason=req.error_reason
    )
    return {"status": "success", "memory": updated}

@app.get("/api/multi-timeframe")
def get_multi_timeframe(symbol: str = "XAUUSD"):
    timeframes = ["M15", "H1", "H4", "D1"]
    matrix = []
    for tf in timeframes:
        data = generate_simulated_candles(symbol, tf, count=50)
        closes = [c["close"] for c in data]
        rsi = calculate_rsi(closes)
        ema20 = calculate_ema(closes, 20)[-1]
        last_p = closes[-1]
        
        if last_p > ema20 and rsi > 50:
            bias = "BULLISH"
            strength = "High" if rsi > 60 else "Moderate"
        elif last_p < ema20 and rsi < 50:
            bias = "BEARISH"
            strength = "High" if rsi < 40 else "Moderate"
        else:
            bias = "NEUTRAL"
            strength = "Low"
            
        matrix.append({
            "timeframe": tf,
            "bias": bias,
            "strength": strength,
            "rsi": round(rsi, 1),
            "ema_trend": "Above EMA20" if last_p > ema20 else "Below EMA20"
        })
        
    return {"symbol": symbol, "matrix": matrix}

@app.get("/api/news")
def get_economic_news():
    now = datetime.now()
    events = [
        {
            "id": 1,
            "time": (now + timedelta(hours=2)).strftime("%H:%M"),
            "currency": "USD",
            "event": "US Core CPI (MoM)",
            "impact": "HIGH",
            "forecast": "0.3%",
            "previous": "0.2%",
            "sentiment": "BULLISH_USD",
            "gold_effect": "BEARISH_GOLD"
        },
        {
            "id": 2,
            "time": (now + timedelta(hours=4, minutes=30)).strftime("%H:%M"),
            "currency": "USD",
            "event": "Initial Jobless Claims",
            "impact": "HIGH",
            "forecast": "221K",
            "previous": "225K",
            "sentiment": "NEUTRAL",
            "gold_effect": "VOLATILE"
        }
    ]
    return {
        "updated_at": now.strftime("%Y-%m-%d %H:%M:%S"),
        "overall_gold_sentiment": "BULLISH (Safe Haven Demand & Rate Cut Expectations)",
        "usd_index_bias": "SIDEWAYS / CONSOLIDATION",
        "events": events
    }
