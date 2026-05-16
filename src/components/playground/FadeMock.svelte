<script lang="ts">
import { Button } from "@ui/button"

import { animationGroups } from "$lib/data"

import Icon from "@iconify/svelte"

import ContextMenuMock from "./ContextMenuMock.svelte"
import TooltipMock from "./TooltipMock.svelte"
import type { Animation, AnimationName, Bezier } from "$lib/types"
import type { Attachment } from "svelte/attachments"

interface FadeMockProps {
  animations: Partial<Record<AnimationName, Animation>>
  beziers: Record<string, Bezier>
}

let { animations, beziers }: FadeMockProps = $props()

let menuRef = $state<HTMLDivElement>()
let tooltipRef = $state<HTMLDivElement>()
let monitorRef = $state<HTMLDivElement>()

const fadePopupsAnimationName: AnimationName = "fadePopups"
const fadePopupsInAnimationName: AnimationName = "fadePopupsIn"
const fadePopupsOutAnimationName: AnimationName = "fadePopupsOut"
const fadeDpmsAnimationName: AnimationName = "fadeDpms"

const fadeAnimationNames = Object.keys(animationGroups.fade.animations)

let fadePopupsAnim = $derived.by(() => {
  // if not defined or off return the default ones
  if (!animations)
    return { name: fadePopupsAnimationName, onoff: true, curve: "default", speed: 10 } as Animation
  const anim = animations[fadePopupsAnimationName]
  if (!anim || anim.onoff === false)
    return { name: fadePopupsAnimationName, onoff: true, curve: "default", speed: 10 } as Animation

  return anim
})

let fadePopupsInAnim = $derived.by(() => {
  if (!animations) return { ...fadePopupsAnim, name: fadePopupsInAnimationName } as Animation

  const anim = animations[fadePopupsInAnimationName]
  if (!anim || anim.onoff === false)
    return { ...fadePopupsAnim, name: fadePopupsInAnimationName } as Animation

  return anim
})

let fadePopupsOutAnim = $derived.by(() => {
  if (!animations) return { ...fadePopupsAnim, name: fadePopupsOutAnimationName } as Animation

  const anim = animations[fadePopupsOutAnimationName]
  if (!anim || anim.onoff === false)
    return { ...fadePopupsAnim, name: fadePopupsOutAnimationName } as Animation

  return anim
})

let fadeDpmsAnim = $derived.by(() => {
  // if not defined or off return the default ones
  if (!animations)
    return { name: fadeDpmsAnimationName, onoff: true, curve: "default", speed: 10 } as Animation

  const anim = animations[fadeDpmsAnimationName]
  if (!anim || anim.onoff === false)
    return { name: fadeDpmsAnimationName, onoff: true, curve: "default", speed: 10 } as Animation

  return anim
})

const fadeAnimationStyle = (animation: Animation) => {
  if (!fadeAnimationNames.includes(animation.name)) {
    return {
      bezier: null,
      css: null
    }
  }

  const bezier =
    animation.curve === "default" || animation.curve === undefined
      ? "cubic-bezier(0.4, 0, 0.2, 1)"
      : `cubic-bezier(${animation.curve.x0}, ${animation.curve.y0}, ${animation.curve.x1}, ${animation.curve.y1})`

  return {
    bezier,
    css: {
      opacity: 0
    }
  }
}

const getAnimationStyle = (animation: Animation, dir: "in" | "out" | undefined = undefined) => {
  const fadeStyles = fadeAnimationStyle(animation)
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
    fill: "forwards"
  }

  return { fadeKeyframes, fadeTiming }
}

const applyAnimation = (
  anim: Animation,
  dir: "in" | "out",
  preventMountRun = false
): Attachment => {
  let firstRun = true

  return (element: Element) => {
    const { fadeKeyframes, fadeTiming } = getAnimationStyle(anim, dir)

    // prevent attachments having preventMountRun true from running for the first time
    if (firstRun && preventMountRun) {
      firstRun = false
      return
    }

    let fadeAnimation: globalThis.Animation | null = null

    if (fadeKeyframes && fadeTiming) {
      fadeAnimation = element.animate(fadeKeyframes, fadeTiming)
    }

    return () => {
      fadeAnimation?.finish()
    }
  }
}

