import { messages, type Messages } from './messages';

// 支援語言
export type Locale = 'zh-TW' | 'en';

const KEY = 'burn-turtles:locale:v1';

// 決定初始語言：先看使用者存過的選擇，否則依瀏覽器語系（en* → en，其餘 → zh-TW）
function detect(): Locale {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'en' || saved === 'zh-TW') return saved;
  } catch {
    // 無痕模式等：忽略
  }
  const nav = typeof navigator !== 'undefined' ? navigator.language : '';
  return nav.toLowerCase().startsWith('en') ? 'en' : 'zh-TW';
}

// 全域語言狀態（Svelte 5 runes）。元件模板讀 i18n.t.xxx 會反應式更新，
// 因為 t getter 讀取 current（$state）。
class I18n {
  current = $state<Locale>(detect());

  get t(): Messages {
    return messages[this.current];
  }

  set(locale: Locale) {
    this.current = locale;
    try {
      localStorage.setItem(KEY, locale);
    } catch {
      // 無痕模式等：靜默忽略
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale === 'en' ? 'en' : 'zh-Hant';
    }
  }
}

export const i18n = new I18n();
