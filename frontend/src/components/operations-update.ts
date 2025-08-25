import {CategoriesService} from "../services/categories-service";
import {OperationsService} from "../services/operations-service";
import {OperationsResponseType} from "../types/operations-response.type";
import {CategoriesResponseType} from "../types/categories-response.type";

export class OperationsUpdate {
    private operation: OperationsResponseType | null = null;
    readonly operation_id: number;
    readonly typeInputElement: HTMLElement | null;
    readonly pageTitleElement: HTMLElement | null;
    readonly categoryInputElement: HTMLInputElement | null;
    private amountInputElement: HTMLInputElement | null;
    private dateInputElement: HTMLInputElement | null;
    private commentInputElement: HTMLInputElement | null;
    readonly actionButtonElement: HTMLElement | null;
    readonly cancelButtonElement: HTMLElement | null;
    private isSelectValid: boolean;
    readonly formControlElements: HTMLCollectionOf<HTMLInputElement> | null;

    constructor() {
        this.operation_id = parseInt(window.location.hash.split('/')[3]);
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
        if (!this.operation_id) {
            (window.location.href = '#/operations');
            return;
        }

        if (!this.pageTitleElement || !this.typeInputElement || !this.actionButtonElement
            || !this.formControlElements || !this.categoryInputElement || !this.cancelButtonElement) {
            (window.location.href = '#/');
            return;
        }
        this.pageTitleElement.innerText = 'Редактирование';
        this.actionButtonElement.innerText = 'Сохранить';

        await this.getOperation();
        if (this.operation) {
            await this.createCategoryList(this.operation.type, this.operation.category);
            this.fillInputsElement();
        } else {
            return;
        }

        for (const element of this.formControlElements) {
            element.addEventListener('change', () => this.validateField(element));
        }

        this.categoryInputElement.addEventListener('change', () => this.validateSelect());

        this.actionButtonElement.addEventListener('click', this.updateOperation.bind(this));
        this.cancelButtonElement.addEventListener('click', () => {
            window.location.href = '#/operations';
        });
    }

    private async getOperation(): Promise<void> {
        const operation: OperationsResponseType | null = await OperationsService.getOperation(this.operation_id);
        if (operation) {
            this.operation = operation;
        } else {
            window.location.href = '#/operations';
        }
    }

    private fillInputsElement(): void {
        if (this.operation && this.typeInputElement && this.amountInputElement && this.dateInputElement && this.commentInputElement) {
            let typeId;
            this.operation.type === 'income' ? typeId = 0 : this.operation.type === 'expense' ? typeId = 1 : typeId = -1;
            if (typeId > -1) this.typeInputElement.children[typeId].setAttribute('selected', 'selected');
            if (this.operation.amount) this.amountInputElement.value = this.operation.amount.toString();
            if (this.operation.date) this.dateInputElement.value = this.operation.date;
            if (this.operation.comment) this.commentInputElement.value = this.operation.comment;
        }
    }


    private async createCategoryList(type: string, activeCategory: string): Promise<void> {
        const categories: CategoriesResponseType[] | null = await CategoriesService.getCategories(type);
        if (categories) {
            categories.forEach((category: CategoriesResponseType) => {
                    if (this.categoryInputElement) {
                        const optionElement = document.createElement('option');
                        optionElement.classList.add('text-black');
                        if (category.title === activeCategory) {
                            this.categoryInputElement.style.color = 'black';

                            this.isSelectValid = true;
                            optionElement.setAttribute('selected', 'selected');
                        }
                        if (category.title) {
                            optionElement.innerText = category.title;
                        }
                        optionElement.value = category.id.toString();
                        this.categoryInputElement.appendChild(optionElement);
                    }
                }
            )
            ;
        }
    }

    private async updateOperation(): Promise<void> {
        if (this.validateForm()) {
            if (this.categoryInputElement && this.operation && this.amountInputElement
                && this.dateInputElement && this.commentInputElement) {
                const category_id: number = parseInt(this.categoryInputElement.value);

                const updateOperation: any = await OperationsService.updateOperation(this.operation_id, {
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