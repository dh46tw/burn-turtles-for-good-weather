import type { Step, WishData } from './types';

// 全域儀式狀態（使用 Svelte 5 runes）
class RitualState {
  step = $state<Step>('form');

  wish = $state<WishData>({
    eventName: '',
    startDate: '',
    endDate: '',
    place: '',
    wish: '',
  });

  // 使用者繪製完成的圖案（之後 M3 存 canvas 影像）
  drawingDataUrl = $state<string | null>(null);

  goTo(step: Step) {
    this.step = step;
  }

  reset() {
    this.step = 'form';
    this.wish = { eventName: '', startDate: '', endDate: '', place: '', wish: '' };
    this.drawingDataUrl = null;
  }
}

export const ritual = new RitualState();
