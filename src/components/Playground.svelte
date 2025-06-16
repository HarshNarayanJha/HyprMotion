<script lang="ts">
import type { HyprMotionConfig } from "$lib/types"

interface PlaygroundProps {
  config: HyprMotionConfig
}

let { config }: PlaygroundProps = $props()
</script>

<section class="min-h-svh w-full">
  {config.animations?.length}
  {config.beziers?.length}
</section>
