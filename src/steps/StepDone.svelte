<script lang="ts">
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { ritual } from '../lib/stores.svelte';
  import { i18n } from '../lib/i18n.svelte';
  import { pwaInstall } from '../lib/pwa.svelte';
  import { renderResultCard } from '../canvas/resultCard';

  const t = $derived(i18n.t.done);

  let cardUrl = $state('');
  let cardBlob: Blob | null = null;
  let canShare = $state(false);

  // 完成儀式後的一次性安裝提示（每裝置只出現一次）
  let showInstallHint = $state(false);
  let showIosSteps = $state(false);

  onMount(() => {
    const canvas = renderResultCard(ritual.wish, i18n.current);
    cardUrl = canvas.toDataURL('image/png');
    canvas.toBlob((b) => (cardBlob = b), 'image/png');
    // 是否支援分享圖片檔
    canShare =
      typeof navigator !== 'undefined' &&
      !!navigator.canShare &&
      navigator.canShare({ files: [new File([], 'x.png', { type: 'image/png' })] });

    // 可安裝且尚未提示過才顯示，並立即標記，避免下次再打擾
    if (pwaInstall.canInstall && !pwaInstall.doneHintShown) {
      showInstallHint = true;
      pwaInstall.markDoneHintShown();
    }
  });

  async function installFromDone() {
    if (pwaInstall.needsManualHint) {
      showIosSteps = true; // iOS：展開教學
    } else {
      await pwaInstall.promptInstall();
      showInstallHint = false;
    }
  }

  function save() {
    const a = document.createElement('a');
    a.href = cardUrl;
    a.download = `${t.downloadName}.png`;
    a.click();
  }

  async function share() {
    if (!cardBlob) return;
    const file = new File([cardBlob], `${t.downloadName}.png`, { type: 'image/png' });
    try {
      await navigator.share({ files: [file], text: t.shareText });
    } catch {
      // 使用者取消分享，忽略
    }
  }

  function again() {
    ritual.reset();
  }
</script>

<section class="done">
  <h2>{t.title}</h2>
  <p class="sub">{t.sub}</p>

  {#if cardUrl}
    <img class="card" src={cardUrl} alt={t.cardAlt} />
  {/if}

  <div class="actions">
    {#if canShare}
      <button class="btn" onclick={share}>{t.share}</button>
      <button class="btn btn--ghost" onclick={save}>{t.save}</button>
    {:else}
      <button class="btn" onclick={save}>{t.save}</button>
    {/if}
  </div>
  {#if showInstallHint}
    <div class="install-hint" transition:slide={{ duration: 200 }}>
      <p class="ih-title">{i18n.t.install.doneTitle}</p>
      <p class="ih-body">{i18n.t.install.doneBody}</p>
      {#if showIosSteps}
        <ol class="ih-steps">
          <li>{i18n.t.install.iosStep1}</li>
          <li>{i18n.t.install.iosStep2}</li>
        </ol>
      {:else}
        <div class="ih-actions">
          <button class="btn btn--ghost" onclick={installFromDone}>{i18n.t.install.doneCta}</button>
          <button class="ih-dismiss" onclick={() => (showInstallHint = false)}>
            {i18n.t.install.dismiss}
          </button>
        </div>
      {/if}
    </div>
  {/if}

  <button class="again" onclick={again}>{t.again}</button>
</section>

<style>
  .done {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
  }
  h2 {
    font-size: var(--fs-lead);
    margin: 0;
    color: var(--ink);
  }
  .sub {
    font-size: var(--fs-small);
    color: var(--ink-soft);
    margin: 0;
  }
  .card {
    width: 100%;
    max-width: 300px;
    border-radius: var(--radius);
    box-shadow: 0 6px 18px rgba(91, 59, 36, 0.18);
    margin: 0.25rem 0;
  }
  @media (min-width: 768px) {
    .card {
      max-width: 360px;
    }
  }
  .actions {
    display: flex;
    gap: 0.75rem;
  }
  .again {
    font: inherit;
    color: var(--ink-soft);
    background: transparent;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    padding: 0.3em;
  }
  .install-hint {
    width: 100%;
    max-width: 320px;
    background: var(--paper-2);
    border-radius: var(--radius);
    padding: 0.9rem 1rem;
    margin-top: 0.25rem;
  }
  .ih-title {
    font-size: var(--fs-small);
    font-weight: 600;
    color: var(--ink);
    margin: 0 0 0.3rem;
  }
  .ih-body {
    font-size: var(--fs-small);
    color: var(--ink-soft);
    line-height: 1.5;
    margin: 0 0 0.75rem;
  }
  .ih-actions {
    display: flex;
    gap: 0.6rem;
    align-items: center;
    justify-content: center;
  }
  .ih-dismiss {
    font: inherit;
    font-size: var(--fs-small);
    color: var(--ink-soft);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.3em 0.5em;
  }
  .ih-steps {
    text-align: left;
    margin: 0;
    padding-left: 1.4rem;
  }
  .ih-steps li {
    font-size: var(--fs-small);
    color: var(--ink-soft);
    line-height: 1.6;
  }
</style>
