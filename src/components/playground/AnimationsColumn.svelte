<script lang="ts">
import AnimationCollapsible from "$components/reusable/AnimationCollapsible.svelte"
import * as Card from "$lib/components/ui/card"
import { Separator } from "$lib/components/ui/separator"
import { animationGroups } from "$lib/data"
import type { Animation, AnimationName, Bezier, Style } from "$lib/types"
import Icon from "@iconify/svelte"

interface AnimationsColumnProps {
  animations: Animation[] | null
  beziers: Bezier[]
}

let { animations = $bindable(null), beziers }: AnimationsColumnProps = $props()

const getStylesForAnimation = (
  an: string,
  styles: Style[] | Record<AnimationName, Style[]> | undefined,
) => {
  if (!styles) {
    return null
  }

  if (Array.isArray(styles)) {
    return styles
  }

  return styles[an as AnimationName]
}

const getAnimation = (an: string) => {
  return animations?.find(animation => animation.name === an) || null
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
              {@const animation = getAnimation(an)}

              <AnimationCollapsible
                {an}
                {animation}
                {description}
                {styles}
                styleParams={anGroup.styleParams || null}
                {beziers}
              />
            {/each}
          </div>
        {/each}
      </div>
    </Card.Content>
    <Card.Footer>
      <p class="text-xs">
        Animations apply to things like window and workspace transitions
      </p>
    </Card.Footer>
  </Card.Root>
</aside>
