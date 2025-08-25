import {BalanceUtils} from "../utils/balance-utils";
import {BalanceService} from "../services/balance-service";
import {BalanceType} from "../types/balance.type";
import bootstrap = require("bootstrap");

export class Layout {
    readonly balanceInput: HTMLInputElement | null;
    readonly updateBalanceButton: HTMLElement | null;
    readonly modalLayout: HTMLElement | null;
    private oldBalance: BalanceType | null = null;

    constructor() {
        this.balanceInput = document.getElementById("balance-input") as HTMLInputElement;
        this.updateBalanceButton = document.getElementById("updateBalanceButton");
        this.modalLayout = document.getElementById("modalLayout");

        if (this.modalLayout && this.updateBalanceButton) {
            this.modalLayout.addEventListener('show.bs.modal', this.fillInputModal.bind(this));
            this.updateBalanceButton.addEventListener('click', this.updateBalance.bind(this));
        }

    }

    private async fillInputModal(): Promise<void> {
        this.oldBalance = await BalanceService.getBalance();
        if (this.oldBalance && this.balanceInput) {
            this.balanceInput.value = this.oldBalance.balance.toString();
        }
    }

    private async updateBalance(): Promise<void> {
        if (!this.balanceInput || !this.oldBalance) return;
        const newBalance: number = parseInt(this.balanceInput.value);
        if (this.oldBalance.balance !== newBalance) {
            const response: BalanceType | null = await BalanceService.updateBalance({
                newBalance: newBalance,
            })
            if (response) {
                BalanceUtils.showBalance(response);
            }
        }

        const modalInstance: bootstrap.Modal | null = bootstrap.Modal.getInstance(this.modalLayout as Element);
        const activeElement: Element | null = document.activeElement;
        if (activeElement) {
            (activeElement as HTMLElement).blur();
        }
        if (modalInstance) {
            modalInstance.hide();
        }
    }
}