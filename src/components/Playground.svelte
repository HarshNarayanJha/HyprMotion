<script lang="ts">
import type { ParsedAnimations } from "$lib/parser"
import ConfigImport from "./ConfigImport.svelte"

let config = $state<ParsedAnimations | null>(null)
let configImported = $derived(config !== null)
</script>

<section class="min-h-svh w-full">
  {#if configImported}
    Let's play with the config
    <pre>
      {config?.animations.length}
    </pre>
  {:else}
    <ConfigImport bind:config />
  {/if}
</section>
