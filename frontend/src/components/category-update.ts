import {CategoriesService} from "../services/categories-service";
import {CategoriesResponseType} from "../types/categories-response.type";

export class CategoryUpdate {
    readonly page: string;
    readonly typeElement: HTMLElement | null;
    readonly inputElement: HTMLInputElement | null;
    readonly updateButtonElement: HTMLElement | null;
    readonly cancelButtonElement: HTMLLinkElement | null;
    readonly categoryId: number;
    private categoryInfo: CategoriesResponseType | null = null;

    constructor(page: string) {
        this.page = page;
        this.typeElement = document.getElementById("type");
        this.inputElement = document.getElementById('categoryTitle') as HTMLInputElement;
        this.updateButtonElement = document.getElementById("updateButton");
        this.cancelButtonElement = document.getElementById("cancelButton") as HTMLLinkElement;
        this.categoryId = parseInt(window.location.hash.split('/')[3]);

        this.init().then();
    }

    private async init(): Promise<void> {
        if (!this.typeElement || !this.cancelButtonElement || !this.inputElement || !this.updateButtonElement) {
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

        this.cancelButtonElement.href = `#/${this.page}`;

        this.categoryInfo = await CategoriesService.getCategory(this.page, this.categoryId);
        if (this.categoryInfo) {
            this.inputElement.value = this.categoryInfo.title ? this.categoryInfo.title : '';
        }
        this.inputElement.addEventListener('change', this.validateFill.bind(this));
        this.updateButtonElement.addEventListener('click', this.updateCategory.bind(this));
        const that: CategoryUpdate = this;
        this.cancelButtonElement.addEventListener('click',function() {
            window.location.href = `#/${that.page}`;
        });
    }

    private async updateCategory(): Promise<void> {
        if (!this.inputElement || !this.categoryInfo) return;
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
            return;
        }
    }

    private validateFill(): void {
        if (this.inputElement) {
            if (!this.inputElement.value) {
                this.inputElement.classList.add('is-invalid');
            } else {
                this.inputElement.classList.remove('is-invalid');
            }
        }
    }
}