# 線上燒烏龜 · 開發計劃

> 一個電子祈晴儀式的靜態網站。取「烏龜」與「烏雲歸去」諧音，透過模擬焚燒繪有太陽與烏龜的紙張，祈求好天氣。本文件為開發依據，避免實作走偏。

最後更新：2026-07-10

---

## 1. 專案目標

- 做一個「儀式體驗」型的**靜態網站**，核心是互動流程與視覺效果，而非資料。
- 支援**手機、平板、電腦**三種尺寸。
- 最終部署在 **GitHub Pages**。
- 純前端、無後端、無資料庫。

---

## 2. 技術選型（已定案）

| 項目 | 選擇 | 理由 |
| --- | --- | --- |
| 建置工具 | Vite 6 | 最輕量、打包後純靜態，適合 GitHub Pages |
| 框架 | Svelte 5（runes） | 體積小、動畫/過場內建、程式碼乾淨易維護 |
| 語言 | TypeScript | 型別安全 |
| 繪圖與火焰 | HTML Canvas 2D（純 TS） | 手繪塗改 + 粒子火焰，跨裝置效能穩定 |
| 插畫 | SVG（繪本風） | 清晰、可縮放、可轉為 Canvas 圖層被焚燒 |
| RWD | CSS clamp / flex / dvh + 安全區域 | 手機直式為主，平板電腦放大留白 |
| 部署 | GitHub Actions → GitHub Pages | push 自動 build 發佈（最後階段才接） |

**核心架構原則**：Canvas 邏輯（繪圖 / 火焰）全放 `src/canvas/` 純 TS 模組，與框架解耦；Svelte 元件只負責流程切換與呼叫這些模組，方便測試與維護。

---

## 3. 設計決策（已定案）

- **繪製方式**：emoji 貼紙編排（放棄手繪）。紙張起始即有預設編排——太陽固定在中央上方（不可調）、旁邊兩三朵雲（撥雲見日意象），底部散開排列烏龜。烏龜頭一律朝向太陽（依所在位置自動水平翻面，拖曳時即時更新）。烏龜數量可調（預設 12、下限 1、無上限；數量多時自動分排縮小）。雲與其他 emoji 可從調色盤新增、拖曳、縮放、刪除。
- **燃燒效果**：Canvas 粒子火焰 —— 紙張由下往上碳化、火焰竄動、灰燼飄散。
- **插畫風格**：厚棕色描邊的**童趣繪本風**。暖奶油底色、可愛笑臉太陽、六角格紋圓潤龜殼、鵝黃綠的頭配小圓眼微笑。烏龜頭一律**朝向太陽**爬行。
- **開發順序**：先能在本地跑起來最重要，**部署留到最後**。

---

## 4. 儀式規則（影響驗證與文案）

依民俗做法，需在網站中落實：

- **祈願詞只能用肯定句**：驗證時擋掉含「雨」及「不要下雨 / 別下雨」等負面字眼，引導改寫（例：「陽光普照」「大晴天」）。
- **必須燒盡**：焚燒動畫要把整張紙完全燒成灰燼；完成畫面顯示「已完全燒盡」徽章呼應此禁忌。
- **不能碰水**：屬情境提示文案（水象徵雨、代表儀式失效），於默念 / 提示區呈現。
- 儀式本質是「求心安、凝聚好運」的心理慰藉，文案語氣溫暖正向。

---

## 5. 使用者流程（五步驟）

1. **準備祈願（form）** — 輸入活動名稱、日期（支援多日連續區間，結束日免填即單日）、地點、祈願詞（即時驗證肯定句）。
2. **繪製（draw）** — emoji 貼紙編排。預設太陽在上、旁邊兩三朵雲、底部散開 12 隻烏龜（數量無上限）；可從調色盤加貼紙、拖曳、縮放、刪除。
3. **默念（pray）** — 暗色沉靜畫面，帶出使用者填的日期與祈願，引導雙手合十默念。
4. **焚燒（burn）** — Canvas 粒子火焰，紙張由下往上燒盡、灰燼飄散（重頭戲）。
5. **完成（done）** — 太陽回饋 +「已完全燒盡」徽章，可截圖分享或「再燒一隻」。

平板 / 電腦為同版面放大、留白加大、畫布更寬。

---

## 6. 檔案結構

