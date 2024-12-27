select * from public.users u 

select * from public.verification_codes vc 

select * from public.menu_tbl mt 

select * from public.annotation_projects_tbl apt 

select * from public.annotation_type_tbl att

select * from public.menu_tbl mt 

SELECT n.nspname AS schema, t.typname AS type
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace;
--WHERE t.typname = 'menustype';

DROP TYPE IF EXISTS menustype, annotationtype, annotateresulttypeenum, deliverytype CASCADE;



INSERT INTO annotation_type_tbl (name, code_name, description, is_active, created_by, created_at)
VALUES
    ('Computer Vision', 'COMPUTER_VISION', 'Computer vision-related projects', true, 1, NOW()),
    ('Natural Language Processing (NLP)', 'NLP', 'NLP-related projects', true, 1, NOW()),
    ('Audio', 'AUDIO', 'Audio processing-related projects', true, 1, NOW()),
    ('Conversational AI', 'CONVERSATIONAL_AI', 'Conversational AI-related projects', true, 1, NOW()),
    ('Ranking & Scoring', 'RANKING_SCORING', 'Ranking and scoring-related projects', true, 1, NOW()),
    ('Structured Data Parsing', 'STRUCTURED_DATA_PARSING', 'Structured data parsing projects', true, 1, NOW()),
    ('Time Series Analysis', 'TIME_SERIES_ANALYSIS', 'Time series analysis-related projects', true, 1, NOW()),
    ('Video', 'VIDEO', 'Video-related projects', true, 1, NOW()),
    ('Generative AI', 'GENERATIVE_AI', 'Generative AI-related projects', true, 1, NOW());


INSERT INTO menu_tbl (name, description, type, is_active, menu_metadata, logo_url, created_by, created_at)
VALUES
    ('Annotations', 'Annotations tool for various tasks.', 'ANNOTATIONS', TRUE, NULL, 'https://www.svgrepo.com/show/310716/annotations.svg', 1, NOW()),
    ('Image Editor', 'Image Editor tool for various tasks.', 'IMAGE_EDITOR', TRUE, NULL, 'https://www.svgrepo.com/show/274053/image.svg', 1, NOW()),
    ('Text Editor', 'Text Editor tool for various tasks.', 'TEXT_EDITOR', TRUE, NULL, 'https://www.svgrepo.com/show/105333/text.svg', 1, NOW()),
    ('Audio Editor', 'Audio Editor tool for various tasks.', 'AUDIO_EDITOR', TRUE, NULL, 'https://www.svgrepo.com/show/20559/audio.svg', 1, NOW()),
    ('Video Editor', 'Video Editor tool for various tasks.', 'VIDEO_EDITOR', TRUE, NULL, 'https://www.svgrepo.com/show/277067/video.svg', 1, NOW()),
    ('Numeric Data Editor', 'Numeric Data Editor tool for various tasks.', 'NUMERIC_DATA_EDITOR', TRUE, NULL, 'https://www.svgrepo.com/show/17112/data.svg', 1, NOW()),
    ('Dataset Split', 'Dataset Split tool for various tasks.', 'DATASET_SPLIT', TRUE, NULL, 'https://www.svgrepo.com/show/219892/dataset.svg', 1, NOW()),
    ('Document Editor', 'Document Editor tool for various tasks.', 'DOCUMENT_EDITOR', TRUE, NULL, 'https://www.svgrepo.com/show/16144/document.svg', 1, NOW()),
    ('URL Extractor', 'URL Extractor tool for various tasks.', 'URL_EXTRACTOR', TRUE, NULL, 'https://www.svgrepo.com/show/12325/url.svg', 1, NOW()),
    ('JSON Editor', 'JSON Editor tool for various tasks.', 'JSON_EDITOR', TRUE, NULL, 'https://www.svgrepo.com/show/349117/json.svg', 1, NOW()),
    ('Image Color Picker', 'Image Color Picker tool for various tasks.', 'IMAGE_COLOR_PICKER', TRUE, NULL, 'https://www.svgrepo.com/show/419889/color-picker.svg', 1, NOW()),
    ('Regex Editor', 'Regex Editor tool for various tasks.', 'REGEX_EDITOR', TRUE, NULL, 'https://www.svgrepo.com/show/203836/regex.svg', 1, NOW()),
    ('Cryptography Generator', 'Cryptography Generator tool for various tasks.', 'CRYPTOGRAPHY_GENERATOR', TRUE, NULL, 'https://www.svgrepo.com/show/407117/cryptography.svg', 1, NOW());


