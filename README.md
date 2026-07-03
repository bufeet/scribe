# 🪶 Scribe — The Creative Sanctuary

> *Where raw thought becomes literature.*

Scribe is a highly polished, distraction-free digital writing retreat designed to restore tranquility to modern composition. Merging the offline, tactile magic of physical stationery with an intelligent, literary sounding board, Scribe provides an eye-safe aesthetic canvas where your ideas can unfurl naturally, supported by a gentle, localized AI companion.

Built for novelists, essayists, copywriters, and creative dreamers, Scribe is a monument to absolute user sovereignty, elegant typography, and peaceful workflow design.

---

## 🌸 The Scribe Philosophy

In an era dominated by chaotic feeds, loud notifications, and aggressive analytics, Scribe stands as an oasis of quiet focus. We believe:
- **Writing requires quietude:** No busy sidebars, no flashing badges, and no clutter. Just your words, framed by generous margins and soft, warm tones.
- **AI should amplify, not substitute:** Our inline literary companion listens silently, acting as a resonant chamber to mirror, extend, and refine your voice—never to replace your unique imagination.
- **Your data is your sanctuary:** Your notes, drafts, histories, and credentials live entirely in your browser. We do not track, lease, or store a single syllable.

---

## ✨ Features

### 🎧 Scribe Gramophone (Integrated Retro Player)
Compose to the rhythm of peace. Scribe includes a fully interactive virtual record player inspired by classic mid-century gramophones.
- **Spinning Vinyl Animation:** Enjoy visual rhythm as the record platter spins and the mechanical tonearm drops when music plays.
- **Audio File & Folder Library Import:** Wirelessly drag-and-drop or select any library of `.mp3`, `.wav`, or `.flac` files directly from your computer to construct your ultimate cozy writing playlist.
- **Tactile Playback Controls:** Seamlessly pause, play, skip, adjust volume, or fast-forward/rewind 10 seconds.
- **Persistent Atmosphere:** The player continues spinning and playing beautifully even when you collapse the sidebar to focus on writing.

### 🪄 Literary Sounding Board
Our subtle, text-triggered AI companion assists your writing flow exactly when you invite it.
- **`@idea` — Horizon Expander:** Drop `@idea` anywhere in your text. Scribe reads the preceding paragraph to analyze the emotional tone, vocabulary, and plot direction, suggesting elegant completions that keep your momentum alive.
- **`@fix` — Elegant Polisher:** Append `@fix` to refine grammar, spelling, and phrasing structures without stripping away your distinct, natural voice.

### 🛡️ Absolute Sovereignty (Offline-First Sandbox)
- **Zero Server Retention:** Your documents are saved securely to your browser's local sandbox memory.
- **Key Sandbox:** Scribe connects directly with your private Google Gemini credentials. Your API keys are saved locally and never exposed to external servers.
- **Transient Trash & Chronicles:** Manage your workflow with non-destructive versioning, local trash restoration, and a clear, chronological log of your creative sessions.

### 🖥️ Desktop Only Layout
Scribe is meticulously tailored for immersive focus. To preserve its advanced typography pairings, spacing precision, and workspace density, the sanctuary is locked to desktop environments, welcoming mobile browsers with a friendly notification about future companions.

---

## 🛠️ Quick Start

Scribe runs directly in any modern desktop web browser. To launch your local instance and begin writing:

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed on your machine.

### 2. Installation
Clone the repository and install dependencies:
```bash
# Clone the repository
git clone https://github.com/joalx/scribe.git
cd scribe

# Install pristine dependencies
npm install
```

### 3. Launch Development Server
Boot up the fast Vite dev server:
```bash
npm run dev
```
Open your browser to `http://localhost:3000` to enter the workspace.

---

## 🔑 Obtaining Your Google Gemini API Key

To activate Scribe's **Literary Sounding Board** (`@idea` & `@fix`), you need a free API key from Google:

1. **Visit Google AI Studio:** Navigate to [Google AI Studio](https://aistudio.google.com/).
2. **Sign In:** Log in with your standard Google Account.
3. **Generate Key:** Click the **"Get API key"** button in the upper left panel.
4. **Create a New Key:** Choose to create a key in a new Cloud Project or select an existing one.
5. **Insert Credentials:** Copy the generated secret key, launch Scribe, open the **Sanctuary Settings** tab at the bottom of the sidebar, and paste your key into the API Key input.

*Note: Scribe operates completely client-side. Google's enterprise developer API terms ensure that prompts passed via developer API endpoints are not used to train public foundation models—safeguarding your private drafts.*

---

## 🎨 Visual Identity

Scribe uses an exquisite, high-contrast light theme built upon classic stationery aesthetics:
- **Primary Typography:** **Inter** for clean, highly readable interface controls.
- **Display Typography:** **Playfair Display / Space Grotesk** for elegant headings that match the rhythm of literature.
- **Atmosphere Colors:** Soft, warm, warm-toned linen (`#EEEDE9` and `#FAF9F6`) balanced with rich charcoal grays (`#141413`) and beautiful rust orange accents (`#D97757`).

---

## ☕ Credits & Acknowledgments

All design concepts, creative direction, and implementation credits belong to:

**João Leite** — Creative Software Crafter
- **LinkedIn:** [@joalx](https://linkedin.com/in/joalx)
- **Ethos:** Created with absolute devotion to peaceful, human-centric software.

---
*May your sanctuary bring you peace, focus, and magical creation.*
