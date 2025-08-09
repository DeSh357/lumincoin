import {CategoriesService} from "../services/categories-service";

export class CategoryUpdate {
    constructor(page) {
        this.page = page;
        this.typeElement = document.getElementById("type");
        this.inputElement = document.getElementById('categoryTitle');
        this.updateButtonElement = document.getElementById("updateButton");
        this.cancelButtonElement = document.getElementById("cancelButton");
        this.categoryId = window.location.hash.split('/')[3];

        this.init().then();
    }

    async init() {
        if (this.page === 'expense') {
            this.typeElement.innerText = 'расходов';
        } else if (this.page === 'income') {
            this.typeElement.innerText = 'доходов';
        } else {
            window.location.href = '#/'
        }

        this.cancelButtonElement.href = `#/${this.page}`;

        this.categoryInfo = await CategoriesService.getCategory(this.page, this.categoryId);
        if (this.categoryInfo) {
            this.inputElement.value = this.categoryInfo.title;
        }
        this.inputElement.addEventListener('change', this.validateFill.bind(this));
        this.updateButtonElement.addEventListener('click', this.updateCategory.bind(this));
        this.cancelButtonElement.addEventListener('click',function() {
            window.location.href = `#/${this.page}`;
        }.bind(this));
    }

    async updateCategory() {
        const inputText = this.inputElement.value;
        if (inputText) {
            if (inputText !== this.categoryInfo.title) {
                const updatedTitle = await CategoriesService.updateCategory(this.page, this.categoryId, {
                    title: inputText
                });
                if (updatedTitle) {
                    window.location.href = `#/${this.page}`;
                } else {
                    alert('Не удалось обновить категорию');
                }
            } else {
                window.location.href = `#/${this.page}`;
            }
        } else {
            return false;
        }
    }

    validateFill() {
        if (!this.inputElement.value) {
            this.inputElement.classList.add('is-invalid');
        } else {
            this.inputElement.classList.remove('is-invalid');
        }
    }
}