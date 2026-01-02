// TOTP generation using Web Crypto API
async function generateTOTP(secret) {
    const epoch = Math.floor(Date.now() / 1000);
    const timeStep = 30;
    const counter = Math.floor(epoch / timeStep);
    
    // Decode base32 secret
    const key = base32Decode(secret);
    
    // Generate HMAC
    const counterBuffer = new ArrayBuffer(8);
    const counterView = new DataView(counterBuffer);
    counterView.setUint32(4, counter, false);
    
    const keyData = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', keyData, counterBuffer);
    const signatureArray = new Uint8Array(signature);
    
    // Generate OTP
    const offset = signatureArray[19] & 0xf;
    const binary = 
      ((signatureArray[offset] & 0x7f) << 24) |
      ((signatureArray[offset + 1] & 0xff) << 16) |
      ((signatureArray[offset + 2] & 0xff) << 8) |
      (signatureArray[offset + 3] & 0xff);
    
    const otp = (binary % 1000000).toString().padStart(6, '0');
    
    // Calculate time remaining
    const timeRemaining = timeStep - (epoch % timeStep);
    
    return { token: otp, timeRemaining };
  }
  
  // Base32 decoder
  function base32Decode(base32) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    
    base32 = base32.toUpperCase().replace(/=+$/, '');
    
    for (let i = 0; i < base32.length; i++) {
      const val = alphabet.indexOf(base32[i]);
      if (val === -1) continue;
      bits += val.toString(2).padStart(5, '0');
    }
    
    const bytes = new Uint8Array(Math.floor(bits.length / 8));
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(bits.substr(i * 8, 8), 2);
    }
    
    return bytes;
  }
  
  // Listen for messages
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'generateOTP') {
      handleGenerateOTP(sendResponse);
      return true;
    }
    
    if (request.action === 'testOTP') {
      generateTOTP(request.secret).then(result => {
        sendResponse(result);
      }).catch(error => {
        sendResponse({ error: error.message });
      });
      return true;
    }
  });
  
  async function handleGenerateOTP(sendResponse) {
    try {
      const result = await chrome.storage.local.get(['totpSecret']);
      
      if (!result.totpSecret) {
        sendResponse({ error: 'No secret configured. Please set up in options.' });
        return;
      }
      
      // Generate OTP directly from stored secret
      const otpResult = await generateTOTP(result.totpSecret);
      sendResponse(otpResult);
      
    } catch (error) {
      sendResponse({ error: error.message });
    }
  }
  
  // Open options page on install
  chrome.runtime.onInstalled.addListener(() => {
    chrome.runtime.openOptionsPage();
  });