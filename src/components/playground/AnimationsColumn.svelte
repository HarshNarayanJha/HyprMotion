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
    </Card.Content>
    <Card.Footer>
      <p class="text-xs">
        Animations apply to things like window and workspace transitions
      </p>
    </Card.Footer>
  </Card.Root>
</aside>
