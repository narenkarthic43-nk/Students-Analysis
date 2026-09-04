/* ==========================================================================
   MUTHAYAMMAL ENGINEERING COLLEGE - CONTROLLER OF EXAMINATIONS
   PORTAL SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const body = document.body;
  const loginScreen = document.getElementById('loginScreen');
  const loadingScreen = document.getElementById('loadingScreen');
  const prankScreen = document.getElementById('prankScreen');
  const portalForm = document.getElementById('portalForm');

  const studentNameInput = document.getElementById('studentNameInput') || document.getElementById('studentInput');

  const rollSelectorWrap = document.getElementById('rollSelectorWrap');
  const rollOptionsContainer = document.getElementById('rollOptionsContainer');

  const verifiedStatusPill = document.getElementById('verifiedStatusPill');
  const verifiedStudentDesc = document.getElementById('verifiedStudentDesc');
  const verifiedNameDisplay = document.getElementById('verifiedNameDisplay');
  const verifiedRollNoDisplay = document.getElementById('verifiedRollNoDisplay');
  const verifiedCollegeDisplay = document.getElementById('verifiedCollegeDisplay');
  const loginError = document.getElementById('loginError');
  const checkResultBtn = document.getElementById('checkResultBtn');

  const displayStudentName = document.getElementById('displayStudentName');
  const displayRollNo = document.getElementById('displayRollNo');
  const displayCollegeName = document.getElementById('displayCollegeName');
  const bannerStudentName = document.getElementById('bannerStudentName');

  const progressFill = document.getElementById('progressFill');
  const loadingMessage = document.getElementById('loadingMessage');
  const particleContainer = document.getElementById('particleContainer');

  const throwBananaBtn = document.getElementById('throwBananaBtn');
  const resetPrankBtn = document.getElementById('resetPrankBtn');
  const bgAudioPlayer = document.getElementById('bgAudioPlayer');
  const bgDirectAudio = document.getElementById('bgDirectAudio');
  const audioControlBtn = document.getElementById('audioControlBtn');
  const audioIcon = document.getElementById('audioIcon');
  const audioStatusText = document.getElementById('audioStatusText');

  // YouTube Background Audio (Video: https://youtu.be/8fSM4Zhn6v4)
  const YOUTUBE_VIDEO_ID = '8fSM4Zhn6v4';
  const YOUTUBE_BG_AUDIO_URL = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&enablejsapi=1&playsinline=1`;

  let isAudioPlaying = false;
  let ytAudioPlayer = null;
  let muteBtnTimer = null;

  // Function to completely hide the mute button
  function hideMuteButton() {
    if (muteBtnTimer) {
      clearTimeout(muteBtnTimer);
      muteBtnTimer = null;
    }
    if (audioControlBtn) {
      audioControlBtn.classList.remove('visible');
      audioControlBtn.style.display = 'none';
    }
  }

  // Function to show the floating mute button inside the prank box after login
  function showBoxMuteButton() {
    if (muteBtnTimer) {
      clearTimeout(muteBtnTimer);
      muteBtnTimer = null;
    }
    if (audioControlBtn) {
      audioControlBtn.style.display = 'inline-flex';
      requestAnimationFrame(() => {
        if (body.classList.contains('prank-mode') && audioControlBtn) {
          audioControlBtn.classList.add('visible');
        }
      });
    }
  }

  // Ensure mute button is hidden on login screen on load
  hideMuteButton();

  // Portal Configuration
  const PORTAL_CONFIG = {
    collegeName: 'MUTHAYAMMAL ENGINEERING COLLEGE (AUTONOMOUS)',
    defaultBranch: 'B.E. - Electronics & Communication Engineering',
    defaultSession: 'Nov/Dec 2025 - Regular'
  };

  const COLLEGE_NAME = PORTAL_CONFIG.collegeName;
  const DEFAULT_BRANCH = PORTAL_CONFIG.defaultBranch;

  // Class / Student Database (Enum list completely hidden from browser datalist)
  const authorizedStudents = [
    { name: 'NANDHAKISHORE J', rollNo: '25EC131', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'NAREEN KUMAR S D', rollNo: '25EC135', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'NARENKARTHIC T A', rollNo: '25EC136', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'NAVEEN D', rollNo: '25EC138', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'NAVEEN J', rollNo: '25EC139', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'NAVEEN R', rollNo: '25EC140', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'NAVEENKUMAR S', rollNo: '25EC141', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'NAVEEN KUMAR S', rollNo: '25EC142', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'NISHANTH M', rollNo: '25EC146', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'NITHIN AHAMMED M', rollNo: '25EC147', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'NITHISH P', rollNo: '25EC148', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'NITHISH V', rollNo: '25EC149', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'NITHISHKUMAR S', rollNo: '25EC150', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'PADMAKANTH M', rollNo: '25EC153', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'PERIYASAMY R', rollNo: '25EC155', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'POOVITHAN R', rollNo: '25EC158', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'PRAKASH K', rollNo: '25EC160', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'PRAKASH P', rollNo: '25EC161', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'PRAKATHISH P', rollNo: '25EC162', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'PRANAV P', rollNo: '25EC163', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'PRASANNA KUMAR M', rollNo: '25EC164', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'PRAVEEN M', rollNo: '25EC165', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'PRAVEENKUMAR K', rollNo: '25EC167', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'PRAVEENKUMAR V', rollNo: '25EC168', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'PRIYAN E', rollNo: '25EC173', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'PURUSOTHAMAN S', rollNo: '25EC175', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'RAGUL S', rollNo: '25EC176', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'RAMAKRISHNAN M', rollNo: '25EC178', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'RATHEESH R', rollNo: '25EC181', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'RAVISH S', rollNo: '25EC183', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'ROHITH S K', rollNo: '25EC185', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'ROOBANGANESH S', rollNo: '25EC186', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'SABARI R', rollNo: '25EC187', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'SAI SARAN R', rollNo: '25EC189', branch: 'B.E. - Electronics & Communication Engineering' },
    { name: 'SURESH M', rollNo: '25EC195', branch: 'B.E. - Electronics & Communication Engineering' }
  ];

  // Helper string cleaner
  function cleanStr(str) {
    return (str || '')
      .toUpperCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Pre-process student records for lookup
  const processedStudents = authorizedStudents.map(s => {
    const cleaned = cleanStr(s.name);
    const tokens = cleaned.split(' ').filter(Boolean);
    const mainTokens = tokens.filter(t => t.length > 1);
    return {
      name: s.name,
      rollNo: s.rollNo,
      branch: s.branch || DEFAULT_BRANCH,
      cleanedName: cleaned,
      baseName: mainTokens.join(' ') || cleaned,
      tokens: tokens
    };
  });

  // Generate an authentic roll number for any custom/friend name
  function generateRollNo(name) {
    let hash = 0;
    const clean = cleanStr(name);
    for (let i = 0; i < clean.length; i++) {
      hash = ((hash << 5) - hash) + clean.charCodeAt(i);
      hash |= 0;
    }
    const num = Math.abs(hash % 70) + 130; // Range: 25EC130 to 25EC200
    return `25EC${num}`;
  }

  // State
  let currentStudentName = '';
  let currentRollNo = '';
  let selectedStudent = null;
  let bananaRainInterval = null;

  // --------------------------------------------------------------------------
  // 3-SECOND BANANA FALL SHOWER (Visual animation)
  // --------------------------------------------------------------------------
  function startThreeSecondBananaRain() {
    if (!particleContainer) return;
    
    particleContainer.replaceChildren();

    const RAIN_DURATION_MS = 3000; // EXACTLY 3 SECONDS
    const spawnIntervalMs = 70; // High density shower
    const startTime = Date.now();

    if (bananaRainInterval) clearInterval(bananaRainInterval);

    bananaRainInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= RAIN_DURATION_MS) {
        clearInterval(bananaRainInterval);
        bananaRainInterval = null;
        return;
      }

      const count = Math.random() > 0.5 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        createFallingBanana();
      }
    }, spawnIntervalMs);
  }

  function createFallingBanana() {
    if (!particleContainer) return;
    const banana = document.createElement('div');
    banana.classList.add('banana-particle');
    banana.textContent = '🍌';

    const leftPos = Math.random() * 92 + 4; // 4vw to 96vw
    const duration = Math.random() * 0.8 + 1.4; // 1.4s to 2.2s fall time
    const size = Math.random() * 1.5 + 1.8; // 1.8rem to 3.3rem
    const delay = Math.random() * 0.1;

    banana.style.left = `${leftPos}vw`;
    banana.style.fontSize = `${size}rem`;
    banana.style.animationDuration = `${duration}s`;
    banana.style.animationDelay = `${delay}s`;

    particleContainer.appendChild(banana);

    setTimeout(() => {
      banana.remove();
    }, (duration + delay + 0.2) * 1000);
  }

  // --------------------------------------------------------------------------
  // STRICT STUDENT MATCHING:
  // Supports single and multiple student matches (e.g. NAVEENKUMAR S: 25EC141 and 25EC142)
  // --------------------------------------------------------------------------
  function findStudentMatches(inputVal) {
    if (!inputVal) return [];
    const cleanInput = cleanStr(inputVal);

    if (cleanInput.length < 3) return [];

    // Check if input directly matches or contains an authorized roll number (e.g. "25EC141" or "25EC142")
    for (const student of processedStudents) {
      const cleanRoll = cleanStr(student.rollNo);
      if (cleanInput === cleanRoll || cleanInput === `25EC${cleanRoll.replace(/\D/g, '')}`) {
        return [student];
      }
    }

    // Special handling for NAVEENKUMAR S: Two members with this name (25EC141 and 25EC142)
    const compactInput = cleanInput.replace(/\s+/g, '');
    if (
      compactInput === 'NAVEENKUMARS' ||
      compactInput === 'NAVEENKUMAR' ||
      cleanInput === 'NAVEENKUMAR S' ||
      cleanInput === 'NAVEEN KUMAR S' ||
      cleanInput === 'NAVEEN KUMAR' ||
      cleanInput === 'NAVEENKUMAR'
    ) {
      return processedStudents.filter(s => s.rollNo === '25EC141' || s.rollNo === '25EC142');
    }

    // 1. Exact cleaned Full Name Match
    const exactMatches = processedStudents.filter(s => s.cleanedName === cleanInput);
    if (exactMatches.length > 0) return exactMatches;

    // 2. Exact Roll Number Match
    const exactRollMatches = processedStudents.filter(s => cleanStr(s.rollNo) === cleanInput);
    if (exactRollMatches.length > 0) return exactRollMatches;

    // 3. Compact Full Name Match (ignoring spaces/punctuation)
    const compactMatches = processedStudents.filter(s => s.cleanedName.replace(/\s+/g, '') === compactInput);
    if (compactMatches.length > 0) return compactMatches;

    // 4. Full Token Permutation Match (all words in official name present)
    const inputTokens = cleanInput.split(' ').filter(Boolean);
    if (inputTokens.length >= 2) {
      const sortedInput = [...inputTokens].sort().join(' ');
      const permMatches = processedStudents.filter(s => [...s.tokens].sort().join(' ') === sortedInput);
      if (permMatches.length > 0) return permMatches;
    }

    // 5. Complete Base Name Match (e.g. "NARENKARTHIC", "PURUSOTHAMAN", "POOVITHAN", "ROOBANGANESH")
    const baseMatches = processedStudents.filter(s => s.baseName === cleanInput);
    if (baseMatches.length > 0) return baseMatches;

    // 6. Complete Base Name ignoring spaces
    const compactBaseMatches = processedStudents.filter(s => s.baseName.replace(/\s+/g, '') === compactInput);
    if (compactBaseMatches.length > 0) return compactBaseMatches;

    return [];
  }

  // --------------------------------------------------------------------------
  // RENDER DUAL ROLL NUMBER SELECTOR OPTIONS (25EC141 & 25EC142)
  // --------------------------------------------------------------------------
  function renderRollOptions(matches) {
    if (!rollOptionsContainer) return;

    rollOptionsContainer.replaceChildren();

    matches.forEach(student => {
      const isSelected = selectedStudent && selectedStudent.rollNo === student.rollNo;
      const card = document.createElement('div');
      card.className = `roll-option-card${isSelected ? ' selected' : ''}`;
      card.setAttribute('data-roll', student.rollNo);
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');

      const radioDiv = document.createElement('div');
      radioDiv.className = 'card-radio';
      const radioIcon = document.createElement('i');
      radioIcon.className = isSelected ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle';
      radioDiv.appendChild(radioIcon);

      const detailsDiv = document.createElement('div');
      detailsDiv.className = 'roll-option-details';

      const badgeSpan = document.createElement('span');
      badgeSpan.className = 'card-badge';
      badgeSpan.textContent = student.rollNo;

      const nameSpan = document.createElement('span');
      nameSpan.className = 'card-name';
      nameSpan.textContent = student.name;

      detailsDiv.appendChild(badgeSpan);
      detailsDiv.appendChild(nameSpan);

      card.appendChild(radioDiv);
      card.appendChild(detailsDiv);

      const selectThisCard = () => {
        selectedStudent = student;
        // Update all cards visual state
        const allCards = rollOptionsContainer.querySelectorAll('.roll-option-card');
        allCards.forEach(c => {
          const matchRoll = c.getAttribute('data-roll') === student.rollNo;
          c.classList.toggle('selected', matchRoll);
          c.setAttribute('aria-checked', matchRoll ? 'true' : 'false');
          const icon = c.querySelector('.card-radio i');
          if (icon) {
            icon.className = matchRoll ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle';
          }
        });

        // Update verified status pill immediately
        if (verifiedStatusPill) {
          if (verifiedStudentDesc) verifiedStudentDesc.textContent = 'Student Record Verified';
          if (verifiedNameDisplay) verifiedNameDisplay.textContent = student.name;
          if (verifiedRollNoDisplay) verifiedRollNoDisplay.textContent = student.rollNo;
          if (verifiedCollegeDisplay) verifiedCollegeDisplay.textContent = COLLEGE_NAME;
          verifiedStatusPill.style.display = 'block';
        }
        if (loginError) loginError.style.display = 'none';
      };

      card.addEventListener('click', selectThisCard);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectThisCard();
        }
      });

      rollOptionsContainer.appendChild(card);
    });
  }

  // --------------------------------------------------------------------------
  // INPUT EVENT HANDLERS & VERIFIED DETAILS DISPLAY
  // Shows Student Name, Roll No, and College Name
  // --------------------------------------------------------------------------
  function checkVerifiedStatus() {
    if (!studentNameInput) return null;
    const rawVal = studentNameInput.value.trim();

    if (rawVal.length < 3) {
      if (rollSelectorWrap) rollSelectorWrap.style.display = 'none';
      if (verifiedStatusPill) verifiedStatusPill.style.display = 'none';
      selectedStudent = null;
      return null;
    }

    const matches = findStudentMatches(rawVal);

    if (matches.length === 0) {
      if (rollSelectorWrap) rollSelectorWrap.style.display = 'none';
      if (verifiedStatusPill) verifiedStatusPill.style.display = 'none';
      selectedStudent = null;
      return null;
    }

    // Single student match
    if (matches.length === 1) {
      if (rollSelectorWrap) rollSelectorWrap.style.display = 'none';
      selectedStudent = matches[0];
      if (verifiedStatusPill) {
        if (verifiedStudentDesc) verifiedStudentDesc.textContent = 'Student Record Identified';
        if (verifiedNameDisplay) verifiedNameDisplay.textContent = selectedStudent.name;
        if (verifiedRollNoDisplay) verifiedRollNoDisplay.textContent = selectedStudent.rollNo;
        if (verifiedCollegeDisplay) verifiedCollegeDisplay.textContent = COLLEGE_NAME;
        verifiedStatusPill.style.display = 'block';
      }
      if (loginError) loginError.style.display = 'none';
      return selectedStudent;
    }

    // Multiple student matches (e.g. 25EC141 and 25EC142 for NAVEENKUMAR S)
    if (matches.length > 1) {
      if (rollSelectorWrap) {
        rollSelectorWrap.style.display = 'block';
        renderRollOptions(matches);
      }

      // Check if selectedStudent is one of the valid matches
      const isSelectedValid = selectedStudent && matches.some(m => m.rollNo === selectedStudent.rollNo);
      if (isSelectedValid) {
        if (verifiedStatusPill) {
          if (verifiedStudentDesc) verifiedStudentDesc.textContent = 'Student Record Verified';
          if (verifiedNameDisplay) verifiedNameDisplay.textContent = selectedStudent.name;
          if (verifiedRollNoDisplay) verifiedRollNoDisplay.textContent = selectedStudent.rollNo;
          if (verifiedCollegeDisplay) verifiedCollegeDisplay.textContent = COLLEGE_NAME;
          verifiedStatusPill.style.display = 'block';
        }
        return selectedStudent;
      } else {
        // Not selected yet
        if (verifiedStatusPill) verifiedStatusPill.style.display = 'none';
        return null;
      }
    }

    return null;
  }

  // Input event listeners for student name field
  if (studentNameInput) {
    // While typing: convert to uppercase, hide premature popup until full name is completed
    studentNameInput.addEventListener('input', () => {
      const start = studentNameInput.selectionStart;
      const end = studentNameInput.selectionEnd;
      studentNameInput.value = studentNameInput.value.toUpperCase();
      if (start !== null && end !== null) {
        studentNameInput.setSelectionRange(start, end);
      }
      if (loginError) loginError.style.display = 'none';
      checkVerifiedStatus();
    });

    // When user finishes entering name and leaves field or presses Enter
    studentNameInput.addEventListener('blur', () => {
      checkVerifiedStatus();
    });
    studentNameInput.addEventListener('change', () => {
      checkVerifiedStatus();
    });
  }

  // --------------------------------------------------------------------------
  // SCREEN SWITCHING
  // --------------------------------------------------------------------------
  function switchScreen(activeScreen) {
    [loginScreen, loadingScreen, prankScreen].forEach(screen => {
      if (screen) screen.classList.remove('active');
    });
    if (activeScreen) activeScreen.classList.add('active');

    if (activeScreen === prankScreen) {
      body.classList.add('prank-mode');
    } else {
      body.classList.remove('prank-mode');
      hideMuteButton();
    }
  }

  // --------------------------------------------------------------------------
  // FORM SUBMISSION (TRIGGERED ON "GET RESULTS" BUTTON CLICK)
  // --------------------------------------------------------------------------
  function handleLoginSubmit(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    const inputVal = studentNameInput ? studentNameInput.value.trim() : '';

    if (!inputVal || inputVal.length < 3) {
      showError('Please enter your full student name.');
      if (studentNameInput) studentNameInput.focus();
      return;
    }

    const matches = findStudentMatches(inputVal);
    if (matches.length === 0) {
      showError('Access Denied: Please enter your full completed name (e.g. SURESH M). Unregistered students are not allowed.');
      if (studentNameInput) studentNameInput.focus();
      return;
    }

    // If multiple students match and user has not selected one yet
    if (matches.length > 1) {
      const isSelectedValid = selectedStudent && matches.some(m => m.rollNo === selectedStudent.rollNo);
      if (!isSelectedValid) {
        showError('Multiple records found. Please select your Roll Number (25EC141 or 25EC142) above to proceed.');
        if (rollSelectorWrap) {
          rollSelectorWrap.style.display = 'block';
          renderRollOptions(matches);
          rollSelectorWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }
    }

    const finalStudent = selectedStudent || matches[0];
    if (loginError) loginError.style.display = 'none';

    currentStudentName = finalStudent.name;
    currentRollNo = finalStudent.rollNo;

    // Display the student's roll no & college name before loading
    checkVerifiedStatus();

    // Prime background audio directly on user click gesture
    if (bgDirectAudio) {
      try {
        bgDirectAudio.load();
      } catch (e) {}
    }
    if (bgAudioPlayer) {
      bgAudioPlayer.src = YOUTUBE_BG_AUDIO_URL;
    }

    // Transition to realistic loading screen
    switchScreen(loadingScreen);
    startLoadingSequence();
  }

  portalForm.addEventListener('submit', handleLoginSubmit);
  if (checkResultBtn) {
    checkResultBtn.addEventListener('click', handleLoginSubmit);
  }

  function showError(msg) {
    if (!loginError) return;
    loginError.replaceChildren();
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-circle-exclamation';
    const text = document.createTextNode(` ${msg}`);
    loginError.appendChild(icon);
    loginError.appendChild(text);
    loginError.style.display = 'flex';
  }

  // --------------------------------------------------------------------------
  // REALISTIC LOADING SEQUENCE
  // --------------------------------------------------------------------------
  function startLoadingSequence() {
    const steps = [
      { pct: '25%', msg: 'Connecting to Examination Server...' },
      { pct: '50%', msg: `Fetching records for ${currentStudentName}...` },
      { pct: '75%', msg: `Verifying Roll No: ${currentRollNo} | ${COLLEGE_NAME}` },
      { pct: '100%', msg: 'Results Successfully Retrieved!' }
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
        setTimeout(showPrankDashboard, 450);
      }
    }, 450);
  }

  // --------------------------------------------------------------------------
  // YOUTUBE BACKGROUND AUDIO CONTROLLER (Video ID: 8fSM4Zhn6v4)
  // --------------------------------------------------------------------------
  window.onYouTubeIframeAPIReady = function () {
    try {
      ytAudioPlayer = new YT.Player('bgAudioPlayer', {
        events: {
          'onReady': (event) => {
            if (body.classList.contains('prank-mode')) {
              try {
                event.target.playVideo();
                isAudioPlaying = true;
                updateAudioUI(true);
              } catch (e) {}
            }
          },
          'onStateChange': (event) => {
            // When audio finishes (ENDED = 0), loop automatically
            if (event.data === 0) {
              try {
                event.target.playVideo();
              } catch (e) {}
            } else if (event.data === 1) {
              isAudioPlaying = true;
              updateAudioUI(true);
            } else if (event.data === 2) {
              isAudioPlaying = false;
              updateAudioUI(false);
            }
          }
        }
      });
    } catch (e) {
      console.warn('YouTube API init fallback:', e);
    }
  };

  // If YT API is already loaded before DOMContentLoaded
  if (window.YT && window.YT.Player) {
    window.onYouTubeIframeAPIReady();
  }

  function updateAudioUI(playing) {
    if (!audioControlBtn) return;
    if (playing) {
      audioControlBtn.classList.add('playing');
      audioControlBtn.classList.remove('muted');
      if (audioIcon) audioIcon.className = 'fa-solid fa-volume-high';
      if (audioStatusText) audioStatusText.textContent = 'Mute Audio';
    } else {
      audioControlBtn.classList.remove('playing');
      audioControlBtn.classList.add('muted');
      if (audioIcon) audioIcon.className = 'fa-solid fa-volume-xmark';
      if (audioStatusText) audioStatusText.textContent = 'Unmute Audio';
    }
  }

  function playYouTubeBackgroundAudio() {
    isAudioPlaying = true;
    updateAudioUI(true);

    // 1. Play direct HTML5 audio (plays 100% reliably with sound on local file://)
    if (bgDirectAudio) {
      try {
        bgDirectAudio.currentTime = 0;
        bgDirectAudio.volume = 1.0;
        const playPromise = bgDirectAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => console.log('Direct audio waiting for interaction:', e));
        }
      } catch (e) {}
    }

    // 2. Play YouTube Background Audio iframe
    if (bgAudioPlayer) {
      if (!bgAudioPlayer.src || !bgAudioPlayer.src.includes(YOUTUBE_VIDEO_ID)) {
        bgAudioPlayer.src = YOUTUBE_BG_AUDIO_URL;
      } else {
        try {
          bgAudioPlayer.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'playVideo'
          }), '*');
        } catch (e) {}
      }
    }

    if (ytAudioPlayer && typeof ytAudioPlayer.playVideo === 'function') {
      try {
        ytAudioPlayer.playVideo();
      } catch (e) {}
    }
  }

  function stopBackgroundAudio() {
    isAudioPlaying = false;
    updateAudioUI(false);

    if (bgDirectAudio) {
      try {
        bgDirectAudio.pause();
        bgDirectAudio.currentTime = 0;
      } catch (e) {}
    }

    if (ytAudioPlayer && typeof ytAudioPlayer.stopVideo === 'function') {
      try {
        ytAudioPlayer.stopVideo();
      } catch (e) {}
    }

    if (bgAudioPlayer) {
      bgAudioPlayer.src = '';
    }
  }

  let isMutedByUser = false;

  function toggleAudioPlayback() {
    if (isAudioPlaying) {
      isMutedByUser = true;
      if (bgDirectAudio) {
        try { bgDirectAudio.pause(); } catch (e) {}
      }
      if (ytAudioPlayer && typeof ytAudioPlayer.pauseVideo === 'function') {
        try {
          ytAudioPlayer.pauseVideo();
        } catch (e) {}
      } else if (bgAudioPlayer) {
        try {
          bgAudioPlayer.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'pauseVideo'
          }), '*');
        } catch (e) {
          bgAudioPlayer.src = '';
        }
      }
      isAudioPlaying = false;
      updateAudioUI(false);
    } else {
      isMutedByUser = false;
      playYouTubeBackgroundAudio();
    }
  }

  // --------------------------------------------------------------------------
  // REVEAL PRANK DASHBOARD WITH BANANA FALL SHOWER
  // --------------------------------------------------------------------------
  function showPrankDashboard() {
    switchScreen(prankScreen);

    if (displayStudentName) displayStudentName.textContent = currentStudentName;
    if (displayRollNo) displayRollNo.textContent = currentRollNo;
    if (displayCollegeName) displayCollegeName.textContent = COLLEGE_NAME;
    if (bannerStudentName) bannerStudentName.textContent = `👑 ${currentStudentName} 👑`;

    // Start YouTube Background Audio
    if (!isMutedByUser) {
      playYouTubeBackgroundAudio();
    } else {
      updateAudioUI(false);
    }

    // TRIGGER THE 3-SECOND CONTINUOUS BANANA RAINFALL SHOWER
    startThreeSecondBananaRain();

    // Hide mute button initially upon login, then show 3 seconds later
    hideMuteButton();
    muteBtnTimer = setTimeout(() => {
      if (body.classList.contains('prank-mode')) {
        showBoxMuteButton();
      }
    }, 3000);
  }

  // Audio Control Button Click Listener
  if (audioControlBtn) {
    audioControlBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAudioPlayback();
    });
  }

  // Unblock browser autoplay policy if user interacts anywhere on prank screen
  if (prankScreen) {
    prankScreen.addEventListener('click', () => {
      if (!isMutedByUser && !isAudioPlaying && body.classList.contains('prank-mode')) {
        playYouTubeBackgroundAudio();
      }
    });
  }

  // Interactive Buttons
  if (throwBananaBtn) {
    throwBananaBtn.addEventListener('click', () => {
      startThreeSecondBananaRain();
    });
  }

  // Reset Prank Button (Returns back to clean white login screen)
  if (resetPrankBtn) {
    resetPrankBtn.addEventListener('click', () => {
      portalForm.reset();
      currentStudentName = '';
      currentRollNo = '';
      selectedStudent = null;
      if (rollSelectorWrap) rollSelectorWrap.style.display = 'none';
      if (rollOptionsContainer) rollOptionsContainer.replaceChildren();
      if (verifiedStatusPill) verifiedStatusPill.style.display = 'none';
      if (loginError) loginError.style.display = 'none';
      if (particleContainer) particleContainer.replaceChildren();

      // Stop Background Audio on Reset
      stopBackgroundAudio();
      hideMuteButton();

      switchScreen(loginScreen);
      if (studentNameInput) studentNameInput.focus();
    });
  }

  // Check URL query parameters (e.g. ?name=NARENKARTHIC or ?student=NAVEEN)
  const urlParams = new URLSearchParams(window.location.search);
  const queryParam = urlParams.get('name') || urlParams.get('student') || urlParams.get('roll') || '';
  if (queryParam.trim() && studentNameInput) {
    studentNameInput.value = queryParam.trim().toUpperCase();
    checkVerifiedStatus();
  }
});
