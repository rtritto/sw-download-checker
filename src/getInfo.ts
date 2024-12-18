import querystring from 'node:querystring'
import { decode } from 'html-entities'
import { type HTMLElement, parse } from 'node-html-parser'
import { request, FormData, type Dispatcher } from 'undici'

import { applyRegex, applyVersionOption } from './utils/index'
import REGEX_SEMVER from './REGEX_SEMVER'
import PARSE_OPTIONS from './PARSE_OPTIONS'

const getHTML = async (url: string): Promise<HTMLElement> => {
  const data = await request(url, {
    headers: {
      Accept: '*/*',
      Connection: 'keep-alive',
      'Content-Type': 'text/plain; charset=UTF-8',
      'User-Agent': `UA/${Date.now().toString()}`
    },
    maxRedirections: 1
  }).then((res) => res.body.text())
  return parse(data, PARSE_OPTIONS)
}

const getFilteredVersion = (currentVersion: string, newestVersions: string[]): string => {
  const dotNumberLen = currentVersion.split('.').length

  const filteredVersion = newestVersions.find((v) => v.split('.').length === dotNumberLen)!

  return filteredVersion
}

const getInfo = async (obj: NestedConfig, appName: string, category?: Category): Promise<Info | undefined> => {
  const { website, version } = obj

  // if (!website) {
  //   // IGNORE
  //   return {}
  // }

  let newVersion: string | undefined
  // eslint-disable-next-line prefer-const
  let { imageUrl } = obj
  let fileUrl: string | undefined
  switch (website) {
    case 'FileCatchers':
    case 'FCPortables': {
      const { url } = obj
      const html = await getHTML(url!)
      const title = html.querySelector('title')
      const title_raw = title!.rawText
      newVersion = title_raw.match(REGEX_SEMVER)!.at(0)!
      if (newVersion === version) {
        return
      }
      // if (imageUrl === undefined) {
      //   imageUrl = html.querySelector('meta[property="og:image"]')!.getAttribute('content')
      // }
      try {
        // URL Uploadrar
        fileUrl = html
          .querySelector('#content')!
          .querySelector('p:last-of-type')!
          .querySelector('a')!
          .getAttribute('href')
      } catch (error) {
        if (error instanceof TypeError) {
          error.message = `Missing urlUploadrar; url: ${url}\n${error.message}`
          throw error
        }
        throw error
      }
      break
    }
    case 'PortableApps': {
      const { url } = obj
      const html = await getHTML(url!)
      const downloadInfo = html!.querySelector('p.download-info')
      // const [downloadInfoCN] = downloadInfo.childNodes
      // return downloadInfoCN.rawText  // Version <VERSION> for Windows Multilingual
      const downloadInfoAs = downloadInfo!.querySelectorAll('a')
      const downloadInfoA = downloadInfoAs!.find((a) => a.childNodes[0].rawText === 'Antivirus Scan')
      const downloadInfoAHref = downloadInfoA!.rawAttrs
      const { v } = querystring.parse(decode(downloadInfoAHref)) as { v: string } // convert "&amp" to "&"
      newVersion = v
      if (newVersion === version) {
        return
      }
      // if (imageUrl === undefined) {
      //   imageUrl = html.querySelector('img.main-app-logo')!.getAttribute('src')
      // }
      const { download } = obj
      if (download) {
        fileUrl = applyRegex(download, { version: newVersion })
      } else {
        throw new Error('PortableApps: missing download')
      }
      break
    }
    case 'Softpedia': {
      const html = await getHTML(obj.url!)
      const strong = html
        .querySelector('h2.sanscond.curpo')!
        .querySelector('strong')
      const strongCN = strong!.childNodes.at(0)
      const rawVersion = strongCN!.rawText
      const { versionOptions } = obj
      newVersion = applyVersionOption(rawVersion, versionOptions?.title)! as string
      if (newVersion === version) {
        return
      }
      // if (imageUrl === undefined) {
      //   imageUrl = html.querySelector('img.fl')!.getAttribute('src')
      // }
      const { download } = obj
      if (download) {
        fileUrl = applyRegex(download, { version: applyVersionOption(rawVersion, versionOptions?.download) as string })
      } else {
        throw new Error('Softpedia: missing download')
      }
      break
      // TODO
      const { id } = obj
      const fd = new FormData()
      fd.append('t', 15)
      fd.append('id', id!)
      fd.append('tsf', 0)
      const htmlDlInfo = await request('https://www.softpedia.com/_xaja/dlinfo.php?skipa=0', {
        body: fd,
        method: 'POST'
      }).then((res) => res.body.text())
      const rootDlInfo = parse(htmlDlInfo, PARSE_OPTIONS)
      const muhscroll = rootDlInfo.querySelector('#muhscroll')
      const { childNumber } = obj
      const div = muhscroll!.querySelector(`div.dllinkbox2:nth-child(${childNumber!})`)
      const a = div!.querySelector('a')
      const href = a!.getAttribute('href')

      // TODO get new page and scrape the setup link
      // await request(href)
      break
    }
    case 'GitHub': {
      const { owner, repo, tagNumber } = obj
      let response: Dispatcher.ResponseData | undefined
      if (!tagNumber) {
        response = await request(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, {
          headers: {
            'User-Agent': `UA/${Date.now().toString()}`
          }
        })
      }
      let data: GithubTag
      if (response && response.statusCode === 200) {
        data = await response.body.json() as GithubTag
      } else {
        // Not Found
        // no redirect to /latest/<LATEST_TAG>
        // but is redirected to /releases because latest tag is missing
        const responseTagsRaw = await request(`https://api.github.com/repos/${owner}/${repo}/tags`, {
          headers: {
            'User-Agent': `UA/${Date.now().toString()}`
          }
        })
        if (responseTagsRaw.statusCode !== 200) {
          throw new Error('Missing tags')
        }
        const responseTags = await responseTagsRaw.body.json() as GithubTags
        const { tagNumber } = obj
        const firstTag = responseTags.at(tagNumber ?? 0)!
        const tag = firstTag.name
        const responseTagRaw = await request(`https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`, {
          headers: {
            'User-Agent': `UA/${Date.now().toString()}`
          }
        })
        if (responseTagRaw.statusCode === 200) {
          data = await responseTagRaw.body.json() as GithubTag
        } else {
          data = { tag_name: tag } as GithubTag
          const { download } = obj
          if (!download) {
            throw new Error('Missing download')
          }
        }
      }
      if (!data.tag_name) {
        throw new Error('Missing tag_name')
      }
      newVersion = data.tag_name.match(REGEX_SEMVER)!.at(0)!
      if (newVersion === version) {
        return
      }
      fileUrl = 'download' in obj
        ? applyRegex(obj.download!, { version: newVersion })
        : data.assets[obj.assetNumber!].browser_download_url
      break
    }
    // case 'VideoHelp':
    default: {
      const { url } = obj
      if (!url) {
        throw new Error('Missing url')
      }
      const html = await getHTML(url)

      const title = html.querySelector('title')!.rawText
      // clean version
      const newestVersions = [...title.matchAll(/[\d.]+/g)].flat()
      newVersion = getFilteredVersion(version, newestVersions)
      if (newVersion === version) {
        return
      }
      const { download } = obj
      if (download) {
        fileUrl = applyRegex(download, { version: newVersion })
      } else {
        throw new Error('default: missing download')
      }
    }
  }
  return {
    appName,
    ...category && { category },
    website,
    currentVersion: version,
    newVersion,
    ...imageUrl && { imageUrl },
    ...fileUrl && { fileUrl }
  }
}

export default getInfo
