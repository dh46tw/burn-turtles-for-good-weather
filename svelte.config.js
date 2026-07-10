import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  // 使用 Vite 內建的預處理器，支援 TypeScript
  preprocess: vitePreprocess(),
};
