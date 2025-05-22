<script>
import InstructionCard from "./InstructionCard.svelte"
</script>

<div class="container mx-4 my-8 grid grid-cols-3 grid-rows-1 gap-8 p-32">
  <InstructionCard icon={"import"} text="Import your animation configuration file to get started" />
  <InstructionCard
    icon={"adjust"}
    text="Adjust parameters to customize your hyprland animations as per as your likes"
  />
  <InstructionCard icon={"export"} text="Export your animation config" />
</div>
