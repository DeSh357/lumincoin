import {HttpUtils} from "../utils/http-utils";
import {RequestResultType} from "../types/request-result.type";
import {CategoriesResponseType} from "../types/categories-response.type";

export class CategoriesService {
    static async getCategories(page: string): Promise<CategoriesResponseType[] | null> {
        const result: RequestResultType = await HttpUtils.request('/categories/' + page);

        if (result.error || !result.response) {
            return null;
        }

        return result.response;
    }

    public static async getCategory(page: string, id: number): Promise<CategoriesResponseType | null> {
        const result: RequestResultType = await HttpUtils.request(`/categories/${page}/${id}`);

        if (result.error || !result.response) {
            return null;
        }

        return result.response;
    }

    public static async updateCategory(page: string, id: number, data: any): Promise<any> {
        const result: RequestResultType = await HttpUtils.request(`/categories/${page}/${id}`, 'PUT', true, data);

        if (result.error || !result.response) {
            return null;
        }

        return result.response;
    }

    public static async createCategory(page: string, data: any): Promise<any> {
        const result: RequestResultType = await HttpUtils.request(`/categories/${page}`, 'POST', true, data);

        if (!result.error && result.response || result.error && result.response.message === "This record already exists") {
            return result.response;
        }

        return null;
    }

    public static async deleteCategory(page: string, id: number): Promise<any> {
        const result: RequestResultType = await HttpUtils.request(`/categories/${page}/${id}`, 'DELETE', true);

        if (result.error || !result.response) {
            return null;
        }

        return result.response;
    }
}