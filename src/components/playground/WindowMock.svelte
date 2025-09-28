<script lang="ts">
import { Button } from "$lib/components/ui/button"
import { animationGroups } from "$lib/data"
import type { Animation, AnimationName, Bezier } from "$lib/types"
import Icon from "@iconify/svelte"
import type { Attachment } from "svelte/attachments"

interface WindowMockProps {
  animations: Partial<Record<AnimationName, Animation>>
  beziers: Record<string, Bezier>
}

let { animations, beziers }: WindowMockProps = $props()

let windowRef = $state<HTMLDivElement>()

const windowsAnimationName: AnimationName = "windows"
const windowsInAnimationName: AnimationName = "windowsIn"
const windowsOutAnimationName: AnimationName = "windowsOut"
const windowsMoveAnimationName: AnimationName = "windowsMove"
const fadeAnimationName: AnimationName = "fade"
const fadeInAnimationName: AnimationName = "fadeIn"
const fadeOutAnimationName: AnimationName = "fadeOut"

const windowAnimationNames = Object.keys(animationGroups.windows.animations)
const fadeAnimationNames = Object.keys(animationGroups.fade.animations)

let windowsAnim = $derived.by(() => {
  // TODO: find the default anim in hyprland source code
  if (!animations)
    return {
      name: windowsAnimationName,
      onoff: true,
      curve: "default",
      speed: 10,
      style: "gnomed",
    } as Animation

  const anim = animations[windowsAnimationName]

  if (!anim || anim.onoff === false)
    return {
      name: windowsAnimationName,
      onoff: true,
      curve: "default",
      speed: 10,
      style: "gnomed",
    } as Animation

  return anim
})

let windowsInAnim = $derived.by(() => {
  if (!animations) return { ...windowsAnim, name: windowsInAnimationName } as Animation

  const anim = animations[windowsInAnimationName]
  if (!anim || anim.onoff === false)
    return { ...windowsAnim, name: windowsInAnimationName } as Animation

  return anim
})

let windowsOutAnim = $derived.by(() => {
  if (!animations) return { ...windowsAnim, name: windowsOutAnimationName } as Animation

  const anim = animations[windowsOutAnimationName]
  if (!anim || anim.onoff === false)
    return { ...windowsAnim, name: windowsOutAnimationName } as Animation

  return anim
})

let windowsMoveAnim = $derived.by(() => {
  if (!animations) return { ...windowsAnim, name: windowsMoveAnimationName } as Animation

  const anim = animations[windowsMoveAnimationName]
  if (!anim || anim.onoff === false)
    return { ...windowsAnim, name: windowsMoveAnimationName } as Animation

  return anim
})

let fadeAnim = $derived.by(() => {
  if (!animations) return { name: "fade", onoff: true, curve: "default", speed: 10 } as Animation
  const anim = animations[fadeAnimationName]
  if (!anim || anim.onoff === false)
    return { name: "fade", onoff: true, curve: "default", speed: 10 } as Animation

  return anim
})

let fadeInAnim = $derived.by(() => {
  if (!animations) return { ...fadeAnim, name: fadeInAnimationName } as Animation

  const anim = animations[fadeInAnimationName]
  if (!anim || anim.onoff === false) return { ...fadeAnim, name: fadeInAnimationName } as Animation

  return anim
})

let fadeOutAnim = $derived.by(() => {
  if (!animations) return { ...fadeAnim, name: fadeOutAnimationName } as Animation

  const anim = animations[fadeOutAnimationName]
  if (!anim || anim.onoff === false) return { ...fadeAnim, name: fadeOutAnimationName } as Animation

  return anim
})

const windowAnimationStyle = (animation: Animation) => {
  if (!windowAnimationNames.includes(animation.name)) {
    return {
      bezier: null,
      css: null,
    }
  }

  const bezier =
    animation.curve === "default" || animation.curve === undefined
      ? "cubic-bezier(0.4, 0, 0.2, 1)"
      : `cubic-bezier(${animation.curve.x0}, ${animation.curve.y0}, ${animation.curve.x1}, ${animation.curve.y1})`

  if (!animation.style) {
    return {
      bezier,
      css: {
        transform: "initial",
      },
    }
  }

  if (animation.style === "slide top") {
    return {
      bezier,
      css: {
        transform: "translateY(-100%)",
      },
    }
  }

  if (animation.style === "slide bottom") {
    return {
      bezier,
      css: {
        transform: "translateY(100%)",
      },
    }
  }

  if (animation.style === "slide left") {
    return {
      bezier,
      css: {
        transform: "translateX(-100%)",
      },
    }
  }

  if (animation.style === "slide right") {
    return {
      bezier,
      css: {
        transform: "translateX(100%)",
      },
    }
  }

  if (animation.style === "gnomed") {
    return {
      bezier,
      css: {
        transform: "scale(0)",
      },
    }
  }

  const match = (animation?.style || "").match(/^popin (\d+)%$/)

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

const fadeAnimationStyle = (animation: Animation) => {
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
  what: "window" | "fade" | "move",
  dir: "in" | "out" | undefined = undefined,
) => {
  switch (what) {
    case "window": {
      const windowStyles = windowAnimationStyle(animation)
      if (!windowStyles.css && !windowStyles.bezier) {
        return { windowKeyframes: null, windowTiming: null }
      }

      const windowKeyframes: Keyframe[] = [{ ...windowStyles.css }]

      if (dir === "in") {
        windowKeyframes.push({ transform: "initial" })
      } else if (dir === "out") {
        windowKeyframes.unshift({ transform: "initial" })
      }

      const windowTiming: KeyframeAnimationOptions = {
        duration: (animation.speed ?? 10) * 100,
        easing: windowStyles.bezier,
        fill: "forwards",
      }

      return { windowKeyframes, windowTiming }
    }
    case "fade": {
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
        fill: "forwards",
      }

      return { fadeKeyframes, fadeTiming }
    }
    case "move": {
      // style seems to have no effect on window move animation, so ignore for now
      const moveStyles = windowAnimationStyle({ ...animation, style: undefined })
      if (!moveStyles.css && !moveStyles.bezier) {
        return { moveKeyframes: null, moveTiming: null }
      }

      const moveKeyframes: Keyframe[] = [{ ...moveStyles.css }]
      moveKeyframes.push({ transform: "translate(0, 0)", easing: moveStyles.bezier })
      moveKeyframes.push({ transform: "translate(-120px, 80px)", easing: moveStyles.bezier })
      moveKeyframes.push({ transform: "translate(220px, -80px)", easing: moveStyles.bezier })
      moveKeyframes.push({ transform: "translate(-100px, 180px)", easing: moveStyles.bezier })
      moveKeyframes.push({ transform: "translate(-220px, -120px)", easing: moveStyles.bezier })
      moveKeyframes.push({ transform: "translate(0, 0)", easing: moveStyles.bezier })

      const moveTiming: KeyframeAnimationOptions = {
        duration: (animation.speed ?? 10) * 100,
        // easing: "linear",
        fill: "forwards",
      }

      return { moveKeyframes, moveTiming }
    }
  }
}

