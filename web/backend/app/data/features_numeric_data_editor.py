features_numeric_data_editor =     {
      "name": "Numeric Data Editor",
      "description": "Editor for performing basic and advanced numeric data processing and analysis.",
      "features": [
        {
          "name": "Basic Numeric Operations",
          "description": "Basic operations such as summation, average, min/max, standard deviation, and variance.",
          "sub_features_1": [
            {
              "name": "Summation",
              "description": "Calculate the sum of numeric data."
            },
            {
              "name": "Average",
              "description": "Calculate the average of numeric data."
            },
            {
              "name": "Min/Max",
              "description": "Determine the minimum and maximum values in the data."
            },
            {
              "name": "Standard Deviation and Variance",
              "description": "Calculate standard deviation and variance to understand the spread of data."
            }
          ]
        },
        {
          "name": "Sorting and Filtering",
          "description": "Sort and filter data based on custom criteria.",
          "sub_features_1": [
            {
              "name": "Sort",
              "description": "Sort the numeric data in ascending or descending order."
            },
            {
              "name": "Filter",
              "description": "Filter data based on custom conditions or thresholds."
            }
          ]
        },
        {
          "name": "Normalization and Scaling",
          "description": "Transform numeric data through normalization and standardization.",
          "sub_features_1": [
            {
              "name": "Normalization",
              "description": "Normalize the range of numeric data to a standard range."
            },
            {
              "name": "Standardization",
              "description": "Scale data to have mean=0 and standard deviation=1."
            }
          ]
        },
        {
          "name": "Data Aggregation",
          "description": "Sum, mean, count operations on grouped or categorized data.",
          "sub_features_1": [
            {
              "name": "Grouped Aggregation",
              "description": "Aggregate data based on groups or categories."
            },
            {
              "name": "Multiple Metrics Aggregation",
              "description": "Perform aggregation using multiple metrics like sum, count, and mean."
            }
          ]
        },
        {
          "name": "Outlier Detection",
          "description": "Detect and remove outliers using Z-score and IQR methods.",
          "sub_features_1": [
            {
              "name": "Z-score Method",
              "description": "Detect outliers using Z-score method."
            },
            {
              "name": "IQR Method",
              "description": "Detect and remove outliers using the Interquartile Range (IQR) method."
            },
            {
              "name": "Robust Outlier Detection",
              "description": "Use robust techniques like Tukey's Fences to identify outliers."
            }
          ]
        },
        {
          "name": "Advanced Numeric Operations",
          "description": "Advanced operations such as cumulative sum, moving averages, and weighted aggregation.",
          "sub_features_1": [
            {
              "name": "Cumulative Sum/Mean",
              "description": "Calculate cumulative sum or mean of the data."
            },
            {
              "name": "Moving Averages",
              "description": "Calculate moving averages for time series data."
            },
            {
              "name": "Rolling Statistics",
              "description": "Calculate rolling mean, standard deviation, and other statistics."
            },
            {
              "name": "Exponentially Weighted Moving Average (EWMA)",
              "description": "Apply EWMA for time series data to give more weight to recent values."
            },
            {
              "name": "Percentage Change",
              "description": "Calculate the percentage change between consecutive rows."
            }
          ]
        },
        {
          "name": "Data Transformation",
          "description": "Apply various data transformations such as log, square root, and inverse transformations.",
          "sub_features_1": [
            {
              "name": "Log Transformation",
              "description": "Apply logarithmic transformation to normalize skewed data."
            },
            {
              "name": "Box-Cox Transformation",
              "description": "Apply Box-Cox transformation to stabilize variance."
            },
            {
              "name": "Square Root Transformation",
              "description": "Reduce the range of data using square root transformation."
            },
            {
              "name": "Inverse Transformation",
              "description": "Apply inverse transformation (1/x) to reduce the effect of extreme outliers."
            }
          ]
        },
        {
          "name": "Exploratory Data Analysis (EDA)",
          "description": "Analyze and visualize data using summary statistics, distributions, and correlation analysis.",
          "sub_features_1": [
            {
              "name": "Summary Statistics",
              "description": "Calculate descriptive statistics such as mean, median, mode, standard deviation, variance, etc."
            },
            {
              "name": "Distribution Analysis",
              "description": "Visualize data distributions using Histogram, Box Plot, Density Plot, and Violin Plot."
            },
            {
              "name": "Correlation Analysis",
              "description": "Analyze correlations using Correlation Matrix and Heatmap."
            },
            {
              "name": "Outlier Detection",
              "description": "Detect outliers using methods like Z-score and IQR."
            },
            {
              "name": "Feature Importance",
              "description": "Analyze feature importance using tree-based methods or PCA (Principal Component Analysis)."
            }
          ]
        },
        {
          "name": "Time Series Analysis",
          "description": "Perform time series analysis including decomposition, autocorrelation, and forecasting.",
          "sub_features_1": [
            {
              "name": "Autocorrelation Analysis",
              "description": "Measure the correlation of time series data with its past values (lags)."
            },
            {
              "name": "Stationarity Tests",
              "description": "Test for stationarity in time series data using ADF or KPSS tests."
            },
            {
              "name": "Seasonal Decomposition",
              "description": "Decompose time series into trend, seasonal, and residual components."
            },
            {
              "name": "Lag Features",
              "description": "Create lag features to use past values in time series models."
            },
            {
              "name": "Forecasting with ARIMA/Prophet",
              "description": "Use ARIMA or Prophet models for forecasting time series data."
            }
          ]
        },
        {
          "name": "Categorical Data Operations",
          "description": "Convert and encode categorical data for numeric analysis.",
          "sub_features_1": [
            {
              "name": "One-Hot Encoding",
              "description": "Convert categorical variables into binary format."
            },
            {
              "name": "Label Encoding",
              "description": "Convert categorical values into numeric labels."
            },
            {
              "name": "Frequency Encoding",
              "description": "Encode categories based on the frequency of occurrence."
            },
            {
              "name": "Target Encoding",
              "description": "Encode categories based on the mean target value for each category."
            }
          ]
        },
        {
          "name": "Feature Engineering",
          "description": "Create new features and select important ones for analysis.",
          "sub_features_1": [
            {
              "name": "Polynomial Features",
              "description": "Create polynomial features from existing ones (x, x^2, x^3, etc.)."
            },
            {
              "name": "Interaction Features",
              "description": "Create interaction terms between different features (e.g., x1 * x2)."
            },
            {
              "name": "Binning/Discretization",
              "description": "Group numeric data into bins or categories."
            },
            {
              "name": "Feature Selection Methods",
              "description": "Use methods like Recursive Feature Elimination (RFE) or SelectKBest to select important features."
            }
          ]
        },
        {
          "name": "Advanced Visualization",
          "description": "Create advanced visualizations for numeric and categorical data.",
          "sub_features_1": [
            {
              "name": "Pairwise Correlation Plot",
              "description": "Display pairwise correlations between numeric variables."
            },
            {
              "name": "Violin Plot",
              "description": "Combine box plot and density plot to visualize data distribution."
            },
            {
              "name": "Joint Plot",
              "description": "Visualize the relationship between two variables along with their distributions."
            },
            {
              "name": "Facet Grid",
              "description": "Display subsets of data in a grid for multivariate analysis."
            }
          ]
        },
        {
          "name": "Additional Statistical Analysis",
          "description": "Perform advanced statistical analysis such as ANOVA, T-Test, and Chi-Square Test.",
          "sub_features_1": [
            {
              "name": "ANOVA (Analysis of Variance)",
              "description": "Test the difference between means across multiple groups."
            },
            {
              "name": "T-Test",
              "description": "Test the difference in means between two groups."
            },
            {
              "name": "Chi-Square Test",
              "description": "Test the relationship between two categorical variables."
            }
          ]
        }
      ]
    }