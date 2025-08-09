import config from "../config/config";

export class AuthUtils {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';

    static setAuthInfo(accessToken, refreshToken, userInfo = null) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
        }
    }

    static removeAuthInfo(accessToken, refreshToken, userInfo) {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoKey);
    }

    static getAuthInfo(key = null) {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoKey].includes(key)) {
            if (key === this.userInfoKey) {
                return JSON.parse(localStorage.getItem(this.userInfoKey));
            }
            return localStorage.getItem(key);
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoKey]: JSON.parse(localStorage.getItem(this.userInfoKey)),
            }
        }
    }

    static async updateRefreshToken() {
        let result = false;
        const refreshToken = this.getAuthInfo(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.api + '/refresh', {
                method: 'POST',
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
