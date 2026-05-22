# CCAT Study Portal — Full Project Plan

## Overview

A study portal for CCAT/CDAC students where PDFs are hosted via Telegram Bot, protected by one-time tokens, and monetized through Google AdSense.

**Total Cost: ₹0 to ₹500/year** (only domain is paid)

---

## Tech Stack

| Layer | Technology | Hosting |
|---|---|---|
| Website Frontend | React.js (Vite) | Vercel (free) |
| Admin Panel | React.js (Vite) | Vercel (free) |
| Telegram Bot | Python | Railway (free) |
| Database + Tokens | Firebase Firestore | Firebase (free tier) |
| File Storage | Telegram Servers | Free (unlimited*) |
| Ads | Google AdSense | — |
| Domain | Namecheap / Freenom | ~₹500/yr or free |

---

## Project Structure

```
ccat-portal/
│
├── 📁 website/                          # Frontend (React.js)
│   ├── 📁 public/
│   │   ├── favicon.ico
│   │   └── index.html
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── AdBanner.jsx             # Google AdSense wrapper
│   │   │   ├── PDFCard.jsx              # Single PDF item card
│   │   │   ├── SectionCard.jsx          # Section A/B/C cards
│   │   │   └── DownloadModal.jsx        # Ad timer + redirect to bot
│   │   ├── 📁 pages/
│   │   │   ├── Home.jsx                 # Landing page
│   │   │   ├── SectionPage.jsx          # e.g. Section A
│   │   │   ├── SubjectPage.jsx          # e.g. Section A > English
│   │   │   └── NotFound.jsx
│   │   ├── 📁 services/
│   │   │   ├── firebase.js              # Firebase config
│   │   │   ├── tokenService.js          # Generate/verify tokens
│   │   │   └── pdfService.js            # Fetch PDFs from Firestore
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env                             # VITE_FIREBASE_API_KEY etc.
│   ├── package.json
│   └── vite.config.js
│
├── 📁 bot/                              # Telegram Bot (Python)
│   ├── 📁 handlers/
│   │   ├── start.py                     # /start command
│   │   ├── download.py                  # Handle token, send file
│   │   └── admin.py                     # Admin commands (upload, delete)
│   ├── 📁 services/
│   │   ├── firebase_service.py          # Read/write tokens & PDF data
│   │   ├── token_service.py             # Validate & expire tokens
│   │   └── file_service.py              # Manage files on Telegram
│   ├── 📁 utils/
│   │   ├── logger.py
│   │   └── helpers.py
│   ├── main.py                          # Bot entry point
│   ├── config.py                        # BOT_TOKEN, ADMIN_ID etc.
│   ├── requirements.txt
│   └── Procfile                         # For Railway deployment
│
├── 📁 admin-panel/                      # Admin UI (React.js)
│   ├── 📁 src/
│   │   ├── 📁 pages/
│   │   │   ├── Login.jsx                # Admin login
│   │   │   ├── Dashboard.jsx            # Stats overview
│   │   │   ├── UploadPDF.jsx            # Upload PDF via bot
│   │   │   ├── ManagePDFs.jsx           # Edit/delete PDFs
│   │   │   └── ManageSections.jsx       # Add/edit sections
│   │   ├── 📁 components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatsCard.jsx            # Downloads, visits etc.
│   │   │   └── PDFTable.jsx
│   │   ├── 📁 services/
│   │   │   └── firebase.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── 📁 firebase/                         # Firebase config & rules
│   ├── firestore.rules
│   ├── firestore.indexes.json
│   └── firebase.json
│
├── 📁 scripts/                          # One-time utility scripts
│   ├── upload_pdfs_to_bot.py            # Bulk upload PDFs to Telegram
│   ├── seed_firestore.py                # Populate DB from your txt file
│   └── download_pdfs.py                 # Existing download script
│
├── 📁 docs/                             # Documentation
│   ├── setup.md                         # How to run locally
│   ├── deployment.md                    # How to deploy
│   └── architecture.md                  # System design diagram
│
├── .gitignore
└── README.md
```

---

## Firebase Database Structure

```
Firestore/
│
├── 📁 sections/
│   ├── section-a/
│   │   ├── name: "Section A"
│   │   ├── description: "English, Quant, Reasoning..."
│   │   └── 📁 subjects/
│   │       ├── english/
│   │       │   ├── name: "English"
│   │       │   └── 📁 pdfs/
│   │       │       ├── {pdf-id}/
│   │       │       │   ├── name: "Synonyms Notes"
│   │       │       │   ├── telegram_file_id: "BQACAgI..."
│   │       │       │   ├── downloads: 142
│   │       │       │   └── uploaded_at: timestamp
│   │       │       └── ...
│   │       └── ...
│   └── ...
│
└── 📁 tokens/
    ├── {token}/
    │   ├── pdf_id: "abc123"
    │   ├── telegram_file_id: "BQACAgI..."
    │   ├── created_at: timestamp
    │   ├── expires_at: timestamp        # created_at + 10 mins
    │   └── used: false
    └── ...
```

