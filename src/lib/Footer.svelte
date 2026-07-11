<script lang="ts">
  import { i18n, type Locale } from './i18n.svelte';

  const PROFILE = 'https://github.com/dh46tw';
  const REPO = 'https://github.com/dh46tw/burn-turtles-for-good-weather';
  const LICENSE = 'https://github.com/dh46tw/burn-turtles-for-good-weather/blob/main/LICENSE';

  const LANGS: Array<{ code: Locale; label: string }> = [
    { code: 'zh-TW', label: '中' },
    { code: 'en', label: 'EN' },
  ];
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
