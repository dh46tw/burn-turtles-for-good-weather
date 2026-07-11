import type { WishData } from './types';

// 記住上次填寫的表單內容（localStorage）
const KEY = 'burn-turtles:lastWish:v1';

export function emptyWish(): WishData {
  return { eventName: '', startDate: '', endDate: '', place: '', wish: '' };
}

// 讀取上次填寫內容；無資料 / 解析失敗 / 無痕模式皆回傳 null
export function loadLastWish(): WishData | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Record<string, unknown>;
    if (typeof d !== 'object' || d === null) return null;
    // 逐欄位檢查並轉字串，避免讀到壞資料
    return {
      eventName: String(d.eventName ?? ''),
      startDate: String(d.startDate ?? ''),
      endDate: String(d.endDate ?? ''),
      place: String(d.place ?? ''),
      wish: String(d.wish ?? ''),
    };
  } catch {
    return null;
  }
}

// 儲存本次填寫內容；失敗（如無痕模式）則靜默忽略
export function saveLastWish(wish: WishData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(wish));
  } catch {
    // 忽略儲存錯誤
  }
}
