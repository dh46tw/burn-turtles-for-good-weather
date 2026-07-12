import { mount } from 'svelte';
import './app.css';
import App from './App.svelte';
import { pwaInstall } from './lib/pwa.svelte';

// 儘早註冊 PWA 安裝事件監聽（beforeinstallprompt 觸發很早，晚了會錯過）
pwaInstall.init();

// 掛載主應用程式
const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
