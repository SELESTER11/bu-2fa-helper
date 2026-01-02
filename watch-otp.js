const { authenticator } = require('otplib');

const SECRET = 'F2Y5HJDMHIKGJITBDM3L5QERFZNEKTXA';  // Same secret as before

function displayOTP() {
  const token = authenticator.generate(SECRET);
  const timeRemaining = authenticator.timeRemaining();
  
  // Clear console for clean display
  console.clear();
  console.log('=================================');
  console.log('Binghamton 2FA Code');
  console.log('=================================');
  console.log('Code:', token);
  console.log('Expires in:', timeRemaining, 'seconds');
  console.log('=================================');
  console.log('Press Ctrl+C to exit');
}

// Update every second
displayOTP();
setInterval(displayOTP, 1000);