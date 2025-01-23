import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const resolve = (p) => path.resolve(__dirname, p)
const template = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
const manifest = JSON.parse(fs.readFileSync(resolve('dist/client/.vite/ssr-manifest.json'), 'utf-8'))
const { render } = await import('./dist/server/app-server.js')
const staticPages = fs.readdirSync(resolve('src/app/static')).map(file => '/' + file.toLowerCase() + '.html')
async function renderPage(url) {
    const [appHtml, preloadLinks] = await render(url, manifest)
    return template
        .replace(`<!--preload-links-->`, preloadLinks)
        .replace(`<!--app-html-->`, appHtml)
}

async function generateStatic() {
    for (const url of staticPages) {
        const html = await renderPage(url)
        const filePath = `dist/client${url}`
        fs.writeFileSync(resolve(filePath), html)
        console.log('pre-rendered:', filePath)
    }
}

async function startServer() {
    const app = (await import('express')).default()
    const staticServe = (await import('serve-static')).default
    app.use((await import('compression')).default())
    app.use('/assets/', staticServe(resolve('dist/client/assets'), { index: false }))
    for (let page of staticPages) {
        app.use(page, staticServe(resolve(`dist/client${page}`), { index: false }))
    }
    app.use('*', async (req, res) => {
        try {
            const html = await renderPage(req.originalUrl)
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        } catch (e) {
            if (e.message == '404') {
                res.status(404).end()
            } else {
                console.log(e.stack)
                res.status(500).end(e.stack)
            }
        }
    })
    app.listen(5173, () => {
        console.log('http://localhost:5173')
    })
}

const cmd = process.argv[2]
if (cmd == 'static') {
    generateStatic()
} else if (cmd == 'server') {
    startServer()
} else {
    console.log('Usage: node render [static|server]')
}