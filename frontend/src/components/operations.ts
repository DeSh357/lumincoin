import {OperationsService} from "../services/operations-service";
import {BalanceService} from "../services/balance-service";
import {BalanceUtils} from "../utils/balance-utils";
import {OperationsResponseType} from "../types/operations-response.type";
import bootstrap = require("bootstrap");
import {BalanceType} from "../types/balance.type";

export class Operations {
    private filterButtons: NodeListOf<HTMLElement>;
    private intervalInputs: NodeListOf<HTMLInputElement>;
    readonly intervalFilterElement: HTMLElement | null;
    readonly tableWrapperElement: HTMLElement | null;
    readonly operationsTableElement: HTMLElement | null;
    readonly noContentMessageElement: HTMLElement | null;
    private activeFilter: string | null;

    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-link');
        this.intervalInputs = document.querySelectorAll('input[type="date"]');
        this.intervalFilterElement = document.getElementById('interval-filter');
        this.operationsTableElement = document.getElementById('operations-table');
        this.tableWrapperElement = document.getElementById('table-wrapper');
        this.noContentMessageElement = document.getElementById('no-content-message');
        this.activeFilter = this.filterButtons[0].getAttribute('data-filter');

        this.showOperations().then();

        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.filter.call(this, button).then();
            });
        });

        this.intervalInputs.forEach((input: HTMLElement) => {
            input.addEventListener('change', () => {
                const from: string = this.intervalInputs[0].value;
                const to: string = this.intervalInputs[1].value;
                if (from || to) {
                    if (this.intervalFilterElement) {
                        this.activateButton(this.intervalFilterElement);
                    }
                }

                if (from && to) {
                    this.showOperations(true).then();
                }
            });
        });

        this.deleteProcess();
    }

    private async filter(button: HTMLElement): Promise<void> {
        if (this.activateButton(button)) {
            if (this.activeFilter === 'interval') {
                return;
            }

            this.intervalInputs.forEach(input => input.value = '');
            await this.showOperations();
        }
    }

    private activateButton(button: HTMLElement): boolean {
        if (button.classList.contains('active')) {
            return false;
        }
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active', 'bg-secondary');
            btn.classList.add('border', 'text-secondary', 'border-secondary');
        });

        button.classList.add('active', 'bg-secondary');
        button.classList.remove('border', 'text-secondary', 'border-secondary');
        this.activeFilter = button.getAttribute('data-filter');
        return true;
    }

    private async showOperations(useInterval = false): Promise<void> {
        if (!this.tableWrapperElement || !this.operationsTableElement) return;
        this.operationsTableElement.innerHTML = '';
        this.tableWrapperElement.style.display = 'none';

        let intervalString: string = '';
        if (useInterval) {
            const dateFrom: string = this.intervalInputs[0].value;
            const dateTo: string = this.intervalInputs[1].value;
            intervalString = `&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        }
        const filterString: string = `?period=${this.activeFilter}${intervalString}`;
        const operations: OperationsResponseType[] | null = await OperationsService.getOperations(filterString);

        if (this.noContentMessageElement) {
            if (operations && operations.length > 0) {
                this.noContentMessageElement.classList.add('d-none');
                this.tableWrapperElement.style.display = 'block';
                operations.sort((a, b) => a.id - b.id);
                operations.forEach(operation => {
                    this.operationsTableElement?.appendChild(this.createTrElement(operation));
                })
            } else {
                this.noContentMessageElement.classList.remove('d-none');
            }
        }
    }

    private createTrElement(operation: OperationsResponseType): HTMLTableRowElement {
        const trElement: HTMLTableRowElement = document.createElement('tr');
        const thElement: HTMLTableCellElement = document.createElement('th');
        thElement.classList.add('text-center');
        thElement.setAttribute('scope', 'row');
        thElement.innerText = operation.id.toString();
        const tdElement1: HTMLTableCellElement = document.createElement('td');
        switch (operation.type) {
            case 'income': {
                tdElement1.innerText = 'доход';
                tdElement1.classList.add('text-success');
                break;
            }
            case 'expense': {
                tdElement1.innerText = 'расход';
                tdElement1.classList.add('text-danger');
                break
            }
            default: {
                tdElement1.innerText = '-';
            }
        }
        const tdElement2: HTMLTableCellElement = document.createElement('td');
        tdElement2.innerText = operation.category ? operation.category : '-';
        const tdElement3: HTMLTableCellElement = document.createElement('td');
        tdElement3.innerText = operation.amount ? operation.amount + '$' : '-';
        const tdElement4: HTMLTableCellElement = document.createElement('td');
        tdElement4.innerText = operation.date ? operation.date.replaceAll('-', '.') : '-';
        const tdElement5: HTMLTableCellElement = document.createElement('td');
        tdElement5.innerText = operation.comment ? operation.comment : '-';

        trElement.appendChild(thElement);
        trElement.appendChild(tdElement1);
        trElement.appendChild(tdElement2);
        trElement.appendChild(tdElement3);
        trElement.appendChild(tdElement4);
        trElement.appendChild(tdElement5);
        trElement.insertAdjacentHTML('beforeend', `<td class="px-0"><div class="d-flex gap-2 justify-content-end"><a href="#" data-bs-target="#modal" data-bs-toggle="modal" data-id="${operation.id}"><svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 5.5C4.77614 5.5 5 5.72386 5 6V12C5 12.2761 4.77614 12.5 4.5 12.5C4.22386 12.5 4 12.2761 4 12V6C4 5.72386 4.22386 5.5 4.5 5.5Z" fill="black"/><path d="M7 5.5C7.27614 5.5 7.5 5.72386 7.5 6V12C7.5 12.2761 7.27614 12.5 7 12.5C6.72386 12.5 6.5 12.2761 6.5 12V6C6.5 5.72386 6.72386 5.5 7 5.5Z" fill="black"/><path d="M10 6C10 5.72386 9.77614 5.5 9.5 5.5C9.22386 5.5 9 5.72386 9 6V12C9 12.2761 9.22386 12.5 9.5 12.5C9.77614 12.5 10 12.2761 10 12V6Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 3C13.5 3.55228 13.0523 4 12.5 4H12V13C12 14.1046 11.1046 15 10 15H4C2.89543 15 2 14.1046 2 13V4H1.5C0.947715 4 0.5 3.55228 0.5 3V2C0.5 1.44772 0.947715 1 1.5 1H5C5 0.447715 5.44772 0 6 0H8C8.55229 0 9 0.447715 9 1H12.5C13.0523 1 13.5 1.44772 13.5 2V3ZM3.11803 4L3 4.05902V13C3 13.5523 3.44772 14 4 14H10C10.5523 14 11 13.5523 11 13V4.05902L10.882 4H3.11803ZM1.5 3V2H12.5V3H1.5Z" fill="black"/></svg></a><a href="#/operations/update/${operation.id}"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500001 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z" fill="black"/></svg></a></div></td>`)
        return trElement;
    }

    private deleteProcess(): void {
        let categoryIdToDelete: number | null = null;

        const modal: HTMLElement | null = document.getElementById('modal');
        modal?.addEventListener('show.bs.modal', function(event) {
            const e = event as CustomEvent & { relatedTarget: HTMLElement };
            const button: HTMLElement = e.relatedTarget;
            categoryIdToDelete = parseInt(button.getAttribute('data-id')!);
        });

        const confirmDeleteElement: HTMLElement | null = document.getElementById('confirmDeleteBtn');
        if (confirmDeleteElement) {
            const that: Operations = this;
            confirmDeleteElement.addEventListener('click', async function () {
                if (!categoryIdToDelete) return;
                const categoryIdElement: HTMLElement | null =  document.querySelector(`[data-id="${categoryIdToDelete}"]`);
                let categoryCard: HTMLElement | null = null;
                if (categoryIdElement) {
                    categoryCard = categoryIdElement.closest('tr');
                }
                if (categoryCard) categoryCard.remove();

                const deleteResult: any = await OperationsService.deleteOperation(categoryIdToDelete);

                if (deleteResult) {
                    const modalInstance: bootstrap.Modal | null = bootstrap.Modal.getInstance(modal as Element);
                    const activeElement: Element | null = document.activeElement;
                    if (activeElement) {
                        (activeElement as HTMLElement).blur();
                    }
                    if (modalInstance) {
                        modalInstance.hide();
                    }

                    categoryIdToDelete = null;

                    that.showOperations().then();
                    const newBalance: BalanceType | null = await BalanceService.getBalance();
                    if (newBalance) {
                        BalanceUtils.showBalance(newBalance);
                    }
                } else {
                    alert('Не удалось удалить категорию. Пожалуйста, обратитесь в поддержку');
                }
            }.bind(this));
        }
    }
}