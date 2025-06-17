<script lang="ts">
import { buttonVariants } from "$lib/components/ui/button"
import * as Collapsible from "$lib/components/ui/collapsible"
import { Switch } from "$lib/components/ui/switch"
import type { Animation } from "$lib/types"
import Icon from "@iconify/svelte"
import { slide } from "svelte/transition"

interface AnimationCollapsibleProps {
  an: string
  animation?: Animation | null
}
let { an, animation = $bindable(null) }: AnimationCollapsibleProps = $props()

let open = $state(false)
let enabled = $derived(animation?.onoff ?? false)

$effect(() => {
  // close if disabled and do not allow opening again
  if (!enabled && open) {
    open = false
  }

  // if just enabled, open up
  if (enabled) {
    open = true
  }

  // propagate onoff changes up
  if (animation) {
    animation.onoff = enabled
  }
})
</script>

<Collapsible.Root class="space-y0 w-full" {open}>
  <div
    class={buttonVariants({
      variant: "ghost",
      size: "sm",
      class: "flex w-full flex-row items-center justify-between gap-2 px-2",
    })}
  >
    <button
      class="inline-block w-full cursor-pointer text-start font-medium disabled:bg-inherit"
      onclick={() => (open = enabled ? !open : false)}
      disabled={!enabled}
      type="button"
    >
      {an}
    </button>

    <Switch
      class="ml-auto mr-2"
      id="{an}-enabled"
      name="{an}-enabled"
      bind:checked={enabled}
    />

    <button
      type="button"
      class="cursor-pointer disabled:bg-inherit"
      disabled={!enabled}
      onclick={() => (open = enabled ? !open : false)}
    >
      <Icon icon="lucide:chevrons-up-down" />
      <span class="sr-only">Toggle</span>
    </button>
  </div>
  {#if open}
    <div class="rounded-md bg-neutral-50/75 p-4" transition:slide>
      <Collapsible.Content>Animation Options</Collapsible.Content>
    </div>
  {/if}
</Collapsible.Root>
