import {HttpUtils} from "../utils/http-utils";
import {AuthUtils} from "../utils/auth-utils";

export class AuthService {
    static async logIn(data) {
        const result = await HttpUtils.request('/login', 'POST', false, data);

        if (result.error || !result.response || !result.response.tokens || !result.response.user.lastName || !result.response.user.id || !result.response.user.name) {
            return false;
        }

        return result.response;
    }

    static async signUp(data) {
        const signup = await HttpUtils.request('/signup', 'POST', false, data);

        if (signup.error || !signup.response || !signup.response.user.lastName || !signup.response.user.id || !signup.response.user.email) {
            return false;
        }

        const result = await AuthService.logIn({
            email: data.email,
            password: data.password,
        });

        if (result) {
            return result;
        }

        return false;
    }

    static async logOut(data) {
        await HttpUtils.request('/logout', 'POST', false, data);
    }
}