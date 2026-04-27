<script lang="ts">
import { goto } from "$app/navigation"
import { resolve } from "$app/paths"

import { Button } from "@ui/button"
import { Input } from "@ui/input"
import { Label } from "@ui/label"
import { Textarea } from "@ui/textarea"

import { parseConfigFromText, parseConfigFromURL } from "$lib/configParser"
import { config } from "$lib/global.svelte"

import Icon from "@iconify/svelte"

import TransparentDivider from "./reusable/TransparentDivider.svelte"

let text = $state("")
let files = $state<FileList>()
let url = $state("")
let processing = $state(false)

const hasText = $derived(text.trim().length > 0)
const hasFile = $derived(files && files.length > 0)
const hasUrl = $derived(url.trim().length > 0)

const canSubmit = $derived((hasText || hasFile || hasUrl) && !processing)

async function handleSubmit(e: Event) {
  e.preventDefault()
  if (!canSubmit) return
  processing = true

  try {
    let result = null

    if (hasFile && files?.[0]) {
      const content = await files[0].text()
      result = parseConfigFromText(content)
    } else if (hasUrl) {
      result = await parseConfigFromURL(url)
    } else if (hasText) {
      result = parseConfigFromText(text)
    }

    if (result) {
      config.animations = result.animations
      config.beziers = result.beziers
      goto(resolve("/playground"))
    }
  } catch (err) {
    console.error("Import failed:", err)
  } finally {
    processing = false
  }
}

function clear() {
  text = ""
  files = undefined
  url = ""
}
</script>

<form class="mx-4 grid grid-cols-[1fr_0.1fr_1fr] gap-4 xl:px-24" onsubmit={handleSubmit}>
  <div class="m-auto p-8">
    <h2 class="text-xl font-semibold">Paste your animation config</h2>
    <p class="prose prose-sm dark:prose-invert">
      Complete or partial <code>~/.config/hypr/hyprland.conf</code> containing exactly one
      <code>animations</code> block
    </p>
    <Textarea
      bind:value={text}
      disabled={hasFile || hasUrl}
      placeholder="Paste your hyprland config..."
      class="my-4 rounded-lg p-4"
      rows={15}
      cols={30} />
  </div>

  <TransparentDivider vertical={true} heightClass={"h-[70%]"} />

  <div class="m-auto p-8">
    <h2 class="text-xl font-semibold">Import from file</h2>
    <p class="prose prose-sm dark:prose-invert">
      Upload your <code>~/.config/hypr/hyprland.conf</code> or any other conf file containing
      exactly one
      <code>animations</code> block
    </p>

    <div class="flex flex-row items-center gap-4">
      <div class="my-4 grid w-full content-center">
        <Label
          for="dropzone-file"
          class="flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed {hasText ||
          hasUrl
            ? 'cursor-not-allowed border-gray-300/50 bg-gray-100/50 opacity-45 dark:border-gray-700/50 dark:bg-gray-900/50'
            : 'cursor-pointer border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800'}">
          {#if !files || files.length === 0}
            <div class="pt-5 pb-6">
              <Icon
                icon="material-symbols:upload-file"
                class="m-auto mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" />
              <p class="mb-2 text-center text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semibold">Click to upload</span>
                <!-- -- or drag and drop -->
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Hyprland .conf files only (max 10KiB)
              </p>
            </div>
          {:else}
            <div class="pt-5 pb-6">
              <div class="flex flex-col items-center justify-center">
                <Icon
                  icon="lucide:file-check"
                  class="mb-4 h-10 w-10 text-green-500 dark:text-green-400" />
                <p class="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  File loaded successfully!
                </p>
                <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  {files[0]?.name}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round(((files[0]?.size || 0) / 1024) * 100) / 100} KB
                </p>
                <div class="mt-3 rounded-lg px-3 py-2">
                  <p class="text-center text-xs text-gray-600 dark:text-gray-300">
                    Loaded by mistake? Don't worry — <span class="font-semibold">
                      click again
                    </span> to load another
                  </p>
                </div>
                <button
                  type="button"
                  onclick={clear}
                  class="mt-2 rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-500 active:bg-red-400 dark:bg-red-700 dark:hover:bg-red-600 dark:active:bg-red-500">
                  <Icon icon="mdi:file-remove" class="inline-block h-5 w-5" />
                  Remove File
                </button>
              </div>
            </div>
          {/if}
          <Input
            id="dropzone-file"
            type="file"
            class="hidden"
            accept=".conf"
            disabled={hasText || hasUrl}
            bind:files />
        </Label>
      </div>
    </div>

    <TransparentDivider />

    <h2 class="text-xl font-semibold">Insert file URI</h2>
    <p class="prose prose-sm dark:prose-invert">
      Provide the URI for your <code>hyprland.conf</code> or any other conf file containing exactly
      one
      <code>animations</code> block. Can be a GitHub URI or a direct file URI
    </p>
    <p class="text-red-700 dark:text-red-300">Doesn't Work Right Now</p>
    <Input
      bind:value={url}
      disabled={hasText || hasFile}
      class="my-4 rounded-lg p-2"
      type="text"
      placeholder="Example: https://github.com/end-4/dots-hyprland/blob/main/.config/hypr/hyprland/general.conf" />
    <!-- pattern="^[http|https]://.*\.conf" -->
  </div>

  <Button
    class="col-span-3 m-auto rounded-lg bg-hyprland/80 px-4 py-2 font-medium text-black hover:bg-hyprland/90"
    variant="default"
    size="lg"
    disabled={!canSubmit || processing}
    type="submit">
    {#if processing}
      <Icon icon="lucide:refresh-cw" class="mr-2 size-6 animate-spin" />
      Loading...
    {:else}
      Start Visualizing
    {/if}
  </Button>
</form>
