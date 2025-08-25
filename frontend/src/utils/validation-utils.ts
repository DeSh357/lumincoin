import {FieldType, OptionType} from "../types/field.type";

export class ValidationUtils {
    public static validateForm(validations: FieldType[]): boolean {
        let isValid = true;
        for (let i = 0; i < validations.length; i++) {
            if (!this.validateField(validations[i].element, validations[i].options)) {
                isValid = false;
            }
        }
        return isValid;
    }

    public static validateField(element: HTMLInputElement | null, options?: OptionType | null): boolean {
        if (!element) return false;
        let condition: boolean = Boolean(element.value);
        if (options) {
            if (options.hasOwnProperty("pattern")) {
                condition = ValidationUtils.returnBoolean(element.value, options.pattern ? element.value.match(options.pattern) !== null : false);
            } else if (options.hasOwnProperty("compareTo")) {
                condition = ValidationUtils.returnBoolean(element.value, (element.value === options.compareTo));
            }  else if (options.hasOwnProperty("checked")) {
                condition = element.checked;
            }
        }
        if (condition) {
            element.classList.remove("is-invalid");
            return true;
        } else {
            element.classList.add("is-invalid");
            return false;
        }
    }

    private static returnBoolean(str: string, bool: boolean): boolean {
        if (str && bool) return bool;
        else return false;
    }
}