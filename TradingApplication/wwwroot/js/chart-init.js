function initChart(canvasId, bars, { support, resistance, profile }) {
    console.log("Bars data received in initChart:", bars);

    // Transform raw bar data
    //const transformedBars = bars.map(b => ({
    //    x: new Date(b.Time), // Ensure the property is 'Time', not 'time'
    //    o: b.Open,
    //    h: b.High,
    //    l: b.Low,
    //    c: b.Close
    //}));
    const transformedBars = bars.slice(-200).map(b => ({
        x: new Date(b.Time),
        o: b.Open,
        h: b.High,
        l: b.Low,
        c: b.Close
    }));

    console.log("Transformed bars:", transformedBars);

    const ctx = document.getElementById(canvasId).getContext("2d");

    new Chart(ctx, {
        type: "candlestick",
        data: {
            datasets: [
                {
                    label: "Price",
                    data: transformedBars
                },
                {
                    label: "Support",
                    type: "line",
                    data: transformedBars.map(b => ({ x: b.x, y: support })),
                    borderColor: "green",
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: "Resistance",
                    type: "line",
                    data: transformedBars.map(b => ({ x: b.x, y: resistance })),
                    borderColor: "red",
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: "High",
                    type: "line",
                    data: transformedBars.map(b => ({ x: b.x, y: profile.HighPrice })),
                    borderColor: "blue",
                    fill: false
                },
                {
                    label: "Low",
                    type: "line",
                    data: transformedBars.map(b => ({ x: b.x, y: profile.LowPrice })),
                    borderColor: "blue",
                    fill: false
                },
                {
                    label: "POC",
                    type: "line",
                    data: transformedBars.map(b => ({ x: b.x, y: profile.PointOfControl })),
                    borderColor: "purple",
                    fill: false
                },
                {
                    label: "VAH",
                    type: "line",
                    data: transformedBars.map(b => ({ x: b.x, y: profile.ValueAreaHigh })),
                    borderColor: "orange",
                    fill: false
                },
                {
                    label: "VAL",
                    type: "line",
                    data: transformedBars.map(b => ({ x: b.x, y: profile.ValueAreaLow })),
                    borderColor: "orange",
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: "time",
                    time: {
                        unit: "minute",
                        tooltipFormat: "yyyy-MM-dd HH:mm" 
                    },
                    title: {
                        display: true,
                        text: "Time"
                    }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: "Price"
                    }
                }
            },
            plugins: {
                tooltip: {
                    mode: "nearest",
                    intersect: false,
                    position: "nearest"
                },
                legend: {
                    display: true
                }
            },
            onClick: (evt, elements, chart) => {
                if (elements.length && elements[0].datasetIndex > 0) {
                    openIndicatorSettings(chart.data.datasets[elements[0].datasetIndex].label);
                }
            }
        }
    });
}

function openIndicatorSettings(indicatorName) {
    const pane = document.getElementById("settingsPane");
    if (!pane) return;
    pane.style.display = "block";
    pane.querySelector(".title").innerText = indicatorName + " Settings";
}
