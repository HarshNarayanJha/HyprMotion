import type { Animation, AnimationName, Bezier, Style } from "$lib/types"

export interface ParsedAnimations {
  beziers: Bezier[]
  animations: Animation[]
}

export class HyprAnimationParser {
  private beziers: Map<string, Bezier> = new Map()
  private animations: Animation[] = []

  /**
   * Parse a hyprland config string for animation related config
   */
  public parse(input: string): ParsedAnimations {
    this.reset()
    const lines = input.split("\n")

    let inAnimationSection = false
    let inOtherSection = false

    for (const line of lines) {
      const trimmedLine = this.stripComments(line).trim()
      if (!trimmedLine) continue

      // Check for section changes
      if (trimmedLine.endsWith("{")) {
        if (trimmedLine.startsWith("animations")) {
          inAnimationSection = true
          inOtherSection = false
          continue
        }

        inOtherSection = true
        inAnimationSection = false
        continue
      }

      // Handle section closing
      if (trimmedLine === "}") {
        inAnimationSection = false
        inOtherSection = false
        continue
      }

      // Skip if we're in another section
      if (inOtherSection) continue

      // Parse bezier and animation lines whether in animations section or at root
      try {
        if (trimmedLine.startsWith("bezier")) {
          this.parseBezier(trimmedLine)
        } else if (trimmedLine.startsWith("animation")) {
          this.parseAnimation(trimmedLine)
        }
      } catch (error) {
        throw new Error(
          `Failed to parse line "${trimmedLine}": ${error.message}`,
        )
      }
    }

    return {
      beziers: Array.from(this.beziers.values()),
      animations: this.animations,
    }
  }

  /**
   * Parse a bezier curve definition line
   * Format: bezier = NAME, X0, Y0, X1, Y1
   */
  private parseBezier(line: string): void {
    const parts = this.splitConfigLine(line)
    if (parts.length !== 6) {
      throw new Error(
        "Invalid bezier format. Expected: bezier = NAME, X0, Y0, X1, Y1",
      )
    }

    const [_, name, x0str, y0str, x1str, y1str] = parts
    const x0 = Number.parseFloat(x0str)
    const y0 = Number.parseFloat(y0str)
    const x1 = Number.parseFloat(x1str)
    const y1 = Number.parseFloat(y1str)

    if ([x0, y0, x1, y1].some(Number.isNaN)) {
      throw new Error("Invalid bezier coordinates. All values must be numbers.")
    }

    this.beziers.set(name, { name, x0, y0, x1, y1 })
  }

