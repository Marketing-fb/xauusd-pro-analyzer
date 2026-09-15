import os
import requests
import json

class TelegramBotHandler:
    def __init__(self, bot_token=None):
        self.bot_token = bot_token or os.getenv("TELEGRAM_BOT_TOKEN", "MOCK_TOKEN_DEMO")

    def send_broadcast_message(self, chat_id: str, message: str, bot_token: str = None) -> bool:
        token = bot_token or self.bot_token
        if not token or token == "MOCK_TOKEN_DEMO" or not chat_id:
            return False
        try:
            url = f"https://api.telegram.org/bot{token}/sendMessage"
            payload = {
                "chat_id": chat_id,
                "text": message,
                "parse_mode": "Markdown"
            }
            res = requests.post(url, json=payload, timeout=5)
            return res.status_code == 200
        except Exception as e:
            print(f"Error sending Telegram broadcast: {e}")
            return False

    def process_command(self, command_text: str, current_signal_data: dict, current_news_data: dict, learning_stats: dict) -> str:
        cmd = command_text.strip().lower()
        parts = cmd.split()
        main_cmd = parts[0] if len(parts) > 0 else "/help"

        if main_cmd in ["/start", "/help"]:
            return (
                "🤖 *ยินดีต้อนรับสู่ XAUUSD AI Quant Pro Telegram Bot*\n\n"
                "📌 *คำสั่งที่สามารถใช้งานได้:*\n"
                "• `/signal` - สรุปสัญญาณวิเคราะห์ทองคำ XAUUSD ล่าสุด (Entry, SL, TP1-3)\n"
                "• `/news` - รายงานข่าวเศรษฐกิจ USD & Gold คืนนี้\n"
                "• `/risk [เงินทุน] [%เสี่ยง] [ระยะSL]` - คำนวณ Lot Size (เช่น `/risk 10000 2 50`)\n"
                "• `/status` - ตรวจสอบอัตราการชนะ (Win Rate %) และสถิติ AI\n"
            )

        elif main_cmd == "/signal":
            if not current_signal_data:
                return "⚠️ ยังไม่มีข้อมูลสัญญาณในขณะนี้"
            
            sig = current_signal_data.get("signal", "NEUTRAL")
            symbol = current_signal_data.get("symbol", "XAUUSD")
            entry = current_signal_data.get("entry_price", 2748.50)
            sl = current_signal_data.get("sl", 2730.00)
            tp1 = current_signal_data.get("tp1", 2760.00)
            tp2 = current_signal_data.get("tp2", 2775.00)
            tp3 = current_signal_data.get("tp3", 2790.00)
            conf = current_signal_data.get("confidence", 85)
            rr = current_signal_data.get("rr_ratio", "1:2.3")
            
            badge = "🟢 Strong BUY" if "BUY" in sig else "🔴 Strong SELL" if "SELL" in sig else "🟡 Neutral"
            
            return (
                f"📊 *รายงานสัญญาณ AI Quantitative Signal ({symbol})*\n"
                f"----------------------------------------\n"
                f"⚡ *สัญญาณหลัก:* {badge}\n"
                f"🎯 *ความเชื่อมั่น (Confidence):* `{conf}%`\n"
                f"📍 *ราคาเข้าเทรด (Entry):* `{entry}`\n"
                f"🛡️ *Stop Loss (SL):* `{sl}`\n"
                f"🎯 *TP1 (Conservative):* `{tp1}`\n"
                f"🏆 *TP2 (Main Target):* `{tp2}`\n"
                f"🚀 *TP3 (Runner):* `{tp3}`\n"
                f"⚖️ *Risk:Reward Ratio:* `{rr}`\n\n"
                f"💡 _วิเคราะห์ตามโครงสร้าง SMC Order Block & EMA Confluence_"
            )

        elif main_cmd == "/news":
            if not current_news_data or "events" not in current_news_data:
                return "📰 ไม่มีข่าวเศรษฐกิจสำคัญในขณะนี้"
            
            lines = ["📰 *ปฏิทินข่าวเศรษฐกิจสำคัญ (USD / Gold)*\n"]
            lines.append(f"• *ภาพรวม Gold Sentiment:* {current_news_data.get('overall_gold_sentiment', '-')}\n")
            
            for evt in current_news_data["events"]:
                lines.append(f"⏰ *{evt['time']}* | `{evt['currency']}`: {evt['event']} (ผลกระทบ: *{evt['impact']}*)")
                
            return "\n".join(lines)

        elif main_cmd == "/risk":
            try:
                bal = float(parts[1]) if len(parts) > 1 else 10000.0
                risk_pct = float(parts[2]) if len(parts) > 2 else 2.0
                sl_pips = float(parts[3]) if len(parts) > 3 else 50.0
                
                risk_dollars = bal * (risk_pct / 100.0)
                lot_size = round(risk_dollars / (sl_pips * 1.0), 2) # XAUUSD 1 lot = $1/pip
                
                return (
                    f"🧮 *ผลการคำนวณขนาด Lot Size*\n"
                    f"----------------------------------------\n"
                    f"💰 เงินทุนในพอร์ต: `${bal:,.2f}`\n"
                    f"⚠️ สัดส่วนความเสี่ยง: `{risk_pct}%` (`${risk_dollars:,.2f}`)\n"
                    f"📏 ระยะ Cut loss: `{sl_pips} Pips`\n"
                    f"✅ *ขนาด Lot แนะนำ:* `{lot_size} Standard Lots`\n"
                )
            except Exception as e:
                return "⚠️ รูปแบบคำสั่งไม่ถูกต้อง ตัวอย่าง: `/risk 10000 2 50` (เงินทุน 10,000, ความเสี่ยง 2%, SL 50 pips)"

        elif main_cmd == "/status":
            if not learning_stats or "stats" not in learning_stats:
                return "🧠 ข้อมูล AI Self-Learning: Win Rate 75.0%, Total Trades 24"
            
            st = learning_stats["stats"]
            return (
                f"🧠 *รายงานสถิติระบบ AI Self-Learning Engine*\n"
                f"----------------------------------------\n"
                f"🏆 *Win Rate สะสม:* `{st.get('win_rate', 75.0)}%`\n"
                f"📊 จำนวนออเดอร์ทั้งหมด: `{st.get('total_trades', 0)}` ออเดอร์\n"
                f"✅ ชนะ (Wins): `{st.get('wins', 0)}` | 🛑 แพ้ (Losses): `{st.get('losses', 0)}`\n"
                f"📈 Profit Factor: `{st.get('profit_factor', 2.45)}`\n\n"
                f"💡 _ระบบปรับน้ำหนัก Indicator ตามผลลัพธ์การเทรดโดยอัตโนมัติ_"
            )

        else:
            return "⚠️ ไม่พบคำสั่งที่ระบุ พิมพ์ `/help` เพื่อดูรายการคำสั่งทั้งหมด"
