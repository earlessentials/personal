# Feedback results

Private report UI at `/eventfeedback/results/`. Build with `npm install && npm run build` from this directory. Static assets are emitted to `public/eventfeedback/results/` and served by the existing GitHub Pages workflow. Build the feedback form first if rebuilding both projects.

The public bundle contains no password or response data. The Sites backend verifies a generated high-entropy password against `REPORT_PASSWORD_HASH`, rate-limits login attempts in D1, and issues an eight-hour HMAC token using `REPORT_SESSION_SECRET`. Both values are runtime secrets, not GitHub files. Rotate both secrets and redeploy the backend to change the password and invalidate existing sessions.

Responses and tokens are held only in browser memory. Export includes current filters, quotes CSV fields, and escapes spreadsheet formulas. The explicitly labelled deployment test is excluded by its ID by default. Date filters and CSV timestamps are UTC; response timestamps display WIB. Reloading the page requires login again.
