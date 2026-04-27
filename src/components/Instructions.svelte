<script>
import InstructionCard from "./InstructionCard.svelte"

const instructions = $state.raw([
  {
    icon: "fe:import",
    text: "Import your animation configuration file to get started"
  },
  {
    icon: "lucide:file-sliders",
    text: "Adjust parameters to customize your hyprland animations as per your likes"
  },
  {
    icon: "fe:export",
    text: "Export your animation config"
  }
])
</script>

<div class="mx-auto grid grid-cols-3 grid-rows-1 gap-8 px-16 py-36 xl:my-8 xl:px-48">
  {#each instructions as inst}
    <InstructionCard icon={inst.icon} text={inst.text} />
  {/each}
</div>
