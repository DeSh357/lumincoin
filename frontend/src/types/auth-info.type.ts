import {TokenKeysType} from "./token-keys.type";

export type AuthInfoType = {
    [TokenKeysType.accessTokenKey]: string | null,
    [TokenKeysType.refreshTokenKey]: string | null,
    [TokenKeysType.userInfoKey]?: UserInfoType | null
}

export type UserInfoType = {
    id: string,
    name: string,
    lastName: string,
}