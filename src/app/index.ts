import dynamicsRoutes from './pages'

const staticPages = import.meta.glob('/src/app/static/*.vue')
const staticRoutes = Object.keys(staticPages).map(path => {
    const ps = path.substring('/src/app/static/'.length)
    const name = ps.replace('.vue', '.html').toLowerCase()
    const route: any = {
        name,
        path: '/' + name,
        component: staticPages[path]
    }
    if (name == 'index.html') {
        route.alias = '/'
    }
    return route
})

const routes = [...dynamicsRoutes, ...staticRoutes]

export { routes }
