# ReactPractice

Practicing React

This repository contains a minimal Vite + React scaffold created for experimentation.


## How to run locally

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

Open http://localhost:5173 (or the URL printed by Vite) — the Home page has a link to "Memory Game" which navigates to `/memory_game`.

## Deploying to GitHub Pages

This project is set up to automatically deploy to GitHub Pages using GitHub Actions:

- On every push to the `main` branch, the app is built and published to the `gh-pages` branch.
- The Vite config is set to the correct base path for GitHub Pages (`/ReactPractice/`).

### How to enable Pages

1. Go to your repository on GitHub.
2. Click **Settings** > **Pages** (or **Pages** in the sidebar).
3. Under **Branch**, select `gh-pages` and `/ (root)` as the folder.
4. Save. Your site will be available at:

```
https://evgenyvinnik.github.io/ReactPractice/
```

It may take a minute after the first push for the site to appear.

Where to implement the Memory Game

Implement game components inside `src/pages/memory_game` (the placeholder component is `MemoryGame.jsx`).
