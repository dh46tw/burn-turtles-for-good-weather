<script lang="ts">
  import { ritual } from '../lib/stores.svelte';
  import { validateWish, checkWish } from '../lib/validation';
  import { saveLastWish, emptyWish } from '../lib/storage';

  // 是否已嘗試送出（送出後才顯示必填錯誤，避免一進來就紅通通）
  let submitted = $state(false);

  // 即時計算各欄位錯誤
  const errors = $derived(validateWish(ritual.wish));

  // 祈願詞邊打邊驗（讓使用者立刻知道踩到「雨」等禁字）
  const wishError = $derived(checkWish(ritual.wish.wish));

  function next() {
    submitted = true;
    if (Object.keys(errors).length === 0) {
      saveLastWish(ritual.wish); // 記住本次填寫內容
      ritual.goTo('draw');
    }
  }

  // 清空所有欄位並重置提示狀態
  function clearForm() {
    ritual.wish = emptyWish();
    submitted = false;
  }
</script>

<section class="form">
  <header class="head">
    <h1>一起來燒烏龜</h1>
    <p class="lead">誠心祈求好天氣 · 電子祈晴儀式</p>
  </header>

  <div class="fields">
    <label class="field">
      <span class="label">活動名稱</span>
      <input
        type="text"
        placeholder="例：畢業典禮、演唱會、露營"
        bind:value={ritual.wish.eventName}
        class:err={submitted && errors.eventName}
      />
      {#if submitted && errors.eventName}
        <span class="msg">{errors.eventName}</span>
      {/if}
    </label>

    <div class="row">
      <label class="field">
        <span class="label">開始日期</span>
        <input
          type="date"
          bind:value={ritual.wish.startDate}
          class:err={submitted && errors.startDate}
        />
        {#if submitted && errors.startDate}
          <span class="msg">{errors.startDate}</span>
        {/if}
      </label>
      <label class="field">
        <span class="label">結束日期 <em>（單日免填）</em></span>
        <input
          type="date"
          min={ritual.wish.startDate || undefined}
          bind:value={ritual.wish.endDate}
          class:err={submitted && errors.endDate}
        />
        {#if submitted && errors.endDate}
          <span class="msg">{errors.endDate}</span>
        {/if}
      </label>
    </div>

    <label class="field">
      <span class="label">地點</span>
      <input
        type="text"
        placeholder="例：墾丁、台北小巨蛋"
        bind:value={ritual.wish.place}
        class:err={submitted && errors.place}
      />
      {#if submitted && errors.place}
        <span class="msg">{errors.place}</span>
      {/if}
    </label>

    <label class="field">
      <span class="label">祈願詞 <em>（只能用肯定句）</em></span>
      <input
        type="text"
        placeholder="例：陽光普照、萬里無雲、大晴天"
        bind:value={ritual.wish.wish}
        class:err={(submitted && !ritual.wish.wish.trim()) ||
          (!!wishError && ritual.wish.wish.length > 0)}
      />
      {#if submitted && !ritual.wish.wish.trim()}
        <span class="msg">請寫下你的祈願</span>
      {:else if wishError && ritual.wish.wish.length > 0}
        <span class="msg warn">⚠ {wishError}</span>
      {/if}
    </label>
  </div>

  <div class="taboo">
    <span class="taboo-title">儀式小提醒</span>
    <span>全程保持雙手乾燥（水象徵雨氣）· 祈願只用肯定句 · 紙張需完全燒盡</span>
  </div>

  <div class="actions">
    <button class="btn btn--ghost" onclick={clearForm}>清空</button>
    <button class="btn" onclick={next}>開始祈願</button>
  </div>
</section>

<style>
  .form {
    width: 100%;
    max-width: 460px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }
  .head {
    text-align: center;
  }
  h1 {
    font-size: var(--fs-title);
    margin: 0;
    color: var(--ink);
  }
  .lead {
    font-size: var(--fs-body);
    margin: 0.25rem 0 0;
    color: var(--ink-soft);
  }
  .fields {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .row {
    display: flex;
    gap: 0.75rem;
  }
  .row .field {
    flex: 1;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .label {
    font-size: var(--fs-small);
    font-weight: 700;
    color: var(--ink);
  }
  .label em {
    font-weight: 400;
    font-style: normal;
    color: var(--ink-soft);
  }
  input {
    font: inherit;
    color: var(--ink);
    background: var(--paper-2);
    border: 2px solid transparent;
    border-radius: 12px;
    padding: 0.65em 0.85em;
    outline: none;
    transition: border-color 0.15s ease;
  }
  input:focus {
    border-color: var(--flame-2);
  }
  input.err {
    border-color: var(--flame);
  }
  .msg {
    font-size: var(--fs-small);
    color: var(--flame);
  }
  .msg.warn {
    color: var(--warning-ink);
  }
  .taboo {
    background: var(--warning-bg);
    color: var(--warning-ink);
    border-radius: 12px;
    padding: 0.7em 1em;
    font-size: var(--fs-small);
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    gap: 0.25em;
  }
  .taboo-title {
    font-weight: 700;
  }
  .actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    margin-top: 0.5rem;
  }
</style>
