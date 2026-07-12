import type { Locale } from './i18n.svelte';

// 全站 UI 文案字典。zh-TW 與 en 共用同一份 Messages 型別，
// 缺 key 會被 svelte-check 抓出來（交付關卡）。
// 驗證訊息不放這裡，與禁忌邏輯一起內聚在 validation.ts。
export interface Messages {
  app: {
    title: string; // document.title
  };
  steps: {
    form: string;
    draw: string;
    done: string;
  };
  form: {
    title: string;
    lead: string;
    about?: string; // 習俗說明（僅英文需要，降低文化隔閡；中文使用者已熟悉故從缺）
    eventName: string;
    eventNamePlaceholder: string;
    startDate: string;
    endDate: string;
    endDateHint: string;
    place: string;
    placePlaceholder: string;
    wish: string;
    wishHint: string;
    wishPlaceholder: string;
    tabooTitle: string;
    tabooBody: string;
    clear: string;
    start: string;
  };
  draw: {
    title: string;
    hint: string;
    paperAria: string;
    turtleGroupAria: string;
    turtleCountLabel: string;
    decrease: string;
    increase: string;
    paletteAria: string;
    addSticker: (emoji: string) => string;
    shrink: string;
    enlarge: string;
    sizeLabel: (emoji: string) => string;
    remove: string;
    back: string;
    next: string;
  };
  pray: {
    title: string;
    hint: string;
    at: (place: string) => string; // 「於 台北」
    taboo: string;
    reconsider: string;
    ignite: string;
  };
  burn: {
    caption: string;
  };
  done: {
    title: string;
    sub: string;
    cardAlt: string;
    share: string;
    save: string;
    again: string;
    downloadName: string; // 下載檔名（不含副檔名）
    shareText: string;
  };
  footer: {
    builtWith: string;
    langLabel: string; // 切換器的無障礙標籤
  };
  install: {
    button: string; // footer 常駐入口
    iosTitle: string; // iOS 教學標題
    iosStep1: string;
    iosStep2: string;
    doneTitle: string; // done 步驟一次性提示
    doneBody: string;
    doneCta: string;
    dismiss: string;
  };
}

const zhTW: Messages = {
  app: {
    title: '一起來燒烏龜 · 線上祈晴',
  },
  steps: {
    form: '祈願',
    draw: '繪製',
    done: '完成',
  },
  form: {
    title: '一起來燒烏龜',
    lead: '誠心祈求好天氣 · 電子祈晴儀式',
    eventName: '活動名稱',
    eventNamePlaceholder: '例：畢業典禮、演唱會、露營',
    startDate: '開始日期',
    endDate: '結束日期',
    endDateHint: '（單日免填）',
    place: '地點',
    placePlaceholder: '例：墾丁、台北小巨蛋',
    wish: '祈願詞',
    wishHint: '（只能用肯定句）',
    wishPlaceholder: '例：陽光普照、萬里無雲、大晴天',
    tabooTitle: '儀式小提醒',
    tabooBody: '全程保持雙手乾燥（水象徵雨氣）· 祈願只用肯定句 · 紙張需完全燒盡',
    clear: '清空',
    start: '開始祈願',
  },
  draw: {
    title: '擺放太陽與烏龜',
    hint: '太陽在上、烏龜朝著太陽 · 可拖曳微調或加點貼紙',
    paperAria: '祈願紙張',
    turtleGroupAria: '烏龜數量',
    turtleCountLabel: '🐢 隻數',
    decrease: '減少',
    increase: '增加',
    paletteAria: '貼紙',
    addSticker: (emoji) => `新增 ${emoji}`,
    shrink: '縮小',
    enlarge: '放大',
    sizeLabel: (emoji) => `${emoji} 大小`,
    remove: '刪除',
    back: '上一步',
    next: '擺好了',
  },
  pray: {
    title: '雙手合十，閉上眼睛',
    hint: '誠心默念以下的日期與祈願',
    at: (place) => `於 ${place}`,
    taboo: '🙏 儀式進行中請保持雙手乾燥，誠心默念後點火',
    reconsider: '再想想',
    ignite: '點火',
  },
  burn: {
    caption: '焚燒中…紙張化為灰燼，好天氣冉冉上升',
  },
  done: {
    title: '好天氣已送出',
    sub: '紙張已完全燒盡，願望隨煙上達 🐢',
    cardAlt: '祈晴完成卡片',
    share: '分享',
    save: '儲存圖片',
    again: '再燒一次 🐢',
    downloadName: '燒烏龜祈晴',
    shareText: '誠心祈求好天氣 🌞',
  },
  footer: {
    builtWith: 'Built with Claude',
    langLabel: '語言',
  },
  install: {
    button: '📲 安裝到手機',
    iosTitle: '加到主畫面',
    iosStep1: '點畫面下方的「分享」',
    iosStep2: '往下選「加入主畫面」',
    doneTitle: '把它帶在身邊',
    doneBody: '將燒烏龜加到主畫面，下次祈晴一點就開、離線也能燒。',
    doneCta: '加到主畫面',
    dismiss: '知道了',
  },
};

