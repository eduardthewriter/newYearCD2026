// --- MUSIC LOGIC ---
        const musicBtn = document.getElementById('music-toggle');
        const musicIconOn = document.getElementById('music-icon-on');
        const musicIconOff = document.getElementById('music-icon-off');
        const bgMusic = document.getElementById('bg-music');
        let isMusicPlaying = false;

        musicBtn.addEventListener('click', () => {
            if (isMusicPlaying) {
                bgMusic.pause();
                musicIconOn.classList.add('hidden');
                musicIconOff.classList.remove('hidden');
            } else {
                bgMusic.play().catch(err => console.error("Audio play failed", err));
                musicIconOn.classList.remove('hidden');
                musicIconOff.classList.add('hidden');
            }
            isMusicPlaying = !isMusicPlaying;
        });
// --- COUNTDOWN LOGIC ---
        const nextYear = new Date().getFullYear() + 1;
        let targetDate = new Date(`January 1, 2026 00:00:00`).getTime();
        
        if (new Date().getTime() > targetDate) {
             const currentYear = new Date().getFullYear();
             targetDate = new Date(`January 1, ${currentYear + 1} 00:00:00`).getTime();
             document.querySelector('h1').innerText = currentYear + 1;
        }

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        const countdownContainer = document.getElementById('countdown');
        const messageContainer = document.getElementById('new-year-message');
        const videoElement = document.getElementById('celebration-video');

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                if (!countdownContainer.classList.contains('hidden')) {
                    countdownContainer.classList.add('hidden');
                    messageContainer.classList.remove('hidden');
                    messageContainer.classList.add('flex');
                    
                    videoElement.currentTime = 0;
                    videoElement.play().catch(e => console.log("Auto-play prevented (browser policy):", e));
                    
                    // Trigger Nexus Surge (Particle Speed Up)
                    particles.forEach(p => {
                        p.vx *= 8;
                        p.vy *= 8;
                        // Turn particles gold/bright cyan for celebration
                        p.color = Math.random() > 0.5 ? 'rgba(0, 242, 255, 0.8)' : 'rgba(255, 215, 0, 0.8)';
                    });
                }
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysEl.innerText = days < 10 ? '0' + days : days;
            hoursEl.innerText = hours < 10 ? '0' + hours : hours;
            minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
            secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
        }

        setInterval(updateCountdown, 1000);
        updateCountdown();

        // --- DEV TOOL ---
        function triggerDevTest() {
            targetDate = new Date().getTime() + 3000;
            countdownContainer.classList.remove('hidden');
            messageContainer.classList.add('hidden');
            messageContainer.classList.remove('flex');
            videoElement.pause();
            updateCountdown();
        }

        // --- BACKGROUND PARTICLE EFFECT ---
        const canvas = document.getElementById('bgCanvas');
        const ctx = canvas.getContext('2d');
        
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4; // Slower, smoother float
                this.vy = (Math.random() - 0.5) * 0.4;
                this.size = Math.random() * 2;
                
                // Nexus Palette for particles
                const colors = [
                    `rgba(0, 242, 255, ${Math.random() * 0.4})`,   // Cyan
                    `rgba(189, 0, 255, ${Math.random() * 0.4})`,   // Violet
                    `rgba(60, 100, 255, ${Math.random() * 0.3})`,  // Deep Blue
                    `rgba(255, 255, 255, ${Math.random() * 0.2})`  // White
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 120; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach((p, index) => {
                p.update();
                p.draw();
                
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < 110) {
                        // Cyan connecting lines
                        ctx.strokeStyle = `rgba(0, 242, 255, ${0.08 * (1 - dist/110)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animate);
        }

        animate();

