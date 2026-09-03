/* ==========================================================================
   STUDENT ACADEMIC PORTAL & PRANK DASHBOARD - SCRIPT
   Secure, Interactive & Fully Responsive Vanilla JavaScript Application
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const loginScreen = document.getElementById('loginScreen');
  const loadingScreen = document.getElementById('loadingScreen');
  const prankScreen = document.getElementById('prankScreen');
  const portalForm = document.getElementById('portalForm');
  
  const studentNameInput = document.getElementById('studentName');
  const rollNoInput = document.getElementById('rollNo');
  
  const displayStudentName = document.getElementById('displayStudentName');
  const displayRollNo = document.getElementById('displayRollNo');
  
  const progressFill = document.getElementById('progressFill');
  const loadingMessage = document.getElementById('loadingMessage');
  
  const monkeyContainer = document.getElementById('monkeyInteractive');
  const speechBubble = document.getElementById('speechBubble');
  const pupilLeft = document.getElementById('pupilLeft');
  const pupilRight = document.getElementById('pupilRight');
  const monkeyMouth = document.getElementById('monkeyMouth');
  const particleContainer = document.getElementById('particleContainer');
  
  const throwBananaBtn = document.getElementById('throwBananaBtn');
  const danceBtn = document.getElementById('danceBtn');
  const tauntBtn = document.getElementById('tauntBtn');
  const squeakBtn = document.getElementById('squeakBtn');
  const downloadCertBtn = document.getElementById('downloadCertBtn');
  const resetPrankBtn = document.getElementById('resetPrankBtn');
  const certCanvas = document.getElementById('certCanvas');
  const monkeyTongue = document.getElementById('monkeyTongue');
  
  const poseDefault = document.getElementById('poseDefault');
  const poseThumbsDown = document.getElementById('poseThumbsDown');
  const poseRockOn = document.getElementById('poseRockOn');
  const posePeace = document.getElementById('posePeace');

  // State Variables
  let currentStudentName = 'Student';
  let currentRollNo = '2026-CS-001';
  let isDancing = false;
  let isTaunting = false;
  let audioCtx = null;

  function showPose(targetPose) {
    [poseDefault, poseThumbsDown, poseRockOn, posePeace].forEach(pose => {
      if (pose) pose.style.display = 'none';
    });
    if (targetPose) targetPose.style.display = 'block';
  }

  // Speech Quotes Database
  const monkeyQuotes = [
    "OOH OOH AAH AAH! 🍌",
    "Give me all your bananas!",
    "Certified 100% Code Monkey!",
    "Where is my homework? I ate it!",
    "Prank level: EXPERT! 🐒",
    "Banana score: 999,999!"
  ];

  // --------------------------------------------------------------------------
  // WEB AUDIO API SYNTHESIZER (No external audio files needed!)
  // --------------------------------------------------------------------------
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Play Squeak / Boing Sound Effect
  function playSqueakSound() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Graceful fallback if Web Audio is restricted
    }
  }

  // Play Fanfare / Melody Sound
  function playFanfare() {
    try {
      const ctx = getAudioContext();
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C E G C E
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        const startTime = ctx.currentTime + idx * 0.1;
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch (e) {}
  }

  // Play Pop / Banana Catch Sound
  function playPopSound() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }

  // --------------------------------------------------------------------------
  // SCREEN TRANSITIONS & NAVIGATION
  // --------------------------------------------------------------------------
  function switchScreen(activeScreen) {
    [loginScreen, loadingScreen, prankScreen].forEach(screen => {
      screen.classList.remove('active');
    });
    activeScreen.classList.add('active');
  }

  // Form Submission Handler
  portalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameVal = studentNameInput.value.trim();
    const rollVal = rollNoInput.value.trim();

    if (!nameVal || !rollVal) {
      return;
    }

    currentStudentName = nameVal;
    currentRollNo = rollVal;

    // Start Loading Sequence
    switchScreen(loadingScreen);
    startLoadingSequence();
  });

  // Loading Sequence Logic
  function startLoadingSequence() {
    const steps = [
      { pct: '20%', msg: 'Connecting to Central Academic Database...' },
      { pct: '45%', msg: 'Retrieving Confidential Semester Records...' },
      { pct: '70%', msg: 'Running Neural IQ & Mischief Analysis...' },
      { pct: '90%', msg: 'Finalizing Student Classification...' },
      { pct: '100%', msg: 'Match Confirmed! Redirecting...' }
    ];

    let currentStep = 0;
    progressFill.style.width = '0%';

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        progressFill.style.width = steps[currentStep].pct;
        loadingMessage.textContent = steps[currentStep].msg;
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(showPrankDashboard, 400);
      }
    }, 500);
  }

  // Display Prank Dashboard safely using textContent
  function showPrankDashboard() {
    switchScreen(prankScreen);

    // SECURE DOM INSERTION (Prevents XSS vulnerabilities)
    displayStudentName.textContent = currentStudentName;
    displayRollNo.textContent = currentRollNo;

    // Set custom speech quote
    speechBubble.textContent = `Aha! ${currentStudentName} (Roll: ${currentRollNo}) is officially a MONKEY! 🐒`;

    // Trigger visual & audio rewards
    playFanfare();
    triggerConfetti();
  }

  // Reset Prank
  resetPrankBtn.addEventListener('click', () => {
    portalForm.reset();
    isDancing = false;
    monkeyContainer.classList.remove('dancing');
    switchScreen(loginScreen);
  });

  // --------------------------------------------------------------------------
  // INTERACTIVE MONKEY FEATURES
  // --------------------------------------------------------------------------
  
  // Pupil Eye Tracking (Follows Cursor)
  document.addEventListener('mousemove', (e) => {
    if (!prankScreen.classList.contains('active')) return;

    const rect = monkeyContainer.getBoundingClientRect();
    const monkeyCenterX = rect.left + rect.width / 2;
    const monkeyCenterY = rect.top + rect.height / 2;

    const angle = Math.atan2(e.clientY - monkeyCenterY, e.clientX - monkeyCenterX);
    const distance = Math.min(3, Math.hypot(e.clientX - monkeyCenterX, e.clientY - monkeyCenterY) / 50);

    const pupilX = Math.cos(angle) * distance;
    const pupilY = Math.sin(angle) * distance;

    pupilLeft.setAttribute('cx', (84 + pupilX).toFixed(2));
    pupilLeft.setAttribute('cy', (70 + pupilY).toFixed(2));
    pupilRight.setAttribute('cx', (116 + pupilX).toFixed(2));
    pupilRight.setAttribute('cy', (70 + pupilY).toFixed(2));
  });

  // Click Monkey -> Reaction & Random Quote
  monkeyContainer.addEventListener('click', () => {
    playSqueakSound();
    
    // Animate mouth curve
    monkeyMouth.setAttribute('d', 'M84 90 Q 100 115 116 90');
    setTimeout(() => {
      monkeyMouth.setAttribute('d', 'M88 92 Q 100 104 112 92');
    }, 600);

    // Random quote
    const randomQuote = monkeyQuotes[Math.floor(Math.random() * monkeyQuotes.length)];
    speechBubble.textContent = randomQuote;

    // Quick bounce
    monkeyContainer.style.transform = 'scale(1.2) rotate(8deg)';
    setTimeout(() => {
      monkeyContainer.style.transform = 'scale(1) rotate(0deg)';
    }, 200);
  });

  // Action Button: Throw Banana
  throwBananaBtn.addEventListener('click', () => {
    playPopSound();
    spawnBananas(12);
  });

  function spawnBananas(count) {
    for (let i = 0; i < count; i++) {
      const banana = document.createElement('div');
      banana.classList.add('banana-particle');
      banana.textContent = '🍌';
      banana.style.left = `${Math.random() * 90 + 5}vw`;
      banana.style.animationDuration = `${Math.random() * 1.5 + 1.5}s`;
      banana.style.fontSize = `${Math.random() * 1.5 + 1.5}rem`;

      particleContainer.appendChild(banana);

      setTimeout(() => {
        banana.remove();
      }, 3000);
    }
  }

  // Action Button: Party Pose (Rock On 🤘)
  danceBtn.addEventListener('click', () => {
    isDancing = !isDancing;
    if (isDancing) {
      monkeyContainer.classList.add('dancing');
      showPose(poseRockOn);
      speechBubble.textContent = '🤘 ROCK ON MONKEY TIME! 🎸';
      danceBtn.innerHTML = '<span>⏸ Stop Pose</span>';
      playFanfare();
      spawnBananas(20);
    } else {
      monkeyContainer.classList.remove('dancing');
      showPose(poseDefault);
      speechBubble.textContent = 'Phew! Party over!';
      danceBtn.innerHTML = '<span>💃 Party Pose 🤘</span>';
    }
  });

  // Action Button: Thumbs Down Prank Pose 👎
  tauntBtn.addEventListener('click', () => {
    isTaunting = !isTaunting;
    if (isTaunting) {
      monkeyTongue.style.display = 'block';
      showPose(poseThumbsDown);
      monkeyMouth.setAttribute('d', 'M84 90 Q 100 120 116 90');
      speechBubble.textContent = '👎 FAIL! Zero marks for you! 🤪';
      monkeyContainer.style.transform = 'scale(1.15) rotate(-10deg)';
      playSqueakSound();
    } else {
      monkeyTongue.style.display = 'none';
      showPose(poseDefault);
      monkeyMouth.setAttribute('d', 'M88 92 Q 100 104 112 92');
      speechBubble.textContent = 'OOH OOH AAH AAH! 🍌';
      monkeyContainer.style.transform = 'scale(1) rotate(0deg)';
    }
  });

  // Action Button: Peace Sign ✌️
  squeakBtn.addEventListener('click', () => {
    showPose(posePeace);
    speechBubble.textContent = '✌️ Peace out, student! ✌️';
    playSqueakSound();
    setTimeout(() => {
      if (!isDancing && !isTaunting) showPose(poseDefault);
    }, 2000);
  });

  // Confetti Animation Generator
  function triggerConfetti() {
    const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
    for (let i = 0; i < 40; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('banana-particle');
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = `${Math.random() * 10 + 6}px`;
      confetti.style.height = `${Math.random() * 10 + 6}px`;
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.animationDuration = `${Math.random() * 2 + 1.5}s`;

      particleContainer.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }
  }

  // --------------------------------------------------------------------------
  // PRANK CERTIFICATE CANVAS GENERATOR
  // --------------------------------------------------------------------------
  downloadCertBtn.addEventListener('click', () => {
    generateCertificate();
  });

  function generateCertificate() {
    const ctx = certCanvas.getContext('2d');
    const w = certCanvas.width;
    const h = certCanvas.height;

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 4;
    ctx.strokeRect(32, 32, w - 64, h - 64);

    // Header Title
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 34px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OFFICIAL CERTIFICATE OF MISCHIEF', w / 2, 90);

    ctx.fillStyle = '#ffffff';
    ctx.font = '18px "Outfit", sans-serif';
    ctx.fillText('THIS CERTIFIES THAT ACADEMIC EVALUATION HAS COMPLETED FOR:', w / 2, 140);

    // Student Name
    ctx.fillStyle = '#ec4899';
    ctx.font = 'bold 44px "Outfit", sans-serif';
    ctx.fillText(currentStudentName.toUpperCase(), w / 2, 210);

    // Roll Number
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '22px "Space Grotesk", monospace';
    ctx.fillText(`Roll Number / ID: ${currentRollNo}`, w / 2, 255);

    // Main Prank Award Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(100, 290, w - 200, 140);
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 290, w - 200, 140);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 28px "Outfit", sans-serif';
    ctx.fillText('OFFICIAL RATING: 100% CERTIFIED MONKEY 🐒', w / 2, 345);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'italic 18px "Outfit", sans-serif';
    ctx.fillText('"Awarded for supreme banana eating, class goofing & maximum fun!"', w / 2, 390);

    // Footer Info & Seal
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px "Outfit", sans-serif';
    ctx.fillText(`Issued Date: ${today}`, 200, 520);
    ctx.fillText('Signature: Master Monkey ✍️', w - 220, 520);

    // Trigger Download
    const dataUrl = certCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${currentStudentName.replace(/\s+/g, '_')}_Monkey_Certificate.png`;
    link.href = dataUrl;
    link.click();
  }
});
