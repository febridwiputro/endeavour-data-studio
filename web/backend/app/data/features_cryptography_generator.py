features_cryptography_generator = {
  "name": "Cryptography Generator",
  "description": "An interactive tool for generating, analyzing, and understanding cryptographic algorithms and methods. Explore modern and historical encryption techniques, encoding and decoding mechanisms, and cryptanalysis tools.",
  "features": [
    {
      "name": "Highlights",
      "description": "Key functionalities showcasing modern cryptographic tools.",
      "sub_features_1": [
        {
          "name": "OpenSSL",
          "description": "OpenSSL v3 running locally in your browser, providing access to powerful cryptographic functions for encryption, decryption, and key generation.",
          "interaction": "Users can perform operations using various OpenSSL commands directly within the interface."
        },
        {
          "name": "CryptoBrief",
          "description": "A simple and compact language for implementing cryptographic algorithms, allowing users to easily understand and apply various cryptographic methods.",
          "interaction": "Users can write and execute CryptoBrief scripts to perform cryptographic tasks."
        }
      ]
    },
    {
      "name": "Modern Encryption",
      "description": "Advanced cryptographic methods that are widely used today.",
      "sub_features_1": [
        {
          "name": "RSA (Explained Step by Step)",
          "description": "The most widespread asymmetric method for encryption and signing. Learn the fundamentals of RSA, including key generation, encryption, and decryption.",
          "interaction": "Users can visualize the RSA algorithm through interactive examples and step-by-step explanations."
        },
        {
          "name": "Private Polls (Demo)",
          "description": "Conduct a private poll with homomorphic encryption, ensuring that individual votes remain confidential while still allowing for accurate tallies.",
          "interaction": "Users can create and participate in demo polls, observing how homomorphic encryption works."
        },
        {
          "name": "AES (Advanced Encryption Standard)",
          "description": "A symmetric encryption algorithm widely used across the globe for securing data.",
          "interaction": "Users can encrypt and decrypt messages using AES with various key sizes."
        },
        {
          "name": "ECC (Elliptic Curve Cryptography)",
          "description": "A public key cryptography approach based on the algebraic structure of elliptic curves over finite fields, offering high security with smaller keys.",
          "interaction": "Users can generate ECC keys and encrypt messages using ECC."
        },
        {
          "name": "ChaCha20",
          "description": "A modern stream cipher designed for high performance and security, often used in place of AES in certain applications.",
          "interaction": "Users can encrypt and decrypt data using ChaCha20 with a specified nonce."
        }
      ]
    },
    {
      "name": "Historical Encryption",
      "description": "Explore classic encryption methods and their historical significance.",
      "sub_features_1": [
        {
          "name": "Atbash",
          "description": "A simple monoalphabetic substitution cipher originally used on the Hebrew alphabet.",
          "interaction": "Users can encode and decode messages using the Atbash cipher."
        },
        {
          "name": "Caesar / ROT13",
          "description": "Famous shifting cipher used by Julius Caesar. Includes a ROT13 variant for easy letter shifting.",
          "interaction": "Users can shift text by specified values and observe the transformation."
        },
        {
          "name": "Monoalphabetic Substitution",
          "description": "A cipher that replaces letters with other letters or characters based on a fixed substitution.",
          "interaction": "Users can create their own substitution alphabet and encode messages."
        },
        {
          "name": "Railfence / Redefence",
          "description": "A transposition cipher that uses a rail fence pattern to encrypt messages.",
          "interaction": "Users can visualize how the railfence pattern alters their message."
        },
        {
          "name": "Multiplicative",
          "description": "A simple example for affine ciphers, where letters are replaced based on their position in the alphabet.",
          "interaction": "Users can apply the multiplicative method to encode text."
        },
        {
          "name": "Kamasutra",
          "description": "A substitution cipher described in the Kamasutra (400 BC), providing insight into historical cryptographic practices.",
          "interaction": "Users can encode and decode messages using this ancient cipher."
        },
        {
          "name": "Vigenère and Variants",
          "description": "The first strong polyalphabetic cipher that inspired many other ciphers, allowing for more complex encryption.",
          "interaction": "Users can input their own keywords to encrypt messages with the Vigenère cipher."
        },
        {
          "name": "XOR",
          "description": "A simple operation where single bits are XORed, forming a typical component of more complex ciphers.",
          "interaction": "Users can experiment with XOR operations on binary strings."
        },
        {
          "name": "Bit Shift",
          "description": "A method that shifts the characters of a text bit by bit, providing a straightforward form of encryption.",
          "interaction": "Users can see how bit shifting affects their input text."
        }
      ]
    },
    {
      "name": "Checksums (Hashing)",
      "description": "Tools for verifying data integrity and authenticity through hashing.",
      "sub_features_1": [
        {
          "name": "Certificate Verification",
          "description": "Experiment with certificate validity periods, signature creation, and verification dates. Pre-loaded example files are available for testing.",
          "interaction": "Users can upload certificates and explore their validity status and related details."
        },
        {
          "name": "SHA-256",
          "description": "A cryptographic hash function that generates a unique 256-bit hash value from input data, commonly used in data integrity checks.",
          "interaction": "Users can input data to generate its SHA-256 hash."
        },
        {
          "name": "MD5",
          "description": "A widely used hashing algorithm that produces a 128-bit hash value, often used for checksums and data verification.",
          "interaction": "Users can compute the MD5 hash of given input."
        }
      ]
    },
    {
      "name": "Encoding/Decoding",
      "description": "Methods for converting data to and from various formats.",
      "sub_features_1": [
        {
          "name": "ASCII",
          "description": "Encode and decode letters by replacing them with their ASCII code representations.",
          "interaction": "Users can input text and see the corresponding ASCII codes."
        },
        {
          "name": "Bacon",
          "description": "A coding technique that hides letters in sentences using a binary system.",
          "interaction": "Users can encode text using the Bacon cipher and visualize the hidden letters."
        },
        {
          "name": "Base64",
          "description": "An encoding scheme that converts binary data into an ASCII string format, commonly used in data transfer and storage.",
          "interaction": "Users can encode and decode data using Base64."
        },
        {
          "name": "URL Encoding",
          "description": "Encodes special characters in URLs to ensure they are transmitted correctly over the internet.",
          "interaction": "Users can input a URL and see its encoded version, as well as decode an encoded URL."
        },
        {
          "name": "Hexadecimal Encoding",
          "description": "Convert data into its hexadecimal representation, which is often used in programming and digital electronics.",
          "interaction": "Users can input data to see its hex representation and convert it back."
        },
        {
          "name": "Binary Encoding",
          "description": "Convert text to its binary equivalent, representing each character as a series of 0s and 1s.",
          "interaction": "Users can convert text to binary and decode binary back into text."
        },
        {
          "name": "ROT13",
          "description": "A simple letter substitution cipher that replaces a letter with the 13th letter after it in the alphabet.",
          "interaction": "Users can input text to encode or decode it using the ROT13 method."
        },
        {
          "name": "Morse Code",
          "description": "Encoding letters and numbers as sequences of dots and dashes, widely used in telecommunication.",
          "interaction": "Users can convert text to Morse code and vice versa."
        },
        {
          "name": "Custom Substitution Cipher",
          "description": "Allows users to create their own substitution cipher by defining custom mappings between letters and symbols.",
          "interaction": "Users can define a mapping and encode/decode messages accordingly."
        }
      ]
    },
    {
      "name": "Cryptanalysis",
      "description": "Tools for analyzing and breaking cryptographic systems.",
      "sub_features_1": [
        {
          "name": "Homophonic Substitution Analyzer",
          "description": "Manual analysis of homophonic substitution ciphers, useful for educational purposes and the DECRYPT project.",
          "interaction": "Users can analyze encoded messages and attempt to break the cipher."
        },
        {
          "name": "Neural Cipher Identifier",
          "description": "Utilizes AI to identify the cipher type from just a short given ciphertext.",
          "interaction": "Users can input ciphertext to see which cipher type is identified by the neural network."
        },
        {
          "name": "Frequency Analysis",
          "description": "Analyzes the frequency of letters in a given ciphertext to aid in breaking substitution ciphers.",
          "interaction": "Users can input a ciphertext and visualize letter frequencies."
        }
      ]
    }
  ]
}