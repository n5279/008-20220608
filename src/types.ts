/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductItem {
  id: string; // Internal product tracker ID
  
  // First-stage product fields defined in instructions:
  platform: string;          // 骞冲彴 (e.g. 澶╃尗, 浜笢, 鎶栭煶)
  brand: string;             // 鍝佺墝 (e.g. LAZBOY, 椤惧瀹跺眳, 鑺濆崕浠?
  shop: string;              // 搴楅摵 (e.g. 椤惧瀹跺眳瀹樻柟鏃楄埌搴?
  productId: string;         // 鍟嗗搧 ID (e.g. 562819028)
  skuId: string;             // SKU ID (e.g. 89201980)
  name: string;              // 鍟嗗搧鍚嶇О (e.g. 椤惧鐜颁唬绠€绾︾數鍔ㄥ姛鑳芥矙鍙?
  productUrl: string;        // 鍟嗗搧閾炬帴
  imageUrl: string;          // 涓诲浘
  
  productType: string;       // 浜у搧绫诲瀷 (e.g. 鍗曚汉浣? 鍙屼汉浣? 涓変汉浣? 缁勫悎娌欏彂)
  seatCount: number;         // 搴т綅鏁?(e.g. 1, 2, 3)
  structureForm: string;     // 缁撴瀯褰㈡€?(e.g. 鍔熻兘鍗曟, 缁勫悎娌欏彂)
  material: string;          // 鏉愯川 (e.g. 澶村眰榛勭墰鐨? 绉戞妧甯? 绮剧粏妫夐夯)
  filler: string;            // 濉厖鐗?(e.g. 3D楂樺脊娴风坏 + 鐙珛琚嬭寮圭哀)
  color: string;             // 棰滆壊 (e.g. 濂舵补鐧? 鐞ョ弨瑜? 鐑熼洦鐏?
  style: string;             // 椋庢牸 (e.g. 鐜颁唬绠€绾? 鎰忓紡杞诲ア, 缇庡紡缁忓吀, 鍖楁椋?
  
  // Dimensions & Mechanics
  width: number;             // 瀹藉害 (cm)
  depth: number;             // 娣卞害 (cm)
  height: number;            // 楂樺害 (cm)
  extendedDepth: number;     // 灞曞紑娣卞害 (cm)
  wallDistance: number;      // 绂诲璺濈 (cm)
  reclineType: string;       // 韬洪潬绫诲瀷 (e.g. 鐢靛姩, 鎵嬪姩)
  motorCount: number;        // 鐢垫満鏁伴噺
  
  // Intelligent Features
  zeroWall: boolean;         // 闆堕潬澧?(鏄?鍚?
  powerLift: boolean;        // 杈呭姪璧疯韩 (鏄?鍚?
  voiceControl: boolean;     // 璇煶鎺у埗 (鏄?鍚?
  usbCharging: boolean;      // USB 鍏呯數 (鏄?鍚?
  
  // Pricing
  currentPrice: number;       // 褰撳墠鏄剧ず浠?(鍏?
  promoPrice: number;         // 娲诲姩浠锋垨鍒稿悗浠?(鍏?
  priceSpec: string;          // 浠锋牸瀵瑰簲瑙勬牸 (e.g. 涓変汉浣嶇數鍔?绉戞妧甯?
  priceFetchTime: string;     // 浠锋牸鍙栧緱鏃堕棿 (e.g. 2026-05-29 02:00)
  priceSource: string;        // 浠锋牸鏁版嵁鏉ユ簮 (e.g. 绗笁鏂笰PI / 浜笢鍟嗙ゥ)
  
  // Third-party Metrics
  thirdPartySales: number;     // 绗笁鏂归攢閲忔寚鏍?(鍗?
  thirdPartyRevenue: number;   // 绗笁鏂归攢鍞鎸囨爣 (鍏?
  sourceRank: number;          // 鏉ユ簮鎺掑悕
  reviewCount: number;         // 璇勮鏁?  metricCycle: string;         // 鎸囨爣鍛ㄦ湡 (e.g. 30澶╃疮绉? 2026Q1)
  metricDefinition: string;    // 鎸囨爣瀹氫箟鍜屽彛寰勮鏄?(闈炵湡瀹為攢鍞紝浠呬綔涓烘祦琛屽害鍙傝€冩寚鏍?
  metricsFetchTime: string;    // 鎸囨爣鍙栧緱鏃堕棿
  metricsSource: string;       // 鎸囨爣鏉ユ簮
  
  // Administration Meta
  dataSource: '绗笁鏂?API' | '绗笁鏂?CSV-XLSX' | '浜哄伐 Excel'; // 鏁版嵁鏉ユ簮
  importBatch: string;         // 瀵煎叆鎵规 (e.g. P20260529A)
  auditStatus: '鏈鏍? | '宸叉牳瀵? | '瀛樺湪浜夎'; // 瀹℃牳鐘舵€?
  // Reliability Rules (鏁版嵁鍙俊瑙勫垯):
  // Backup of original imported values to prevent overwrite
  originalData: Record<string, any>; 
  
  // Mod log:
  modificationLogs: ModificationRecord[];
  
  // AI auxiliary labels (separate from actual factual data)
  aiTags?: string[];
}

export interface ModificationRecord {
  id: string;
  field: string;
  fieldName: string;
  oldValue: any;
  newValue: any;
  modifiedBy: string;
  modifiedAt: string;
  notes?: string;
}

export interface PKResult {
  factsConfirmed: string[];     // 宸茬‘璁や簨瀹?  commonSellingPoints: string[]; // 鍏卞悓鍗栫偣
  criticalDifferences: string[];// 鍏抽敭宸紓
  opportunitiesAndLimits: string; // 浜у搧鏈轰細涓庨檺鍒惰鏄?  limitationsDisclaimer: string; // AI缁撴灉闄愬埗璇存槑
}
