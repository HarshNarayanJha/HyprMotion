<script lang="ts">
import { goto } from "$app/navigation"
import { base } from "$app/paths"
import Playground from "$components/Playground.svelte"
import AnimationsColumn from "$components/playground/AnimationsColumn.svelte"
import BeziersColumn from "$components/playground/BeziersColumn.svelte"
import TransparentDivider from "$components/reusable/TransparentDivider.svelte"
import { Button } from "$lib/components/ui/button"
import * as Dialog from "$lib/components/ui/dialog"
import { config } from "$lib/global.svelte"
import type { AnimationName } from "$lib/types"

let showDialog = $state(!config.configLoaded)

const createNewConfig = () => {
  config.animations = {}
  config.beziers = {}
  showDialog = false
}

const showCreateNewConfigDialog = () => {
  showDialog = true
}

// it's better to use ids probably
const onBezierNameChange = (oldName: string, newName: string) => {
  if (oldName === newName || !config.animations || !config.beziers) return

  Object.entries(config.animations).forEach(([an, anim]) => {
    if (
      config.animations &&
      config.beziers &&
      anim.curve &&
      anim.curve !== "default" &&
      anim.curve.name === oldName
    ) {
      // biome-ignore lint/style/noNonNullAssertion: It literally exists since I use Objects.entries
      config.animations[an as AnimationName]!.curve = config.beziers[newName]
    }
  })
}

// $inspect(config.animations).with(console.log)
// $inspect(config.beziers).with(console.log)
</script>

<div class="flex flex-row items-center justify-between">
  <h1 class="text-4xl font-semibold">HyprMotion Playground</h1>
  <div class="flex flex-row gap-2">
    <Button>Save</Button>
    <Button onclick={showCreateNewConfigDialog}>Create New</Button>
  </div>
</div>
<TransparentDivider />

<div
  class="grid grid-cols-[1fr_2fr_1fr] items-start justify-items-stretch gap-0 xl:grid-cols-[1fr_3fr_1fr] xl:gap-0"
>
  <BeziersColumn
    bind:beziers={config.beziers}
    onCreateNewConfig={showCreateNewConfigDialog}
    {onBezierNameChange}
  />

  <!-- <div>
    {#if config.animations !== null}
      {#each Object.entries(config.animations) as [an, anim]}
        <div>
          <span>{an}</span>
          <span>{anim.name}</span>
          <span>{anim.onoff} </span>
          <span>{anim.speed}</span>
          <span>
            {anim.curve === "default" ? "default" : anim.curve?.name}
          </span>
          <span>{anim.style}</span>
        </div>
      {/each}
    {:else}
      No Animations
    {/if}
    <hr />
    <hr />
    {#if config.beziers !== null}
      {#each Object.entries(config.beziers) as [b, bz]}
        <div>
          <span>{b}</span>
          <span>{bz.name}</span>
          <span>{bz.x0} </span>
          <span>{bz.y0}</span>
          <span>{bz.x1}</span>
          <span>{bz.y1}</span>
        </div>
      {/each}
    {:else}
      No Bezier Curves
    {/if}
  </div> -->

  <Playground {config} />

  <AnimationsColumn
    bind:animations={config.animations}
    beziers={config.beziers}
    onCreateNewConfig={showCreateNewConfigDialog}
  />

  <Dialog.Root bind:open={showDialog}>
    <Dialog.Content
      class="sm:max-w-[425px]"
      onFocusOutside={(e) => e.preventDefault()}
      interactOutsideBehavior="ignore"
      escapeKeydownBehavior="ignore"
    >
      <Dialog.Header>
        <Dialog.Title>Create a new config</Dialog.Title>
        <Dialog.Description>
          Create a brand new Hyprland Animation config with HyprMotion! Or go back to import your
          own config
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Footer>
        <Button variant="link" onclick={() => goto(`${base}`)}>Go Back</Button>
        <Button variant="default" onclick={() => createNewConfig()}>Create ✨</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
</div>
