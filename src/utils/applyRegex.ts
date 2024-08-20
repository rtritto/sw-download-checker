export const VERSION_SEPARATOR = '<VERSION>'

/**
 * @param targetString
 * @param options
 */
const applyRegex = (targetString: string, { version }: { version: string }): string => {
  return targetString.replaceAll(VERSION_SEPARATOR, version)
}

export default applyRegex