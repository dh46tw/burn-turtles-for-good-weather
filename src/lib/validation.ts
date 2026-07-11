import type { WishData } from './types';

// 各欄位的錯誤訊息（無錯誤則為 undefined）
export interface WishErrors {
  eventName?: string;
  startDate?: string;
  endDate?: string;
  place?: string;
  wish?: string;
}

// 儀式禁忌：祈願詞只能用肯定句
// 1) 絕對不能出現「雨」字（水氣象徵，弄巧成拙）
const RAIN_CHAR = '雨';
// 2) 擋常見負面 / 否定字眼，引導改寫成肯定句
const NEGATIVE_WORDS = ['不要', '不會', '別', '勿', '莫', '沒有', '不下', '停止', '消失', '陰', '颱風', '暴風'];

// 檢查祈願詞是否符合肯定句規則
export function checkWish(wish: string): string | undefined {
  const text = wish.trim();
  if (!text) return '請寫下你的祈願';
  if (text.includes(RAIN_CHAR)) {
    return '祈願詞不能出現「雨」字，請改用肯定句（例：陽光普照）';
  }
  const hit = NEGATIVE_WORDS.find((w) => text.includes(w));
  if (hit) {
    return `請避免「${hit}」等負面字眼，只能用肯定句祈求好天氣`;
  }
  return undefined;
}

// 驗證整份表單，回傳各欄位錯誤
export function validateWish(data: WishData): WishErrors {
  const errors: WishErrors = {};

  if (!data.eventName.trim()) {
    errors.eventName = '請填寫活動名稱';
  }
  if (!data.startDate) {
    errors.startDate = '請選擇開始日期';
  }
  // 結束日期可留空（單日）；若有填則不能早於開始日期
  if (data.endDate && data.startDate && data.endDate < data.startDate) {
    errors.endDate = '結束日期不能早於開始日期';
  }
  if (!data.place.trim()) {
    errors.place = '請填寫地點';
  }

  const wishError = checkWish(data.wish);
  if (wishError) {
    errors.wish = wishError;
  }

  return errors;
}

// 表單是否可通過（無任何錯誤）
export function isWishValid(data: WishData): boolean {
  return Object.keys(validateWish(data)).length === 0;
}
