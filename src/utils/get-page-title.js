import defaultSettings from '@/settings'

const title = defaultSettings.title || '运维平台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
