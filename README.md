# BU 2FA Helper

A Chrome extension for Binghamton University students to streamline 2FA authentication with auto-fill and convenient code generation.

![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Important Disclaimer

**This extension is for convenience only.** By using this extension, you are trading some security for convenience. Your TOTP secret will be stored locally on your device.

- **Not affiliated** with Binghamton University
- Anyone with physical access to your computer can access your 2FA codes
- Only use on devices you trust and control
- Keep Google Authenticator as a backup

## Features

### Core Functionality
- Auto-fill 2FA codes on Binghamton login pages
- Quick code access from popup with countdown timer
- Usage statistics to track your activity

### Privacy and Security
- Click-to-reveal mode to hide codes by default for shoulder-surfing protection
- Auto-clear clipboard (optional 30-second clearing)
- Expiration warnings with visual alerts when codes are about to expire

### Customization
- Dark/Light theme toggle
- Sound effects for feedback (optional)
- Smooth animations for code updates
- Confetti celebration on first setup

## Installation

### Option 1: Manual Installation (Recommended)

1. Download the latest release from [Releases](https://github.com/yourusername/bu-2fa-helper/releases)
2. Unzip the downloaded file
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" (toggle in top right)
5. Click "Load unpacked"
6. Select the unzipped `chrome-extension` folder

### Option 2: Clone from GitHub
```bash
git clone https://github.com/yourusername/bu-2fa-helper.git
cd bu-2fa-helper
```

Then follow steps 3-6 from Option 1.

## Setup Guide

### Getting Your TOTP Secret

1. Go to https://password.binghamton.edu
2. Log in with your Binghamton credentials
3. Click "Create New Token" or manage existing tokens
4. Select "Default (Authenticator App)"
5. You'll see a QR code with text underneath
6. Copy the text string (e.g., `JBSWY3DPEHPK3PXP`)
7. Paste it into the extension's setup page
8. Click "Save Secret"

**Important:** Also scan the QR code with Google Authenticator as a backup!

## Configuration

Access settings by clicking the extension icon and selecting "Settings".

### Available Options

- **Click to Reveal Code**: Hide codes by default, click to show
- **Sound Effects**: Enable/disable audio feedback
- **Auto-Clear Clipboard**: Clear copied codes after 30 seconds (disabled by default)

## Security Implementation

### What We Do
- All data is stored locally on your device only
- No external servers or network requests
- TOTP codes generated using standard cryptographic algorithms
- Chrome's secure storage API for secrets
- Optional auto-clear clipboard after 30 seconds
- Click-to-reveal to prevent shoulder surfing
- Open source code available for inspection

### What You Should Know
- Anyone with access to your computer can use the extension
- This reduces your 2FA security for convenience
- Keep a backup 2FA method like Google Authenticator
- Only use on trusted, personal devices
- Not recommended for shared or public computers

## Technical Details

- Manifest V3
- Uses Web Crypto API for TOTP generation
- No external dependencies or libraries
- Base32 decoding for TOTP secrets
- HMAC-SHA1 algorithm for code generation

## Development

### Project Structure
```
bu-2fa-helper/
├── chrome-extension/
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.css
│   ├── popup.js
│   ├── options.html
│   ├── options.js
│   ├── background.js
│   ├── content.js
│   └── icon.png
└── README.md
```

### Building from Source

No build process required. The extension uses vanilla JavaScript and runs directly in Chrome.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

- Report issues: [GitHub Issues](https://github.com/SELESTER11/bu-2fa-helper/issues)
- Email: vkaramchanda@binghamton.edu

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**Varun Karamchandani**
- Email: vkaramchanda@binghamton.edu
- GitHub: @SELESTER11(https://github.com/SELESTER11)

## Acknowledgments

- Created for the Binghamton University community
- Thanks to all BU students who provided feedback and testing

---

**Remember**: This extension is not affiliated with or endorsed by Binghamton University. Use at your own risk and always maintain a backup 2FA method.

