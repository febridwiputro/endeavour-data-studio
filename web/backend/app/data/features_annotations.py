features_annotations = {
      "name": "Annotations",
      "description": "Various features to annotate and label data using computer vision techniques, including object detection, segmentation, and face recognition.",
      "features": [
        {
          "name": "Computer Vision",
          "description": "Computer vision-based annotation features for labeling and processing images and videos.",
          "sub_features_1": [
            {
              "name": "Basic Annotations",
              "description": "Basic techniques for image segmentation, object detection, and labeling.",
              "sub_features_2": [
                {
                  "name": "Semantic Segmentation",
                  "description": "Label segments within an image using various annotation techniques.",
                  "sub_features_3": [
                    {
                      "name": "Polygons",
                      "description": "Mark areas in images using polygons to define specific segments."
                    },
                    {
                      "name": "Masks",
                      "description": "Use masks to isolate and mark regions of an image."
                    },
                    {
                      "name": "Freehand Segmentation",
                      "description": "Annotate complex areas using freehand tools like brushes."
                    },
                    {
                      "name": "Boundary Box Refinement",
                      "description": "Manually refine object boundaries using edge detection algorithms."
                    },
                    {
                      "name": "Multi-class Segmentation",
                      "description": "Support for multi-class segmentation where a single image can have different object classes."
                    }
                  ]
                },
                {
                  "name": "Object Detection",
                  "description": "Detect objects in images and label them with bounding boxes.",
                  "sub_features_3": [
                    {
                      "name": "Bounding Boxes",
                      "description": "Mark objects in images using rectangular bounding boxes."
                    },
                    {
                      "name": "3D Bounding Boxes",
                      "description": "Annotate objects using 3D bounding boxes for 3D images or lidar."
                    },
                    {
                      "name": "Confidence Scoring",
                      "description": "Add confidence scores to detected objects."
                    },
                    {
                      "name": "Instance Segmentation",
                      "description": "Individually segment objects within the same class."
                    },
                    {
                      "name": "Occlusion Detection",
                      "description": "Annotate parts of objects that are occluded by other objects."
                    }
                  ]
                },
                {
                  "name": "Keypoint Labeling",
                  "description": "Label important points on objects or humans for pose estimation and tracking.",
                  "sub_features_3": [
                    {
                      "name": "Human Pose Estimation",
                      "description": "Label keypoints on the human body for pose estimation."
                    },
                    {
                      "name": "Facial Keypoint Detection",
                      "description": "Label keypoints on facial features such as eyes, nose, and lips."
                    },
                    {
                      "name": "Object Keypoints",
                      "description": "Label keypoints on non-human objects such as vehicles or tools."
                    },
                    {
                      "name": "Skeleton Tracking",
                      "description": "Track the skeleton or structure of humans or objects in motion."
                    }
                  ]
                },
                {
                  "name": "Image Captioning",
                  "description": "Add descriptions and tags to images for context and classification.",
                  "sub_features_3": [
                    {
                      "name": "Automatic Caption Generation",
                      "description": "Automatically generate captions based on trained models."
                    },
                    {
                      "name": "Manual Captioning",
                      "description": "Manually add descriptions or tags to images."
                    },
                    {
                      "name": "Tagging",
                      "description": "Add relevant tags based on the visual content of images."
                    }
                  ]
                },
                {
                  "name": "Image Classification",
                  "description": "Classify images using multiple classes or labels.",
                  "sub_features_3": [
                    {
                      "name": "Multi-class Classification",
                      "description": "Classify a single image with multiple class labels."
                    },
                    {
                      "name": "Multi-label Classification",
                      "description": "Assign multiple labels that are not mutually exclusive to images."
                    },
                    {
                      "name": "Confidence-Based Labeling",
                      "description": "Add confidence scores to the classification of objects in images."
                    }
                  ]
                }
              ]
            },
            {
              "name": "Advanced Cases",
              "description": "More advanced use cases and techniques for annotation in computer vision.",
              "sub_features_2": [
                {
                  "name": "3D Image Annotation",
                  "description": "Annotation techniques specifically for 3D images and data.",
                  "sub_features_3": [
                    {
                      "name": "3D Object Detection",
                      "description": "Annotate and detect objects in 3D images or lidar data."
                    },
                    {
                      "name": "LiDAR Data Annotation",
                      "description": "Annotate LiDAR data with bounding boxes or segmentation."
                    },
                    {
                      "name": "Point Cloud Labeling",
                      "description": "Label points in point cloud data."
                    }
                  ]
                },
                {
                  "name": "Anomaly Detection in Images",
                  "description": "Detect anomalies or defects in images.",
                  "sub_features_3": [
                    {
                      "name": "Defect Detection",
                      "description": "Mark defects or anomalies in product images."
                    },
                    {
                      "name": "Outlier Identification",
                      "description": "Identify outliers in images or image sets."
                    },
                    {
                      "name": "Image Quality Assessment",
                      "description": "Evaluate the quality of images for issues like blur or distortion."
                    }
                  ]
                },
                {
                  "name": "Panoptic Segmentation",
                  "description": "Annotate all objects in an image with both instance and semantic segmentation.",
                  "sub_features_3": [
                    {
                      "name": "Unified Segmentation",
                      "description": "Combine both instance and semantic segmentation for full image annotation."
                    }
                  ]
                },
                {
                  "name": "Action Recognition",
                  "description": "Detect and annotate actions in images or video frames.",
                  "sub_features_3": [
                    {
                      "name": "Action Detection in Images",
                      "description": "Mark areas where specific actions are detected in images."
                    },
                    {
                      "name": "Action Localization",
                      "description": "Specify the exact location in an image where an action is happening."
                    }
                  ]
                }
              ]
            },
            {
              "name": "Special Cases",
              "description": "Specialized cases such as face recognition, license plate recognition, and manufacturing inspection.",
              "sub_features_2": [
                {
                  "name": "Face Recognition",
                  "description": "Detect and recognize faces in images or videos.",
                  "sub_features_3": [
                    {
                      "name": "Face Detection",
                      "description": "Detect faces in images or video frames."
                    },
                    {
                      "name": "Face Matching",
                      "description": "Compare faces in an image or video to a known database."
                    },
                    {
                      "name": "Facial Landmarks & Keypoints",
                      "description": "Mark key facial features such as eyes, nose, and lips."
                    },
                    {
                      "name": "Emotion Detection",
                      "description": "Detect facial expressions and infer emotions."
                    },
                    {
                      "name": "Age and Gender Prediction",
                      "description": "Predict the age and gender of individuals from their faces."
                    }
                  ]
                },
                {
                  "name": "Automatic License Plate Recognition (ALPR)",
                  "description": "Detect and read license plates in images or videos.",
                  "sub_features_3": [
                    {
                      "name": "License Plate Detection",
                      "description": "Automatically detect license plates in images or videos."
                    },
                    {
                      "name": "Character Recognition for Plates",
                      "description": "Use OCR to read characters from detected license plates."
                    },
                    {
                      "name": "License Plate Classification",
                      "description": "Classify license plates based on vehicle type."
                    }
                  ]
                },
                {
                  "name": "Manufacturing Inspection Features",
                  "description": "Use computer vision to inspect product quality in manufacturing.",
                  "sub_features_3": [
                    {
                      "name": "Product Quality Inspection",
                      "description": "Classify products as 'Good' or 'Not Good' based on visual inspection."
                    },
                    {
                      "name": "Defect Detection",
                      "description": "Detect physical defects in products."
                    },
                    {
                      "name": "Color and Surface Consistency",
                      "description": "Check for consistent color and surface texture in products."
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "name": "Natural Language Processing (NLP)",
          "description": "NLP-based annotation features for labeling and processing textual data.",
          "sub_features_1": [
            {
              "name": "Question Answering",
              "description": "Add annotations to answer questions based on the given text."
            },
            {
              "name": "Text Classification",
              "description": "Classify text into specific categories or labels."
            },
            {
              "name": "Named Entity Recognition (NER)",
              "description": "Annotate entities such as persons, locations, and organizations in the text."
            },
            {
              "name": "Taxonomy",
              "description": "Create hierarchical annotations to categorize and structure data."
            },
            {
              "name": "Relation Extraction",
              "description": "Annotate relationships between entities within the text."
            },
            {
              "name": "Machine Translation",
              "description": "Provide translation annotations between two languages."
            },
            {
              "name": "Text Summarization",
              "description": "Summarize long text into shorter annotations."
            },
            {
              "name": "Part-of-Speech (POS) Tagging",
              "description": "Add grammatical category labels to each word in the text (e.g., noun, verb, adjective)."
            },
            {
              "name": "Sentiment Analysis",
              "description": "Annotate text sentiment as positive, negative, or neutral."
            },
            {
              "name": "Dependency Parsing",
              "description": "Mark grammatical relationships between words to understand sentence structure and dependencies."
            },
            {
              "name": "Coreference Resolution",
              "description": "Annotate references that point to the same entity in the text (e.g., 'he' refers to 'John')."
            },
            {
              "name": "Topic Modeling",
              "description": "Group text into detected topics and provide annotations based on the topic distribution."
            },
            {
              "name": "Emotion Detection",
              "description": "Annotate the emotions expressed in the text, such as happy, sad, angry, or fearful."
            },
            {
              "name": "Language Detection",
              "description": "Annotate the language used in the text, especially for multilingual cases."
            },
            {
              "name": "Keyphrase Extraction",
              "description": "Extract key phrases or keywords from text and add annotations for the most relevant ones."
            },
            {
              "name": "Text Entailment",
              "description": "Mark the relationship between two sentences to indicate if one sentence implies or contradicts the other."
            },
            {
              "name": "Paraphrase Detection",
              "description": "Annotate text that contains sentences or phrases conveying the same meaning in different forms."
            },
            {
              "name": "Discourse Analysis",
              "description": "Annotate discourse structure, such as logical relationships between sentences or paragraphs."
            },
            {
              "name": "Text Similarity Scoring",
              "description": "Add similarity score annotations between two texts to measure how similar the content or context is."
            },
            {
              "name": "Intent Detection",
              "description": "Annotate the intent or purpose of text, often used in chatbots or conversational analysis (e.g., product orders, information requests)."
            },
            {
              "name": "Language Generation Validation",
              "description": "Annotate and assess the validity of text generated by NLP models to ensure context-appropriate results."
            },
            {
              "name": "Text/Paragraph Summarization",
              "description": "Summarize text or paragraphs using various techniques."
            },
            {
              "name": "Text/Paragraph Summarization",
              "description": "Provide summarization annotations for text using extractive or abstractive methods.",
              "sub_features_2": [
                {
                  "name": "Automatic Summarization",
                  "description": "Automatically generate summaries from text using pre-trained models."
                },
                {
                  "name": "Extractive Summarization",
                  "description": "Extract the most important sentences from the original text to create a summary."
                },
                {
                  "name": "Abstractive Summarization",
                  "description": "Rewrite new sentences that capture the essence of the original text, providing a more concise summary."
                },
                {
                  "name": "Custom Length Summarization",
                  "description": "Allow users to choose the summary length, such as 20%, 50%, or 70% of the original text."
                },
                {
                  "name": "Keypoint Summary",
                  "description": "Identify and summarize key points from paragraphs to highlight the most important information."
                }
              ]
            }
          ]
        },
        {
          "name": "Audio",
          "description": "Annotation features for processing and analyzing audio data.",
          "sub_features_1": [
            {
              "name": "Automatic Speech Recognition (ASR)",
              "description": "Add annotations of text generated from automatic speech recognition."
            },
            {
              "name": "ASR with Segments",
              "description": "Annotate audio based on identified segments."
            },
            {
              "name": "Conversation Analysis",
              "description": "Annotate audio to analyze conversations, such as detecting speakers or topics."
            },
            {
              "name": "Intent Classification",
              "description": "Classify the intent from speech using manual annotations or models."
            },
            {
              "name": "Signal Quality Detection",
              "description": "Mark the quality of the audio signal based on specific parameters."
            },
            {
              "name": "Sound Event Detection",
              "description": "Detect and annotate specific sound events within an audio file."
            },
            {
              "name": "Speaker Segmentation",
              "description": "Separate and annotate different speakers within a conversation."
            },
            {
              "name": "Speech Transcription",
              "description": "Add annotations in the form of text transcriptions from audio."
            },
            {
              "name": "Emotion Detection",
              "description": "Annotate emotions detected in speech such as happiness, sadness, anger, or fear."
            },
            {
              "name": "Language Identification",
              "description": "Annotate the detected language within the audio file, useful for multilingual recordings."
            },
            {
              "name": "Audio Intent Detection",
              "description": "Annotate the intent or goal of spoken audio, often used in voice assistants or conversational AI."
            },
            {
              "name": "Speaker Diarization",
              "description": "Automatically identify and annotate different speakers throughout the audio."
            },
            {
              "name": "Sound Source Localization",
              "description": "Annotate the location or direction of sound sources in an audio recording."
            },
            {
              "name": "Voice Activity Detection",
              "description": "Annotate when voice activity occurs, separating speech from non-speech segments."
            },
            {
              "name": "Noise Detection",
              "description": "Detect and annotate background noise or interruptions within the audio."
            },
            {
              "name": "Speaker Emotion Recognition",
              "description": "Detect and annotate emotions expressed by speakers in the audio."
            },
            {
              "name": "Keyword Spotting",
              "description": "Automatically detect and annotate specific keywords within the audio."
            },
            {
              "name": "Speech to Text with Timestamps",
              "description": "Annotate transcriptions along with timestamps for each segment of speech."
            },
            {
              "name": "Phoneme Annotation",
              "description": "Annotate the phonetic transcription of speech, providing a detailed breakdown of each phoneme."
            }
          ]
        },
        {
          "name": "Conversational AI",
          "description": "Annotation features for conversational AI, including entity linking, intent classification, and response generation.",
          "sub_features_1": [
            {
              "name": "Conference Resolution & Entity Linking",
              "description": "Annotate entities and link them to relevant contexts in a conversation."
            },
            {
              "name": "Intent Classification and Slot Filling",
              "description": "Annotate intent classification and fill the necessary data slots for conversational understanding."
            },
            {
              "name": "Response Generation",
              "description": "Provide annotations for generating AI model responses based on the context of the conversation."
            },
            {
              "name": "Response Selection",
              "description": "Annotate the most relevant response for a given conversational context."
            },
            {
              "name": "Context Tracking",
              "description": "Annotate and track context switches during a conversation to maintain dialogue coherence."
            },
            {
              "name": "Dialogue Act Annotation",
              "description": "Annotate the type of dialogue act, such as questions, requests, affirmations, or commands."
            },
            {
              "name": "Speaker Identification",
              "description": "Annotate different speakers in the conversation to distinguish between participants."
            },
            {
              "name": "Sentiment Annotation in Dialogue",
              "description": "Annotate the sentiment (positive, negative, neutral) expressed by participants in a conversation."
            },
            {
              "name": "Topic Shifting Detection",
              "description": "Annotate when the topic of conversation shifts or changes."
            },
            {
              "name": "Turn-taking Detection",
              "description": "Annotate and detect when a participant’s turn begins and ends in the dialogue."
            },
            {
              "name": "Politeness Level Detection",
              "description": "Annotate the level of politeness in a conversational response or interaction."
            },
            {
              "name": "Backchanneling Detection",
              "description": "Annotate conversational backchanneling behavior (e.g., 'uh-huh', 'I see', 'right')."
            },
            {
              "name": "Emotion Detection in Dialogue",
              "description": "Annotate emotions expressed by participants in the conversation (e.g., happy, frustrated, confused)."
            },
            {
              "name": "Ambiguity Detection",
              "description": "Annotate ambiguous utterances that may require clarification in the conversation."
            },
            {
              "name": "Named Entity Recognition (NER) in Dialogue",
              "description": "Annotate named entities in conversational data, such as people, locations, and organizations."
            },
            {
              "name": "Dialogue Disfluency Annotation",
              "description": "Annotate disfluencies in speech such as pauses, filler words ('um', 'uh'), and false starts."
            },
            {
              "name": "Conversational Repair Detection",
              "description": "Annotate when participants attempt to correct or clarify previous statements in the conversation."
            },
            {
              "name": "Language Switch Detection",
              "description": "Annotate when participants switch between languages during a conversation."
            },
            {
              "name": "Interactive Q&A Annotation",
              "description": "Annotate interactive question-and-answer pairs in the context of a conversation."
            }
          ]
        },
        {
          "name": "Ranking & Scoring",
          "description": "Annotation features for ranking and scoring tasks, including ASR hypotheses, content retrieval, and search page ranking.",
          "sub_features_1": [
            {
              "name": "ASR Hypotheses Selection",
              "description": "Annotate to select the best hypothesis from automatic speech recognition results."
            },
            {
              "name": "Content-based Image Retrieval",
              "description": "Annotate images based on content relevance for search and retrieval purposes."
            },
            {
              "name": "Document Retrieval",
              "description": "Annotate the most relevant documents for retrieval from a dataset."
            },
            {
              "name": "Pairwise Classification & Regression",
              "description": "Annotate to compare two objects and perform classification or regression tasks."
            },
            {
              "name": "Search Page Ranking",
              "description": "Annotate search results based on relevance for page ranking."
            },
            {
              "name": "Text to Image Generation",
              "description": "Annotate to link generated images with relevant text inputs."
            },
            {
              "name": "Personalized Ranking",
              "description": "Annotate personalized ranking results based on user behavior or preferences."
            },
            {
              "name": "Relevance Scoring",
              "description": "Annotate relevance scores between query and result pairs in search tasks."
            },
            {
              "name": "Image Similarity Scoring",
              "description": "Annotate the similarity between images for ranking based on visual features."
            },
            {
              "name": "Content Clustering",
              "description": "Annotate clusters of content (images, documents) for grouping similar items together."
            },
            {
              "name": "Ranking for Recommendation Systems",
              "description": "Annotate items based on their relevance for recommendations."
            },
            {
              "name": "Query-Document Scoring",
              "description": "Annotate query-document pairs with scores representing relevance in search tasks."
            },
            {
              "name": "Multi-modal Ranking",
              "description": "Annotate across multiple modalities such as text, image, and video for ranking and scoring."
            },
            {
              "name": "Rank Aggregation",
              "description": "Annotate the aggregation of rankings from multiple sources or algorithms."
            },
            {
              "name": "Context-aware Ranking",
              "description": "Annotate rankings based on contextual relevance, such as time, location, or user profile."
            },
            {
              "name": "Temporal Relevance Scoring",
              "description": "Annotate the relevance of results based on temporal factors such as recentness or timeliness."
            },
            {
              "name": "Click-through Rate (CTR) Estimation",
              "description": "Annotate and estimate the likelihood of user clicks on ranked items."
            }
          ]
        },
        {
          "name": "Structured Data Parsing",
          "description": "Annotation features for structured data, such as tabular data, HTML entity recognition, and PDF classification.",
          "sub_features_1": [
            {
              "name": "Freeform Metadata",
              "description": "Annotate metadata for unstructured or loosely structured data."
            },
            {
              "name": "HTML Entity Recognition",
              "description": "Annotate HTML elements like tags and entities within web pages."
            },
            {
              "name": "PDF Classification",
              "description": "Annotate and classify PDF documents based on their content."
            },
            {
              "name": "Tabular Data",
              "description": "Annotate data within tables, including column or row categorization."
            },
            {
              "name": "Cell-level Annotation",
              "description": "Annotate individual cells within tables to label specific data points."
            },
            {
              "name": "Data Type Identification",
              "description": "Annotate the types of data within structured documents, such as numeric, text, or categorical."
            },
            {
              "name": "Entity Linking in Structured Data",
              "description": "Annotate entities in structured data and link them to external knowledge bases or metadata sources."
            },
            {
              "name": "JSON/XML Parsing",
              "description": "Annotate and parse JSON or XML data structures, identifying key elements or hierarchies."
            },
            {
              "name": "Data Normalization Annotation",
              "description": "Annotate and standardize structured data across various formats, ensuring consistency in naming, formats, or units."
            },
            {
              "name": "Schema Mapping",
              "description": "Annotate mappings between different data schemas, identifying equivalent fields across multiple datasets."
            },
            {
              "name": "Hierarchical Data Parsing",
              "description": "Annotate and parse hierarchical or nested data structures, such as nested JSON or XML files."
            },
            {
              "name": "Table Structure Annotation",
              "description": "Annotate the structure of tables in documents, marking headers, footers, or multi-level headings."
            },
            {
              "name": "Time Series Data Annotation",
              "description": "Annotate structured time-series data, marking significant trends, peaks, or anomalies."
            },
            {
              "name": "Multi-format Data Parsing",
              "description": "Annotate and parse structured data from various formats, including CSV, Excel, and other tabular forms."
            },
            {
              "name": "Data Quality Annotation",
              "description": "Annotate the quality of structured data, marking errors, inconsistencies, or missing values."
            },
            {
              "name": "Document Structure Recognition",
              "description": "Annotate the overall structure of documents, such as section headers, footnotes, and table of contents."
            },
            {
              "name": "Relational Database Schema Parsing",
              "description": "Annotate and parse relational database schemas, including relationships between tables and columns."
            },
            {
              "name": "Text Extraction from Structured Documents",
              "description": "Annotate and extract relevant text from structured documents like PDFs, XMLs, or JSONs."
            },
            {
              "name": "Multi-document Parsing",
              "description": "Annotate and parse data across multiple structured documents, identifying relationships or patterns between them."
            }
          ]
        },
        {
          "name": "Time Series Analysis",
          "description": "Annotation features for time series data, including activity recognition, change point detection, and forecasting.",
          "sub_features_1": [
            {
              "name": "Activity Recognition",
              "description": "Annotate activities within time series data, identifying specific events or actions."
            },
            {
              "name": "Change Point Detection",
              "description": "Annotate significant change points within time series data."
            },
            {
              "name": "Outliers & Anomaly Detection",
              "description": "Annotate outliers and anomalies detected in time series data."
            },
            {
              "name": "Signal Quality",
              "description": "Annotate the quality of signals based on time series data."
            },
            {
              "name": "Time Series Forecasting",
              "description": "Add annotations for predictions or trends based on historical data."
            },
            {
              "name": "Trend Identification",
              "description": "Annotate upward or downward trends within time series data."
            },
            {
              "name": "Seasonality Detection",
              "description": "Annotate seasonal patterns or recurring cycles in time series data."
            },
            {
              "name": "Pattern Recognition",
              "description": "Annotate repeating patterns or sequences within the time series data."
            },
            {
              "name": "Time Series Clustering",
              "description": "Annotate and group similar time series data based on shared characteristics or behaviors."
            },
            {
              "name": "Peak and Trough Detection",
              "description": "Annotate significant peaks (highs) and troughs (lows) in the data."
            },
            {
              "name": "Event Labeling",
              "description": "Annotate key events or milestones within time series data."
            },
            {
              "name": "Data Smoothing Annotation",
              "description": "Annotate smoothed data using methods such as moving averages to reduce noise."
            },
            {
              "name": "Interval Annotation",
              "description": "Annotate intervals within time series data to segment periods of interest."
            },
            {
              "name": "Multivariate Time Series Annotation",
              "description": "Annotate multivariate time series data where multiple variables are measured over time."
            },
            {
              "name": "Cycle Detection",
              "description": "Annotate cyclic patterns or periodic behaviors within time series data."
            },
            {
              "name": "Real-Time Event Detection",
              "description": "Annotate events in real-time or near real-time for streaming time series data."
            },
            {
              "name": "Causal Relationship Detection",
              "description": "Annotate potential causal relationships between variables in time series data."
            },
            {
              "name": "Missing Data Annotation",
              "description": "Annotate and handle missing data points within time series data."
            },
            {
              "name": "Noise Injection for Time Series",
              "description": "Annotate and inject controlled noise into time series data for augmentation purposes."
            },
            {
              "name": "Cross-Correlation Annotation",
              "description": "Annotate cross-correlations between two or more time series to identify relationships."
            }
          ]
        },
        {
          "name": "Video",
          "description": "Annotation features for video data, including classification, object tracking, and segmentation.",
          "sub_features_1": [
            {
              "name": "Video Classification",
              "description": "Annotate videos by adding labels based on the content within the video."
            },
            {
              "name": "Video Object Tracking",
              "description": "Annotate and track objects within the video timeline."
            },
            {
              "name": "Video Timeline Segmentation",
              "description": "Annotate and segment the video timeline into different sections based on content."
            },
            {
              "name": "Frame-Level Annotation",
              "description": "Add annotations to individual frames within a video for precise labeling."
            },
            {
              "name": "Event-Based Segmentation",
              "description": "Segment videos based on key events detected during playback."
            },
            {
              "name": "Scene Change Detection",
              "description": "Automatically annotate scene changes in a video."
            },
            {
              "name": "Video Sentiment Annotation",
              "description": "Annotate the sentiment or tone of a video, such as happy, sad, or neutral."
            },
            {
              "name": "Action Recognition",
              "description": "Annotate actions or gestures performed by individuals in the video."
            },
            {
              "name": "Facial Expression Annotation",
              "description": "Annotate facial expressions detected in the video, such as smiles, frowns, or surprise."
            },
            {
              "name": "Video Activity Annotation",
              "description": "Annotate activities or events taking place within the video, such as sports, cooking, or dancing."
            },
            {
              "name": "Multiclass Video Classification",
              "description": "Allow multiple classes or labels to be assigned to a video based on content."
            },
            {
              "name": "Temporal Video Annotation",
              "description": "Annotate specific time intervals or segments of a video for detailed analysis."
            },
            {
              "name": "Video Keyframe Annotation",
              "description": "Annotate keyframes that represent significant moments or transitions within a video."
            },
            {
              "name": "Object Interaction Annotation",
              "description": "Annotate interactions between objects in a video, such as one object blocking another."
            },
            {
              "name": "Background Annotation",
              "description": "Annotate the background environment of a video, including weather, lighting, or setting."
            },
            {
              "name": "Video Gesture Recognition",
              "description": "Annotate hand or body gestures detected in the video."
            },
            {
              "name": "Optical Flow Annotation",
              "description": "Annotate the movement of objects between frames using optical flow techniques."
            },
            {
              "name": "Pose Estimation in Video",
              "description": "Annotate human or animal poses throughout the video timeline."
            },
            {
              "name": "Video Object Counting",
              "description": "Annotate and count the number of objects detected in the video."
            },
            {
              "name": "Video Object Re-Identification",
              "description": "Annotate and re-identify the same object across different segments or scenes in the video."
            },
            {
              "name": "3D Video Object Annotation",
              "description": "Annotate objects in 3D space within videos, particularly for AR/VR or game development."
            },
            {
              "name": "Crowd Density Annotation",
              "description": "Annotate crowd density or the number of individuals within a scene."
            },
            {
              "name": "Video Captioning",
              "description": "Add automatic or manual captions to a video, either for accessibility or content summarization."
            },
            {
              "name": "Video Object Detection Confidence Scoring",
              "description": "Annotate object detection with confidence scores based on the detection model's output."
            },
            {
              "name": "Multiple Object Tracking",
              "description": "Track and annotate multiple objects across frames in a video."
            },
            {
              "name": "Interactive Video Annotation",
              "description": "Allow for interactive annotation where users can pause the video and annotate specific sections."
            }
          ]
        },
        {
          "name": "Generative AI",
          "description": "Annotation features for generative AI model training, assessment, and ranking.",
          "sub_features_1": [
            {
              "name": "Supervised Language Model Fine-tuning",
              "description": "Add annotations to help in the supervised fine-tuning of language models."
            },
            {
              "name": "Human Preference Collection for RLHF",
              "description": "Annotate human preferences to be used in reinforcement learning with human feedback (RLHF)."
            },
            {
              "name": "Chatbot Model Assessment",
              "description": "Annotate and assess chatbot interactions for evaluation and adjustment."
            },
            {
              "name": "LLM Ranker",
              "description": "Add annotations to rank responses from large language models (LLM) based on their quality."
            },
            {
              "name": "Visual Ranker",
              "description": "Annotate and rank visual outputs generated by AI based on specific criteria."
            },
            {
              "name": "Text-to-Image Generation Feedback",
              "description": "Provide feedback on images generated from text prompts, including ranking and improvement suggestions."
            },
            {
              "name": "Prompt Engineering Feedback",
              "description": "Annotate prompts used for generative AI models, providing feedback on their effectiveness in generating the desired outputs."
            },
            {
              "name": "Generative Text Quality Annotation",
              "description": "Annotate the quality of text generated by AI models, focusing on fluency, coherence, and relevance."
            },
            {
              "name": "Visual Quality Assessment",
              "description": "Annotate the quality of visual outputs from generative models, including sharpness, color accuracy, and alignment with the prompt."
            },
            {
              "name": "Generated Content Bias Detection",
              "description": "Annotate generated text or images for potential biases, providing feedback for model improvement."
            },
            {
              "name": "Emotion Recognition in Generated Content",
              "description": "Annotate emotions conveyed in text or visual content generated by AI models."
            },
            {
              "name": "Contextual Relevance Annotation",
              "description": "Assess and annotate the relevance of generated content within a specific context or scenario."
            },
            {
              "name": "Generative AI Consistency Annotation",
              "description": "Annotate the consistency of AI-generated content across multiple outputs or within a longer generated sequence."
            },
            {
              "name": "Generated Code Annotation",
              "description": "Annotate code snippets generated by AI models for functionality, efficiency, and correctness."
            },
            {
              "name": "Style Transfer Feedback",
              "description": "Annotate the effectiveness of style transfer in generated images or text, providing suggestions for improvement."
            },
            {
              "name": "Cross-Modal Generation Annotation",
              "description": "Annotate outputs generated across different modalities (e.g., text-to-image, image-to-text) to assess alignment and relevance."
            },
            {
              "name": "Generative Output Comparison",
              "description": "Annotate and compare multiple outputs from generative models to determine the best results."
            },
            {
              "name": "Prompt Improvement Suggestions",
              "description": "Provide annotations that suggest improvements for prompts used in generating better AI outputs."
            },
            {
              "name": "Model Response Latency Annotation",
              "description": "Annotate and assess the latency of model responses, providing feedback on speed and efficiency."
            },
            {
              "name": "Adversarial Testing Annotations",
              "description": "Annotate responses to adversarial prompts used to test the robustness of generative models."
            },
            {
              "name": "Generative AI Output Safety Evaluation",
              "description": "Annotate and evaluate generated content for safety concerns, including harmful, misleading, or biased outputs."
            },
            {
              "name": "Personalization Feedback for Generated Content",
              "description": "Annotate how well-generated content aligns with personalized preferences or user requirements."
            },
            {
              "name": "Image Caption Generation Feedback",
              "description": "Annotate the accuracy and relevance of captions generated for images by AI models."
            },
            {
              "name": "Creative Content Scoring",
              "description": "Score and annotate the creativity and originality of content generated by AI models."
            }
          ]
        }
      ]
    }