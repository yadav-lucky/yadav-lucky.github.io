# Portfolio — Project Flowchart

```mermaid
flowchart TD
    %% ---------- Client ----------
    Browser["🌐 Browser (Client)"]
    Browser -->|"GET /  (index.html, css, js)"| Static["Static Assets\npublic/index.html, css/style.css, js/main.js"]
    Browser -->|"fetch GET /api/profile"| API
    Browser -->|"POST /api/contact\n(contact form)"| API
    Browser -->|"GET /resume-source/*.pdf"| Static

    %% ---------- API layer ----------
    API{"API Router"}
    API -->|"/api/profile"| Profile["Read data/profile.json"]
    API -->|"/api/contact"| Validate{"Validate\nname/email/message"}
    API -->|"/api/messages"| ReadMsg["Read data/messages.json"]
    Validate -->|"invalid"| Reject["400 Error"]
    Validate -->|"valid"| Store["Append to data/messages.json"]
    Store -->|"200 OK"| Browser
    Profile -->|"200 JSON"| Browser
    ReadMsg -->|"200 JSON"| Browser

    %% ---------- Backend implementations ----------
    API -. implemented by .-> Node
    API -. implemented by .-> PHP

    subgraph Node["⚙️ Node.js Backend (server.js) — zero deps"]
        N1["http.createServer"]
        N1 --> N2["serveStatic()"]
        N1 --> N3["handleContact()"]
        N1 --> N4["/api/profile handler"]
    end

    subgraph PHP["🐘 PHP Backend (public/router.php)"]
        P1["router.php (front controller)"]
        P1 --> P2["php/handlers.php"]
        P2 --> P3["profile_get()"]
        P2 --> P4["contact_handle()"]
        P2 --> P5["messages_*()"]
    end

    %% ---------- Data store ----------
    Profile --> Data[("data/profile.json\n(single source of truth)")]
    Store --> MsgDB[("data/messages.json")]
    ReadMsg --> MsgDB
```

## How the pieces connect

1. **Client** loads the single-page front-end and `main.js` renders every section
   from `data/profile.json` via `GET /api/profile` (falls back to embedded data
   if the API is unreachable, so the page still works opened directly).
2. The **contact form** POSTs to `/api/contact`; the client also retries
   `/api/contact.php`, so it works on either backend.
3. The **same API contract** is implemented twice:
   - `server.js` — Node built-in `http` (port 3000)
   - `public/router.php` + `php/handlers.php` — PHP built-in server (port 8000)
4. All content lives in **`data/profile.json`** — edit it once and both
   back-ends reflect the change with no rebuild.
