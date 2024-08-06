import { getInfos } from './src/index.ts'

const appConfigs = {
  'OpenVPN <VERSION>': {
    url: 'https://www.softpedia.com/get/Security/Security-Related/OpenVPN.shtml',
    imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/OpenVPN.png',
    download: 'https://swupdate.openvpn.org/community/releases/OpenVPN-<VERSION>-amd64.msi',
    version: '2.6.6',
    versionOptions: {
      title: '"<VERSION>".split(" ").at(0)',
      download: '"<VERSION>".split(" ").join("-")'
    },
    website: 'Softpedia'
  },
  'IObit Driver Booster Pro <VERSION> Portable': {
    url: 'https://www.fcportables.com/driver-boost-portable',
    imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/IObit-Driver-Booster.png',
    version: '11.0.0.21',
    website: 'FCPortables'
  },
  'TomVPN <VERSION> Portable': {
    url: 'https://www.filecatchers.com/tomvpn-portable',
    urlTmp: 'https://www.softpedia.com/get/Internet/Secure-Browsing-VPN/TomVPN.shtml',
    imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/TomVPN.png',
    version: '2.3.7',
    website: 'FCPortables'
  },
  'CrystalDiskInfo <VERSION> Portable': {
    url: 'https://portableapps.com/apps/utilities/crystaldiskinfo_portable',
    imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/CrystalDiskInfo.png',
    download: 'https://download2.portableapps.com/portableapps/CrystalDiskInfoPortable/CrystalDiskInfoPortable_<VERSION>.paf.exe',
    version: '9.2.1',
    website: 'PortableApps'
  }
}

const infos = await getInfos(appConfigs)
console.log('infos:', infos)