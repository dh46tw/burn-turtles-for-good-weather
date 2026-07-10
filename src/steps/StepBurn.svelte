<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { ritual } from '../lib/stores.svelte';
  import { FireEngine } from '../canvas/FireEngine';

  let canvasEl: HTMLCanvasElement;
  let engine: FireEngine | null = null;

  onMount(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const goDone = () => ritual.goTo('done');

    // 沒有繪好的紙張影像時（理論上不會發生），略過動畫直接完成
    if (!ritual.drawingDataUrl) {
      const timer = setTimeout(goDone, 1200);
      return () => clearTimeout(timer);
    }

    const img = new Image();
    img.onload = () => {
      engine = new FireEngine(canvasEl, img, { reducedMotion });
      engine.start(goDone);
    };
    img.onerror = () => setTimeout(goDone, 1000);
    img.src = ritual.drawingDataUrl;
  });

  onDestroy(() => engine?.stop());
</script>

<section class="burn">
  <canvas bind:this={canvasEl} class="fire"></canvas>
  <p class="cap">焚燒中…紙張化為灰燼，好天氣冉冉上升</p>
</section>

<style>
  .burn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }
  .fire {
    width: 100%;
    max-width: 380px;
    aspect-ratio: 3 / 4.4;
    display: block;
  }
  @media (min-width: 768px) {
    .fire {
      max-width: 460px;
    }
  }
  .cap {
    font-size: var(--fs-small);
    color: #b49a7a;
    margin: 0;
  }
</style>
