# Ancient Forest Web — 手機端優化規劃書

> 專案路徑：`ancient-forest-web/`  
> 規劃日期：2026-03-28  
> 狀態：✅ 已實作

---

## 一、問題診斷

分析原始碼後，找出以下 7 個在手機端造成困難的根本原因：

| # | 問題現象 | 根本原因 | 影響範圍 |
|---|---------|---------|---------|
| 1 | 頁面完全無法滾動 | `.app-container` 設有 `overflow: hidden` + `height: 100vh`，內容被鎖死在視窗內 | 整頁 |
| 2 | Scroll bar 不可見 | 瀏覽器預設隱藏 scrollbar，且原本沒有自訂樣式 | 所有面板 |
| 3 | 三欄面板垂直堆疊，需大量滾動 | 雖有 `≤1024px` media query，但三欄全部疊在一起，切換費力 | 主版面 |
| 4 | 沒有固定導覽列，切換困難 | Tab Bar（線索/人物/事件簿）被埋在右面板中，需先滾動才能找到 | 右面板 |
| 5 | 地圖熱點 Tooltip 無法觸發 | 僅實作 `onMouseEnter / onMouseLeave`，觸控裝置不支援 hover | 互動地圖 |
| 6 | 骰子視窗超出螢幕 | 固定 `width: 320px`，小螢幕寬度不足 | 骰子 Overlay |
| 7 | 頂部按鈕佔用過多空間 | `padding: 8px 16px` 固定大小，手機上與內容重疊 | 音效/編輯按鈕 |

---

## 二、優化方案

### 2-1 版面架構：單面板切換（核心改動）

**策略**：手機上一次只顯示一個面板，透過底部導覽列切換，取代原本三欄垂直疊加的方式。

```
桌面 (>768px)            手機 (≤768px)
┌──────┬──────┬──────┐   ┌─────────────────────┐
│ 調查員│ 地圖 │線索/ │   │                     │
│ 面板 │ /詳情│人物/ │   │  [單一面板顯示區]    │
│      │      │事件  │   │                     │
└──────┴──────┴──────┘   └─────────────────────┘
                          ┌──────┬──────┬───────┐  ← 固定底部
                          │🕵️調查員│🗺️地圖│📜線索│
                          └──────┴──────┴───────┘
```

**實作**：新增 `mobilePanelView` state（值為 `'left'` / `'center'` / `'right'`），預設顯示地圖中央面板。

---

### 2-2 底部導覽列

固定在螢幕底部（`position: fixed; bottom: 0`），三個 Tab 對應三個面板：

| 圖示 | 標籤 | 對應面板 |
|------|------|---------|
| 🕵️ | 調查員 | 左面板（調查小組 Investigators） |
| 🗺️ | 地圖/詳情 | 中間面板（互動地圖 / 選取後詳情） |
| 📜 | 線索/人物 | 右面板（線索、人物檔、事件簿 Tabs） |

**互動邏輯**：點擊調查員/線索/地圖熱點時，自動切換到中央面板（`setMobilePanelView('center')`），不需使用者手動切換。

---

### 2-3 滾動與 Scrollbar

- `app-container` 改為 `height: auto; overflow-y: auto`，允許整頁滾動
- 每個面板高度設為 `calc(100dvh - 130px)`（扣除頂部控制列與底部導覽列）
- 自訂可見 Scrollbar（WebKit）：

```css
.panel::-webkit-scrollbar { width: 3px; }
.panel::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.55); /* 金色 */
  border-radius: 2px;
}
```

---

### 2-4 互動地圖

- 地圖熱點點擊直接跳到中央面板顯示詳情，繞過 hover Tooltip
- 關閉手機上的 Tooltip（`.hotspot-tooltip { display: none !important; }`）
- 熱點觸控範圍從 12×12px 擴大到 20×20px

---

### 2-5 其他細節

| 項目 | 桌面 | 手機 |
|------|------|------|
| 骰子視窗寬度 | `320px` 固定 | `90vw`（最大 360px） |
| 頂部按鈕 padding | `8px 16px` | `5px 9px` |
| 頂部按鈕字體 | `0.8rem` | `0.65rem` |
| 卷宗/線索紙張旋轉效果 | ±1°~2° 旋轉 | 移除（影響閱讀） |
| Loading 標題字體 | `2.5rem` | `1.5rem` |

---

## 三、修改檔案清單

### `src/App.jsx`

1. 新增 `mobilePanelView` state（預設 `'center'`）
2. 修改 auto-scroll useEffect：≤768px 改為 state 切換，≤1024px 保留 scrollIntoView
3. 左面板加上 `mobile-hidden` class（`mobilePanelView !== 'left'`）
4. 中央面板加上 `mobile-hidden` class（`mobilePanelView !== 'center'`）
5. 右面板加上 `mobile-hidden` class（`mobilePanelView !== 'right'`）
6. 新增 `<nav className="mobile-nav">` 底部導覽列元件

### `src/index.css`

1. 新增 `.mobile-nav { display: none }` 預設（桌面隱藏）
2. 新增 `@media (max-width: 768px)` 區塊，包含：
   - `app-container` 允許滾動
   - `.mobile-hidden` 隱藏非作用面板
   - 面板高度與 `-webkit-overflow-scrolling: touch`
   - 可見 Scrollbar 樣式
   - `dice-overlay` 響應式寬度
   - 縮小頂部按鈕
   - 擴大地圖熱點觸控範圍
   - 隱藏 hover Tooltip
   - 移除小螢幕紙張旋轉效果
   - `.mobile-nav` 底部導覽列完整樣式

---

## 四、斷點策略

```
< 768px   → 手機模式：單面板 + 底部 Nav + 允許頁面滾動
768–1024px → 平板模式：維持原本三欄垂直疊加 + scrollIntoView 輔助
> 1024px  → 桌面模式：三欄並排，固定高度版面
```

---

## 五、後續可考慮的進階優化（未實作）

- [ ] 地圖支援手勢縮放（pinch-to-zoom），方便手機瀏覽地圖細節
- [ ] 角色卡改用水平橫向滑動（Horizontal Scroll Snap）取代垂直列表
- [ ] 事件簿改用原生 `<details>/<summary>` 手風琴，減少一次性載入的 DOM
- [ ] 圖片加上 `loading="lazy"`，加快初始載入速度
- [ ] 骰子 Overlay 改為由下往上滑入的 Bottom Sheet，更符合手機操作習慣
- [ ] 針對 iOS Safari 加上 `env(safe-area-inset-bottom)` 處理 Home Bar 遮擋問題
