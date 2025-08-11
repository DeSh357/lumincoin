import {Router} from "./router";
import {BalanceUtils} from "./utils/balance-utils";
import {BalanceService} from "./services/balance-service";

class App {
    constructor() {
        this.router = new Router();
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));
        window.addEventListener('popstate', this.handleRouteChanging.bind(this));

    }

    async handleRouteChanging() {
        await this.router.openRoute();
    }
}

(new App());