<script lang="ts">
import { Button } from "$lib/components/ui/button"
import { animationGroups } from "$lib/data"
import type { Animation, AnimationName, Bezier } from "$lib/types"
import Icon from "@iconify/svelte"
import * as Avatar from "$lib/components/ui/avatar"
import type { Attachment } from "svelte/attachments"

interface LayerMockProps {
  animations: Partial<Record<AnimationName, Animation>>
  beziers: Record<string, Bezier>
}

let { animations, beziers }: LayerMockProps = $props()

let barRef = $state<HTMLDivElement>()
let notificationRef = $state<HTMLDivElement>()

const layersAnimationName: AnimationName = "layers"
const layersInAnimationName: AnimationName = "layersIn"
const layersOutAnimationName: AnimationName = "layersOut"
const fadeLayersAnimationName: AnimationName = "fadeLayers"
const fadeLayersInAnimationName: AnimationName = "fadeLayersIn"
const fadeLayersOutAnimationName: AnimationName = "fadeLayersOut"

const layerAnimationNames = Object.keys(animationGroups.layers.animations)
const fadeAnimationNames = Object.keys(animationGroups.fade.animations)

let layersAnim = $derived.by(() => {
  // TODO: find the default anim in hyprland source code
  if (!animations)
    return {
      name: layersAnimationName,
      onoff: true,
      curve: "default",
      speed: 10,
      style: "fade",
    } as Animation

  const anim = animations[layersAnimationName]

  if (!anim || anim.onoff === false)
    return {
      name: layersAnimationName,
      onoff: true,
      curve: "default",
      speed: 10,
      style: "fade",
    } as Animation

  return anim
})

let layersInAnim = $derived.by(() => {
  if (!animations) return { ...layersAnim, name: layersInAnimationName } as Animation

  const anim = animations[layersInAnimationName]
  if (!anim || anim.onoff === false)
    return { ...layersAnim, name: layersInAnimationName } as Animation

  return anim
})

let layersOutAnim = $derived.by(() => {
  if (!animations) return { ...layersAnim, name: layersOutAnimationName } as Animation

  const anim = animations[layersOutAnimationName]
  if (!anim || anim.onoff === false)
    return { ...layersAnim, name: layersOutAnimationName } as Animation

  return anim
})

let fadeLayersAnim = $derived.by(() => {
  if (!animations)
    return { name: "fadeLayers", onoff: true, curve: "default", speed: 10 } as Animation
  const anim = animations[fadeLayersAnimationName]
  if (!anim || anim.onoff === false)
    return { name: "fadeLayers", onoff: true, curve: "default", speed: 10 } as Animation

  return anim
})

let fadeLayersInAnim = $derived.by(() => {
  if (!animations) return { ...fadeLayersAnim, name: fadeLayersInAnimationName } as Animation

  const anim = animations[fadeLayersInAnimationName]
  if (!anim || anim.onoff === false)
    return { ...fadeLayersAnim, name: fadeLayersInAnimationName } as Animation

  return anim
})

let fadeLayersOutAnim = $derived.by(() => {
  if (!animations) return { ...fadeLayersAnim, name: fadeLayersOutAnimationName } as Animation

  const anim = animations[fadeLayersOutAnimationName]
  if (!anim || anim.onoff === false)
    return { ...fadeLayersAnim, name: fadeLayersOutAnimationName } as Animation

  return anim
})

