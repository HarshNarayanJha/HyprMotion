<script lang="ts">
import Icon from "@iconify/svelte"
import TransparentDivider from "./reusable/TransparentDivider.svelte"

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

  <TransparentDivider vertical={true} heightClass={"h-[100px]"} />

  <p class="content-center items-start p-2">{text}</p>
</div>
