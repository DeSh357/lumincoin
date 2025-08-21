import {CategoriesService} from "../services/categories-service";

export class List {
    constructor(page) {
        this.page = page;
        this.titlePageElement = document.getElementById("category-title");
        this.rowElement = document.getElementById("categories");
        this.modalTypeOperationElement = document.getElementById("modal-type-operation");
        this.init().then();
    }

    async init() {
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

    async createList() {
        const categories = await CategoriesService.getCategories(this.page);
        if (categories) {
            categories.forEach((category) => {
                const colElement = document.createElement('div');
                colElement.classList.add('col');
                const cardElement = document.createElement('div');
                cardElement.classList.add('card');
                const cardBodyElement = document.createElement('div');
                cardBodyElement.classList.add('card-body');
                const cartTitleElement = document.createElement('h3');
                cartTitleElement.classList.add('card-title');
                cartTitleElement.classList.add('mb-3')
                cartTitleElement.innerText = category.title;
                cardBodyElement.appendChild(cartTitleElement);
                cardBodyElement.insertAdjacentHTML('beforeend', `<div class="card-actions d-flex gap-2"><a href="#/${this.page}/update/${category.id}" class="btn btn-primary">Редактировать <a href="#" class="btn btn-danger" data-id="${category.id}" data-bs-toggle="modal" data-bs-target="#modal">Удалить</a></div>`);
                cardElement.appendChild(cardBodyElement);
                colElement.appendChild(cardElement);
                this.rowElement.appendChild(colElement);
            });
            this.rowElement.insertAdjacentHTML("beforeend", `<div class="col"><div class="card"><a href="#/${this.page}/create/"  class="card-body d-flex align-items-center justify-content-center"> <div class="icon-link"> <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5469 6.08984V9.05664H0.902344V6.08984H14.5469ZM9.32422 0.511719V15.0039H6.13867V0.511719H9.32422Z"/></svg></div></a></div></div>`);
        }
    }

    deleteProcess() {
        let categoryIdToDelete = null;

        const modal = document.getElementById('modal');
        modal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            categoryIdToDelete = button.getAttribute('data-id');
        });

        document.getElementById('confirmDeleteBtn').addEventListener('click', async function () {
            if (!categoryIdToDelete) return;
            const categoryCard = document.querySelector(`[data-id="${categoryIdToDelete}"]`).closest('.col');
            if (categoryCard) categoryCard.remove();

            const deleteResult = await CategoriesService.deleteCategory(this.page, categoryIdToDelete);

            if (deleteResult) {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                document.activeElement.blur();
                modalInstance.hide();

                categoryIdToDelete = null;
            } else {
                alert('Не удалось удалить категорию. Пожалуйста, обратитесь в поддержку');
            }
        }.bind(this));
    }
}