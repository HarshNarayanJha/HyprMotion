<script lang="ts">
import ConfigImport from "./ConfigImport.svelte"

let config = $state<string>("")

let configImported = $derived(config !== "")
</script>

<section class="min-h-svh w-full">
  {#if configImported}
    Let's play with the config
    <pre>
      {config}
    </pre>
  {:else}
    <ConfigImport bind:config />
  {/if}
</section>
