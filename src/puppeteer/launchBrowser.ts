import puppeteer from '@zorilla/puppeteer-extra'
import AdblockerPlugin from '@zorilla/puppeteer-extra-plugin-adblocker'
import StealthPlugin from '@zorilla/puppeteer-extra-plugin-stealth'
import { type Browser, DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } from 'puppeteer'

const HEADLESS = false

puppeteer.use(StealthPlugin() as any)

puppeteer.use(
  AdblockerPlugin({
    blockTrackers: true,
    blockTrackersAndAnnoyances: true,
    // Optionally enable Cooperative Mode for several request interceptors
    interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY
  }) as any
)

const launchBrowser = async ({ headless = HEADLESS, args = [] }: {
  headless?: boolean,
  args?: string[]
} = {}): Promise<Browser> => {
  console.log(`🚀 Start Puppeteer (Chromium Headless=${headless})`)

  return puppeteer.launch({
    headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-search-engine-choice-screen',
      '--disable-dev-shm-usage',
      '--window-position=-2400,-2400', // Move the window off-screen to avoid user interaction, but keep it visible for debugging
      // '--disable-blink-features=AutomationControlled'
      ...args
    ]
    // ignoreDefaultArgs: ['--enable-automation']
  })
}

export default launchBrowser
