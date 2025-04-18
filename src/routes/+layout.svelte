<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../app.css';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
  <title>Game</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
    rel="stylesheet"
  />
</svelte:head>
<SvelteToast />
{@render children?.()}
