features_text_editor =     {
      "name": "Text Editor",
      "description": "Edit and manipulate text data for various use cases such as text preprocessing, augmentation, analysis, and conversion.",
      "features": [
        {
          "name": "Text Preprocessing",
          "description": "Initial text processing to normalize and remove irrelevant elements.",
          "sub_features_1": [
            {
              "name": "Stopword Removal",
              "description": "Remove irrelevant words such as 'and', 'or', etc."
            },
            {
              "name": "Lemmatization",
              "description": "Convert words to their base form (e.g., 'running' becomes 'run')."
            },
            {
              "name": "Stemming",
              "description": "Trim words to their root form (e.g., 'working' becomes 'work')."
            },
            {
              "name": "Punctuation Removal",
              "description": "Remove punctuation from text."
            },
            {
              "name": "Lowercasing",
              "description": "Convert all letters to lowercase."
            },
            {
              "name": "Text Trimming",
              "description": "Remove unnecessary spaces or characters."
            },
            {
              "name": "Whitespace Reduction",
              "description": "Reduce excessive spaces in the text."
            },
            {
              "name": "Remove Redundant Data",
              "description": "Remove repetitive or irrelevant data."
            }
          ]
        },
        {
          "name": "Text Augmentation",
          "description": "Enhance text by adding or modifying elements for more variation.",
          "sub_features_1": [
            {
              "name": "Uppercase/Lowercase Conversion",
              "description": "Convert all letters to uppercase or lowercase."
            },
            {
              "name": "Text Trimming",
              "description": "Remove unnecessary spaces or characters."
            },
            {
              "name": "Synonym Replacement",
              "description": "Replace words with their synonyms to enrich text variation."
            },
            {
              "name": "Back Translation",
              "description": "Translate text to another language and back to the original."
            },
            {
              "name": "Random Insertion",
              "description": "Randomly insert words into the text."
            },
            {
              "name": "Random Deletion",
              "description": "Randomly delete words from the text."
            },
            {
              "name": "Shuffle Sentences",
              "description": "Randomize the order of sentences in the text."
            }
          ]
        },
        {
          "name": "Text Search and Replace (Regex Processing)",
          "description": "Search, replace, and manipulate text using regular expressions (Regex) to give users more control over text pattern matching.",
          "sub_features_1": [
            {
              "name": "Regex Search",
              "description": "Search text using specific regex patterns.",
              "sub_features_2": [
                {
                  "name": "Case-sensitive Search",
                  "description": "Search for text based on patterns that account for case sensitivity."
                },
                {
                  "name": "Multi-line Search",
                  "description": "Support searching patterns across multiple lines of text."
                },
                {
                  "name": "Global Search",
                  "description": "Search all occurrences of a regex pattern in the text."
                },
                {
                  "name": "Boundary-based Search",
                  "description": "Search based on word boundaries like '\\b' to find exact words (e.g., 'cat' but not 'scatter')."
                },
                {
                  "name": "Lookahead/Lookbehind Search",
                  "description": "Support advanced patterns with positive/negative lookahead and lookbehind."
                },
                {
                  "name": "Character Classes",
                  "description": "Search based on specific character categories such as letters, digits, or symbols (e.g., '\\d' for digits)."
                }
              ]
            },
            {
              "name": "Regex Replace",
              "description": "Replace text using regex patterns.",
              "sub_features_2": [
                {
                  "name": "Case-insensitive Replace",
                  "description": "Replace text patterns without considering case sensitivity."
                },
                {
                  "name": "Replace with Captured Groups",
                  "description": "Use regex groups for dynamic text replacement (e.g., using '(\\d{3})' to replace phone area codes)."
                },
                {
                  "name": "Conditional Replace",
                  "description": "Perform replacement only if other patterns are found in the surrounding text."
                },
                {
                  "name": "Replace All Occurrences",
                  "description": "Replace all occurrences of a regex pattern, not just the first one."
                },
                {
                  "name": "Replace Based on Lookahead/Lookbehind",
                  "description": "Replace text while considering lookahead and lookbehind conditions."
                }
              ]
            },
            {
              "name": "Regex Extract",
              "description": "Extract specific text portions based on regex patterns.",
              "sub_features_2": [
                {
                  "name": "Extract All Matches",
                  "description": "Extract all occurrences of a regex pattern in the text, not just the first match."
                },
                {
                  "name": "Named Groups Extraction",
                  "description": "Support named groups to extract specific parts of text using named regex groups (e.g., '(?P<name>[A-Za-z]+)' to capture names)."
                },
                {
                  "name": "Split by Regex",
                  "description": "Split text into sections based on regex patterns, such as separating sentences or paragraphs."
                },
                {
                  "name": "Capture Groups",
                  "description": "Extract text from capture groups within regex patterns (e.g., extracting years from a pattern like '\\d{4}')."
                },
                {
                  "name": "Extract Between Delimiters",
                  "description": "Extract text that lies between two specific delimiters, such as extracting content between parentheses."
                },
                {
                  "name": "Multi-line Extraction",
                  "description": "Support extracting text across multiple lines."
                }
              ]
            },
            {
              "name": "Advanced Regex Processing",
              "description": "Perform advanced text processing using dynamic and complex regex patterns.",
              "sub_features_2": [
                {
                  "name": "Dynamic Regex Creation",
                  "description": "Create regex patterns dynamically based on user input, such as adding or removing parts of a regex."
                },
                {
                  "name": "Regex Debugging/Visualization",
                  "description": "Visualize regex pattern matches or use debugging tools to clarify regex matching results."
                },
                {
                  "name": "Anchors and Assertions",
                  "description": "Use anchors like '^' (start) and '$' (end) to ensure the pattern matches specific positions in the text."
                },
                {
                  "name": "Escape Characters Handling",
                  "description": "Handle search and replacement for characters that need to be escaped, such as parentheses '()', curly braces '{}', or dots '.'."
                },
                {
                  "name": "Search with Multiple Patterns",
                  "description": "Support searching using multiple regex patterns at once for more complex text searches."
                }
              ]
            }
          ]
        },
        {
          "name": "Text Statistics",
          "description": "Compute various text statistics.",
          "sub_features_1": [
            {
              "name": "Word, Character, Sentence, Paragraph Count",
              "description": "Count words, characters, sentences, and paragraphs in text."
            },
            {
              "name": "Text Length Distribution",
              "description": "Show the distribution of text length (words, sentences, paragraphs)."
            }
          ]
        },
        {
          "name": "File Format Conversion",
          "description": "Convert text between various formats for different needs.",
          "sub_features_1": [
            {
              "name": "Convert Between Text Formats",
              "description": "Convert text between formats such as .txt, .csv, .json, .xls, .xlsx, .html, .pdf."
            },
            {
              "name": "Markdown Conversion",
              "description": "Convert text to and from Markdown format."
            },
            {
              "name": "PDF to Text",
              "description": "Convert PDF into plain text for analysis."
            },
            {
              "name": "HTML to Text",
              "description": "Convert HTML into plain text."
            }
          ]
        },
        {
          "name": "Text Compression",
          "description": "Compress text by reducing size or eliminating irrelevant elements.",
          "sub_features_1": [
            {
              "name": "Whitespace Reduction",
              "description": "Reduce excessive whitespace in the text."
            },
            {
              "name": "Remove Redundant Data",
              "description": "Eliminate repetitive or irrelevant data."
            }
          ]
        },
        {
          "name": "Exploratory Data Analysis (EDA)",
          "description": "Melakukan analisis eksplorasi data berbasis teks untuk memahami pola-pola yang ada.",
          "features": [
            {
              "name": "Word Frequency Distribution",
              "description": "Distribusi frekuensi kata di dalam teks."
            },
            {
              "name": "Term Frequency (TF)",
              "description": "Menghitung frekuensi kemunculan kata tertentu."
            },
            {
              "name": "Inverse Document Frequency (IDF)",
              "description": "Menghitung kepentingan kata berdasarkan jumlah dokumen yang mengandung kata tersebut."
            },
            {
              "name": "Word Cloud",
              "description": "Visualisasi kata berdasarkan frekuensi kemunculannya."
            },
            {
              "name": "N-gram Analysis",
              "description": "Analisis bigram atau trigram untuk mendeteksi pola kata."
            },
            {
              "name": "Sentiment Analysis",
              "description": "Analisis sentimen positif, negatif, dan netral dalam teks."
            },
            {
              "name": "Text Length Distribution",
              "description": "Menampilkan distribusi panjang teks berdasarkan jumlah kata atau karakter."
            },
            {
              "name": "POS Tagging Analysis",
              "description": "Analisis distribusi part-of-speech dalam teks (kata benda, kata kerja, dll.)."
            },
            {
              "name": "POS Heatmap",
              "description": "Visualisasi pola linguistik berdasarkan POS tagging."
            },
            {
              "name": "Named Entity Recognition (NER) Analysis",
              "description": "Distribusi entitas seperti nama, tempat, organisasi, dan tipe entitas."
            }
          ]
        },
        {
          "name": "Advanced Text Processing",
          "description": "Advanced and deeper text processing capabilities.",
          "sub_features_1": [
            {
              "name": "Text Summarization",
              "description": "Summarize text into shorter versions."
            },
            {
              "name": "Spell Check & Correction",
              "description": "Automatically detect and correct spelling errors."
            },
            {
              "name": "Keyword Extraction",
              "description": "Find important keywords or phrases in text."
            },
            {
              "name": "Text Generation & Completion",
              "description": "Automatically generate or complete text based on user input."
            },
            {
              "name": "Language Detection",
              "description": "Detect the language of the text automatically."
            }
          ]
        },
        {
          "name": "Text Annotation",
          "description": "Annotate text for further analysis or processing.",
          "sub_features_1": [
            {
              "name": "Manual Text Annotation",
              "description": "Users can manually mark important parts of the text."
            },
            {
              "name": "Automated Text Annotation",
              "description": "Automatically annotate text using NER, POS tagging, or other methods."
            }
          ]
        },
        {
          "name": "Text Visualization",
          "description": "Visualize text structures and patterns for better understanding.",
          "sub_features_1": [
            {
              "name": "Dependency Parsing Visualization",
              "description": "Visualize syntactic relationships between words in a sentence."
            },
            {
              "name": "Sentence Tree Structure",
              "description": "Display the tree structure of a sentence based on grammar."
            },
            {
              "name": "Co-occurrence Matrix",
              "description": "Analyze words that frequently occur together."
            },
            {
              "name": "Heatmap of Word Embeddings",
              "description": "Display word representations in high-dimensional space using embeddings."
            }
          ]
        },
        {
          "name": "Collaborative Editing",
          "description": "Enable multiple users to collaboratively edit text.",
          "sub_features_1": [
            {
              "name": "Multi-User Text Editing",
              "description": "Support text editing by multiple users simultaneously."
            },
            {
              "name": "Version Control",
              "description": "Save previous versions of the text and allow users to revert to previous versions."
            }
          ]
        },
        {
          "name": "Text Generation",
          "description": "Generate automatic text based on the given input.",
          "sub_features_1": [
            {
              "name": "Autocompletion",
              "description": "Provide autocompletion suggestions based on the sentence context."
            },
            {
              "name": "Text Paraphrasing",
              "description": "Generate variations of the same text with different structures."
            }
          ]
        },
        {
          "name": "Text Cleaning",
          "description": "Clean text by removing unwanted elements.",
          "sub_features_1": [
            {
              "name": "Language Detection",
              "description": "Automatically detect the language of the text."
            },
            {
              "name": "Profanity Filter",
              "description": "Identify and remove inappropriate words."
            }
          ]
        }
      ]
    }