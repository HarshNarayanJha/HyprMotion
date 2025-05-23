<script>
import Icon from "@iconify/svelte"
import Instructions from "./Instructions.svelte"
</script>

<section class="min-h-svh w-full text-center">
  <div class="h-[32svh]"></div>
  <h1 class="text-9xl font-bold leading-8">HyprMotion</h1>
  <p class="translate-z-20 text-shadow-black text-shadow-lg text-2xl font-semibold text-white">
    Visualize Hyprland Animations with ease
  </p>

  <Instructions />

  <Icon icon="hugeicons:mouse-scroll-02" width="32" height="32" class="absolute bottom-4 left-1/2 animate-pulse" />
</section>
