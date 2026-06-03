import { setTimeout } from 'node:timers/promises'
import type { Page } from 'puppeteer'

const interceptDDLFromRequest = (page: Page) => new Promise<string>(async (resolve, reject) => {
  const requestHandler = (request: any) => {
    const reqUrl = request.url()

    // Let the requests to the page itself pass through
    if (reqUrl === page.url()) {
      request.continue()
      return
    }

    // If it's a navigation request (the browser is trying to change page/download a file)
    if (request.isNavigationRequest()) {
      resolve(reqUrl)       // Return DDL
      request.abort()       // Block download on Node server
      page.off('request', requestHandler)
    } else {
      request.continue()
    }
  }

  page.on('request', requestHandler)

  await setTimeout(550)
  page.off('request', requestHandler)
  reject(new Error('Timeout: No request detected after click'))
})

export default interceptDDLFromRequest
