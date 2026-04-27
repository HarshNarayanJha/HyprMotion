<script lang="ts">
import { Button } from "@ui/button/index.js"
import * as DropdownMenu from "@ui/dropdown-menu/index.js"

import MoonIcon from "@lucide/svelte/icons/moon"
import SunIcon from "@lucide/svelte/icons/sun"
import { resetMode, setMode } from "mode-watcher"
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button variant="outline" size="icon" {...props}>
        <SunIcon class="size-5 scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90" />
        <MoonIcon
          class="absolute size-5 scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0" />
        <span class="sr-only">Toggle theme</span>
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>

  <DropdownMenu.Content align="end" class="w-16">
    <DropdownMenu.Item onclick={() => setMode("light")} class="text-foreground!"
      >Light</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => setMode("dark")} class="text-foreground!"
      >Dark</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => resetMode()} class="text-foreground!"
      >System</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
