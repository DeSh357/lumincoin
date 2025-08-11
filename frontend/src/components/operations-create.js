import {CategoriesService} from "../services/categories-service";
import {OperationsService} from "../services/operations-service";

export class OperationsCreate {
    constructor() {
        this.type = window.location.hash.split('=')[1];
        this.typeInputElement = document.getElementById('type');
        this.pageTitleElement = document.getElementById('title-action');
        this.categoryInputElement = document.getElementById('category');
        this.amountInputElement = document.getElementById('amount');
        this.dateInputElement = document.getElementById('date');
        this.commentInputElement = document.getElementById('comment');
        this.formControlElements = document.getElementsByClassName('operations-inputs');
        this.actionButtonElement = document.getElementById('actionButton');
        this.cancelButtonElement = document.getElementById('cancelButton');
        this.isSelectValid = false;

        this.init().then();
    }

    async init() {
        const typeIndex = this.type === 'income' ? 0 : this.type === 'expense' ? 1 : -1;
        if (typeIndex === -1) return (window.location.href = '#/');
        this.pageTitleElement.innerText = 'Создание';
        this.actionButtonElement.innerText = 'Создать';
        this.typeInputElement.children[typeIndex].setAttribute('selected', 'selected');

        await this.createCategoryList(this.type);

        for (const element of this.formControlElements) {
            element.addEventListener('change', () => this.validateField(element));
        }

        this.categoryInputElement.addEventListener('change', () => this.validateSelect());

        this.actionButtonElement.addEventListener('click', this.createOperations.bind(this));
        this.cancelButtonElement.addEventListener('click', () => {
            window.location.href = '#/operations';
        });
    }

    async createCategoryList(type) {
        const categories = await CategoriesService.getCategories(type);
        if (categories) {
            categories.forEach((category) => {
                const optionElement = document.createElement('option');
                optionElement.classList.add('text-black');
                optionElement.innerText = category.title;
                optionElement.value = category.id;
                this.categoryInputElement.appendChild(optionElement);
            });
        }
    }

    async createOperations() {
        if (this.validateForm()) {
            const category_id = parseInt(this.categoryInputElement.value);
            const operations = await OperationsService.createOperation({
                type: this.type,
                amount: parseInt(this.amountInputElement.value),
                date: this.dateInputElement.value,
                comment: this.commentInputElement.value,
                category_id: category_id
            });
            if (!operations) return alert('Не удалось создать категорию');
            if (operations.message) return alert('Данная операция уже существует');

            window.location.href = '#/operations';
        }
    }

    validateForm() {
        let isValid = true;
        if (!this.isSelectValid) {
            this.categoryInputElement.classList.add('is-invalid');
            isValid = false;
        }
        for (const element of this.formControlElements) {
            if (!this.validateField(element)) {
                isValid = false;
            }
        }
        return isValid;
    }

    validateSelect() {
        this.categoryInputElement.style.color = 'black';
        this.isSelectValid = true;
        this.categoryInputElement.classList.remove('is-invalid');
    }

    validateField(field) {
        const hasValue = Boolean(field.value);
        field.classList.toggle('is-invalid', !hasValue);
        return hasValue;
    }

}