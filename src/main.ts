import { mount } from 'svelte';
import './app.css';
import App from './App.svelte';

// 掛載主應用程式
const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
