🔐 PassVault – Privacy-First Password Manager

A lightweight, secure, and open-source password manager built with Next.js that keeps your data encrypted on the client — so your passwords never touch the server in plaintext.

✨ Fast • Simple • Private • Self-Hostable 

🌟 Features
✅ Core
--Strong password generator (length, symbols, numbers, exclude look-alikes)
--Encrypted vault (title, username, password, URL, notes)
--Client-side encryption — server only stores encrypted blobs
--Copy to clipboard with auto-clear feedback (~15s)
--Basic search/filter across entries
--Email + password authentication
--Encrypted import/export (.vault.json backup files)
--Minimal, responsive UI with Tailwind CSS

🔒 Privacy & Security
--Zero plaintext on server — all encryption/decryption in-browser
--HttpOnly session cookies
--AES-GCM + PBKDF2 encryption using Web Crypto API (no external libs)
--No tracking, no analytics, no third parties

🚀 Getting Started
1. Clone the repo
 -- git clone https://github.com/Siddarth474/next-password-vault.git
 -- cd password-vault
2. Install dependencies
   -- npm install
3. Set up environment variables
   Create a .env.local file in the root:
   -- MONGODB_URL="mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net"
   -- JWT_SECRET="your_32_char_strong_secret_here"
4. Run the development server
   -- npm run dev
   Open http://localhost:3000 and start using PassVault!

📁 Project Structure
/src
    /app
      /api           → Next.js API routes (auth, vault, logout)
      /vault         → Main vault UI (client-side encrypted)
      /(auth)        → Login / Signup pages
    /components      → Reusable UI (generator, copy button, header)
    /lib             → Utilities (crypto, auth, db)
    /models          → MongoDB schemas
    /utils           → toasts
   
