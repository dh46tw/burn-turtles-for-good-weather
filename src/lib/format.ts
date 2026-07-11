import type { WishData } from './types';
import type { Locale } from './i18n.svelte';

// 把 yyyy-mm-dd 轉成當地 Date（以本地時間建構，避免時區位移少一天）
function toDate(iso: string): Date | null {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

// 依語系格式化單一日期（zh-TW → 「7月11日」；en → 「Jul 11」）
function formatOne(iso: string, locale: Locale): string {
  const date = toDate(iso);
  if (!date) return iso;
  const tag = locale === 'en' ? 'en-US' : 'zh-TW';
  return new Intl.DateTimeFormat(tag, { month: locale === 'en' ? 'short' : 'numeric', day: 'numeric' }).format(date);
}

// 格式化日期區間顯示：單日只顯示一天，多日顯示區間
export function formatDateRange(wish: WishData, locale: Locale): string {
  if (!wish.startDate) return '';
  const start = formatOne(wish.startDate, locale);
  if (!wish.endDate || wish.endDate === wish.startDate) {
    return start;
  }
  const sep = locale === 'en' ? ' – ' : ' ～ ';
  return `${start}${sep}${formatOne(wish.endDate, locale)}`;
}
