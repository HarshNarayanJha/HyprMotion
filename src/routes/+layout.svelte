<script lang="ts">
import "../app.css"
import Footer from "$components/Footer.svelte"
import Navbar from "$components/Navbar.svelte"
import { ModeWatcher } from "mode-watcher"
import { Toaster } from "$lib/components/ui/sonner/index.js"

let { children } = $props()
</script>

<svelte:head>
  <title>HyprMotion</title>
</svelte:head>

<ModeWatcher defaultTheme={"light"} disableTransitions={false} />
<Toaster position="bottom-left" richColors />

<div>
  <Navbar />

  {@render children()}

  <Footer />
</div>
