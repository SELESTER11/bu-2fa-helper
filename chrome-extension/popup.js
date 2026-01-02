// Settings
let settings = {
    clickToReveal: false,
    soundEnabled: true,
    autoClearClipboard: true,
    theme: 'dark'
  };
  
  let isCodeHidden = false;
  let clipboardTimer = null;
  
  // Load settings
  chrome.storage.local.get(['settings', 'stats'], (result) => {
    if (result.settings) {
      settings = { ...settings, ...result.settings };
      applyTheme();
      if (settings.clickToReveal) {
        isCodeHidden = true;
        document.getElementById('code-wrapper').classList.add('hidden');
      }
    }
    
    // Load and display stats
    if (result.stats) {
      updateStatsDisplay(result.stats);
    }
  });
  
  // Apply theme
  function applyTheme() {
    const themeIcon = document.querySelector('.theme-icon');
    if (settings.theme === 'light') {
      document.body.classList.add('light-theme');
      themeIcon.textContent = '☀️';
    } else {
      document.body.classList.remove('light-theme');
      themeIcon.textContent = '🌙';
    }
  }
  
  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', () => {
    settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
    chrome.storage.local.set({ settings });
    applyTheme();
    playSound('reveal');
  });
  
  // Settings link
  document.getElementById('settings-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
  
  // Report issue link
  document.getElementById('report-issue')?.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ 
      url: 'mailto:your.email@example.com?subject=BU%202FA%20Helper%20Issue' 
    });
  });
  
  // Click to reveal code
  document.getElementById('code-wrapper').addEventListener('click', () => {
    if (settings.clickToReveal && isCodeHidden) {
      isCodeHidden = false;
      document.getElementById('code-wrapper').classList.remove('hidden');
      playSound('reveal');
      
      // Auto-hide after 10 seconds
      setTimeout(() => {
        if (settings.clickToReveal) {
          isCodeHidden = true;
          document.getElementById('code-wrapper').classList.add('hidden');
        }
      }, 10000);
    }
  });
  
  function updateDisplay() {
    chrome.runtime.sendMessage({ action: 'generateOTP' }, (response) => {
      const codeElement = document.getElementById('code');
      const timerText = document.getElementById('timer-text');
      const timerBar = document.getElementById('timer-bar');
      
      if (response && response.error) {
        codeElement.textContent = 'ERROR';
        codeElement.style.fontSize = '24px';
        timerText.textContent = 'Click settings to configure';
        timerText.style.cursor = 'pointer';
        timerText.onclick = () => {
          chrome.runtime.openOptionsPage();
        };
        return;
      }
      
      if (response && response.token) {
        const oldCode = codeElement.textContent;
        codeElement.textContent = response.token;
        
        // Animate code change
        if (oldCode !== '------' && oldCode !== response.token) {
          codeElement.style.transform = 'scale(1.1)';
          setTimeout(() => {
            codeElement.style.transform = 'scale(1)';
          }, 200);
          
          if (settings.soundEnabled) {
            playSound('generate');
          }
        }
        
        codeElement.style.fontSize = '42px';
        timerText.textContent = `${response.timeRemaining} seconds remaining`;
        timerText.style.cursor = 'default';
        timerText.onclick = null;
        
        // Update progress bar
        const percentage = (response.timeRemaining / 30) * 100;
        timerBar.style.width = `${percentage}%`;
        
        // Warning state when less than 5 seconds
        if (response.timeRemaining <= 5) {
          timerBar.classList.add('warning');
          timerText.classList.add('warning');
        } else {
          timerBar.classList.remove('warning');
          timerText.classList.remove('warning');
        }
      }
    });
  }
  
  // Update every second
  updateDisplay();
  setInterval(updateDisplay, 1000);
  
  // Copy button
  document.getElementById('copy-btn').addEventListener('click', async () => {
    const code = document.getElementById('code').textContent;
    
    if (code === 'ERROR' || code === '------') {
      chrome.runtime.openOptionsPage();
      return;
    }
    
    await navigator.clipboard.writeText(code);
    
    const btn = document.getElementById('copy-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    
    // Play copy sound
    if (settings.soundEnabled) {
      playSound('copy');
    }
    
    // Update stats
    updateStats();
    
    // Auto-clear clipboard after 30 seconds
    if (settings.autoClearClipboard) {
      if (clipboardTimer) clearTimeout(clipboardTimer);
      clipboardTimer = setTimeout(async () => {
        await navigator.clipboard.writeText('');
      }, 30000);
    }
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('copied');
    }, 1500);
  });
  
  // Stats functions
  function updateStats() {
    chrome.storage.local.get(['stats'], (result) => {
      const today = new Date().toDateString();
      let stats = result.stats || { total: 0, today: today, todayCount: 0 };
      
      // Reset today count if it's a new day
      if (stats.today !== today) {
        stats.today = today;
        stats.todayCount = 0;
      }
      
      stats.total++;
      stats.todayCount++;
      
      chrome.storage.local.set({ stats });
      updateStatsDisplay(stats);
    });
  }
  
  function updateStatsDisplay(stats) {
    document.getElementById('total-uses').textContent = stats.total || 0;
    document.getElementById('today-uses').textContent = stats.todayCount || 0;
  }
  
  // Sound effects using Web Audio API
  function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'copy') {
      // Higher pitched beep for copy
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'reveal') {
      // Quick click sound
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    } else if (type === 'generate') {
      // Subtle whoosh for code generation
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    }
  }
  
  // Confetti on first successful setup
  chrome.storage.local.get(['hasShownConfetti'], (result) => {
    if (!result.hasShownConfetti) {
      // Check if code is successfully loaded
      setTimeout(() => {
        const code = document.getElementById('code').textContent;
        if (code !== '------' && code !== 'ERROR') {
          showConfetti();
          chrome.storage.local.set({ hasShownConfetti: true });
        }
      }, 1000);
    }
  });
  
  function showConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = [];
    const confettiCount = 50;
    const colors = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444'];
    
    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * confettiCount,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleIncremental: Math.random() * 0.07 + 0.05,
        tiltAngle: 0
      });
    }
    
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < confetti.length; i++) {
        const c = confetti[i];
        ctx.beginPath();
        ctx.lineWidth = c.r / 2;
        ctx.strokeStyle = c.color;
        ctx.moveTo(c.x + c.tilt + c.r / 4, c.y);
        ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 4);
        ctx.stroke();
      }
      
      update();
    }
    
    function update() {
      for (let i = 0; i < confetti.length; i++) {
        const c = confetti[i];
        c.tiltAngle += c.tiltAngleIncremental;
        c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
        c.tilt = Math.sin(c.tiltAngle - i / 3) * 15;
        
        if (c.y > canvas.height) {
          confetti.splice(i, 1);
          i--;
        }
      }
      
      if (confetti.length > 0) {
        requestAnimationFrame(draw);
      } else {
        canvas.style.display = 'none';
      }
    }
    
    draw();
    
    setTimeout(() => {
      canvas.style.display = 'none';
    }, 5000);
  }