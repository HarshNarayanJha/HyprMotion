<script lang="ts">
import { Skeleton } from "$lib/components/ui/skeleton"
import type { Config } from "$lib/global.svelte"

interface PlaygroundProps {
  config: Config
}

let { config }: PlaygroundProps = $props()
</script>

<main class="h-full max-h-[85svh] w-full">
  <!-- <Skeleton class="h-[80%] w-[80%] m-auto" /> -->
  <Skeleton class="h-[80%] w-[80%] m-auto" />
</main>
