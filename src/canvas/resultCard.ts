import type { WishData } from '../lib/types';
import { formatDateRange } from '../lib/format';

// 產生可儲存 / 分享的結果圖（祈晴完成卡片）
export function renderResultCard(wish: WishData): HTMLCanvasElement {
  const W = 640;
  const H = 800;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext('2d')!;

  // 底色
  g.fillStyle = '#f6ebcb';
  g.fillRect(0, 0, W, H);

  // 內框
  g.strokeStyle = '#e8cfa0';
  g.lineWidth = 6;
  g.strokeRect(28, 28, W - 56, H - 56);

  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const emojiFont = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  const textFont = "'PingFang TC','Microsoft JhengHei',sans-serif";

  // 太陽
  g.font = `160px ${emojiFont}`;
  g.fillText('🌞', W / 2, 250);

  // 主標
  g.fillStyle = '#5b3b24';
  g.font = `700 52px ${textFont}`;
  g.fillText('好天氣已送出', W / 2, 400);

  // 日期 · 活動
  g.fillStyle = '#8a6a4f';
  g.font = `400 34px ${textFont}`;
  const info = wish.place
    ? `${formatDateRange(wish)} · ${wish.eventName} · ${wish.place}`
    : `${formatDateRange(wish)} · ${wish.eventName}`;
  g.fillText(info, W / 2, 470);

  // 祈願詞
  g.fillStyle = '#c0492a';
  g.font = `700 46px ${textFont}`;
  g.fillText(`「${wish.wish}」`, W / 2, 545);

  // 一排小烏龜朝太陽
  g.font = `44px ${emojiFont}`;
  const turtleY = 620;
  const xs = [W / 2 - 120, W / 2 - 40, W / 2 + 40, W / 2 + 120];
  xs.forEach((x) => {
    g.save();
    g.translate(x, turtleY);
    if (x < W / 2) g.scale(-1, 1); // 左側翻面朝中央
    g.fillText('🐢', 0, 0);
    g.restore();
  });

  // 頁尾
  g.fillStyle = '#a88c68';
  g.font = `400 26px ${textFont}`;
  g.fillText('線上燒烏龜 · 誠心祈晴', W / 2, H - 70);

  return canvas;
}
