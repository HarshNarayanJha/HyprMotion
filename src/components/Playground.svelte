<script lang="ts">
import { Skeleton } from "$lib/components/ui/skeleton"
import type { HyprMotionConfig } from "$lib/types"

interface PlaygroundProps {
  config: HyprMotionConfig
}

let { config }: PlaygroundProps = $props()
</script>

<main class="w-full max-h-[85svh] h-full">
  <!-- {config.animations?.length}
  {config.beziers?.length} -->
  <!-- <Skeleton class="h-[80%] w-[80%] m-auto" /> -->
  <Skeleton class="h-[80%] w-[80%] m-auto" />
</main>
