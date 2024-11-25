from app.data.features_annotations import features_annotations

def test_get_computer_vision():
    features = features_annotations.get("features", [])
    # print("DEBUG: Features Data Loaded:", features)

    for feature in features:
        if feature.get("name") == "Computer Vision":
            print("DEBUG: Found Computer Vision:", feature)
            return feature

    raise ValueError("Annotation 'Computer Vision' not found.")

test_get_computer_vision()
