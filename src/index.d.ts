type ValueOf<T> = T[keyof T]

type Category = 'SO' | 'Downloader' | 'Media' | 'Office' | 'Tools' | 'Browser' | 'Emulator' | 'Dev' | 'Info' | 'VPN'

type Website = 'FileCatchers' | 'FCPortables' | 'PortableApps' | 'Softpedia' | 'GitHub' | 'VideoHelp'

type VersionOptions = {
  title?: string
  download?: string
}

type NestedConfig = {
  id?: number
  childNumber?: number
  url?: string
  urlTmp?: string
  urlTmp1?: string
  urlTmp2?: string
  download?: string
  downloadTmp?: string
  imageUrl?: string
  owner?: string
  repo?: string
  assetNumber?: number
  tagNumber?: number
  version: string
  versionOptions?: VersionOptions
  website: Website
  websiteTmp?: Website
  comment?: string
}

type AppConfigs = {
  [appName: string]: NestedConfig
}

type Info = {
  appName: string
  website: Website
  currentVersion: string
  newVersion: string
  imageUrl?: string
  fileUrl?: string
}

type AppInfos = {
  [appName: string]: Info
}

type GithubTag = {
  name: string
  tag_name: string
  assets: {
    [assetNumber: number]: {
      browser_download_url: string
    }
  }
}

type GithubTags = GithubTag[]