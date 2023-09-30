let currentBackground = "../img/neck.png"; // Default background image
let isButtonClicked = false; // Track if the button is clicked
let zoomFactor = 1.0; // Initial zoom factor
let canvasX = 0; // Initial canvas position (X)
let canvasY = 0; // Initial canvas position (Y)

const MAX_ZOOM_IN = 3.0; // Maximum zoom in factor (300%)
const MAX_ZOOM_OUT = 1.0; // Maximum zoom out factor (100%)

function changeBackground(backgroundImage) {
    currentBackground = backgroundImage;
    generateImage();
}

function toggleThumbnailVisibility() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumbnail) => {
        thumbnail.style.display = 'block'; // Show the thumbnails
    });
}

function zoomIn() {
    zoomFactor *= 1.1; // Increase the zoom factor by 10%
    if (zoomFactor > MAX_ZOOM_IN) {
        zoomFactor = MAX_ZOOM_IN; // Limit zoom factor to maximum zoom in
    }
    generateImage();
}

function zoomOut() {
    zoomFactor *= 0.9; // Decrease the zoom factor by 10%
    if (zoomFactor < MAX_ZOOM_OUT) {
        zoomFactor = MAX_ZOOM_OUT; // Limit zoom factor to maximum zoom out
    }
    generateImage();
}

function generateImage() {
    const name = document.getElementById('nameInput').value;
    const canvas = document.getElementById('outputCanvas');
    const ctx = canvas.getContext('2d');
    const baseImage = new Image();
    baseImage.src = currentBackground; // Use the current background image

    baseImage.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        // Calculate the scaled dimensions for the canvas
        const scaledWidth = canvas.width * zoomFactor;
        const scaledHeight = canvas.height * zoomFactor;

        // Update canvas position to keep the center of the canvas fixed while zooming
        canvasX = (canvas.width - scaledWidth) / 2;
        canvasY = (canvas.height - scaledHeight) / 2;

        // Draw the base image with scaling and position adjustments
        ctx.drawImage(baseImage, canvasX, canvasY, scaledWidth, scaledHeight);

        if (isButtonClicked) {
            const necklaceOverlay = new Image();
            necklaceOverlay.src = "../img/necklace.png"; // Path to the necklace image

            necklaceOverlay.onload = function () {
                // Draw the necklace overlay with scaling and position adjustments
                ctx.drawImage(necklaceOverlay, canvasX, canvasY, scaledWidth, scaledHeight);

                const textureImage = new Image();
                textureImage.src = "../img/gold.png"; // Path to the gold texture

                textureImage.onload = function () {
                    const pattern = ctx.createPattern(textureImage, 'repeat');
                    ctx.fillStyle = pattern;
                    const textFontSize = 15 * zoomFactor; // Adjust font size with zoom
                    ctx.font = `${textFontSize}px "Aref Ruqaa Ink", cursive`; // Updated font size

                    // Calculate the text position based on the scaled canvas size
                    const textWidth = ctx.measureText(name).width;
                    const textX = canvasX + (scaledWidth - textWidth) / 2;
                    const textY = canvasY + scaledHeight - (20 * zoomFactor); // Adjust vertical position with zoom
                    ctx.fillText(name, textX, textY);
                };
            };
        } else {
            // If the button is not clicked, hide the thumbnails
            toggleThumbnailVisibility();
        }
    };
}

// Add event listeners for zoom buttons
document.getElementById('zoomInButton').addEventListener('click', zoomIn);
document.getElementById('zoomOutButton').addEventListener('click', zoomOut);

// Add an event listener to track button click
document.querySelector('button').addEventListener('click', function () {
    isButtonClicked = true;
    generateImage();
});

// Initial image generation
generateImage();
