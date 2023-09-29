let currentBackground = "../img/neck.png"; // Default background image
let isButtonClicked = false; // Track if the button is clicked

function changeBackground(backgroundImage) {
    currentBackground = backgroundImage;
    generateImage();
}

function generateImage() {
    const name = document.getElementById('nameInput').value;
    const canvas = document.getElementById('outputCanvas');
    const ctx = canvas.getContext('2d');
    const baseImage = new Image();
    baseImage.src = currentBackground;  // Use the current background image

    baseImage.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        if (isButtonClicked) {
            const necklaceOverlay = new Image();
            necklaceOverlay.src = "../img/necklace.png";  // Path to the necklace image

            necklaceOverlay.onload = function() {
                ctx.drawImage(necklaceOverlay, 0, 0, canvas.width, canvas.height);
                const textureImage = new Image();
                textureImage.src = "../img/gold.png";  // Path to the gold texture

                textureImage.onload = function() {
                    const pattern = ctx.createPattern(textureImage, 'repeat');
                    ctx.fillStyle = pattern;
                    ctx.font = '15px "Aref Ruqaa Ink", cursive';  // Updated font size
                    const textWidth = ctx.measureText(name).width;
                    const textX = (canvas.width - textWidth) / 1.88;
                    const textY = canvas.height - 50; // Adjust the vertical position
                    ctx.fillText(name, textX, textY);
                }
            }
        }
    }
}

// Add an event listener to track button click
document.querySelector('button').addEventListener('click', function() {
    isButtonClicked = true;
    generateImage();
});

// Initial image generation
generateImage();
