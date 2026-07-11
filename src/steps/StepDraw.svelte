<script lang="ts">
  import { fade } from 'svelte/transition';
  import { ritual } from '../lib/stores.svelte';
  import { i18n } from '../lib/i18n.svelte';
  import { formatDateRange } from '../lib/format';
  import { exportPaper } from '../canvas/exportPaper';
  import {
    STICKER_PALETTE,
    DEFAULT_SIZE_F,
    MIN_SIZE_F,
    MAX_SIZE_F,
    SIZE_STEP,
    DEFAULT_TURTLES,
    MIN_TURTLES,
    STICKER_MAX_YF,
    arrangeTurtles,
    type Sticker,
  } from '../canvas/stickers';

  const t = $derived(i18n.t.draw);

  let paperEl: HTMLDivElement;
  let seq = 0;

  // 太陽固定在中央上方，不可拖曳 / 縮放 / 刪除
  const SUN: Sticker = { id: -1, emoji: '🌞', xf: 0.5, yf: 0.16, sizeF: 0.24 };

  // 雲等自由貼紙（可新增 / 縮放 / 刪除）；太陽旁放兩三朵雲呈現「撥雲見日」
  let free = $state<Sticker[]>([
    { id: ++seq, emoji: '☁️', xf: 0.24, yf: 0.24, sizeF: 0.15 },
    { id: ++seq, emoji: '☁️', xf: 0.75, yf: 0.2, sizeF: 0.13 },
    { id: ++seq, emoji: '☁️', xf: 0.66, yf: 0.32, sizeF: 0.12 },
  ]);
  // 底部烏龜列（由數量控制自動散開排列，仍可拖曳微調）
  let turtleCount = $state(DEFAULT_TURTLES);
  let turtles = $state<Sticker[]>(buildTurtles(DEFAULT_TURTLES));
  let selectedId = $state<number | null>(null);

  // 拖曳狀態
  let dragId: number | null = null;
  let rect: DOMRect | null = null;

  const selectedFree = $derived(free.find((s) => s.id === selectedId) ?? null);

  function buildTurtles(n: number): Sticker[] {
    return arrangeTurtles(n).map((t) => ({ ...t, id: ++seq }));
  }
  function setTurtles(n: number) {
    turtleCount = Math.max(MIN_TURTLES, n); // 無上限
    turtles = buildTurtles(turtleCount);
    selectedId = null;
  }

  function clamp(v: number, lo: number, hi: number) {
    return Math.min(hi, Math.max(lo, v));
  }
  function findSticker(id: number): Sticker | undefined {
    return free.find((s) => s.id === id) ?? turtles.find((s) => s.id === id);
  }

  function add(emoji: string) {
    const s: Sticker = { id: ++seq, emoji, xf: 0.5, yf: 0.4, sizeF: DEFAULT_SIZE_F };
    free.push(s);
    selectedId = s.id;
  }

  function startDrag(e: PointerEvent, s: Sticker) {
    e.stopPropagation();
    selectedId = s.id;
    dragId = s.id;
    rect = paperEl.getBoundingClientRect();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onDrag(e: PointerEvent) {
    if (dragId == null || !rect) return;
    const s = findSticker(dragId);
    if (!s) return;
    s.xf = clamp((e.clientX - rect.left) / rect.width, 0.04, 0.96);
    // 下緣限制在文字區之上，避免壓到底部祈願文字
    s.yf = clamp((e.clientY - rect.top) / rect.height, 0.04, STICKER_MAX_YF);
  }
  function endDrag() {
    dragId = null;
    rect = null;
  }

  function resize(delta: number) {
    if (!selectedFree) return;
    selectedFree.sizeF = clamp(selectedFree.sizeF + delta, MIN_SIZE_F, MAX_SIZE_F);
  }
  function removeSelected() {
    if (selectedId == null) return;
    free = free.filter((s) => s.id !== selectedId);
    selectedId = null;
  }
  function deselect(e: PointerEvent) {
    if (e.target === paperEl) selectedId = null;
  }

  function back() {
    ritual.goTo('form');
  }
  function next() {
    const r = paperEl.getBoundingClientRect();
    ritual.drawingDataUrl = exportPaper({
      width: r.width,
      height: r.height,
      wish: ritual.wish,
      stickers: [...turtles, SUN, ...free], // 烏龜最下、太陽、雲在最上（雲擋太陽）
      locale: i18n.current,
    });
    ritual.goTo('pray');
  }
</script>

<section class="draw">
  <h2>{t.title}</h2>
  <p class="hint">{t.hint}</p>

  <div
    class="paper"
    bind:this={paperEl}
    onpointerdown={deselect}
    role="application"
    aria-label={t.paperAria}
  >
    {#each turtles as s (s.id)}
      <span
        class="sticker"
        style="left:{s.xf * 100}%; top:{s.yf * 100}%; font-size:{s.sizeF *
          100}cqw; transform:translate(-50%,-50%) scaleX({s.xf < 0.5 ? -1 : 1})"
        onpointerdown={(e) => startDrag(e, s)}
        onpointermove={onDrag}
        onpointerup={endDrag}
        onpointercancel={endDrag}
        role="button"
        tabindex="-1"
      >
        {s.emoji}
      </span>
    {/each}

    <span
      class="sticker sun"
      style="left:{SUN.xf * 100}%; top:{SUN.yf * 100}%; font-size:{SUN.sizeF * 100}cqw"
    >
      {SUN.emoji}
    </span>

    {#each free as s (s.id)}
      <span
        class="sticker"
        class:selected={selectedId === s.id}
        style="left:{s.xf * 100}%; top:{s.yf * 100}%; font-size:{s.sizeF * 100}cqw"
        onpointerdown={(e) => startDrag(e, s)}
        onpointermove={onDrag}
        onpointerup={endDrag}
        onpointercancel={endDrag}
        role="button"
        tabindex="-1"
      >
        {s.emoji}
      </span>
    {/each}

    <div class="paper-text">
      <p class="t-date">{formatDateRange(ritual.wish, i18n.current)} · {ritual.wish.eventName}</p>
      <p class="t-wish">
        {i18n.current === 'en' ? `“${ritual.wish.wish}”` : `「${ritual.wish.wish}」`}
      </p>
    </div>
  </div>

  <div class="turtle-count" role="group" aria-label={t.turtleGroupAria}>
    <span class="tc-label">{t.turtleCountLabel}</span>
    <button class="tool" onclick={() => setTurtles(turtleCount - 1)} aria-label={t.decrease}>－</button>
    <span class="tc-num">{turtleCount}</span>
    <button class="tool" onclick={() => setTurtles(turtleCount + 1)} aria-label={t.increase}>＋</button>
  </div>

  <div class="palette" role="group" aria-label={t.paletteAria}>
    {#each STICKER_PALETTE as emoji}
      <button class="chip" onclick={() => add(emoji)} aria-label={t.addSticker(emoji)}>{emoji}</button>
    {/each}
  </div>

  {#if selectedFree}
    <div class="edit" in:fade={{ duration: 150 }}>
      <button class="tool" onclick={() => resize(-SIZE_STEP)} aria-label={t.shrink}>－</button>
      <span class="edit-label">{t.sizeLabel(selectedFree.emoji)}</span>
      <button class="tool" onclick={() => resize(SIZE_STEP)} aria-label={t.enlarge}>＋</button>
      <button class="tool danger" onclick={removeSelected}>{t.remove}</button>
    </div>
  {/if}

  <div class="actions">
    <button class="btn btn--ghost" onclick={back}>{t.back}</button>
    <button class="btn" onclick={next}>{t.next}</button>
  </div>
</section>

<style>
  .draw {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.9rem;
    width: 100%;
  }
  h2 {
    font-size: var(--fs-lead);
    margin: 0;
  }
  .hint {
    font-size: var(--fs-small);
    color: var(--ink-soft);
    margin: 0;
  }
  .paper {
    position: relative;
    width: 100%;
    max-width: 380px;
    aspect-ratio: 3 / 4;
    background: #fdf6e3;
    border-radius: var(--radius);
    box-shadow: 0 6px 18px rgba(91, 59, 36, 0.15);
    overflow: hidden;
    touch-action: none;
    container-type: inline-size;
    user-select: none;
  }
  @media (min-width: 768px) {
    .paper {
      max-width: 460px;
    }
  }
  .sticker {
    position: absolute;
    transform: translate(-50%, -50%);
    line-height: 1;
    cursor: grab;
    touch-action: none;
  }
  .sticker.selected {
    outline: 2px dashed var(--flame-2);
    outline-offset: 4px;
    border-radius: 6px;
  }
  .sticker.sun {
    cursor: default;
    pointer-events: none; /* 太陽固定，不可互動，點擊穿透到紙張以取消選取 */
  }
  .paper-text {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 4%;
    text-align: center;
    color: var(--ink);
    pointer-events: none;
    padding: 0 6%;
  }
  .t-date {
    font-size: 5.2cqw;
    font-weight: 700;
    margin: 0;
  }
  .t-wish {
    font-size: 5.8cqw;
    font-weight: 700;
    color: var(--flame);
    margin: 0.3em 0 0;
  }
  .turtle-count {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .tc-label {
    font-size: var(--fs-small);
    color: var(--ink-soft);
  }
  .tc-num {
    font-weight: 700;
    min-width: 1.5em;
    font-size: var(--fs-body);
  }
  .palette {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    justify-content: center;
    max-width: 380px;
  }
  .chip {
    font-size: 1.5rem;
    line-height: 1;
    background: var(--paper-2);
    border: 2px solid transparent;
    border-radius: 12px;
    padding: 0.3em 0.4em;
    cursor: pointer;
    transition: transform 0.12s ease;
  }
  .chip:hover {
    transform: scale(1.1);
    border-color: var(--flame-2);
  }
  .edit {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .edit-label {
    font-size: var(--fs-small);
    color: var(--ink-soft);
  }
  .tool {
    font: inherit;
    font-weight: 700;
    color: var(--ink);
    background: var(--paper-2);
    border: 2px solid transparent;
    border-radius: 999px;
    padding: 0.3em 0.9em;
    cursor: pointer;
  }
  .tool.danger {
    color: var(--flame);
  }
  .actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.25rem;
  }
</style>
