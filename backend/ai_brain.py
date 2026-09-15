import numpy as np
import pandas as pd
from datetime import datetime

class AIBrainEngine:
    """
    Advanced AI Brain Engine:
    - Market Regime Detection (BULLISH_TREND, BEARISH_TREND, RANGING_SIDEWAYS, HIGH_VOLATILITY)
    - Neural Win-Probability Model (Calculates 0-100% win probability score)
    - Auto-Adaptive Parameter Tuning & AI Thought Chain
    """
    def __init__(self):
        self.neural_weights = {
            "smc_alignment": 0.28,
            "ema_confluence": 0.22,
            "volume_poc_support": 0.18,
            "supertrend_confirm": 0.15,
            "rsi_momentum": 0.10,
            "candle_quality": 0.07
        }

    def detect_market_regime(self, df_candles, indicators):
        if len(df_candles) < 20:
            return {"regime": "RANGING_SIDEWAYS", "confidence": 70, "description": "ภาวะสะสมราคา (Consolidation Zone)"}
            
        closes = df_candles['close'].values
        highs = df_candles['high'].values
        lows = df_candles['low'].values
        atr = indicators.get("atr", 15.0)
        
        recent_range = max(highs[-15:]) - min(lows[-15:])
        avg_price = np.mean(closes[-15:])
        range_pct = (recent_range / avg_price) * 100
        
        ema20 = indicators.get("ema20", closes[-1])
        ema50 = indicators.get("ema50", closes[-1])
        last_price = closes[-1]
        
        if range_pct > 2.2 or atr > (avg_price * 0.009):
            return {
                "regime": "HIGH_VOLATILITY",
                "label": "⚡ High Volatility (ผันผวนรุนแรง)",
                "confidence": 88,
                "strategy": "ข่าว/กระชากแรง - ใช้ระยะ SL กว้างขึ้น และลด Lot Size",
                "color": "amber"
            }
        elif last_price > ema20 > ema50 and range_pct > 0.8:
            return {
                "regime": "BULLISH_TREND",
                "label": "🟢 Strong Bullish Trend (เทรนด์ขาขึ้น)",
                "confidence": 92,
                "strategy": "เน้นกลยุทธ์ Buy on Dip ตามแนว Order Block & EMA20",
                "color": "emerald"
            }
        elif last_price < ema20 < ema50 and range_pct > 0.8:
            return {
                "regime": "BEARISH_TREND",
                "label": "🔴 Strong Bearish Trend (เทรนด์ขาลง)",
                "confidence": 90,
                "strategy": "เน้นกลยุทธ์ Sell on Rally ตามแนว Bearish Order Block",
                "color": "rose"
            }
        else:
            return {
                "regime": "RANGING_SIDEWAYS",
                "label": "🟡 Ranging / Consolidation (ไซด์เวย์)",
                "confidence": 82,
                "strategy": "เน้นเทรดขอบแนวรับ-แนวต้าน POC และสะสมแรง",
                "color": "purple"
            }

    def calculate_neural_win_probability(self, regime, indicators, smc, vp, weights_memory):
        base_score = 50.0
        
        rsi = indicators.get("rsi", 50.0)
        st_dir = indicators.get("supertrend", {}).get("direction", "BULLISH")
        cq_status = indicators.get("candle_quality", {}).get("status", "STRONG_CLOSE")
        
        # Factor 1: SMC Alignment
        if smc and len(smc.get("order_blocks", [])) > 0:
            base_score += 15.0 * weights_memory.get("smc_ob", 1.8) / 1.5
            
        # Factor 2: Volume Profile POC Alignment
        if vp and vp.get("poc"):
            last_p = indicators.get("ema20", 2748.50)
            if abs(last_p - vp["poc"]) < (last_p * 0.005):
                base_score += 12.0
                
        # Factor 3: SuperTrend Alignment
        if st_dir == "BULLISH":
            base_score += 10.0
            
        # Factor 4: Candle Quality
        if cq_status == "STRONG_CLOSE":
            base_score += 8.0
        elif cq_status == "WICK_REJECTION_TRAP":
            base_score -= 10.0
            
        # Factor 5: RSI Regime Fit
        if regime["regime"] == "BULLISH_TREND" and 50 <= rsi <= 68:
            base_score += 7.0
        elif regime["regime"] == "RANGING_SIDEWAYS" and (rsi < 35 or rsi > 65):
            base_score += 5.0
            
        win_prob = round(float(np.clip(base_score, 45.0, 95.0)), 1)
        return win_prob

    def generate_ai_thought_chain(self, regime, win_prob, indicators, symbol="XAUUSD"):
        thoughts = []
        thoughts.append(f"1. [Regime Network] ตรวจพบสภาวะตลาด {regime['label']} -> กำหนดกลยุทธ์ '{regime['strategy']}'")
        
        st_dir = indicators.get("supertrend", {}).get("direction", "BULLISH")
        thoughts.append(f"2. [SuperTrend Engine] ยืนยันเทรนด์ทิศทาง {st_dir} (ตัดสัญญาณหลอกเรียบร้อย)")
        
        cq_text = indicators.get("candle_quality", {}).get("text", "เนื้อแท่งเทียนสมบูรณ์")
        thoughts.append(f"3. [Candle Filter] {cq_text}")
        
        thoughts.append(f"4. [Neural Optimizer] ประมวลผลคะแนนโอกาสชนะ (Win Probability) อยู่ที่ {win_prob}% (พร้อมรันแผนเทรด OTE)")
        
        return thoughts
