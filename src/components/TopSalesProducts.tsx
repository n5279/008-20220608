/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ProductItem } from '../types';
import { 
  Award, 
  Sparkles, 
  Cpu, 
  Info,
  Maximize2,
  TrendingUp,
  Coins
} from 'lucide-react';

interface TopSalesProductsProps {
  products: ProductItem[];
  onViewProduct: (product: ProductItem) => void;
}

export default function TopSalesProducts({ products, onViewProduct }: TopSalesProductsProps) {
  const [sortKey, setSortKey] = useState<'sales' | 'revenue'>('sales');

  // Check if an image is valid to render in the browser
  const isImageValid = (url?: string) => {
    if (!url) return false;
    const cleanUrl = url.trim();
    if (cleanUrl.startsWith('=')) return false; // Excel formulas like =DISPIMG(...)
    if (cleanUrl.startsWith('http') || cleanUrl.startsWith('data:image/')) return true;
    return false;
  };

  // Determine pricing "妗ｆ" (Product grade/tier) dynamically based on catalog price brackets
  const getProductTier = (price: number): string => {
    if (!price || price === 0) return '鏈畾妗ｆ';
    if (price < 3000) return '鍏ラ棬璧伴噺娆?;
    if (price < 5000) return '涓涓诲姏娆?;
    if (price < 8000) return '涓珮绔垝浜';
    if (price < 12000) return '楂樼杞诲ア娆?;
    return '鏋佽嚧鏃楄埌灏婁韩娆?;
  };

  // Sort and filter top 4 products
  const topFourProducts = useMemo(() => {
    const list = [...products];
    if (sortKey === 'sales') {
      // Sort by thirdPartySales descending
      return list.sort((a, b) => (b.thirdPartySales || 0) - (a.thirdPartySales || 0)).slice(0, 4);
    } else {
      // Sort by thirdPartyRevenue descending
      return list.sort((a, b) => (b.thirdPartyRevenue || 0) - (a.thirdPartyRevenue || 0)).slice(0, 4);
    }
  }, [products, sortKey]);

  return (
    <div id="top-sales-products-module" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
      
      {/* Module Header & Tab bar toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-sans font-bold text-lg text-slate-900 flex items-center space-x-2">
            <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
            <span>鏅鸿兘娌欏彂绔炲搧閿€閲忔帓琛?TOP 4 鐗瑰埆瑙嗙獥</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            鍔ㄦ€佹眹鎬诲叏娓犻亾鏈€鏂板鍏ョ珵浜夋満鍨嬬儹鍔涙暟鍊硷紝鎸変骇鍝佹祦閫氶噺鎴栭搴﹁繘琛岀洿瑙傚榻愩€?          </p>
        </div>
        
        {/* Toggle between sales count (閿€閲?鏁伴噺) and revenue (閿€鍞/閲戦) */}
        <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 self-start sm:self-auto shadow-3xs">
          <button
            onClick={() => setSortKey('sales')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center space-x-1.5 ${
              sortKey === 'sales'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>鎸夐攢閲忔暟閲?/span>
          </button>
          <button
            onClick={() => setSortKey('revenue')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center space-x-1.5 ${
              sortKey === 'revenue'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>鎸夐攢鍞笟缁?/span>
          </button>
        </div>
      </div>

      {/* Grid of Top 4 cards: Desktop 4, Tablet 2, Mobile 1 */}
      {topFourProducts.length === 0 ? (
        <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
          <Info className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <span>鏆傛棤鍖归厤鐨勭珵鍝佹暟鎹紝璇峰厛褰曞叆鎴栧鍏ュ晢鍝?/span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topFourProducts.map((p, index) => {
            const hasValidImage = isImageValid(p.imageUrl);
            const priceVal = p.promoPrice || p.currentPrice || 0;
            const originalPriceVal = p.currentPrice || 0;
            const showSalesText = p.thirdPartySales !== undefined && p.thirdPartySales !== null;
            const salesValue = p.thirdPartySales;
            const revenueValue = p.thirdPartyRevenue;

            // Generate features pills dynamically
            const activeFeatures = [];
            if (p.zeroWall) activeFeatures.push('闆堕潬澧?);
            if (p.powerLift) activeFeatures.push('鐢靛姩杈呭姪璧疯韩');
            if (p.voiceControl) activeFeatures.push('鏅鸿兘璇煶');
            if (p.usbCharging) activeFeatures.push('USB/Type-C');
            if (p.reclineType && p.reclineType.trim()) {
              activeFeatures.push(p.reclineType);
            }

            return (
              <div
                key={p.id}
                onClick={() => onViewProduct(p)}
                className="group relative bg-white border border-slate-100 rounded-3xl shadow-xs hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                
                {/* Ranking Emblem (Requirement 5 & 6) */}
                {index === 0 ? (
                  // Gold medal for Rank 1 with number 1
                  <div className="absolute top-2.5 right-2.5 z-10 bg-linear-to-b from-amber-300 via-amber-400 to-yellow-500 text-slate-950 font-black text-sm w-9 h-9 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce-slow">
                    <span>1</span>
                  </div>
                ) : (
                  // TOP 2, TOP 3, TOP 4 Tags
                  <div className={`absolute top-2.5 right-2.5 z-10 px-2.5 py-1 rounded-lg text-[10px] font-extrabold border shadow-3xs ${
                    index === 1 
                      ? 'bg-slate-100 text-slate-800 border-slate-200 font-sans'
                      : index === 2 
                        ? 'bg-orange-50 text-orange-700 border-orange-100'
                        : 'bg-slate-50 text-slate-500 border-slate-100'
                  }`}>
                    TOP {index + 1}
                  </div>
                )}

                {/* Product Image Panel (Requirement 7) */}
                <div className="relative aspect-video w-full bg-slate-50 border-b border-slate-100/65 overflow-hidden flex items-center justify-center">
                  {hasValidImage ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  ) : (
                    // Beautiful styled mockup when image is broken/formula/empty (Requirement 7)
                    <div className="text-center p-4 text-slate-400 select-none flex flex-col items-center justify-center">
                      <Sparkles className="w-6 h-6 text-slate-300 mb-1" />
                      <span className="text-[11px] font-sans font-bold tracking-wide text-slate-400">鏆傛棤鍥剧墖</span>
                    </div>
                  )}

                  {/* Overlay channel tag */}
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/70 text-white rounded text-[9px] font-bold font-sans">
                    {p.platform || '鍏ㄧ綉鐩戞祴'}
                  </span>
                </div>

                {/* Card Main Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  
                  {/* Title and Identification block */}
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-50 text-blue-700 border border-blue-100 font-sans font-bold text-[10px] px-2 py-0.5 rounded-md">
                        {p.brand || '鏈煡鍝佺墝'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                        ID: {p.productId || '鏆傛棤'}
                      </span>
                    </div>

                    <h3 className="font-sans font-bold text-xs text-slate-800 line-clamp-2 leading-relaxed tracking-tight group-hover:text-blue-600 transition-colors" title={p.name}>
                      {p.name}
                    </h3>
                  </div>

                  {/* Core physical characteristics grid */}
                  <div className="bg-slate-50/70 rounded-xl p-2.5 border border-slate-100/80 text-[10.5px] text-slate-600 space-y-2.5">
                    
                    {/* Dimension, Category, Material, SkuId */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 font-sans">
                      <div>
                        <span className="text-slate-400 text-[10px]">鍨嬪彿锛?/span>
                        <span className="font-medium font-mono text-[10px] text-slate-700 truncate inline-block max-w-[80px]" title={p.skuId || '鏆傛棤'}>
                          {p.skuId || '鏆傛棤'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px]">鍝佺被锛?/span>
                        <span className="font-medium text-slate-700">{p.productType || '鍔熻兘娌欏彂'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px]">鏉愯川锛?/span>
                        <span className="font-medium text-slate-700 truncate inline-block max-w-[80px]" title={p.material || '澶嶅悎鏉愯川'}>
                          {p.material || '绉戞妧甯?}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px]">灏哄(瀹芥繁楂?锛?/span>
                        <span className="font-medium text-slate-750 font-mono">
                          {p.width || '-'}/{p.depth || '-'}/{p.height || '-'}
                        </span>
                      </div>
                    </div>

                    {/* Features list bullet layout */}
                    {activeFeatures.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/50 flex flex-wrap gap-1">
                        {activeFeatures.slice(0, 3).map((fText, fIdx) => (
                          <span 
                            key={fIdx} 
                            className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[9px] text-slate-500 font-bold tracking-wide"
                          >
                            {fText}
                          </span>
                        ))}
                        {activeFeatures.length > 3 && (
                          <span className="text-[8px] text-slate-400 font-black self-center ml-0.5">
                            +{activeFeatures.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Sales metric & Pricing panel */}
                  <div className="pt-1 flex flex-col space-y-2 border-t border-slate-100/60">
                    
                    {/* Dynamically parsed grade and Sales count indicator */}
                    <div className="flex justify-between items-center text-[10.5px]">
                      
                      {/* Product Grade (Requirement 4) */}
                      <span className="text-[10px] font-sans font-bold text-slate-500 bg-neutral-100 border border-neutral-200/60 px-1.5 py-0.5 rounded-md">
                        {getProductTier(priceVal)}
                      </span>

                      {/* Sales and volume count (Requirement 8 - display "鏆傛棤閿€閲? if null or 0) */}
                      <span className="font-sans font-bold text-slate-700">
                        {showSalesText ? (
                          sortKey === 'sales' ? (
                            <span className="text-blue-700">
                              閿€閲忥細<span className="font-mono font-extrabold text-xs">{salesValue.toLocaleString()}</span> 鍗?                            </span>
                          ) : (
                            <span className="text-indigo-700">
                              鏈堜笟缁╋細<span className="font-mono font-extrabold text-[10px]">锟(revenueValue || 0).toLocaleString()}</span>
                            </span>
                          )
                        ) : (
                          <span className="text-slate-400 font-medium">鏆傛棤閿€閲?/span>
                        )}
                      </span>
                    </div>

                    {/* Price and Action bar */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-sm font-sans font-black text-rose-600">
                          锟priceVal.toLocaleString()}
                        </span>
                        {originalPriceVal > priceVal && (
                          <span className="text-[10px] line-through text-slate-400">
                            锟originalPriceVal.toLocaleString()}
                          </span>
                        )}
                      </div>
                      
                      {/* Action tooltip */}
                      <span className="text-[10px] font-bold text-blue-600/80 group-hover:text-blue-600 flex items-center space-x-0.5 transition-colors">
                        <span>璇︽儏</span>
                        <Maximize2 className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Helper icon mapping because of constraints
function Flame(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}
