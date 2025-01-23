import { type InjectionKey } from "vue";
import { type Router } from 'vue-router';

export default class ViewContext {
    static readonly KEY: InjectionKey<ViewContext> = Symbol()
    readonly router: Router
    constructor(router: Router) {
        this.router = router
    }
}