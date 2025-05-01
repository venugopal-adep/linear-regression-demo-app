/**
 * Linear Regression Implementation with Detailed Calculations
 */
class LinearRegression {
    constructor() {
        this.slope = 0;
        this.intercept = 0;
        this.rSquared = 0;
        this.mse = 0;
        this.calculationSteps = {};
    }

    /**
     * Fit the linear regression model to the data
     * @param {Array} xValues - Array of x values
     * @param {Array} yValues - Array of y values
     * @returns {Object} - Object containing model parameters and calculation steps
     */
    fit(xValues, yValues) {
        if (xValues.length !== yValues.length || xValues.length < 2) {
            throw new Error('Input arrays must have the same length and at least 2 data points');
        }

        // Reset calculation steps
        this.calculationSteps = {
            dataTable: [],
            sums: {},
            means: {},
            slopeCalculation: {},
            interceptCalculation: {},
            evaluationMetrics: {}
        };

        // Calculate sums and create data table
        const n = xValues.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumXSquared = 0, sumYSquared = 0;

        for (let i = 0; i < n; i++) {
            const x = xValues[i];
            const y = yValues[i];
            const xSquared = x * x;
            const xy = x * y;

            sumX += x;
            sumY += y;
            sumXY += xy;
            sumXSquared += xSquared;
            sumYSquared += y * y;

            // Store each data point calculation for display
            this.calculationSteps.dataTable.push({
                x, 
                y, 
                xSquared, 
                xy
            });
        }

        // Store sums
        this.calculationSteps.sums = {
            n,
            sumX,
            sumY,
            sumXY,
            sumXSquared
        };

        // Calculate means
        const xMean = sumX / n;
        const yMean = sumY / n;

        // Store means
        this.calculationSteps.means = {
            xMean,
            yMean
        };

        // Calculate slope
        // Using formula: m = (n * sumXY - sumX * sumY) / (n * sumXSquared - sumX^2)
        const numerator = n * sumXY - sumX * sumY;
        const denominator = n * sumXSquared - sumX * sumX;
        this.slope = denominator !== 0 ? numerator / denominator : 0;

        // Store slope calculation details
        this.calculationSteps.slopeCalculation = {
            formula: "m = (n × ∑xy - ∑x × ∑y) / (n × ∑x² - (∑x)²)",
            numerator,
            denominator,
            calculation: `(${n} × ${sumXY.toFixed(2)} - ${sumX.toFixed(2)} × ${sumY.toFixed(2)}) / (${n} × ${sumXSquared.toFixed(2)} - ${sumX.toFixed(2)}²)`,
            result: this.slope
        };

        // Calculate intercept (b)
        // Using formula: b = (sumY - m * sumX) / n
        this.intercept = (sumY - this.slope * sumX) / n;

        // Store intercept calculation details
        this.calculationSteps.interceptCalculation = {
            formula: "b = (∑y - m × ∑x) / n",
            calculation: `(${sumY.toFixed(2)} - ${this.slope.toFixed(4)} × ${sumX.toFixed(2)}) / ${n}`,
            result: this.intercept
        };

        // Calculate predictions and residuals
        const predictions = [];
        let ssResidual = 0;
        let ssTotal = 0;

        for (let i = 0; i < n; i++) {
            const x = xValues[i];
            const y = yValues[i];
            const prediction = this.predict(x);
            predictions.push(prediction);

            // Sum of squared residuals (actual - predicted)^2
            const residual = y - prediction;
            const squaredResidual = residual * residual;
            ssResidual += squaredResidual;

            // Sum of squared total (actual - mean)^2
            const deviation = y - yMean;
            const squaredDeviation = deviation * deviation;
            ssTotal += squaredDeviation;

            // Add to data table
            this.calculationSteps.dataTable[i].yPredicted = prediction;
            this.calculationSteps.dataTable[i].residual = residual;
            this.calculationSteps.dataTable[i].squaredResidual = squaredResidual;
            this.calculationSteps.dataTable[i].squaredDeviation = squaredDeviation;
        }

        // Calculate R-squared: 1 - (SSresidual / SStotal)
        this.rSquared = ssTotal !== 0 ? 1 - (ssResidual / ssTotal) : 0;

        // Calculate MSE (Mean Squared Error): SSresidual / n
        this.mse = ssResidual / n;

        // Store evaluation calculation details
        this.calculationSteps.evaluationMetrics = {
            ssResidual,
            ssTotal,
            rSquared: {
                formula: "R² = 1 - (SSresidual / SStotal)",
                calculation: `1 - (${ssResidual.toFixed(4)} / ${ssTotal.toFixed(4)})`,
                result: this.rSquared
            },
            mse: {
                formula: "MSE = SSresidual / n",
                calculation: `${ssResidual.toFixed(4)} / ${n}`,
                result: this.mse
            }
        };

        return {
            slope: this.slope,
            intercept: this.intercept,
            rSquared: this.rSquared,
            mse: this.mse,
            calculationSteps: this.calculationSteps
        };
    }

