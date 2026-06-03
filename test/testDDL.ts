import launchBrowser from '../src/puppeteer/launchBrowser.ts'
import getDirectDownloadLink from '../src/puppeteer/getDDL/index.ts'

const TARGET_URL = 'https://filespayouts.com/u0biceowys1o'

const browser = await launchBrowser()
const [page] = await browser.pages()

await getDirectDownloadLink(page, TARGET_URL).then((ddl) => {
  console.log(`🎯 Direct Download Link (DDL) extracted successfully: ${ddl}`)
}).catch((error) => {
  console.error('❌ Error:', (error as Error).message)
  return null
}).finally(async () => {
  console.log('🧹 Close browser')
  await browser.close()
})
