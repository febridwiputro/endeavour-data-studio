select * from public.users u 

UPDATE users
SET 
    user_photo = 'https://www.svgrepo.com/show/65453/avatar.svg',
    full_name = 'Febri Dwi Putro',
    phone_number = '+6289677888558',
    updated_at = NOW()
WHERE id = 1;


select * from public.verification_codes vc 

select * from public.menu_tbl mt 

select * from public.annotation_projects_tbl apt 

select * from public.annotation_project_features_tbl apft

select * from public.menu_tbl mt 

SELECT n.nspname AS schema, t.typname AS type
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace;
--WHERE t.typname = 'menustype';

DROP TYPE IF EXISTS menustype, annotationtype, annotateresulttypeenum, deliverytype CASCADE;


INSERT INTO menu_tbl (id, name, description, is_active, menu_metadata, logo_url, created_by, updated_by, created_at, updated_at)
VALUES
    (1, 'Annotations', 'Annotations tool for various tasks.', TRUE, NULL, 'https://www.svgrepo.com/show/310716/annotations.svg', 1, NULL, NOW(), NOW()),
    (2, 'Image Editor', 'Image Editor tool for various tasks.', TRUE, NULL, 'https://www.svgrepo.com/show/274053/image.svg', 1, NULL, NOW(), NOW()),
    (3, 'Text Editor', 'Text Editor tool for various tasks.', TRUE, NULL, 'https://www.svgrepo.com/show/105333/text.svg', 1, NULL, NOW(), NOW()),
    (4, 'Audio Editor', 'Audio Editor tool for various tasks.', TRUE, NULL, 'https://www.svgrepo.com/show/20559/audio.svg', 1, NULL, NOW(), NOW()),
    (5, 'Video Editor', 'Video Editor tool for various tasks.', TRUE, NULL, 'https://www.svgrepo.com/show/277067/video.svg', 1, NULL, NOW(), NOW()),
    (6, 'Numeric Data Editor', 'Numeric Data Editor tool for various tasks.', TRUE, NULL, 'https://www.svgrepo.com/show/17112/data.svg', 1, NULL, NOW(), NOW()),
    (7, 'Dataset Split', 'Dataset Split tool for various tasks.', TRUE, NULL, 'https://www.svgrepo.com/show/219892/dataset.svg', 1, NULL, NOW(), NOW()),
    (8, 'Document Editor', 'Document Editor tool for various tasks.', TRUE, NULL, 'https://www.svgrepo.com/show/16144/document.svg', 1, NULL, NOW(), NOW()),
    (9, 'URL Extractor', 'URL Extractor tool for various tasks.', TRUE, NULL, 'https://www.svgrepo.com/show/12325/url.svg', 1, NULL, NOW(), NOW()),
    (10, 'JSON Editor', 'JSON Editor tool for various tasks.', TRUE, NULL, 'https://www.svgrepo.com/show/349117/json.svg', 1, NULL, NOW(), NOW()),
    (11, 'Image Color Picker', 'Image Color Picker tool for various tasks.', TRUE, NULL, 'https://www.svgrepo.com/show/419889/color-picker.svg', 1, NULL, NOW(), NOW()),
    (12, 'Regex Editor', 'Regex Editor tool for various tasks.', TRUE, NULL, 'https://www.svgrepo.com/show/203836/regex.svg', 1, NULL, NOW(), NOW()),
    (13, 'Cryptography Generator', 'Cryptography Generator tool for various tasks.', TRUE, NULL, 'https://www.svgrepo.com/show/407117/cryptography.svg', 1, NULL, NOW(), NOW());

-- Insert into annotation_feature_tbl
INSERT INTO annotation_feature_tbl (
    name, 
    code_name, 
    description, 
    menu_id, 
    is_active, 
    logo_url, 
    created_by, 
    created_at
)
VALUES
    ('Computer Vision', 'COMPUTER_VISION', 'Computer vision-related projects', 1, TRUE, NULL, 1, NOW()),
    ('Natural Language Processing (NLP)', 'NLP', 'NLP-related projects', 1, TRUE, NULL, 1, NOW()),
    ('Audio', 'AUDIO', 'Audio processing-related projects', 1, TRUE, NULL, 1, NOW()),
    ('Conversational AI', 'CONVERSATIONAL_AI', 'Conversational AI-related projects', 1, TRUE, NULL, 1, NOW()),
    ('Ranking & Scoring', 'RANKING_SCORING', 'Ranking and scoring-related projects', 1, TRUE, NULL, 1, NOW()),
    ('Structured Data Parsing', 'STRUCTURED_DATA_PARSING', 'Structured data parsing projects', 1, TRUE, NULL, 1, NOW()),
    ('Time Series Analysis', 'TIME_SERIES_ANALYSIS', 'Time series analysis-related projects', 1, TRUE, NULL, 1, NOW()),
    ('Video', 'VIDEO', 'Video-related projects', 1, TRUE, NULL, 1, NOW()),
    ('Generative AI', 'GENERATIVE_AI', 'Generative AI-related projects', 1, TRUE, NULL, 1, NOW());

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


-- Insert into annotation_projects_tbl
INSERT INTO annotation_projects_tbl (
    name, 
    description, 
    project_photo_url, 
    sub_feature_2_id, 
    created_by, 
    created_at, 
    updated_at
)
VALUES
    (
        'Automatic License Plate Recognition', 
        'Detects and recognizes license plates in vehicle images.', 
        'https://www.batamnews.co.id/foto_berita/2023/04/2023-04-10-kenapa-mobil-di-batam-tak-boleh-dibawa-keluar-pulau-batam-atau-mudik.jpeg', 
        (SELECT id FROM sub_feature_2_tbl WHERE name = 'Object Detection'), 
        1, 
        NOW(), 
        NOW()
    ),
    (
        'Object Detection for Street Signs', 
        'Detects and classifies different types of street signs.', 
        'https://upload.wikimedia.org/wikipedia/commons/6/69/Street_sign_in_Germany.jpg', 
        (SELECT id FROM sub_feature_2_tbl WHERE name = 'Semantic Segmentation'), 
        1, 
        NOW(), 
        NOW()
    ),
    (
        'Fruit Detection in Markets', 
        'Detects and identifies fruits in market images.', 
        'https://images.unsplash.com/photo-1572441719534-2c5c93d5ed32', 
        (SELECT id FROM sub_feature_2_tbl WHERE name = 'Image Classification'), 
        1, 
        NOW(), 
        NOW()
    ),
    (
        'Helmet Detection for Riders', 
        'Detects whether motorbike riders are wearing helmets.', 
        'https://images.unsplash.com/photo-1531916990615-cb61b8b5950f', 
        (SELECT id FROM sub_feature_2_tbl WHERE name = 'Object Detection'), 
        1, 
        NOW(), 
        NOW()
    ),
    (
        'Animal Detection in Wildlife', 
        'Detects and classifies wild animals in forest images.', 
        NULL,
        NULL,
        1, 
        NOW(), 
        NOW()
    ),
    (
        'Facial Mask Detection', 
        'Detects if individuals in images are wearing face masks.', 
        'https://images.unsplash.com/photo-1605902711622-cfb43c4437d7', 
        (SELECT id FROM sub_feature_2_tbl WHERE name = 'Keypoint Labeling'), 
        1, 
        NOW(), 
        NOW()
    );