const layerAnimationStyle = (
  animation: Animation,
  autoSlide: "top" | "bottom" | "left" | "right" | undefined = undefined,
) => {
  if (!layerAnimationNames.includes(animation.name)) {
    return {
      bezier: null,
      css: null,
    }
  }

  const bezier =
    animation.curve === "default" || animation.curve === undefined
      ? "cubic-bezier(0.4, 0, 0.2, 1)"
      : `cubic-bezier(${animation.curve.x0}, ${animation.curve.y0}, ${animation.curve.x1}, ${animation.curve.y1})`

  let thisAnimation: Animation = { ...animation }

  // handle slide auto animations
  if (thisAnimation.style === "slide" && autoSlide !== undefined) {
    thisAnimation.style = `slide ${autoSlide}`
  }

  if (!thisAnimation.style) {
    return {
      bezier,
      css: {
        transform: "initial",
      },
    }
  } else if (thisAnimation.style === "slide top") {
    return {
      bezier,
      css: {
        transform: "translateY(-100%)",
      },
    }
  } else if (thisAnimation.style === "slide bottom") {
    return {
      bezier,
      css: {
        transform: "translateY(100%)",
      },
    }
  } else if (thisAnimation.style === "slide left") {
    return {
      bezier,
      css: {
        transform: "translateX(-100%)",
      },
    }
  } else if (thisAnimation.style === "slide right") {
    return {
      bezier,
      css: {
        transform: "translateX(100%)",
      },
    }
  }

  const match = (thisAnimation.style || "").match(/^popin (\d+)%$/)

  if (match) {
    return {
      bezier,
      css: {
        transform: `scale(${match[1]}%)`,
      },
    }
  }

  return {
    bezier,
    css: {
      transform: "initial",
    },
  }
}

const fadeLayerAnimationStyle = (animation: Animation) => {
  if (!fadeAnimationNames.includes(animation.name)) {
    return {
      bezier: null,
      css: null,
    }
  }

  const bezier =
    animation.curve === "default" || animation.curve === undefined
      ? "cubic-bezier(0.4, 0, 0.2, 1)"
      : `cubic-bezier(${animation.curve.x0}, ${animation.curve.y0}, ${animation.curve.x1}, ${animation.curve.y1})`

  return {
    bezier,
    css: {
      opacity: 0,
    },
  }
}

const getAnimationStyle = (
  animation: Animation,
  what: "layer" | "fade",
  dir: "in" | "out" | undefined = undefined,
  autoSlide: "top" | "bottom" | "left" | "right" | undefined = undefined,
) => {
  switch (what) {
    case "layer": {
      const layerStyles = layerAnimationStyle(animation, autoSlide)
      if (!layerStyles.css && !layerStyles.bezier) {
        return { layerKeyframes: null, layerTiming: null }
      }

      const layerKeyframes: Keyframe[] = [{ ...layerStyles.css }]

      if (dir === "in") {
        layerKeyframes.push({ transform: "initial" })
      } else if (dir === "out") {
        layerKeyframes.unshift({ transform: "initial" })
      }

      const layerTiming: KeyframeAnimationOptions = {
        duration: (animation.speed ?? 10) * 100,
        easing: layerStyles.bezier,
        fill: "forwards",
      }

      return { layerKeyframes, layerTiming }
    }
    case "fade": {
      const fadeStyles = fadeLayerAnimationStyle(animation)
      if (!fadeStyles.css && !fadeStyles.bezier) {
        return { fadeKeyframes: null, fadeTiming: null }
      }

      const fadeKeyframes: Keyframe[] = [{ ...fadeStyles.css }]

      if (dir === "in") {
        fadeKeyframes.push({ opacity: "initial" })
      } else if (dir === "out") {
        fadeKeyframes.unshift({ opacity: "initial" })
      }

      const fadeTiming: KeyframeAnimationOptions = {
        duration: (animation.speed ?? 10) * 100,
        easing: fadeStyles.bezier,
        fill: "forwards",
      }

      return { fadeKeyframes, fadeTiming }
    }
  }
}

const applyAnimation = (
  anim: Animation,
  dir: "in" | "out",
  autoSlide: "top" | "bottom" | "left" | "right" | undefined = undefined,
  preventMountRun = false,
): Attachment => {
  let firstRun = true

  return (element: Element) => {
    const { layerKeyframes, layerTiming } = getAnimationStyle(anim, "layer", dir, autoSlide)
    const { fadeKeyframes, fadeTiming } = getAnimationStyle(anim, "fade", dir)

    // prevent attachments having preventMountRun true from running for the first time
    if (firstRun && preventMountRun) {
      firstRun = false
      return
    }

    let layerAnimation: globalThis.Animation | null = null
    let fadeAnimation: globalThis.Animation | null = null

    if (layerKeyframes && layerTiming) {
      layerAnimation = element.animate(layerKeyframes, layerTiming)
    }
    if (fadeKeyframes && fadeTiming) {
      fadeAnimation = element.animate(fadeKeyframes, fadeTiming)
    }

    return () => {
      layerAnimation?.finish()
      fadeAnimation?.finish()
    }
  }
}

