import {FileUtils} from "./utils/file-utils";
import {Main} from "./components/main";
import {Signup} from "./components/signup";
import {Login} from "./components/login";
import {AuthUtils} from "./utils/auth-utils";
import {AuthService} from "./services/auth-service";
import {List} from "./components/list";
import {CategoryUpdate} from "./components/category-update";
import {CategoryCreate} from "./components/category-create";
import {Operations} from "./components/operations";
import {OperationsCreate} from "./components/operations-create";
import {OperationsUpdate} from "./components/operations-update";
import {BalanceUtils} from "./utils/balance-utils";
import {BalanceService} from "./services/balance-service";
import {Layout} from "./components/layout";

export class Router {
    constructor() {
        this.contentElement = document.getElementById("content");
        this.templateWrapperElement = document.getElementById("template-wrapper");
        this.metaTag = document.getElementById("meta");
        this.titleElement = document.getElementById("page-title");

        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/main.html',
                styles: [
                    'main.css'
                ],
                scripts: [
                    'chart.umd.min.js',
                ],
                useLayout: 'templates/layout.html',
                useAuth: true,
                load: () => {
                    new Main();
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                useAuth: false,
                styles: [
                    'form.css',
                ],
                load: () => {
                    new Signup();
                }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'templates/login.html',
                useAuth: false,
                styles: [
                    'form.css'
                ],
                load: () => {
                    new Login();
                }
            },
            {
                route: '#/expense',
                title: 'Расходы',
                template: 'templates/list.html',
                styles: [
                    'list.css',
                    'modal.css'
                ],
                useLayout: 'templates/layout.html',
                useAuth: true,
                load: () => {
                    new List('expense');
                }
            },
            {
                route: '#/expense/create',
                title: 'Создание категории расходов',
                template: 'templates/categoryCreate.html',
                styles: [
                    'create_update.css'
                ],
                useLayout: 'templates/layout.html',
                useAuth: true,
                load: () => {
                    new CategoryCreate('expense');
                }
            },
            {
                route: '#/expense/update',
                title: 'Редактирование категории расходов',
                template: 'templates/categoryUpdate.html',
                styles: [
                    'create_update.css'
                ],
                useLayout: 'templates/layout.html',
                useAuth: true,
                load: () => {
                    new CategoryUpdate('expense');
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/list.html',
                styles: [
                    'list.css',
                    'modal.css'
                ],
                useLayout: 'templates/layout.html',
                useAuth: true,
                load: () => {
                    new List('income');
                }
            },
            {
                route: '#/income/create',
                title: 'Создание категории доходов',
                template: 'templates/categoryCreate.html',
                styles: [
                    'create_update.css'
                ],
                useLayout: 'templates/layout.html',
                useAuth: true,
                load: () => {
                    new CategoryCreate('income');
                }
            },
            {
                route: '#/income/update',
                title: 'Редактирование категории доходов',
                template: 'templates/categoryUpdate.html',
                styles: [
                    'create_update.css'
                ],
                useLayout: 'templates/layout.html',
                useAuth: true,
                load: () => {
                    new CategoryUpdate('income');
                }
            },
            {
                route: '#/operations',
                title: 'Доходы и расходы',
                template: 'templates/operations.html',
                styles: [
                    'operations.css',
                    'modal.css'
                ],
                useLayout: 'templates/layout.html',
                useAuth: true,
                load: () => {
                    new Operations();
                }
            },
            {
                route: '#/operations/create',
                title: 'Создание дохода/расхода',
                template: 'templates/operationsActions.html',
                styles: [
                    'create_update.css',
                ],
                useLayout: 'templates/layout.html',
                useAuth: true,
                load: () => {
                    new OperationsCreate();
                }
            },
            {
                route: '#/operations/update',
                title: 'Редактирование дохода/расхода',
                template: 'templates/operationsActions.html',
                styles: [
                    'create_update.css',
                ],
                useLayout: 'templates/layout.html',
                useAuth: true,
                load: () => {
                    new OperationsUpdate();
                }
            },
        ]
    }

    clearOldRoute() {
        const oldRouteElements = document.getElementsByClassName('created');
        for (let i = 0; oldRouteElements.length !== 0;) {
            oldRouteElements[i].remove();
        }
    }

    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];
        const info = AuthUtils.getAuthInfo();
        if (urlRoute === '#/logout') {
            await AuthService.logOut({
                refreshToken: info.refreshToken
            });
            AuthUtils.removeAuthInfo();
            window.location.href = '#/login';
            return;
        }

        const newRote = this.routes.find(item => {
            if (['#/', '#/expense', '#/income', '#/operations'].includes(item.route)) {
                return item.route === urlRoute;
            } else {
                return urlRoute.startsWith(item.route);
            }
        });

        if (!newRote) {
            window.location.href = '#/';
            return;
        }

        if (newRote.useAuth) {
            if (!info.accessToken || !info.refreshToken || !info.userInfo) {
                window.location.href = '#/login';
                return;
            }
        }

        let hasLayout = document.getElementById('layout');

        if (!hasLayout && newRote.useLayout) {
            this.contentElement.classList.add('page');
            this.contentElement.classList.add('flex-md-row');
            this.contentElement.classList.add('flex-column');
            this.contentElement.insertAdjacentHTML("afterbegin", (await fetch(newRote.useLayout).then(response => response.text())));
            this.templateWrapperElement.insertAdjacentHTML("afterend", (await fetch('templates/layoutModal.html').then(response => response.text())));
            FileUtils.loadPageStyle('/styles/sidebar.css');
            hasLayout = true;
            document.getElementById('userName').innerText = info.userInfo.name + ' ' + info.userInfo.lastName;
            const balance = await BalanceService.getBalance();
            BalanceUtils.showBalance(balance);
            new Layout();
        } else if (hasLayout && !newRote.useLayout) {
            hasLayout.remove();
            this.contentElement.classList.remove('page');
            this.contentElement.classList.remove('flex-md-row');
            this.contentElement.classList.remove('flex-column');
            document.getElementById('modalLayout').remove();
            document.getElementById('sidebar-styles').remove();
            hasLayout = false;
        }
        if (hasLayout) {
            this.activateMenuItem(newRote);
        }

        this.templateWrapperElement.innerHTML = "";
        this.titleElement.innerText = newRote.title;

        this.clearOldRoute();

        if (newRote.styles && newRote.styles.length > 0) {
            newRote.styles.forEach(style => {
                FileUtils.loadPageStyle('/styles/' + style);
            })
        }

        if (newRote.scripts && newRote.scripts.length > 0) {
            for (const script of newRote.scripts) {
                await FileUtils.loadPageScript('/js/' + script);
            }
        }

        if (newRote.route === '#/login' || newRote.route === '#/signup') {
            this.templateWrapperElement.classList.add('d-flex');
            this.templateWrapperElement.classList.add('align-items-center');
        } else {
            this.templateWrapperElement.classList.remove('d-flex');
            this.templateWrapperElement.classList.remove('align-items-center');
        }

        this.templateWrapperElement.innerHTML = (await fetch(newRote.template).then(response => response.text()));
        newRote.load();
    }

    activateMenuItem(route) {
        document.querySelectorAll('.sidebar .nav-link').forEach(item => {
            const href = item.getAttribute('href');
            if (route.route.startsWith(href) && href !== '#/' || href === '#/' && route.route === href) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        })
    }
}