INSERT INTO annotation_projects_tbl (name, description, annotation_type_id, project_photo_url, menu_id, created_by) VALUES
('Automatic License Plate Recognition', 'Detects and recognizes license plates in vehicle images.', 1, 'https://www.batamnews.co.id/foto_berita/2023/04/2023-04-10-kenapa-mobil-di-batam-tak-boleh-dibawa-keluar-pulau-batam-atau-mudik.jpeg', 1, 1),
('Object Detection for Street Signs', 'Detects and classifies different types of street signs.', 1, 'https://upload.wikimedia.org/wikipedia/commons/6/69/Street_sign_in_Germany.jpg', 1, 1),
('Fruit Detection in Markets', 'Detects and identifies fruits in market images.', 1, 'https://images.unsplash.com/photo-1572441719534-2c5c93d5ed32', 1, 1),
('Helmet Detection for Riders', 'Detects whether motorbike riders are wearing helmets.', 1, 'https://images.unsplash.com/photo-1531916990615-cb61b8b5950f', 1, 1),
('Animal Detection in Wildlife', 'Detects and classifies wild animals in forest images.', 1, 'https://images.unsplash.com/photo-1546182990-dffeafbe841d', 1, 1),
('Facial Mask Detection', 'Detects if individuals in images are wearing face masks.', 1, 'https://images.unsplash.com/photo-1605902711622-cfb43c4437d7', 1, 1);

