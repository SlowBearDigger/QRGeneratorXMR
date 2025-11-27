QRGeneratorXMR


This is the source code for the website: https://slowbeardigger.dev/QR/

For peace of mind, this is an open-source tool for generating customizable QR codes, with a focus on privacy and cryptocurrencies like Monero.

Monero PayQR Generator - Features List

Core Functionality (The "Universal" Engine)
Universal QR Generation: No longer restricted to crypto. Generate QR codes for URLs, Plain Text, Wi-Fi credentials, or any string data.
Smart Auto-Detect (Beta): Automatically recognizes cryptocurrency addresses (Monero, Bitcoin, Ethereum, Solana, etc.) upon pasting and switches the form context instantly.
Real-Time Instant Preview: Zero-latency rendering. The QR code updates automatically as you type or adjust styles, using optimized debouncing for performance.
Privacy-First Architecture: 100% Client-Side. No data is ever sent to a server. All generation happens locally in your browser using WebAssembly and JS.

Professional Invoice System (New!)
Dynamic Invoicing: Create professional crypto invoices/receipts directly in the browser.
Customizable Fields:
Business Name & Logo.
Invoice Number & Date.
Dynamic Line Items: Add unlimited rows for items (Description + Price).
Footer/Memo notes.
Calculated Totals: Visual breakdown of amounts.
High-Res Export: Download invoices as PDF (for printing) or PNG (for sharing online), generated via HTML5 Canvas.
Embedded QR: The payment QR is automatically embedded and styled within the invoice layout.

Deep Customization & Branding
Advanced Styling Engine:
Patterns: Choose from Squares, Dots, Rounded, Classy, and Extra-rounded styles.
Corners: Customize corner markers (Squares, Dots).
Gradient Support: Full support for Linear and Radial gradients with customizable start/end colors.
Logo Integration: Upload and embed your own logo (PNG/SVG) in the center of the QR code.
Background Control: Custom background colors or transparent backgrounds for invoices.
One-Click Randomizer: "Feel lucky" button to generate unique, aesthetically pleasing color combinations instantly.
Visual Presets: Built-in themes (Monero Orange, Cyberpunk, Synthwave, Cypherpunk).

Security & Safety Features
Address Verification Mode: A dedicated "Verify Address" tool that forces a double-check comparison to prevent clipboard hijacking (clippers) or human error.
Input Validation: Regex-based validation for supported cryptocurrencies to warn about malformed addresses.
Disposable QRs: Optional "Self-destruct" mode where the QR blurs/vanishes from the screen after a set time (useful for POS terminals or temporary displays).

Technical & UX Highlights
PWA (Progressive Web App): Installable on mobile and desktop. Works offline.
Responsive Design: Fully responsive interface that adapts from mobile screens to large desktop monitors.
Interactive Background: Physics-based particle background on desktop (drifting/reactive dots).
Export Formats: Download standalone QRs as .png, .svg, or .pdf.
Social Sharing: One-click intent to share your tool on X (Twitter).

Supported Cryptocurrencies (Native Templates)
Monero (XMR) - First-class citizen support.
Bitcoin (BTC) - Supports BIP21 URI schemes.
Ethereum (ETH)
Solana (SOL)
Zcash (ZEC)
Firo (FIRO)
...and any other chain via Custom Mode.

Installation and Setup
Just install Node.js, open in Visual Studio Code:
npm install
Do your changes (-save if adding dependencies)
npm run build
Put online (deploy to your hosting service).

Reporting Issues
If you find a bug, have a feature request, or spot something in the documentation that needs fixing:
Check if the issue already exists in the Issues section: https://github.com/SlowBearDigger/QRGeneratorXMR/issues
If not, open a new issue. Provide as much detail as possible: steps to reproduce, expected vs. actual behavior, screenshots, browser/environment info, etc.

Setting Up the Development Environment
To get started with development:
Fork the repository on GitHub.
Clone your fork locally: git clone https://github.com/YOUR_USERNAME/QRGeneratorXMR.git
Install dependencies: npm install
Run the development server: npm run dev (or npm start, depending on your setup)
Make changes and build: npm run build

Other Ways to Contribute
Improve documentation (README, CONTRIBUTING, etc.).
Translate the app or docs to other languages.
Share the project on social media or forums.
Donate via Monero if you like: 42w9YaCW8UwZ2BmQztNmUd6JgYVcjW7LXEMTcQqHdmtFCsSo5RGY2eQg2iZ3WyBSSs63gnhczLkJ46yfr4ojCXWT3H1ZBbR

Thanks for helping make QRGeneratorXMR awesome! If you have questions, feel free to open an issue or reach out.

License
This project is licensed under the MIT License - see the LICENSE file for details.
