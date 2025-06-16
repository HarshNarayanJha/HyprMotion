<script lang="ts">
import { buttonVariants } from "$lib/components/ui/button"
import * as Collapsible from "$lib/components/ui/collapsible"
import { Switch } from "$lib/components/ui/switch"
import type { Animation } from "$lib/types"
import Icon from "@iconify/svelte"

interface AnimationCollapsibleProps {
  an: string
  animation?: Animation | null
}
let { an, animation = $bindable(null) }: AnimationCollapsibleProps = $props()

let open = $state(false)
let enabled = $derived(animation?.onoff ?? false)

$effect(() => {
  if (!enabled && open) {
    open = false
  }
})
</script>

<Collapsible.Root class="w-full space-y-1" {open}>
  <div
    class={buttonVariants({
      variant: "ghost",
      size: "sm",
      class: "flex w-full flex-row items-center justify-between gap-2 px-2",
    })}
  >
    <span
      class="w-full cursor-pointer font-medium {enabled
        ? ''
        : 'text-muted-foreground'}"
      onclick={() => {
        if (enabled) {
          open = !open
        }
      }}
    >
      {an}
    </span>

    <Switch
      class="ml-auto mr-2"
      id="{an}-enabled"
      name="{an}-enabled"
      bind:checked={enabled}
    />

    <Collapsible.Trigger class="cursor-pointer" disabled={!enabled}>
      <Icon icon="lucide:chevrons-up-down" />
      <span class="sr-only">Toggle</span>
    </Collapsible.Trigger>
  </div>
  <Collapsible.Content class="rounded-md bg-neutral-50/75 p-4">
    Animation Options
  </Collapsible.Content>
</Collapsible.Root>
