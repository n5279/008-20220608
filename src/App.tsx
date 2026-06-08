/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ProductItem } from './types';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import Library from './components/Library';
import PKTab from './components/PKTab';
import MarketIntelligence from './components/MarketIntelligence';
import { Award, ShieldAlert, Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'library' | 'pk' | 'intel'>('overview');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedPKIds, setSelectedPKIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState('');

  // Parent boundary callback to trigger the correction drawer from Overview
  const openDetailInLibraryRef = useRef<((p: ProductItem) => void) | null>(null);

  // 1. Fetch initial product elements on boot
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setErrorText('鏃犳硶鑾峰彇绔炲搧鍩虹鏁版嵁锛屾湇鍔″櫒鏍煎紡閿欒銆?);
      }
    } catch (err: any) {
      console.error(err);
      setErrorText(`鍚庣鏈嶅姟杩炴帴澶卞父锛岃妫€鏌ュ鍣ㄥ惎鍔ㄧ姸鎬? ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. PK Cart Selection toggler (limit to 2 - 5 items)
  const togglePKSelection = (id: string) => {
    setSelectedPKIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((pId) => pId !== id);
      } else {
        if (prev.length >= 5) {
          try {
            alert('PK 瀵规瘮鐭╅樀鏀寔鏈€澶?5 娆剧珵鍝佸晢鏉愶紝璇峰湪鏆傚瓨杞︾Щ鍑洪儴鍒嗗悗缁х画娣诲姞銆?);
          } catch (err) {
            console.warn('Alert blocked in sandboxed iframe:', err);
          }
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleClearPKCart = () => {
    setSelectedPKIds([]);
  };

  const handleCompareProducts = (ids: string[]) => {
    setSelectedPKIds(ids);
    setActiveTab('pk');
  };

  // 3. Update product fields via server (creates precise modification log records)
  const handleUpdateProduct = async (id: string, updatedFields: Partial<ProductItem>): Promise<boolean> => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const data = await response.json();
      if (data.success && data.product) {
        // Redraw lists
        await fetchProducts();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // 4. Batch Import ingested arrays (from Excel/CSV)
  const handleImportBatch = async (items: any[]): Promise<boolean> => {
    try {
      const response = await fetch('/api/products/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      const data = await response.json();
      if (data.success) {
        await fetchProducts();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Delete products (bulk or single)
  const handleDeleteProducts = async (ids: string[]): Promise<boolean> => {
    try {
      const response = await fetch('/api/products/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      const data = await response.json();
      if (data.success) {
        // Clear deleted ids from PK selection selection
        setSelectedPKIds(prev => prev.filter(pId => !ids.includes(pId)));
        await fetchProducts();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // 5. Reset to standard startup list
  const handleResetToDefault = async () => {
    if (!window.confirm('鎮ㄧ‘瀹氳閲嶇疆褰撳墠鏁版嵁搴撳悧锛熶汉宸ヤ慨鏀圭殑鍘嗗彶鏃ュ織鍙婃柊澧炲鍏ュ晢鍝佹灏嗛仐澶便€?)) return;
    setLoading(true);
    try {
      const response = await fetch('/api/products/reset', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setSelectedPKIds([]); // Clear PK selection
        await fetchProducts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 6. Navigation router to directly open a product's drawer from the Overview dashboards
  const handleViewProductFromOverview = (product: ProductItem) => {
    setActiveTab('library');
    // Allow React time to switch layout tab, then fire drawer event
    setTimeout(() => {
      if (openDetailInLibraryRef.current) {
        openDetailInLibraryRef.current(product);
      }
    }, 150);
  };

  // Full loading screen
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 text-slate-850 animate-spin mb-4" />
        <h3 className="text-sm font-sans font-bold text-slate-800">鏁忓崕绔炲搧鍒嗘瀽绯荤粺姝ｅ湪杞藉叆...</h3>
        <p className="text-xs text-slate-400 mt-1 font-sans">姝ｅ湪瑁呴厤鏈嶅姟鍣ㄧ紦瀛樻睜锛屾牳瀵圭墿鐞嗗鍏ュ畬鏁村害</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-slate-900 selection:text-white font-sans">
      
      {/* Sidebar Navigation (Left) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        pkCartCount={selectedPKIds.length} 
      />

      {/* Main Panel Content (Right Scroll Body) */}
      <main id="main-content-scroll" className="flex-1 h-screen overflow-y-auto px-8 py-10 space-y-8">
        
        {/* Network Error Status */}
        {errorText && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center shadow-xs">
            <ShieldAlert className="w-5 h-5 mr-2.5 text-rose-600" />
            <span>{errorText}</span>
          </div>
        )}

        {/* Tab Router Render logic */}
        {activeTab === 'overview' && (
          <Overview 
            products={products} 
            onViewProduct={handleViewProductFromOverview}
            onNavigateToLibrary={() => setActiveTab('library')}
          />
        )}

        {activeTab === 'library' && (
          <Library 
            products={products}
            selectedPKIds={selectedPKIds}
            togglePKSelection={togglePKSelection}
            onRefreshProducts={fetchProducts}
            onUpdateProduct={handleUpdateProduct}
            onImportBatch={handleImportBatch}
            onResetToDefault={handleResetToDefault}
            onOpenDetailRef={(fn) => { openDetailInLibraryRef.current = fn; }}
            onDeleteProducts={handleDeleteProducts}
            onCompareProducts={handleCompareProducts}
          />
        )}

        {activeTab === 'pk' && (
          <PKTab 
            products={products}
            selectedPKIds={selectedPKIds}
            togglePKSelection={togglePKSelection}
            onClearPKCart={handleClearPKCart}
          />
        )}

        {activeTab === 'intel' && (
          <MarketIntelligence />
        )}

      </main>
    </div>
  );
}
