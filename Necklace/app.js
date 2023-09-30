let currentBackground = "../img/model-02.png"; // Default background image
let isButtonClicked = false; // Track if the button is clicked
let zoomFactor = 1.0; // Initial zoom factor
let canvasX = 0; // Initial canvas position (X)
let canvasY = 0; // Initial canvas position (Y)
let isPanning = false; // Track if panning is in progress
let panStartX = 0; // Initial panning start X-coordinate
let panStartY = 0; // Initial panning start Y-coordinate

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

function startPan(event) {
    isPanning = true;
    panStartX = event.clientX || event.touches[0].clientX;
    panStartY = event.clientY || event.touches[0].clientY;
}

function panImage(event) {
    if (!isPanning) return;

    const panX = (event.clientX || event.touches[0].clientX) - panStartX;
    const panY = (event.clientY || event.touches[0].clientY) - panStartY;

    // Calculate the maximum allowable canvas position to prevent revealing the background
    const maxCanvasXLeft = 0; // Maximum canvas position on the left (top-left corner)
    const maxCanvasYTop = 0; // Maximum canvas position on the top (top-left corner)
    const maxCanvasXRight = canvas.width - (canvas.width * zoomFactor); // Maximum canvas position on the right (bottom-right corner)
    const maxCanvasYBottom = canvas.height - (canvas.height * zoomFactor); // Maximum canvas position on the bottom (bottom-right corner)

    // Update the canvas position based on the panning offsets
    canvasX += panX;
    canvasY += panY;

    // Ensure the canvas position stays within the maximum limits to prevent revealing the background
    canvasX = Math.min(Math.max(canvasX, maxCanvasXRight), maxCanvasXLeft);
    canvasY = Math.min(Math.max(canvasY, maxCanvasYBottom), maxCanvasYTop);

    generateImage();

    // Update the panning start position
    panStartX = event.clientX || event.touches[0].clientX;
    panStartY = event.clientY || event.touches[0].clientY;
}

function endPan() {
    isPanning = false;
}

function generateImage() {
    const name = document.getElementById('nameInput').value;
    const canvas = document.getElementById('outputCanvas');
    const ctx = canvas.getContext('2d');
    const baseImage = new Image();
    baseImage.src = currentBackground;

    baseImage.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        // Calculate the scaled dimensions for the canvas
        const scaledWidth = canvas.width * zoomFactor;
        const scaledHeight = canvas.height * zoomFactor;
        const translateX = (canvas.width - scaledWidth) / 2;
        const translateY = (canvas.height - scaledHeight) / 2;

        ctx.drawImage(baseImage, canvasX + translateX, canvasY + translateY, scaledWidth, scaledHeight);

        if (isButtonClicked) {
            const necklaceOverlay = new Image();
            necklaceOverlay.src = "../img/necklace.png";
            necklaceOverlay.onload = function () {
                ctx.drawImage(necklaceOverlay, canvasX + translateX, canvasY + translateY, scaledWidth, scaledHeight);

                const textureImage = new Image();
                textureImage.src = "../img/gold.png";
                textureImage.onload = function () {
                    const pattern = ctx.createPattern(textureImage, 'repeat');
                    ctx.fillStyle = pattern;
                    const textFontSize = 15 * zoomFactor; // Adjust font size with zoom
                    ctx.font = `${textFontSize}px "Noto Nastaliq Urdu"`;

                    const textWidth = ctx.measureText(name).width;
                    const textX = canvasX + translateX + (scaledWidth - textWidth) / 1.86;
                    const textY = canvasY + translateY + scaledHeight - (48 * zoomFactor); // Adjust vertical position with zoom

                    // Add a drop shadow to the text
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Shadow color
                    ctx.shadowBlur = 5 * zoomFactor; // Shadow blur radius
                    ctx.shadowOffsetX = 2 * zoomFactor; // Shadow X offset
                    ctx.shadowOffsetY = 2 * zoomFactor; // Shadow Y offset

                    ctx.fillText(name, textX, textY);

                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                };
            };
        } else {
            toggleThumbnailVisibility();
        }
    };
}

function downloadImage() {
    const canvas = document.getElementById('outputCanvas');
    const imageDataURL = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream"); 
    const downloadLink = document.createElement('a');
    downloadLink.href = imageDataURL;
    downloadLink.download = 'generated-image.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}


// Add event listeners for zoom buttons
document.getElementById('zoomInButton').addEventListener('click', zoomIn);
document.getElementById('zoomOutButton').addEventListener('click', zoomOut);

// Add event listeners for mouse/touch events to handle panning
const canvas = document.getElementById('outputCanvas');
canvas.addEventListener('mousedown', startPan);
canvas.addEventListener('touchstart', startPan);
canvas.addEventListener('mousemove', panImage);
canvas.addEventListener('touchmove', panImage);
canvas.addEventListener('mouseup', endPan);
canvas.addEventListener('touchend', endPan);

document.querySelector('button').addEventListener('click', function () {
    isButtonClicked = true;
    generateImage();
});

// Initial image generation
generateImage();
