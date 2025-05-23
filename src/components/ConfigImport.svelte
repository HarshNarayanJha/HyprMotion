<script lang="ts">
let { config = $bindable("") }: { config: string } = $props()

let configText = $state<string>("")
let configFiles: FileList | null = $state<FileList | null>(null)
let configUrl = $state<string>("")

let configTextDisabled = $derived(
  (configFiles != null && configFiles.length > 0) || configUrl !== "",
)
let configFilesDisabled = $derived(configText !== "" || configUrl !== "")
let configUrlDisabled = $derived(
  configText !== "" || (configFiles != null && configFiles.length > 0),
)

let formElement = $state<HTMLFormElement | null>(null)

const submitConfig = async (
  e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
) => {
  e.preventDefault()
  if (configTextDisabled && configUrlDisabled && configFiles) {
    config = (await configFiles.item(0)?.text()) ?? ""
  } else if (configTextDisabled && configFilesDisabled) {
    config = await (await fetch(configUrl)).text()
  } else if (configUrlDisabled && configFilesDisabled) {
    config = configText
  } else {
    config = "Error"
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
    <textarea
      bind:value={configText}
      disabled={configTextDisabled}
      name="configText"
      id="configText"
      class="my-4 rounded-lg border border-neutral-800/20 p-2 ring-0 ring-blue-600/50 hover:ring disabled:hover:ring-0"
      rows="15"
      cols="30"
    ></textarea>
  </div>

  <div
    class="m-auto h-64 min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent
    via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"
  ></div>

  <div class="m-auto p-8">
    <h2 class="text-xl font-semibold">Import from file</h2>
    <p class="prose prose-sm">
      Upload your <code>~/.config/hypr/hyprland.conf</code> or any other conf
      file containing exactly one
      <code>animations</code> block
    </p>

    <div class="flex flex-row items-center gap-4">
      <input
        bind:files={configFiles}
        disabled={configFilesDisabled}
        class="border-debug my-8 border p-4 disabled:hover:ring-0"
        type="file"
        accept=".conf"
        multiple={false}
      />

      <button
        class="h-8 w-8 rounded-md bg-red-500 font-bold"
        type="button"
        onclick={resetForm}>X</button
      >
    </div>

    <hr
      class="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"
    />

    <h2 class="text-xl font-semibold">Insert file URI</h2>
    <p class="prose prose-sm">
      Provide the URI for your <code>hyprland.conf</code> or any other conf file
      containing exactly one
      <code>animations</code> block. Can be a GitHub URI or a direct file URI
    </p>
    <input
      bind:value={configUrl}
      disabled={configUrlDisabled}
      class="my-4 rounded-lg border border-neutral-800/20 p-2 ring-0 ring-blue-600/50 hover:ring disabled:hover:ring-0"
      type="text"
      placeholder="Example: https://github.com/end-4/dots-hyprland/blob/main/.config/hypr/hyprland/general.conf"
    />
    <!-- pattern="^[http|https]://.*\.conf" -->
  </div>

  <button
    class="bg-hyprland col-span-3 m-auto rounded-lg px-4 py-2 font-medium ring-2 ring-cyan-100 active:ring-cyan-300 disabled:ring-0"
    disabled={!configTextDisabled && !configUrlDisabled && !configFilesDisabled}
    type="submit">Start Visualizing</button
  >
</form>
