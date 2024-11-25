from app.data.features_annotations_computer_vision import features_annotations_computer_vision
from app.data.features_annotations_nlp import features_annotations_nlp
from app.data.features_annotations_videos import features_annotations_videos

features_annotations = {
      "name": "Annotations",
      "description": "Various features to annotate and label data using computer vision techniques, including object detection, segmentation, and face recognition.",
      "features": [
        features_annotations_computer_vision,
        features_annotations_nlp,
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
        features_annotations_videos,
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