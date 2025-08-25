import {HttpUtils} from "../utils/http-utils";
import {RequestResultType} from "../types/request-result.type";
import {OperationsResponseType} from "../types/operations-response.type";
import {OperationsDeleteResponseType} from "../types/operations-delete-response.type";
import {OperationsRequestType} from "../types/operations-request.type";
import {RequestMethodType} from "../types/request-method.type";

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

        return result.response as OperationsResponseType;
    }

    public static async updateOperation(id: number, data: OperationsRequestType): Promise<OperationsResponseType | null> {
        const result = await HttpUtils.request(`/operations/${id}`, RequestMethodType.PUT, true, data);

        if (result.error || !result.response) {
            return null;
        }

        return result.response as OperationsResponseType;
    }

    public static async createOperation(data: OperationsRequestType): Promise<OperationsResponseType | null> {
        const result = await HttpUtils.request('/operations', RequestMethodType.POST, true, data);

        if (!result.error && result.response || result.error && result.response.message === "This record already exists") {
            return result.response as OperationsResponseType;
        }

        return null;
    }

    public static async deleteOperation(id: number): Promise<OperationsDeleteResponseType | null> {
        const result = await HttpUtils.request(`/operations/${id}`, RequestMethodType.DELETE, true);

        if (result.error || !result.response) {
            return null;
        }

        return result.response as OperationsDeleteResponseType;
    }
}