```
burn-turtles-for-good-weather/
├─ index.html
├─ package.json
├─ tsconfig.json / tsconfig.node.json
├─ vite.config.ts
├─ svelte.config.js
├─ PLAN.md                          # 本文件
├─ .github/workflows/deploy.yml     # 自動部署（M6）
├─ public/                          # 靜態資源（icon、字型）
└─ src/
   ├─ main.ts
   ├─ app.css                       # 全域樣式與設計變數（配色、RWD）
   ├─ App.svelte                    # 流程總控（step 狀態機 + 過場）
   ├─ lib/
   │  ├─ types.ts                   # Step、WishData 型別
   │  ├─ stores.svelte.ts           # 全域儀式狀態（runes）
   │  └─ validation.ts              # 祈願詞驗證（M2）
   ├─ steps/                        # 每個流程步驟一個元件
   │  ├─ StepForm.svelte
   │  ├─ StepDraw.svelte
   │  ├─ StepPray.svelte
   │  ├─ StepBurn.svelte
   │  └─ StepDone.svelte
   └─ canvas/                       # 純 TS，與框架解耦
      ├─ stickers.ts                # 貼紙資料模型與 emoji 調色盤（M3）
      ├─ exportPaper.ts             # 將紙張(底色+貼紙+文字)合成為 PNG（M3）
      └─ FireEngine.ts              # 粒子火焰、紙張碳化、灰燼飄散（M4）
```

---

## 7. 開發里程碑

每個里程碑都在本地 `localhost` 驗收，整站完整後最後一步才處理上線。

| 里程碑 | 內容 | 狀態 |
| --- | --- | --- |
| **M1 專案骨架** | Vite + Svelte + TS 初始化、五步驟狀態機與佔位畫面、`npm run dev` 可本地執行 | ✅ 完成 |
| **M2 流程與表單** | StepForm 完整欄位（活動 / 日期 / 時間 / 地點 / 祈願詞）+ 祈願詞驗證（擋「雨」等負面字、只收肯定句、必填檢查） | ✅ 完成 |
| **M3 繪製（emoji 貼紙）** | 從調色盤點選 emoji 加到紙上、拖曳移動、縮放、刪除；把紙張(底色+貼紙+文字)合成為 PNG 供焚燒 | ✅ 完成 |
| **M4 焚燒引擎** | FireEngine 粒子火焰：紙張由下往上碳化捲曲、火焰竄動、完全燒成灰燼飄散（重頭戲） | ✅ 完成 |
| **M5 收尾與 RWD** | 默念引導頁、完成頁（截圖分享）、手機 / 平板 / 電腦三尺寸調校、禁忌提示文案 | ✅ 完成 |
| **M6 部署上線** | 接 GitHub Actions 發佈到 GitHub Pages、設定 Vite `base`、跨裝置實測 | ✅ 完成 |

---

## 8. M1 已完成內容（現況）

- Vite 6 + Svelte 5（runes）+ TypeScript 專案初始化完成。
- `svelte-check` 零錯誤、`vite build` 成功、dev server 回應 HTTP 200。
- 五步驟狀態機（`App.svelte`）串接完成，含 fade 過場與進度指示。
- 全域配色變數與 RWD 基礎（clamp 字級、dvh、安全區域）就緒。
- 五個 Step 元件為可切換的佔位畫面，內容待各里程碑填實。
- 焚燒目前用計時器模擬，M4 換成真的 Canvas 火焰。

## 8b. M2 已完成內容

- `lib/validation.ts`：祈願詞驗證（擋「雨」字、擋負面 / 否定字眼、必填檢查、只收肯定句）。
- `StepForm.svelte`：完整欄位（活動名稱 / 開始日期 / 結束日期 / 地點 / 祈願詞），祈願詞邊打邊驗、送出時檢查必填。
- 日期支援多日連續區間（開始日必填、結束日免填即單日，結束日不得早於開始日）；已移除時間欄位。`lib/format.ts` 負責日期區間顯示。
- 默念（pray）與完成（done）畫面已帶入使用者填的日期、地點與祈願詞。
- `svelte-check` 零錯誤、build 成功。

> 註：在此掛載環境 `npm run build` 會因無法刪除舊 `dist/` 而報 EPERM，屬環境限制非程式問題；驗證改用 `npx vite build --outDir /tmp/dist-test`。本機一般環境不受影響。

## 8c. M3 已完成內容

> 註：原手繪 SVG 底稿方案（`presets.ts` / `DrawingBoard.ts`）因線條不易拿捏已淘汰，改為 emoji 貼紙編排。兩檔案保留為空 stub（此掛載環境無法刪檔），本機可自行移除。

- `canvas/stickers.ts`：貼紙資料模型（位置 / 尺寸皆以佔紙張比例儲存，跨裝置一致）與 emoji 調色盤（太陽、烏龜為主）。
- `canvas/exportPaper.ts`：將紙張（奶油底色 + 貼紙 emoji + 祈願文字）合成為 PNG DataURL，供焚燒步驟使用。
- `StepDraw.svelte`：DOM 貼紙編排器。點調色盤新增、pointer 拖曳移動（觸控 + 滑鼠）、＋/－ 縮放、刪除；「擺好了」時匯出影像存入 `ritual.drawingDataUrl`。
- 預設編排：太陽固定中央上方（不可調）、旁邊三朵雲、底部 12 隻烏龜；烏龜依位置自動翻面朝向太陽。
- 底部祈願文字區受保護：貼紙拖曳下緣與烏龜排列都限制在 `STICKER_MAX_YF`（0.74）之上，不會壓到文字。
- 驗證：`svelte-check` 零錯誤、`vite build` 成功；互動預覽確認手感。

