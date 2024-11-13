features_image_color_picker = {
  "name": "Image Color Picker",
  "description": "Extract specific colors from any image and use a color picker for manual color selection.",
  "features": [
    {
      "name": "Pick Color from Image",
      "description": "Select and identify specific colors directly from an uploaded image.",
      "sub_features_1": [
        {
          "name": "Dominant Color",
          "description": "Identify the dominant color present in the image."
        },
        {
          "name": "Palette Color",
          "description": "Generate a color palette based on the colors found in the image."
        }
      ]
    },
    {
      "name": "Color Picker",
      "description": "Access a color picker tool to manually select colors without an image.",
      "sub_features_1": [
        {
          "name": "Pick Color",
          "description": "Choose a color from different sources displayed on the color picker canvas.",
          "options": [
            {
              "name": "Sampler",
              "description": "Colors from the sampler."
            },
            {
              "name": "Spectrum",
              "description": "Colors from the full spectrum."
            },
            {
              "name": "Image",
              "description": "Colors from the uploaded image. Ensure an image is loaded."
            }
          ]
        },
        {
          "name": "Pixel Color",
          "description": "Click on the canvas to select a color.",
          "details": [
            {
              "name": "Pixel Color",
              "description": "The color of the selected pixel in HEX format, with additional formats available."
            },
            {
              "name": "Magnifier",
              "description": "Magnifies the cursor when hovering over the canvas."
            },
            {
              "name": "Zoom",
              "description": "Allows zooming in and out, available when the source is an image."
            }
          ]
        },
        {
          "name": "Pixel Color Coordinates",
          "description": "Displays the coordinates of the selected pixel.",
          "details": [
            {
              "name": "Pixel X",
              "description": "The x-axis coordinate."
            },
            {
              "name": "Pixel Y",
              "description": "The y-axis coordinate."
            }
          ]
        },
        {
          "name": "Edit and Convert Color Code",
          "description": "Set or get the current color in various formats.",
          "sub_features_1": [
            {
              "name": "HEX & HTML",
              "description": "The hexadecimal representation of the RGB components and color notation in HTML/CSS format.",
              "fields": [
                {
                  "name": "HEX",
                  "description": "The hexadecimal color code."
                },
                {
                  "name": "HTML / CSS",
                  "description": "The HTML/CSS color notation or name (e.g., 'turquoise')."
                }
              ]
            }
          ]
        },
        {
          "name": "Pinned Colors",
          "description": "Track favorite colors and persist them across sessions.",
          "actions": [
            "Pin or unpin the current color.",
            "Clear all pinned colors.",
            "Load colors from an existing file.",
            "Save pinned colors to a file."
          ]
        },
        {
          "name": "Color Format",
          "description": "Select the format for editing or converting the current color components."
        },
        {
          "name": "Color Components",
          "description": "Set or get the components of the color in the current format, including opacity for the alpha channel (0-100%).",
          "fields": [
            {
              "name": "Red",
              "description": "Set the red component value (0-255)."
            },
            {
              "name": "Green",
              "description": "Set the green component value (0-255)."
            },
            {
              "name": "Blue",
              "description": "Set the blue component value (0-255)."
            },
            {
              "name": "Opacity",
              "description": "Set the opacity value (0-100%)."
            }
          ]
        }
      ]
    }
  ]
}
