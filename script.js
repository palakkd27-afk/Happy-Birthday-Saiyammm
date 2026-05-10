document.addEventListener('DOMContentLoaded', function() {

    // --- Live Age Counter ---
    const birthDate = new Date('2004-05-11T00:00:00');
    const countdownElement = document.getElementById('countdown');

    function updateAge() {
        const now = new Date();

        let years = now.getFullYear() - birthDate.getFullYear();
        let months = now.getMonth() - birthDate.getMonth();
        let days = now.getDate() - birthDate.getDate();
        let hours = now.getHours() - birthDate.getHours();
        let minutes = now.getMinutes() - birthDate.getMinutes();
        let seconds = now.getSeconds() - birthDate.getSeconds();

        if (seconds < 0) { seconds += 60; minutes--; }
        if (minutes < 0) { minutes += 60; hours--; }
        if (hours < 0) { hours += 24; days--; }
        if (days < 0) {
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
            months--;
        }
        if (months < 0) { months += 12; years--; }

        countdownElement.innerHTML = `${years}y ${months}m ${days}d <br> ${hours}h ${minutes}m ${seconds}s`;
    }
    setInterval(updateAge, 1000);
    updateAge();

    // --- Initialize AOS (Animate on Scroll) ---
    AOS.init({
        duration: 800,
        once: true,
    });

    // --- Initialize LightGallery ---
    lightGallery(document.getElementById('lightgallery'), {
        speed: 500,
        download: false
    });

    // --- Hall of Fame Scroller ---
    const scroller = document.getElementById('hall-of-fame-scroller');
    const scrollLeftBtn = document.getElementById('scroll-left-btn');
    const scrollRightBtn = document.getElementById('scroll-right-btn');
    if (scroller && scrollLeftBtn && scrollRightBtn) {
        const card = scroller.querySelector('.snap-center');
        const cardWidth = card.offsetWidth + parseInt(getComputedStyle(card.parentElement).gap);

        scrollRightBtn.addEventListener('click', () => {
            scroller.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });
        scrollLeftBtn.addEventListener('click', () => {
            scroller.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });
    }

    // --- Video Uploader ---
    const videoUploadInput = document.getElementById('video-upload');
    const videoPlayer = document.getElementById('video-player');
    const videoUploadLabel = document.getElementById('video-upload-label');

    if(videoUploadInput && videoPlayer && videoUploadLabel) {
        videoUploadLabel.addEventListener('click', () => {
            videoUploadInput.click();
        });

        videoUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const videoURL = URL.createObjectURL(file);
                videoPlayer.src = videoURL;
                videoPlayer.classList.remove('hidden');
                videoUploadLabel.classList.add('hidden');
                videoPlayer.play();
            }
        });
    }


    // --- Falling Heart Animation ---
    const canvas = document.getElementById('sakura-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let hearts = [];
        const numHearts = 50;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function Heart() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height * 2 - canvas.height;
            this.size = 18 + Math.random() * 20;
            this.opacity = 0.5 + Math.random() * 0.5;
            this.xSpeed = 1 + Math.random() * 2;
            this.ySpeed = 1 + Math.random() * 1.5;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            this.color = `hsl(${330 + Math.random() * 20}, 90%, ${65 + Math.random() * 10}%)`;
        }

        Heart.prototype.draw = function() {
            const x = this.x;
            const y = this.y;
            const s = this.size;
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(x, y);
            ctx.rotate(this.rotation);
            ctx.beginPath();
            ctx.moveTo(0, -s * 0.25);
            ctx.bezierCurveTo(0, -s * 0.8, -s, -s * 0.8, -s, -s * 0.15);
            ctx.bezierCurveTo(-s, s * 0.35, -s * 0.45, s * 0.8, 0, s);
            ctx.bezierCurveTo(s * 0.45, s * 0.8, s, s * 0.35, s, -s * 0.15);
            ctx.bezierCurveTo(s, -s * 0.8, 0, -s * 0.8, 0, -s * 0.25);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }

        Heart.prototype.update = function() {
            this.x += this.xSpeed;
            this.y += this.ySpeed;
            this.rotation += this.rotationSpeed;
            if (this.y - this.size > canvas.height || this.x - this.size > canvas.width) {
                this.x = Math.random() * canvas.width;
                this.y = -this.size * 2;
                this.xSpeed = 1 + Math.random() * 2;
                this.ySpeed = 1 + Math.random() * 1.5;
                this.rotation = Math.random() * Math.PI * 2;
                this.color = `hsl(${330 + Math.random() * 20}, 90%, ${65 + Math.random() * 10}%)`;
            }
            this.draw();
        }

        function createHearts() {
            hearts = [];
            for (let i = 0; i < numHearts; i++) {
                hearts.push(new Heart());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            hearts.forEach(heart => heart.update());
            requestAnimationFrame(animate);
        }

        createHearts();
        animate();
    }
});

