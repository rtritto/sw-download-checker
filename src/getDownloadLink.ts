import { request } from 'undici'

/**
 * @returns fileUrl
 *  https://github.com/<OWNER>/<REPO>/releases/download/<RELEASE_TAG>/<FILE>.<EXTENSION>
 *  https://fs21.uploadrar.com:183/d/<RANDOM_ALPHANUMERIC>/<FILE>.<EXTENSION>
 */
const getDownloadLink = async (info: Info): Promise<string> => {
  const { website, fileUrl } = info

  switch (website) {
    case 'FileCatchers':
    case 'FCPortables': {
      const fileId = fileUrl!.split('/').at(-1)
      const htmlUploadrar = await request(fileUrl!, {
        headers: {
          // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0',
          // Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          // 'Accept-Language': 'en-US,en;q=0.5',
          'Content-Type': 'application/x-www-form-urlencoded'
          // 'Upgrade-Insecure-Requests': '1',
          // 'Sec-Fetch-Dest': 'document',
          // 'Sec-Fetch-Mode': 'navigate',
          // 'Sec-Fetch-Site': 'same-origin'
          //#region Optional
          // Accept: '*/*',
          // Connection: 'keep-alive',
          // Referrer: fileUrl!,
          // RequestMode: 'cors',
          // 'User-Agent': `UA/${Date.now().toString()}`
          //#endregion
        },
        body: `op=download2&id=${fileId}&rand=&referer=https%3A%2F%2Fuploadrar.com&method_free=Free+Download&adblock_detected=0`,
        method: 'POST'
        //#region fetch options
        // credentials: 'include',
        // mode: 'cors',
        // referrer: fileUrl!
        //#endregion
      }).then((res) => res.body.text())
      return htmlUploadrar.match(/<a href="([^"]+"?uploadrar.com:[^"]+)"/)!.at(1)!
    }
    // case 'PortableApps':
    // case 'Softpedia':
    // case 'GitHub':
    // case 'VideoHelp':
    default: {
      return fileUrl!
    }
  }
}

export default getDownloadLink
