<script lang="ts">
import { goto } from "$app/navigation"
import { Button } from "$lib/components/ui/button"
import { Input } from "$lib/components/ui/input"
import { Label } from "$lib/components/ui/label"
import { Textarea } from "$lib/components/ui/textarea"
import { parseConfigFromText, parseConfigFromURL } from "$lib/configParser"
import { config } from "$lib/global.svelte"
import Icon from "@iconify/svelte"
import TransparentDivider from "./reusable/TransparentDivider.svelte"

let configText = $state<string>("")
let configFiles: FileList | undefined = $state<FileList | undefined>(undefined)
let configUrl = $state<string>("")

let configTextDisabled = $derived(
  (configFiles !== undefined && configFiles.length > 0) || configUrl !== "",
)
let configFilesDisabled = $derived(configText !== "" || configUrl !== "")
let configUrlDisabled = $derived(
  configText !== "" || (configFiles !== undefined && configFiles.length > 0),
)

let formElement = $state<HTMLFormElement | null>(null)

const submitConfig = async (
  e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
) => {
  e.preventDefault()
  if (configTextDisabled && configUrlDisabled && configFiles) {
    const text = await configFiles.item(0)?.text()
    const parsedConfig = parseConfigFromText(text ?? "")
    if (parsedConfig === null) {
      resetForm()
      return
    }
    config.animations = parsedConfig.animations
    config.beziers = parsedConfig.beziers
    goto("/playground")
  } else if (configTextDisabled && configFilesDisabled) {
    const parsedConfig = await parseConfigFromURL(configUrl)
    if (parsedConfig === null) {
      resetForm()
      return
    }
    // config.animations = parsedConfig.
  } else if (configUrlDisabled && configFilesDisabled) {
    const parsedConfig = parseConfigFromText(configText)
    if (parsedConfig === null) {
      resetForm()
      return
    }
    config.animations = parsedConfig.animations
    config.beziers = parsedConfig.beziers
    goto("/playground")
  } else {
    resetForm()
    return
  }
}

const resetForm = () => {
  formElement?.reset()
}
</script>

<form
  class="mx-4 grid grid-cols-[1fr_0.1fr_1fr] gap-4 px-24"
  onsubmit={submitConfig}
  bind:this={formElement}
>
  <div class="m-auto p-8">
    <h2 class="text-xl font-semibold">Paste your animation config</h2>
    <p class="prose prose-sm">
      Complete or partial <code>~/.config/hypr/hyprland.conf</code> containing
      exactly one
      <code>animations</code> block
    </p>
    <Textarea
      bind:value={configText}
      disabled={configTextDisabled}
      placeholder="Paste your hyprland config..."
      name="configText"
      id="configText"
      class="my-4 rounded-lg border border-neutral-800/20 p-4 ring-0 ring-blue-600/50 hover:ring disabled:hover:ring-0"
      rows={15}
      cols={30}
    />
  </div>

  <TransparentDivider vertical={true} heightClass={"h-[70%]"} />

  <div class="m-auto p-8">
    <h2 class="text-xl font-semibold">Import from file</h2>
    <p class="prose prose-sm">
      Upload your <code>~/.config/hypr/hyprland.conf</code> or any other conf
      file containing exactly one
      <code>animations</code> block
    </p>

    <div class="flex flex-row items-center gap-4">
      <div class="my-4 grid w-full content-center">
        <Label
          for="dropzone-file"
          class="flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed {configFilesDisabled
            ? 'cursor-not-allowed border-gray-300/50 bg-gray-100/50 opacity-45'
            : 'cursor-pointer  border-gray-300 bg-gray-100 hover:bg-gray-200'}"
        >
          {#if !configFiles || configFiles.length === 0}
            <div class="pb-6 pt-5">
              <Icon
                icon="material-symbols:upload-file"
                class="m-auto mb-4 h-8 w-8 text-gray-500"
              />
              <p class="mb-2 text-center text-sm text-gray-500">
                <span class="font-semibold">Click to upload</span>
                <!-- -- or drag and drop -->
              </p>
              <p class="text-xs text-gray-500">
                Hyprland .conf files only (max 10KiB)
              </p>
            </div>
          {:else}
            <div class="pb-6 pt-5">
              <div class="flex flex-col items-center justify-center">
                <Icon
                  icon="lucide:file-check"
                  class="mb-4 h-10 w-10 text-green-500"
                />
                <p class="mb-1 text-sm font-semibold text-gray-700">
                  File loaded successfully!
                </p>
                <p class="mb-2 text-sm font-medium text-gray-600">
                  {configFiles.item(0)?.name}
                </p>
                <p class="text-xs text-gray-500">
                  {Math.round(((configFiles.item(0)?.size || 0) / 1024) * 100) /
                    100} KB
                </p>
                <div class="mt-3 rounded-lg px-3 py-2">
                  <p class="text-center text-xs text-gray-600">
                    Loaded by mistake? Don't worry — <span class="font-semibold"
                      >click again</span
                    > to load another
                  </p>
                </div>
                <button
                  type="button"
                  onclick={resetForm}
                  class="mt-2 rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-500 active:bg-red-400"
                >
                  <Icon icon="mdi:file-remove" class="inline-block h-5 w-5" />
                  Remove File
                </button>
              </div>
            </div>
          {/if}
          <Input
            bind:files={configFiles}
            disabled={configFilesDisabled}
            id="dropzone-file"
            type="file"
            class="hidden"
            accept=".conf"
            multiple={false}
          />
        </Label>
      </div>
    </div>

    <TransparentDivider />

    <h2 class="text-xl font-semibold">Insert file URI</h2>
    <p class="prose prose-sm">
      Provide the URI for your <code>hyprland.conf</code> or any other conf file
      containing exactly one
      <code>animations</code> block. Can be a GitHub URI or a direct file URI
    </p>
    <Input
      bind:value={configUrl}
      disabled={configUrlDisabled}
      class="my-4 rounded-lg border border-neutral-800/20 p-2 ring-0 ring-blue-600/50 hover:ring disabled:hover:ring-0"
      type="text"
      placeholder="Example: https://github.com/end-4/dots-hyprland/blob/main/.config/hypr/hyprland/general.conf"
    />
    <!-- pattern="^[http|https]://.*\.conf" -->
  </div>

  <Button
    class="bg-hyprland hover:bg-hyprland/50 col-span-3 m-auto rounded-lg px-4 py-2 font-medium ring-2 ring-cyan-100 active:ring-cyan-300 disabled:ring-0"
    variant="secondary"
    disabled={!configTextDisabled && !configUrlDisabled && !configFilesDisabled}
    type="submit"
  >
    Start Visualizing
  </Button>
</form>
