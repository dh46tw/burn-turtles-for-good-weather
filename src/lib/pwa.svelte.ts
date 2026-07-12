// PWA 安裝提示狀態：偵測平台、攔截 beforeinstallprompt、記錄 done 提示是否顯示過。
// 用 runes 存狀態，故需 .svelte.ts 副檔名（同 stores / i18n）。

// beforeinstallprompt 不在預設 DOM 型別內，補上最小宣告避免 svelte-check 報錯
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

// done 步驟的安裝提示只出現一次
const DONE_HINT_KEY = 'burn-turtles:pwaDoneHintShown:v1';

// iOS 無法程式化安裝，只能引導「分享 → 加入主畫面」，故需單獨判斷
function detectIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const iPhoneLike = /iphone|ipad|ipod/i.test(ua);
  // iPadOS 13+ 的 UA 偽裝成 Mac，用觸控點數輔助判斷
  const iPadOS = /macintosh/i.test(ua) && navigator.maxTouchPoints > 1;
  return iPhoneLike || iPadOS;
}

// 已以獨立 App 開啟（已安裝）就不再提示
function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const displayStandalone = window.matchMedia?.('(display-mode: standalone)').matches ?? false;
  const iosStandalone =
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return displayStandalone || iosStandalone;
}

class PwaInstall {
  // Android / 桌面 Chrome 攔到的原生安裝事件；null 表示尚未取得或不支援
  deferredPrompt = $state<BeforeInstallPromptEvent | null>(null);
  installed = $state(false);
  readonly isIOS = detectIOS();
  readonly isStandalone = detectStandalone();

  // 是否值得顯示安裝入口：已安裝一律不顯示；
  // Android 需已攔到事件，iOS 只要不是 standalone 就顯示（改走手動教學）
  get canInstall(): boolean {
    if (this.installed || this.isStandalone) return false;
    return this.deferredPrompt !== null || this.isIOS;
  }

  // 無原生事件可用、需顯示 iOS「分享 → 加入主畫面」教學
  get needsManualHint(): boolean {
    return this.canInstall && this.deferredPrompt === null;
  }

  // 需在 main.ts 早期呼叫：beforeinstallprompt 觸發很早，
  // 若等元件 onMount 才註冊監聽很可能已錯過
  init(): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('beforeinstallprompt', (e) => {
      // 攔下瀏覽器預設迷你提示，改由我們自訂入口觸發
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
    });
    window.addEventListener('appinstalled', () => {
      this.installed = true;
      this.deferredPrompt = null;
    });
  }

  // 觸發原生安裝視窗（Android / 桌面）。事件僅能用一次，用畢即棄。
  async promptInstall(): Promise<void> {
    const dp = this.deferredPrompt;
    if (!dp) return;
    await dp.prompt();
    await dp.userChoice;
    this.deferredPrompt = null;
  }

  // done 提示是否已顯示過（無痕模式讀寫失敗時視為未顯示，寬鬆處理）
  get doneHintShown(): boolean {
    try {
      return localStorage.getItem(DONE_HINT_KEY) === '1';
    } catch {
      return false;
    }
  }

  markDoneHintShown(): void {
    try {
      localStorage.setItem(DONE_HINT_KEY, '1');
    } catch {
      // 無痕模式忽略
    }
  }
}

export const pwaInstall = new PwaInstall();
