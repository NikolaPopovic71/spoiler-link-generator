# SpoilerDrop 👁️

**Hide any text behind animated particles. Share a link. Let them click to reveal.**

→ **[Live Demo](https://nikolapopovic71.github.io/spoiler-link-generator/)**

---

## What it does

Type a secret message, get a shareable link. Anyone who opens it sees the text covered in moving particles — they click to reveal. No account, no backend, no tracking.

## How it works

The text is **Base64-encoded directly into the URL** (`?s=...`). Nothing is stored anywhere — the link *is* the message.

The particle effect is built from scratch using the **Canvas API** and **CSS blur** — no libraries. There is a popular package ([spoilerjs](https://github.com/shajidhasan/spoilerjs)) that does something similar, but this implementation is custom and dependency-free.

## Features

- 🎇 Animated particle cover effect
- 🔗 Shareable links — text lives in the URL
- 📋 One-click copy
- 👁️ Preview before sharing
- ✕ Clear button
- 📱 Mobile friendly
- 🚫 Zero dependencies, zero backend, zero tracking

## Stack

- Vanilla HTML / CSS / JavaScript
- Canvas API (particle engine)
- Base64 URL encoding (`btoa` / `atob`)

## Local development

No build step needed. Open `index.html` directly in a browser via `Live Server`, or use any static server:

```bash
npx serve .
# or
python -m http.server 5500
```

## License

MIT — do whatever you want with it.

---

Built by [Nikola Popovic](https://ponitech.pro) / [ponITech](https://ponitech.pro)
