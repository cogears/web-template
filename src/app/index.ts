import dynamicsRoutes from './pages'

const staticPages = import.meta.glob('/src/app/static/*/Root.vue')
const staticRoutes = Object.keys(staticPages).map(path => {
    const ps = path.split('/')
    const name = ps[4].toLowerCase()
    return {
        name,
        path: '/' + name + '.html',
        component: staticPages[path]
    }
})

const routes = [...dynamicsRoutes, ...staticRoutes]

export { routes }
