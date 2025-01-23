import { basename } from 'node:path';
import { renderToString } from 'vue/server-renderer';
import { routes } from './app';
import { createApp } from "./views";

export async function render(url: string, manifest: Record<string, string[]>) {
    const { app, context } = createApp({ routes })
    let result = context.router.resolve(url)
    if (result.matched.length > 0) {
        await context.router.push(url)
        await context.router.isReady()

        const ctx: any = {}
        const html = await renderToString(app, ctx)

        const preloadLinks = renderPreloadLinks(ctx.modules, manifest)
        return [html, preloadLinks]
    }
    throw new Error('404')
}

function renderPreloadLinks(modules: string[], manifest: Record<string, string[]>) {
    let links = ''
    const seen = new Set()
    modules.forEach(id => {
        const files = manifest[id]
        if (files) {
            files.forEach((file) => {
                if (!seen.has(file)) {
                    seen.add(file)
                    const filename = basename(file)
                    if (manifest[filename]) {
                        for (const depFile of manifest[filename]) {
                            links += renderPreloadLink(depFile)
                            seen.add(depFile)
                        }
                    }
                    links += renderPreloadLink(file)
                }
            })
        }
    })
    return links
}

function renderPreloadLink(file: string) {
    if (file.endsWith('.js')) {
        return `<link rel="modulepreload" crossorigin href="${file}">`
    } else if (file.endsWith('.css')) {
        return `<link rel="stylesheet" href="${file}">`
    } else if (file.endsWith('.woff')) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
    } else if (file.endsWith('.woff2')) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
    } else if (file.endsWith('.gif')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/gif">`
    } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`
    } else if (file.endsWith('.png')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/png">`
    } else {
        return ''
    }
}
