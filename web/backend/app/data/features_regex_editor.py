features_regex_editor = {
  "name": "Regex Editor",
  "description": "Create, test, and manage regular expressions with an interactive interface. Easily validate patterns against sample text and explore regex functionalities.",
  "features": [
    {
      "name": "Regex Builder",
      "description": "An intuitive interface for constructing regular expressions.",
      "sub_features": [
        {
          "name": "Pattern Input",
          "description": "Input the regular expression pattern. Live validation highlights syntax errors.",
          "interaction": "Users can type their regex patterns and see instant feedback on validity."
        },
        {
          "name": "Test String",
          "description": "Input a string to test against the regular expression. This allows users to see matches in real-time.",
          "interaction": "Users can modify the test string and immediately view matching results."
        },
        {
          "name": "Flags",
          "description": "Select flags to modify the behavior of the regular expression (e.g., case-insensitive, multiline).",
          "options": [
            { "flag": "i", "description": "Case-insensitive matching." },
            { "flag": "m", "description": "Multiline mode, allows ^ and $ to match start and end of each line." },
            { "flag": "g", "description": "Global search, finds all matches rather than stopping after the first." },
            { "flag": "s", "description": "Dot matches newline, allowing . to match newline characters." },
            { "flag": "u", "description": "Treat the pattern and string as Unicode." }
          ],
          "interaction": "Users can check/uncheck flags to see how they affect matching."
        }
      ]
    },
    {
      "name": "Regex Patterns",
      "description": "Explore and utilize various regex patterns.",
      "sub_features": [
        {
          "name": "Character Classes",
          "description": "Match specific types of characters. Use square brackets to define sets of characters.",
          "examples": [
            { "pattern": ".", "description": "Matches any character except newline." },
            { "pattern": "\\w", "description": "Matches any word character (alphanumeric & underscore)." },
            { "pattern": "\\d", "description": "Matches any digit (0-9)." },
            { "pattern": "\\s", "description": "Matches any whitespace character (spaces, tabs, line breaks)." },
            { "pattern": "\\W", "description": "Matches any non-word character." },
            { "pattern": "\\D", "description": "Matches any non-digit character." },
            { "pattern": "\\S", "description": "Matches any non-whitespace character." },
            { "pattern": "[abc]", "description": "Matches any of a, b, or c." },
            { "pattern": "[^abc]", "description": "Matches any character not in the set a, b, or c." },
            { "pattern": "[a-g]", "description": "Matches any character between a and g." }
          ],
          "interaction": "Hovering over examples shows more detailed explanations and use cases."
        },
        {
          "name": "Anchors",
          "description": "Match positions within a string, useful for validating the start or end of strings.",
          "examples": [
            { "pattern": "^abc$", "description": "Matches 'abc' only if it is the entire string." },
            { "pattern": "\\b", "description": "Matches a word boundary (position between a word character and a non-word character)." },
            { "pattern": "\\B", "description": "Matches a position that is not a word boundary." }
          ],
          "interaction": "Users can test string positions by inputting various strings to see how anchors behave."
        },
        {
          "name": "Escaped Characters",
          "description": "Match special characters by escaping them with a backslash.",
          "examples": [
            { "pattern": "\\.", "description": "Matches a literal period (.) character." },
            { "pattern": "\\*", "description": "Matches a literal asterisk (*) character." },
            { "pattern": "\\\\", "description": "Matches a literal backslash (\) character." },
            { "pattern": "\\t", "description": "Matches a tab character." },
            { "pattern": "\\n", "description": "Matches a newline character." },
            { "pattern": "\\r", "description": "Matches a carriage return character." }
          ],
          "interaction": "Users can input strings with special characters to see how to escape them."
        },
        {
          "name": "Groups & Lookaround",
          "description": "Group patterns and use lookaheads/lookbehinds to match complex conditions.",
          "examples": [
            { "pattern": "(abc)", "description": "Captures 'abc' as a group." },
            { "pattern": "\\1", "description": "Backreference to the first captured group." },
            { "pattern": "(?:abc)", "description": "Non-capturing group, matches 'abc' but does not capture it." },
            { "pattern": "(?=abc)", "description": "Positive lookahead, asserts that 'abc' follows." },
            { "pattern": "(?!abc)", "description": "Negative lookahead, asserts that 'abc' does not follow." }
          ],
          "interaction": "Users can explore how grouping and lookarounds affect matches by inputting strings."
        },
        {
          "name": "Quantifiers & Alternation",
          "description": "Control the number of matches and provide alternatives.",
          "examples": [
            { "pattern": "a*", "description": "Matches 'a' zero or more times." },
            { "pattern": "a+", "description": "Matches 'a' one or more times." },
            { "pattern": "a?", "description": "Matches 'a' zero or one time." },
            { "pattern": "a{5}", "description": "Matches exactly five 'a's." },
            { "pattern": "a{2,}", "description": "Matches 'a' two or more times." },
            { "pattern": "a{1,3}", "description": "Matches 'a' between one and three times." },
            { "pattern": "a+?", "description": "Matches 'a' as few times as possible." },
            { "pattern": "ab|cd", "description": "Matches either 'ab' or 'cd'." }
          ],
          "interaction": "Users can create patterns with quantifiers and see how many matches occur."
        }
      ]
    },
    {
      "name": "Test & Validate",
      "description": "Run tests on the regular expression to check for matches and validate its functionality.",
      "sub_features": [
        {
          "name": "Match Results",
          "description": "Display the matching results based on the test string.",
          "interaction": "Results highlight matches in the test string for easy identification."
        },
        {
          "name": "Match Highlighting",
          "description": "Highlight matched segments in the test string.",
          "interaction": "Users can visually see which parts of the string match the regex."
        },
        {
          "name": "Error Feedback",
          "description": "Provide feedback on regex errors or invalid patterns.",
          "interaction": "Syntax errors are displayed with suggestions for correction."
        }
      ]
    },
    {
      "name": "Save & Load Patterns",
      "description": "Manage regular expression patterns by saving, loading, and organizing them.",
      "sub_features": [
        {
          "name": "Save Pattern",
          "description": "Save the current regex pattern for future use.",
          "interaction": "Users can name and categorize saved patterns for easy retrieval."
        },
        {
          "name": "Load Pattern",
          "description": "Load previously saved regex patterns.",
          "interaction": "Users can browse through saved patterns and select them to edit."
        },
        {
          "name": "Pattern Library",
          "description": "Access a library of commonly used regex patterns.",
          "interaction": "Users can view and apply patterns from a library of examples."
        }
      ]
    },
    {
      "name": "Documentation & Examples",
      "description": "Access resources for learning about regular expressions.",
      "sub_features": [
        {
          "name": "Regex Syntax Guide",
          "description": "Quick reference for regex syntax and components.",
          "interaction": "Provides clickable examples that users can copy to their patterns."
        },
        {
          "name": "Examples",
          "description": "View examples of common regex patterns and their use cases.",
          "interaction": "Each example includes explanations and sample strings."
        },
        {
          "name": "Interactive Tutorials",
          "description": "Step-by-step tutorials for learning regex concepts.",
          "interaction": "Users can follow along with guided exercises to practice regex skills."
        }
      ]
    }
  ]
}
