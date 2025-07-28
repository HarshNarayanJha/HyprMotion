<script lang="ts">
import InlineInput from "$components/reusable/InlineInput.svelte"
import { Button } from "$lib/components/ui/button"
import * as Card from "$lib/components/ui/card"
import { Input } from "$lib/components/ui/input"
import { Label } from "$lib/components/ui/label"
import { Separator } from "$lib/components/ui/separator"
import type { Bezier } from "$lib/types"
import Icon from "@iconify/svelte"
import { toast } from "svelte-sonner"

interface BeziersColumnProps {
  beziers: Record<string, Bezier> | null
  onCreateNewConfig?: () => void
  onBezierNameChange?: (oldName: string, newName: string) => void
}

let {
  beziers = $bindable(null),
  onCreateNewConfig,
  onBezierNameChange,
}: BeziersColumnProps = $props()

function bezierNameChange(oldName: string, newName: string) {
  if (!beziers) return

  if (oldName !== newName && newName in beziers) {
    toast.warning(`Curve with name "${newName}" already exists`)
    return oldName
  }

  if (oldName !== newName) {
    beziers[newName] = { ...beziers[oldName], name: newName }
    delete beziers[oldName]
    onBezierNameChange?.(oldName, newName)
  }
  return newName
}

function addBezier() {
  if (beziers === null) {
    console.error("Can't add, beziers is null. Create a config first!")
    return
  }

  const count = Object.keys(beziers).length
  beziers[`curve${count + 1}`] = { name: `curve${count + 1}`, x0: 0, x1: 1, y0: 0, y1: 1 }
}

function deleteBezier(name: string) {
  if (beziers === null) {
    console.error("Can't delete, beziers is null. Create a config first!")
    return false
  }

  if (name in beziers) {
    delete beziers[name]
    return true
  }

  console.error(`Bezier with name "${name}" does not exist`)
  return false
}
</script>

<aside id="beziers">
  <Card.Root>
    <Card.Header>
      <h3 class="text-xl font-bold tracking-tight">Bezier Curves</h3>
      <Separator class="my-2" />
    </Card.Header>
    <Card.Content>
      {#if beziers !== null}
        <div class="space-y-4">
          {#each Object.values(beziers) as bz (bz.name)}
            <!-- Beziers Input Group -->
            <div class="px-2 py-2">
              <InlineInput
                value={bz.name}
                inputClasses="border-input bg-background selection:bg-primary dark:bg-input/30 shadow-xs selection:text-primary-foreground ring-offset-background flex h-6 w-full min-w-0 rounded-md border px-2 py-3 text-base outline-none transition-[color,box-shadow]"
                labelClasses="font-medium"
                maxLength={32}
                onInputSubmit={bezierNameChange}
                onEndClick={deleteBezier}
              >
                {#snippet postLabel(onclick)}
                  <Icon icon="fe:edit" class="inline" width={16} height={16} {onclick} />
                {/snippet}

                {#snippet endLabel(onclick)}
                  <Icon
                    icon="fe:trash"
                    class="inline text-red-400"
                    width={16}
                    height={16}
                    onclick={() => onclick(bz.name)}
                  />
                {/snippet}
              </InlineInput>

              <div
                class="mt-2 grid grid-cols-[1fr_3fr_1fr_3fr] items-center justify-items-end gap-2"
              >
                <Label for="{bz.name}-x0">x0</Label>
                <Input
                  name="{bz.name}-x0"
                  id="{bz.name}-x0"
                  bind:value={bz.x0}
                  placeholder="x0"
                  type="number"
                  min={0}
                  max={1}
                />
                <Label for="{bz.name}-x1">x1</Label>
                <Input
                  name="{bz.name}-x1"
                  id="{bz.name}-x1"
                  bind:value={bz.x1}
                  placeholder="x1"
                  type="number"
                  min={0}
                  max={1}
                />
                <Label for="{bz.name}-y0">y0</Label>
                <Input
                  name="{bz.name}-y0"
                  id="{bz.name}-y0"
                  bind:value={bz.y0}
                  placeholder="y0"
                  type="number"
                  min={0}
                  max={1}
                />
                <Label for="{bz.name}-y1">y1</Label>
                <Input
                  name="{bz.name}-y1"
                  id="{bz.name}-y1"
                  bind:value={bz.y1}
                  placeholder="y1"
                  type="number"
                  min={0}
                  max={1}
                />
              </div>
            </div>
          {:else}
            <div class="my-16 space-y-4 text-center text-sm">
              <p>No Bezier curves defined in config</p>
              <Button size="sm" onclick={addBezier}>
                <Icon icon="material-symbols:add-circle" />
                Add
              </Button>
            </div>
          {/each}
          <!-- If there are beziers, show a button to add more -->
          {#if Object.keys(beziers).length > 0}
            <div class="w-full text-center text-sm">
              <Button size="sm" onclick={addBezier} class="w-full">
                <Icon icon="material-symbols:add-circle" />
                Add
              </Button>
            </div>
          {/if}
        </div>
      {:else}
        <div class="my-16 space-y-4 text-center text-sm">
          <p>No config loaded</p>
          <Button size="sm" onclick={() => onCreateNewConfig?.()}>
            <Icon icon="material-symbols:add-circle" />
            Create New
          </Button>
        </div>
      {/if}
    </Card.Content>
    <Card.Footer>
      <p class="text-xs">Bezier curves define how your animations look and feel</p>
    </Card.Footer>
  </Card.Root>
</aside>
