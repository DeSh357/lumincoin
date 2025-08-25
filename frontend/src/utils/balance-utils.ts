import {BalanceType} from "../types/balance.type";

export class BalanceUtils {
    public static showBalance(balance: BalanceType) {
        if (balance) {
            const userBalanceElement =  document.getElementById('userBalance');
            if (userBalanceElement && parseInt(userBalanceElement.innerText) !== balance.balance) {
                userBalanceElement.innerText = balance.balance.toString();
            }
        }
    }
}