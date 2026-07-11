import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

// base 維持相對路徑 './'，同時相容 GitHub Pages 子路徑與自訂網域
export default defineConfig({
  base: './',
  plugins: [
    svelte(),
    VitePWA({
      // 有新版本時自動更新 service worker
      registerType: 'autoUpdate',
      // 自動在 index.html 注入 SW 註冊腳本
      injectRegister: 'auto',
      // 由 public/icon-emoji.png（☀️🐢 emoji 組合，奶油底）自動產生
      // 192/512/maskable/apple-touch 等各尺寸 icon，並注入 manifest 與 <head>
      pwaAssets: {
        image: 'public/icon-emoji.png',
        // 自訂 preset：maskable / apple 的留白改用奶油底填充（預設為透明），
        // 避免 Android 圓形遮罩與 iOS icon 出現一圈白邊
        preset: {
          transparent: { sizes: [64, 192, 512], favicons: [[48, 'favicon.ico']] },
          maskable: { sizes: [512], padding: 0.3, resizeOptions: { background: '#f6ebcb' } },
          apple: { sizes: [180], padding: 0.3, resizeOptions: { background: '#f6ebcb' } },
        },
      },
      manifest: {
        id: './',
        name: '一起來燒烏龜 · Burn Turtles for Good Weather',
        short_name: '燒烏龜',
        description: '線上燒烏龜 — 電子祈晴儀式，誠心祈求好天氣。',
        lang: 'zh-Hant',
        theme_color: '#f6ebcb',
        background_color: '#f6ebcb',
        display: 'standalone',
        orientation: 'portrait',
        // 相對路徑：讓子路徑部署下 scope / 進入點都正確
        start_url: './',
        scope: './',
      },
      workbox: {
        // 預先快取建置產物，達成離線可開啟
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
      },
    }),
  ],
});
