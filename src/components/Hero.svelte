<script lang="ts">
import Icon from "@iconify/svelte"
import { onMount } from "svelte"
import { fade } from "svelte/transition"
import Instructions from "./Instructions.svelte"

let mouseHidden = false
let mouseBounce = true

const handleScroll = () => {
  if (window.scrollY > window.innerHeight / 2) {
    mouseHidden = true
    mouseBounce = false
  } else if (window.scrollY > 0) {
    mouseHidden = false
    mouseBounce = false
  } else if (window.scrollY <= 0) {
    mouseHidden = false
    mouseBounce = true
  }
}

onMount(() => {
  window.addEventListener("scroll", handleScroll)

  return () => {
    window.removeEventListener("scroll", handleScroll)
  }
})
</script>

<section class="min-h-svh w-full text-center">
  <div class="h-[12svh] md:h-[28svh] xl:h-[32svh]"></div>
  <h1 class="text-9xl leading-8 font-bold">HyprMotion</h1>
  <p class="translate-z-20 text-2xl font-semibold text-white text-shadow-black text-shadow-lg">
    Visualize Hyprland Animations with ease
  </p>

  <Instructions />

  {#if !mouseHidden}
    <span transition:fade={{ duration: 150 }}>
      <Icon
        icon="hugeicons:mouse-scroll-02"
        width="32"
        height="32"
        class="absolute bottom-4 left-1/2 {mouseBounce ? 'animate-bounce' : 'animate-pulse'}"
      />
    </span>
  {/if}
</section>
