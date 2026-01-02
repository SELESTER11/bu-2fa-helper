// Only run on actual login pages, not on every Binghamton page
const LOGIN_PAGE_INDICATORS = [
    'password.binghamton.edu',
    '/login',
    '/cas/login',
    'One-Time-Password',
    'otp',
    'token'
  ];
  
  function isLoginPage() {
    const url = window.location.href.toLowerCase();
    const pageText = document.body.innerText.toLowerCase();
    
    return LOGIN_PAGE_INDICATORS.some(indicator => 
      url.includes(indicator.toLowerCase()) || pageText.includes(indicator.toLowerCase())
    );
  }
  
  // Auto-fill OTP on Binghamton login pages
  async function autoFillOTP() {
    // Only run on login pages
    if (!isLoginPage()) {
      console.log('Not a login page, skipping auto-fill');
      return;
    }
    
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
        if (otpInput && otpInput.offsetParent !== null) { // Make sure it's visible
          break;
        }
      }
      
      if (!otpInput) {
        console.log('OTP input field not found');
        return;
      }
      
      console.log('OTP input field found, waiting for user action...');
      
      // Wait for user to focus on the OTP field before auto-filling
      otpInput.addEventListener('focus', function autoFill() {
        chrome.runtime.sendMessage({ action: 'generateOTP' }, (response) => {
          if (response && response.token) {
            otpInput.value = response.token;
            
            // Trigger input event for form validation
            otpInput.dispatchEvent(new Event('input', { bubbles: true }));
            otpInput.dispatchEvent(new Event('change', { bubbles: true }));
            
            console.log('OTP auto-filled:', response.token);
          }
        });
        
        // Remove listener after first use
        otpInput.removeEventListener('focus', autoFill);
      }, { once: true });
      
    } catch (error) {
      console.error('Auto-fill error:', error);
    }
  }
  
  // Run when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoFillOTP);
  } else {
    autoFillOTP();
  }