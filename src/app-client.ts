import { routes } from './app';
import { createApp } from "./views";

const { app, context } = createApp({ routes })
context.router.isReady().then(() => {
    app.mount('#app')
})