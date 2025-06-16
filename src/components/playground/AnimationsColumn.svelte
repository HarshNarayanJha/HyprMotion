<script lang="ts">
import AnimationCollapsible from "$components/reusable/AnimationCollapsible.svelte"
import InlineInput from "$components/reusable/InlineInput.svelte"
import { Button, buttonVariants } from "$lib/components/ui/button"
import * as Card from "$lib/components/ui/card"
import * as Collapsible from "$lib/components/ui/collapsible"
import { Input } from "$lib/components/ui/input"
import { Label } from "$lib/components/ui/label"
import { Separator } from "$lib/components/ui/separator"
import { Switch } from "$lib/components/ui/switch"
import { type Animation, animationNames } from "$lib/types"
import Icon from "@iconify/svelte"

interface AnimationsColumnProps {
  animations: Animation[] | null
}

let { animations = $bindable(null) }: AnimationsColumnProps = $props()
</script>

<aside id="animations">
  <Card.Root>
    <Card.Header>
      <h3 class="text-xl font-bold tracking-tight">Animations</h3>
      <Separator class="my-2" />
    </Card.Header>
    <Card.Content>
      <div class="space-y-2">
        {#each animationNames as an}
          <AnimationCollapsible {an} />
        {/each}
      </div>
      <!-- {#if animations && animations.length > 0}
        <div class="space-y-4">
          {#each animations as an}
            <div class="px-2 py-2">
              <InlineInput
                value={an.name}
                inputClasses="border-input bg-background selection:bg-primary dark:bg-input/30 shadow-xs selection:text-primary-foreground ring-offset-background flex h-6 w-full min-w-0 rounded-md border px-2 py-3 text-base outline-none transition-[color,box-shadow]"
                labelClasses="font-medium"
                maxLength={32}
              >
                {#snippet postLabel(onclick: () => void)}
                  <Icon
                    icon="fe:edit"
                    class="inline"
                    width={12}
                    height={16}
                    {onclick}
                  />
                {/snippet}
              </InlineInput>
            </div>
          {/each}
        </div>
      {:else}
        <div class="my-16 space-y-4 text-center text-sm">
          <p>No Animations defined in config</p>
          <Button size="sm">
            <Icon icon="material-symbols:add-circle" />
            Add
          </Button>
        </div>
      {/if} -->
    </Card.Content>
    <Card.Footer>
      <p class="text-xs">
        Animations apply to things like window and workspace transitions
      </p>
    </Card.Footer>
  </Card.Root>
</aside>
