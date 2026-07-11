<script lang="ts">
  import { onMount } from 'svelte';
  import { ritual } from '../lib/stores.svelte';
  import { i18n } from '../lib/i18n.svelte';
  import { renderResultCard } from '../canvas/resultCard';

  const t = $derived(i18n.t.done);

  let cardUrl = $state('');
  let cardBlob: Blob | null = null;
  let canShare = $state(false);

  onMount(() => {
    const canvas = renderResultCard(ritual.wish, i18n.current);
    cardUrl = canvas.toDataURL('image/png');
    canvas.toBlob((b) => (cardBlob = b), 'image/png');
    // 是否支援分享圖片檔
    canShare =
      typeof navigator !== 'undefined' &&
      !!navigator.canShare &&
      navigator.canShare({ files: [new File([], 'x.png', { type: 'image/png' })] });
  });

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
</style>
