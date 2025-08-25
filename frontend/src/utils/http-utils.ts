import config from "../config/config";
import {AuthUtils} from "./auth-utils";
import {RequestResultType} from "../types/request-result.type";
import {TokenKeysType} from "../types/token-keys.type";

export class HttpUtils {
    public static async request(url: string, method: string = 'GET', useAuth: boolean = true, body: any = null): Promise<RequestResultType> {
        const result = {
            error: false,
            response: null
        }


        const params: any = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }

        let token = null;
        if (useAuth) {
            token = AuthUtils.getAuthInfo(TokenKeysType.accessTokenKey);
            if (token) {
                params.headers['x-auth-token'] = token;
            }
        }

        if (body) {
            params.body = JSON.stringify(body)
        }

        let response = null;
        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (useAuth && response.status === 401) {
                if (!token) {
                    window.location.href = '#/login';
                } else {
                    const updateTokenResult = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        return this.request(url, method, useAuth, body);
                    } else {
                        window.location.href = '#/login';
                    }
                }
            }
        }

        return result;
    }
}