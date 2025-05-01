# Linear Regression Web Application

This web application demonstrates linear regression visualization and prediction. It allows users to interactively add data points, fit a regression line, and make predictions.

## Features

- Interactive data point creation by clicking on the chart
- Linear regression model implementation from scratch
- Real-time calculation of slope, intercept, and R² score
- Visualization of the regression line
- Prediction functionality for new x values
- Responsive design
- Step-by-step calculations with detailed mathematical explanations

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Visualization: Chart.js
- Math utilities: Math.js, MathJax
- Backend: Node.js with Express

## Getting Started

### Prerequisites

- Node.js (v12 or higher)
- npm (v6 or higher)

### Running Locally

#### Option 1: Clone from GitHub

1. Clone this repository:
   ```
   git clone https://github.com/venugopal-adep/linear-regression-demo-app.git
   cd linear-regression
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

#### Option 2: Download as ZIP

1. Download the ZIP file from the GitHub repository
2. Extract the contents to a folder of your choice
3. Open a terminal/command prompt and navigate to the extracted folder
4. Install dependencies:
   ```
   npm install
   ```
5. Start the server:
   ```
   npm start
   ```
6. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## How to Use

1. **Add Data Points**: Click anywhere on the chart to add data points
2. **Fit Regression Line**: Click the "Fit Line" button to calculate and display the regression line
3. **View Model Parameters**: See the slope, intercept, and R² score in the model info section
4. **Make Predictions**: Enter an x-value and click "Make Prediction" to predict the corresponding y-value
5. **Reset**: Click the "Reset Data" button to clear all data points and the regression line
6. **Mathematical Intuition**: Switch to the "Mathematical Intuition" tab to understand the theory behind linear regression
7. **Step-by-Step Calculations**: Use the "Step-by-Step" tab to see the detailed calculations for your data

## Implementation Details

The linear regression is implemented using the Ordinary Least Squares (OLS) method:

- Slope (m) calculation: Minimizes the sum of squared residuals
- Intercept (b) calculation: b = y_mean - m * x_mean
- R² score: Coefficient of determination showing the proportion of variance explained

## Deployment

This application can be deployed to various free hosting platforms. See the "Deployment Options" section below for details.

## Deployment Options

### Free Hosting Services

Here are several free platforms where you can host this application:

#### 1. Render

[Render](https://render.com/) offers a free tier for web services:

1. Sign up for an account at render.com
2. Create a new Web Service
3. Connect to your GitHub repository
4. Use the following settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variable: PORT = 10000 (or any port provided by Render)

#### 2. Heroku

[Heroku](https://www.heroku.com/) provides a free tier with limitations:

1. Sign up for a Heroku account
2. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
3. Log in to Heroku: `heroku login`
4. Create a new Heroku app: `heroku create your-app-name`
5. Create a `Procfile` in your project root with the content: `web: node src/server.js`
6. Deploy to Heroku:
   ```
   git push heroku main
   ```

#### 3. Glitch

[Glitch](https://glitch.com/) is an easy platform for hosting and collaboration:

1. Create account at glitch.com
2. Create a new project
3. Import from GitHub or upload your files
4. The app will automatically deploy

#### 4. Netlify + Serverless Functions

[Netlify](https://www.netlify.com/) is primarily for static sites but can host this app with serverless functions:

1. Sign up for Netlify
2. Create a `netlify.toml` file in your project root:
   ```
   [build]
     command = "npm install"
     functions = "netlify/functions"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```
3. Create a serverless function in `netlify/functions/server.js`
4. Modify your server code to work as a serverless function
5. Connect your GitHub repository to Netlify

#### 5. GitHub Pages + Serverless API

For a static-only version:

1. Modify the app to work without backend API calls or use a serverless API
2. Deploy the static files to GitHub Pages using GitHub Actions

### Preparing for Deployment

1. Add a `.env` file to your project and load environment variables:
   ```javascript
   // Add to the top of server.js
   if (process.env.NODE_ENV !== 'production') {
     require('dotenv').config();
   }
   ```

2. Update port configuration in server.js:
   ```javascript
   const PORT = process.env.PORT || 3000;
   ```

3. Add the following line to your package.json (if not already there):
   ```json
   "engines": {
     "node": "14.x"
   }
   ```

4. Create a `.gitignore` file to exclude node_modules:
   ```
   node_modules
   .env
   npm-debug.log
   .DS_Store
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
