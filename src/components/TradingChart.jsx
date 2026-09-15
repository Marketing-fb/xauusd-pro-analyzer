import React, { useRef, useEffect, useState } from 'react';
import { Layers, Eye, EyeOff, BarChart2, Bell, Activity, Zap } from 'lucide-react';

export default function TradingChart({ marketData, activeSymbol, activeTimeframe, alerts = [], signalData = null }) {
  const canvasRef = useRef(null);
  
  const [showEMA, setShowEMA] = useState(true);
  const [showSMC, setShowSMC] = useState(true);
  const [showRSI, setShowRSI] = useState(true);
  const [showAlertLines, setShowAlertLines] = useState(true);
  const [showVolumeProfile, setShowVolumeProfile] = useState(true);
  const [showSuperTrend, setShowSuperTrend] = useState(true);

  useEffect(() => {
    if (!marketData || !marketData.candles || marketData.candles.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);
    
    let rsiHeight = showRSI ? 80 : 0;
    const mainHeight = height - rsiHeight - 30;
    
    const candles = marketData.candles;
    const count = candles.length;
    
    let minPrice = Math.min(...candles.map(c => c.low));
    let maxPrice = Math.max(...candles.map(c => c.high));
    const pricePadding = (maxPrice - minPrice) * 0.05 || 10;
    minPrice -= pricePadding;
    maxPrice += pricePadding;
    
    const candleWidth = (width - 70) / count;
    
    const getPriceY = (price) => {
      return mainHeight - ((price - minPrice) / (maxPrice - minPrice)) * mainHeight;
    };

    // Draw Grid Lines & Price Scale
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    const gridSteps = 6;
    for (let i = 0; i <= gridSteps; i++) {
      const y = (mainHeight / gridSteps) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width - 65, y);
      ctx.stroke();
      
      const p = maxPrice - ((maxPrice - minPrice) * (i / gridSteps));
      ctx.fillStyle = 'rgba(156, 163, 175, 0.7)';
      ctx.font = '10px sans-serif';
      ctx.fillText(p.toFixed(activeSymbol === 'XAUUSD' || activeSymbol === 'USDJPY' || activeSymbol === 'DXY' ? 2 : 4), width - 60, y + 3);
    }

    // Draw Volume Profile Horizontal Bars (Left Side)
    if (showVolumeProfile && marketData.volume_profile && marketData.volume_profile.bins) {
      const vp = marketData.volume_profile;
      const maxVol = Math.max(...vp.bins.map(b => b.volume || 1));
      const maxBarWidth = 110;
      
      vp.bins.forEach(b => {
        const yTop = getPriceY(b.price_max);
        const yBot = getPriceY(b.price_min);
        const barH = Math.max(Math.abs(yBot - yTop), 2);
        const barW = (b.volume / maxVol) * maxBarWidth;
        
        ctx.fillStyle = b.is_poc
          ? 'rgba(245, 158, 11, 0.4)'
          : b.in_value_area
          ? 'rgba(6, 182, 212, 0.22)'
          : 'rgba(255, 255, 255, 0.08)';
          
        ctx.fillRect(0, yTop, barW, barH);
      });

      if (vp.poc >= minPrice && vp.poc <= maxPrice) {
        const pocY = getPriceY(vp.poc);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 2]);
        ctx.beginPath(); ctx.moveTo(0, pocY); ctx.lineTo(width - 65, pocY); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText(`POC (${vp.poc})`, 120, pocY - 3);
      }
    }

    // Draw SMC Order Blocks & FVGs
    if (showSMC && marketData.smc) {
      marketData.smc.order_blocks.forEach(ob => {
        if (ob.type === 'BULLISH_OB') {
          const yTop = getPriceY(ob.price_max);
          const yBot = getPriceY(ob.price_min);
          ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
          ctx.fillRect(0, yTop, width - 65, Math.max(yBot - yTop, 4));
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(0, yTop, width - 65, Math.max(yBot - yTop, 4));
          ctx.setLineDash([]);
          ctx.fillStyle = '#10b981';
          ctx.font = '9px sans-serif';
          ctx.fillText(`Bullish OB (${ob.price_min})`, 10, yTop + 12);
        } else if (ob.type === 'BEARISH_OB') {
          const yTop = getPriceY(ob.price_max);
          const yBot = getPriceY(ob.price_min);
          ctx.fillStyle = 'rgba(244, 63, 94, 0.12)';
          ctx.fillRect(0, yTop, width - 65, Math.max(yBot - yTop, 4));
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(0, yTop, width - 65, Math.max(yBot - yTop, 4));
          ctx.setLineDash([]);
          ctx.fillStyle = '#f43f5e';
          ctx.font = '9px sans-serif';
          ctx.fillText(`Bearish OB (${ob.price_max})`, 10, yTop + 12);
        }
      });
    }

    // Draw SuperTrend Line (Green when Bullish, Red when Bearish)
    if (showSuperTrend && marketData.indicators?.supertrend?.line) {
      const stLine = marketData.indicators.supertrend.line;
      const isBull = marketData.indicators.supertrend.direction === 'BULLISH';
      ctx.strokeStyle = isBull ? '#10b981' : '#f43f5e';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 2]);
      ctx.beginPath();
      
      candles.forEach((c, idx) => {
        const x = idx * candleWidth + (candleWidth / 2);
        const stVal = stLine[idx] || stLine[stLine.length - 1];
        const y = getPriceY(stVal);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw Candlesticks & Volume
    candles.forEach((c, idx) => {
      const x = idx * candleWidth + (candleWidth / 2);
      const openY = getPriceY(c.open);
      const closeY = getPriceY(c.close);
      const highY = getPriceY(c.high);
      const lowY = getPriceY(c.low);
      
      const isBullish = c.close >= c.open;
      const color = isBullish ? '#10b981' : '#f43f5e';
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();
      
      const bodyY = Math.min(openY, closeY);
      const bodyH = Math.max(Math.abs(closeY - openY), 2);
      const w = Math.max(candleWidth * 0.7, 3);
      
      ctx.fillStyle = color;
      ctx.fillRect(x - w / 2, bodyY, w, bodyH);
      
      const maxVol = Math.max(...candles.map(item => item.volume || 1000));
      const volH = ((c.volume || 1000) / maxVol) * 40;
      ctx.fillStyle = isBullish ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)';
      ctx.fillRect(x - w / 2, mainHeight - volH, w, volH);
    });

    // Draw Current Live Price Line & Right Scale Live Price Badge Tag
    const lastCandle = candles[candles.length - 1];
    const livePriceVal = marketData.last_price || (lastCandle ? lastCandle.close : 0);
    if (livePriceVal >= minPrice && livePriceVal <= maxPrice) {
      const priceY = getPriceY(livePriceVal);
      const isUp = lastCandle ? lastCandle.close >= lastCandle.open : true;
      const themeColor = isUp ? '#10b981' : '#f43f5e';
      
      // Horizontal dashed live price line across full grid
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(0, priceY);
      ctx.lineTo(width - 65, priceY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Right Axis Glowing Live Price Badge Tag
      const badgeW = 60;
      const badgeH = 20;
      const badgeX = width - 64;
      const badgeY = priceY - badgeH / 2;
      
      ctx.fillStyle = themeColor;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4);
        ctx.fill();
      } else {
        ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
      }
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      const dec = (activeSymbol === 'XAUUSD' || activeSymbol === 'USDJPY' || activeSymbol === 'DXY') ? 2 : 4;
      const formattedPrice = livePriceVal.toFixed(dec);
      ctx.fillText(formattedPrice, badgeX + 7, priceY + 3.5);
    }

    // Draw Signal Level Lines (SL, TP1, TP2)
    if (signalData) {
      const drawSignalLine = (priceVal, labelText, strokeColor) => {
        if (!priceVal || priceVal < minPrice || priceVal > maxPrice) return;
        const y = getPriceY(priceVal);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width - 65, y);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = strokeColor;
        ctx.fillRect(width - 65, y - 9, 60, 18);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText(labelText, width - 60, y + 3);
      };

      if (signalData.sl) drawSignalLine(signalData.sl, `SL ${signalData.sl}`, '#f43f5e');
      if (signalData.tp1) drawSignalLine(signalData.tp1, `TP1 ${signalData.tp1}`, '#10b981');
      if (signalData.tp2) drawSignalLine(signalData.tp2, `TP2 ${signalData.tp2}`, '#10b981');
    }

    // Draw Price Alert Lines
    if (showAlertLines && alerts.length > 0) {
      alerts.forEach(al => {
        if (al.symbol === activeSymbol && al.targetPrice >= minPrice && al.targetPrice <= maxPrice) {
          const y = getPriceY(al.targetPrice);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 4]);
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width - 65, y);
          ctx.stroke();
          ctx.setLineDash([]);
          
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(width - 65, y - 9, 60, 18);
          ctx.fillStyle = '#090d16';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText(`🔔 ${al.targetPrice}`, width - 60, y + 3);
        }
      });
    }

    // Draw Indicators (EMA)
    if (showEMA) {
      const closes = candles.map(c => c.close);
      
      const drawEMA = (period, strokeColor) => {
        let k = 2 / (period + 1);
        let ema = closes[0];
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        
        candles.forEach((c, idx) => {
          if (idx === 0) {
            ema = c.close;
          } else {
            ema = c.close * k + ema * (1 - k);
          }
          const x = idx * candleWidth + (candleWidth / 2);
          const y = getPriceY(ema);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      };
      
      drawEMA(20, '#06b6d4');
      drawEMA(50, '#f59e0b');
      drawEMA(200, '#a855f7');
    }

    // Draw RSI Subpanel
    if (showRSI) {
      const rsiStartY = mainHeight + 15;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.strokeRect(0, rsiStartY, width - 65, 60);
      
      const y30 = rsiStartY + 60 - (30 / 100) * 60;
      const y70 = rsiStartY + 60 - (70 / 100) * 60;
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(0, y70); ctx.lineTo(width - 65, y70); ctx.stroke();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.beginPath(); ctx.moveTo(0, y30); ctx.lineTo(width - 65, y30); ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      candles.forEach((c, idx) => {
        const x = idx * candleWidth + (candleWidth / 2);
        const rsiVal = marketData.indicators.rsi;
        const y = rsiStartY + 60 - (rsiVal / 100) * 60;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      
      ctx.fillStyle = '#f59e0b';
      ctx.font = '10px sans-serif';
      ctx.fillText(`RSI(14): ${marketData.indicators.rsi.toFixed(1)}`, 10, rsiStartY + 14);
      ctx.fillText('70', width - 60, y70 + 3);
      ctx.fillText('30', width - 60, y30 + 3);
    }

  }, [marketData, showEMA, showSMC, showRSI, showAlertLines, showVolumeProfile, showSuperTrend, alerts, signalData]);

  if (!marketData) return null;

  return (
    <div className="glass-panel p-4 flex flex-col h-full">
      {/* Chart Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4" /> {activeSymbol} ({activeTimeframe})
          </span>
          <span className="text-lg font-mono font-bold text-white">
            {marketData.last_price}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
            marketData.change_pct >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            {marketData.change_pct >= 0 ? '+' : ''}{marketData.change_pct}%
          </span>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => setShowSuperTrend(!showSuperTrend)}
            className={`px-2.5 py-1 rounded font-medium border transition-all ${
              showSuperTrend ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-gray-900/60 border-gray-800 text-gray-500'
            }`}
          >
            SuperTrend
          </button>

          <button
            onClick={() => setShowVolumeProfile(!showVolumeProfile)}
            className={`px-2.5 py-1 rounded font-medium border transition-all ${
              showVolumeProfile ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-gray-900/60 border-gray-800 text-gray-500'
            }`}
          >
            Volume Profile
          </button>

          <button
            onClick={() => setShowEMA(!showEMA)}
            className={`px-2.5 py-1 rounded font-medium border transition-all ${
              showEMA ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-gray-900/60 border-gray-800 text-gray-500'
            }`}
          >
            EMA
          </button>

          <button
            onClick={() => setShowSMC(!showSMC)}
            className={`px-2.5 py-1 rounded font-medium border transition-all ${
              showSMC ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-gray-900/60 border-gray-800 text-gray-500'
            }`}
          >
            SMC
          </button>

          <button
            onClick={() => setShowAlertLines(!showAlertLines)}
            className={`px-2.5 py-1 rounded font-medium border transition-all flex items-center gap-1 ${
              showAlertLines ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-gray-900/60 border-gray-800 text-gray-500'
            }`}
          >
            <Bell className="w-3 h-3" /> Alerts ({alerts.length})
          </button>
        </div>
      </div>

      {/* Main Canvas Chart */}
      <div className="relative flex-1 min-h-[380px] w-full">
        <canvas
          ref={canvasRef}
          className="w-full h-full block rounded-lg bg-gray-950/70 border border-gray-800/80"
        />
      </div>
      
      {/* Legend & Stats Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400 mt-3 pt-2 border-t border-gray-800/60">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-emerald-400"></span> SuperTrend: <strong className="text-emerald-300">{marketData.indicators?.supertrend?.value} ({marketData.indicators?.supertrend?.direction})</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-amber-400"></span> POC: <strong className="text-amber-300">{marketData.volume_profile?.poc}</strong>
          </span>
        </div>
        <div>
          Candle Quality: <strong className="text-cyan-300">{marketData.indicators?.candle_quality?.text || 'Normal'}</strong>
        </div>
      </div>
    </div>
  );
}
