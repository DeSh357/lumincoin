import {ValidationUtils} from "../utils/validation-utils";
import {AuthService} from "../services/auth-service";
import {AuthUtils} from "../utils/auth-utils";
import {FieldType} from "../types/field.type";

export class Signup {
    private emailElement: HTMLInputElement | null = null;
    private passwordElement: HTMLInputElement | null = null;
    private nameElement: HTMLInputElement | null = null;
    private lastNameElement: HTMLInputElement | null = null;
    private passwordRepeatElement: HTMLInputElement | null = null;

    readonly fields: FieldType[];

    constructor() {
        this.findElements();

        this.fields = [
            {element: this.nameElement, options: {pattern: /^[А-Я][а-я]+\s*$/}},
            {element: this.lastNameElement, options: {pattern: /^[А-Я][а-я]+\s*$/}},
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.passwordElement, options: {pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/}},
            {element: this.passwordRepeatElement, options: {compareTo: this.passwordElement?.value}},
        ];

        const processElement = document.getElementById("process");
        if (processElement) {
            processElement.addEventListener("click", this.signUp.bind(this));
        }

        this.fields.forEach(field => {
            field.element?.addEventListener("change", () => {
                if (field.element === this.passwordRepeatElement) {
                    if (field.options && this.passwordElement) {
                        field.options.compareTo = this.passwordElement.value;
                    }
                }
                ValidationUtils.validateField(field.element, field.options)
            });
        })
    }

    private findElements(): void {
        this.nameElement = document.getElementById("name") as HTMLInputElement;
        this.lastNameElement = document.getElementById("lastName") as HTMLInputElement;
        this.emailElement = document.getElementById("email") as HTMLInputElement;
        this.passwordElement = document.getElementById("password") as HTMLInputElement;
        this.passwordRepeatElement = document.getElementById("repeatPassword") as HTMLInputElement;
    }

    private async signUp(): Promise<void> {
        this.fields.forEach(field => {
            if (field.element === this.passwordRepeatElement) {
                if (field.options && this.passwordElement) {
                    field.options.compareTo = this.passwordElement.value;
                }
            }
        })
        if (ValidationUtils.validateForm(this.fields)) {
            if (!this.nameElement || !this.lastNameElement || !this.emailElement || !this.passwordElement || !this.passwordRepeatElement) return;
            const signupResult = await AuthService.signUp({
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value,
            });

            if (signupResult) {
                AuthUtils.setAuthInfo(signupResult.tokens.accessToken, signupResult.tokens.refreshToken, {
                    id: signupResult.user.id,
                    name: signupResult.user.name,
                    lastName: signupResult.user.lastName,
                });
                window.location.href = "#/";
            }
        } else {
            console.log('invalid');
        }
    }
}