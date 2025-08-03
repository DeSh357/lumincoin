import {ValidationUtils} from "../utils/validation-utils";
import {AuthService} from "../services/auth-service";
import {AuthUtils} from "../utils/auth-utils";

export class Login {
    constructor() {
        this.findElements();

        this.fields = [
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.passwordElement},
        ];

        document.getElementById("process").addEventListener("click", this.logIn.bind(this));
        this.fields.forEach(field => {
            field.element.addEventListener("change", ValidationUtils.validateField.bind(this, field.element, field.options));
        })
    }

    findElements() {
        this.emailElement = document.getElementById("email");
        this.passwordElement = document.getElementById("password");
    }

    async logIn() {
        if (ValidationUtils.validateForm(this.fields)) {
            const loginResult = await AuthService.logIn({
                email: this.emailElement.value,
                password: this.passwordElement.value,
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