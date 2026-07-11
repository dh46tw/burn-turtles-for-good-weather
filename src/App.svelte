<script lang="ts">
  import { fade } from 'svelte/transition';
  import { ritual } from './lib/stores.svelte';
  import { i18n } from './lib/i18n.svelte';
  import Footer from './lib/Footer.svelte';
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

  // 默念、焚燒屬沉浸畫面（暗底、不顯示步驟條與 footer）
  const immersive = $derived(ritual.step === 'pray' || ritual.step === 'burn');

  // 進度指示（label 依語言切換）
  const dots = $derived<Array<{ key: 'form' | 'draw' | 'done'; label: string }>>([
    { key: 'form', label: i18n.t.steps.form },
    { key: 'draw', label: i18n.t.steps.draw },
    { key: 'done', label: i18n.t.steps.done },
  ]);

  // 分頁標題與 <html lang> 隨語言更新（也涵蓋初始偵測到的語言）
  $effect(() => {
    document.title = i18n.t.app.title;
    document.documentElement.lang = i18n.current === 'en' ? 'en' : 'zh-Hant';
  });
</script>

<main class="stage" class:immersive>
  <div class="content">
    {#key ritual.step}
      <div class="view" in:fade={{ duration: 400 }}>
        <CurrentView />
      </div>
    {/key}

    {#if !immersive}
      <nav class="steps" aria-label="流程進度">
        {#each dots as d}
          <span class="dot" class:active={ritual.step === d.key}>{d.label}</span>
        {/each}
      </nav>
    {/if}
  </div>

  {#if !immersive}
    <Footer />
  {/if}
</main>

<style>
  .stage {
    width: 100%;
    max-width: var(--maxw);
    min-height: 100dvh;
    padding: 1.5rem 1.25rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: background 0.5s ease;
  }
  .stage.immersive {
    max-width: none;
    background: #1a1410;
    justify-content: center;
  }
  /* 內容佔滿剩餘高度並垂直置中，footer 自然落在底部 */
  .content {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
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
