<script>
import Playground from "$components/Playground.svelte"
import AnimationsColumn from "$components/playground/AnimationsColumn.svelte"
import BeziersColumn from "$components/playground/BeziersColumn.svelte"
import TransparentDivider from "$components/reusable/TransparentDivider.svelte"

import { config } from "$lib/global.svelte"

// if (config.animations === null || config.beziers === null) {
//   if (browser) {
//     goto("/")
//   }
// }
</script>

<h1 class="text-4xl font-semibold">HyprMotion Playground</h1>
<TransparentDivider />

<div
  class="grid grid-cols-[1fr_2fr_1fr] gap-1 xl:grid-cols-[1fr_3fr_1fr] xl:gap-2 justify-items-stretch items-start"
>
  <BeziersColumn beziers={config.beziers} />

  <Playground {config} />

  <AnimationsColumn animations={config.animations} />
</div>
