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
  <Navbar />

  {@render children()}

  <Footer />
</div>
