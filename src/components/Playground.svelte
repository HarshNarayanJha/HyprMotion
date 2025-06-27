<script lang="ts">
import { Skeleton } from "$lib/components/ui/skeleton"
import type { HyprMotionConfig } from "$lib/types"

interface PlaygroundProps {
  config: HyprMotionConfig
}

let { config }: PlaygroundProps = $props()
</script>

<main class="h-full max-h-[85svh] w-full">
  {#if config.animations !== null}
    {#each config.animations as anim}
      <div>
        <span>{anim.name}</span>
        <span>{anim.onoff}</span>
        <span>{anim.speed}</span>
        <span>{anim.curve}</span>
        <span>{anim.style}</span>
      </div>
    {/each}
  {/if}
  <!-- <Skeleton class="h-[80%] w-[80%] m-auto" /> -->
  <!-- <Skeleton class="h-[80%] w-[80%] m-auto" /> -->
</main>
