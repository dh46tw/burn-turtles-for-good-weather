import type { WishData } from '../lib/types';
import type { Locale } from '../lib/i18n.svelte';
import { formatDateRange } from '../lib/format';

// 完成卡片上的在地化文字
const CARD_TEXT: Record<Locale, { title: string; footer: string }> = {
  'zh-TW': { title: '好天氣已送出', footer: '線上燒烏龜 · 誠心祈晴' },
  en: { title: 'Good weather is on its way', footer: 'Burn Turtles for Good Weather' },
};

// 產生可儲存 / 分享的結果圖（祈晴完成卡片）
export function renderResultCard(wish: WishData, locale: Locale): HTMLCanvasElement {
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
  const textFont = "'PingFang TC','Microsoft JhengHei','Segoe UI',sans-serif";
  const t = CARD_TEXT[locale];

  // 置中畫一行文字，字級過寬時自動縮小以塞進卡片（英文較長時特別需要）
  const maxW = W - 120;
  function line(text: string, weight: number, size: number, y: number) {
    let px = size;
    do {
      g.font = `${weight} ${px}px ${textFont}`;
      if (g.measureText(text).width <= maxW || px <= 20) break;
      px -= 2;
    } while (true);
    g.fillText(text, W / 2, y);
  }

  // 太陽
  g.font = `160px ${emojiFont}`;
  g.fillText('🌞', W / 2, 250);

  // 主標
  g.fillStyle = '#5b3b24';
  line(t.title, 700, 52, 400);

  // 日期 · 活動
  g.fillStyle = '#8a6a4f';
  const info = wish.place
    ? `${formatDateRange(wish, locale)} · ${wish.eventName} · ${wish.place}`
    : `${formatDateRange(wish, locale)} · ${wish.eventName}`;
  line(info, 400, 34, 470);

  // 祈願詞
  g.fillStyle = '#c0492a';
  const quoted = locale === 'en' ? `“${wish.wish}”` : `「${wish.wish}」`;
  line(quoted, 700, 46, 545);

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
  line(t.footer, 400, 26, H - 70);

  return canvas;
}
