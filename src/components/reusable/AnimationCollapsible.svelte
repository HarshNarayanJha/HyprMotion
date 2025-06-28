<script lang="ts">
import { buttonVariants } from "$lib/components/ui/button"
import * as Collapsible from "$lib/components/ui/collapsible"
import { Input } from "$lib/components/ui/input"
import { Label } from "$lib/components/ui/label"
import * as Select from "$lib/components/ui/select"
import { Switch } from "$lib/components/ui/switch"
import * as Tooltip from "$lib/components/ui/tooltip"
import type { StyleParams } from "$lib/data"
import type {
  Animation,
  AnimationName,
  Bezier,
  SpeedUnit,
  Style,
} from "$lib/types"
import Icon from "@iconify/svelte"
import { slide } from "svelte/transition"

interface AnimationCollapsibleProps {
  an: string
  description: string
  styles: string[] | null
  styleParams: Record<string, StyleParams> | null
  animation: Animation | null
  beziers: Bezier[]
}

let {
  an,
  description,
  styles = null,
  styleParams = null,
  animation = $bindable(null),
  beziers,
}: AnimationCollapsibleProps = $props()

function formatStyleParam(s: string, p: string | number | undefined): Style {
  if (p === undefined) {
    return `${s}`.trim() as Style
  }

  if (typeof p === "number") {
    return `${s} ${p}%`.trim() as Style
  }

  if (["left", "right", "top", "bottom"].includes(p)) {
    return `slide ${p}`.trim() as Style
  }

  return `${s} ${p}`.trim() as Style
}

let enabled = $state(animation?.onoff || false)
let open = $derived(enabled)

let speed = $state(animation?.speed || 10)
let speedUnit = $state<SpeedUnit>("ds")
let speedValue = $derived.by(() => {
  switch (speedUnit) {
    case "ms":
      return 0.01 * speed
    case "s":
      return 10 * speed
    case "ds":
      return speed
  }
})

let curve = $derived(
  animation?.curve === "default" ? "default" : animation?.curve?.name,
)
let curveValue: Bezier | "default" = $derived(
  beziers.find(b => b.name === curve) || "default",
)

// TODO: if styleParam is undefined, broken
// need to make style, styleName, styleParam if possible
let style = $state(animation?.style?.toString().split(" ")[0])
let styleParam = $derived.by(() => {
  let st = animation?.style?.toString().trim()
  if (!st) return undefined

  const parts = st.split(" ")
  if (parts.length < 2) {
    return undefined
  }

  const param = parts[1]
  if (param.endsWith("%")) {
    return Number.parseInt(param)
  }

  return param
})

function handleStyleChange(val: string) {
  if (!styleParams) return

  if (!val) {
    style = undefined
    styleParam = undefined
  }

  const sParams = styleParams[val]
  if (!sParams) {
    styleParam = undefined
    return
  }

  if (sParams.type === "percentage") styleParam = 20
  else if (sParams.type === "select") styleParam = sParams.options?.[0]
}

let curveTriggerContent = $derived(curve || "Select...")
let styleTriggerContent = $derived(style || "Select...")
let styleParamTriggerContent = $derived(styleParam?.toString() || "Select...")

function updateAnimation(what: "onoff" | "speed" | "curve" | "style" | "all") {
  if (animation) {
    switch (what) {
      case "onoff":
        animation.onoff = enabled
        break
      case "speed":
        animation.speed = speedValue
        break
      case "curve":
        animation.curve = curveValue
        break
      case "style":
        if (style !== undefined && styleParam !== undefined) {
          animation.style = formatStyleParam(style, styleParam)
        } else {
          animation.style = undefined
        }
        break
      case "all":
        animation.onoff = enabled
        animation.speed = speedValue
        animation.curve = curveValue
        if (style !== undefined && styleParam !== undefined) {
          animation.style = formatStyleParam(style, styleParam)
        } else {
          animation.style = undefined
        }
        break
    }
  } else {
    animation = {
      name: an as AnimationName,
      onoff: enabled,
      speed: speedValue,
      curve: curveValue,
      style:
        style && styleParam ? formatStyleParam(style, styleParam) : undefined,
    } as Animation
  }
}