const applyAnimation = (
  anim: Animation,
  dir: "in" | "out",
  preventMountRun = false,
): Attachment => {
  let firstRun = true

  return (element: Element) => {
    const { windowKeyframes, windowTiming } = getAnimationStyle(anim, "window", dir)
    const { fadeKeyframes, fadeTiming } = getAnimationStyle(anim, "fade", dir)

    // prevent attachments having preventMountRun true from running for the first time
    if (firstRun && preventMountRun) {
      firstRun = false
      return
    }

    // console.log(windowKeyframes, windowTiming)
    // console.log(fadeKeyframes, fadeTiming)

    let windowAnimation: globalThis.Animation | null = null
    let fadeAnimation: globalThis.Animation | null = null

    if (windowKeyframes && windowTiming) {
      windowAnimation = element.animate(windowKeyframes, windowTiming)
    }
    if (fadeKeyframes && fadeTiming) {
      fadeAnimation = element.animate(fadeKeyframes, fadeTiming)
    }

    return () => {
      windowAnimation?.finish()
      fadeAnimation?.finish()
    }
  }
}

const playOpen = () => {
  console.log("Opening Window")
  applyAnimation(windowsInAnim, "in")(windowRef as Element)
  applyAnimation(fadeInAnim, "in")(windowRef as Element)
}

const playClose = () => {
  console.log("Closing Window")
  applyAnimation(windowsOutAnim, "out")(windowRef as Element)
  applyAnimation(fadeOutAnim, "out")(windowRef as Element)
}

const playMove = () => {
  console.log("Moving Window")
  const { moveKeyframes, moveTiming } = getAnimationStyle(windowsMoveAnim, "move")
  console.log(moveKeyframes, moveTiming)
  if (moveKeyframes && moveTiming) {
    windowRef?.animate(moveKeyframes, moveTiming)
  }
}
</script>

<div class="flex flex-col items-center justify-center gap-8 overflow-clip">
  <div
    class="pointer-events-none h-[400px] w-[600px] rounded-lg border border-gray-200 bg-white shadow-lg dark:border-neutral-700/50 dark:bg-neutral-800/25"
    bind:this={windowRef}
    {@attach applyAnimation(windowsInAnim, "in")}
    {@attach applyAnimation(windowsOutAnim, "out", true)}
    {@attach applyAnimation(fadeInAnim, "in")}
    {@attach applyAnimation(fadeOutAnim, "out", true)}
  >
    <!-- Window header -->
    <div
      class="flex h-7 items-center space-x-2 rounded-t-lg border-b border-gray-200 bg-gray-200 px-3 dark:border-neutral-700/50 dark:bg-neutral-700/50"
    >
      <div class="h-3 w-3 rounded-full bg-neutral-600/75"></div>
      <div class="h-3 w-3 rounded-full bg-neutral-500/50"></div>
      <div class="h-3 w-3 rounded-full bg-neutral-400/50"></div>
    </div>

    <!-- Window content -->
    <div
      class="bg-grid grid h-full w-full place-content-center bg-gray-200 p-4 dark:bg-neutral-900"
    >
      <!-- <Icon icon="lucide:app-window-mac" /> -->
    </div>
  </div>
  <div class="flex w-full flex-row items-center justify-evenly">
    <Button onclick={playOpen} variant="secondary">
      <Icon icon="lucide:mouse-pointer-click" />
      Open
    </Button>
    <Button onclick={playClose} variant="secondary">
      <Icon icon="lucide:circle-x" />
      Close
    </Button>
    <Button onclick={playMove} variant="secondary">
      <Icon icon="lucide:move" />
      Move
    </Button>
  </div>
</div>
