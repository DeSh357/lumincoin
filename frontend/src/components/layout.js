import {BalanceUtils} from "../utils/balance-utils";
import {BalanceService} from "../services/balance-service";

export class Layout {
    constructor() {
        this.balanceInput = document.getElementById("balance-input");
        this.updateBalanceButton = document.getElementById("updateBalanceButton");
        this.modalLayout = document.getElementById("modalLayout");

        this.modalLayout.addEventListener('show.bs.modal', this.fillInputModal.bind(this));
        this.updateBalanceButton.addEventListener('click', this.updateBalance.bind(this));

    }

    async fillInputModal() {
        this.oldBalance = await BalanceService.getBalance();
        this.balanceInput.value = this.oldBalance.balance;
    }

    async updateBalance() {
        const newBalance = parseInt(this.balanceInput.value);
        if (this.oldBalance.balance !== newBalance) {
            const response = await BalanceService.updateBalance({
                newBalance: newBalance,
            })
            if (response) {
                BalanceUtils.showBalance(response);
            }
        }
        const modalInstance = bootstrap.Modal.getInstance(this.modalLayout);
        document.activeElement.blur();
        modalInstance.hide();

    }
}