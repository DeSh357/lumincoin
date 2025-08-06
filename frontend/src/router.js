import {FileUtils} from "./utils/file-utils";
import {Main} from "./components/main";
import {Signup} from "./components/signup";
import {Login} from "./components/login";
import {AuthUtils} from "./utils/auth-utils";
import {AuthService} from "./services/auth-service";

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
                route: '#/expenses',
                title: 'Расходы',
                template: 'templates/expenses.html',
                styles: [
                    'list.css',
                    'modal.css'
                ],
                useLayout: 'templates/layout.html',
                useAuth: true,
                load: () => {
                }
            },
            {
                route: '#/expenses/create',
                title: 'Создание категории расходов',
                template: 'templates/createExpenseCategory.html',
                styles: [
                    'create_update.css'
                ],
                useLayout: 'templates/layout.html',
                useAuth: true,
                load: () => {
                }
            },
            {
                route: '#/expenses/update',
                title: 'Редактирование категории расходов',
                template: 'templates/updateExpenseCategory.html',
                styles: [
                    'create_update.css'
                ],
                useLayout: 'templates/layout.html',
                useAuth: true,
                load: () => {
                }
            },
            {
                route: '#/incomes',
                title: 'Доходы',
                template: 'templates/incomes.html',
                styles: [
                    'list.css',
                    'modal.css'
                ],
                useLayout: 'templates/layout.html',
                useAuth: true,
                load: () => {
                }
            },
            {
                route: '#/incomes/create',
                title: 'Создание категории доходов',
                template: 'templates/createIncomeCategory.html',
                styles: [
                    'create_update.css'
                ],
                useLayout: 'templates/layout.html',
                useAuth: true,
                load: () => {
                }
            },
            {
                route: '#/incomes/update',
                title: 'Редактирование категории доходов',
                template: 'templates/updateIncomeCategory.html',
                styles: [
                    'create_update.css'
                ],
                useLayout: 'templates/layout.html',
                useAuth: true,
                load: () => {
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
                }
            },
            {
                route: '#/operations/create',
                title: 'Создание дохода/расхода',
                template: 'templates/create.html',
                styles: [
                    'create_update.css',
                ],
                useLayout: 'templates/layout.html',
                useAuth: true,
                load: () => {
                }
            },
            {
                route: '#/operations/update',
                title: 'Редактирование дохода/расхода',
                template: 'templates/update.html',
                styles: [
                    'create_update.css',
                ],
                useLayout: 'templates/layout.html',
                useAuth: true,
                load: () => {
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
            return item.route === urlRoute;
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
            FileUtils.loadPageStyle('/styles/sidebar.css');
            hasLayout = true;
            document.getElementById('userName').innerText = info.userInfo.name + ' ' + info.userInfo.lastName;
        } else if (hasLayout && !newRote.useLayout) {
            hasLayout.remove();
            this.contentElement.classList.remove('page');
            this.contentElement.classList.remove('flex-md-row');
            this.contentElement.classList.remove('flex-column');
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