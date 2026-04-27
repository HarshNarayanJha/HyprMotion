<script lang="ts">
import { resolve } from "$app/paths"
import { page } from "$app/state"
import WIPBanner from "$components/WIPBanner.svelte"

import ColorThemeSwitcher from "./reusable/ColorThemeSwitcher.svelte"

let isHomePage = $derived(page.url.pathname === resolve("/"))
</script>

{#if isHomePage}
  <WIPBanner />
{/if}

<div
  class={[
    "grid grid-cols-[1fr_3fr_1fr] place-content-center items-center justify-items-center",
    isHomePage ? "sticky top-4" : "mt-4"
  ]}>
  <nav
    style="--radius: 4rem;"
    class={[
      "col-start-2 flex max-w-150 flex-row items-center justify-evenly gap-18  rounded-3xl px-6 py-2 backdrop-blur-md",
      "border border-t-2 border-b-0 border-neutral-300/50 bg-linear-to-b from-neutral-300/25 from-55% to-neutral-300/5 dark:from-neutral-500/20 dark:to-neutral-50/10"
    ]}>
    <a href={resolve("/")} class="font-bold"> HyprMotion </a>
    <a href="https://hypr.land" class="font-semibold" target="_blank" rel="noopener noreferrer">
      Hyprland
    </a>
    <a
      class="font-semibold"
      href="https://github.com/HarshNarayanJha/HyprMotion"
      target="_blank"
      rel="noopener noreferrer">
      GitHub
    </a>
  </nav>
  <ColorThemeSwitcher />
</div>
