/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { ProductItem } from '../types';
import { 
  TrendingUp, 
  HelpCircle, 
  Activity, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  AlertCircle,
  Clock
} from 'lucide-react';
import TopSalesProducts from './TopSalesProducts';

interface OverviewProps {
  products: ProductItem[];
  onViewProduct: (product: ProductItem) => void;
  onNavigateToLibrary: () => void;
}

export default function Overview({ products, onViewProduct, onNavigateToLibrary }: OverviewProps) {
  const [variantFilter, setVariantFilter] = useState<'fixed' | 'nonFixed'>('nonFixed');
  const isFixedProduct = (product: ProductItem) => (product.motorCount || 0) <= 0;

  // Find the latest update or price fetch time dynamically
  const lastUpdateTime = useMemo(() => {
    const times = products
      .map(p => p.priceFetchTime || p.metricsFetchTime)
      .filter(Boolean)
      .sort();
    if (times.length > 0) {
      const latest = times[times.length - 1];
      return latest.substring(0, 16);
    }
    return "2026-06-01 11:20";
  }, [products]);

  // 1. Calculate dynamic statistics
  const stats = useMemo(() => {
    const brands = new Set(products.map(p => p.brand.split(' ')[0]).filter(Boolean)); // Get main brand name
    const total = products.length;
    
    // Sort prices to determine main concentration band
    const prices = products.map(p => p.promoPrice || p.currentPrice).sort((a, b) => a - b);
    let priceBandLabel = '锟? - 锟?';
    if (prices.length > 0) {
      const q1 = prices[Math.floor(prices.length * 0.25)] || 0;
      const q3 = prices[Math.floor(prices.length * 0.75)] || 0;
      priceBandLabel = `锟?{q1.toLocaleString()} - 锟?{q3.toLocaleString()}`;
    }

    // Dynamic Batches - find the latest batch
    const batches = Array.from(new Set(products.map(p => p.importBatch).filter(Boolean))).sort();
    const latestBatch = batches[batches.length - 1] || 'P20260529A';

    // New additions (from the latest batch or 3rd party API)
    const newItemsCount = products.filter(p => p.importBatch === latestBatch || p.dataSource === '绗笁鏂?API').length;

    // platforms coverage
    const platforms = Array.from(new Set(products.map(p => p.platform).filter(Boolean)));
    const platformCount = platforms.length || 1;

    // Top material
    const materialCounts: Record<string, number> = {};
    products.forEach(p => {
      if (p.material) {
        materialCounts[p.material] = (materialCounts[p.material] || 0) + 1;
      }
    });
    let topMaterial = '澶村眰榛勭墰鐨?;
    let maxMatCount = 0;
    Object.entries(materialCounts).forEach(([mat, cnt]) => {
      if (cnt > maxMatCount) {
        maxMatCount = cnt;
        topMaterial = mat;
      }
    });

    // Brand additions description
    const last30DaysBrandCount = new Set(
      products
        .filter(p => p.importBatch === latestBatch || p.dataSource === '绗笁鏂?API')
        .map(p => p.brand.split(' ')[0])
    ).size;

    return {
      brandCount: brands.size,
      totalCount: total,
      mainPriceBand: priceBandLabel,
      newCount: newItemsCount,
      latestBatch,
      platformCount,
      topMaterial,
      last30DaysBrandCount
    };
  }, [products]);

  // 2. Calculate technology feature popularity percentages for R&D
  const featurePopularity = useMemo(() => {
    if (products.length === 0) return [];
    const total = products.length;
    return [
      { name: '闆堕潬澧欒璁?, count: products.filter(p => p.zeroWall).length, desc: '鑺傜渷瀹㈠巺绂诲浠拌浆绌洪棿' },
      { name: 'USB/Type-C鐢甸厤', count: products.filter(p => p.usbCharging).length, desc: '渚ц竟妯″潡闆嗘垚渚涚數' },
      { name: '杈呭姪璧疯韩鐢垫満', count: products.filter(p => p.powerLift).length, desc: '閽堝閾跺彂闀胯緢璧峰潗瀹堟姢' },
      { name: '鏅鸿兘璇煶澹版帶', count: products.filter(p => p.voiceControl).length, desc: '鑴辨墜绂荤嚎鐜澹版尝閬ユ帶' },
    ].map(f => ({
      ...f,
      percentage: Math.round((f.count / total) * 100)
    })).sort((a, b) => b.percentage - a.percentage);
  }, [products]);

  const variantFilterStats = useMemo(() => {
    const fixedCount = products.filter(isFixedProduct).length;
    const nonFixedCount = products.length - fixedCount;

    return { fixedCount, nonFixedCount };
  }, [products]);

  const variantFilteredProducts = useMemo(() => {
    return products.filter((product) =>
      variantFilter === 'fixed' ? isFixedProduct(product) : !isFixedProduct(product)
    );
  }, [products, variantFilter]);

  // 3. Price distribution calculation for the visual horizontal progress bars
  const priceDistBins = useMemo(() => {
    const bins = [
      { label: '<3K 淇冮攢娴佽浆甯?, range: [0, 2999], count: 0, brands: {} as Record<string, number> },
      { label: '3K-5K 涓诲姏璧伴噺甯?, range: [3000, 4999], count: 0, brands: {} as Record<string, number> },
      { label: '5K-8K 鑸掍韩涓珮绔?, range: [5000, 7999], count: 0, brands: {} as Record<string, number> },
      { label: '8K-12K 楂樼濂㈤泤甯?, range: [8000, 11999], count: 0, brands: {} as Record<string, number> },
      { label: '>12K 鏋佽嚧鏃楄埌甯?, range: [12000, 9999999], count: 0, brands: {} as Record<string, number> },
    ];
    
    variantFilteredProducts.forEach(p => {
      const price = p.promoPrice || p.currentPrice;
      for (const bin of bins) {
        if (price >= bin.range[0] && price <= bin.range[1]) {
          bin.count++;
          const mainBrand = p.brand.split(' ')[0] || '鍏朵粬鍝佺墝';
          bin.brands[mainBrand] = (bin.brands[mainBrand] || 0) + 1;
          break;
        }
      }
    });

    const total = variantFilteredProducts.length || 1;
    return bins.map(bin => {
      const percentage = Math.round((bin.count / total) * 100);
      const brandSummary = Object.entries(bin.brands)
        .map(([brand, cnt]) => `${brand}(${cnt}娆?`)
        .join(' / ');
      return {
        ...bin,
        percentage,
        brandSummary
      };
    });
  }, [variantFilteredProducts]);

  // 4. Categorize product lists to display
  const categorizedProducts = useMemo(() => {
    // 閲嶇偣鍟嗗搧: Source Rank is high, or high revenue index
    const focusItems = [...products]
      .sort((a, b) => (a.sourceRank || 99) - (b.sourceRank || 99))
      .slice(0, 3);

    // Find latest batch
    const batches = Array.from(new Set(products.map(p => p.importBatch).filter(Boolean))).sort();
    const latestBatch = batches[batches.length - 1] || 'P20260529A';

    // 鏂板鍟嗗搧: Latest imports
    const newItems = products
      .filter(p => p.importBatch === latestBatch || p.dataSource === '绗笁鏂?API')
      .slice(0, 3);

    // 浠锋牸鍙樺寲鍟嗗搧: Has promotion gaps or modification records
    const priceChangeItems = products
      .filter(p => (p.currentPrice > p.promoPrice) || (p.modificationLogs && p.modificationLogs.some(l => l.field === 'currentPrice' || l.field === 'promoPrice')))
      .slice(0, 3);

    return {
      focusItems,
      newItems,
      priceChangeItems
    };
  }, [products]);

  return (
    <div id="overview-dashboard" className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-200 p-6 rounded-3xl shadow-xs">
        <div>
          <h1 className="font-sans font-bold text-2xl text-slate-900 tracking-tight">鐮斿彂鐩戞祴涓績鎺у埗鍙?/h1>
          <p className="text-xs text-slate-500 mt-1">
            鑱氬悎骞跺榻愮涓夋柟浜ゆ槗涓庝汉宸ュ綍鍏ワ紝寮曞鏍稿績鍧愬叿闆堕儴浠跺強鍔熻兘閰嶆瘮绔嬮」銆?          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0 text-xs">
          <span className="bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-xl border border-blue-200/80 flex items-center shadow-3xs font-sans font-bold transition-all">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-600 animate-pulse" />
            鏁版嵁鏇存柊鏃堕棿: <span className="text-blue-900 font-extrabold ml-1 font-mono">{lastUpdateTime}</span>
          </span>
          <span className="bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-xl border border-emerald-200 flex items-center shadow-3xs font-sans font-extrabold tracking-wide transition-all">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            ON LINE
          </span>
        </div>
      </div>

      {/* KPI Stats Block (Minimalism Rounded-3xl) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: '鐩戞祴鍝佺墝', 
            val: stats.brandCount, 
            unit: '涓?, 
            desc: `杩戞湡鍚屾: ${stats.last30DaysBrandCount} 涓閫塦, 
            color: 'bg-slate-900 text-white border-slate-950', 
            titleColor: 'text-slate-500' 
          },
          { 
            label: '鏈夋晥鍟嗗搧', 
            val: stats.totalCount, 
            unit: '娆?, 
            desc: `鍏ㄨ鐩?${stats.platformCount} 涓數鍟嗕富瑕佹笭閬揱, 
            color: 'bg-slate-105 text-slate-700 border-slate-205/60', 
            titleColor: 'text-slate-500' 
          },
          { 
            label: '涓诲姏浠锋牸甯?, 
            val: stats.mainPriceBand, 
            unit: '', 
            desc: `楂橀娈甸潰鏂? ${stats.topMaterial}`, 
            color: 'bg-slate-105 text-slate-700 border-slate-205/60', 
            titleColor: 'text-slate-500' 
          },
          { 
            label: '鏂板鍟嗗搧鏁?, 
            val: stats.newCount, 
            unit: '娆?, 
            desc: `褰撳墠鏁版嵁鏈? ${stats.latestBatch}`, 
            color: 'bg-amber-500 text-slate-950 border-amber-600 font-bold', 
            titleColor: 'text-slate-500' 
          },
        ].map((item, idx) => (
          <div 
            key={idx}
            className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px]"
          >
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">{item.label}</p>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {item.val}
                {item.unit && <span className="text-xs font-semibold text-slate-400 ml-1">{item.unit}</span>}
              </h3>
            </div>
            <div className={`mt-3 text-xs ${item.color} border px-2 py-1 rounded-md inline-block w-max font-semibold`}>
              {item.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Graphical Dashboard & Features Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Card: Price Distribution & Metric Disclaimers */}
        <div className="lg:col-span-12 xl:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-sans font-bold text-base text-slate-900">鍏ㄦ笭閬撲环鏍兼寮忓崰姣斿害</h2>
              <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setVariantFilter('fixed')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    variantFilter === 'fixed'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  鍥哄畾娆?                  <span className="ml-1 font-mono text-[10px] text-slate-400">{variantFilterStats.fixedCount}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVariantFilter('nonFixed')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    variantFilter === 'nonFixed'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  闈炲浐瀹氭
                  <span className="ml-1 font-mono text-[10px] text-slate-400">{variantFilterStats.nonFixedCount}</span>
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-6 font-sans">
              褰撳墠鎸?              <span className="mx-1 font-semibold text-slate-700">{variantFilter === 'fixed' ? '鍥哄畾娆? : '闈炲浐瀹氭'}</span>
              灞曠ず浠锋牸甯﹀垎甯冿紝鍥哄畾娆句笌闈炲浐瀹氭浠ユ槸鍚﹂厤缃數鏈轰綔涓哄尯鍒嗘爣鍑嗐€?            </p>
            
            {/* Dynamic Horizontal Progress Bars (闀挎潯鍥鹃殢鐫€娆惧紡鏁伴噺鍙婂鍏ユ暟鎹暱鐭姩鎬佸尯鍒? */}
            <div className="space-y-4 my-2 border-b border-slate-150 pb-5">
              {priceDistBins.map((bin, blockIdx) => (
                <div key={blockIdx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="font-sans font-bold text-slate-800 bg-slate-100 border border-slate-205 px-2 py-0.5 rounded text-[10.5px] shrink-0 select-none">
                        {bin.label}
                      </span>
                      <span className="text-[10.5px] text-slate-500 font-medium truncate" title={bin.brandSummary}>
                        {bin.count > 0 ? `鍚湁娆惧紡: ${bin.brandSummary}` : '馃垰 鏆傛棤瀵煎叆瀵规爣娆惧紡'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="font-mono font-extrabold text-[10px] text-blue-700 bg-blue-50/80 border border-blue-100 rounded px-1.5 py-0.5">
                        {bin.count} 娆炬寮?                      </span>
                      <span className="font-mono font-extrabold text-slate-900 text-[11px] w-8 text-right">
                        {bin.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner relative flex items-center">
                    {/* Dynamic length bar matching user requirement */}
                    <div 
                      style={{ width: `${bin.percentage}%` }}
                      className={`h-full rounded-full transition-all duration-1000 shadow-3xs ${
                        bin.count > 0 
                          ? 'bg-linear-to-r from-blue-500 via-indigo-500 to-indigo-600' 
                          : 'bg-transparent'
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-start p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed font-sans">
            <AlertCircle className="w-4 h-4 text-slate-400 mr-2.5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5 text-slate-800">鈿狅笍 绗笁鏂归噰闆嗘暟鎹悎瑙勫０鏄?/span>
              鏈堝害鎸囨暟鐢辩郴缁熷悎瑙勫鐞嗚€屽緱銆備弗绂佺敤浜庡澶栧叕寮€璐㈠姟澹版槑锛岄檺鏁忓崕鍐呴儴浜у搧姣旂収浣跨敤銆?            </div>
          </div>
        </div>

        {/* Right Card: High Frequency R&D Specs */}
        <div className="lg:col-span-12 xl:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-sans font-bold text-base text-slate-900">鍏ㄦ笭閬撴櫤鑳界‖浠朵笌闆朵欢鍗犳瘮</h2>
              <span className="text-xs font-mono font-bold text-red-500">鍔熻兘娴嬭瘯涓?</span>
            </div>
            <p className="text-xs text-slate-500 mb-6 font-sans">
              褰撳墠甯傚満鏈夋晥褰曞叆鐨勫悇鏈哄簥闆堕儴浠躲€佹櫤鑳界‖浠跺姛鑳芥瘮瀵瑰崰鏈夌巼鎺掕銆?            </p>

            <div className="space-y-4">
              {featurePopularity.map((feat, featIdx) => (
                <div key={featIdx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-sans font-bold text-slate-700">{feat.name}</span>
                      <span className="text-[10px] text-slate-400 ml-2">({feat.desc})</span>
                    </div>
                    <span className="font-mono font-extrabold text-slate-900">{feat.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                    <div 
                      style={{ width: `${feat.percentage}%` }}
                      className="bg-slate-900 h-full rounded-full transition-all duration-1000"
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={onNavigateToLibrary}
            className="w-full mt-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold tracking-wide flex items-center justify-center space-x-2 transition-all duration-200 shadow-xs"
          >
            <span>鍓嶅線绔炲搧搴撹ˉ鍏呭綍鍏?/span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 閿€閲?TOP 4 浜у搧鍥惧崱 */}
      <TopSalesProducts products={products} onViewProduct={onViewProduct} />

      {/* Dynamic Products Segmentation Rows */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Column 1: Key Monitored */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-2 mb-4 border-b border-slate-100 pb-3">
            <TrendingUp className="w-4.5 h-4.5 text-slate-850" />
            <h3 className="font-sans font-bold text-sm text-slate-800">琛屼笟閲嶇偣鐩戞祴鍟嗗搧</h3>
          </div>
          <p className="mb-4 text-[11px] leading-relaxed text-slate-500">
            绯荤粺浼氫紭鍏堝睍绀烘渶鏂板鍏ュ晢鍝侊紝褰撳墠灞曠ず鍓?3 娆撅紝浣滀负闇€瑕佷紭鍏堣窡韪殑閲嶇偣绔炲搧銆?          </p>
          <div className="space-y-3">
            {categorizedProducts.focusItems.map((prod) => (
              <div 
                key={prod.id}
                onClick={() => onViewProduct(prod)}
                className="flex items-center space-x-3 p-3 bg-slate-50/50 hover:bg-slate-100/50 border border-transparent hover:border-slate-200 rounded-xl transition-all duration-300 cursor-pointer group"
              >
                <img 
                  src={prod.imageUrl} 
                  alt={prod.name} 
                  className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200/50 group-hover:scale-105 transition-transform" 
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{prod.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded border border-slate-200/50 font-semibold">{prod.brand}</span>
                    <span className="text-[10px] text-gray-405">鎺掑悕绗?#{prod.sourceRank}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-800">锟prod.promoPrice || prod.currentPrice}</div>
                  <span className="text-[10px] text-gray-400 block mt-0.5">鍒稿悗浠?/span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Newly Imported */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-2 mb-4 border-b border-slate-100 pb-3">
            <Layers className="w-4.5 h-4.5 text-slate-850" />
            <h3 className="font-sans font-bold text-sm text-slate-800">鏈€鏂颁笂鏋舵垨鎵归噺鏂板</h3>
          </div>
          <p className="mb-4 text-[11px] leading-relaxed text-slate-500">
            鍟嗗搧鏉ヨ嚜鏈€鏂板鍏ユ壒娆★紝鎴栨暟鎹潵婧愯鏍囪涓虹涓夋柟 API锛岀郴缁熶細灏嗚繖绫绘柊杩涘叆搴撶殑鏁版嵁浼樺厛鍒楀湪杩欓噷銆?          </p>
          <div className="space-y-3">
            {categorizedProducts.newItems.map((prod) => (
              <div 
                key={prod.id}
                onClick={() => onViewProduct(prod)}
                className="flex items-center space-x-3 p-3 bg-slate-50/50 hover:bg-slate-100/50 border border-transparent hover:border-slate-200 rounded-xl transition-all duration-300 cursor-pointer group"
              >
                <img 
                  src={prod.imageUrl} 
                  alt={prod.name} 
                  className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200/50 group-hover:scale-105 transition-transform" 
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{prod.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded border border-slate-200/50 font-semibold">{prod.brand}</span>
                    <span className="text-[10px] text-gray-400 font-mono text-[9px]">{prod.importBatch}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-extrabold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">NEW</div>
                  <span className="text-[10px] text-gray-450 block mt-0.5">寰呮渶缁堟牳瀵?/span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Price Changed */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-2 mb-4 border-b border-slate-100 pb-3">
            <Activity className="w-4.5 h-4.5 text-slate-850 animate-pulse" />
            <h3 className="font-sans font-bold text-sm text-slate-800">浠锋牸娉㈠姩涓庝慨姝ｇ洃娴?/h3>
          </div>
          <p className="mb-4 text-[11px] leading-relaxed text-slate-500">
            鍟嗗搧瀛樺湪鐜颁环楂樹簬淇冮攢浠风殑浠锋牸娉㈠姩锛屽洜姝や細琚綊鍏ヤ环鏍肩洃娴嬪悕鍗曘€?          </p>
          <div className="space-y-3">
            {categorizedProducts.priceChangeItems.map((prod) => {
              // Calculate standard variance or original vs current price gap
              const originalPrice = prod.originalData?.currentPrice || prod.currentPrice;
              const hasDropped = prod.promoPrice < prod.currentPrice;
              return (
                <div 
                  key={prod.id}
                  onClick={() => onViewProduct(prod)}
                  className="flex items-center space-x-3 p-3 bg-slate-50/50 hover:bg-slate-100/50 border border-transparent hover:border-slate-200 rounded-xl transition-all duration-300 cursor-pointer group"
                >
                  <img 
                    src={prod.imageUrl} 
                    alt={prod.name} 
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200/50 group-hover:scale-105 transition-transform" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{prod.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded border border-slate-200/50 font-semibold">{prod.brand}</span>
                      <span className="text-[10px] text-gray-400 truncate">鍘熶环: 锟originalPrice}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-rose-600">锟prod.promoPrice}</div>
                    <span className="text-[9px] text-rose-500 font-semibold block mt-0.5 whitespace-nowrap">浼樻儬娲诲姩涓?/span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
