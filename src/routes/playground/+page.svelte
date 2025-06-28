<script lang="ts">
import { goto } from "$app/navigation"
import Playground from "$components/Playground.svelte"
import AnimationsColumn from "$components/playground/AnimationsColumn.svelte"
import BeziersColumn from "$components/playground/BeziersColumn.svelte"
import TransparentDivider from "$components/reusable/TransparentDivider.svelte"
import { Button } from "$lib/components/ui/button"
import * as Dialog from "$lib/components/ui/dialog"
import { config } from "$lib/global.svelte"

let showDialog = $state(!config.configLoaded)

const createNewConfig = () => {
  config.animations = {}
  config.beziers = {}
  showDialog = false
}

const showCreateNewConfigDialog = () => {
  showDialog = true
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
  />

  <!-- <div>
    {#if config.animations !== null}
      {#each Object.values(config.animations) as anim}
        <div>
          <span>{anim.name}</span>
          <span>{anim.onoff} </span>
          <span>{anim.speed}</span>
          <span>{anim.curve} </span>
          <span>{anim.style}</span>
        </div>
      {/each}
    {:else}
      No Animations
    {/if}
    {#if config.beziers !== null}
      {#each Object.values(config.beziers) as bz}
        <div>
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

  <Playground {config}/>

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
          Create a brand new Hyprland Animation config with HyprMotion! Or go
          back to import your own config
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Footer>
        <Button variant="link" onclick={() => goto("/")}>Go Back</Button>
        <Button variant="default" onclick={() => createNewConfig()}>
          Create ✨
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
</div>
