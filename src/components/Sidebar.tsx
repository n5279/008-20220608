/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BarChart3, Database, Columns, ShieldAlert, Settings, X } from 'lucide-react';

interface SidebarProps {
  activeTab: 'overview' | 'library' | 'pk' | 'intel';
  setActiveTab: (tab: 'overview' | 'library' | 'pk' | 'intel') => void;
  pkCartCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, pkCartCount }: SidebarProps) {
  const [isDynamicApiOpen, setIsDynamicApiOpen] = useState(false);
  const [dynamicConfig, setDynamicConfig] = useState({ endpoint: '', apiKey: '', model: '' });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('minhua_dynamic_api_config');
      if (saved) {
        setDynamicConfig(JSON.parse(saved));
      }
    } catch(e) {}
  }, []);

  const handleSaveDynamicConfig = () => {
    localStorage.setItem('minhua_dynamic_api_config', JSON.stringify(dynamicConfig));
    setIsDynamicApiOpen(false);
  };

  const navItems = [
    { id: 'overview' as const, label: '甯傚満姒傝', icon: BarChart3, desc: '鏁版嵁鎬昏涓庣洃娴嬬湅鏉? },
    { id: 'library' as const, label: '绔炲搧搴?, icon: Database, desc: '鏁版嵁褰曞叆涓庡晢鍝佽鑼冨寲' },
    { id: 'pk' as const, label: 'PK 鍒嗘瀽', icon: Columns, desc: '澶氭爣鐨勬í姣斾笌鏅鸿兘鐮斿垽' },
    { id: 'intel' as const, label: '甯傚満鎯呮姤棰勮', icon: ShieldAlert, desc: '浼犳劅鍣ㄧ骇API瀹炴椂鐩戞帶' },
  ];

  return (
    <aside id="sidebar-container" className="w-64 h-screen sticky top-0 flex flex-col justify-between p-6 bg-white/60 backdrop-blur-xl border-r border-slate-205 shadow-xs shrink-0">
      {/* Brand Header */}
      <div className="space-y-8">
        <div className="flex items-center space-x-3 py-1">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-xs">
            M
          </div>
          <div>
            <span className="font-sans font-bold tracking-tight text-slate-900 text-sm block">鏁忓崕绔炲搧鍒嗘瀽</span>
            <span className="font-sans text-[10px] text-slate-400 font-medium">甯傚満鐩戞帶涓績 v1.1</span>
          </div>
        </div>

        {/* Navigation Selector */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-250 text-left ${
                  isActive
                    ? 'bg-slate-900 text-white border border-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-950 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.id === 'pk' && pkCartCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500 text-slate-950 rounded-full animate-pulse">
                    {pkCartCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

    {/* Safety Rules/Metadata Bottom Left Display */}
      <div className="space-y-4 pt-6 border-t border-slate-150 relative">
        <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">鏁版嵁鐩戞帶淇℃簮</div>
            <button 
              onClick={() => setIsDynamicApiOpen(true)}
              className="text-slate-300 hover:text-slate-500 transition-colors"
              title="鍔ㄦ€佹ā鍨嬭矾鐢遍厤缃?
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-[10px] text-slate-600 space-y-1 font-medium">
            <p>鈥?鍔ㄦ€?API 璺敱缃戝叧閰嶇疆</p>
            <p>鈥?澶栭儴 CSV / XLSX鎶ヨ〃</p>
            <p>鈥?鐮斿彂浜哄憳浜哄伐鏍稿</p>
          </div>
        </div>

        <div className="flex items-center p-2.5 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-500 text-[10px] leading-relaxed">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
          <span>鎵ц涓ユ牸鐨勫彲淇″害鏍搁獙瑙勮寖</span>
        </div>
      </div>

      {isDynamicApiOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-800">鍔ㄦ€?API 璺敱閰嶇疆 (Backup)</h3>
              <button onClick={() => setIsDynamicApiOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mb-4 leading-relaxed">
              褰撲富绾?Gemini 澶фā鍨嬭皟鐢ㄥけ璐ユ垨鏈厤缃椂锛岀郴缁熷皢鑷姩璺宠浆浣跨敤姝ゆ帴鍙ｉ厤缃紙鍏煎 OpenAI Chat 缁撴瀯锛夈€?            </p>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">API Endpoint 鎺ュ彛鍦板潃</label>
                <input 
                  type="text"
                  value={dynamicConfig.endpoint}
                  onChange={e => setDynamicConfig({...dynamicConfig, endpoint: e.target.value})}
                  placeholder="https://api.openai.com/v1"
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-indigo-400 bg-slate-50"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">API Key 瀵嗛挜</label>
                <input 
                  type="password"
                  value={dynamicConfig.apiKey}
                  onChange={e => setDynamicConfig({...dynamicConfig, apiKey: e.target.value})}
                  placeholder="sk-..."
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-indigo-400 bg-slate-50"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Model 妯″瀷鍚嶇О</label>
                <input 
                  type="text"
                  value={dynamicConfig.model}
                  onChange={e => setDynamicConfig({...dynamicConfig, model: e.target.value})}
                  placeholder="gpt-4o / deepseek-chat"
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-indigo-400 bg-slate-50"
                />
              </div>
              <button 
                onClick={handleSaveDynamicConfig}
                className="w-full uppercase tracking-wider py-2 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold rounded-lg transition-colors mt-2"
              >
                淇濆瓨閰嶇疆骞跺惎鐢ㄥ姩鎬佽矾鐢?              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
