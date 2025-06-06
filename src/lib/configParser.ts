import { HyprAnimationParser } from "$lib/parser"

export const parseConfigFromText = (text: string) => {
  try {
    const parser = new HyprAnimationParser()
    const parsedConfig = parser.parse(text)
    console.log(parsedConfig)

    return parsedConfig
  } catch (error) {
    console.error(error)
    return null
  }
}

export const parseConfigFromURL = async (url: string) => {
  // GitHub file URI
  const matches = url.match(
    /http[s]?:\/\/github.com\/(\w+)\/(\w+)\/(\w+)\.conf/,
  )
  if (matches) {
    console.log(matches)
  }
  return url
}
