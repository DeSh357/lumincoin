import config from "../config/config";
import {AuthInfoType, UserInfoType} from "../types/auth-info.type";
import {TokenKeysType} from "../types/token-keys.type";
import {RequestMethodType} from "../types/request-method.type";

export class AuthUtils {

    public static setAuthInfo(accessToken: string, refreshToken: string, userInfo: UserInfoType | null = null) {
        localStorage.setItem(TokenKeysType.accessTokenKey, accessToken);
        localStorage.setItem(TokenKeysType.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(TokenKeysType.userInfoKey, JSON.stringify(userInfo));
        }
    }

    static removeAuthInfo() {
        localStorage.removeItem(TokenKeysType.accessTokenKey);
        localStorage.removeItem(TokenKeysType.refreshTokenKey);
        localStorage.removeItem(TokenKeysType.userInfoKey);
    }

    public static getAuthInfo(key: TokenKeysType | null = null): string | null | AuthInfoType {
        if (key && [TokenKeysType.accessTokenKey, TokenKeysType.refreshTokenKey, TokenKeysType.userInfoKey].includes(key)) {
            if (key === TokenKeysType.userInfoKey) {
                const userInfo: string | null = localStorage.getItem(TokenKeysType.userInfoKey);
                if (userInfo) {
                    return JSON.parse(userInfo);
                }
            }
            return localStorage.getItem(key);
        } else {
            const userInfo: string | null = localStorage.getItem(TokenKeysType.userInfoKey);
            let userInfoParsed: UserInfoType;
            if (userInfo) {
                 userInfoParsed = JSON.parse(userInfo) as UserInfoType;
                return {
                    [TokenKeysType.accessTokenKey]: localStorage.getItem(TokenKeysType.accessTokenKey),
                    [TokenKeysType.refreshTokenKey]: localStorage.getItem(TokenKeysType.refreshTokenKey),
                    [TokenKeysType.userInfoKey]: userInfoParsed,
                }
            }
            return null;
        }
    }

    static async updateRefreshToken() {
        let result = false;
        const refreshToken = this.getAuthInfo(TokenKeysType.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.api + '/refresh', {
                method: RequestMethodType.POST,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken}),
            });
            if (response && response.status === 200) {
                const tokens = await response.json();
                if (tokens.tokens && !tokens.error) {
                    this.setAuthInfo(tokens.tokens.accessToken, tokens.tokens.refreshToken);
                    result = true;
                }
            }
        }

        if (!result) {
            this.removeAuthInfo();
        }

        return result;
    }
}
