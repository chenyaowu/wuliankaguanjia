import defaultSettings from '@/settings'

const title = defaultSettings.title || '物联卡管家'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
