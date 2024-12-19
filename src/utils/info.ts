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
    const iconUrl =
        document.head.querySelector('link[rel="icon"]')?.getAttribute('href') ||
        document.head
            .querySelector('link[rel="shortcut icon"]')
            ?.getAttribute('href') ||
        '/favicon.ico'

    const icon = /^\//.test(iconUrl) ? origin + iconUrl : iconUrl

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
