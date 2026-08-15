# Portfolio — Structural Flowchart

Shows the project's file/folder structure and how each component relates to the others.

```mermaid
flowchart TD
    Root["📁 Project Root (New folder)"]

    Root --> Public["📁 public/"]
    Root --> Data["📁 data/"]
    Root --> Php["📁 php/"]
    Root --> Resume["📁 resume-source/"]
    Root --> Misc["server.js · package.json · README.md · FLOWCHART.md"]

    %% ---- public ----
    Public --> Index["index.html\n(front-end shell: sections, nav, modal)"]
    Public --> Css["css/style.css\n(theme tokens, layout, animations)"]
    Public --> Js["js/main.js\n(render, theme, typing, modal, form)"]
    Public --> Router["router.php\n(PHP front-controller)"]

    Index -. links .-> Css
    Index -. loads .-> Js

    %% ---- data ----
    Data --> Profile["profile.json\n(single source of truth: resume)"]
    Data --> Messages["messages.json\n(contact submissions)"]

    %% ---- php ----
    Php --> Handlers["handlers.php\n(PHP API logic: profile / contact / messages)"]

    %% ---- resume-source ----
    Resume --> Pdf["Lucky Kumar Yadav (1).pdf\n(original resume + extract scripts)"]

    %% ---- relationships ----
    Js -->|"fetch GET /api/profile"| Profile
    Js -->|"POST /api/contact"| Messages
    Router --> Handlers
    Handlers --> Profile
    Handlers --> Messages

    Server["server.js\n(Node: static + API)"] --> Public
    Server --> Profile
    Server --> Messages
```

## Component responsibilities

| Component | Role |
| --- | --- |
| `public/index.html` | Page skeleton: hero, about, skills, experience, projects, education, contact, modal |
| `public/css/style.css` | All styling: dark/light themes, responsive layout, animations |
| `public/js/main.js` | Renders data, theme toggle, typing effect, scroll reveal, project modal, contact form + validation |
| `public/router.php` | PHP built-in-server front controller (serves static + routes API) |
| `php/handlers.php` | PHP API logic shared by the router |
| `server.js` | Zero-dependency Node server (static + identical API) |
| `data/profile.json` | Resume content — edit here to update the whole site |
| `data/messages.json` | Stores contact-form submissions |
| `resume-source/` | Original PDF resume + extraction scripts (reference only) |
