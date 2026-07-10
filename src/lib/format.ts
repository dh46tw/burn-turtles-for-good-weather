import type { WishData } from './types';

// 將 yyyy-mm-dd 轉為「M月D日」
function toMD(iso: string): string {
  const [, m, d] = iso.split('-');
  if (!m || !d) return iso;
  return `${Number(m)}月${Number(d)}日`;
}

// 格式化日期區間顯示：單日只顯示一天，多日顯示區間
export function formatDateRange(wish: WishData): string {
  if (!wish.startDate) return '';
  const start = toMD(wish.startDate);
  if (!wish.endDate || wish.endDate === wish.startDate) {
    return start;
  }
  return `${start} ～ ${toMD(wish.endDate)}`;
}
