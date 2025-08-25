import {CategoriesService} from "../services/categories-service";
import {CategoriesResponseType} from "../types/categories-response.type";
import bootstrap = require("bootstrap");
import {CategoriesDeleteType} from "../types/categories-delete.type";

export class List {
    readonly page: string;
    readonly titlePageElement: HTMLElement | null;
    readonly rowElement: HTMLElement | null;
    readonly modalTypeOperationElement: HTMLElement | null;

    constructor(page: string) {
        this.page = page;
        this.titlePageElement = document.getElementById("category-title");
        this.rowElement = document.getElementById("categories");
        this.modalTypeOperationElement = document.getElementById("modal-type-operation");
        this.init().then();
    }

    private async init(): Promise<void> {
        if (!this.titlePageElement || !this.modalTypeOperationElement) {
            window.location.href = '#/'
            return
        }
        if (this.page === 'expense') {
            this.titlePageElement.innerText = 'Расходы';
            this.modalTypeOperationElement.innerText = 'расходы';
        } else if (this.page === 'income') {
            this.titlePageElement.innerText = 'Доходы';
            this.modalTypeOperationElement.innerText = 'доходы';
        } else {
            window.location.href = '#/'
        }
        await this.createList();

        this.deleteProcess();
    }

    private async createList(): Promise<void> {
        const categories: CategoriesResponseType[] | null = await CategoriesService.getCategories(this.page);
        if (categories && this.rowElement) {
            categories.forEach((category) => {
                if (!this.rowElement) return;
                const colElement: HTMLElement = document.createElement('div');
                colElement.classList.add('col');
                const cardElement: HTMLElement = document.createElement('div');
                cardElement.classList.add('card');
                const cardBodyElement: HTMLElement = document.createElement('div');
                cardBodyElement.classList.add('card-body');
                const cartTitleElement: HTMLElement = document.createElement('h3');
                cartTitleElement.classList.add('card-title');
                cartTitleElement.classList.add('mb-3')
                cartTitleElement.innerText = category.title ? category.title : '';
                cardBodyElement.appendChild(cartTitleElement);
                cardBodyElement.insertAdjacentHTML('beforeend', `<div class="card-actions d-flex gap-2"><a href="#/${this.page}/update/${category.id}" class="btn btn-primary">Редактировать <a href="#" class="btn btn-danger" data-id="${category.id}" data-bs-toggle="modal" data-bs-target="#modal">Удалить</a></div>`);
                cardElement.appendChild(cardBodyElement);
                colElement.appendChild(cardElement);
                this.rowElement.appendChild(colElement);
            });
            this.rowElement.insertAdjacentHTML("beforeend", `<div class="col"><div class="card"><a href="#/${this.page}/create/"  class="card-body d-flex align-items-center justify-content-center"> <div class="icon-link"> <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5469 6.08984V9.05664H0.902344V6.08984H14.5469ZM9.32422 0.511719V15.0039H6.13867V0.511719H9.32422Z"/></svg></div></a></div></div>`);
        }
    }

    private deleteProcess(): void {
        let categoryIdToDelete: number | null = null;

        const modal: HTMLElement | null = document.getElementById('modal');
        if (modal) {
            modal?.addEventListener('show.bs.modal', function (event) {
                const e = event as CustomEvent & { relatedTarget: HTMLElement };
                const button: HTMLElement = e.relatedTarget;
                categoryIdToDelete = parseInt(button.getAttribute('data-id')!);
            });
        }

        const confirmDeleteElement: HTMLElement | null = document.getElementById('confirmDeleteBtn');
        if (confirmDeleteElement) {
            const that: List = this;
            confirmDeleteElement.addEventListener('click', async function () {
                if (!categoryIdToDelete) return;
                const categoryIdElement: HTMLElement | null =  document.querySelector(`[data-id="${categoryIdToDelete}"]`);
                let categoryCard: HTMLElement | null = null;
                if (categoryIdElement) {
                    categoryCard = categoryIdElement.closest('tr');
                }
                if (categoryCard) categoryCard.remove();

                const deleteResult: CategoriesDeleteType | null = await CategoriesService.deleteCategory(that.page, categoryIdToDelete);

                if (deleteResult) {
                    const modalInstance: bootstrap.Modal | null = bootstrap.Modal.getInstance(modal as Element);
                    const activeElement: Element | null = document.activeElement;
                    if (activeElement) {
                        (activeElement as HTMLElement).blur();
                    }
                    if (modalInstance) {
                        modalInstance.hide();
                    }

                    categoryIdToDelete = null;
                } else {
                    alert('Не удалось удалить категорию. Пожалуйста, обратитесь в поддержку');
                }
            }.bind(this));
        }
    }
}