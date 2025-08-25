import {CategoriesService} from "../services/categories-service";
import {OperationsService} from "../services/operations-service";
import {CategoriesResponseType} from "../types/categories-response.type";

export class OperationsCreate {
    readonly type: string;
    private typeInputElement: HTMLElement | null;
    private pageTitleElement: HTMLElement | null;
    private categoryInputElement: HTMLInputElement | null;
    private amountInputElement: HTMLInputElement | null;
    private dateInputElement: HTMLInputElement | null;
    private commentInputElement: HTMLInputElement | null;
    readonly actionButtonElement: HTMLElement | null;
    readonly cancelButtonElement: HTMLElement | null;
    private isSelectValid: boolean;
    readonly formControlElements: HTMLCollectionOf<HTMLInputElement> | null;

    constructor() {
        this.type = window.location.hash.split('=')[1];
        this.typeInputElement = document.getElementById('type');
        this.pageTitleElement = document.getElementById('title-action');
        this.categoryInputElement = document.getElementById('category') as HTMLInputElement;
        this.amountInputElement = document.getElementById('amount') as HTMLInputElement;
        this.dateInputElement = document.getElementById('date') as HTMLInputElement;
        this.commentInputElement = document.getElementById('comment') as HTMLInputElement;
        this.formControlElements = document.getElementsByClassName('operations-inputs') as HTMLCollectionOf<HTMLInputElement>;
        this.actionButtonElement = document.getElementById('actionButton');
        this.cancelButtonElement = document.getElementById('cancelButton');
        this.isSelectValid = false;

        this.init().then();
    }

    private async init(): Promise<void> {
        const typeIndex = this.type === 'income' ? 0 : this.type === 'expense' ? 1 : -1;
        if (typeIndex === -1) {
            (window.location.href = '#/');
            return;
        }

        if (!this.pageTitleElement || !this.typeInputElement || !this.actionButtonElement
            || !this.formControlElements || !this.categoryInputElement || !this.cancelButtonElement) {
            (window.location.href = '#/');
            return;
        }
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

    private async createCategoryList(type: string): Promise<void> {
        const categories: CategoriesResponseType[] | null = await CategoriesService.getCategories(type);
        if (categories) {
            categories.forEach((category) => {
                const optionElement: HTMLOptionElement = document.createElement('option');
                optionElement.classList.add('text-black');
                if (category.title) {
                    optionElement.innerText = category.title;
                }
                optionElement.value = category.id.toString();
                if (this.categoryInputElement) {
                    this.categoryInputElement.appendChild(optionElement);
                }
            });
        }
    }

    private async createOperations(): Promise<void> {
        if (!this.categoryInputElement || !this.amountInputElement || !this.dateInputElement || !this.commentInputElement) {
            return
        }
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

    private validateForm(): boolean {
        let isValid = true;
        if (!this.isSelectValid && this.categoryInputElement) {
            this.categoryInputElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.formControlElements) {
            for (const element of this.formControlElements) {
                if (!this.validateField(element)) {
                    isValid = false;
                }
            }
        }
        return isValid;
    }

    private validateSelect(): void {
        if (this.categoryInputElement) {
            this.categoryInputElement.style.color = 'black';
            this.isSelectValid = true;
            this.categoryInputElement.classList.remove('is-invalid');
        }

    }

    private validateField(field: HTMLInputElement): boolean {
        const hasValue: boolean = Boolean(field.value);
        field.classList.toggle('is-invalid', !hasValue);
        return hasValue;
    }

}