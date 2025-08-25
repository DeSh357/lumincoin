import {ValidationUtils} from "../utils/validation-utils";
import {AuthService} from "../services/auth-service";
import {AuthUtils} from "../utils/auth-utils";
import {FieldType} from "../types/field.type";

export class Login {
    private emailElement: HTMLInputElement | null = null;
    private passwordElement: HTMLInputElement | null = null;
    private checkElement: HTMLInputElement | null = null;
    readonly fields: FieldType[];

    constructor() {
        this.findElements();

        this.fields = [
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.passwordElement},
        ];

        const processElement = document.getElementById("process");
        if (processElement) {
            processElement.addEventListener("click", this.logIn.bind(this));
        }
        this.fields.forEach(field => {
            field.element?.addEventListener("change", ValidationUtils.validateField.bind(this, field.element, field.options));
        })
    }

    private findElements(): void {
        this.emailElement = document.getElementById("email") as HTMLInputElement;
        this.passwordElement = document.getElementById("password") as HTMLInputElement;
        this.checkElement = document.getElementById("check") as HTMLInputElement;
    }

    private async logIn(): Promise<void> {
        if (ValidationUtils.validateForm(this.fields)) {
            const loginResult = await AuthService.logIn({
                email: this.emailElement?.value,
                password: this.passwordElement?.value,
                rememberMe: this.checkElement?.checked,
            });
            if (loginResult) {
                AuthUtils.setAuthInfo(loginResult.tokens.accessToken, loginResult.tokens.refreshToken, {
                    id: loginResult.user.id,
                    name: loginResult.user.name,
                    lastName: loginResult.user.lastName,
                });
                window.location.href = "#/";
            }
        } else {
            console.log('invalid');
        }
    }
}