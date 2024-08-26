import { getInfos } from './src/index'

const appConfigs = {
  'Tor Browser <VERSION> Portable': {
    url: 'https://www.softpedia.com/get/Security/Security-Related/Tor-Browser.shtml',
    imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Tor-Browser.png',
    download: 'https://dist.torproject.org/torbrowser/<VERSION>/tor-browser-windows-x86_64-portable-<VERSION>.exe',
    version: '13.5.1',
    versionOptions: {
      download: '"<VERSION>".split(" / ").at(0)',
      title: '"<VERSION>".split(" / ").at(0)'
    },
    website: 'Softpedia'
  }
  // 'VirtualBox <VERSION> Portable': {
  //   url: 'https://www.filecatchers.com/virtualbox-portable',
  //   imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/VirtualBox.png',
  //   version: '7.0.3',
  //   website: 'FileCatchers'
  // }
  // 'MKVToolNix <VERSION> Portable': {
  //   url: 'https://www.softpedia.com/get/PORTABLE-SOFTWARE/Multimedia/Video/Portable-MKVToolnix.shtml',
  //   imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/MKVToolnix.png',
  //   download: 'https://mkvtoolnix.download/windows/releases/<VERSION>/mkvtoolnix-64-bit-<VERSION>.7z',
  //   versionOptions: {
  //     download: '"<VERSION>".split(".").slice(0,2).join(".")'
  //   },
  //   version: '81.0.0',
  //   website: 'Softpedia'
  // },
  // 'Cheat Engine <VERSION>': {
  //   url: 'https://www.softpedia.com/get/PORTABLE-SOFTWARE/Gaming-Related/Cheat-Engine.shtml',
  //   urlTmp: 'https://github.com/cheat-engine/cheat-engine/releases/latest',
  //   imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/Cheat-Engine.png',
  //   id: 258418,
  //   childNumber: 2,
  //   version: '7.5',
  //   website: 'Softpedia'
  // },
  // 'OpenVPN <VERSION>': {
  //   url: 'https://www.softpedia.com/get/Security/Security-Related/OpenVPN.shtml',
  //   imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/OpenVPN.png',
  //   download: 'https://swupdate.openvpn.org/community/releases/OpenVPN-<VERSION>-amd64.msi',
  //   version: '2.6.6',
  //   versionOptions: {
  //     title: '"<VERSION>".split(" ").at(0)',
  //     download: '"<VERSION>".split(" ").join("-")'
  //   },
  //   website: 'Softpedia'
  // },
  // 'IObit Driver Booster Pro <VERSION> Portable': {
  //   url: 'https://www.fcportables.com/driver-boost-portable',
  //   imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/IObit-Driver-Booster.png',
  //   version: '11.0.0.21',
  //   website: 'FCPortables'
  // },
  // 'TomVPN <VERSION> Portable': {
  //   url: 'https://www.filecatchers.com/tomvpn-portable',
  //   urlTmp: 'https://www.softpedia.com/get/Internet/Secure-Browsing-VPN/TomVPN.shtml',
  //   imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/TomVPN.png',
  //   version: '2.3.7',
  //   website: 'FCPortables'
  // },
  // 'CrystalDiskInfo <VERSION> Portable': {
  //   url: 'https://portableapps.com/apps/utilities/crystaldiskinfo_portable',
  //   imageUrl: 'https://windows-cdn.softpedia.com/screenshots/ico/CrystalDiskInfo.png',
  //   download: 'https://download2.portableapps.com/portableapps/CrystalDiskInfoPortable/CrystalDiskInfoPortable_<VERSION>.paf.exe',
  //   version: '9.2.1',
  //   website: 'PortableApps'
  // }
}

const infos = await getInfos(appConfigs)
console.log('infos:', infos)