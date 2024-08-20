import getInfo from './getInfo'

export { applyRegex, VERSION_SEPARATOR } from './utils/index'

export { default as getDownloadLink } from './getDownloadLink'

const MAX_CONCURRENT_REQUESTS = 5

export const getInfos = async (appConfigs: AppConfigs) => {
  const results: AppInfos = {}
  const promiseErrors: { [appName: string]: unknown } = {}
  const appNames = Object.keys(appConfigs)
  for (let i = 0, len = appNames.length; i < len; i += MAX_CONCURRENT_REQUESTS) {
    const chunk = appNames.slice(i, i + MAX_CONCURRENT_REQUESTS)
    await Promise.allSettled(
      chunk.map(async (appName: string) => {
        try {
          const info = await getInfo(appConfigs[appName], appName)
          if (info !== undefined) {
            results[appName] = info
          }
        } catch (error) {
          promiseErrors[appName] = error
        }
      })
    )
  }
  return {
    results,
    errors: promiseErrors
  }
}