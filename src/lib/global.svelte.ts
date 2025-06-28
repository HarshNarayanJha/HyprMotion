import type {
  Animation,
  AnimationName,
  Bezier,
  // HyprMotionConfig,
} from "$lib/types"

export class Config {
  animations = $state<Partial<Record<AnimationName, Animation>> | null>(null)
  beziers = $state<Record<string, Bezier> | null>(null)

  configLoaded = $derived(this.animations !== null && this.beziers !== null)
}

export const config = new Config()
