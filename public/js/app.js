document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const regressionChart = document.getElementById('regressionChart');
    const fitLineBtn = document.getElementById('fit-line-btn');
    const resetBtn = document.getElementById('reset-btn');
    const predictBtn = document.getElementById('predict-btn');
    const loadSampleBtn = document.getElementById('load-sample-btn');
    const predictInput = document.getElementById('predict-input');
    const predictionValue = document.getElementById('prediction-value');
    const slopeElement = document.getElementById('slope');
    const interceptElement = document.getElementById('intercept');
    const rSquaredElement = document.getElementById('r-squared');
    const mseElement = document.getElementById('mse');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Step-by-step elements
    const calculationSteps = document.getElementById('calculation-steps');
    const stepExplanation = document.getElementById('step-explanation');
    const dataTableBody = document.getElementById('data-table-body');
    const dataTableFoot = document.getElementById('data-table-foot');
    const meansCalculation = document.getElementById('means-calculation');
    const slopeCalculation = document.getElementById('slope-calculation');
    const interceptCalculation = document.getElementById('intercept-calculation');
    const rSquaredCalculation = document.getElementById('r-squared-calculation');
    const finalModel = document.getElementById('final-model');

    // Initialize linear regression model
    const linearRegression = new LinearRegression();

    // Data for the chart
    const data = {
        datasets: [
            {
                label: 'Data Points',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                pointRadius: 6,
                pointHoverRadius: 8,
                showLine: false
            },
            {
                label: 'Regression Line',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                pointRadius: 0,
                showLine: true,
                fill: false
            },
            {
                label: 'Residuals',
                data: [],
                borderColor: 'rgba(255, 159, 64, 0.8)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderWidth: 1,
                borderDash: [5, 5],
                pointRadius: 0,
                showLine: true
            }
        ]
    };

    // Chart configuration
    const config = {
        type: 'scatter',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'X Values'
                    }
                },
                y: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Y Values'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.x !== null) {
                                label += `(${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
                            }
                            return label;
                        }
                    }
                },
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Linear Regression Plot'
                }
            },
            onClick: function(e) {
                const canvasPosition = Chart.helpers.getRelativePosition(e, chart);
                
                // Get the data value based on the click position
                const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
                const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
                
                // Add the point to the chart
                addDataPoint(dataX, dataY);
            }
        }
    };

    // Initialize the chart
    const chart = new Chart(regressionChart, config);

    // Tab functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to selected tab
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Add a data point to the chart
    function addDataPoint(x, y) {
        data.datasets[0].data.push({x, y});
        chart.update();
        
        // Clear residuals when adding new points
        data.datasets[2].data = [];
        
        // Clear previous calculations
        calculationSteps.classList.add('hidden');
        stepExplanation.classList.remove('hidden');
    }

    // Fit a line to the data
    function fitLine() {
        const dataPoints = data.datasets[0].data;
        
        if (dataPoints.length < 2) {
            alert('Please add at least 2 data points');
            return;
        }

        const xValues = dataPoints.map(point => point.x);
        const yValues = dataPoints.map(point => point.y);

        try {
            // Fit the model
            const result = linearRegression.fit(xValues, yValues);
            
            // Update line data
            const minX = Math.min(...xValues) - 1;
            const maxX = Math.max(...xValues) + 1;
            const lineData = linearRegression.getLineData(minX, maxX, 100);
            
            data.datasets[1].data = lineData.xLine.map((x, i) => ({
                x: x,
                y: lineData.yLine[i]
            }));
            
            // Update residuals visualization
            data.datasets[2].data = [];
            dataPoints.forEach((point, i) => {
                // Add vertical line from point to regression line
                const prediction = linearRegression.predict(point.x);
                data.datasets[2].data.push({x: point.x, y: point.y});
                data.datasets[2].data.push({x: point.x, y: prediction});
                data.datasets[2].data.push({x: null, y: null}); // Break the line
            });
            
            // Update display elements
            slopeElement.textContent = result.slope.toFixed(3);
            interceptElement.textContent = result.intercept.toFixed(3);
            rSquaredElement.textContent = result.rSquared.toFixed(3);
            mseElement.textContent = result.mse.toFixed(3);
            
            // Update step-by-step calculation
            updateCalculationSteps(result.calculationSteps);
            
            // Update chart
            chart.update();
        } catch (error) {
            console.error('Error fitting line:', error);
            alert(error.message);
        }
    }

    // Update the step-by-step calculation view
    function updateCalculationSteps(steps) {
        // Show calculation steps
        stepExplanation.classList.add('hidden');
        calculationSteps.classList.remove('hidden');

        // Update data table
        dataTableBody.innerHTML = '';
        dataTableFoot.innerHTML = '';
        
        let sumX = 0, sumY = 0, sumXSquared = 0, sumXY = 0;
        
        steps.dataTable.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.x.toFixed(2)}</td>
                <td>${row.y.toFixed(2)}</td>
                <td>${row.xSquared.toFixed(2)}</td>
                <td>${row.xy.toFixed(2)}</td>
            `;
            dataTableBody.appendChild(tr);
            
            sumX += row.x;
            sumY += row.y;
            sumXSquared += row.xSquared;
            sumXY += row.xy;
        });
        
        // Add sum row to table footer
        const trFooter = document.createElement('tr');
        trFooter.innerHTML = `
            <td>∑ = ${sumX.toFixed(2)}</td>
            <td>∑ = ${sumY.toFixed(2)}</td>
            <td>∑ = ${sumXSquared.toFixed(2)}</td>
            <td>∑ = ${sumXY.toFixed(2)}</td>
        `;
        dataTableFoot.appendChild(trFooter);
        
        // Update means calculation
        meansCalculation.innerHTML = `
            <p><strong>Mean of x (x̄):</strong> ∑x / n = ${sumX.toFixed(2)} / ${steps.dataTable.length} = ${steps.means.xMean.toFixed(4)}</p>
            <p><strong>Mean of y (ȳ):</strong> ∑y / n = ${sumY.toFixed(2)} / ${steps.dataTable.length} = ${steps.means.yMean.toFixed(4)}</p>
        `;
        
        // Update slope calculation
        slopeCalculation.innerHTML = `
            <p><strong>Formula:</strong> ${steps.slopeCalculation.formula}</p>
            <p><strong>Calculation:</strong> ${steps.slopeCalculation.calculation}</p>
            <p><strong>Numerator:</strong> ${steps.slopeCalculation.numerator.toFixed(4)}</p>
            <p><strong>Denominator:</strong> ${steps.slopeCalculation.denominator.toFixed(4)}</p>
            <p><strong>Result (m):</strong> ${steps.slopeCalculation.result.toFixed(4)}</p>
        `;
        
        // Update intercept calculation
        interceptCalculation.innerHTML = `
            <p><strong>Formula:</strong> ${steps.interceptCalculation.formula}</p>
            <p><strong>Calculation:</strong> ${steps.interceptCalculation.calculation}</p>
            <p><strong>Result (b):</strong> ${steps.interceptCalculation.result.toFixed(4)}</p>
        `;
        
        // Update R-squared and MSE calculation
        rSquaredCalculation.innerHTML = `
            <p><strong>R² Formula:</strong> ${steps.evaluationMetrics.rSquared.formula}</p>
            <p><strong>R² Calculation:</strong> ${steps.evaluationMetrics.rSquared.calculation}</p>
            <p><strong>R² Value:</strong> ${steps.evaluationMetrics.rSquared.result.toFixed(4)}</p>
            <p><strong>MSE Formula:</strong> ${steps.evaluationMetrics.mse.formula}</p>
            <p><strong>MSE Calculation:</strong> ${steps.evaluationMetrics.mse.calculation}</p>
            <p><strong>MSE Value:</strong> ${steps.evaluationMetrics.mse.result.toFixed(4)}</p>
        `;
        
        // Update final model
        finalModel.innerHTML = `
            <div class="equation">\\[y = ${linearRegression.slope.toFixed(4)}x + ${linearRegression.intercept.toFixed(4)}\\]</div>
            <p>With R² = ${linearRegression.rSquared.toFixed(4)} and MSE = ${linearRegression.mse.toFixed(4)}</p>
            <p>This means that for every unit increase in x, y increases by ${linearRegression.slope.toFixed(4)} units.</p>
            <p>The y-intercept is ${linearRegression.intercept.toFixed(4)}, which is the value of y when x = 0.</p>
            <p>The R² value indicates that approximately ${(linearRegression.rSquared * 100).toFixed(2)}% of the variance in y is explained by x.</p>
        `;
        
        // Trigger MathJax to reprocess the new content if available
        if (window.MathJax) {
            window.MathJax.typeset();
        }
    }

    // Reset all data
    function resetData() {
        data.datasets[0].data = [];
        data.datasets[1].data = [];
        data.datasets[2].data = [];
        
        slopeElement.textContent = '--';
        interceptElement.textContent = '--';
        rSquaredElement.textContent = '--';
        mseElement.textContent = '--';
        predictionValue.textContent = '--';
        predictInput.value = '';
        
        // Reset calculation steps
        calculationSteps.classList.add('hidden');
        stepExplanation.classList.remove('hidden');
        
        chart.update();
    }

    // Make prediction
    function makePrediction() {
        const xValue = parseFloat(predictInput.value);
        
        if (isNaN(xValue)) {
            alert('Please enter a valid number');
            return;
        }

        if (data.datasets[1].data.length === 0) {
            alert('Please fit a line before making predictions');
            return;
        }

        const prediction = linearRegression.predict(xValue);
        predictionValue.textContent = prediction.toFixed(3);
        
        // Send prediction request to server
        fetch('/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ x: xValue }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server prediction:', data.prediction);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    // Load sample data
    function loadSampleData() {
        fetch('/data/sample_data.json')
            .then(response => response.json())
            .then(jsonData => {
                if (jsonData && jsonData.dataPoints && jsonData.dataPoints.length > 0) {
                    // Clear existing data
                    resetData();
                    
                    // Add sample data points
                    jsonData.dataPoints.forEach(point => {
                        addDataPoint(point.x, point.y);
                    });
                    
                    // Automatically fit the line
                    fitLine();
                }
            })
            .catch(error => {
                console.error('Error loading sample data:', error);
                alert('Error loading sample data');
            });
    }

    // Event listeners
    fitLineBtn.addEventListener('click', fitLine);
    resetBtn.addEventListener('click', resetData);
    predictBtn.addEventListener('click', makePrediction);
    loadSampleBtn.addEventListener('click', loadSampleData);
});