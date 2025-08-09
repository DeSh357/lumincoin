import {HttpUtils} from "../utils/http-utils";

export class OperationsService {
    static async getOperations(filter) {
        const result = await HttpUtils.request('/operations/' + filter);

        if (result.error || !result.response) {
            return false;
        }

        return result.response;
    }

    static async getOperation(page, id) {
        const result = await HttpUtils.request(`/operations/${id}`);

        if (result.error || !result.response) {
            return false;
        }

        return result.response;
    }

    static async updateOperation(page, id, data) {
        const result = await HttpUtils.request(`/operations/${id}`, 'PUT', true, data);

        if (result.error || !result.response) {
            return false;
        }

        return result.response;
    }

    static async createOperation(page, data) {
        const result = await HttpUtils.request(`/operations`, 'POST', true, data);

        if (!result.error && result.response || result.error && result.response.message === "This record already exists") {
            return result.response;
        }

        return false;
    }

    static async deleteOperation(page, id) {
        const result = await HttpUtils.request(`/operations/${id}`, 'DELETE', true);

        if (result.error || !result.response) {
            return false;
        }

        return result.response;
    }
}