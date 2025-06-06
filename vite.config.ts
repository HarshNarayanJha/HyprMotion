import { sveltekit } from "@sveltejs/kit/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    allowedHosts: ["hyprmotion.loca.lt", "b7b788b001bd83.lhr.life"],
  },
})
