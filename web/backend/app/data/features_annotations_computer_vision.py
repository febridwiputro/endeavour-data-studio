features_annotations_computer_vision = {
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
        }