# BU 2FA Helper

A Chrome extension for Binghamton University students to streamline 2FA authentication with full auto-login capabilities.

![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Important Disclaimer

**This extension is for convenience only.** By using this extension, you are trading security for convenience. Your TOTP secret and login credentials will be stored locally on your device.

- **Not affiliated** with Binghamton University
- Anyone with physical access to your computer can access your BU account
- Only use on devices you trust and personally control
- Keep Google Authenticator as a backup method

## Features

### Core Functionality
- **Full Auto-Login** - Automatically fills username, password, and 2FA codes without any manual input
- **Auto-Submit Forms** - Submits login and 2FA forms automatically (can be disabled)
- **Quick Code Access** - View current 2FA codes from popup with countdown timer
- **Usage Statistics** - Track how many times you've used the extension

### Privacy and Security
- **Click-to-Reveal Mode** - Hide codes by default for shoulder-surfing protection
- **Auto-Clear Clipboard** - Optional 30-second clipboard clearing after copying codes
- **Toggle Auto-Login** - Disable full auto-login and use manual mode
- **Local Storage Only** - All data stays on your device, no external servers

### Customization
- **Dark/Light Theme** - Toggle between themes
- **Sound Effects** - Optional audio feedback (can be disabled)
- **Smooth Animations** - Polished code update transitions
- **Confetti Celebration** - Fun animation on first successful setup

## Installation Guide

### Step 1: Download the Extension

**Option A: Download from GitHub Releases (Recommended)**
1. Go to [Releases Page](https://github.com/SELESTER11/bu-2fa-helper/releases)
2. Download the latest `bu-2fa-helper-v1.0.zip` file
3. Extract the ZIP file to a permanent location on your computer (e.g., `Documents/Chrome Extensions/bu-2fa-helper`)
   - **Important:** Do not delete this folder after installation, Chrome needs it to run the extension

**Option B: Clone from GitHub**
```bash
git clone https://github.com/SELESTER11/bu-2fa-helper.git
cd bu-2fa-helper
```

### Step 2: Enable Developer Mode in Chrome

1. Open Google Chrome
2. In the address bar, type: `chrome://extensions/` and press Enter
3. In the top-right corner, toggle **"Developer mode"** to ON (it will turn blue)
   - You should now see three new buttons appear: "Load unpacked", "Pack extension", and "Update"

![Developer Mode](https://i.imgur.com/example.png)

### Step 3: Load the Extension

1. Click the **"Load unpacked"** button (top-left area)
2. Navigate to the folder where you extracted the extension
3. Select the **`chrome-extension`** folder (not the parent folder)
4. Click **"Select Folder"** or **"Open"**
5. The extension should now appear in your extensions list

**Troubleshooting:**
- If you see errors, make sure you selected the `chrome-extension` folder, not the parent folder
- If the extension doesn't appear, try refreshing the extensions page

### Step 4: Pin the Extension (Optional but Recommended)

1. Look for the puzzle piece icon in Chrome's toolbar (top-right)
2. Click it to see all your extensions
3. Find "BU 2FA Helper" and click the pin icon next to it
4. The extension icon will now appear in your Chrome toolbar for easy access

## Setup and Configuration

### Getting Your TOTP Secret from Binghamton

**Step 1: Access the Password Portal**
1. Go to [https://password.binghamton.edu](https://password.binghamton.edu)
2. Log in with your Binghamton University credentials

**Step 2: Create a New Token**
1. Click **"Create New Token"** button
2. If you already have a token, you may need to delete it first and create a new one

**Step 3: Select Authenticator Type**
1. From the dropdown menu, select **"Default (Authenticator App)"**
2. Leave the "Advanced Private Key" field **blank** (don't enter anything there)
3. Click **Submit** or **Continue**

**Step 4: Copy Your Secret and Verify**
1. You'll see a QR code and text underneath it
2. The text looks like: `JBSWY3DPEHPK3PXP` (a long string of letters and numbers)
3. **Copy this text exactly** (select and Ctrl+C or Cmd+C)
4. **IMPORTANT:** You need to verify this works before saving:
   - Open the extension settings (or use Google Authenticator)
   - Paste the secret and click "Test Code" 
   - You'll get a 6-digit code (e.g., 123456)
   - Enter this code in the field on password.binghamton.edu
   - Click Submit to verify and activate your token
5. **Backup:** Also scan the QR code with Google Authenticator on your phone as a backup

**Note:** If you don't verify the code, your 2FA won't be activated and won't work for login.

### Configuring the Extension

**Step 1: Open Extension Settings**
1. Click the BU 2FA Helper icon in your Chrome toolbar
2. Click **"Settings"** at the bottom of the popup
3. You'll see four tabs: Setup, Settings, Features, Security

**Step 2: Enter Your Credentials (Setup Tab)**

In the **Setup** tab, you'll see three input fields:

1. **Binghamton Username**
   - Enter your BU username (e.g., `jsmith23` )
   - This enables full auto-login

2. **Binghamton Password**
   - Enter your BU password
   - This will be stored locally and encrypted by Chrome

3. **Your TOTP Secret**
   - Paste the secret text you copied from password.binghamton.edu
   - Should only contain letters A-Z and numbers 2-7

**Step 3: Save Your Configuration**
1. Click **"Save Secret"** button
2. You should see: "Secret and credentials saved successfully!"
3. You can click **"Test Code"** to verify it generates valid codes

**Step 4: Configure Settings (Settings Tab)**

Go to the **Settings** tab to customize:

- **Click to Reveal Code** - Hide codes by default (OFF by default)
- **Sound Effects** - Play sounds when copying codes (ON by default)
- **Auto-Clear Clipboard** - Clear clipboard after 30 seconds (OFF by default)
- **Full Auto-Login** - Automatically fill and submit everything (ON by default)

**Important:** If you disable "Full Auto-Login", the extension will only show codes in the popup and you'll need to manually copy them.

## How It Works

### With Full Auto-Login Enabled (Default)

1. You visit any Binghamton login page (e.g., myBinghamton, BU Brain, Brightspace)
2. The extension automatically:
   - Fills in your username
   - Fills in your password
   - Clicks the "Login" button
3. The 2FA page loads
4. The extension automatically:
   - Generates the current 6-digit code
   - Fills it into the 2FA field
   - Clicks the "Submit" button
5. You're logged in - **no clicks or typing required**

**Total time:** Usually 2-5 seconds from landing on login page to being logged in

### With Full Auto-Login Disabled

1. Visit Binghamton login page
2. Manually enter username and password (or use Chrome's password manager)
3. Click login
4. On 2FA page, the extension auto-fills the code
5. You click submit

**Or:** Click the extension icon anytime to see your current code and copy it manually

## Supported Binghamton Sites

The extension works on all Binghamton University sites that use CAS (Central Authentication System), including:

- myBinghamton Portal
- BU Brain (Student Records)
- Brightspace (Learning Management)
- Gmail/BU Email
- VPN (Cisco AnyConnect)
- All other sites using password.binghamton.edu authentication

## Usage Statistics

The extension tracks (locally only):
- **Total Uses** - How many times you've generated/copied codes
- **Today's Uses** - Codes generated today

This data never leaves your device and is only for your personal reference.

## Security Information

### What We Do to Protect You
- All data stored locally using Chrome's secure storage API
- No external servers or network requests
- TOTP codes generated using standard cryptographic algorithms (HMAC-SHA1)
- Open source code - fully auditable
- Optional auto-clear clipboard
- Optional click-to-reveal for privacy

### What You Should Know
- Anyone with access to your unlocked computer can use the extension
- Full auto-login removes ALL authentication barriers
- This is a tradeoff: maximum convenience for reduced security
- **Only use on personal, trusted devices**
- **Never use on shared or public computers**
- Keep Google Authenticator as a backup method

### Best Practices
1. Only install on devices you personally own
2. Use a strong computer password and lock your screen when away
3. Keep auto-login enabled only on your primary personal device
4. Disable auto-login on laptops you travel with
5. Enable click-to-reveal if you work in public spaces
6. Regularly update your TOTP token on password.binghamton.edu

## Troubleshooting

### Extension doesn't auto-fill
- Make sure "Full Auto-Login" is enabled in Settings
- Verify you've saved username, password, and TOTP secret
- Check that you're on an actual Binghamton login page
- Try reloading the extension in chrome://extensions/

### Wrong code generated
- Delete your token on password.binghamton.edu and create a new one
- Make sure you copied the TOTP secret correctly (only letters A-Z and numbers 2-7)
- Check your computer's time is set correctly (TOTP depends on accurate time)

### Auto-login not working
- Disable and re-enable "Full Auto-Login" in Settings
- Clear your saved credentials and re-enter them
- Some Binghamton pages may have different form structures - report these as issues

### Extension disappeared after computer restart
- This means you deleted the extension folder
- Chrome needs the folder to stay in place permanently
- Re-download and extract to a permanent location

### Can't find the extension icon
- Look for the puzzle piece icon in Chrome's toolbar
- Click it and pin "BU 2FA Helper"
- The icon will then always be visible

## Frequently Asked Questions

**Q: Is this safe to use?**
A: It's as safe as storing passwords in Chrome's password manager, but removes 2FA security. Only use on trusted personal devices.

**Q: Can I use this on multiple computers?**
A: Yes, but you need to set it up separately on each computer. Your settings don't sync.

**Q: What if I lose my phone with Google Authenticator?**
A: You can still log in using this extension. That's one benefit - it's a backup to your phone.

**Q: Does this work on Firefox or Safari?**
A: No, currently Chrome only. Firefox support may come in the future.

**Q: Can Binghamton University detect that I'm using this?**
A: No, the extension generates legitimate TOTP codes indistinguishable from manual entry.

**Q: Will this extension steal my password?**
A: No, the code is open source and auditable. All data stays local. No network requests are made.

**Q: What happens if I uninstall the extension?**
A: All stored data (credentials and TOTP secret) is deleted. You'll need to set it up again if you reinstall.

## Development

### Project Structure
```
bu-2fa-helper/
├── chrome-extension/
│   ├── manifest.json       # Extension configuration
│   ├── popup.html          # Popup interface
│   ├── popup.css           # Popup styles
│   ├── popup.js            # Popup logic
│   ├── options.html        # Settings page
│   ├── options.js          # Settings logic
│   ├── background.js       # TOTP generation
│   ├── content.js          # Auto-fill logic
│   ├── icon.png            # Extension icon
│   └── sounds/             # Audio files
├── README.md
├── LICENSE
└── PRIVACY.md
```

### Technical Details
- **Manifest Version:** V3 (latest Chrome extension standard)
- **TOTP Algorithm:** HMAC-SHA1 with 30-second time step
- **Permissions:** activeTab, storage, clipboardWrite
- **No External Dependencies:** Pure vanilla JavaScript

### Building from Source
No build process required. Clone the repo and load the `chrome-extension` folder directly.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code:
- Follows existing code style
- Includes comments for complex logic
- Doesn't introduce new dependencies
- Maintains security best practices

## Support and Feedback

- **Report Bugs:** [GitHub Issues](https://github.com/SELESTER11/bu-2fa-helper/issues)
- **Feature Requests:** [GitHub Issues](https://github.com/SELESTER11/bu-2fa-helper/issues)
- **Email:** vkaramc1@binghamton.edu
- **Privacy Policy:** [PRIVACY.md](https://github.com/SELESTER11/bu-2fa-helper/blob/main/PRIVACY.md)

## Changelog

### Version 1.0.0 (January 2026)
- Initial release
- Full auto-login with username/password storage
- Auto-fill and auto-submit for login and 2FA forms
- Dark/Light theme toggle
- Click-to-reveal privacy mode
- Usage statistics tracking
- Sound effects
- Auto-clear clipboard option
- Smooth animations and polish

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Varun Karamchandani**
- Email: vkaramc1@binghamton.edu
- GitHub: [@SELESTER11](https://github.com/SELESTER11)

## Acknowledgments

- Created for the Binghamton University student community
- Thanks to all BU students who provided feedback and testing
- Inspired by the need for better authentication UX

## Legal

This extension is not affiliated with, endorsed by, or sponsored by Binghamton University or the State University of New York. All trademarks and registered trademarks are the property of their respective owners.

Use of this extension is at your own risk. The author is not responsible for any account security issues that may arise from using this software.

---


**Remember:** This extension prioritizes convenience over security. Always maintain a backup 2FA method and only use on devices you personally own and control.

