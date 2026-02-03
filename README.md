# Hanna Birthday Site

Private, playful birthday website for Hanna, built with React + Vite and hosted
on GitHub Pages.

## Setup

```bash
npm install
npm run dev
```

## Verification assets

Place these files before running the verification flow:

- Face-api.js model files in `public/models/`
- Reference photo at `public/reference/hanna.jpg`
- Optional photos and music in `public/assets/`

### Model source

The face-api.js weights were downloaded from Hugging Face:
`https://huggingface.co/Taha32/FaceApi`

## GitHub Pages

1. Update the `base` value in `vite.config.ts` to match your repo name if it is
   not `/Anniv-Page/`.
2. Deploy:

```bash
npm run deploy
```

GitHub Pages must be served over HTTPS for camera access.
