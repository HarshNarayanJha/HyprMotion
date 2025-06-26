<script lang="ts">
import type { Snippet } from "svelte"
import type { ClassValue } from "svelte/elements"

interface InlineInputProps {
  inputClasses: ClassValue
  labelClasses: ClassValue
  placeholder?: string
  value: string
  required?: boolean
  maxLength: number
  postLabel?: Snippet<[() => void]>
  onSubmit?: (newValue: string) => void
}

let {
  inputClasses,
  labelClasses,
  placeholder = "",
  value: initialValue,
  required = true,
  maxLength,
  postLabel,
  onSubmit,
}: InlineInputProps = $props()

let value = $state(initialValue)
let original = $state(initialValue)
let editing = $state(false)

let label = $derived(value ? value : placeholder)

const edit = () => {
  original = value
  editing = true
}

const submit = () => {
  if (value !== original) {
    onSubmit?.(value)
  }
  editing = false
}

const cancel = () => {
  value = original
  editing = false
}

const handleKey = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    e.preventDefault()
    submit()
  } else if (e.key === "Escape") {
    e.preventDefault()
    cancel()
  }
}

const focus = (node: HTMLElement) => {
  setTimeout(() => node.focus(), 0)
}
</script>

{#if editing}
  <input
    class={inputClasses}
    type="text"
    bind:value
    {placeholder}
    onblur={submit}
    onkeydown={handleKey}
    maxlength={maxLength}
    use:focus
    {required}
  />
  <p class="prose prose-sm leading-4.5 px-2 py-2">
    Press <kbd>Enter</kbd> or click outside to accept, and <kbd>ESC</kbd> to reject
  </p>
{:else}
  <span
    onclick={edit}
    onkeydown={(e) => e.key === "Enter" && edit()}
    role="button"
    tabindex="0"
    class={labelClasses}
  >
    {label}
  </span>
  {@render postLabel?.(edit)}
{/if}