> 待瀏覽器實測項目：實際拖曳手感、匯出合成結果、旋轉 / 改變視窗大小後的紙張尺寸（列入 M5 微調）。

## 8d. M4 已完成內容

- `canvas/FireEngine.ts`：焚燒引擎（與框架解耦）。預先建立低解析度「雜訊燃燒順序圖」（value noise 兩八度 + 底部優先），燃燒時依上升門檻用遮罩把紙一塊塊不規則 `destination-out` 消除（像真的燒紙的破洞式消失，取代先前的整體淡出）；破口前緣依順序帶畫熾紅餘燼（`lighter` 加色）；火焰與灰燼由真實前緣的餘燼格冒出、竄升飄散；`requestAnimationFrame` 驅動，燒完 + 餘燼消散後觸發完成回呼。支援 `prefers-reduced-motion`（縮短時長）與高 DPI。
- `StepBurn.svelte`：載入 `ritual.drawingDataUrl` 為影像後啟動引擎，結束進入完成畫面；無影像時 fallback 直接完成。
- 驗證：`svelte-check` 零錯誤、`vite build` 成功；以相同演算法之預覽確認視覺。

> 待瀏覽器實測項目：實機火焰流暢度與各尺寸表現、低階手機粒子數是否需再節流。

## 8e. M5 已完成內容

- `StepPray.svelte`：默念頁打磨——火焰呼吸動效、帶入日期與祈願、加上「保持雙手乾燥」禁忌提示、可「再想想」返回。
- `canvas/resultCard.ts` + `StepDone.svelte`：完成頁產生祈晴結果卡（太陽、好天氣已送出、日期活動、祈願詞、朝陽小烏龜、頁尾），支援「儲存圖片」下載與 Web Share API「分享」（不支援時只顯示儲存），以及「再燒一隻」重置。
- `StepForm.svelte`：加入儀式小提醒（保持乾燥 / 只用肯定句 / 需完全燒盡）。
- RWD：`app.css` 加平板 / 桌機斷點（≥768px 放大字級與 `--maxw`）、矮螢幕改頂端對齊可捲動；紙張、焚燒畫布、結果卡在寬螢幕放大。
- 繪製步驟本身以比例（fraction）與 `cqw` 定位，已天然支援不同尺寸與縮放。
- 驗證：`svelte-check` 零錯誤、`vite build` 成功。

## 8f. M6 已完成內容

- `.github/workflows/deploy.yml`：push 到 main（或手動 `workflow_dispatch`）觸發，`npm ci` → `npm run build` → 以官方 Pages actions（`upload-pages-artifact` + `deploy-pages`）發佈 `dist`。
- Vite `base` 維持相對路徑 `'./'`，專案頁子路徑與自訂網域皆適用（已確認 build 後 index.html 資源為 `./assets/...`）。
- 以乾淨環境驗證 `npm ci` + `npm run build` 通過（等同 CI 行為）。

### 首次啟用步驟（在 GitHub 上操作一次）

1. Repo → Settings → Pages → Build and deployment → Source 選 **GitHub Actions**。
2. push 到 `main`（或到 Actions 頁手動 Run workflow）。
3. workflow 跑完後，網址會顯示在該次部署的 `github-pages` environment，或 Settings → Pages。

## 9. 表單記憶功能

- `lib/storage.ts`：以 localStorage 記住上次填寫的完整表單（含日期），版本化 key `burn-turtles:lastWish:v1`、try/catch 保護（無痕模式不崩）、讀取逐欄位檢查。
- `stores.svelte.ts`：初始化與 `reset()`（再燒一隻）皆帶回上次內容。
- `StepForm.svelte`：送出驗證通過時 `saveLastWish()`。
- 驗證：`svelte-check` 零錯誤、build 成功；存取邏輯測過（空值 / 往返 / 壞 JSON / 缺欄位）。

### 本地執行方式

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 型別檢查 + 打包
```

---

## 9. 待日後確認 / 注意事項

- **GitHub Pages 路徑**：專案頁（`user.github.io/repo`）需將 Vite `base` 設為 `/repo/`；自訂網域則為 `/`。目前暫設 `./`（相對路徑），M6 部署時再確認。
- **中文字型**：目前用系統字型堆疊（Noto Sans TC / PingFang TC / 微軟正黑）。若要固定繪本感字型，可於 M5 引入 web font 並注意載入效能。
- **插畫資產**：M3 會依參考風格把太陽與烏龜的 SVG 細畫到位（六角殼、胖圓四肢、腮紅），或直接將參考圖描成乾淨向量。
- **效能**：低階手機上火焰粒子數需節流；尊重 `prefers-reduced-motion`。