INSERT INTO annotation_projects_tbl (name, description, annotation_type_id, project_photo_url, menu_id, created_by) VALUES
('Sentiment Analysis Tool', 'Analyzes the sentiment of user reviews and comments.', 2, 'https://images.unsplash.com/photo-1547658716-571c01c0b7b9', 1, 1),
('Named Entity Recognition', 'Identifies named entities like names, dates, and locations in text.', 2, 'https://images.unsplash.com/photo-1581091870634-76f36ff54c5c', 1, 1),
('Chatbot Development', 'A chatbot designed for answering frequently asked questions.', 2, 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b', 1, 1),
('Text Summarization', 'Generates concise summaries from long documents.', 2, 'https://images.unsplash.com/photo-1559028012-d36657a1d4a2', 1, 1),
('Language Translation Model', 'Translates text from one language to another.', 2, 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c', 1, 1),
('Speech-to-Text Conversion', 'Converts spoken audio into text format.', 2, 'https://images.unsplash.com/photo-1522071820081-009f0129c71c', 1, 1);

INSERT INTO annotation_projects_tbl (name, description, annotation_type_id, project_photo_url, menu_id, created_by) VALUES
('Audio Transcription', 'Transcribes spoken audio into text format.', 3, 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846', 1, 1),
('Speaker Identification', 'Identifies speakers in an audio recording.', 3, 'https://images.unsplash.com/photo-1522071820081-009f0129c71c', 1, 1),
('Noise Classification', 'Classifies different types of noise in audio files.', 3, 'https://images.unsplash.com/photo-1547658716-571c01c0b7b9', 1, 1),
('Audio Event Detection', 'Detects specific events or sounds in audio recordings.', 3, 'https://images.unsplash.com/photo-1503428593586-e225b39bddfe', 1, 1),
('Speech Emotion Recognition', 'Analyzes emotions expressed in speech.', 3, 'https://images.unsplash.com/photo-1604908177872-2c00ef3f1117', 1, 1),
('Keyword Spotting', 'Identifies specific keywords in audio data.', 3, 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c', 1, 1);
























-- Insert into menu_tbl
INSERT INTO menu_tbl (name, description, is_active, created_by, created_at)
VALUES
('Annotations', 'Various features to annotate and label data using computer vision techniques, including object detection, segmentation, and face recognition.', TRUE, 1, NOW());

-- Insert into annotation_feature_tbl
INSERT INTO annotation_feature_tbl (name, description, menu_id, is_active, created_by, created_at)
VALUES
('Computer Vision', 'Computer vision-based annotation features for labeling and processing images and videos.',
 (SELECT id FROM menu_tbl WHERE name = 'Annotations'), TRUE, 1, NOW());

-- Insert into sub_feature_1_tbl
INSERT INTO sub_feature_1_tbl (name, description, feature_id, created_by, created_at)
VALUES
('Basic Annotations', 'Basic techniques for image segmentation, object detection, and labeling.',
 (SELECT id FROM annotation_feature_tbl WHERE name = 'Computer Vision'), 1, NOW()),
('Advanced Cases', 'More advanced use cases and techniques for annotation in computer vision.',
 (SELECT id FROM annotation_feature_tbl WHERE name = 'Computer Vision'), 1, NOW()),
('Special Cases', 'Specialized cases such as face recognition, license plate recognition, and manufacturing inspection.',
 (SELECT id FROM annotation_feature_tbl WHERE name = 'Computer Vision'), 1, NOW());

-- Insert into sub_feature_2_tbl for "Basic Annotations"
INSERT INTO sub_feature_2_tbl (name, description, sub_feature_1_id, created_by, created_at)
VALUES
('Semantic Segmentation', 'Label segments within an image using various annotation techniques.',
 (SELECT id FROM sub_feature_1_tbl WHERE name = 'Basic Annotations'), 1, NOW()),
('Object Detection', 'Detect objects in images and label them with bounding boxes.',
 (SELECT id FROM sub_feature_1_tbl WHERE name = 'Basic Annotations'), 1, NOW()),
('Keypoint Labeling', 'Label important points on objects or humans for pose estimation and tracking.',
 (SELECT id FROM sub_feature_1_tbl WHERE name = 'Basic Annotations'), 1, NOW()),
('Image Captioning', 'Add descriptions and tags to images for context and classification.',
 (SELECT id FROM sub_feature_1_tbl WHERE name = 'Basic Annotations'), 1, NOW()),
('Image Classification', 'Classify images using multiple classes or labels.',
 (SELECT id FROM sub_feature_1_tbl WHERE name = 'Basic Annotations'), 1, NOW());

-- Insert into sub_feature_3_tbl for "Semantic Segmentation"
INSERT INTO sub_feature_3_tbl (name, description, sub_feature_2_id, created_by, created_at)
VALUES
('Polygons', 'Mark areas in images using polygons to define specific segments.',
 (SELECT id FROM sub_feature_2_tbl WHERE name = 'Semantic Segmentation'), 1, NOW()),
('Masks', 'Use masks to isolate and mark regions of an image.',
 (SELECT id FROM sub_feature_2_tbl WHERE name = 'Semantic Segmentation'), 1, NOW()),
('Freehand Segmentation', 'Annotate complex areas using freehand tools like brushes.',
 (SELECT id FROM sub_feature_2_tbl WHERE name = 'Semantic Segmentation'), 1, NOW()),
('Boundary Box Refinement', 'Manually refine object boundaries using edge detection algorithms.',
 (SELECT id FROM sub_feature_2_tbl WHERE name = 'Semantic Segmentation'), 1, NOW()),
('Multi-class Segmentation', 'Support for multi-class segmentation where a single image can have different object classes.',
 (SELECT id FROM sub_feature_2_tbl WHERE name = 'Semantic Segmentation'), 1, NOW());

-- Insert into sub_feature_3_tbl for "Object Detection"
INSERT INTO sub_feature_3_tbl (name, description, sub_feature_2_id, created_by, created_at)
VALUES
('Bounding Boxes', 'Mark objects in images using rectangular bounding boxes.',
 (SELECT id FROM sub_feature_2_tbl WHERE name = 'Object Detection'), 1, NOW()),
('3D Bounding Boxes', 'Annotate objects using 3D bounding boxes for 3D images or lidar.',
 (SELECT id FROM sub_feature_2_tbl WHERE name = 'Object Detection'), 1, NOW()),
('Confidence Scoring', 'Add confidence scores to detected objects.',
 (SELECT id FROM sub_feature_2_tbl WHERE name = 'Object Detection'), 1, NOW()),
('Instance Segmentation', 'Individually segment objects within the same class.',
 (SELECT id FROM sub_feature_2_tbl WHERE name = 'Object Detection'), 1, NOW()),
('Occlusion Detection', 'Annotate parts of objects that are occluded by other objects.',
 (SELECT id FROM sub_feature_2_tbl WHERE name = 'Object Detection'), 1, NOW());

-- Insert into sub_feature_3_tbl for "Keypoint Labeling"
INSERT INTO sub_feature_3_tbl (name, description, sub_feature_2_id, created_by, created_at)
VALUES
('Human Pose Estimation', 'Label keypoints on the human body for pose estimation.',
 (SELECT id FROM sub_feature_2_tbl WHERE name = 'Keypoint Labeling'), 1, NOW()),
('Facial Keypoint Detection', 'Label keypoints on facial features such as eyes, nose, and lips.',
 (SELECT id FROM sub_feature_2_tbl WHERE name = 'Keypoint Labeling'), 1, NOW()),
('Object Keypoints', 'Label keypoints on non-human objects such as vehicles or tools.',
 (SELECT id FROM sub_feature_2_tbl WHERE name = 'Keypoint Labeling'), 1, NOW()),
('Skeleton Tracking', 'Track the skeleton or structure of humans or objects in motion.',
 (SELECT id FROM sub_feature_2_tbl WHERE name = 'Keypoint Labeling'), 1, NOW());

-- Insert into annotation_projects_tbl
INSERT INTO annotation_projects_tbl (name, description, annotation_feature_id, created_by, project_photo_url, created_at)
VALUES
('Automatic License Plate Recognition', 'Detects and recognizes license plates in vehicle images.',
 (SELECT id FROM annotation_feature_tbl WHERE name = 'Computer Vision'), 1,
 'https://www.batamnews.co.id/foto_berita/2023/04/2023-04-10-kenapa-mobil-di-batam-tak-boleh-dibawa-keluar-pulau-batam-atau-mudik.jpeg', NOW()),
('Object Detection for Street Signs', 'Detects and classifies different types of street signs.',
 (SELECT id FROM annotation_feature_tbl WHERE name = 'Computer Vision'), 1,
 'https://upload.wikimedia.org/wikipedia/commons/6/69/Street_sign_in_Germany.jpg', NOW());