import {CategoriesService} from "../services/categories-service";
import {OperationsService} from "../services/operations-service";

export class OperationsUpdate {
    constructor() {
        this.operation_id = parseInt(window.location.hash.split('/')[3]);
        this.typeInputElement = document.getElementById('type');
        this.pageTitleElement = document.getElementById('title-action');
        this.categoryInputElement = document.getElementById('category');
        this.amountInputElement = document.getElementById('amount');
        this.dateInputElement = document.getElementById('date');
        this.commentInputElement = document.getElementById('comment');
        this.formControlElements = document.getElementsByClassName('form-control');
        this.actionButtonElement = document.getElementById('actionButton');
        this.cancelButtonElement = document.getElementById('cancelButton');
        this.isSelectValid = false;

        this.init().then();
    }

    async init() {
        if (!this.operation_id) return (window.location.href = '#/operations');
        this.pageTitleElement.innerText = 'Редактирование';
        this.actionButtonElement.innerText = 'Сохранить';

        await this.getOperation();
        await this.createCategoryList(this.operation.type, this.operation.category);
        this.fillInputsElement();

        for (const element of this.formControlElements) {
            element.addEventListener('change', () => this.validateField(element));
        }

        this.categoryInputElement.addEventListener('change', () => this.validateSelect());

        this.actionButtonElement.addEventListener('click', this.updateOperation.bind(this));
        this.cancelButtonElement.addEventListener('click', () => {
            window.location.href = '#/operations';
        });
    }

    async getOperation() {
        const operation = await OperationsService.getOperation(this.operation_id);
        if (operation) {
            this.operation = operation;
        } else {
            window.location.href = '#/operations';
        }
    }

    fillInputsElement() {
        let typeId;
        this.operation.type === 'income' ? typeId = 0 : this.operation.type === 'expense' ? typeId = 1 : typeId = -1;
        if (typeId > -1) this.typeInputElement.children[typeId].setAttribute('selected', 'selected');
        if (this.operation.amount) this.amountInputElement.value = this.operation.amount;
        if (this.operation.date) this.dateInputElement.value = this.operation.date;
        if (this.operation.comment) this.commentInputElement.value = this.operation.comment;
    }


    async createCategoryList(type, activeCategory) {
        const categories = await CategoriesService.getCategories(type);
        if (categories) {
            categories.forEach((category) => {
                const optionElement = document.createElement('option');
                optionElement.classList.add('text-black');
                if (category.title === activeCategory) {
                    this.categoryInputElement.style.color = 'black';
                    this.isSelectValid = true;
                    optionElement.setAttribute('selected', 'selected');
                }
                optionElement.innerText = category.title;
                optionElement.value = category.id;
                this.categoryInputElement.appendChild(optionElement);
            });
        }
    }

    async updateOperation() {
        if (this.validateForm()) {
            const category_id = parseInt(this.categoryInputElement.value);
            const updateOperation = await OperationsService.updateOperation(this.operation_id,{
                type: this.operation.type,
                amount: parseInt(this.amountInputElement.value),
                date: this.dateInputElement.value,
                comment: this.commentInputElement.value,
                category_id: category_id
            });

            if (updateOperation) {
                window.location.href = '#/operations';
            } else {
                alert('Не удалось обновить операцию');
            }
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