---

## How Everything Connects

```
                    ┌─────────────┐
                    │   Firestore  │
                    │ (DB + Tokens)│
                    └──────┬──────┘
                           │
          ┌────────────────┼─────────────────┐
          │                │                 │
   ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
   │   Website   │  │ Admin Panel  │  │Telegram Bot  │
   │  (Vercel)   │  │  (Vercel)    │  │  (Railway)   │
   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
          │                │                 │
     User clicks      Admin uploads     Bot sends PDF
     download →       PDF → stored      to user after
     token created    as file_id         token check
```

---

## User Download Flow

```
User visits website
        ↓
Browses Section A / B / C
        ↓
Clicks "Download" on a PDF
        ↓
DownloadModal opens → Ad shown (5 sec countdown)
        ↓
Backend generates a one-time token (10 min expiry)
        ↓
User is redirected to Telegram Bot with token
        ↓
Bot checks token in Firestore → valid? → sends PDF
        ↓
Token marked as used (cannot be reused)
        ↓
Download count incremented in Firestore
```

---

## Ad Placement Strategy

| Position | Type | Notes |
|---|---|---|
| Top of every page | Banner (728x90) | Always visible |
| Sidebar on subject page | Rectangle (300x250) | Desktop only |
| Inside DownloadModal | Banner | Shown during 5s countdown |
| Between every 5 PDFs | In-feed ad | Blends with content |

---

## Development Roadmap

### Week 1 — Foundation
- [ ] Create Firebase project, configure Firestore rules
- [ ] Create Telegram Bot via BotFather
- [ ] Write `upload_pdfs_to_bot.py` — bulk upload all PDFs to Telegram, store `file_id` in Firestore
- [ ] Write `seed_firestore.py` — parse `pdf_links_CCAT_syllabus_order.txt`, populate sections/subjects/pdfs in Firestore
- [ ] Build basic bot handlers: `/start`, token validation, file sending

### Week 2 — Website
- [ ] Scaffold React app with Vite
- [ ] Build Home page with Section A/B/C cards
- [ ] Build SectionPage and SubjectPage pulling data from Firestore
- [ ] Build DownloadModal with 5-second ad countdown and token generation
- [ ] Integrate Google AdSense
- [ ] Deploy to Vercel

### Week 3 — Admin Panel + Polish
- [ ] Build Admin login with Firebase Auth
- [ ] Build Dashboard with download stats and visit counts
- [ ] Build UploadPDF page (sends file to bot, stores file_id automatically)
- [ ] Build ManagePDFs page (rename, delete, move between sections)
- [ ] Deploy admin panel to Vercel (separate subdomain e.g. admin.yoursite.com)
- [ ] Final testing and bug fixes

---

## Deployment Checklist

### Telegram Bot (Railway)
- [ ] Push `bot/` folder to GitHub
- [ ] Connect repo to Railway
- [ ] Set environment variables: `BOT_TOKEN`, `FIREBASE_CREDENTIALS`, `ADMIN_CHAT_ID`
- [ ] Deploy and verify bot is running

### Website (Vercel)
- [ ] Push `website/` folder to GitHub
- [ ] Connect repo to Vercel
- [ ] Set environment variables: `VITE_FIREBASE_API_KEY`, etc.
- [ ] Add custom domain (optional)

### Admin Panel (Vercel)
- [ ] Push `admin-panel/` folder to GitHub
- [ ] Connect repo to Vercel as separate project
- [ ] Set environment variables
- [ ] Restrict access via Firebase Auth (only your email)

---

## Monetization Options

| Method | Effort | Revenue Potential |
|---|---|---|
| Google AdSense | Low | ₹500–₹5000/month at scale |
| Premium membership (no ads, instant download) | Medium | ₹99–₹199/month per user |
| Sell mock tests / study guides | Medium | ₹199–₹499 per item |
| Razorpay donations | Low | Variable |
| Affiliate links (books, courses) | Low | ₹50–₹200 per sale |

---

## Environment Variables Reference

### Website `.env`
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Bot `config.py`
```
BOT_TOKEN=
ADMIN_CHAT_ID=
FIREBASE_CREDENTIALS=path/to/serviceAccountKey.json
TOKEN_EXPIRY_MINUTES=10
```

---

## Future Features (Phase 2)

- Search bar across all PDFs
- User accounts with bookmarks and download history
- Progress tracker (mark topics as done)
- Dark mode
- Mobile app via React Native
- Notifications for new uploads via Telegram channel
- Discussion forum or comment section per subject

---

*Generated for CCAT Study Portal Project*
