export type AnimationName =
  | "windows"
  | "windowsIn"
  | "windowsOut"
  | "windowsMove"
  //
  | "layers"
  | "layersIn"
  | "layersOut"
  //
  | "fade"
  | "fadeIn"
  | "fadeOut"
  | "fadeSwitch"
  | "fadeShadow"
  | "fadeDim"
  | "fadeLayers"
  ///
  | "fadeLayersIn"
  | "fadeLayersOut"
  //
  | "border"
  | "borderangle"
  //
  | "workspaces"
  | "workspacesIn"
  | "workspacesOut"
  | "specialWorkspace"
  ///
  | "specialWorkspaceIn"
  | "specialWorkspaceOut"

export const animationNames = [
  "windows",
  "windowsIn",
  "windowsOut",
  "windowsMove",
  "layers",
  "layersIn",
  "layersOut",
  "fade",
  "fadeIn",
  "fadeOut",
  "fadeSwitch",
  "fadeShadow",
  "fadeDim",
  "fadeLayers",
  "fadeLayersIn",
  "fadeLayersOut",
  "border",
  "borderangle",
  "workspaces",
  "workspacesIn",
  "workspacesOut",
  "specialWorkspace",
  "specialWorkspaceIn",
  "specialWorkspaceOut",
]

export interface Bezier {
  name: string
  x0: number
  y0: number
  x1: number
  y1: number
}

type BaseStyle =
  | "slide"
  | "popin"
  | "gnomed"
  | "fade"
  | "slidevert"
  | "slidefade"
  | "slidefadevert"

export type SpeedUnit = "ds" | "ms" | "s"
type SlideDirection = "left" | "right" | "top" | "bottom"
type PopinPercentage = `${number}%`
type SlideFadePercentage = `${number}%`

export type Style =
  | BaseStyle
  | `slide ${SlideDirection}`
  | `popin ${PopinPercentage}`
  | `slidefade ${SlideFadePercentage}`
  | `slidefadevert ${SlideFadePercentage}`

interface AnimationBase {
  name: AnimationName
  onoff: boolean
  speed?: number
  curve?: "default" | Bezier
  style?: Style | null
}

interface AnimationWithoutStyle extends AnimationBase {
  name:
    | "fade"
    | "fadeIn"
    | "fadeOut"
    | "fadeSwitch"
    | "fadeShadow"
    | "fadeDim"
    | "fadeLayers"
    | "fadeLayersIn"
    | "fadeLayersOut"
    | "border"
    | "borderangle"
  style?: null
}

interface WindowsAnimation extends AnimationBase {
  name: "windows" | "windowsIn" | "windowsOut" | "windowsMove"
  style?:
    | "slide"
    | "popin"
    | "gnomed"
    | `slide ${SlideDirection}`
    | `popin ${PopinPercentage}`
}

interface LayersAnimation extends AnimationBase {
  name: "layers" | "layersIn" | "layersOut"
  style?: "slide" | "popin" | "fade" | `slide ${SlideDirection}`
}

interface WorkspacesAnimation extends AnimationBase {
  name:
    | "workspaces"
    | "workspacesIn"
    | "workspacesOut"
    | "specialWorkspace"
    | "specialWorkspaceIn"
    | "specialWorkspaceOut"
  style?:
    | "slide"
    | "slidevert"
    | "fade"
    | `slidefade ${SlideFadePercentage}`
    | `slidefadevert ${SlideFadePercentage}`
}

export type Animation =
  | AnimationWithoutStyle
  | WindowsAnimation
  | LayersAnimation
  | WorkspacesAnimation

export type HyprMotionConfig = {
  animations: Animation[] | null
  beziers: Bezier[] | null
}
