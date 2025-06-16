<script lang="ts">
import * as Card from "$lib/components/ui/card"
import Icon from "@iconify/svelte"
import TransparentDivider from "./reusable/TransparentDivider.svelte"

interface InstructionCardProps {
  icon: string
  text: string
}

let { icon, text }: InstructionCardProps = $props()
</script>

<Card.Root class="max-w-[450px] shadow-md transition-shadow hover:shadow-lg">
  <Card.Content class="grid grid-cols-[0.5fr_0.1fr_2fr] gap-2 text-start">
    <span class="m-auto content-center">
      <Icon {icon} width="28" height="28" />
    </span>

    <TransparentDivider vertical={true} heightClass={"h-[100px]"} />

    <p class="content-center items-start px-2">{text}</p>
  </Card.Content>
</Card.Root>
