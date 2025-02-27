const video = document.getElementById("video");
const countdownEl = document.getElementById("countdown");
const counterEl = document.getElementById("counter");
const startCaptureBtn = document.getElementById("startCapture");
const previewContainer = document.querySelector(".preview-images");
const filterNameEl = document.getElementById("filterName");
const prevFilterBtn = document.getElementById("prevFilter");
const nextFilterBtn = document.getElementById("nextFilter");

const shutterSound = new Audio("shutter.mp3");
const countdownSound = new Audio("countdown.mp3");

let capturedPhotos = [];
let capturedCount = 0;
let currentFilterIndex = 0;

// Daftar filter yang akan diterapkan
const filters = [
    { name: "Normal", css: "none" },
    { name: "Sepia", css: "sepia(1)" },
    { name: "Grayscale", css: "grayscale(1)" },
    { name: "Blur", css: "blur(1px)" },
    { name: "Brightness", css: "brightness(1.5)" },
    { name: "Contrast", css: "contrast(1.5)" },
];

// Menentukan apakah perangkat adalah mobile
const isMobile = window.innerWidth <= 600;
const videoConstraints = {
    video: {
        facingMode: "user",
        width: isMobile ? { ideal: 480 } : { ideal: 640 },
        height: isMobile ? { ideal: 640 } : { ideal: 480 }
    }
};

// Mengakses kamera
navigator.mediaDevices.getUserMedia(videoConstraints)
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => console.error("Camera access denied", err));

// Fungsi untuk mengganti filter saat tombol prev/next ditekan
function changeFilter(direction) {
    currentFilterIndex = (currentFilterIndex + direction + filters.length) % filters.length;
    filterNameEl.textContent = filters[currentFilterIndex].name;
    video.style.filter = filters[currentFilterIndex].css;
}

function changeFilter(direction) {
    currentFilterIndex = (currentFilterIndex + direction + filters.length) % filters.length;
    filterNameEl.textContent = filters[currentFilterIndex].name;
    video.style.filter = filters[currentFilterIndex].css;
    
    // Munculkan filter name
    filterNameEl.style.opacity = "1";

    // Hilangkan setelah 1 detik
    setTimeout(() => {
        filterNameEl.style.opacity = "0";
    }, 1500);
}

// Event listener untuk tombol filter prev/next
prevFilterBtn.addEventListener("click", () => changeFilter(-1));
nextFilterBtn.addEventListener("click", () => changeFilter(1));

// Event listener untuk tombol "Start Capture"
startCaptureBtn.addEventListener("click", () => {
    capturedCount = 0;
    capturedPhotos = [];
    previewContainer.innerHTML = "";
    capturePhotoWithCountdown();
});

// Countdown sebelum memotret
function capturePhotoWithCountdown() {
    if (capturedCount >= 4) {
        redirectToDownload();
        return;
    }

    let timeLeft = 3; // Countdown 3 detik
    countdownEl.textContent = `Taking photo in ${timeLeft}...`;
    counterEl.textContent = `${capturedCount}/4`;
    countdownSound.play();
    
    const countdownInterval = setInterval(() => {
        timeLeft--;
        countdownEl.textContent = `Taking photo in ${timeLeft}...`;
        if (timeLeft === 1) {
            countdownSound.play();
        }
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            capturePhoto();
        }
    }, 1000);
}

// Fungsi untuk mengambil foto
function capturePhoto() {
    const canvas = document.createElement("canvas");
    canvas.width = isMobile ? 480 : 640;
    canvas.height = isMobile ? 640 : 480;
    const ctx = canvas.getContext("2d");

    // Flip horizontal agar hasil mirror seperti di kamera depan
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    // Terapkan efek filter ke gambar yang diambil
    ctx.filter = filters[currentFilterIndex].css;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoData = canvas.toDataURL("image/png");
    capturedPhotos.push(photoData);
    capturedCount++;
    counterEl.textContent = `${capturedCount}/4`;

    const imgElement = document.createElement("img");
    imgElement.src = photoData;
    imgElement.classList.add("preview-image");
    previewContainer.appendChild(imgElement);

    setTimeout(capturePhotoWithCountdown, 1000);
}

// Redirect ke halaman download
function redirectToDownload() {
    sessionStorage.setItem("capturedPhotos", JSON.stringify(capturedPhotos));
    window.location.href = "download.html";
}

