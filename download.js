const finalCanvas = document.getElementById("finalCanvas");
const ctx = finalCanvas.getContext("2d");
const downloadBtn = document.getElementById("download-btn");
const colorButtons = document.querySelectorAll(".color-btn");


let selectedFrameColor = "img/nude.png"; // Default frame

let capturedPhotos = JSON.parse(sessionStorage.getItem("capturedPhotos")) || [];

if (capturedPhotos.length === 0) {
    console.error("No photos found in sessionStorage.");
}

// Canvas dimensions
const canvasWidth = 240;
const imageHeight = 160;
const spacing = 10;
const framePadding = 10;
const logoSpace = 100;

finalCanvas.width = canvasWidth;
finalCanvas.height = framePadding + (imageHeight + spacing) * capturedPhotos.length + logoSpace;

// Function to draw the collage
function drawCollage() {
    const background = new Image();
    background.src = selectedFrameColor;

    background.onload = () => {
        ctx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
        ctx.drawImage(background, 0, 0, finalCanvas.width, finalCanvas.height);

        capturedPhotos.forEach((photo, index) => {
            const img = new Image();
            img.src = photo;

            img.onload = () => {
                const x = framePadding;
                const y = framePadding + index * (imageHeight + spacing);
                ctx.drawImage(img, x, y, canvasWidth - 2 * framePadding, imageHeight);
            };

            img.onerror = () => console.error(`Failed to load image ${index + 1}`);
        });

        // Draw the logo immediately after the background
        drawLogo();
    };

    background.onerror = () => console.error("Failed to load background image.");
}

// Function to draw the logo
function drawLogo() {
    const logoY = finalCanvas.height - logoSpace + 35;

    // Cek apakah warna background gelap
    const isDarkBackground = selectedFrameColor.includes("black") || selectedFrameColor.includes("dark");

    // Tentukan warna teks berdasarkan warna frame
    const textColor = isDarkBackground ? "#FFF" : "#000"; // Putih jika background gelap, hitam jika terang

    // Gambar teks sebagai logo
    ctx.font = "18px Arial";
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.fillText("eBooth.js", canvasWidth / 2, logoY);

    // Tambahkan Timestamp di bawah logo
    const timestamp = sessionStorage.getItem("photoTimestamp") || "Unknown Time";
    ctx.font = "15px Arial";
    ctx.fillStyle = textColor;
    ctx.fillText(timestamp, canvasWidth / 2, logoY + 20);
}


// Change frame color and redraw instantly
colorButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        selectedFrameColor = event.target.getAttribute("data-color");
        drawCollage();
    });
});

// Download the final image
downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = finalCanvas.toDataURL("image/png");
    link.download = "photobooth.png";
    link.click();
});

// Initial drawing
drawCollage();

// Menambahkan elemen HTML untuk stiker
const stickerButtons = document.querySelectorAll(".sticker-btn");
let selectedSticker = null; // Tidak ada stiker secara default

// Event listener untuk memilih stiker
stickerButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        selectedSticker = event.target.getAttribute("data-sticker");
        drawCollage();
    });
});

// Function to draw the collage
// Memperbarui fungsi drawCollage agar bisa menambahkan stiker ke seluruh canvas
function drawCollage() {
    const background = new Image();
    background.src = selectedFrameColor;

    background.onload = () => {
        ctx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
        ctx.drawImage(background, 0, 0, finalCanvas.width, finalCanvas.height);

        capturedPhotos.forEach((photo, index) => {
            const img = new Image();
            img.src = photo;

            img.onload = () => {
                const x = framePadding;
                const y = framePadding + index * (imageHeight + spacing);
                ctx.drawImage(img, x, y, canvasWidth - 2 * framePadding, imageHeight);
            };
        });

        drawLogo();

        // Jika ada stiker yang dipilih, tambahkan ke seluruh canvas
        if (selectedSticker) {
            const sticker = new Image();
            sticker.src = selectedSticker;
            sticker.onload = () => {
                ctx.drawImage(sticker, 0, 0, finalCanvas.width, finalCanvas.height);
            };
        }
    };
}