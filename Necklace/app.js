let currentBackground = "../img/model-01.png"; // Default background image
let isButtonClicked = false; // Track if the button is clicked
let zoomFactor = 1.0; // Initial zoom factor
let canvasX = 0; // Initial canvas position (X)
let canvasY = 0; // Initial canvas position (Y)
let isPanning = false; // Track if panning is in progress
let panStartX = 0; // Initial panning start X-coordinate
let panStartY = 0; // Initial panning start Y-coordinate
let imageIndex = 0; // Index of the current image

const MAX_ZOOM_IN = 3.0; // Maximum zoom in factor (300%)
const MAX_ZOOM_OUT = 1.0; // Maximum zoom out factor (100%)

let isNecklaceVisible = false; // Track if the necklace is visible

function changeBackground(backgroundImage, newIndex) {
  currentBackground = backgroundImage;
  imageIndex = newIndex; // Set the imageIndex based on the selected background
  generateImage();
}

function toggleThumbnailVisibility() {
  const thumbnails = document.querySelectorAll(".thumbnail");
  thumbnails.forEach((thumbnail) => {
    thumbnail.style.display = "block"; // Show the thumbnails
  });
}

function zoomIn() {
  zoomFactor *= 1.1; 
  if (zoomFactor > MAX_ZOOM_IN) {
    zoomFactor = MAX_ZOOM_IN; 
  }
  generateImage();
}

function zoomOut() {
  zoomFactor *= 0.9; 
  if (zoomFactor < MAX_ZOOM_OUT) {
    zoomFactor = MAX_ZOOM_OUT; 
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

  canvasX += panX;
  canvasY += panY;

  generateImage();

  panStartX = event.clientX || event.touches[0].clientX;
  panStartY = event.clientY || event.touches[0].clientY;
}

function endPan() {
  isPanning = false;
}

function generateImage() {
    const name = document.getElementById("nameInput").value;
    const canvas = document.getElementById("outputCanvas");
    const ctx = canvas.getContext("2d");
    const baseImage = new Image();
    baseImage.src = currentBackground;
  
    baseImage.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height); 
  
      const scaledWidth = canvas.width * zoomFactor;
      const scaledHeight = canvas.height * zoomFactor;
      const translateX = (canvas.width - scaledWidth) / 2;
      const translateY = (canvas.height - scaledHeight) / 2;
  
      ctx.drawImage(
        baseImage,
        canvasX + translateX,
        canvasY + translateY,
        scaledWidth,
        scaledHeight
      );

      if (isButtonClicked && currentBackground !== "../img/model-02.png" &&
          currentBackground !== "../img/model-03.png" &&
          currentBackground !== "../img/model-04.png" &&
          currentBackground !== "../img/model-05.png") {
        
        const necklaceOverlay = new Image();
        necklaceOverlay.src = "../img/necklace.png";
        necklaceOverlay.onload = function () {
            ctx.drawImage(
              necklaceOverlay,
              canvasX + translateX,
              canvasY + translateY,
              scaledWidth,
              scaledHeight
            );
        };
      }

      const textureImage = new Image();
    textureImage.src = "../img/gold.png";
    textureImage.onload = function () {
        const pattern = ctx.createPattern(textureImage, "repeat");
        ctx.fillStyle = pattern;

        let textPositionX, textPositionY;
        let fontSize = 20; // A default fontSize, adjust as needed

        if (currentBackground === "../img/model-01.png") {
            const anchorPoint1X = translateX + 245 * zoomFactor + canvasX;
            const anchorPoint2X = translateX + scaledWidth - 220 * zoomFactor + canvasX;

            const maxAllowedFontSize = anchorPoint2X - anchorPoint1X;
            fontSize = maxAllowedFontSize;
            while (fontSize > 0) {
                ctx.font = `${fontSize}px "Noto Nastaliq Urdu"`;
                const textWidth = ctx.measureText(name).width;
                if (textWidth <= maxAllowedFontSize) {
                    break;
                }
                fontSize--;
            }

            const textWidth = ctx.measureText(name).width;
            textPositionX = anchorPoint1X + (maxAllowedFontSize - textWidth) / 2;
            textPositionY = translateY + scaledHeight - 48 * zoomFactor + canvasY;
        } else {
            // For other images, choose a default position and font size
            ctx.font = `${fontSize}px "Noto Nastaliq Urdu"`;
            textPositionX = canvas.width / 2 - ctx.measureText(name).width / 2; // Center the text
            textPositionY = canvas.height - 50; // Adjust as required for other images
        }

        ctx.fillText(name, textPositionX, textPositionY);
    };
}
    };


function downloadImage() {
  const canvas = document.getElementById("outputCanvas");
  const imageDataURL = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  const downloadLink = document.createElement("a");
  downloadLink.href = imageDataURL;
  downloadLink.download = "generated-image.png";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

document.getElementById("zoomInButton").addEventListener("click", zoomIn);
document.getElementById("zoomOutButton").addEventListener("click", zoomOut);

const canvas = document.getElementById("outputCanvas");
canvas.addEventListener("mousedown", startPan);
canvas.addEventListener("touchstart", startPan);
canvas.addEventListener("mousemove", panImage);
canvas.addEventListener("touchmove", panImage);
canvas.addEventListener("mouseup", endPan);
canvas.addEventListener("touchend", endPan);

document.querySelector("button").addEventListener("click", function () {
  isButtonClicked = true;
  generateImage();
});

generateImage();
