<script lang="ts">
import { resolve } from "$app/paths"
import ColorThemeSwitcher from "./reusable/ColorThemeSwitcher.svelte"
import WIPBanner from "$components/WIPBanner.svelte"
import { page } from "$app/state"
</script>

{#if page.url.pathname === resolve("/")}
  <WIPBanner />
{/if}

<div class="sticky top-4 grid grid-cols-[1fr_3fr_1fr] place-content-center justify-items-center">
  <nav
    class={[
      "col-start-2 flex max-w-[600px] flex-row items-center justify-evenly gap-18  rounded-3xl px-6 py-2 backdrop-blur-md",
      "border border-t-2 border-b-0 border-neutral-300/50 bg-gradient-to-b from-neutral-300/25 from-55% to-neutral-300/5 dark:from-neutral-500/20 dark:to-neutral-50/10",
    ]}
  >
    <a href={resolve("/")} class="font-bold"> HyprMotion </a>
    <a href="https://hypr.land" class="font-semibold" target="_blank" rel="noopener noreferrer">
      Hyprland
    </a>
    <a
      class="font-semibold"
      href="https://github.com/HarshNarayanJha/HyprMotion"
      target="_blank"
      rel="noopener noreferrer"
    >
      GitHub
    </a>
  </nav>
  <ColorThemeSwitcher />
</div>
