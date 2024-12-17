$(document).ready(function () {
    $("#upload-btn").click(function () {
        const fileInput = $("#file-input")[0];
        const formData = new FormData();

        if (fileInput.files.length === 0) {
            alert("Please select an image first!");
            return;
        }

        formData.append("file", fileInput.files[0]);

        // Display the uploaded image
        const imageURL = URL.createObjectURL(fileInput.files[0]);
        $("#uploaded-image").attr("src", imageURL);

        // Clear existing bounding boxes
        $(".bounding-box, .label").remove();

        // Send the image to the FastAPI backend
        $.ajax({
            url: "http://127.0.0.1:8000/yolo/predict", // Updated endpoint URL
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                // Draw bounding boxes
                const imageElement = $("#uploaded-image")[0];
                const imageContainer = $("#image-container");

                const imageWidth = imageElement.naturalWidth;
                const imageHeight = imageElement.naturalHeight;

                const containerWidth = imageContainer.width();
                const containerHeight = imageContainer.height();

                const scaleX = containerWidth / imageWidth;
                const scaleY = containerHeight / imageHeight;

                response.forEach(pred => {
                    const { x1, y1, x2, y2 } = pred.bounding_box;
                    const className = pred.class_name;
                    const confidence = (pred.confidence * 100).toFixed(2);

                    // Scale coordinates to match resized image
                    const scaledX1 = x1 * scaleX;
                    const scaledY1 = y1 * scaleY;
                    const scaledX2 = x2 * scaleX;
                    const scaledY2 = y2 * scaleY;

                    const box = $("<div>").addClass("bounding-box").css({
                        left: `${scaledX1}px`,
                        top: `${scaledY1}px`,
                        width: `${scaledX2 - scaledX1}px`,
                        height: `${scaledY2 - scaledY1}px`,
                        border: "2px solid #00FF00", // Green bounding box
                        position: "absolute"
                    });

                    const label = $("<div>").addClass("label").text(`${className} ${confidence}%`).css({
                        left: `${scaledX1}px`,
                        top: `${scaledY1 - 20}px`,
                        color: "white",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        padding: "2px 5px",
                        position: "absolute",
                        fontSize: "12px"
                    });

                    imageContainer.append(box, label);
                });
            },
            error: function (err) {
                console.error("Error:", err);
                alert("Prediction failed. Please check the server.");
            }
        });
    });
});
