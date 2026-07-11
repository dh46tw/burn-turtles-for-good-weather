# 🐢 線上燒烏龜

> English → [README.md](./README.md)

一個**線上燒烏龜**的祈晴小網站——填寫活動資訊、在紙上擺放太陽與烏龜貼紙，再看著它燒成
灰燼，把祈求好天氣的心願送出去。沒有真的火、也沒有真的烏龜，純粹是電子化的心安。☀️

**線上展示：** https://dh46tw.github.io/burn-turtles-for-good-weather/

|![preview-page-1](docs/preview-page-1.png)|![preview-page-2](docs/preview-page-2.png)|
|---|---|

## 「燒烏龜」是什麼？

「燒烏龜」是台灣與華語圈廣受歡迎的祈晴儀式。取「烏龜」與「烏雲歸去」的諧音，藉由焚燒
畫有太陽與烏龜（頭一律朝向太陽）的紙張，趕走雨氣、祈求好天氣。傳統做法會在乾淨的白紙
上畫太陽與烏龜，寫下活動、日期與**只用肯定句**的祈願，再將紙張完全燒盡。

本專案是這個儀式的電子環保版。

## 功能特色

- **五步驟儀式流程** — 準備 → 擺放 → 默念 → 焚燒 → 完成。
- **祈願詞驗證** — 只接受肯定句，會擋掉「雨」字與其他負面字眼，呼應儀式禁忌。
- **多日日期區間** — 支援跨越多天的活動（開始 / 結束日期）。
- **emoji 貼紙編排** — 太陽固定在上方、旁邊幾朵雲（撥雲見日），底部散開一排朝向太陽的
  烏龜。烏龜數量可調且無上限；貼紙可新增 / 拖曳 / 縮放 / 刪除。
- **雜訊溶解焚燒動畫** — Canvas 粒子引擎讓紙張由下往上以不規則破洞式燒盡，破口前緣
  發紅、火焰竄升、灰燼飄散。
- **可分享結果卡** — 儲存或分享祈晴完成圖。
- **表單記憶** — 以 `localStorage` 記住上次填寫內容。
- **中英雙語（中文 / English）** — 不依賴任何 i18n 套件，採輕量的 runes 方案。語言切換
  器位於頁尾；初次語系會依 `localStorage`、再依瀏覽器語言自動偵測。連祈願禁忌都在地化——
  `zh-TW` 擋「雨」字，`en` 擋單字 "rain" 但放行 "rainbow"。
- **可安裝 PWA** — 可加入主畫面、離線也能開啟。以
  [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) 建置：service worker 自動更新並
  預先快取建置產物，app icon 由單一張 ☀️🐢 emoji 圖自動產生各尺寸。
- **響應式版面** — 支援手機、平板、電腦。

## 技術棧

- [Vite](https://vitejs.dev/) 6
- [Svelte](https://svelte.dev/) 5（runes）
- TypeScript
- HTML Canvas 2D（紙張合成 + 焚燒引擎），無後端
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)（可安裝 + 離線 PWA）

## 本地開發

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 型別檢查（svelte-check）+ 正式打包到 dist/
npm run preview  # 於本地預覽正式打包結果
```

## 部署

push 到 `main` 會觸發 GitHub Actions
（[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)），自動建置並把 `dist/`
發佈到 GitHub Pages。

首次設定：在 repo 的 **Settings → Pages → Build and deployment → Source** 選擇
**GitHub Actions**。Vite 的 `base` 設為相對路徑，因此專案頁（`user.github.io/repo`）與
自訂網域皆適用。

## 專案結構

```
src/
├─ App.svelte            # 五步驟狀態機 + 過場 + 頁尾
├─ app.css               # 主題變數 + 響應式基礎
├─ lib/
│  ├─ types.ts           # Step / WishData 型別
│  ├─ stores.svelte.ts   # 全域儀式狀態（runes）
│  ├─ validation.ts      # 祈願詞驗證（只收肯定句，禁忌在地化）
│  ├─ format.ts          # 日期區間格式化
│  ├─ storage.ts         # localStorage 表單記憶
│  ├─ i18n.svelte.ts     # 語系 store（runes）+ 偵測 / 持久化
│  ├─ messages.ts        # zh-TW / en UI 字典（共用一個 Messages 型別）
│  └─ Footer.svelte      # 頁尾 + 語言切換器
├─ steps/                # 每個步驟一個元件
│  ├─ StepForm / StepDraw / StepPray / StepBurn / StepDone.svelte
└─ canvas/               # 與框架解耦的純 TS
   ├─ stickers.ts        # 貼紙模型 + emoji 調色盤 + 烏龜排列
   ├─ exportPaper.ts     # 合成紙張（底色 + 貼紙 + 文字）→ PNG
   ├─ resultCard.ts      # 可分享的完成圖
   └─ FireEngine.ts      # 雜訊溶解焚燒動畫
```

## 授權

[MIT](./LICENSE) © 2026 dh46tw

## 製作

Built with Claude.
