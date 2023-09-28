function generateImage() {
    const name = document.getElementById('nameInput').value;
    
    const canvas = document.getElementById('outputCanvas');
    const ctx = canvas.getContext('2d');
    
    const baseImage = new Image();
    baseImage.src = "../img/neck.png";  // Path to the neck image

    baseImage.onload = function() {
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        const necklaceOverlay = new Image();
        necklaceOverlay.src = "../img/necklace.png";  // Path to the necklace image

        necklaceOverlay.onload = function() {
            ctx.drawImage(necklaceOverlay, 0, 0, canvas.width, canvas.height);
            
            const textureImage = new Image();
            textureImage.src = "../img/gold.png";  // Path to the gold texture

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
