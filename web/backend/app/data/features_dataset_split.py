features_dataset_split =  {
      "name": "Dataset Split",
      "description": "Split audio, text, and image datasets for training machine learning models.",
      "features": [
        {
          "name": "Audio Dataset Split",
          "description": "Split audio files into segments for training machine learning models.",
          "sub_features_1": [
            {
              "name": "Split by Duration",
              "description": "Split audio into segments based on a specific duration (e.g., every 30 seconds)."
            },
            {
              "name": "Split by Number of Segments",
              "description": "Split audio into a specified number of segments."
            },
            {
              "name": "Split by Silence Detection",
              "description": "Automatically split audio based on detected silence."
            },
            {
              "name": "Balanced Audio Split",
              "description": "Split audio into training, validation, and test sets with balanced distribution."
            },
            {
              "name": "Batch Audio Split",
              "description": "Support batch processing to split multiple audio files at once."
            },
            {
              "name": "Advanced",
              "description": "Advanced features for customizing and exporting split datasets.",
              "sub_features_2": [
                {
                  "name": "Custom Split Ratios",
                  "description": "Allow users to define split ratios, such as 70% training, 20% validation, and 10% test."
                },
                {
                  "name": "Preview Split Results",
                  "description": "Display a preview of the dataset split before executing."
                },
                {
                  "name": "Export Split Dataset",
                  "description": "Support exporting split datasets into the desired format."
                },
                {
                  "name": "Balanced Data Split",
                  "description": "Ensure balanced data distribution, especially in terms of categories or labels."
                }
              ]
            }
          ]
        },
        {
          "name": "Text Dataset Split",
          "description": "Split text files into subsets for training NLP models.",
          "sub_features_1": [
            {
              "name": "Split by Sentence/Paragraph",
              "description": "Split text based on sentences or paragraphs for NLP model training."
            },
            {
              "name": "Split by Word Count",
              "description": "Split text based on a specified word count."
            },
            {
              "name": "Split by Character Count",
              "description": "Split text based on character count for training character-based models."
            },
            {
              "name": "Random Text Split",
              "description": "Randomly split the text dataset into training, validation, and test subsets."
            },
            {
              "name": "Stratified Text Split",
              "description": "Split text while maintaining the proportion of certain labels or categories."
            },
            {
              "name": "Split by Chapter/Section",
              "description": "For datasets like books or articles, split text based on natural divisions like chapters."
            },
            {
              "name": "Advanced",
              "description": "Advanced features for customizing and exporting split datasets.",
              "sub_features_2": [
                {
                  "name": "Custom Split Ratios",
                  "description": "Allow users to define custom split ratios."
                },
                {
                  "name": "Preview Split Results",
                  "description": "Display a preview of the dataset split before executing."
                },
                {
                  "name": "Export Split Dataset",
                  "description": "Export the split dataset to a preferred format."
                },
                {
                  "name": "Balanced Data Split",
                  "description": "Ensure balanced distribution across subsets."
                }
              ]
            }
          ]
        },
        {
          "name": "Image Dataset Split",
          "description": "Split image datasets for training machine learning models.",
          "sub_features_1": [
            {
              "name": "Split by Number of Images",
              "description": "Split image datasets based on the number of images per subset."
            },
            {
              "name": "Split by Image Size",
              "description": "Split images based on resolution or file size."
            },
            {
              "name": "Random Image Split",
              "description": "Randomly split image datasets into training, validation, and test subsets."
            },
            {
              "name": "Stratified Image Split",
              "description": "Split images based on existing labels while maintaining label proportions across subsets."
            },
            {
              "name": "Class-based Split",
              "description": "Split images based on existing classes, useful for object classification or detection."
            },
            {
              "name": "Aspect Ratio Split",
              "description": "Split images based on their aspect ratio (e.g., portrait vs. landscape)."
            },
            {
              "name": "Advanced",
              "description": "Advanced features for customizing and exporting split datasets.",
              "sub_features_2": [
                {
                  "name": "Custom Split Ratios",
                  "description": "Allow users to define custom split ratios."
                },
                {
                  "name": "Preview Split Results",
                  "description": "Display a preview of the dataset split before executing."
                },
                {
                  "name": "Export Split Dataset",
                  "description": "Export the split dataset to a preferred format."
                },
                {
                  "name": "Balanced Data Split",
                  "description": "Ensure balanced distribution across subsets."
                }
              ]
            }
          ]
        }
      ]
    }