const queryMetaEl = (attr: string) =>
    document.head.querySelector(`meta[${attr}]`)

const queryMetaContent = (name: string) =>
    queryMetaEl(`property="og:${name}"`)?.getAttribute('content')

export const getWebsiteInfo = () => {
    const title =
        queryMetaContent('title') ||
        queryMetaContent('site_name') ||
        document.title

    const origin = window.location.origin.replace('/$', '')
    const faviconUrl = new URL(chrome.runtime.getURL('/_favicon/'))
    faviconUrl.searchParams.set('pageUrl', origin)
    faviconUrl.searchParams.set('size', '64')
    const icon = faviconUrl.toString()

    const url = queryMetaContent('url') || window.location.href

    const description =
        queryMetaContent('description') ||
        queryMetaEl('name="description"')?.getAttribute('content')

    return {
        title,
        icon,
        url,
        description
    }
}
