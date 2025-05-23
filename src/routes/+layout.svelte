<script lang="ts">
import "../app.css"
import Footer from "../components/Footer.svelte"
import Navbar from "../components/Navbar.svelte"

let { children } = $props()
</script>

<svelte:head>
  <title>HyprMotion</title>
</svelte:head>

<div>
  <div class="bg-grid absolute -z-50 h-full w-full"></div>
  <Navbar />

  <main class="flex min-h-svh w-full flex-col items-center justify-center">
    {@render children()}
  </main>

  <Footer />
</div>
