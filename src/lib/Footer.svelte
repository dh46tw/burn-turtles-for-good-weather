<script lang="ts">
  const PROFILE = 'https://github.com/dh46tw';
  const REPO = 'https://github.com/dh46tw/burn-turtles-for-good-weather';
  const LICENSE = 'https://github.com/dh46tw/burn-turtles-for-good-weather/blob/main/LICENSE';
</script>

<footer class="footer">
  <p class="line1">
    © 2026
    <a href={PROFILE} target="_blank" rel="noopener noreferrer">dh46tw</a>
    <span class="dot" aria-hidden="true">·</span>
    <a href={REPO} target="_blank" rel="noopener noreferrer">GitHub</a>
    <span class="dot" aria-hidden="true">·</span>
    <a href={LICENSE} target="_blank" rel="noopener noreferrer">MIT License</a>
  </p>
  <p class="line2">Built with Claude</p>
</footer>

<style>
  .footer {
    text-align: center;
    padding: 1.25rem 0 0.5rem;
    color: var(--ink-soft);
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
