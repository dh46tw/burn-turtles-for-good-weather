import type { Step, WishData } from './types';
import { loadLastWish, emptyWish } from './storage';

// 全域儀式狀態（使用 Svelte 5 runes）
class RitualState {
  step = $state<Step>('form');

  // 初始帶入上次填寫的內容（若有）
  wish = $state<WishData>(loadLastWish() ?? emptyWish());

  // 使用者繪製完成的圖案（存 canvas 影像）
  drawingDataUrl = $state<string | null>(null);

  goTo(step: Step) {
    this.step = step;
  }

  reset() {
    this.step = 'form';
    // 再燒一隻時同樣帶回上次內容，方便重複祈願
    this.wish = loadLastWish() ?? emptyWish();
    this.drawingDataUrl = null;
  }
}

export const ritual = new RitualState();
