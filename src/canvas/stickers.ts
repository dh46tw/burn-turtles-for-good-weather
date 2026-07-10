// 貼紙資料模型與可選 emoji 清單

// 一張貼紙：位置以佔紙張的比例儲存，尺寸以佔紙張寬度的比例儲存（跨裝置縮放一致）
export interface Sticker {
  id: number;
  emoji: string;
  xf: number; // 中心 x，0~1（相對紙張寬）
  yf: number; // 中心 y，0~1（相對紙張高）
  sizeF: number; // 字級，相對紙張寬（例：0.16）
}

// 調色盤：太陽與烏龜為主，其餘為好天氣點綴
export const STICKER_PALETTE = ['☀️', '🌞', '🌤️', '🐢', '☁️', '🌈', '⭐', '🔥', '🙏'];

// 貼紙尺寸
export const DEFAULT_SIZE_F = 0.16;
export const MIN_SIZE_F = 0.06;
export const MAX_SIZE_F = 0.4;
export const SIZE_STEP = 0.02;

// 貼紙可放置範圍的下緣（此值以下為底部祈願文字區，禁止放貼紙）
export const STICKER_MAX_YF = 0.74;

// 烏龜數量（預設 12、無上限）
export const TURTLE_EMOJI = '🐢';
export const DEFAULT_TURTLES = 12;
export const MIN_TURTLES = 1;

// 依數量把烏龜排列在紙張底部（回傳不含 id 的貼紙資料）。
// 數量少時單排散開；數量多時自動分成多排網格並縮小，避免擠成一團。
export function arrangeTurtles(n: number): Omit<Sticker, 'id'>[] {
  const count = Math.max(MIN_TURTLES, Math.floor(n));

  // 依總數決定每排欄數（越多欄、每隻越小）
  const cols = Math.min(count, Math.max(4, Math.round(Math.sqrt(count * 1.8))));
  const rows = Math.ceil(count / cols);
  const sizeF = Math.max(0.05, Math.min(0.14, (0.78 / cols) * 0.92));

  const left = 0.12;
  const right = 0.88;
  const bottom = 0.68; // 最底排的中心（在文字區之上）
  const rowGap = sizeF * 1.15; // 排與排的垂直間距

  const out: Omit<Sticker, 'id'>[] = [];
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    // 最後一排可能不滿，讓它置中
    const inRow = row === rows - 1 ? count - cols * row : cols;
    const t = inRow === 1 ? 0.5 : col / (inRow - 1);
    const xf = left + (right - left) * t;
    // 由底部往上堆疊，並加輕微錯落
    const yf = bottom - row * rowGap + Math.sin(i * 1.7) * 0.015;
    out.push({ emoji: TURTLE_EMOJI, xf, yf, sizeF });
  }
  return out;
}