const en: Messages = {
  app: {
    title: 'Burn Turtles for Good Weather',
  },
  steps: {
    form: 'Wish',
    draw: 'Arrange',
    done: 'Done',
  },
  form: {
    title: "Let's Burn Some Turtles 🐢",
    lead: 'Praying for sunshine, the digital way',
    about:
      'A Taiwanese good-weather charm: draw a sun and some turtles, then burn the paper to send the clouds packing. (No real turtles harmed.)',
    eventName: 'Event name',
    eventNamePlaceholder: 'e.g. graduation, a concert, a camping trip',
    startDate: 'Start date',
    endDate: 'End date',
    endDateHint: '(leave blank for a single day)',
    place: 'Place',
    placePlaceholder: 'e.g. the beach, a stadium',
    wish: 'Your wish',
    wishHint: '(keep it positive!)',
    wishPlaceholder: 'e.g. bright sunshine, clear blue skies',
    tabooTitle: 'A few ground rules',
    tabooBody:
      'Keep your hands dry (water invites rain) · phrase your wish positively · let the paper burn all the way',
    clear: 'Clear',
    start: 'Begin the rite',
  },
  draw: {
    title: 'Arrange Your Sun & Turtles',
    hint: 'Sun up top, turtles facing it · drag things around or add stickers',
    paperAria: 'Wish paper',
    turtleGroupAria: 'Turtle count',
    turtleCountLabel: '🐢 count',
    decrease: 'Decrease',
    increase: 'Increase',
    paletteAria: 'Stickers',
    addSticker: (emoji) => `Add ${emoji}`,
    shrink: 'Shrink',
    enlarge: 'Enlarge',
    sizeLabel: (emoji) => `${emoji} size`,
    remove: 'Delete',
    back: 'Back',
    next: 'All set',
  },
  pray: {
    title: 'Palms Together, Eyes Closed',
    hint: 'Quietly recite the date and your wish',
    at: (place) => `at ${place}`,
    taboo: '🙏 Hands dry, recite from the heart, then light it up',
    reconsider: 'Not yet',
    ignite: 'Light it up',
  },
  burn: {
    caption: 'Up in smoke… and the good weather rises with it',
  },
  done: {
    title: 'Good Weather Is on Its Way',
    sub: 'All burned up — your wish is on its way 🐢',
    cardAlt: 'Completion card',
    share: 'Share',
    save: 'Save image',
    again: 'Burn again 🐢',
    downloadName: 'burn-turtles-good-weather',
    shareText: 'Praying for good weather 🌞',
  },
  footer: {
    builtWith: 'Built with Claude',
    langLabel: 'Language',
  },
  install: {
    button: '📲 Install app',
    iosTitle: 'Add to Home Screen',
    iosStep1: 'Tap the Share button below',
    iosStep2: 'Scroll down and pick "Add to Home Screen"',
    doneTitle: 'Keep it close',
    doneBody: 'Add Burn Turtles to your home screen — next rite is one tap away, even offline.',
    doneCta: 'Add to home screen',
    dismiss: 'Got it',
  },
};

export const messages: Record<Locale, Messages> = {
  'zh-TW': zhTW,
  en,
};
