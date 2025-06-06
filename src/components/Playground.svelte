<script lang="ts">
import { browser } from "$app/environment"
import { goto } from "$app/navigation"
import { config } from "$lib/global.svelte"

// if (config.animations === null || config.beziers === null) {
//   if (browser) {
//     goto("/")
//   }
// }
</script>

<section class="min-h-svh w-full">
  {config.animations?.length}
  {config.beziers?.length}
</section>
