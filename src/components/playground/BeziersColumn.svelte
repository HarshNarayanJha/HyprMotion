<script lang="ts">
import InlineInput from "$components/reusable/InlineInput.svelte"
import { Button } from "$lib/components/ui/button"
import * as Card from "$lib/components/ui/card"
import { Input } from "$lib/components/ui/input"
import { Label } from "$lib/components/ui/label"
import { Separator } from "$lib/components/ui/separator"
import type { Bezier } from "$lib/types"
import Icon from "@iconify/svelte"

interface BeziersColumnProps {
  beziers: Bezier[] | null
}

let { beziers = $bindable(null) }: BeziersColumnProps = $props()
</script>

<aside id="beziers">
  <Card.Root>
    <Card.Header>
      <h3 class="text-xl font-bold tracking-tight">Bezier Curves</h3>
      <Separator class="my-2" />
    </Card.Header>
    <Card.Content>
      {#if beziers && beziers.length > 0}
        <div class="space-y-4">
          {#each beziers as bz}
            <!-- Beziers Input Group -->
            <div class="px-2 py-2">
              <InlineInput
                value={bz.name}
                inputClasses="border-input bg-background selection:bg-primary dark:bg-input/30 shadow-xs selection:text-primary-foreground ring-offset-background flex h-6 w-full min-w-0 rounded-md border px-2 py-3 text-base outline-none transition-[color,box-shadow]"
                labelClasses="font-medium"
                maxLength={32}
                onSubmit={(newName: string) => bz.name = newName}
              >
                {#snippet postLabel(onclick: () => void)}
                  <Icon
                    icon="fe:edit"
                    class="inline"
                    width={12}
                    height={16}
                    {onclick}
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
                />
                <Label for="{bz.name}-x1">x1</Label>
                <Input
                  name="{bz.name}-x1"
                  id="{bz.name}-x1"
                  bind:value={bz.x1}
                  placeholder="x1"
                  type="number"
                />
                <Label for="{bz.name}-y0">y0</Label>
                <Input
                  name="{bz.name}-y0"
                  id="{bz.name}-y0"
                  bind:value={bz.y0}
                  placeholder="y0"
                  type="number"
                />
                <Label for="{bz.name}-y1">y1</Label>
                <Input
                  name="{bz.name}-y1"
                  id="{bz.name}-y1"
                  bind:value={bz.y1}
                  placeholder="y1"
                  type="number"
                />
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="my-16 space-y-4 text-center text-sm">
          <p>No Bezier curves defined in config</p>
          <Button size="sm">
            <Icon icon="material-symbols:add-circle" />
            Add
          </Button>
        </div>
      {/if}
    </Card.Content>
    <Card.Footer>
      <p class="text-xs">
        Bezier curves define how your animations look and feel
      </p>
    </Card.Footer>
  </Card.Root>
</aside>
