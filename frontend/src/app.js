import {Router} from "./router";

class App {
    constructor() {
        this.router = new Router();
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));
        window.addEventListener('popstate', this.handleRouteChanging.bind(this));

    }

    handleRouteChanging() {
        this.router.openRoute().then();
    }
}

(new App());