// Wait for page to load and settings
let settings = { autoLogin: true };

// Load settings
chrome.storage.local.get(['settings'], (result) => {
  if (result.settings) {
    settings = result.settings;
  }
  
  // Run auto-login if enabled
  if (settings.autoLogin) {
    detectAndAutoFill();
  }
});

// Detect page type and auto-fill accordingly
async function detectAndAutoFill() {
  const url = window.location.href;
  
  // Check if it's a login page (username/password)
  if (isLoginPage()) {
    setTimeout(() => autoFillLoginPage(), 500);
  }
  // Check if it's a 2FA page
  else if (is2FAPage()) {
    setTimeout(() => autoFill2FA(), 500);
  }
}

function isLoginPage() {
  const url = window.location.href.toLowerCase();
  
  // Check for Binghamton login URLs
  if (url.includes('login') || url.includes('cas')) {
    // Look for username and password fields
    const usernameField = document.querySelector('input[name="username"], input[name="user"], input[type="text"][name*="user" i], input#username, input#user');
    const passwordField = document.querySelector('input[type="password"]');
    
    return usernameField && passwordField;
  }
  
  return false;
}

function is2FAPage() {
  const url = window.location.href.toLowerCase();
  const pageText = document.body.innerText.toLowerCase();
  
  // Check for 2FA indicators
  const indicators = ['one-time', 'otp', 'verification code', '2fa', 'two-factor', 'authenticator'];
  
  return indicators.some(indicator => 
    url.includes(indicator) || pageText.includes(indicator)
  );
}

async function autoFillLoginPage() {
  try {
    // Get stored credentials
    const data = await chrome.storage.local.get(['username', 'password']);
    
    if (!data.username || !data.password) {
      console.log('No credentials stored for auto-login');
      return;
    }
    
    // Find username field
    const usernameField = document.querySelector(
      'input[name="username"], input[name="user"], input[type="text"][name*="user" i], input#username, input#user'
    );
    
    // Find password field
    const passwordField = document.querySelector('input[type="password"]');
    
    if (usernameField && passwordField) {
      // Fill username
      usernameField.value = data.username;
      usernameField.dispatchEvent(new Event('input', { bubbles: true }));
      usernameField.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Fill password
      passwordField.value = data.password;
      passwordField.dispatchEvent(new Event('input', { bubbles: true }));
      passwordField.dispatchEvent(new Event('change', { bubbles: true }));
      
      console.log('Credentials auto-filled');
      
      // Auto-submit the form after a short delay
      setTimeout(() => {
        const form = usernameField.closest('form');
        if (form) {
          // Try to find and click submit button
          const submitBtn = form.querySelector(
            'button[type="submit"], input[type="submit"], button[name="submit"]'
          );
          
          if (submitBtn) {
            submitBtn.click();
            console.log('Login form auto-submitted');
          } else {
            // If no button found, submit the form directly
            form.submit();
            console.log('Login form submitted');
          }
        }
      }, 100);
    }
  } catch (error) {
    console.error('Auto-fill login error:', error);
  }
}

async function autoFill2FA() {
  try {
    // Common selectors for OTP input fields
    const selectors = [
      'input[name*="otp" i]',
      'input[name*="token" i]',
      'input[name*="code" i]',
      'input[type="text"][maxlength="6"]',
      'input[placeholder*="code" i]',
      'input[placeholder*="otp" i]',
      'input#otp',
      'input#token',
      'input#code'
    ];
    
    let otpInput = null;
    
    // Try to find OTP input field
    for (const selector of selectors) {
      otpInput = document.querySelector(selector);
      if (otpInput && otpInput.offsetParent !== null) {
        break;
      }
    }
    
    if (!otpInput) {
      console.log('OTP input field not found');
      return;
    }
    
    console.log('OTP input field found, auto-filling...');
    
    // Get OTP from background script
    chrome.runtime.sendMessage({ action: 'generateOTP' }, (response) => {
      if (response && response.token) {
        otpInput.value = response.token;
        
        // Trigger input events for form validation
        otpInput.dispatchEvent(new Event('input', { bubbles: true }));
        otpInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        console.log('OTP auto-filled:', response.token);
        
        // Auto-submit form after a short delay
        setTimeout(() => {
          const form = otpInput.closest('form');
          if (form) {
            const submitBtn = form.querySelector(
              'button[type="submit"], input[type="submit"], button[name="submit"]'
            );
            
            if (submitBtn) {
              submitBtn.click();
              console.log('2FA form auto-submitted');
            } else {
              form.submit();
              console.log('2FA form submitted');
            }
          }
        }, 100);
      }
    });
    
  } catch (error) {
    console.error('Auto-fill 2FA error:', error);
  }
}

// Watch for page changes (for SPAs)
const observer = new MutationObserver(() => {
  if (settings.autoLogin) {
    detectAndAutoFill();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', detectAndAutoFill);
} else {
  detectAndAutoFill();
}