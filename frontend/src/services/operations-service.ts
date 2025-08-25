import {HttpUtils} from "../utils/http-utils";
import {RequestResultType} from "../types/request-result.type";
import {OperationsResponseType} from "../types/operations-response.type";

export class OperationsService {
    public static async getOperations(filter: string): Promise<OperationsResponseType[] | null> {
        const result: RequestResultType = await HttpUtils.request('/operations/' + filter);

        if (result.error || !result.response) {
            return null;
        }

        return result.response as OperationsResponseType[];
    }

    public static async getOperation(id: number): Promise<OperationsResponseType | null> {
        const result = await HttpUtils.request(`/operations/${id}`);

        if (result.error || !result.response) {
            return null;
        }

        return result.response;
    }

    public static async updateOperation(id: number, data: any): Promise<any> {
        const result = await HttpUtils.request(`/operations/${id}`, 'PUT', true, data);

        if (result.error || !result.response) {
            return null;
        }

        return result.response;
    }

    public static async createOperation(data: any) {
        const result = await HttpUtils.request('/operations', 'POST', true, data);

        if (!result.error && result.response || result.error && result.response.message === "This record already exists") {
            return result.response;
        }

        return null;
    }

    public static async deleteOperation(id: number): Promise<any> {
        const result = await HttpUtils.request(`/operations/${id}`, 'DELETE', true);

        if (result.error || !result.response) {
            return null;
        }

        return result.response;
    }
}