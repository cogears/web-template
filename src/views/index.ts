import { createSSRApp } from "vue";
import { createMemoryHistory, createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import Root from "./Root.vue";
import ViewContext from "./ViewContext";

export interface AppOptions {
    routes: RouteRecordRaw[],
}

export function createApp(options: AppOptions) {
    const app = createSSRApp(Root)
    const router = createRouter({
        routes: options.routes,
        history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    })
    const context = new ViewContext(router)
    app.use(router)
    app.provide(ViewContext.KEY, context)
    return { app, context }
}