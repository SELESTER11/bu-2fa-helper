// Wait for page to load and settings
let settings = { autoLogin: true };
let hasRun = false;
let isSubmitting = false;
let observer = null;

// Load settings
chrome.storage.local.get(['settings'], (result) => {
  if (result.settings) {
    settings = result.settings;
  }
  
  if (settings.autoLogin && shouldRunOnThisPage()) {
    detectAndAutoFill();
  }
});

// Check if we should run on this page at all
function shouldRunOnThisPage() {
  const url = window.location.href.toLowerCase();
  
  // Never run on these pages
  const blockedPatterns = [
    'brightspace.com',
    'd2l.com',
    'my.binghamton.edu/portal',
    'brain.binghamton.edu',
    '/logout',
    '/dashboard',
    '/home'
  ];
  
  // If URL contains any blocked pattern, don't run
  if (blockedPatterns.some(pattern => url.includes(pattern))) {
    console.log('BU 2FA Helper: Skipping this page (logged-in area)');
    stopObserver();
    return false;
  }
  
  return true;
}

// Stop the mutation observer
function stopObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
    console.log('BU 2FA Helper: Observer stopped');
  }
}

// Detect page type and auto-fill accordingly
async function detectAndAutoFill() {
  if (hasRun || !shouldRunOnThisPage()) return;
  
  if (isLoginPage()) {
    hasRun = true;
    setTimeout(() => autoFillLoginPage(), 100);
  } else if (is2FAPage()) {
    hasRun = true;
    setTimeout(() => autoFill2FA(), 100);
  }
}

function isLoginPage() {
  const url = window.location.href.toLowerCase();
  
  if (!url.includes('login') && !url.includes('cas')) {
    return false;
  }
  
  const usernameField = document.querySelector('input[name="username"], input[name="user"], input[type="text"][name*="user" i], input#username, input#user');
  const passwordField = document.querySelector('input[type="password"]');
  
  return usernameField && passwordField;
}

function is2FAPage() {
  const url = window.location.href.toLowerCase();
  const pageText = document.body?.innerText?.toLowerCase() || '';
  
  const indicators = ['one-time', 'otp', 'verification code', '2fa', 'two-factor', 'authenticator'];
  
  return indicators.some(indicator => 
    url.includes(indicator) || pageText.includes(indicator)
  );
}

async function autoFillLoginPage() {
  if (isSubmitting) return;
  isSubmitting = true;
  
  try {
    const data = await chrome.storage.local.get(['username', 'password']);
    
    if (!data.username || !data.password) {
      console.log('BU 2FA Helper: No credentials stored');
      isSubmitting = false;
      return;
    }
    
    const usernameField = document.querySelector('input[name="username"], input[name="user"], input[type="text"][name*="user" i], input#username, input#user');
    const passwordField = document.querySelector('input[type="password"]');
    
    if (usernameField && passwordField) {
      usernameField.value = data.username;
      usernameField.dispatchEvent(new Event('input', { bubbles: true }));
      usernameField.dispatchEvent(new Event('change', { bubbles: true }));
      
      passwordField.value = data.password;
      passwordField.dispatchEvent(new Event('input', { bubbles: true }));
      passwordField.dispatchEvent(new Event('change', { bubbles: true }));
      
      console.log('BU 2FA Helper: Credentials filled');
      
      setTimeout(() => {
        const form = usernameField.closest('form');
        if (form) {
          const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
          
          if (submitBtn) {
            submitBtn.click();
          } else {
            form.submit();
          }
          console.log('BU 2FA Helper: Login submitted');
          
          // Stop observer after submission
          setTimeout(() => stopObserver(), 1000);
        }
        isSubmitting = false;
      }, 100);
    } else {
      isSubmitting = false;
    }
  } catch (error) {
    console.error('BU 2FA Helper: Login error', error);
    isSubmitting = false;
  }
}

async function autoFill2FA() {
  if (isSubmitting) return;
  isSubmitting = true;
  
  try {
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
    
    for (const selector of selectors) {
      otpInput = document.querySelector(selector);
      if (otpInput && otpInput.offsetParent !== null) {
        break;
      }
    }
    
    if (!otpInput) {
      console.log('BU 2FA Helper: OTP field not found');
      isSubmitting = false;
      return;
    }
    
    console.log('BU 2FA Helper: OTP field found');
    
    chrome.runtime.sendMessage({ action: 'generateOTP' }, (response) => {
      if (response && response.token) {
        otpInput.value = response.token;
        otpInput.dispatchEvent(new Event('input', { bubbles: true }));
        otpInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        console.log('BU 2FA Helper: OTP filled');
        
        setTimeout(() => {
          const form = otpInput.closest('form');
          if (form) {
            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
            
            if (submitBtn) {
              submitBtn.click();
            } else {
              form.submit();
            }
            console.log('BU 2FA Helper: 2FA submitted');
            
            // Stop observer after successful 2FA submission
            setTimeout(() => stopObserver(), 1000);
          }
          isSubmitting = false;
        }, 100);
      } else {
        isSubmitting = false;
      }
    });
    
  } catch (error) {
    console.error('BU 2FA Helper: 2FA error', error);
    isSubmitting = false;
  }
}

// Only start observer if we should run on this page
if (shouldRunOnThisPage()) {
  let lastUrl = location.href;
  observer = new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      hasRun = false;
      isSubmitting = false;
      
      // Check if we should stop on the new page
      if (!shouldRunOnThisPage()) {
        stopObserver();
        return;
      }
      
      if (settings.autoLogin) {
        setTimeout(() => detectAndAutoFill(), 300);
      }
    }
  });
  
  observer.observe(document, { subtree: true, childList: true });
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (shouldRunOnThisPage()) detectAndAutoFill();
  });
} else {
  if (shouldRunOnThisPage()) detectAndAutoFill();
}

console.log('BU 2FA Helper: Content script loaded');