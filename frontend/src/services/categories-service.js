import {HttpUtils} from "../utils/http-utils";

export class CategoriesService {
    static async getCategories(page) {
        const result = await HttpUtils.request('/categories/' + page);

        if (result.error || !result.response) {
            return false;
        }

        return result.response;
    }

    static async getCategory(page, id) {
        const result = await HttpUtils.request(`/categories/${page}/${id}`);

        if (result.error || !result.response) {
            return false;
        }

        return result.response;
    }

    static async updateCategory(page, id, data) {
        const result = await HttpUtils.request(`/categories/${page}/${id}`, 'PUT', true, data);

        if (result.error || !result.response) {
            return false;
        }

        return result.response;
    }

    static async createCategory(page, data) {
        const result = await HttpUtils.request(`/categories/${page}`, 'POST', true, data);

        if (!result.error && result.response || result.error && result.response.message === "This record already exists") {
            return result.response;
        }

        return false;
    }

    static async deleteCategory(page, id) {
        const result = await HttpUtils.request(`/categories/${page}/${id}`, 'DELETE', true);

        if (result.error || !result.response) {
            return false;
        }

        return result.response;
    }
}