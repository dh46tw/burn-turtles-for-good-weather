import type { WishData } from './types';
import type { Locale } from './i18n.svelte';

// 各欄位的錯誤訊息（無錯誤則為 undefined）
export interface WishErrors {
  eventName?: string;
  startDate?: string;
  endDate?: string;
  place?: string;
  wish?: string;
}

// 儀式禁忌：祈願詞只能用肯定句。每個語系各一組禁字規則與訊息。
interface TabooRules {
  emptyWish: string;
  eventName: string;
  startDate: string;
  endDate: string;
  place: string;
  // 檢查祈願詞，命中禁字則回傳錯誤訊息，否則 undefined
  checkWish(text: string): string | undefined;
}

const RULES: Record<Locale, TabooRules> = {
  'zh-TW': {
    emptyWish: '請寫下你的祈願',
    eventName: '請填寫活動名稱',
    startDate: '請選擇開始日期',
    endDate: '結束日期不能早於開始日期',
    place: '請填寫地點',
    checkWish(text) {
      // 1) 絕對不能出現「雨」字（水氣象徵，弄巧成拙）
      if (text.includes('雨')) {
        return '祈願詞不能出現「雨」字，請改用肯定句（例：陽光普照）';
      }
      // 2) 擋常見負面 / 否定字眼，引導改寫成肯定句
      const negatives = ['不要', '不會', '別', '勿', '莫', '沒有', '不下', '停止', '消失', '陰', '颱風', '暴風'];
      const hit = negatives.find((w) => text.includes(w));
      if (hit) {
        return `請避免「${hit}」等負面字眼，只能用肯定句祈求好天氣`;
      }
      return undefined;
    },
  },
  en: {
    emptyWish: 'Please write your wish',
    eventName: 'Please enter an event name',
    startDate: 'Please pick a start date',
    endDate: 'End date cannot be earlier than the start date',
    place: 'Please enter a place',
    checkWish(text) {
      // 用字界比對，避免誤擋 rainbow（\brain\b 不會命中 rain+bow）
      const NEGATIVE_RE =
        /\b(rain|rainy|storm|stormy|typhoon|cloudy|overcast|gloomy|wet|no|not|don'?t|stop|never|cancel)\b/i;
      const m = text.match(NEGATIVE_RE);
      if (m) {
        return `Please avoid "${m[0]}" — use positive phrasing only (e.g. bright sunshine)`;
      }
      return undefined;
    },
  },
};

// 檢查祈願詞是否符合肯定句規則
export function checkWish(wish: string, locale: Locale): string | undefined {
  const text = wish.trim();
  const rules = RULES[locale];
  if (!text) return rules.emptyWish;
  return rules.checkWish(text);
}

// 驗證整份表單，回傳各欄位錯誤
export function validateWish(data: WishData, locale: Locale): WishErrors {
  const errors: WishErrors = {};
  const rules = RULES[locale];

  if (!data.eventName.trim()) {
    errors.eventName = rules.eventName;
  }
  if (!data.startDate) {
    errors.startDate = rules.startDate;
  }
  // 結束日期可留空（單日）；若有填則不能早於開始日期
  if (data.endDate && data.startDate && data.endDate < data.startDate) {
    errors.endDate = rules.endDate;
  }
  if (!data.place.trim()) {
    errors.place = rules.place;
  }

  const wishError = checkWish(data.wish, locale);
  if (wishError) {
    errors.wish = wishError;
  }

  return errors;
}

// 表單是否可通過（無任何錯誤）
export function isWishValid(data: WishData, locale: Locale): boolean {
  return Object.keys(validateWish(data, locale)).length === 0;
}
