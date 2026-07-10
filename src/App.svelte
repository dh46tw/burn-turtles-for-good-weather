<script lang="ts">
  import { fade } from 'svelte/transition';
  import { ritual } from './lib/stores.svelte';
  import StepForm from './steps/StepForm.svelte';
  import StepDraw from './steps/StepDraw.svelte';
  import StepPray from './steps/StepPray.svelte';
  import StepBurn from './steps/StepBurn.svelte';
  import StepDone from './steps/StepDone.svelte';

  // 依目前步驟決定要顯示哪個畫面元件
  const views = {
    form: StepForm,
    draw: StepDraw,
    pray: StepPray,
    burn: StepBurn,
    done: StepDone,
  };
  const CurrentView = $derived(views[ritual.step]);

  // 進度指示用（默念、焚燒屬沉浸畫面，不顯示步驟條）
  const dots: Array<{ key: 'form' | 'draw' | 'done'; label: string }> = [
    { key: 'form', label: '祈願' },
    { key: 'draw', label: '繪製' },
    { key: 'done', label: '完成' },
  ];
</script>

<main class="stage" class:immersive={ritual.step === 'pray' || ritual.step === 'burn'}>
  {#key ritual.step}
    <div class="view" in:fade={{ duration: 400 }}>
      <CurrentView />
    </div>
  {/key}

  {#if ritual.step === 'form' || ritual.step === 'draw' || ritual.step === 'done'}
    <nav class="steps" aria-label="流程進度">
      {#each dots as d}
        <span class="dot" class:active={ritual.step === d.key}>{d.label}</span>
      {/each}
    </nav>
  {/if}
</main>

<style>
  .stage {
    width: 100%;
    max-width: var(--maxw);
    min-height: 100dvh;
    padding: 1.5rem 1.25rem 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    transition: background 0.5s ease;
  }
  .stage.immersive {
    max-width: none;
    background: #1a1410;
  }
  .view {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .steps {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  .dot {
    font-size: var(--fs-small);
    color: var(--ink-soft);
    opacity: 0.5;
    padding: 0.15em 0.7em;
    border-radius: 999px;
  }
  .dot.active {
    opacity: 1;
    color: #fff;
    background: var(--flame);
  }
</style>
