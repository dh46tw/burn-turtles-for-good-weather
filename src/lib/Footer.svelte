<script lang="ts">
  import { slide } from 'svelte/transition';
  import { i18n, type Locale } from './i18n.svelte';
  import { pwaInstall } from './pwa.svelte';

  const PROFILE = 'https://github.com/dh46tw';
  const REPO = 'https://github.com/dh46tw/burn-turtles-for-good-weather';
  const LICENSE = 'https://github.com/dh46tw/burn-turtles-for-good-weather/blob/main/LICENSE';

  const LANGS: Array<{ code: Locale; label: string }> = [
    { code: 'zh-TW', label: '中' },
    { code: 'en', label: 'EN' },
  ];

  // iOS 無原生安裝，點按鈕改展開「分享 → 加入主畫面」教學
  let showIosSteps = $state(false);

  async function onInstallClick() {
    if (pwaInstall.needsManualHint) {
      showIosSteps = !showIosSteps;
    } else {
      await pwaInstall.promptInstall();
    }
  }
</script>

<footer class="footer">
  <div class="lang" role="group" aria-label={i18n.t.footer.langLabel}>
    {#each LANGS as l}
      <button
        class="lang-btn"
        class:active={i18n.current === l.code}
        aria-pressed={i18n.current === l.code}
        onclick={() => i18n.set(l.code)}
      >
        {l.label}
      </button>
    {/each}
  </div>
  {#if pwaInstall.canInstall}
    <div class="install">
      <button
        class="install-btn"
        onclick={onInstallClick}
        aria-expanded={pwaInstall.needsManualHint ? showIosSteps : undefined}
      >
        {i18n.t.install.button}
      </button>
      {#if showIosSteps}
        <div class="ios-steps" transition:slide={{ duration: 200 }}>
          <p class="ios-title">{i18n.t.install.iosTitle}</p>
          <ol>
            <li>{i18n.t.install.iosStep1}</li>
            <li>{i18n.t.install.iosStep2}</li>
          </ol>
        </div>
      {/if}
    </div>
  {/if}

  <p class="line1">
    © 2026
    <a href={PROFILE} target="_blank" rel="noopener noreferrer">dh46tw</a>
    <span class="dot" aria-hidden="true">·</span>
    <a href={REPO} target="_blank" rel="noopener noreferrer">GitHub</a>
    <span class="dot" aria-hidden="true">·</span>
    <a href={LICENSE} target="_blank" rel="noopener noreferrer">MIT License</a>
  </p>
  <p class="line2">{i18n.t.footer.builtWith}</p>
</footer>

<style>
  .footer {
    text-align: center;
    padding: 1.25rem 0 0.5rem;
    color: var(--ink-soft);
  }
  .lang {
    display: inline-flex;
    gap: 0.15rem;
    margin-bottom: 0.75rem;
    padding: 0.15rem;
    border-radius: 999px;
    background: var(--paper-2);
  }
  .lang-btn {
    font: inherit;
    font-size: 0.78rem;
    line-height: 1;
    color: var(--ink-soft);
    background: transparent;
    border: none;
    border-radius: 999px;
    padding: 0.35em 0.8em;
    cursor: pointer;
    transition:
      background 0.15s ease,
      color 0.15s ease;
  }
  .lang-btn.active {
    color: #fff;
    background: var(--flame);
  }
  .install {
    margin-bottom: 0.85rem;
  }
  .install-btn {
    font: inherit;
    font-size: 0.78rem;
    line-height: 1;
    color: var(--ink-soft);
    background: var(--paper-2);
    border: 1px solid transparent;
    border-radius: 999px;
    padding: 0.45em 1em;
    cursor: pointer;
    transition:
      border-color 0.15s ease,
      color 0.15s ease;
  }
  .install-btn:hover {
    color: var(--ink);
    border-color: var(--flame);
  }
  .ios-steps {
    margin: 0.6rem auto 0;
    max-width: 15rem;
    text-align: left;
    background: var(--paper-2);
    border-radius: var(--radius);
    padding: 0.7rem 0.9rem 0.7rem 0.5rem;
  }
  .ios-title {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--ink);
    margin: 0 0 0.35rem 0.9rem;
  }
  .ios-steps ol {
    margin: 0;
    padding-left: 1.6rem;
  }
  .ios-steps li {
    font-size: 0.76rem;
    color: var(--ink-soft);
    line-height: 1.5;
  }
  .line1 {
    font-size: 0.8rem;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4em;
    justify-content: center;
    align-items: center;
  }
  .line1 a {
    color: var(--ink-soft);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.15s ease;
  }
  .line1 a:hover {
    border-bottom-color: var(--ink-soft);
  }
  .dot {
    opacity: 0.5;
  }
  .line2 {
    font-size: 0.72rem;
    opacity: 0.6;
    margin: 0.35rem 0 0;
  }
</style>