const beziersBuiltIn = [{ name: "default" }]
const speedUnits: SpeedUnit[] = ["ds", "ms", "s"]
</script>

<Collapsible.Root class="space-y0 w-full" {open}>
  <div
    class={buttonVariants({
      variant: "ghost",
      size: "sm",
      class: "flex w-full flex-row items-center justify-between gap-2 px-2",
    })}
  >
    <!-- Animation Name -->
    <Tooltip.Provider delayDuration={50}>
      <Tooltip.Root>
        <Tooltip.Trigger
          type="button"
          role="button"
          onclick={() => (open = enabled ? !open : false)}
        >
          <span
            class="w-full cursor-pointer text-start font-medium {!enabled &&
              'text-muted-foreground bg-inherit'}"
          >
            {an}
          </span>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>
            {description || "No Description"}
          </p>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>

    <!-- Onoff switch -->
    <Switch
      class="ml-auto mr-2"
      id="{an}-enabled"
      name="{an}-enabled"
      bind:checked={enabled}
      onCheckedChange={() => updateAnimation("onoff")}
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
    <div
      class="rounded-md bg-neutral-50/75 p-4"
      transition:slide={{ duration: 200 }}
    >
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
              onchange={() => updateAnimation("speed")}
            />
            <!-- Speed Unit Selector -->
            <Select.Root
              type="single"
              name="{an}-speed-unit"
              bind:value={speedUnit}
              onValueChange={() => updateAnimation("speed")}
            >
              <Select.Trigger
                class="focus:border-ring absolute right-0 top-0 w-16 rounded-l-none bg-neutral-100 shadow-none"
              >
                {speedUnit}
              </Select.Trigger>
              <Select.Content>
                {#each speedUnits as su}
                  <Select.Item value={su} label={su}>
                    {su}
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>

          <!-- Curve Selector -->
          <Label for="{an}-curve">Curve</Label>
          <Select.Root
            type="single"
            name="{an}-curve"
            bind:value={curve}
            onValueChange={() => updateAnimation("curve")}
          >
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
                {:else}
                  <Select.Label class="ml-2 text-xs"
                    >None Defined yet</Select.Label
                  >
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
          {#if styles && styles.length > 0}
            <Label for="{an}-style">Style</Label>
            <Select.Root
              type="single"
              name="{an}-style"
              bind:value={style}
              onValueChange={(val: string) => {
                handleStyleChange(val)
                updateAnimation("style")
              }}
            >
              <Select.Trigger class="w-full">
                {styleTriggerContent}
              </Select.Trigger>
              <Select.Content>
                <Select.Item value={""} label={"none"}>
                  {"none"}
                </Select.Item>
                {#each styles as st}
                  <Select.Item value={st} label={st}>
                    {st}
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>

            {#if styleParams && style && styleParams[style]}
              <Label for="{an}-styleparam">Extras</Label>
              {@const sParams = styleParams[style]}

              {#if sParams.type === "select"}
                <Select.Root
                  type="single"
                  name="{an}-styleparam"
                  bind:value={styleParam as string}
                  onValueChange={() => updateAnimation("style")}
                >
                  <Select.Trigger class="w-full">
                    {styleParamTriggerContent}
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value={""} label={"auto"}>auto</Select.Item>
                    {#each sParams.options! as spOp}
                      <Select.Item value={spOp} label={spOp}>
                        {spOp}
                      </Select.Item>
                    {/each}
                  </Select.Content>
                </Select.Root>
              {:else if sParams.type === "percentage"}
                <div class="relative flex">
                  <Input
                    class="pr-16 text-center"
                    type="number"
                    id="{an}-styleparam"
                    name="{an}-styleparam"
                    min={0}
                    max={100}
                    defaultValue={sParams.default!}
                    bind:value={styleParam as number}
                    onchange={() => updateAnimation("style")}
                  />
                  <div
                    class="absolute right-0 top-0 flex h-full w-16 items-center justify-center rounded-md rounded-l-none border bg-neutral-100 text-center"
                  >
                    %
                  </div>
                </div>
                <p class="prose col-span-2 text-end text-xs">
                  {sParams.description!}
                </p>
              {/if}
            {/if}
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
