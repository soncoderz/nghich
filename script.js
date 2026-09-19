/* ==========================================================================
   INTERACTIVE JAVASCRIPT - CÓ YÊU ANH KHÔNG? (BÍCH PHƯỢNG SPECIAL VERSION)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCES ---
    const questionCard = document.getElementById('question-card');
    const celebrationCard = document.getElementById('celebration-card');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const noBtnText = document.getElementById('no-btn-text');
    const dodgeCounter = document.getElementById('dodge-counter');
    const dodgeCountSpan = document.getElementById('dodge-count');
    const typewriterText = document.getElementById('typewriter-text');
    const certDate = document.getElementById('cert-date');
    const reasonText = document.getElementById('reason-text');
    const generateReasonBtn = document.getElementById('generate-reason-btn');
    const sendMsgBtn = document.getElementById('send-msg-btn');
    const replayBtn = document.getElementById('replay-btn');
    const musicToggleBtn = document.getElementById('music-toggle-btn');
    const musicStatusText = document.getElementById('music-status-text');
    const mascotImg = document.getElementById('mascot-img');
    const bgAudio = document.getElementById('bg-audio');

    // State Variables
    let dodgeCount = 0;
    let yesBtnScale = 1;
    let isEscaping = false;
    let audioCtx = null;
    let isMusicPlaying = false;

    // --- FUNNY NO-BUTTON DODGE MESSAGES FOR BÍCH PHƯỢNG ---
    const dodgeMessages = [
        "Bích Phượng còn lâu 😜",
        "Đố Bích Phượng bắt được 🏃‍♀️",
        "Bích Phượng bấm CÓ đi mà! 💕",
        "Hế hế, Bích Phượng hụt rồi 😝",
        "Đừng cố nữa Bích Phượng ơi 🙈",
        "Nút CÓ ngon hơn Bích Phượng ơi 💖",
        "Hỏng nút rồi Bích Phượng ơi! 🤐",
        "Bích Phượng yêu anh đi mà! 🥰",
        "Không thể bấm được đâu 🚀",
        "Bích Phượng bé ngoan bấm CÓ đi 😘"
    ];

    // --- REASONS WHY I LOVE BÍCH PHƯỢNG ---
    const loveReasons = [
        "Vì nụ cười của Bích Phượng làm bừng sáng cả ngày của anh ✨",
        "Vì Bích Phượng luôn lắng nghe và hiểu anh nhất ❤️",
        "Vì lúc Bích Phượng nũng nịu siêu cấp đáng yêu 🧸",
        "Vì Bích Phượng là cô gái ngoan đáng yêu nhất trên đời 🌸",
        "Vì mỗi lần bên Bích Phượng, anh đều cảm thấy bình yên 🕊️",
        "Vì đôi mắt Bích Phượng đẹp như cả bầu trời sao 🌌",
        "Vì Bích Phượng rủ anh đi ăn nhiều món ngon 🍕😋",
        "Vì chỉ cần nhìn thấy Bích Phượng là anh quên hết mệt mỏi 💖",
        "Vì Bích Phượng chính là mảnh ghép hoàn hảo mà anh tìm kiếm 🧩",
        "Vì đơn giản... Bích Phượng là chính Bích Phượng! 🥰"
    ];

    // Set today's date in certificate
    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    if (certDate) certDate.textContent = dateStr;

    // ==========================================================================
    // 1. RUNAWAY "KHÔNG" BUTTON LOGIC (NÚT KHÔNG NÉ TRÁNH & NHẢY ĐI CHỖ KHÁC)
    // ==========================================================================

    function moveNoButton() {
        dodgeCount++;
        if (dodgeCounter.classList.contains('hidden')) {
            dodgeCounter.classList.remove('hidden');
        }
        dodgeCountSpan.textContent = dodgeCount;

        // Switch to absolute escaping mode if not already
        if (!isEscaping) {
            noBtn.classList.add('escaping');
            isEscaping = true;
        }

        // Calculate safe random coordinates within window viewport
        const btnWidth = noBtn.offsetWidth || 130;
        const btnHeight = noBtn.offsetHeight || 50;
        const padding = 25;

        const maxX = window.innerWidth - btnWidth - padding;
        const maxY = window.innerHeight - btnHeight - padding;

        const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
        const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;

        // Update button text with funny message for Bích Phượng
        const randomMsg = dodgeMessages[Math.floor(Math.random() * dodgeMessages.length)];
        noBtnText.textContent = randomMsg;

        // Show floating toast message at dodge location
        showDodgeToast(randomX + btnWidth / 2, randomY - 10, randomMsg);

        // Make YES button grow larger each time!
        yesBtnScale += 0.08;
        if (yesBtnScale <= 2.2) {
            yesBtn.style.transform = `scale(${yesBtnScale})`;
        }

        // Play subtle playful dodge sound
        playSqueakSound();
    }

    // Trigger dodge on hover, touch, pointer enter, or click attempt
    noBtn.addEventListener('mouseenter', moveNoButton);
    noBtn.addEventListener('mouseover', moveNoButton);
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    });
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        moveNoButton();
    });

    // Proximity check: move button when cursor gets within 90px
    document.addEventListener('mousemove', (e) => {
        const rect = noBtn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

        if (distance < 90) {
            moveNoButton();
        }
    });

    // Toast popup effect
    function showDodgeToast(x, y, text) {
        const toast = document.createElement('div');
        toast.className = 'dodge-toast';
        toast.textContent = text;
        toast.style.left = `${x}px`;
        toast.style.top = `${y}px`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 1000);
    }

    // ==========================================================================
    // 2. YES BUTTON CELEBRATION LOGIC (BẤM CÓ)
    // ==========================================================================

    yesBtn.addEventListener('click', () => {
        // Ensure background MP3 audio is playing
        playBackgroundMusic();

        // Sound celebration FX
        playCelebrationSound();

        // Confetti explosion
        triggerHeartConfetti();

        // Hide question card and show celebration card
        questionCard.classList.add('hidden');
        celebrationCard.classList.remove('hidden');
        celebrationCard.classList.add('fade-in');

        // Hide runaway button if floating
        noBtn.style.display = 'none';

        // Start Typewriter Love Letter
        const letterMessage = "Gửi Bích Phượng yêu của anh ❤️\nCảm ơn em đã chọn CÓ nha! Anh hứa sẽ luôn yêu thương, nhường nhịn và mang lại thật nhiều tiếng cười cho Bích Phượng mỗi ngày. Yêu Bích Phượng nhất trên đời! 🥰✨";
        startTypewriter(letterMessage);
    });

    // Typewriter effect function
    function startTypewriter(text) {
        typewriterText.textContent = "";
        let index = 0;
        const timer = setInterval(() => {
            if (index < text.length) {
                const char = text.charAt(index);
                typewriterText.textContent += (char === '\n') ? '\n' : char;
                index++;
            } else {
                clearInterval(timer);
            }
        }, 45);
    }

    // Canvas Confetti
    function triggerHeartConfetti() {
        if (typeof confetti === 'function') {
            // Main burst
            confetti({
                particleCount: 120,
                spread: 90,
                origin: { y: 0.6 },
                colors: ['#ff4e88', '#ff758c', '#ffb703', '#ffffff']
            });

            // Secondary heart burst stream
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;

            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }
                const particleCount = 40 * (timeLeft / duration);
                confetti({
                    particleCount,
                    startVelocity: 30,
                    spread: 360,
                    ticks: 60,
                    origin: { x: Math.random(), y: Math.random() - 0.2 },
                    colors: ['#ff4e88', '#ff758c', '#ffffff']
                });
            }, 250);
        }
    }

    // ==========================================================================
    // 3. REASON GENERATOR
    // ==========================================================================

    let lastReasonIndex = -1;
    generateReasonBtn.addEventListener('click', () => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * loveReasons.length);
        } while (randomIndex === lastReasonIndex && loveReasons.length > 1);

        lastReasonIndex = randomIndex;
        
        reasonText.style.opacity = '0';
        setTimeout(() => {
            reasonText.textContent = `"${loveReasons[randomIndex]}"`;
            reasonText.style.opacity = '1';
        }, 200);

        playSqueakSound();
    });

    // ==========================================================================
    // 4. ACTION BUTTONS (REPLAY & SEND MESSAGE)
    // ==========================================================================

    sendMsgBtn.addEventListener('click', () => {
        const msgText = "Bích Phượng vừa bấm CÓ rồi nè! Yêu anh nhiều lắm ❤️🥰";
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(msgText).then(() => {
                alert("Đã sao chép lời nhắn: \"" + msgText + "\"\nBây giờ Bích Phượng có thể dán gửi cho anh qua Messenger/Zalo nha! 💌");
            }).catch(() => {
                alert(msgText);
            });
        } else {
            alert(msgText);
        }
    });

    replayBtn.addEventListener('click', () => {
        // Reset states
        dodgeCount = 0;
        yesBtnScale = 1;
        isEscaping = false;

        dodgeCounter.classList.add('hidden');
        yesBtn.style.transform = 'scale(1)';
        noBtn.classList.remove('escaping');
        noBtn.style.display = 'inline-flex';
        noBtn.style.left = 'auto';
        noBtn.style.top = 'auto';
        noBtnText.textContent = "KHÔNG!";

        celebrationCard.classList.add('hidden');
        questionCard.classList.remove('hidden');
    });

    // ==========================================================================
    // 5. LOCAL MP3 AUDIO BACKGROUND MUSIC CONTROLS
    // ==========================================================================

    function initAudioContext() {
        if (!audioCtx) {
            const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
            if (AudioCtxClass) {
                audioCtx = new AudioCtxClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playSqueakSound() {
        initAudioContext();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }

    function playCelebrationSound() {
        initAudioContext();
        if (!audioCtx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.1);

            gain.gain.setValueAtTime(0.2, audioCtx.currentTime + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.1 + 0.4);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(audioCtx.currentTime + idx * 0.1);
            osc.stop(audioCtx.currentTime + idx * 0.1 + 0.4);
        });
    }

    function playBackgroundMusic() {
        if (!bgAudio) return;
        const playPromise = bgAudio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isMusicPlaying = true;
                if (musicStatusText) musicStatusText.textContent = "Tắt nhạc 🎶";
                if (musicToggleBtn) musicToggleBtn.classList.add('playing');
            }).catch((err) => {
                isMusicPlaying = false;
                if (musicStatusText) musicStatusText.textContent = "Bật nhạc 🎵";
                if (musicToggleBtn) musicToggleBtn.classList.remove('playing');
            });
        }
    }

    function pauseBackgroundMusic() {
        if (!bgAudio) return;
        bgAudio.pause();
        isMusicPlaying = false;
        if (musicStatusText) musicStatusText.textContent = "Bật nhạc 🎵";
        if (musicToggleBtn) musicToggleBtn.classList.remove('playing');
    }

    function toggleBackgroundMusic() {
        if (bgAudio && !bgAudio.paused) {
            pauseBackgroundMusic();
        } else {
            playBackgroundMusic();
        }
    }

    if (musicToggleBtn) {
        musicToggleBtn.addEventListener('click', toggleBackgroundMusic);
    }

    // Attempt direct autoplay on load
    playBackgroundMusic();

    // Auto play background music on ANY initial user interaction ("mở từ trước")
    const startAudioOnInteraction = () => {
        if (bgAudio && bgAudio.paused) {
            playBackgroundMusic();
        }
    };

    ['click', 'touchstart', 'mousemove', 'keydown', 'pointerdown'].forEach(evt => {
        document.addEventListener(evt, startAudioOnInteraction, { once: true });
    });

    // ==========================================================================
    // 6. BACKGROUND CANVAS FLOATING HEARTS ANIMATION
    // ==========================================================================

    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let hearts = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class FloatingHeart {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 20;
                this.size = Math.random() * 14 + 8;
                this.speedY = Math.random() * 1.5 + 0.5;
                this.speedX = Math.sin(Math.random() * Math.PI) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.3;
                this.hue = Math.random() * 40 + 330; // Pink-Red spectrum
            }

            update() {
                this.y -= this.speedY;
                this.x += Math.sin(this.y * 0.02) * 0.5;

                if (this.y < -30) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = `hsl(${this.hue}, 100%, 70%)`;
                ctx.beginPath();
                const topCurveHeight = this.size * 0.3;
                ctx.moveTo(this.x, this.y + topCurveHeight);
                ctx.bezierCurveTo(
                    this.x, this.y, 
                    this.x - this.size / 2, this.y, 
                    this.x - this.size / 2, this.y + topCurveHeight
                );
                ctx.bezierCurveTo(
                    this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2, 
                    this.x, this.y + this.size, 
                    this.x, this.y + this.size
                );
                ctx.bezierCurveTo(
                    this.x, this.y + this.size, 
                    this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2, 
                    this.x + this.size / 2, this.y + topCurveHeight
                );
                ctx.bezierCurveTo(
                    this.x + this.size / 2, this.y, 
                    this.x, this.y, 
                    this.x, this.y + topCurveHeight
                );
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
        }

        // Spawn initial hearts
        for (let i = 0; i < 35; i++) {
            hearts.push(new FloatingHeart());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            hearts.forEach(heart => {
                heart.update();
                heart.draw();
            });
            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();
    }
});

