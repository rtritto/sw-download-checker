import type { Page } from 'puppeteer'

import interceptDDLFromRequest from './interceptDDLFromRequest.ts'

const getDirectDownloadLink = async (page: Page, url: string) => {
  await page.evaluateOnNewDocument(() => {
    const blockedDomains = ['getfinefile.com']
    document.addEventListener('click', (e) => {
      const el = (e.target as HTMLElement).closest('a')

      if (el) {
        const href = el.href.toLowerCase()
        // 1. BLOCK ADVERTISING: If the link leads to getfinefile.com, cancel everything
        if (blockedDomains.some(domain => href.includes(domain))) {
          e.preventDefault()   // Stop the browser from opening the URL
          e.stopPropagation()  // Prevent site scripts from registering the click
          return               // Exit the function immediately
        }

        // 2. DEFAULT BEHAVIOR: If it's a legitimate link, just remove the _blank
        if (el.getAttribute('target') === '_blank') {
          el.removeAttribute('target')
        }
      }
    }, true) // 'true' to ensure we intercept the click BEFORE the site can react to it
  })

  console.log(`🌐 Go to URL: ${url}`)
  await page.goto(url, { waitUntil: 'domcontentloaded' })

  const firstButtonSelector = '#method_free'
  console.log(`⏳ Wait for selector ${firstButtonSelector}`)
  const firstButton = await page.waitForSelector(firstButtonSelector, { visible: true }).then((el) => {
    console.log('✅ "Free Download" button is visible!')
    return el!
  }).catch(() => {
    throw new Error('Failed to find the "Free Download" button')
  })

  await firstButton.click().then(() => {
    console.log('✅ Clicked "Free Download" button successfully!')
  }).catch(() => {
    throw new Error('Failed to click the "Free Download" button')
  })

  await page.waitForFunction(() => {
    const input = document.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement
    return input?.value?.length > 10
  }, { timeout: 15000 }).then(() => {
    console.log('✅ Turnstile response detected in the page!')
  }).catch(() => {
    throw new Error('Turnstile response not detected within the timeout')
  })

  const finalLinkSelector = '#downloadbtn'
  console.log(`⏳ Wait for selector ${finalLinkSelector}`)
  const finalButton = await page.waitForSelector(finalLinkSelector, { timeout: 11000 }).then((el) => {
    console.log('✅ "Create download link" button is visible in the DOM!')
    return el!
  }).catch(() => {
    throw new Error('Failed to find the "Create download link" button')
  })

  console.log('🔓 Remove the disabled attribute to bypass the timer')
  await finalButton.evaluate((btn) => {
    btn.removeAttribute('disabled') // Remove the HTML block
  }).then(() => {
    console.log('✅ "Create download link" button is now enabled!')
  }).catch(() => {
    throw new Error('Failed to enable the "Create download link" button')
  })

  console.log('🔍 Intercept the DDL')
  await page.setRequestInterception(true)

  console.log(`⏳ Clicking selector ${finalLinkSelector}`)
  await finalButton.click().then(() => {
    console.log('✅ Clicked "Create download link" button successfully!')
  }).catch(() => {
    throw new Error('Failed to click the "Create download link" button')
  })

  const extractedDDL = await interceptDDLFromRequest(page).catch((error) => {
    throw new Error(`Failed to extract DDL: ${(error as Error).message}`)
  }).finally(async () => {
    await page.setRequestInterception(false)
  })
  return extractedDDL
}

export default getDirectDownloadLink