const playBarOpen = () => {
  console.log("Opening Bar")
  applyAnimation(layersInAnim, "in", "top")(barRef as Element)
  applyAnimation(fadeLayersInAnim, "in")(barRef as Element)
}

const playBarClose = () => {
  console.log("Closing Bar")
  applyAnimation(layersOutAnim, "out", "top")(barRef as Element)
  applyAnimation(fadeLayersOutAnim, "out")(barRef as Element)
}

const playNotificationOpen = () => {
  console.log("Opening Notification")
  applyAnimation(layersInAnim, "in", "right")(notificationRef as Element)
  applyAnimation(fadeLayersInAnim, "in")(notificationRef as Element)
}

const playNotificationClose = () => {
  console.log("Closing Notification")
  applyAnimation(layersOutAnim, "out", "right")(notificationRef as Element)
  applyAnimation(fadeLayersOutAnim, "out")(notificationRef as Element)
}
</script>

<div
  class="relative flex h-[500px] w-full flex-col items-center justify-center gap-8 overflow-clip"
>
  <!-- Bar -->
  <div
    class="pointer-events-none absolute top-0 h-[25px] w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-neutral-700/50 dark:bg-neutral-800/25"
    bind:this={barRef}
    {@attach applyAnimation(layersInAnim, "in", "top")}
    {@attach applyAnimation(layersOutAnim, "out", "top", true)}
    {@attach applyAnimation(fadeLayersInAnim, "in", "top")}
    {@attach applyAnimation(fadeLayersOutAnim, "out", "top", true)}
  >
    <!-- Bar content -->
    <div
      class="grid h-full w-full grid-cols-3 content-center rounded-md bg-gray-200 p-4 text-xs dark:bg-neutral-900"
    >
      <span class="place-self-start">
        <span class="font-mono tracking-widest">1 2 3 4 | </span>
        HyprMotion
      </span>
      <span class="place-self-center font-mono tracking-wide">35°C | 66% | 110% | 75%</span>
      <span class="place-self-end"> Sun 28 Sep 2025 | 08:57:36 PM </span>
    </div>
  </div>

  <!-- Notification -->
  <div
    class="pointer-events-none absolute right-0 bottom-20 h-[50px] w-[200px] rounded-md border border-gray-200 bg-white shadow-lg dark:border-neutral-700/50 dark:bg-neutral-800/25"
    bind:this={notificationRef}
    {@attach applyAnimation(layersInAnim, "in", "right")}
    {@attach applyAnimation(layersOutAnim, "out", "right", true)}
    {@attach applyAnimation(fadeLayersInAnim, "in", "right")}
    {@attach applyAnimation(fadeLayersOutAnim, "out", "right", true)}
  >
    <!-- Notification content -->
    <div
      class="grid h-full w-full grid-cols-[1fr_5fr] content-center gap-2 rounded-md bg-gray-200 p-1 dark:bg-neutral-900"
    >
      <Avatar.Root class="place-self-center">
        <Avatar.Image src="https://github.com/hyprwm.png" alt="@hyprwm"></Avatar.Image>
        <Avatar.Fallback>HL</Avatar.Fallback>
      </Avatar.Root>
      <div class="flex flex-col items-start justify-start text-xs">
        <h4 class="text-sm font-semibold">Hyprland</h4>
        <p>Enjoy the customizations!</p>
      </div>
    </div>
  </div>

  <!-- Controls -->
  <div class="mt-auto flex w-full flex-row items-center justify-evenly">
    <Button onclick={playBarOpen} variant="secondary">
      <Icon icon="lucide:mouse-pointer-click" />
      Show Bar
    </Button>
    <Button onclick={playBarClose} variant="secondary">
      <Icon icon="lucide:circle-x" />
      Hide Bar
    </Button>
    <Button onclick={playNotificationOpen} variant="secondary">
      <Icon icon="lucide:mouse-pointer-click" />
      Show Notification
    </Button>
    <Button onclick={playNotificationClose} variant="secondary">
      <Icon icon="lucide:circle-x" />
      Hide Notification
    </Button>
  </div>
</div>
