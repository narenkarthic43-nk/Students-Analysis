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
  const collegeNameInput = document.getElementById('collegeName');
  const studentDatalist = document.getElementById('studentDatalist');
  const loginError = document.getElementById('loginError');
  const studentDetailsSection = document.getElementById('studentDetailsSection');
  const verifiedBadgeText = document.getElementById('verifiedBadgeText');
  
  const displayStudentName = document.getElementById('displayStudentName');
  const displayRollNo = document.getElementById('displayRollNo');
  const displayCollegeName = document.getElementById('displayCollegeName');
  
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

  // Authorized Student Records (Muthayammal Engineering College)
  const COLLEGE_NAME = 'MUTHAYAMMAL ENGINEERING COLLEGE';
  const authorizedStudents = [
    { name: 'NANDHAKISHORE J', rollNo: '25EC131' },
    { name: 'NAREEN KUMAR S D', rollNo: '25EC135' },
    { name: 'NARENKARTHIC T A', rollNo: '25EC136' },
    { name: 'NAVEEN D', rollNo: '25EC138' },
    { name: 'NAVEEN J', rollNo: '25EC139' },
    { name: 'NAVEEN R', rollNo: '25EC140' },
    { name: 'NAVEENKUMAR S', rollNo: '25EC141' },
    { name: 'NAVEENKUMAR S', rollNo: '25EC142' },
    { name: 'NISHANTH M', rollNo: '25EC146' },
    { name: 'NITHIN AHAMMED M', rollNo: '25EC147' },
    { name: 'NITHISH P', rollNo: '25EC148' },
    { name: 'NITHISH V', rollNo: '25EC149' },
    { name: 'NITHISHKUMAR S', rollNo: '25EC150' },
    { name: 'PADMAKANTH M', rollNo: '25EC153' },
    { name: 'PERIYASAMY R', rollNo: '25EC155' },
    { name: 'POOVITHAN R', rollNo: '25EC158' },
    { name: 'PRAKASH K', rollNo: '25EC160' },
    { name: 'PRAKASH P', rollNo: '25EC161' },
    { name: 'PRAKATHISH P', rollNo: '25EC162' },
    { name: 'PRANAV P', rollNo: '25EC163' },
    { name: 'PRASANNA KUMAR M', rollNo: '25EC164' },
    { name: 'PRAVEEN M', rollNo: '25EC165' },
    { name: 'PRAVEENKUMAR K', rollNo: '25EC167' },
    { name: 'PRAVEENKUMAR V', rollNo: '25EC168' },
    { name: 'PRIYAN E', rollNo: '25EC173' },
    { name: 'PURUSOTHAMAN S', rollNo: '25EC175' },
    { name: 'RAGUL S', rollNo: '25EC176' },
    { name: 'RAMAKRISHNAN M', rollNo: '25EC178' },
    { name: 'RATHEESH R', rollNo: '25EC181' },
    { name: 'RAVISH S', rollNo: '25EC183' },
    { name: 'ROHITH S K', rollNo: '25EC185' },
    { name: 'ROOBANGANESH S', rollNo: '25EC186' },
    { name: 'SABARI R', rollNo: '25EC187' },
    { name: 'SAI SARAN R', rollNo: '25EC189' }
  ];

  // Helper to normalize and sanitize strings
  function cleanStr(str) {
    return (str || '')
      .toUpperCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  // Pre-process authorized student database for robust matching
  const processedStudents = authorizedStudents.map(s => {
    const cleaned = cleanStr(s.name);
    const tokens = cleaned.split(' ').filter(Boolean);
    // Base name without 1-letter initials
    const mainTokens = tokens.filter(t => t.length > 1);
    const baseName = mainTokens.join(' ');
    return {
      name: s.name,
      rollNo: s.rollNo,
      cleanedName: cleaned,
      baseName: baseName || cleaned,
      tokens: tokens
    };
  });

  // Strict lookup: ONLY students in authorizedStudents list are permitted
  function resolveStudent(inputVal) {
    if (!inputVal) return null;
    const cleanInput = cleanStr(inputVal);
    if (cleanInput.length < 2) return null;

    // 1. Direct match with exact full name (e.g. "NARENKARTHIC T A")
    const exact = processedStudents.find(s => s.cleanedName === cleanInput);
    if (exact) return { matched: true, student: exact };

    // 2. Direct match with roll number (e.g. "25EC136")
    const matchRoll = processedStudents.find(s => cleanStr(s.rollNo) === cleanInput);
    if (matchRoll) return { matched: true, student: matchRoll };

    // 3. Compact match (ignoring all spaces e.g. "NARENKARTHICTA")
    const compactInput = cleanInput.replace(/\s+/g, '');
    const compactMatch = processedStudents.find(s => s.cleanedName.replace(/\s+/g, '') === compactInput);
    if (compactMatch) return { matched: true, student: compactMatch };

    // 4. Token permutation match (e.g. "T A NARENKARTHIC" or "J NANDHAKISHORE")
    const inputTokens = cleanInput.split(' ').filter(Boolean);
    const sortedInput = [...inputTokens].sort().join(' ');
    const permMatch = processedStudents.find(s => [...s.tokens].sort().join(' ') === sortedInput);
    if (permMatch) return { matched: true, student: permMatch };

    // 5. Match with base name if unique (e.g. "NARENKARTHIC", "NANDHAKISHORE", "PRIYAN")
    const baseMatches = processedStudents.filter(s => s.baseName === cleanInput);
    if (baseMatches.length === 1) {
      return { matched: true, student: baseMatches[0] };
    } else if (baseMatches.length > 1) {
      // Multiple records share the same base name (e.g. NAVEEN or PRAKASH)
      // Check if user included initial token
      const initialTokens = inputTokens.filter(t => t.length === 1);
      if (initialTokens.length > 0) {
        const withInitial = baseMatches.find(s => initialTokens.every(it => s.tokens.includes(it)));
        if (withInitial) return { matched: true, student: withInitial };
      }
      return {
        matched: false,
        ambiguous: true,
        ambiguousName: cleanInput,
        suggestions: baseMatches.map(s => s.name)
      };
    }

    // 6. Check if input matches starting words of a single record (at least 4 chars)
    if (cleanInput.length >= 4) {
      const prefixMatches = processedStudents.filter(s => s.cleanedName.startsWith(cleanInput));
      if (prefixMatches.length === 1) {
        return { matched: true, student: prefixMatches[0] };
      }
    }

    // STRICT: Reject all names not in the authorized list
    return null;
  }

  // Handle Input Changes to Dynamically Reveal and Auto-fill Roll & College
  function handleStudentNameChange() {
    const rawVal = studentNameInput.value.trim();

    if (rawVal.length >= 3) {
      const res = resolveStudent(rawVal);
      if (res && res.matched) {
        rollNoInput.value = res.student.rollNo;
        if (collegeNameInput) collegeNameInput.value = COLLEGE_NAME;
        if (verifiedBadgeText) {
          verifiedBadgeText.textContent = `Verified: ${res.student.name}`;
        }
        if (studentDetailsSection) {
          studentDetailsSection.classList.add('active');
        }
        if (loginError) loginError.style.display = 'none';
        return;
      }
    }

    // Retract if input does not match or is cleared
    rollNoInput.value = '';
    if (studentDetailsSection) {
      studentDetailsSection.classList.remove('active');
    }
  }

  studentNameInput.addEventListener('input', () => {
    // Default to uppercase automatically if student enters name in lowercase
    const start = studentNameInput.selectionStart;
    const end = studentNameInput.selectionEnd;
    studentNameInput.value = studentNameInput.value.toUpperCase();
    if (start !== null && end !== null) {
      studentNameInput.setSelectionRange(start, end);
    }
    handleStudentNameChange();
  });
  studentNameInput.addEventListener('change', handleStudentNameChange);

  studentNameInput.addEventListener('blur', () => {
    const rawVal = studentNameInput.value.trim();
    if (!rawVal) {
      if (loginError) loginError.style.display = 'none';
      return;
    }
    const res = resolveStudent(rawVal);
    if (!res || !res.matched) {
      if (loginError) {
        if (res && res.ambiguous) {
          loginError.innerHTML = `<i class="fa-solid fa-circle-info"></i> Multiple records found for <strong>${escapeHtml(res.ambiguousName)}</strong>. Please include your initial (e.g. ${res.suggestions.map(s => escapeHtml(s)).join(', ')}).`;
        } else {
          loginError.innerHTML = '<i class="fa-solid fa-ban"></i> <strong>Student Record Not Found:</strong> Access is strictly restricted to registered Muthayammal Engineering College students.';
        }
        loginError.style.display = 'block';
      }
      if (studentDetailsSection) {
        studentDetailsSection.classList.remove('active');
      }
      rollNoInput.value = '';
    } else {
      if (loginError) loginError.style.display = 'none';
    }
  });

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
    if (!nameVal || nameVal.length < 2) {
      if (loginError) {
        loginError.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Please enter your official student name to verify results.';
        loginError.style.display = 'block';
      }
      studentNameInput.focus();
      return;
    }

    const res = resolveStudent(nameVal);
    if (!res || !res.matched) {
      if (loginError) {
        if (res && res.ambiguous) {
          loginError.innerHTML = `<i class="fa-solid fa-circle-info"></i> Multiple records found for <strong>${escapeHtml(res.ambiguousName)}</strong>. Please include your initial (e.g. ${res.suggestions.map(s => escapeHtml(s)).join(', ')}).`;
        } else {
          loginError.innerHTML = '<i class="fa-solid fa-ban"></i> <strong>Student Record Not Found:</strong> Access is strictly restricted to registered Muthayammal Engineering College students.';
        }
        loginError.style.display = 'block';
      }
      if (studentDetailsSection) {
        studentDetailsSection.classList.remove('active');
      }
      rollNoInput.value = '';
      studentNameInput.focus();
      return;
    }

    if (loginError) loginError.style.display = 'none';

    currentStudentName = res.student.name;
    currentRollNo = res.student.rollNo;
    studentNameInput.value = res.student.name;
    rollNoInput.value = res.student.rollNo;
    if (collegeNameInput) collegeNameInput.value = COLLEGE_NAME;

    // Ensure details section is visible before going inside
    if (studentDetailsSection) {
      studentDetailsSection.classList.add('active');
    }

    // Start Loading Sequence and proceed inside!
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
    if (displayCollegeName) {
      displayCollegeName.textContent = COLLEGE_NAME;
    }

    const bannerStudentName = document.getElementById('bannerStudentName');
    if (bannerStudentName) {
      bannerStudentName.textContent = `👑 ${currentStudentName} 👑`;
    }

    // Set custom speech quote
    speechBubble.textContent = `Aha! ${currentStudentName} (Roll: ${currentRollNo}) from MUTHAYAMMAL ENGINEERING COLLEGE is officially a MONKEY! 🐒`;

    // Trigger visual & audio rewards
    playFanfare();
    triggerConfetti();
  }

  // Reset Prank
  if (resetPrankBtn) {
    resetPrankBtn.addEventListener('click', () => {
      portalForm.reset();
      isDancing = false;
      if (monkeyContainer) monkeyContainer.classList.remove('dancing');
      if (loginError) loginError.style.display = 'none';
      if (studentDetailsSection) studentDetailsSection.classList.remove('active');
      rollNoInput.value = '';
      if (collegeNameInput) collegeNameInput.value = COLLEGE_NAME;
      switchScreen(loginScreen);
    });
  }

  // --------------------------------------------------------------------------
  // INTERACTIVE MONKEY FEATURES
  // --------------------------------------------------------------------------
  
  // Pupil Eye Tracking (Follows Cursor)
  document.addEventListener('mousemove', (e) => {
    if (!prankScreen.classList.contains('active')) return;
    if (!monkeyContainer || !pupilLeft || !pupilRight) return;

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
  if (monkeyContainer) {
    monkeyContainer.addEventListener('click', () => {
      playSqueakSound();
      
      // Animate mouth curve
      if (monkeyMouth) {
        monkeyMouth.setAttribute('d', 'M84 90 Q 100 115 116 90');
        setTimeout(() => {
          monkeyMouth.setAttribute('d', 'M88 92 Q 100 104 112 92');
        }, 600);
      }

      // Random quote
      const randomQuote = monkeyQuotes[Math.floor(Math.random() * monkeyQuotes.length)];
      if (speechBubble) speechBubble.textContent = randomQuote;

      // Quick bounce
      monkeyContainer.style.transform = 'scale(1.2) rotate(8deg)';
      setTimeout(() => {
        monkeyContainer.style.transform = 'scale(1) rotate(0deg)';
      }, 200);
    });
  }

  // Action Button: Throw Banana
  if (throwBananaBtn) {
    throwBananaBtn.addEventListener('click', () => {
      playPopSound();
      spawnBananas(12);
    });
  }

  function spawnBananas(count) {
    if (!particleContainer) return;
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
  if (danceBtn) {
    danceBtn.addEventListener('click', () => {
      isDancing = !isDancing;
      if (isDancing) {
        if (monkeyContainer) monkeyContainer.classList.add('dancing');
        showPose(poseRockOn);
        if (speechBubble) speechBubble.textContent = '🤘 ROCK ON MONKEY TIME! 🎸';
        danceBtn.innerHTML = '<span>⏸ Stop Pose</span>';
        playFanfare();
        spawnBananas(20);
      } else {
        if (monkeyContainer) monkeyContainer.classList.remove('dancing');
        showPose(poseDefault);
        if (speechBubble) speechBubble.textContent = 'Phew! Party over!';
        danceBtn.innerHTML = '<span>💃 Party Pose 🤘</span>';
      }
    });
  }

  // Action Button: Thumbs Down Prank Pose 👎
  if (tauntBtn) {
    tauntBtn.addEventListener('click', () => {
      isTaunting = !isTaunting;
      if (isTaunting) {
        if (monkeyTongue) monkeyTongue.style.display = 'block';
        showPose(poseThumbsDown);
        if (monkeyMouth) monkeyMouth.setAttribute('d', 'M84 90 Q 100 120 116 90');
        if (speechBubble) speechBubble.textContent = '👎 FAIL! Zero marks for you! 🤪';
        if (monkeyContainer) monkeyContainer.style.transform = 'scale(1.15) rotate(-10deg)';
        playSqueakSound();
      } else {
        if (monkeyTongue) monkeyTongue.style.display = 'none';
        showPose(poseDefault);
        if (monkeyMouth) monkeyMouth.setAttribute('d', 'M88 92 Q 100 104 112 92');
        if (speechBubble) speechBubble.textContent = 'OOH OOH AAH AAH! 🍌';
        if (monkeyContainer) monkeyContainer.style.transform = 'scale(1) rotate(0deg)';
      }
    });
  }

  // Action Button: Peace Sign ✌️
  if (squeakBtn) {
    squeakBtn.addEventListener('click', () => {
      showPose(posePeace);
      if (speechBubble) speechBubble.textContent = '✌️ Peace out, student! ✌️';
      playSqueakSound();
      setTimeout(() => {
        if (!isDancing && !isTaunting) showPose(poseDefault);
      }, 2000);
    });
  }

  // Confetti Animation Generator
  function triggerConfetti() {
    if (!particleContainer) return;
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
  if (downloadCertBtn) {
    downloadCertBtn.addEventListener('click', () => {
      generateCertificate();
    });
  }

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
    ctx.font = 'bold 32px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OFFICIAL CERTIFICATE OF MISCHIEF', w / 2, 75);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px "Outfit", sans-serif';
    ctx.fillText('MUTHAYAMMAL ENGINEERING COLLEGE', w / 2, 110);

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px "Outfit", sans-serif';
    ctx.fillText('THIS CERTIFIES THAT ACADEMIC EVALUATION HAS COMPLETED FOR:', w / 2, 145);

    // Student Name
    ctx.fillStyle = '#ec4899';
    ctx.font = 'bold 42px "Outfit", sans-serif';
    ctx.fillText(currentStudentName.toUpperCase(), w / 2, 205);

    // Roll Number
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '22px "Space Grotesk", monospace';
    ctx.fillText(`Roll Number / ID: ${currentRollNo}`, w / 2, 250);

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
