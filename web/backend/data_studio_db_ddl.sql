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

select * from public.annotation_project_data_tbl apdt

select * from public.image_metadata_tbl imt

select * from public.image_annotation_result_tbl iart

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
    (13, 'Cryptography Generator', 'Cryptography Generator tool for various tasks.', TRUE, NULL, 'https://www.svgrepo.com/show/407117/cryptography.svg', 1, NULL, NOW(), NOW()),
    (14, 'Data Visualization', 'Data Visualization tool for various tasks.', TRUE, NULL, 'https://www.svgrepo.com/show/526885/chart-2.svg', 1, NULL, NOW(), NOW()),
    (15, 'Data Scraper', 'A web scraping tool for extracting structured data from web pages.', TRUE, NULL, 'https://www.svgrepo.com/show/310722/web-scraping.svg', 1, NULL, NOW(), NOW()),
    (16, 'Geospatial Data Editor', 'Tools for analyzing, visualizing, and editing geospatial data.', TRUE, NULL, 'https://www.svgrepo.com/show/310733/map.svg', 1, NULL, NOW(), NOW());

UPDATE menu_tbl 
SET logo_url = CASE 
    WHEN name = 'Annotations' THEN '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
</svg>'
    WHEN name = 'Image Editor' THEN '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
</svg>'
    WHEN name = 'Text Editor' THEN '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
</svg>'
    WHEN name = 'Audio Editor' THEN '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
</svg>'
    WHEN name = 'Video Editor' THEN '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
</svg>'
    WHEN name = 'Numeric Data Editor' THEN '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
</svg>'
    WHEN name = 'Dataset Split' THEN '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
</svg>'
    WHEN name = 'Document Editor' THEN '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
</svg>'
    WHEN name = 'URL Extractor' THEN '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
</svg>'
    WHEN name = 'JSON Editor' THEN '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
</svg>'
    WHEN name = 'Image Color Picker' THEN '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
</svg>'
    WHEN name = 'Regex Editor' THEN '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
</svg>'
    WHEN name = 'Cryptography Generator' THEN '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
</svg>'
    ELSE logo_url
END;

UPDATE menu_tbl
SET logo_url = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>'
WHERE name = 'Data Visualization';

UPDATE menu_tbl
SET logo_url = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 9.75h15m-15 4.5h15m-15 0H3.75m15.75 0h.75M3 6h18m-15 4.5H2.25m15.75 0H21m-18 0v7.5m15-7.5v7.5" /></svg>'
WHERE name = 'Data Scraper';

UPDATE menu_tbl
SET logo_url = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15.75A6.75 6.75 0 1 1 15.75 8.25m-7.5 7.5L2.25 21 8.25 15.75Zm7.5 0c-1.992 1.992-5.232 1.992-7.224 0" /></svg>'
WHERE name = 'Geospatial Data Editor';



--UPDATE menu_tbl 
--SET logo_url = CASE 
--    WHEN name = 'Annotations' THEN 'https://cdn-icons-png.flaticon.com/512/1040/1040232.png'
--    WHEN name = 'Image Editor' THEN 'https://cdn-icons-png.flaticon.com/512/1829/1829586.png'
--    WHEN name = 'Text Editor' THEN 'https://cdn-icons-png.flaticon.com/512/3208/3208674.png'
--    WHEN name = 'Audio Editor' THEN 'https://cdn-icons-png.flaticon.com/512/4052/4052984.png'
--    WHEN name = 'Video Editor' THEN 'https://cdn-icons-png.flaticon.com/512/3447/3447791.png'
--    WHEN name = 'Numeric Data Editor' THEN 'https://cdn-icons-png.flaticon.com/512/901/901972.png'
--    WHEN name = 'Dataset Split' THEN 'https://cdn-icons-png.flaticon.com/512/751/751381.png'
--    WHEN name = 'Document Editor' THEN 'https://cdn-icons-png.flaticon.com/512/3135/3135769.png'
--    WHEN name = 'URL Extractor' THEN 'https://cdn-icons-png.flaticon.com/512/2910/2910051.png'
--    WHEN name = 'JSON Editor' THEN 'https://cdn-icons-png.flaticon.com/512/2910/2910327.png'
--    WHEN name = 'Image Color Picker' THEN 'https://cdn-icons-png.flaticon.com/512/2387/2387641.png'
--    WHEN name = 'Regex Editor' THEN 'https://cdn-icons-png.flaticon.com/512/906/906361.png'
--    WHEN name = 'Cryptography Generator' THEN 'https://cdn-icons-png.flaticon.com/512/1973/1973828.png'
--    ELSE logo_url
--END;


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
        NULL, -- No project_photo_url provided
        NULL, -- No sub_feature_2_id associated
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


INSERT INTO classes_and_tags_tbl (
    id, 
    class_name, 
    class_color, 
    updated_by, 
    updated_at, 
    project_id, 
    tag_name, 
    created_by, 
    created_at
)
VALUES
(1, 'car', '#fcba03', NULL, '2025-01-03T04:28:32.306354', 1, NULL, 1, '2025-01-03T04:28:32.306354'),
(2, 'plate', '#fc0303', NULL, '2025-01-03T04:28:48.852572', 1, NULL, 1, '2025-01-03T04:28:48.852572'),
(3, 'pickup', '#fc0303', NULL, '2025-01-03T04:29:08.945837', 1, NULL, 1, '2025-01-03T04:29:08.945837'),
(4, 'sedan', '#00478a', NULL, '2025-01-03T04:29:23.352099', 1, NULL, 1, '2025-01-03T04:29:23.352099'),
(5, 'minibus', '#8a0053', NULL, '2025-01-03T04:29:41.962686', 1, NULL, 1, '2025-01-03T04:29:41.962686'),
(6, 'bus', '#5a008a', NULL, '2025-01-03T04:30:11.271497', 1, NULL, 1, '2025-01-03T04:30:11.271497'),
(7, 'motorcycle', '#705454', 1, '2025-01-03T07:43:25.401794', 1, '', 1, '2025-01-03T07:11:57.410441');


select * from public.annotate_tbl
select * from public.annotate_result_tbl

# .env

POSTGRES_DB=data_studio_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOSTNAME=127.0.0.1
POSTGRES_HOST=localhost
DATABASE_PORT=5432

ACCESS_TOKEN_EXPIRES_IN=1440
REFRESH_TOKEN_EXPIRES_IN=2880

SECRET_KEY=your-secret-key
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
JWT_ALGORITHM = "HS256" # "RS256"

SERVER_HOST=0.0.0.0
SERVER_PORT=8000

YOLO_MODEL_PATH= "D:/dataset/vehicle_detection/car-plate-detection/kendaraan.v1i.yolov8/runs/detect/vehicle-plate-model-n/weights/best.pt"

CLIENT_ORIGIN=http://localhost:3000