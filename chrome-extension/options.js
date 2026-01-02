// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding content
    tab.classList.add('active');
    const tabId = tab.getAttribute('data-tab') + '-tab';
    document.getElementById(tabId).classList.add('active');
  });
});


// Load existing data (but don't display it for security)
chrome.storage.local.get(['totpSecret', 'username', 'password'], (result) => {
  if (result.totpSecret) {
    document.getElementById('secret').placeholder = '••••••••••••••••••••••••••••••• (saved)';
  }
  if (result.username) {
    document.getElementById('username').placeholder = '••••••••••• (saved)';
  }
  if (result.password) {
    document.getElementById('password').placeholder = '••••••••••• (saved)';
  }
});

// Load settings
chrome.storage.local.get(['settings'], (result) => {
  if (result.settings) {
    document.getElementById('toggle-click-reveal').checked = result.settings.clickToReveal || false;
    document.getElementById('toggle-sound').checked = result.settings.soundEnabled !== false;
    document.getElementById('toggle-auto-clear').checked = result.settings.autoClearClipboard || false;
    document.getElementById('toggle-auto-login').checked = result.settings.autoLogin !== false; // Default true
  } else {
    // Default auto-login to true
    document.getElementById('toggle-auto-login').checked = true;
  }
});

// Save settings on toggle change
document.getElementById('toggle-click-reveal').addEventListener('change', saveSettings);
document.getElementById('toggle-sound').addEventListener('change', saveSettings);
document.getElementById('toggle-auto-clear').addEventListener('change', saveSettings);
document.getElementById('toggle-auto-login').addEventListener('change', saveSettings);

function saveSettings() {
  const settings = {
    clickToReveal: document.getElementById('toggle-click-reveal').checked,
    soundEnabled: document.getElementById('toggle-sound').checked,
    autoClearClipboard: document.getElementById('toggle-auto-clear').checked,
    autoLogin: document.getElementById('toggle-auto-login').checked,
    theme: 'dark' // Will be managed by popup
  };
  
  chrome.storage.local.set({ settings }, () => {
    const statusDiv = document.getElementById('settings-status');
    statusDiv.className = 'status success';
    statusDiv.textContent = 'Settings saved successfully!';
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 2000);
  });
}

// Save button
document.getElementById('save-btn').addEventListener('click', async () => {
  const secret = document.getElementById('secret').value.trim();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const statusDiv = document.getElementById('status');
  
  if (!secret) {
    statusDiv.className = 'status error';
    statusDiv.textContent = 'Please enter your TOTP secret';
    return;
  }
  
  // Validate secret format (base32)
  const base32Regex = /^[A-Z2-7]+=*$/i;
  if (!base32Regex.test(secret)) {
    statusDiv.className = 'status error';
    statusDiv.textContent = 'Invalid secret format. Should only contain A-Z and 2-7';
    return;
  }
  
  try {
    // Save to Chrome storage
    const dataToSave = { totpSecret: secret };
    
    if (username) {
      dataToSave.username = username;
    }
    
    if (password) {
      dataToSave.password = password;
    }
    
    await chrome.storage.local.set(dataToSave);
    statusDiv.className = 'status success';
    
    if (username && password) {
      statusDiv.textContent = 'Secret and credentials saved successfully! Full auto-login is now enabled.';
    } else {
      statusDiv.textContent = 'Secret saved successfully! Add username/password for full auto-login.';
    }
  } catch (error) {
    statusDiv.className = 'status error';
    statusDiv.textContent = 'Error saving: ' + error.message;
  }
});

// Test button
document.getElementById('test-btn').addEventListener('click', async () => {
  const secret = document.getElementById('secret').value.trim();
  const statusDiv = document.getElementById('status');
  
  if (!secret) {
    statusDiv.className = 'status error';
    statusDiv.textContent = 'Please enter your TOTP secret first';
    return;
  }
  
  // Test generating a code
  try {
    chrome.runtime.sendMessage({ action: 'testOTP', secret: secret }, (response) => {
      if (response && response.token) {
        statusDiv.className = 'status success';
        statusDiv.textContent = `Test successful! Current code: ${response.token}`;
      } else {
        statusDiv.className = 'status error';
        statusDiv.textContent = 'Failed to generate code. Check your secret.';
      }
    });
  } catch (error) {
    statusDiv.className = 'status error';
    statusDiv.textContent = 'Error: ' + error.message;
  }
});

// Delete button
document.getElementById('delete-btn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  
  if (!confirm('Are you sure you want to delete your saved secret and credentials? This cannot be undone.')) {
    return;
  }
  
  try {
    await chrome.storage.local.remove(['totpSecret', 'username', 'password']);
    document.getElementById('secret').value = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    statusDiv.className = 'status success';
    statusDiv.textContent = 'Secret and credentials deleted successfully.';
  } catch (error) {
    statusDiv.className = 'status error';
    statusDiv.textContent = 'Error deleting: ' + error.message;
  }
});