<script lang="ts">
interface InstructionCardProps {
  icon: string
  text: string
}

let { icon, text }: InstructionCardProps = $props()
</script>

<div
  class="border-hyprland/90 grid max-w-[500px] grid-cols-[1fr_2fr] gap-2 rounded-xl border-2 bg-neutral-100/10 px-4 py-8 text-start"
>
  <p class="content-center text-center">{icon}</p>
  <p class="content-center items-start">{text}</p>
</div>
