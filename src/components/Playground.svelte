<script lang="ts">
import { Button } from "$lib/components/ui/button"
import { animationGroups } from "$lib/data"
import type { Config } from "$lib/global.svelte"
import Icon from "@iconify/svelte"
import WindowMock from "$components/playground/WindowMock.svelte"
import WorkspaceMock from "$components/playground/WorkspaceMock.svelte"
import TooltipMock from "$components/playground/TooltipMock.svelte"
import ContextMenuMock from "$components/playground/ContextMenuMock.svelte"
import * as Tooltip from "$lib/components/ui/tooltip"
import LayerMock from "./playground/LayerMock.svelte"

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
          <WindowMock animations={config.animations!} beziers={config.beziers!} />
        </div>
      {:else if activeGroup === "Layers"}
        <div class="flex w-full flex-row items-center justify-evenly">
          <!-- <h3 class="font-bold">Layers</h3> -->
          <LayerMock animations={config.animations!} beziers={config.beziers!} />
        </div>
      {:else if activeGroup === "Fade Effects"}
        <div class="flex items-center justify-center">
          <!-- <WindowMock /> -->
          <h3 class="font-bold">Fade</h3>
        </div>
      {:else if activeGroup === "Borders"}
        <div class="flex items-center justify-center">
          <!-- <WindowMock /> -->
          <h3 class="font-bold">Borders</h3>
        </div>
      {:else if activeGroup === "Workspaces"}
        <!-- Todo: Broken -->
        <div class="flex items-center justify-center">
          <h3 class="font-bold">Workspaces</h3>
          <!-- <WorkspaceMock /> -->
        </div>
      {:else if activeGroup === "Zoom"}
        <div class="flex items-center justify-center">
          <h3 class="font-bold">Zoom</h3>
          <!-- <WorkspaceMock /> -->
        </div>
      {/if}
    </div>

    <div class="mt-4 flex flex-row items-center justify-center gap-4">
      {#each Object.values(animationGroups) as anG}
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                size="lg"
                variant={activeGroup === anG.title ? "default" : "outline"}
                onclick={() => (activeGroup = anG.title)}
              >
                <Icon icon={anG.icon || "material-symbols:animation"} />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>
                {anG.title}
              </p>
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      {/each}
    </div>
  {:else}{/if}
</main>
