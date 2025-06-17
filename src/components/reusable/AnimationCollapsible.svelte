<script lang="ts">
import { buttonVariants } from "$lib/components/ui/button"
import * as Collapsible from "$lib/components/ui/collapsible"
import { Input } from "$lib/components/ui/input"
import { Label } from "$lib/components/ui/label"
import * as Select from "$lib/components/ui/select"
import { Switch } from "$lib/components/ui/switch"
import type { Animation, Bezier, SpeedUnit } from "$lib/types"
import Icon from "@iconify/svelte"
import { slide } from "svelte/transition"

interface AnimationCollapsibleProps {
  an: string
  animation?: Animation | null
  beziers: Bezier[]
}
let {
  an,
  animation = $bindable(null),
  beziers,
}: AnimationCollapsibleProps = $props()

let open = $state(false)
let enabled = $derived(animation?.onoff ?? true)
let speed = $derived(animation?.speed ?? 0)
let speedUnit = $state<SpeedUnit>("ds")
let curve = $derived(animation?.curve?.toString() ?? "default")
let style: string | null = $derived(animation?.style?.toString() ?? null)

let curveTriggerContent = $derived(curve || "Select a curve...")

$effect(() => {
  // close if disabled and do not allow opening again
  if (!enabled && open) {
    open = false
  }

  // if just enabled, open up
  if (enabled) {
    open = true
  }

  // propagate changes up
  if (animation) {
    animation.onoff = enabled
    animation.speed = speed
    // animation.curve = curve
    // animation.style = style
  }
})

let beziersBuiltIn = [{ name: "default" }]
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
      <Collapsible.Content>
        <div class="grid grid-cols-[1fr_2fr] gap-2">
          <!-- Speed Input -->
          <Label for="{an}-speed">Speed</Label>
          <div class="relative">
            <Input
              class="pr-16 text-center"
              type="number"
              id="{an}-speed"
              name="{an}-speed"
              min={0}
              bind:value={speed}
            />
            <!-- Speed Unit Selector -->
            <Select.Root
              type="single"
              name="{an}-speed-unit"
              bind:value={speedUnit}
            >
              <Select.Trigger
                class="focus:border-ring absolute right-0 top-0 w-16 rounded-l-none bg-neutral-100 shadow-none"
              >
                {speedUnit}
              </Select.Trigger>
              <Select.Content>
                {#each ["ds", "ms", "s"] as su}
                  <Select.Item value={su} label={su}>
                    {su}
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>

          <!-- Curve Selector -->
          <Label for="{an}-curve">Curve</Label>
          <Select.Root type="single" name="{an}-curve" bind:value={curve}>
            <Select.Trigger class="w-full">
              {curveTriggerContent}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.Label>User defined beziers</Select.Label>
                {#each beziers as bz (bz.name)}
                  <Select.Item value={bz.name} label={bz.name}>
                    {bz.name}
                  </Select.Item>
                {/each}
              </Select.Group>
              <Select.Group>
                <Select.Label>Built In</Select.Label>
                {#each beziersBuiltIn as bz (bz.name)}
                  <Select.Item value={bz.name} label={bz.name}>
                    {bz.name}
                  </Select.Item>
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>

          <!-- Style Selector -->
          {#if animation?.style}
            <Label for="{an}-style">Style</Label>
            <Select.Root type="single" name="{an}-style" bind:value={style}>
              <Select.Trigger class="w-full">
                {curveTriggerContent}
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <Select.Label>User defined beziers</Select.Label>
                  {#each beziers as bz (bz.name)}
                    <Select.Item value={bz.name} label={bz.name}>
                      {bz.name}
                    </Select.Item>
                  {/each}
                </Select.Group>
                <Select.Group>
                  <Select.Label>Built In</Select.Label>
                  {#each beziersBuiltIn as bz (bz.name)}
                    <Select.Item value={bz.name} label={bz.name}>
                      {bz.name}
                    </Select.Item>
                  {/each}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          {:else}
            <p class="text-muted-foreground col-span-2 w-full text-xs">
              This animation does not supports styles
            </p>
          {/if}
        </div>
      </Collapsible.Content>
    </div>
  {/if}
</Collapsible.Root>
