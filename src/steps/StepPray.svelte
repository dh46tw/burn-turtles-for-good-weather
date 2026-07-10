<script lang="ts">
  import { ritual } from '../lib/stores.svelte';
  import { formatDateRange } from '../lib/format';

  function back() {
    ritual.goTo('draw');
  }
  function ignite() {
    ritual.goTo('burn');
  }
</script>

<section class="pray">
  <div class="flame-icon" aria-hidden="true">🔥</div>
  <h2>雙手合十，閉上眼睛</h2>
  <p class="hint">誠心默念以下的日期與祈願</p>

  <div class="chant">
    <p class="line">{formatDateRange(ritual.wish)} · {ritual.wish.eventName}</p>
    {#if ritual.wish.place}<p class="line">於 {ritual.wish.place}</p>{/if}
    <p class="wish">「{ritual.wish.wish}」</p>
  </div>

  <p class="taboo">🙏 儀式進行中請保持雙手乾燥，誠心默念後點火</p>

  <div class="actions">
    <button class="ghost" onclick={back}>再想想</button>
    <button class="btn" onclick={ignite}>點火</button>
  </div>
</section>

<style>
  .pray {
    text-align: center;
    color: #f5e9d6;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .flame-icon {
    font-size: 3rem;
    animation: breathe 3s ease-in-out infinite;
  }
  @keyframes breathe {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.85;
    }
    50% {
      transform: scale(1.12);
      opacity: 1;
    }
  }
  h2 {
    font-size: var(--fs-lead);
    margin: 0;
    color: #f5e9d6;
  }
  .hint {
    font-size: var(--fs-body);
    color: #b49a7a;
    margin: 0;
  }
  .chant {
    text-align: center;
    margin: 0.5rem 0;
  }
  .line {
    font-size: var(--fs-body);
    color: #d8c4a6;
    margin: 0.2rem 0;
  }
  .wish {
    font-size: var(--fs-lead);
    color: #f9c51e;
    margin: 0.6rem 0 0;
  }
  .taboo {
    font-size: var(--fs-small);
    color: #9c8467;
    margin: 0 0 0.25rem;
  }
  .actions {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }
  .ghost {
    font: inherit;
    color: #b49a7a;
    background: transparent;
    border: 2px solid #6b5947;
    border-radius: 999px;
    padding: 0.6em 1.6em;
    cursor: pointer;
  }
</style>
