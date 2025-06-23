import type { AnimationName, Style } from "./types"

export interface StyleParams {
  type: "select" | "percentage"
  options?: string[]
  default?: number
  description?: string
}

export interface AnimationGroup {
  title: string
  icon?: string
  description: string
  animations: Record<AnimationName, string>
  styles?: Style[] | Record<AnimationName, Style[]>
  styleParams?: Record<string, StyleParams>
}

export const animationGroups: Record<string, AnimationGroup> = {
  windows: {
    title: "Windows",
    icon: "lucide:app-window-mac",
    description: "Window open, close, and movement animations",
    animations: {
      windows: "Global window animations",
      windowsIn: "Window opening animations",
      windowsOut: "Window closing animations",
      windowsMove: "Window movement and resize",
    } as Record<AnimationName, string>,
    styles: ["slide", "popin", "gnomed"],
    styleParams: {
      slide: {
        type: "select",
        options: ["left", "right", "top", "bottom"],
      },
      popin: {
        type: "percentage",
        default: 80,
        description: "Start scale percentage",
      },
    },
  },
  layers: {
    title: "Layers",
    icon: "lucide:layers-3",
    description: "Layer shell animations (menus, tooltips, etc)",
    animations: {
      layers: "Global layer animations",
      layersIn: "Layer opening animations",
      layersOut: "Layer closing animations",
    } as Record<AnimationName, string>,
    styles: ["slide", "popin", "fade"],
    styleParams: {
      slide: {
        type: "select",
        options: ["left", "right", "top", "bottom"],
      },
    },
  },
  fade: {
    title: "Fade Effects",
    icon: "carbon:fade",
    description: "Opacity transitions for various elements",
    animations: {
      fade: "Global fade animations",
      fadeIn: "Fade in effects",
      fadeOut: "Fade out effects",
      fadeSwitch: "Active window switching fade",
      fadeShadow: "Shadow transitions",
      fadeDim: "Inactive window dimming",
      fadeLayers: "Layer opacity animations",
      fadeLayersIn: "Layer fade in",
      fadeLayersOut: "Layer fade out",
    } as Record<AnimationName, string>,
  },
  borders: {
    title: "Borders",
    icon: "fluent:border-outside-20-filled",
    description: "Border color and style transitions",
    animations: {
      border: "Border color transitions",
      borderangle: "Border gradient angle animations",
    } as Record<AnimationName, string>,
    styles: {
      borderangle: ["once", "loop"],
    } as Record<AnimationName, Style[]>,
  },
  workspaces: {
    title: "Workspaces",
    icon: "carbon:workspace",
    description: "Workspace switching animations",
    animations: {
      workspaces: "Global workspace animations",
      workspacesIn: "Workspace switching in",
      workspacesOut: "Workspace switching out",
      specialWorkspace: "Special workspace animations",
      specialWorkspaceIn: "Special workspace in",
      specialWorkspaceOut: "Special workspace out",
    } as Record<AnimationName, string>,
    styles: ["slide", "slidevert", "fade", "slidefade", "slidefadevert"],
    styleParams: {
      slidefade: {
        type: "percentage",
        default: 20,
        description: "Movement distance",
      },
      slidefadevert: {
        type: "percentage",
        default: 20,
        description: "Movement distance",
      },
    },
  },
}
