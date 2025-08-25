export type RequestParamsType = {
    method: "GET" | "POST" | "PUT" | "DELETE";
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-auth-token'?: string
    },
    body?: any
}