import {ValidationUtils} from "../utils/validation-utils";
import {AuthService} from "../services/auth-service";
import {AuthUtils} from "../utils/auth-utils";

export class Signup {
    constructor() {
        this.findElements();

        this.fields = [
            {element: this.nameElement, options: {pattern: /^[А-Я][а-я]+\s*$/}},
            {element: this.lastNameElement, options: {pattern: /^[А-Я][а-я]+\s*$/}},
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.passwordElement, options: {pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/}},
            {element: this.passwordRepeatElement, options: {compareTo: this.passwordElement.value}},
        ];

        document.getElementById("process").addEventListener("click", this.signUp.bind(this));

        this.fields.forEach(field => {
            field.element.addEventListener("change", () => {
                if (field.element === this.passwordRepeatElement) {
                    field.options.compareTo = this.passwordElement.value;
                }
                ValidationUtils.validateField(field.element, field.options)
            });
        })
    }

    findElements() {
        this.nameElement = document.getElementById("name");
        this.lastNameElement = document.getElementById("lastName");
        this.emailElement = document.getElementById("email");
        this.passwordElement = document.getElementById("password");
        this.passwordRepeatElement = document.getElementById("repeatPassword");
    }

    async signUp() {
        this.fields.forEach(field => {
            if (field.element === this.passwordRepeatElement) {
                field.options.compareTo = this.passwordElement.value;
            }
        })
        if (ValidationUtils.validateForm(this.fields)) {
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