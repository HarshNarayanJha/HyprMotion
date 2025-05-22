<script lang="ts">
import ConfigImport from "./ConfigImport.svelte"

let configImported = $state(false)
</script>

<section class="min-h-svh w-full bg-green-500">
  {#if configImported}
    Let's play with the config
  {:else}
    <ConfigImport />
  {/if}
</section>
