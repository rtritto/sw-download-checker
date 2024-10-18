```ts
//#region outscope
import fs from 'node:fs'
import path from 'node:path'
import { Agent, fetch, request } from 'undici'

import { applyRegex } from './src/utils/index'

const OUTPUT_FOLDER = './output'

const label = 'SO'
const SECTION = {
  'IObit Driver Booster Pro <VERSION> Portable': {
    url: 'https://www.fcportables.com/driver-boost-portable',
    imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/IObit-Driver-Booster.png',
    version: '11.0.0.21',
    website: 'FCPortables'
  }
}
const appName = 'IObit Driver Booster Pro <VERSION> Portable'
const info = {
  fileUrl: '',
  newVersion: '12'
}

/**
 * Create directory if not exists.
 * example: dir = './tmp/but/then/nested'
 * @param dir directory path
 * @return true if folder is created
 */
const createFoder = (dir: string): boolean => {
  if (fs.existsSync(dir) === false) {
    fs.mkdirSync(dir, { recursive: true })
    return true
  }
  return false
}

const getUseRequest = ({ website }: Info) => {
  switch (website) {
    case 'FileCatchers':
    case 'FCPortables': {
      return {
        useRequest: true,
        options: {
          dispatcher: new Agent({
            connect: {
              // prevent UNABLE_TO_VERIFY_LEAF_SIGNATURE error
              // Error: unable to verify the first certificate
              rejectUnauthorized: false
            }
          })
        }
      }
    }
    case 'GitHub': {
      return {
        useRequest: false,
        options: {
          headers: {
            Accept: 'application/octet-stream'
          }
        }
      }
    }
    default: {
      return {
        useRequest: false,
        options: {}
      }
    }
  }
}
//#endregion

const appFolder = `${applyRegex(appName, { version: info.newVersion! })}`

// DELETE OLD VERSIONS
const dirsList = fs.readdirSync(path.join(OUTPUT_FOLDER, label), { withFileTypes: true })
const [start, end] = appName.split('<VERSION>')
for (const dir of dirsList) {
  if (
    dir.isDirectory() === true
    && dir.name !== appFolder
    && dir.name.startsWith(start)
    && dir.name.endsWith(end)
  ) {
    // const newVersionOld = `${applyRegex(appName, { version: APP_MAP[label][appName].version })}`
    const oldVersionFolder = path.join(OUTPUT_FOLDER, label, /* newVersionOld */dir.name)
    if (fs.existsSync(oldVersionFolder) === true) {
      fs.rmSync(oldVersionFolder, { recursive: true })
      // console.log(`oldVersionFolder Delete: ${oldVersionFolder}`)
    }
  }
}

// if (isVersionUpdated === true && !(DOWNLOAD_ALL === 'true')) {
//   // EXIT
//   return
// }

const appFolderPath = path.join(OUTPUT_FOLDER, label, appFolder)
/* const isFolderCreated = */ createFoder(appFolderPath)
// if (isFolderCreated === true) {
const filename = path.basename(info.fileUrl!)
const filenamePath = path.join(OUTPUT_FOLDER, label, appFolder, filename)
if (fs.existsSync(filenamePath) === false) {
  const { options, useRequest } = getUseRequest(SECTION[appName])
  const response = await (useRequest === true ? request : fetch)(info.fileUrl!, options)
  await downloadFile(response.body!, filenamePath)
}
```
