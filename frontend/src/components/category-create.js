import {CategoriesService} from "../services/categories-service";

export class CategoryCreate {
    constructor(page) {
        this.page = page;
        this.typeElement = document.getElementById("type");
        this.inputElement = document.getElementById('categoryTitle');
        this.createButtonElement = document.getElementById("createButton");
        this.cancelButtonElement = document.getElementById("cancelButton");

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

        this.inputElement.addEventListener('change', this.validateFill.bind(this));
        this.createButtonElement.addEventListener('click', this.createCategory.bind(this));
        this.cancelButtonElement.addEventListener('click',function() {
            window.location.href = `#/${this.page}`;
        }.bind(this));
    }

    async createCategory() {
        const inputText = this.inputElement.value;
        if (inputText) {
            const createdTitle = await CategoriesService.createCategory(this.page, {
                title: inputText
            });
            if (createdTitle) {
                if (createdTitle.message) {
                    alert('Данная категория уже существует');
                } else {
                    window.location.href = `#/${this.page}`;
                }
            } else {
                alert('Не удалось создать категорию');
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