import type { Animation, Bezier } from "$lib/types"

let animations = $state<Animation[] | null>(null)
let beziers = $state<Bezier[] | null>(null)

export const config = {
  get animations() {
    return animations
  },
  set animations(updated_animations) {
    animations = updated_animations
  },
  get beziers() {
    return beziers
  },
  set beziers(updated_beziers) {
    beziers = updated_beziers
  },
}
