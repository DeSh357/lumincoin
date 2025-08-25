import {CategoriesService} from "../services/categories-service";
import {CategoriesResponseType} from "../types/categories-response.type";

export class CategoryCreate {
    readonly page: string;
    readonly typeElement: HTMLElement | null;
    readonly inputElement: HTMLInputElement | null;
    readonly createButtonElement: HTMLElement | null;
    readonly cancelButtonElement: HTMLLinkElement | null;

    constructor(page: string) {
        this.page = page;
        this.typeElement = document.getElementById("type");
        this.inputElement = document.getElementById('categoryTitle') as HTMLInputElement;
        this.createButtonElement = document.getElementById("createButton");
        this.cancelButtonElement = document.getElementById("cancelButton") as HTMLLinkElement;

        this.init().then();
    }

    private async init(): Promise<void> {
        if (!this.typeElement || !this.cancelButtonElement || !this.inputElement || !this.createButtonElement) {
            window.location.href = '#/'
            return
        }
        if (this.page === 'expense') {
            this.typeElement.innerText = 'расходов';
        } else if (this.page === 'income') {
            this.typeElement.innerText = 'доходов';
        } else {
            window.location.href = '#/'
        }

        this.inputElement.addEventListener('change', this.validateFill.bind(this));
        this.createButtonElement.addEventListener('click', this.createCategory.bind(this));
        const that: CategoryCreate = this;
        this.cancelButtonElement.addEventListener('click',function() {
            window.location.href = `#/${that.page}`;
        });
    }

    private async createCategory(): Promise<void> {
        if (!this.inputElement) return;
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
            return;
        }
    }

    validateFill() {
        if (this.inputElement) {
            if (!this.inputElement.value) {
                this.inputElement.classList.add('is-invalid');
            } else {
                this.inputElement.classList.remove('is-invalid');
            }
        }
    }
}