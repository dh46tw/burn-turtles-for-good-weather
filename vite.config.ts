import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// base 之後部署到 GitHub Pages 時再依儲存庫名稱調整（M6 處理）
export default defineConfig({
  plugins: [svelte()],
  base: './',
});
