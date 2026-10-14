# FERAL & FALLOW event feedback

Public page: https://pearlinglim.com/eventfeedback/

The standalone form preserves the English/Bahasa Indonesia experience without changing any other website routes or global styles. Source lives here; built files live in `public/eventfeedback/` and are copied by the existing GitHub Pages workflow.

## Rebuild

Run `npm install` then `npm run build` in this directory. Commit both the source and generated `public/eventfeedback/` files.

## Submission storage

The form sends JSON to the existing feedback API at `https://feral-fallow-reflections.pearling852489.chatgpt.site/api/feedback`. It saves responses in the existing private D1 database and exposes no response-reading endpoint. CORS permits `https://pearlinglim.com` and `https://www.pearlinglim.com`; no cookies or ChatGPT login are needed. The browser remains on pearlinglim.com during submission. The bonus screen is shown only after a successful save.

Names, emails, and answers are never stored in this repository or browser storage. Fixed-choice answers use stable English values, alongside the chosen language; written responses remain as entered.

The seven-day bonus message reflects the host's offer; code expiry is managed separately by Private Matter.
