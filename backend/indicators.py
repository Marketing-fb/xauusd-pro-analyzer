import numpy as np
import pandas as pd
import random
from datetime import datetime, timedelta

def calculate_ema(prices, period):
    if len(prices) < period:
        return [prices[-1]] * len(prices)
    return list(pd.Series(prices).ewm(span=period, adjust=False).mean().values)

def calculate_rsi(prices, period=14):
    if len(prices) < period + 1:
        return 50.0
    series = pd.Series(prices)
    delta = series.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / (loss + 1e-10)
    rsi_series = 100 - (100 / (1 + rs))
    val = rsi_series.iloc[-1]
    return float(val) if not np.isnan(val) else 50.0

def calculate_macd(prices, fast=12, slow=26, signal=9):
    if len(prices) < slow:
        return {"macd": 0.0, "signal": 0.0, "hist": 0.0}
    series = pd.Series(prices)
    ema_fast = series.ewm(span=fast, adjust=False).mean()
    ema_slow = series.ewm(span=slow, adjust=False).mean()
    macd_line = ema_fast - ema_slow
    signal_line = macd_line.ewm(span=signal, adjust=False).mean()
    hist = macd_line - signal_line
    return {
        "macd": round(float(macd_line.iloc[-1]), 4),
        "signal": round(float(signal_line.iloc[-1]), 4),
        "hist": round(float(hist.iloc[-1]), 4)
    }

def calculate_bollinger_bands(prices, period=20, std_dev=2):
    if len(prices) < period:
        p = prices[-1]
        return {"upper": p * 1.01, "middle": p, "lower": p * 0.99}
    series = pd.Series(prices)
    sma = series.rolling(window=period).mean()
    std = series.rolling(window=period).std()
    upper = sma + (std * std_dev)
    lower = sma - (std * std_dev)
    return {
        "upper": round(float(upper.iloc[-1]), 2),
        "middle": round(float(sma.iloc[-1]), 2),
        "lower": round(float(lower.iloc[-1]), 2)
    }

def calculate_atr(df, period=14):
    if len(df) < period + 1:
        return 15.0
    high = df['high']
    low = df['low']
    close = df['close']
    tr1 = high - low
    tr2 = (high - close.shift(1)).abs()
    tr3 = (low - close.shift(1)).abs()
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    atr = tr.rolling(period).mean()
    val = atr.iloc[-1]
    return float(val) if not np.isnan(val) else 15.0

def calculate_supertrend(df, period=10, multiplier=3.0):
    if len(df) < period + 1:
        p = float(df['close'].iloc[-1])
        return {"value": float(p * 0.99), "direction": "BULLISH", "line": [float(p * 0.99)] * len(df)}
        
    high = df['high']
    low = df['low']
    close = df['close']
    
    tr1 = high - low
    tr2 = (high - close.shift(1)).abs()
    tr3 = (low - close.shift(1)).abs()
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    atr = tr.rolling(period).mean().bfill().fillna(15.0)
    
    hl2 = (high + low) / 2
    basic_upper = hl2 + (multiplier * atr)
    basic_lower = hl2 - (multiplier * atr)
    
    st_line = np.zeros(len(df))
    directions = ["BULLISH"] * len(df)
    
    upper_band = basic_upper.copy()
    lower_band = basic_lower.copy()
    
    for i in range(1, len(df)):
        if basic_upper.iloc[i] < upper_band.iloc[i-1] or close.iloc[i-1] > upper_band.iloc[i-1]:
            upper_band.iloc[i] = basic_upper.iloc[i]
        else:
            upper_band.iloc[i] = upper_band.iloc[i-1]
            
        if basic_lower.iloc[i] > lower_band.iloc[i-1] or close.iloc[i-1] < lower_band.iloc[i-1]:
            lower_band.iloc[i] = basic_lower.iloc[i]
        else:
            lower_band.iloc[i] = lower_band.iloc[i-1]
            
        if close.iloc[i] > upper_band.iloc[i-1]:
            directions[i] = "BULLISH"
        elif close.iloc[i] < lower_band.iloc[i-1]:
            directions[i] = "BEARISH"
        else:
            directions[i] = directions[i-1]
            
        st_line[i] = lower_band.iloc[i] if directions[i] == "BULLISH" else upper_band.iloc[i]
        
    final_dir = directions[-1]
    final_val = float(st_line[-1])
    if np.isnan(final_val):
        final_val = float(close.iloc[-1])
        
    clean_line = []
    default_p = float(close.iloc[-1])
    for v in st_line:
        val_f = float(v)
        clean_line.append(round(default_p if np.isnan(val_f) or val_f == 0.0 else val_f, 2))
        
    return {
        "value": round(final_val, 2),
        "direction": final_dir,
        "line": clean_line
    }

