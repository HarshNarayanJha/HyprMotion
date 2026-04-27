<script lang="ts">
import "../app.css"

import Footer from "$components/Footer.svelte"
import Navbar from "$components/Navbar.svelte"

import { Toaster } from "@ui/sonner/index.js"

import { ModeWatcher } from "mode-watcher"

let { children } = $props()
</script>

<svelte:head>
  <title>HyprMotion</title>
</svelte:head>

<ModeWatcher defaultTheme={"light"} disableTransitions={false} track={true} />

<div>
  <Navbar />

  {@render children()}

  <Toaster position="top-center" richColors />
  <Footer />
</div>
