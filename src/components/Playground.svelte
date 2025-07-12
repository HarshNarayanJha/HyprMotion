<script lang="ts">
import { Button } from "$lib/components/ui/button"
import { animationGroups } from "$lib/data"
import type { Config } from "$lib/global.svelte"
import Icon from "@iconify/svelte"
import WindowMock from "$components/playground/WindowMock.svelte"
import WorkspaceMock from "$components/playground/WorkspaceMock.svelte"
import TooltipMock from "$components/playground/TooltipMock.svelte"
import ContextMenuMock from "$components/playground/ContextMenuMock.svelte"

interface PlaygroundProps {
  config: Config
}

let { config }: PlaygroundProps = $props()

let activeGroup = $state<string>("Windows")
</script>

<main class="h-full max-h-[85svh] w-full">
  {#if config.configLoaded}
    <div class="m-auto grid h-[80%] w-[80%] place-content-stretch">
      {#if activeGroup === "Windows"}
        <div class="flex items-center justify-center">
          <WindowMock animations={config.animations ?? {}} beziers={config.beziers ?? {}} />
        </div>
      {:else if activeGroup === "Layers"}
        <div class="flex w-full flex-row items-center justify-evenly">
          <TooltipMock />
          <ContextMenuMock />
        </div>
      {:else if activeGroup === "Fade Effects"}
        <div class="flex items-center justify-center">
          <!-- <WindowMock /> -->
        </div>
      {:else if activeGroup === "Borders"}
        <div class="flex items-center justify-center">
          <!-- <WindowMock /> -->
        </div>
      {:else if activeGroup === "Workspaces"}
        <!-- Todo: Broken -->
        <div class="flex items-center justify-center">
          <h3 class="font-bold">Workspaces</h3>
          <!-- <WorkspaceMock /> -->
        </div>
      {/if}
    </div>

    <div class="mt-4 flex flex-row items-center justify-center gap-4">
      {#each Object.values(animationGroups) as anG}
        <Button
          size="lg"
          variant={activeGroup === anG.title ? "default" : "outline"}
          onclick={() => (activeGroup = anG.title)}
        >
          <Icon icon={anG.icon || "material-symbols:animation"} />
        </Button>
      {/each}
    </div>
  {:else}{/if}
</main>
