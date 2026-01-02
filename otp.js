const { authenticator } = require('otplib');

// Replace this with your actual secret from Binghamton
const SECRET = 'F2Y5HJDMHIKGJITBDM3L5QERFZNEKTXA';

// Generate the current OTP
const token = authenticator.generate(SECRET);

console.log('Current OTP:', token);

// Show time remaining until next code
const timeRemaining = authenticator.timeRemaining();
console.log('Time remaining:', timeRemaining, 'seconds');