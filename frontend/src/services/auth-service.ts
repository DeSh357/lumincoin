import {HttpUtils} from "../utils/http-utils";
import {RequestResultType} from "../types/request-result.type";
import {SignupType} from "../types/signup.type";
import {LoginType} from "../types/login.type";
import {RequestMethodType} from "../types/request-method.type";

export class AuthService {
    static async logIn(data: LoginType) {
        const result: RequestResultType = await HttpUtils.request('/login', RequestMethodType.POST, false, data);

        if (result.error || !result.response || !result.response.tokens || !result.response.user.lastName || !result.response.user.id || !result.response.user.name) {
            return false;
        }

        return result.response;
    }

    static async signUp(data: SignupType) {
        const signup: RequestResultType = await HttpUtils.request('/signup', RequestMethodType.POST, false, data);

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

    public static async logOut(data: { refreshToken: string }): Promise<void> {
        await HttpUtils.request('/logout', RequestMethodType.POST, false, data);
    }
}