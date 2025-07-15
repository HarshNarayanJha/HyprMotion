<script lang="ts">
let { children } = $props()
</script>

<svelte:head>
  <title>Playground | HyprMotion</title>
</svelte:head>

<div class="min-h-svh w-full flex flex-col px-8 py-12">
  {@render children()}
</div>
