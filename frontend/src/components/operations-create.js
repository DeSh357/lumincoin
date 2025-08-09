import {CategoriesService} from "../services/categories-service";

export class OperationsCreate {
    constructor() {
        this.type = window.location.hash.split('=')[1];
        this.typeInputElement = document.getElementById('type');
        this.categoryInputElement = document.getElementById('category');

        this.createButtonElement = document.getElementById('createButton');
        this.cancelButtonElement = document.getElementById('cancelButton');

        this.init().then();
    }

    async init() {
        if (this.type === 'income') {
            this.typeInputElement.children[0].setAttribute('selected', 'selected');
        } else if (this.type === 'expense') {
            this.typeInputElement.children[1].setAttribute('selected', 'selected');
        } else {
            window.location.href = '#/'
        }

        await this.createCategoryList();


        // this.inputElement.addEventListener('change', this.validateFill.bind(this));
        // this.createButtonElement.addEventListener('click', this.createCategory.bind(this));
        this.cancelButtonElement.addEventListener('click',() => {
            window.location.href = '#/operations';
        });
    }

    async createCategoryList() {
        const categories = await CategoriesService.getCategories(this.type);
        if (categories) {
            categories.forEach((category) => {
                const optionElement = document.createElement('option');
                optionElement.classList.add('text-black');
                optionElement.innerText = category.title;
                optionElement.id = `category-${category.id}`;
                this.categoryInputElement.appendChild(optionElement);
            });
        }
    }

    validateForm() {

    }

    validateFill() {

    }
}