function initChart(canvasId, bars, { support, resistance, profile }) {
    const ctx = document.getElementById(canvasId).getContext("2d");

    const chart = new Chart(ctx, {
        type: "candlestick",
        data: {
            datasets: [
                {
                    label: "Price",
                    data: bars.map(b => ({
                        x: new Date(b.Time),
                        o: b.Open, h: b.High, l: b.Low, c: b.Close
                    })),
                    barThickness: 4
                },
                {
                    label: "High",
                    type: "line",
                    data: bars.map(b => ({ x: new Date(b.Time), y: profile.HighPrice })),
                    borderColor: "blue", fill: false
                },
                {
                    label: "Low",
                    type: "line",
                    data: bars.map(b => ({ x: new Date(b.Time), y: profile.LowPrice })),
                    borderColor: "orange", fill: false
                },
                {
                    label: "POC",
                    type: "line",
                    data: bars.map(b => ({ x: new Date(b.Time), y: profile.PointOfControl })),
                    borderColor: "purple", fill: false
                }
            ]
        },
        options: {
            plugins: {
                tooltip: {
                    mode: 'nearest',
                    intersect: false,
                    position: 'nearest',
                    callbacks: {
                        label: function (context) {
                            const data = context.raw;
                            const datasetLabel = context.dataset.label;

                            if (data && data.o !== undefined) {
                                return [
                                    `Time: ${new Date(data.x).toLocaleString()}`,
                                    `Open: ${data.o}`,
                                    `High: ${data.h}`,
                                    `Low: ${data.l}`,
                                    `Close: ${data.c}`
                                ];
                            }

                            if (context.parsed && context.parsed.y !== undefined) {
                                return `${datasetLabel}: ${context.parsed.y}`;
                            }

                            return datasetLabel;
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        usePointStyle: true,
                        pointStyle: 'rect'
                    }
                },
                zoom: {
                    pan: { enabled: true, mode: 'x' },
                    zoom: {
                        wheel: { enabled: false },
                        pinch: { enabled: false },
                        drag: {
                            enabled: true,
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            borderColor: 'rgba(0, 0, 0, 0.3)',
                            borderWidth: 1
                        },
                        mode: 'x'
                    },
                    limits: { x: { minRange: 1 } },
                    onZoomComplete({ chart }) {
                        const minTime = chart.scales.x.min;
                        const maxTime = chart.scales.x.max;
                        const visibleBars = chart.data.datasets[0].data.filter(bar =>
                            new Date(bar.x) >= minTime && new Date(bar.x) <= maxTime
                        );
                        const highs = visibleBars.map(b => b.h);
                        const lows = visibleBars.map(b => b.l);
                        const highInRange = Math.max(...highs);
                        const lowInRange = Math.min(...lows);
                        const customSupport = lowInRange;
                        const customResistance = highInRange;

                        chart.data.datasets.push(
                            {
                                label: "Custom Support",
                                type: "line",
                                data: bars.map(b => ({ x: new Date(b.Time), y: customSupport })),
                                borderColor: "blue", borderWidth: 2, borderDash: [5, 5], fill: false
                            },
                            {
                                label: "Custom Resistance",
                                type: "line",
                                data: bars.map(b => ({ x: new Date(b.Time), y: customResistance })),
                                borderColor: "purple", borderWidth: 2, borderDash: [5, 5], fill: false
                            }
                        );

                        chart.update();
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'hour', displayFormats: { hour: 'HH:mm', day: 'MMM dd' } },
                    ticks: { autoSkip: true, maxRotation: 0, minRotation: 0, color: '#555', font: { size: 12, weight: 'bold' } },
                    grid: { color: 'rgba(200, 200, 200, 0.2)', drawTicks: true },
                    title: { display: true, text: 'Time', color: '#333', font: { size: 14, weight: 'bold' } }
                },
                y: {
                    beginAtZero: false,
                    ticks: { callback: value => value.toFixed(2), color: '#555', font: { size: 12, weight: 'bold' } },
                    grid: { color: 'rgba(200, 200, 200, 0.2)', borderColor: '#ccc', drawTicks: true },
                    title: { display: true, text: 'Price', color: '#333', font: { size: 14, weight: 'bold' } }
                }
            },
            onClick: (evt, elements, chart) => {
                if (elements.length && elements[0].datasetIndex > 0) {
                    openIndicatorSettings(chart.data.datasets[elements[0].datasetIndex].label);
                }
            }
        }
    });

    window.drawColor = '#ff0000';
    window.drawOpacity = 1.0;
}

function openIndicatorSettings(indicatorName) {
    const pane = document.getElementById("settingsPane");
    if (!pane) return;
    pane.style.display = "block";
    pane.querySelector(".title").innerText = indicatorName + " Settings";
}

function togglePencil() {
    const drawCanvas = document.getElementById("drawCanvas");
    drawCanvas.style.pointerEvents = document.getElementById("pencilToggle").checked ? "auto" : "none";
}

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("drawCanvas");
    const ctx = canvas.getContext("2d");
    let isDrawing = false;

    canvas.addEventListener("mousedown", function (e) {
        if (document.getElementById("pencilToggle").checked) {
            isDrawing = true;
            ctx.strokeStyle = hexToRgba(window.drawColor, window.drawOpacity);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        }
    });

    canvas.addEventListener("mousemove", function (e) {
        if (isDrawing) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    });

    canvas.addEventListener("mouseup", function () {
        isDrawing = false;
    });

    canvas.addEventListener("mouseleave", function () {
        isDrawing = false;
    });

    document.getElementById("colorPicker").addEventListener("input", function (e) {
        window.drawColor = e.target.value;
    });

    document.getElementById("opacitySlider").addEventListener("input", function (e) {
        window.drawOpacity = parseFloat(e.target.value);
    });
});

function hexToRgba(hex, opacity) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
}
