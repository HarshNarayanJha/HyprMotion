<script lang="ts">
interface Props {
  message?: string
}

let {
  message = "🚧 HyprMotion is a work in progress. Expect broken features and changes!"
}: Props = $props()
</script>

<div class="w-full bg-yellow-200 p-2 text-center font-semibold text-yellow-900 shadow-md">
  {message}
</div>
