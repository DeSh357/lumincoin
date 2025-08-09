import {OperationsService} from "../services/operations-service";

export class Main {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-link');
        this.intervalInputs = document.querySelectorAll('input[type="date"]');
        this.intervalFilterElement = document.getElementById('interval-filter');

        this.chartsWrapperElement = document.getElementById('charts');
        this.noContentMessageElement = document.getElementById('no-content-message');
        this.activeFilter = this.filterButtons[0].getAttribute('data-filter');

        this.chart1Element = document.getElementById('chart1');
        this.chart2Element = document.getElementById('chart2');
        this.charts = {};

        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.filter.call(this, button).then();
            });
        });

        this.intervalInputs.forEach(input => {
            input.addEventListener('change', () => {
                const from = this.intervalInputs[0].value;
                const to = this.intervalInputs[1].value;
                if (from || to) {
                    this.activateButton(this.intervalFilterElement);
                }

                if (from && to) {
                    this.getOperations(true).then();
                }
            });
        });

        this.getOperations().then();
    }

    async filter(button) {
        if (this.activateButton(button)) {
            if (this.activeFilter === 'interval') {
                return;
            }

            this.intervalInputs.forEach(input => input.value = '');
            await this.getOperations();
        }
    }

    activateButton(button) {
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


    async getOperations(useInterval = false) {
        this.chartsWrapperElement.classList.add('disabled');

        let intervalString = '';
        if (useInterval) {
            const dateFrom = this.intervalInputs[0].value;
            const dateTo = this.intervalInputs[1].value;
            intervalString = `&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        }
        const filterString = `?period=${this.activeFilter}${intervalString}`;
        const operations = await OperationsService.getOperations(filterString);

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
                this.charts.expense.destroy()   ;
            }
        }
    }

    groupByCategory(operations, type) {
        const filtered = operations.filter(operation => operation.type === type);
        const grouped = {};

        filtered.forEach(operation => {
            const categoryName = operation.category?.trim() || 'Без категории';
            grouped[categoryName] = (grouped[categoryName] || 0) + operation.amount;
        });

        return {
            labels: Object.keys(grouped),
            data: Object.values(grouped)
        };
    }

    renderChart(key, chartElement, chartData, title) {
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
                        padding: {bottom: 30},
                        fullSize: true,
                    },
                }
            },
            plugins: [
                {
                    afterInit(chart) {
                        chart.legend._update = chart.legend.update;
                        chart.legend.update = function (...args) {
                            this._update(...args);
                            const padding = {...(this.options.padding || {})};
                            this.height += Math.max(0, ~~padding.bottom);
                        };
                    },
                },
            ],
        });
    }
}

