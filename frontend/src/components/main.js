export class Main {
    constructor() {
        this.loadCharts();
    }

    loadCharts() {
        const data = {
            type: 'pie',
            data:  {
                labels: [
                    'Red',
                    'Orange',
                    'Yellow',
                    'Green',
                    'Blue'
                ],
                datasets: [{
                    label: 'Диаграмма',
                    data: [1, 2, 3, 6, 5],
                    backgroundColor: [
                        'rgb(220, 53, 69)',
                        'rgb(253, 126, 20)',
                        'rgb(255, 193, 7)',
                        'rgb(32, 201, 151)',
                        'rgb(13, 110, 253)'
                    ],
                    hoverOffset: 3
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Доходы',
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
                },
                layout: {
                    // padding: 50
                }
            },
            plugins: [
                {
                    afterInit(chart) {
                        chart.legend._update = chart.legend.update;
                        chart.legend.update = function (...args) {
                            this._update(...args);
                            const padding = { ...(this.options.padding || {}) };
                            this.height += Math.max(0, ~~padding.bottom);
                        };
                    },
                },
            ],
        }
        const chart1Element = document.getElementById('chart1');
        const chart2Element = document.getElementById('chart2');

        new Chart(chart1Element, data);
        data.options.plugins.title.text = 'Расходы'
        new Chart(chart2Element, data);

    }
}

