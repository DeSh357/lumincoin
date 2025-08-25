import {OperationsService} from "../services/operations-service";
import {Chart, Plugin} from "chart.js/auto";
import {OperationsResponseType} from "../types/operations-response.type";
import {ChartDataType} from "../types/chart-data.type";

export class Main {
    private filterButtons: NodeListOf<HTMLElement>;
    private intervalInputs: NodeListOf<HTMLInputElement>;
    readonly intervalFilterElement: HTMLElement | null;
    readonly chartsWrapperElement: HTMLElement | null;
    readonly noContentMessageElement: HTMLElement | null;
    private activeFilter: string | null;
    private incomeData: ChartDataType | null = null;
    private expenseData: ChartDataType | null = null;

    readonly chart1Element: HTMLCanvasElement | null;
    readonly chart2Element: HTMLCanvasElement | null;

    readonly charts: Record<string, Chart<"pie", number[], string>>;


    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-link');
        this.intervalInputs = document.querySelectorAll('input[type="date"]');
        this.intervalFilterElement = document.getElementById('interval-filter');

        this.chartsWrapperElement = document.getElementById('charts');
        this.noContentMessageElement = document.getElementById('no-content-message');
        this.activeFilter = this.filterButtons[0].getAttribute('data-filter');

        this.chart1Element = document.getElementById('chart1') as HTMLCanvasElement;
        this.chart2Element = document.getElementById('chart2') as HTMLCanvasElement;
        this.charts = {};

        this.filterButtons.forEach((button: HTMLElement) => {
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
                    this.getOperations(true).then();
                }
            });
        });

        this.getOperations().then();
    }

    private async filter(button: HTMLElement): Promise<void> {
        if (this.activateButton(button)) {
            if (this.activeFilter === 'interval') {
                return;
            }

            this.intervalInputs.forEach(input => input.value = '');
            await this.getOperations();
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


    private async getOperations(useInterval = false): Promise<void> {
        if (!this.chartsWrapperElement || !this.chart1Element || !this.chart2Element) return;
        this.chartsWrapperElement.classList.add('disabled');

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
                this.chartsWrapperElement.classList.remove('disabled');
                this.incomeData = this.groupByCategory(operations, 'income');
                this.expenseData = this.groupByCategory(operations, 'expense');
                this.renderChart('income', this.chart1Element, this.incomeData, 'Доходы');
                this.renderChart('expense', this.chart2Element, this.expenseData, 'Расходы');
            } else {
                this.noContentMessageElement.classList.remove('d-none');
                if (this.charts.hasOwnProperty('income') || this.charts.hasOwnProperty('expense')) {
                    this.charts.income.destroy();
                    this.charts.expense.destroy();
                }
            }
        }
    }

    groupByCategory(operations: OperationsResponseType[], type: 'income' | 'expense'): ChartDataType {
        const filtered: OperationsResponseType[] = operations.filter(operation => operation.type === type);
        const grouped: Record<string, number> = {};

        filtered.forEach(operation => {
            const categoryName: string = operation.category?.trim() || 'Без категории';
            grouped[categoryName] = (grouped[categoryName] || 0) + operation.amount;
        });

        return {
            labels: Object.keys(grouped),
            data: Object.values(grouped)
        };
    }

    private renderChart(key: 'income' | 'expense', chartElement: HTMLCanvasElement, chartData: ChartDataType, title: string): void {
        const legendPaddingPlugin: Plugin<"pie"> = {
            id: "legendPaddingPlugin",
            afterInit(chart) {
                const legend: any = chart.legend;
                if (!legend) return;

                legend._update = legend.update;
                legend.update = function (...args: any[]) {
                    this._update(...args);
                    const padding = { ...(this.options.padding || {}) };
                    this.height += Math.max(0, ~~padding.bottom);
                };
            },
        };

        if (this.charts[key]) {
            this.charts[key].destroy();
        }

        this.charts[key] = new Chart(chartElement, {
            type: 'pie',
            data: {
                labels: chartData.labels,
                datasets: [{
                    data: chartData.data,
                    hoverOffset: 3
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: title,
                        font: {
                            size: 28
                        },
                        padding: {
                            bottom: 10,
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 30,
                        },
                        fullSize: true,
                    },
                }
            },
            plugins: [legendPaddingPlugin],
        });
    }


}