  /**
   * Parse an animation definition line
   * Format: animation = NAME, ONOFF, SPEED, CURVE [,STYLE]
   */
  private parseAnimation(line: string): void {
    const parts = this.splitConfigLine(line)
    if (parts.length < 5) {
      throw new Error(
        "Invalid animation format. Expected: animation = NAME, ONOFF, SPEED, CURVE [,STYLE]",
      )
    }

    const [_, nameStr, onoffStr, speedStr, ...rest] = parts

    // Validate animation name
    const name = nameStr as AnimationName
    if (!this.isValidAnimationName(name)) {
      throw new Error(`Invalid animation name: ${name}`)
    }

    // Parse onoff (0 or 1)
    const onoff = onoffStr === "1"
    if (onoffStr !== "0" && onoffStr !== "1") {
      throw new Error("ONOFF must be either 0 or 1")
    }

    // If disabled, we don't need to validate further arguments
    if (!onoff) {
      this.animations.push({ name, onoff })
      return
    }

    // Parse speed (in ds - deciseconds)
    const speed = Number.parseInt(speedStr, 10)
    if (Number.isNaN(speed) || speed < 0) {
      throw new Error("Speed must be a positive number")
    }

    // Get curve name
    const curve = rest[0]
    if (!curve) {
      throw new Error("Curve is required for enabled animations")
    }

    if (curve !== "default" && !this.beziers.has(curve)) {
      throw new Error(`Unknown bezier curve: ${curve}`)
    }

    // Parse optional style with parameters
    let style: Style | undefined
    const styleParam = rest[1]
    if (styleParam) {
      const [baseStyle, ...params] = styleParam.split(" ")

      if (!this.isValidStyle(name, baseStyle)) {
        throw new Error(`Invalid style ${baseStyle} for animation ${name}`)
      }

      // Handle style-specific parameters
      if (params.length > 0) {
        const param = params.join(" ")

        switch (baseStyle) {
          case "slide":
            if (!["left", "right", "top", "bottom"].includes(param)) {
              throw new Error(
                `Invalid slide direction: ${param}. Must be left, right, top, or bottom`,
              )
            }
            style = `slide ${param}` as Style
            break

          case "popin":
            // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
            const popinMatch = param.match(/^(\d+)%$/)
            if (!popinMatch) {
              throw new Error(
                `Invalid popin percentage: ${param}. Must be in format: NUMBER%`,
              )
            }
            // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
            const popinPercent = Number.parseInt(popinMatch[1], 10)
            if (popinPercent < 0 || popinPercent > 100) {
              throw new Error(
                `Invalid popin percentage: ${popinPercent}. Must be between 0 and 100`,
              )
            }
            style = `popin ${param}` as Style
            break

          case "slidefade":
          case "slidefadevert":
            // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
            const fadeMatch = param.match(/^(\d+)%$/)
            if (!fadeMatch) {
              throw new Error(
                `Invalid slide fade percentage: ${param}. Must be in format: NUMBER%`,
              )
            }
            // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
            const fadePercent = Number.parseInt(fadeMatch[1], 10)
            if (fadePercent < 0 || fadePercent > 100) {
              throw new Error(
                `Invalid slide fade percentage: ${fadePercent}. Must be between 0 and 100`,
              )
            }
            style = `${baseStyle} ${param}` as Style
            break

          default:
            throw new Error(`Style ${baseStyle} does not support parameters`)
        }
      } else {
        style = baseStyle as Style
      }
    }

    this.animations.push({
      name,
      onoff,
      speed,
      curve: curve === "default" ? "default" : this.beziers.get(curve),
      style,
    })
  }

  /**
   * Split a config line handling commas and equals signs
   */
  private splitConfigLine(line: string): string[] {
    return line
      .split(/[=,]/)
      .map(part => part.trim())
      .filter(part => part.length > 0)
  }

  /**
   * Strip comments from a line
   */
  private stripComments(line: string): string {
    // Handle escaped hashes (##)
    let processed = line.replace(/##/g, "\u0000")

    // Remove comments
    const commentIndex = processed.indexOf("#")
    if (commentIndex !== -1) {
      processed = processed.substring(0, commentIndex)
    }

    // Restore escaped hashes
    // biome-ignore lint/suspicious/noControlCharactersInRegex: <explanation>
    return processed.replace(/\u0000/g, "#")
  }

  /**
   * Reset parser state
   */
  private reset(): void {
    this.beziers = new Map()
    this.animations = []
  }

  /**
   * Validate animation name against known types
   */
  private isValidAnimationName(name: string): name is AnimationName {
    const validNames = [
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
    return validNames.includes(name)
  }

  /**
   * Validate style for the given animation
   */
  private isValidStyle(animation: AnimationName, style: string): boolean {
    const windowStyles = new Set(["slide", "popin", "gnomed"])
    const layerStyles = new Set(["slide", "popin", "fade"])
    const workspaceStyles = new Set([
      "slide",
      "slidevert",
      "fade",
      "slidefade",
      "slidefadevert",
    ])
    const borderAngleStyles = new Set(["once", "loop"])

    // Check if animation supports styles at all
    const noStyleAnimations = new Set([
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
    ])

    if (noStyleAnimations.has(animation)) {
      return false
    }

    // Windows animations
    if (
      ["windows", "windowsIn", "windowsOut", "windowsMove"].includes(animation)
    ) {
      return windowStyles.has(style)
    }

    // Layer animations
    if (["layers", "layersIn", "layersOut"].includes(animation)) {
      return layerStyles.has(style)
    }

    // Workspace animations
    if (
      [
        "workspaces",
        "workspacesIn",
        "workspacesOut",
        "specialWorkspace",
        "specialWorkspaceIn",
        "specialWorkspaceOut",
      ].includes(animation)
    ) {
      return workspaceStyles.has(style)
    }

    // Borderangle animation
    if (["borderangle"].includes(animation)) {
      return borderAngleStyles.has(style)
    }

    return false
  }
}
