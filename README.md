# Lucky Kumar Yadav — Portfolio

A complete, interview-ready portfolio website built with **HTML, CSS, JavaScript, Node.js and PHP**.

The front-end is a single, responsive page that pulls all content from a JSON-backed API. The
same API is served by **two interchangeable back-ends** so you can demo it either way:

| Backend | Command | URL |
| ------- | ------- | --- |
| Node.js (zero dependencies) | `node server.js` | http://localhost:3000 |
| PHP (built-in server) | `php -S localhost:8000 public/router.php` | http://localhost:8000 |

Both expose the identical API:

- `GET /api/profile` — full resume data (single source of truth: `data/profile.json`)
- `POST /api/contact` — stores a contact message to `data/messages.json`
- `GET /api/messages` — lists stored messages (demo/admin view)

The contact form in the UI tries `/api/contact` first and automatically falls back to
`/api/contact.php`, so it works on whichever backend is running.

## Project structure

```
.
├── public/
│   ├── index.html          # Single-page front-end
│   ├── css/style.css       # Theming, layout, animations
│   ├── js/main.js          # Rendering, theme, modal, form, typing
│   └── router.php          # PHP front controller (built-in server)
├── data/
│   ├── profile.json        # ← Resume data (edit here to update the site)
│   └── messages.json       # Contact submissions
├── php/
│   └── handlers.php        # PHP API logic (shared by router)
├── server.js               # Node.js server (zero deps)
├── package.json
└── resume-source/          # Original resume PDF + extraction scripts
```

## Editing your content

All resume content lives in **`data/profile.json`** — change it there and both back-ends
pick it up automatically (no front-end rebuild needed).

## Notes

- Fully offline / local. No external CDNs are required to render the page.
- Light/Dark theme toggle is saved to `localStorage`.
- Resume download link points to `resume-source/Lucky Kumar Yadav (1).pdf`.
