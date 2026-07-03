# 🪶 Scribe

> *Where raw thought becomes literature.*

Scribe is a quiet place to write. It brings the tactile calm of paper into the browser, paired with a literary companion that speaks only when invited. No feeds, no metrics, no noise — just your words, framed by margin and light.

Built for novelists, essayists, copywriters, and anyone who writes to think, Scribe is an argument for restraint: that a writing tool's job is to disappear.

---

## The Scribe Philosophy

Modern software is loud by default — busy sidebars, flashing badges, engagement loops. Scribe is built against that grain.

- **Writing needs quiet.** No clutter, no notifications competing for attention. Generous margins. Soft, warm tones that don't strain the eye at 2am or noon.
- **AI should listen, not lead.** The companion built into Scribe never interrupts. It waits to be called, mirrors what's already on the page, and steps back. The voice on the page stays yours.
- **Your drafts stay yours.** Documents, history, and settings are stored locally, in your browser. Nothing is uploaded to our servers, tracked, or sold. (See *Where Your Words Go* below for the one honest exception.)

---

## Features

### 🎧 Scribe Gramophone
A small, working record player lives in the sidebar — spinning platter, dropping tonearm, the whole ritual.
- Drag in your own `.mp3`, `.wav`, or `.flac` library.
- Play, pause, skip, or nudge forward/back 10 seconds.
- Keeps spinning even when you collapse the sidebar to write.

It's not a gimmick — it's a threshold. Starting the record is a small, physical cue that you're stepping out of the feed and into the work.

### 🪄 Literary Sounding Board
Two commands, invoked only when you type them.
- **`@idea`** — reads the paragraph before it and offers a few ways forward, matching your tone and direction. A nudge, not a rewrite.
- **`@fix`** — tightens grammar and phrasing without flattening your voice into something generic.

Nothing else in the editor talks to you. If you never type `@`, the companion never speaks.

### 🛡️ Local-First by Design
- Documents, drafts, and version history live in your browser's local storage — never on a Scribe server.
- Trash is recoverable and non-destructive; your session history is a plain, readable log, not a black box.
- You bring your own Google Gemini API key, stored locally, used only to power `@idea` and `@fix`.

### 🖥️ Desktop, on Purpose
Scribe is built for one dedicated space, not a stolen five minutes on a phone. The typography, spacing, and density are tuned for a desktop screen and don't survive a smaller one gracefully — so for now, Scribe stays there. Mobile isn't an oversight; it's a boundary that protects what makes the desktop version work.

---

## Quick Start

### 1. Prerequisites
Node.js (v18+) and npm.

### 2. Installation
```bash
git clone https://github.com/joalx/scribe.git
cd scribe
npm install
```

### 3. Run it
```bash
npm run dev
```
Open `http://localhost:3000`.

---

## Where Your Words Go

Scribe stores everything locally — with one necessary exception: when you use `@idea` or `@fix`, the surrounding text is sent directly from your browser to Google's Gemini API to generate a response. That request never touches a Scribe server, but it does leave your machine, because that's how the feature works.

Google's enterprise developer API terms state that prompts sent through their developer endpoints aren't used to train public models. We think that's worth knowing plainly, not glossing over — a sanctuary should be honest about its one open window, not just its locked doors.

If you never invoke `@idea` or `@fix`, no text ever leaves your browser.

### Getting a Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google Account.
3. Click **Get API key**, and create or select a project.
4. Copy the key, open Scribe's **Sanctuary Settings** in the sidebar, and paste it in.

---

## Visual Identity

- **Interface type:** Inter
- **Display type:** Playfair Display / Space Grotesk
- **Palette:** warm linen (`#EEEDE9`, `#FAF9F6`), charcoal (`#141413`), rust accent (`#D97757`)

---

## Credits

**João Leite** — [@joalx](https://linkedin.com/in/joalx)

Built with the conviction that software for thinking should get out of the way of thinking.

---
*May your sanctuary bring you peace, focus, and magical creation.*s