    /**
     * Predict y value for a given x value
     * @param {number} x - The x value to make a prediction for
     * @returns {number} - The predicted y value
     */
    predict(x) {
        return this.slope * x + this.intercept;
    }

    /**
     * Get the line data for plotting
     * @param {number} minX - Minimum x value
     * @param {number} maxX - Maximum x value
     * @param {number} steps - Number of points to generate for the line (optional)
     * @returns {Object} - Object with x and y arrays for the line
     */
    getLineData(minX, maxX, steps = 2) {
        const xLine = [];
        const step = (maxX - minX) / (steps - 1);
        for (let i = 0; i < steps; i++) {
            xLine.push(minX + i * step);
        }
        const yLine = xLine.map(x => this.predict(x));
        return { xLine, yLine };
    }

    /**
     * Get the model parameters
     * @returns {Object} - Object containing slope, intercept, R-squared and MSE
     */
    getParameters() {
        return {
            slope: this.slope,
            intercept: this.intercept,
            rSquared: this.rSquared,
            mse: this.mse
        };
    }

    /**
     * Get the detailed calculation steps
     * @returns {Object} - Object containing all calculation steps
     */
    getCalculationSteps() {
        return this.calculationSteps;
    }

    /**
     * Get confidence interval for the regression line
     * @param {Array} xValues - Array of x values used for fitting
     * @param {Array} yValues - Array of y values used for fitting
     * @param {number} xPred - X value for prediction
     * @param {number} confidenceLevel - Confidence level (default: 0.95)
     * @returns {Object} - Lower and upper confidence bounds
     */
    getPredictionInterval(xValues, yValues, xPred, confidenceLevel = 0.95) {
        // This is a simplified implementation
        const n = xValues.length;
        if (n < 3) return { lower: null, upper: null };

        const yPred = this.predict(xPred);
        const tValue = this._getTValue(n - 2, confidenceLevel);
        
        // Calculate standard error of prediction
        const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
        let sumSquaredErrors = 0;
        for (let i = 0; i < n; i++) {
            const yPredicted = this.predict(xValues[i]);
            sumSquaredErrors += Math.pow(yValues[i] - yPredicted, 2);
        }
        
        const se = Math.sqrt(sumSquaredErrors / (n - 2));
        const seOfPrediction = se * Math.sqrt(1 + 1/n + 
            (Math.pow(xPred - xMean, 2) / 
             xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0)));
        
        return {
            lower: yPred - tValue * seOfPrediction,
            upper: yPred + tValue * seOfPrediction
        };
    }

    /**
     * Get t-value for a given degrees of freedom and confidence level
     * This is a simplified version that uses approximations
     * @param {number} df - Degrees of freedom
     * @param {number} confidenceLevel - Confidence level
     * @returns {number} - Approximate t-value
     */
    _getTValue(df, confidenceLevel) {
        // This is a simplified implementation using approximations
        // For a proper implementation, we would use a t-distribution table or more complex calculation
        const alpha = 1 - confidenceLevel;
        
        // Simple approximation for t-value
        if (df <= 1) return 12.71;
        if (df <= 2) return 4.30;
        if (df <= 5) return 2.57;
        if (df <= 10) return 2.23;
        if (df <= 20) return 2.09;
        if (df <= 30) return 2.04;
        if (df <= 60) return 2.00;
        return 1.96; // Approximation for large df
    }
}