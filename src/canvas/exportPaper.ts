import type { WishData } from '../lib/types';
import type { Locale } from '../lib/i18n.svelte';
import { formatDateRange } from '../lib/format';
import { TURTLE_EMOJI, type Sticker } from './stickers';

// 太陽固定在中央上方；烏龜若在太陽左側需水平翻面才會頭朝太陽
const SUN_XF = 0.5;
function shouldFlip(s: Sticker): boolean {
  return s.emoji === TURTLE_EMOJI && s.xf < SUN_XF;
}

interface ExportOptions {
  width: number; // 紙張顯示寬（CSS px）
  height: number; // 紙張顯示高（CSS px）
  wish: WishData;
  stickers: Sticker[];
  locale: Locale;
}

const EMOJI_FONT =
  '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif';
const TEXT_FONT = "'PingFang TC','Microsoft JhengHei','Segoe UI',sans-serif";

// 將整張紙（奶油底色 + 貼紙 + 祈願文字）合成為 PNG DataURL，供焚燒步驟使用
export function exportPaper({ width, height, wish, stickers, locale }: ExportOptions): string {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const g = canvas.getContext('2d')!;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);

  // 紙張底色
  g.fillStyle = '#fdf6e3';
  g.fillRect(0, 0, width, height);

  // 貼紙
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  for (const s of stickers) {
    g.font = `${s.sizeF * width}px ${EMOJI_FONT}`;
    const x = s.xf * width;
    const y = s.yf * height;
    if (shouldFlip(s)) {
      g.save();
      g.translate(x, y);
      g.scale(-1, 1); // 水平翻面，讓左側烏龜頭朝右邊的太陽
      g.fillText(s.emoji, 0, 0);
      g.restore();
    } else {
      g.fillText(s.emoji, x, y);
    }
  }

  // 祈願文字（紙張下方）
  const cx = width / 2;
  let y = height * 0.8;
  const lineGap = width * 0.075;
  g.fillStyle = '#5b3b24';
  g.font = `700 ${width * 0.058}px ${TEXT_FONT}`;
  g.fillText(formatDateRange(wish, locale), cx, y);

  y += lineGap;
  g.font = `500 ${width * 0.05}px ${TEXT_FONT}`;
  const where = wish.place ? `${wish.eventName} · ${wish.place}` : wish.eventName;
  g.fillText(where, cx, y);

  y += lineGap;
  g.fillStyle = '#c0492a';
  g.font = `700 ${width * 0.06}px ${TEXT_FONT}`;
  const quoted = locale === 'en' ? `“${wish.wish}”` : `「${wish.wish}」`;
  g.fillText(quoted, cx, y);

  return canvas.toDataURL('image/png');
}