const playMenuOpen = () => {
  console.log("Opening Menu")
  applyAnimation(fadePopupsInAnim, "in")(menuRef as Element)
}

const playMenuClose = () => {
  console.log("Closing Menu")
  applyAnimation(fadePopupsOutAnim, "out")(menuRef as Element)
}

const playTooltipOpen = () => {
  console.log("Opening Tooltip")
  applyAnimation(fadePopupsInAnim, "in")(tooltipRef as Element)
}

const playTooltipClose = () => {
  console.log("Closing Tooltip")
  applyAnimation(fadePopupsOutAnim, "out")(tooltipRef as Element)
}

const playDpmsOn = () => {
  console.log("Turning DPMS On")
  applyAnimation(fadeDpmsAnim, "in")(monitorRef as Element)
}

const playDpmsOff = () => {
  console.log("Turning DPMS Off")
  applyAnimation(fadeDpmsAnim, "out")(monitorRef as Element)
}
</script>

<div class="relative flex h-125 w-full flex-col items-center justify-center gap-8 overflow-clip">
  <!-- Window Skeleton -->
  <div
    class="pointer-events-none relative h-150 w-175 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-neutral-700/50 dark:bg-neutral-800/25">
    <div
      class="flex h-7 items-center space-x-2 rounded-t-lg border-b border-gray-200 bg-gray-200 px-3 dark:border-neutral-700/50 dark:bg-neutral-700/50">
      <div class="h-3 w-3 rounded-full bg-neutral-600/75"></div>
      <div class="h-3 w-3 rounded-full bg-neutral-500/50"></div>
      <div class="h-3 w-3 rounded-full bg-neutral-400/50"></div>
    </div>

    <div
      class="grid h-full w-full grid-cols-2 place-content-center items-center justify-items-center bg-gray-200/10 p-4 dark:bg-neutral-900/10">
      <!-- Context Menu -->
      <div
        class="pointer-events-auto"
        bind:this={menuRef}
        {@attach applyAnimation(fadePopupsInAnim, "in")}
        {@attach applyAnimation(fadePopupsOutAnim, "out", true)}>
        <ContextMenuMock />
      </div>

      <!-- Tooltip -->
      <div
        class="pointer-events-auto"
        bind:this={tooltipRef}
        {@attach applyAnimation(fadePopupsInAnim, "in")}
        {@attach applyAnimation(fadePopupsOutAnim, "out", true)}>
        <TooltipMock />
      </div>
    </div>

    <div
      class="absolute top-0 left-0 grid h-full w-full place-content-center bg-neutral-900"
      bind:this={monitorRef}
      {@attach applyAnimation(fadeDpmsAnim, "in", true)}
      {@attach applyAnimation(fadeDpmsAnim, "out")}>
      <h3 class="font-bold">Monitor OFF</h3>
    </div>
  </div>

  <!-- Controls -->
  <div class="mt-auto flex w-full flex-wrap justify-center gap-2">
    <Button class="w-46" onclick={playMenuOpen} variant="secondary">
      <Icon icon="lucide:mouse-pointer-click" />
      Show Menu
    </Button>
    <Button class="w-46" onclick={playMenuClose} variant="secondary">
      <Icon icon="lucide:circle-x" />
      Hide Menu
    </Button>
    <Button class="w-46" onclick={playTooltipOpen} variant="secondary">
      <Icon icon="lucide:mouse-pointer-click" />
      Show Tooltip
    </Button>
    <Button class="w-46" onclick={playTooltipClose} variant="secondary">
      <Icon icon="lucide:circle-x" />
      Hide Tooltip
    </Button>

    <Button class="w-46" onclick={() => (playMenuOpen(), playTooltipOpen())} variant="secondary">
      <Icon icon="lucide:mouse-pointer-click" />
      Show Both
    </Button>
    <Button class="w-46" onclick={() => (playMenuClose(), playTooltipClose())} variant="secondary">
      <Icon icon="lucide:circle-x" />
      Hide Both
    </Button>
    <Button class="w-46" onclick={playDpmsOn} variant="secondary">
      <Icon icon="lucide:mouse-pointer-click" />
      DPMS On
    </Button>
    <Button class="w-46" onclick={playDpmsOff} variant="secondary">
      <Icon icon="lucide:circle-x" />
      DPMS Off
    </Button>
  </div>
</div>
