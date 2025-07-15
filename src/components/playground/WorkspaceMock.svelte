<script lang="ts">
import WindowMock from "$components/playground/WindowMock.svelte"
let currentSlide = $state(0)
const slides = [1, 2]
</script>

<div class="flex w-full flex-col items-center justify-center space-y-4">
  <div class="relative w-full overflow-hidden">
    <div
      class="flex w-full transition-all duration-300 ease-in-out"
      style="margin-left: -{currentSlide * 100}%; max-width: 100%"
    >
      {#each slides as slide}
        <div class="w-full flex-shrink-0">
          <div class="max-w-full">
            <!-- <WindowMock /> -->
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="flex justify-center gap-2">
    <button
      class="h-8 w-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600"
      onclick={() => (currentSlide = Math.max(0, currentSlide - 1))}
      disabled={currentSlide === 0}
    >
      &larr;
    </button>
    <button
      class="h-8 w-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600"
      onclick={() => (currentSlide = Math.min(slides.length - 1, currentSlide + 1))}
      disabled={currentSlide === slides.length - 1}
    >
      &rarr;
    </button>
  </div>
</div>
