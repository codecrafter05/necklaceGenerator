function generateImage() {
    const name = document.getElementById('nameInput').value;
    
    const canvas = document.getElementById('outputCanvas');
    const ctx = canvas.getContext('2d');
    
    const baseImage = new Image();
    baseImage.src = "img/neck.png"; 

    baseImage.onload = function() {
        // Draw the base image first
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        const necklaceOverlay = new Image();
        necklaceOverlay.src = "img/necklace.png"; 

        necklaceOverlay.onload = function() {
            // Draw the necklace overlay
            ctx.drawImage(necklaceOverlay, 0, 0, canvas.width, canvas.height);
            
            // Load texture for the text
            const textureImage = new Image();
            textureImage.src = "img/gold.png"; // REPLACE with your texture path

            textureImage.onload = function() {
                const pattern = ctx.createPattern(textureImage, 'repeat');
                ctx.fillStyle = pattern;
                ctx.font = 'bold 20px Arial';
                const textWidth = ctx.measureText(name).width;
                ctx.fillText(name, (canvas.width - textWidth) / 2, canvas.height / 2);
            }
        }
    }
}

//end ofe the code is her 
