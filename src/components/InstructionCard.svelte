<script lang="ts">
import Icon from "@iconify/svelte"

interface InstructionCardProps {
  icon: string
  text: string
}

let { icon, text }: InstructionCardProps = $props()
</script>

<div
  class="grid max-w-[500px] rotate-0 grid-cols-[0.5fr_0.1fr_2fr] gap-2 rounded-xl border-2 border-neutral-700/20 bg-neutral-100/10 px-4 py-4 text-start shadow-md transition-shadow hover:shadow-lg"
>
  <span class="m-auto content-center">
    <Icon {icon} width="28" height="28" />
  </span>

  <div
    class="h-[100px] min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500
    to-transparent opacity-25 dark:via-neutral-400"
  ></div>

  <p class="content-center items-start p-2">{text}</p>
</div>
