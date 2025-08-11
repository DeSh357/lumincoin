export class BalanceUtils {
    static showBalance(balance) {
        if (balance) {
            const userBalanceElement =  document.getElementById('userBalance');
            if (userBalanceElement && parseInt(userBalanceElement.innerText) !== balance.balance) {
                userBalanceElement.innerText = balance.balance;
            }
        }
    }
}