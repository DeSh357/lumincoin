import {HttpUtils} from "../utils/http-utils";
import {RequestResultType} from "../types/request-result.type";
import {BalanceType} from "../types/balance.type";

export class BalanceService {
    static async getBalance(): Promise<BalanceType | null> {
        const result: RequestResultType = await HttpUtils.request('/balance');

        if (result.error || !result.response) {
            return null;
        }

        return result.response;
    }

    static async updateBalance(data: {newBalance: number}): Promise<BalanceType | null> {
        const result = await HttpUtils.request('/balance', 'PUT', true, data);

        if (result.error || !result.response) {
            return null;
        }

        return result.response;
    }
}