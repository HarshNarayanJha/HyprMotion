<script lang="ts">
import AnimationCollapsible from "$components/reusable/AnimationCollapsible.svelte"
import { Button } from "$lib/components/ui/button"
import * as Card from "$lib/components/ui/card"
import { Separator } from "$lib/components/ui/separator"
import { animationGroups } from "$lib/data"
import type { Animation, AnimationName, Bezier, Style } from "$lib/types"
import Icon from "@iconify/svelte"
import Page from "../../routes/playground/+page.svelte"

interface AnimationsColumnProps {
  animations: Animation[] | null
  beziers: Bezier[] | null
  onCreateNewConfig?: () => void
}

let {
  animations = $bindable(null),
  beziers,
  onCreateNewConfig,
}: AnimationsColumnProps = $props()

const getStylesForAnimation = (
  an: string,
  styles: Style[] | Record<AnimationName, Style[]> | undefined,
) => {
  if (!styles) return null
  if (Array.isArray(styles)) return styles
  return styles[an as AnimationName]
}

const getAnimation = (an: string): Animation | null => {
  if (animations === null) return null

  return animations.find(animation => animation.name === an) || null
}

const setAnimation = (an: string, anim: Animation | null) => {
  console.log(`Setting ${an} to ${anim}`)
  if (animations === null) return

  const index = animations.findIndex(x => x.name === an)

  if (anim !== null) {
    if (index !== -1) {
      animations[index] = anim
    } else {
      animations.push(anim)
    }
  } else {
    animations.splice(index, 1)
  }
}
</script>

<aside id="animations">
  <Card.Root>
    <Card.Header>
      <h3 class="text-xl font-bold tracking-tight">Animations</h3>
      <Separator class="my-2" />
    </Card.Header>
    <Card.Content>
      <div class="space-y-6">
        {#if animations !== null && beziers !== null}
          {#each Object.entries(animationGroups) as [_, anGroup]}
            <div class="space-y-2">
              <div class="flex flex-row items-center gap-2">
                <Icon
                  icon={anGroup.icon || "material-symbols:animation"}
                  width={22}
                  height={22}
                  class="inline"
                  inline={true}
                />
                <span class="font-semibold tracking-wide">{anGroup.title}</span>
              </div>
              {#each Object.entries(anGroup.animations) as [an, description]}
                {@const styles = getStylesForAnimation(an, anGroup.styles)}

                <AnimationCollapsible
                  {an}
                  bind:animation={
                    () => getAnimation(an), (anim) => setAnimation(an, anim)
                  }
                  {description}
                  {styles}
                  styleParams={anGroup.styleParams || null}
                  beziers={beziers || []}
                />
              {/each}
            </div>
          {/each}
        {:else}
          <div class="my-16 space-y-4 text-center text-sm">
            <p>No config loaded</p>
            <Button size="sm" onclick={() => onCreateNewConfig?.()}>
              <Icon icon="material-symbols:add-circle" />
              Create New
            </Button>
          </div>
        {/if}
      </div>
    </Card.Content>
    <Card.Footer>
      <p class="text-xs">
        Animations apply to things like window and workspace transitions
      </p>
    </Card.Footer>
  </Card.Root>
</aside>
