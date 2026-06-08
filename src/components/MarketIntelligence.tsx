/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  RefreshCw, 
  Activity, 
  TrendingDown, 
  Compass, 
  HelpCircle, 
  AlertTriangle, 
  Heart, 
  FileText 
} from 'lucide-react';

export default function MarketIntelligence() {
  const [intelData, setIntelData] = useState<{
    sentiment: { positive: number; negative: number; neutral: number };
    heatmap: Array<{ brand: string; deviations: Array<{ time: string; deviation: number }> }>;
    logs: Array<{
      id: string;
      timestamp: string;
      dimension: '浠锋牸寮傚父鐩戞帶' | '鍙ｇ杞姌鐩戞帶' | '鍙傛暟闈╂柊鐩戞帶';
      subject: string;
      rawValue: string;
      alertLevel: '楂樺嵄' | '鍏虫敞' | '姝ｅ父';
      triggerPoint: string;
      meta?: { priceDeviation?: number; sentimentScore?: number; innovations?: string[] };
    }>;
    timestamp: string;
  } | null>(null);
  const [intelLoading, setIntelLoading] = useState(false);
  const [intelAutoPoll, setIntelAutoPoll] = useState(false);
  const [intelLastFetch, setIntelLastFetch] = useState<string>('');

  const fetchMarketIntelligence = async () => {
    try {
      setIntelLoading(true);
      const res = await fetch('/api/market-intelligence');
      const data = await res.json();
      if (data.success) {
        setIntelData(data);
        setIntelLastFetch(data.timestamp || new Date().toLocaleTimeString('zh-CN'));
      }
    } catch (e) {
      console.error('Failed to load market intelligence:', e);
    } finally {
      setIntelLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketIntelligence();
  }, []);

  useEffect(() => {
    if (!intelAutoPoll) return;
    const interval = setInterval(() => {
      fetchMarketIntelligence();
    }, 60000); // Polling every 60 seconds
    return () => clearInterval(interval);
  }, [intelAutoPoll]);

  return (
    <div className="space-y-6">
      
      {/* Tab Header / Navigation Meta */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <h1 className="text-xl font-sans font-bold text-slate-900 tracking-tight flex items-center gap-2">
              甯傚満鎯呮姤棰勮鐪嬫澘 <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-mono font-bold">API ACTIVE</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            瀹炴椂姹囪仛绗笁鏂瑰叕寮€鏁版嵁API娴侊紝绮惧噯杩囨护鎻愬彇浠锋牸寮傚父銆佸彛纰戦鍚戝強鎶€鏈弬鏁板彉鏇淬€?          </p>
        </div>

        {/* Global Controls - styled consistently with other header toolbars */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 text-xs shadow-xs">
          <label className="flex items-center space-x-2 cursor-pointer px-2 select-none">
            <input 
              type="checkbox"
              checked={intelAutoPoll}
              onChange={(e) => setIntelAutoPoll(e.target.checked)}
              className="rounded border-slate-300 text-slate-900 focus:ring-slate-500 h-3.5 w-3.5 cursor-pointer"
            />
            <span className="text-slate-600 font-medium font-sans">鑷姩杞 API (60s)</span>
          </label>

          <div className="h-4 w-[1px] bg-slate-200"></div>

          <span className="text-[11px] text-slate-400 font-mono">
            涓婃鍚屾: {intelLastFetch || '鑾峰彇涓?..'}
          </span>

          <button
            onClick={fetchMarketIntelligence}
            disabled={intelLoading}
            className={`px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition flex items-center space-x-1.5 cursor-pointer text-xs font-semibold ${intelLoading ? 'opacity-75' : ''}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${intelLoading ? 'animate-spin' : ''}`} />
            <span>绔嬪嵆鏇存柊</span>
          </button>
        </div>
      </div>

      {/* Main Grid matching the white card / light elegant borders of Overview page */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: 瀹炴椂棰勮娴?涓?浠锋牸璋冮檷鍋忕鐭╅樀 鍚屽 (xl:col-span-7) */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          
          {/* R1: 瀹炴椂棰勮鎯呮姤娴?(Live Feeds) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col h-[400px] space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-rose-50 text-rose-500 rounded-lg">
                  <Activity className="w-4 h-4" />
                </span>
                <span className="font-sans font-bold text-slate-900 text-sm">
                  瀹炴椂棰勮鎯呮姤娴?(Live Feeds)
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-slate-50 text-slate-500 border border-slate-200 px-2 py-0.5 rounded">
                AUTO UPDATES
              </span>
            </div>

            {/* Timeline Feed Stream in light mode style with flex-grow to perfectly fill viewport */}
            <div className="space-y-4 flex-grow overflow-y-auto pr-1 scrollbar-thin">
              {intelData?.logs.map((log) => {
                const isHighRisk = log.alertLevel === '楂樺嵄';
                const isWarning = log.alertLevel === '鍏虫敞';

                let levelBadge = "border-slate-200 bg-slate-50 text-slate-600";
                let bulletLight = "bg-slate-400";
                if (isHighRisk) {
                  levelBadge = "border-rose-100 bg-rose-50 text-rose-700 font-bold";
                  bulletLight = "bg-rose-500 ring-4 ring-rose-100";
                } else if (isWarning) {
                  levelBadge = "border-amber-100 bg-amber-50 text-amber-700 font-bold";
                  bulletLight = "bg-amber-500 ring-4 ring-amber-100";
                }

                let dimensionBadge = "border-slate-200 bg-slate-50 text-slate-600";
                if (log.dimension === '浠锋牸寮傚父鐩戞帶') {
                  dimensionBadge = "border-blue-105 bg-blue-50/50 text-blue-700";
                } else if (log.dimension === '鍙ｇ杞姌鐩戞帶') {
                  dimensionBadge = "border-pink-105 bg-pink-50/50 text-pink-700";
                } else if (log.dimension === '鍙傛暟闈╂柊鐩戞帶') {
                  dimensionBadge = "border-violet-105 bg-violet-50/50 text-violet-700";
                }

                return (
                  <div key={log.id} className="relative pl-6 border-l-2 border-slate-100 hover:border-slate-300 transition py-1 group">
                    
                    {/* Timeline bullet tag */}
                    <span className={`absolute -left-[6px] top-4 w-2.5 h-2.5 rounded-full transition-all duration-300 ${bulletLight}`}></span>

                    <div className="bg-slate-50/40 hover:bg-slate-50/80 border border-slate-200/60 hover:border-slate-200/95 p-4 rounded-2xl space-y-3 transition duration-200">
                      
                      {/* Header meta */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded border ${dimensionBadge} text-[10px] font-bold`}>
                            {log.dimension}
                          </span>
                          <span className="font-sans font-bold text-slate-800">
                            {log.subject}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] text-slate-400 font-mono font-medium">
                            {log.timestamp}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full border text-[10px] ${levelBadge}`}>
                            {log.alertLevel}
                          </span>
                        </div>
                      </div>

                      {/* Content text */}
                      <p className="text-xs text-slate-600 font-sans leading-relaxed">
                        {log.rawValue}
                      </p>

                      {/* Triggering Configuration / Configuration logic box */}
                      <div className="bg-slate-100/50 border border-slate-200/40 p-2.5 rounded-xl text-[11px] text-slate-500 flex items-start space-x-1.5 font-sans">
                        <span className="text-slate-800 font-semibold select-none">馃搶 瑙ｆ瀽鍒ゅ畾瑙勫垯:</span>
                        <span className="flex-1 text-slate-600">{log.triggerPoint}</span>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* R2: 浠锋牸鍋忕鐭╅樀 (Price Heatmap Grid) - Place here to be identical width as live feeds! */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <TrendingDown className="w-4 h-4" />
                </span>
                <span className="font-sans font-bold text-slate-900 text-sm">
                  閲嶇偣绔炲搧浠锋牸璋冮檷鍋忕鐭╅樀 (鏄ㄦ棩娴姩鏁版嵁)
                </span>
              </div>
              {/* Text tag removed per user request */}
            </div>

            {/* Beautiful, responsive Light Theme Heatmap Grid */}
            <div className="space-y-4">
              
              {/* Heatmap Time Headers */}
              <div className="grid grid-cols-[165px_1fr] items-center gap-1.5 text-[10px] text-slate-400 font-mono text-center font-bold">
                <div className="text-left font-sans text-[10px] text-slate-450 pl-0.5 select-none font-bold">閲嶇偣绔熷搧娆惧紡</div>
                <div className="grid grid-cols-12 gap-1 px-1">
                  {(intelData?.heatmap[0]?.deviations || []).map((dev, idx) => (
                    <div key={idx} className="truncate select-none font-bold text-[9.5px]">
                      {dev.time}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rows */}
              <div className="space-y-2.5">
                {intelData?.heatmap.map((item, rowIdx) => {
                  return (
                    <div key={rowIdx} className="grid grid-cols-[165px_1fr] items-center gap-1.5">
                      <div className="text-[11px] font-bold text-slate-700 font-sans whitespace-normal break-all leading-tight pr-1.5" title={item.brand}>
                        {item.brand}
                      </div>

                      {/* 12-hour continuous monitoring block spanning 24h */}
                      <div className="grid grid-cols-12 gap-1 px-1">
                        {item.deviations.map((dev, cIdx) => {
                          const val = dev.deviation;

                          // Dynamic highly readable premium light mode badging based on value
                          let blockStyle = "bg-slate-50 text-slate-400 border-slate-100";
                          if (val <= -15) {
                            blockStyle = "bg-rose-100 text-rose-800 border-rose-200 font-bold animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.15)]";
                          } else if (val <= -8) {
                            blockStyle = "bg-amber-100/80 text-amber-800 border-amber-200/90 font-semibold";
                          } else if (val < 0) {
                            blockStyle = "bg-blue-50 text-blue-700 border-blue-150";
                          }

                          return (
                            <div 
                              key={cIdx} 
                              className={`text-[9px] font-mono py-1 rounded-md border text-center relative group/cell transition-all cursor-pointer ${blockStyle}`}
                            >
                              {val === 0 ? '0' : `${val}%`}

                              {/* Light theme styled interactive hover tooltip */}
                              <div className="pointer-events-none absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2.5 hidden group-hover/cell:block bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-white whitespace-nowrap shadow-xl z-20 font-sans">
                                <span className="font-bold">{item.brand}</span> at <span className="font-mono text-slate-300">{dev.time}</span><br />
                                浠锋牸鍋忕: <span className={val <= -8 ? 'text-rose-300 font-bold' : 'text-blue-300'}>{val === 0 ? '鏈彉鍔? : `${val}%`}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Light Legend items line */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-sans font-medium font-bold">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded bg-slate-50 border border-slate-200"></span>
                  <span>绋冲畾 (0% ~ -3%)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded bg-blue-50 border border-blue-150"></span>
                  <span>杞诲井浼樻儬 (-3% ~ -8%)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded bg-amber-100/80 border border-amber-200"></span>
                  <span>鏁忔劅鐩戞祴 (-8% ~ -15%)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded bg-rose-100 border border-rose-250 animate-pulse"></span>
                  <span>浠锋牸寮傚姩 ( &lt;-15% )</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: 鑸嗘儏缁熻涓庢寚鏍?(xl:col-span-5) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          
          {/* R1: 鍏ㄧ綉鑸嗘儏 浠〃鐩?(Sentiment Panel) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Compass className="w-4 h-4" />
                </span>
                <span className="font-sans font-bold text-slate-900 text-sm">
                  鍏ㄧ綉鎯呮劅鑸嗘儏鎸囨爣 (Sentiment)
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Real-time Feedback
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
              
              {/* Clean minimalist dial styled beautifully for light interface */}
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Empty base circle */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke="#f1f5f9" 
                    strokeWidth="8" 
                  />
                  {/* Emerald feedback ring */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="8" 
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - (intelData?.sentiment.positive || 68) / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-in-out"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-mono font-extrabold text-slate-900 block tracking-tight">
                    {intelData?.sentiment.positive || 68}%
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold tracking-wider uppercase font-sans">
                    姝ｉ潰鑸嗚
                  </span>
                </div>
              </div>

              {/* Breakdown status bars in soft color style */}
              <div className="space-y-2.5 flex-1 w-full text-xs">
                <div>
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      姝ｉ潰婊℃剰搴?                    </span>
                    <span className="font-mono text-emerald-600 font-bold">{intelData?.sentiment.positive || 68}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${intelData?.sentiment.positive || 68}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                      璐熷悜鍏虫敞
                    </span>
                    <span className="font-mono text-rose-600 font-bold">{intelData?.sentiment.negative || 22}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-400 h-full rounded-full transition-all duration-1000" style={{ width: `${intelData?.sentiment.negative || 22}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      涓珛鍙嶉
                    </span>
                    <span className="font-mono text-slate-500 font-bold">{intelData?.sentiment.neutral || 10}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-slate-400 h-full rounded-full transition-all duration-1000" style={{ width: `${intelData?.sentiment.neutral || 10}%` }} />
                  </div>
                </div>
              </div>

            </div>

            {/* Premium light R&D Improvement defensive checklist */}
            <div className="bg-amber-50/45 border border-amber-100/60 p-4 rounded-2xl space-y-2.5">
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider font-sans block">
                鈿狅笍 鍙ｇ鐩戞祴閲嶇偣鏀瑰杽棰嗗煙 (鐮斿彂鎸囧悜闃叉姢绾?锛?              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-sans text-slate-705 pl-1">
                <div className="flex items-center space-x-1.5">
                  <span className="text-amber-500 text-[10px]">鈼?/span>
                  <span>娑堝辑娌欏彂寮傚懗宸ヨ壓鎶婃帶</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-amber-500 text-[10px]">鈼?/span>
                  <span>鎺掗櫎閲戝睘鏈烘鎽╂摝闃诲凹</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-indigo-500 text-[10px]">鈼?/span>
                  <span>鎻愰珮寮€鏈烘暟瀛楁帶灞忓弽棣?/span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-indigo-500 text-[10px]">鈼?/span>
                  <span>閲嶇偣楂樺簲鍔涗富杞村姞鍥?/span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
