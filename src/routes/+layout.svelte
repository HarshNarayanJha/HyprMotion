<script lang="ts">
import "../app.css"
import Footer from "$components/Footer.svelte"
import Navbar from "$components/Navbar.svelte"
import { ModeWatcher } from "mode-watcher"

let { children } = $props()
</script>

<svelte:head>
  <title>HyprMotion</title>
</svelte:head>

<ModeWatcher defaultTheme={"light"} disableTransitions={false} />
<div>
  <Navbar />

  {@render children()}

  <Footer />
</div>
