import {HttpUtils} from "../utils/http-utils";
import {RequestResultType} from "../types/request-result.type";
import {CategoriesResponseType} from "../types/categories-response.type";
import {CategoriesRequestType} from "../types/categories-request.type";
import {CategoriesDeleteType} from "../types/categories-delete.type";
import {RequestMethodType} from "../types/request-method.type";

export class CategoriesService {
    static async getCategories(page: string): Promise<CategoriesResponseType[] | null> {
        const result: RequestResultType = await HttpUtils.request('/categories/' + page);

        if (result.error || !result.response) {
            return null;
        }

        return result.response as CategoriesResponseType[];
    }

    public static async getCategory(page: string, id: number): Promise<CategoriesResponseType | null> {
        const result: RequestResultType = await HttpUtils.request(`/categories/${page}/${id}`);

        if (result.error || !result.response) {
            return null;
        }

        return result.response as CategoriesResponseType;
    }

    public static async updateCategory(page: string, id: number, data: CategoriesRequestType): Promise<CategoriesResponseType | null> {
        const result: RequestResultType = await HttpUtils.request(`/categories/${page}/${id}`, RequestMethodType.PUT, true, data);

        if (result.error || !result.response) {
            return null;
        }

        return result.response as CategoriesResponseType;
    }

    public static async createCategory(page: string, data: CategoriesRequestType): Promise<CategoriesResponseType | null> {
        const result: RequestResultType = await HttpUtils.request(`/categories/${page}`, RequestMethodType.POST, true, data);

        if (!result.error && result.response || result.error && result.response.message === "This record already exists") {
            return result.response as CategoriesResponseType;
        }

        return null;
    }

    public static async deleteCategory(page: string, id: number): Promise<CategoriesDeleteType | null> {
        const result: RequestResultType = await HttpUtils.request(`/categories/${page}/${id}`, RequestMethodType.DELETE, true);

        if (result.error || !result.response) {
            return null;
        }

        return result.response as CategoriesDeleteType;
    }
}