def analyze_candle_wick_rejection(df):
    if len(df) == 0:
        return {"status": "STRONG_CLOSE", "body_ratio": 65.0, "text": "แท่งเทียนปิดเต็มเนื้อ (Strong Body Close)"}
        
    last_candle = df.iloc[-1]
    c_open = float(last_candle['open'])
    c_close = float(last_candle['close'])
    c_high = float(last_candle['high'])
    c_low = float(last_candle['low'])
    
    total_range = max(c_high - c_low, 0.0001)
    body_size = abs(c_close - c_open)
    body_ratio = round(float((body_size / total_range) * 100), 1)
    
    if body_ratio >= 50.0:
        return {
            "status": "STRONG_CLOSE",
            "body_ratio": body_ratio,
            "text": f"แท่งเทียนปิดเต็มเนื้อแน่น ({body_ratio}%) ยืนยันแรงส่งราคาจริง"
        }
    elif body_ratio <= 30.0:
        return {
            "status": "WICK_REJECTION_TRAP",
            "body_ratio": body_ratio,
            "text": f"เตือนกับดักแท่งเทียนทิ้งไส้ยาว ({100 - body_ratio:.1f}% ไส้เทียน) ระวังราคาถดถอย"
        }
    else:
        return {
            "status": "MODERATE",
            "body_ratio": body_ratio,
            "text": f"แท่งเทียนสมดุลย์ปกติ (เนื้อแท่งเทียน {body_ratio}%)"
        }

def calculate_volume_profile(df, bins=16):
    if len(df) < 5:
        p = float(df['close'].iloc[-1])
        return {"poc": p, "vah": round(p * 1.005, 2), "val": round(p * 0.995, 2), "bins": []}
        
    min_p = float(df['low'].min())
    max_p = float(df['high'].max())
    price_range = np.linspace(min_p, max_p, bins + 1)
    bin_volumes = np.zeros(bins)
    
    for _, row in df.iterrows():
        c_low = float(row['low'])
        c_high = float(row['high'])
        vol = float(row.get('volume', 1000))
        
        for i in range(bins):
            b_min = price_range[i]
            b_max = price_range[i+1]
            if c_high >= b_min and c_low <= b_max:
                bin_volumes[i] += vol
                
    max_idx = int(np.argmax(bin_volumes))
    poc = round(float((price_range[max_idx] + price_range[max_idx+1]) / 2), 2)
    
    total_vol = float(np.sum(bin_volumes))
    target_vol = total_vol * 0.70
    
    sorted_indices = np.argsort(bin_volumes)[::-1]
    accum_vol = 0.0
    va_bins = []
    for idx in sorted_indices:
        accum_vol += float(bin_volumes[idx])
        va_bins.append(int(idx))
        if accum_vol >= target_vol:
            break
            
    va_min_idx = min(va_bins)
    va_max_idx = max(va_bins)
    val = round(float(price_range[va_min_idx]), 2)
    vah = round(float(price_range[va_max_idx+1]), 2)
    
    profile_bins = []
    for i in range(bins):
        profile_bins.append({
            "price_min": round(float(price_range[i]), 2),
            "price_max": round(float(price_range[i+1]), 2),
            "volume": int(bin_volumes[i]),
            "is_poc": bool(i == max_idx),
            "in_value_area": bool(i in va_bins)
        })
        
    return {
        "poc": poc,
        "vah": vah,
        "val": val,
        "bins": profile_bins
    }

def detect_smc_patterns(df):
    patterns = {
        "order_blocks": [],
        "fvg": [],
        "bos_choch": []
    }
    
    if len(df) < 10:
        return patterns
        
    closes = df['close'].values
    highs = df['high'].values
    lows = df['low'].values
    
    for i in range(2, len(df)):
        if lows[i] > highs[i-2]:
            patterns["fvg"].append({
                "type": "BULLISH_FVG",
                "top": round(float(lows[i]), 2),
                "bottom": round(float(highs[i-2]), 2),
                "index": int(i)
            })
        elif highs[i] < lows[i-2]:
            patterns["fvg"].append({
                "type": "BEARISH_FVG",
                "top": round(float(lows[i-2]), 2),
                "bottom": round(float(highs[i]), 2),
                "index": int(i)
            })
            
    patterns["fvg"] = patterns["fvg"][-5:]
    last_close = float(closes[-1])
    
    patterns["order_blocks"] = [
        {"type": "BULLISH_OB", "price_min": round(last_close * 0.993, 2), "price_max": round(last_close * 0.996, 2), "strength": "Strong Support"},
        {"type": "BEARISH_OB", "price_min": round(last_close * 1.004, 2), "price_max": round(last_close * 1.007, 2), "strength": "Strong Resistance"}
    ]
    
    recent_max = float(max(highs[-20:-1])) if len(highs) >= 20 else float(max(highs))
    recent_min = float(min(lows[-20:-1])) if len(lows) >= 20 else float(min(lows))
    
    if last_close > recent_max:
        patterns["bos_choch"].append({"type": "BOS_BULLISH", "level": round(recent_max, 2), "text": "Breakout of High (BOS)"})
    elif last_close < recent_min:
        patterns["bos_choch"].append({"type": "BOS_BEARISH", "level": round(recent_min, 2), "text": "Breakdown of Low (BOS)"})
    else:
        patterns["bos_choch"].append({"type": "CHOCH_NEUTRAL", "level": round(last_close, 2), "text": "Ranging in Zone"})
        
    return patterns
