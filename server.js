/**
 * Lucky Kumar Yadav — Portfolio
 * Zero-dependency Node.js server.
 *  - Serves the static front-end from /public
 *  - GET  /api/profile   -> resume data (data/profile.json)
 *  - POST /api/contact    -> store contact message (data/messages.json)
 *  - POST /api/contact.php -> same handler (so the PHP route works under Node too)
 *  - GET  /api/messages  -> list stored messages (demo/admin view)
 * Run:  node server.js
 */
const http = require("http");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

/** Minimal zero-dependency .env loader (does not override existing env vars). */
function loadEnv() {
  const file = path.join(ROOT, ".env");
  let text;
  try { text = fs.readFileSync(file, "utf8"); } catch (_) { return; }
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = val;
  }
}
loadEnv();
const PUBLIC = path.join(ROOT, "public");
const DATA = path.join(ROOT, process.env.DATA_DIR || "./data");
const PROFILE_FILE = path.join(DATA, "profile.json");
const MESSAGES_FILE = path.join(DATA, "messages.json");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2"
};

function corsHeaders() {
  const origins = String(process.env.ALLOWED_ORIGINS || "")
    .split(",").map(s => s.trim()).filter(Boolean);
  if (!origins.length) return {};
  return {
    "Access-Control-Allow-Origin": origins.join(","),
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Cache-Control": "no-store", ...corsHeaders(), ...headers });
  res.end(body);
}
function sendJSON(res, status, obj) {
  send(res, status, JSON.stringify(obj), { "Content-Type": "application/json; charset=utf-8" });
}
function readBody(req, limit = 1e6) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => { data += c; if (data.length > limit) reject(new Error("Payload too large")); });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function safeJoin(base, target) {
  const p = path.normalize(path.join(base, target));
  if (!p.startsWith(base)) return null;
  return p;
}

async function serveStatic(req, res, urlPath) {
  let rel = decodeURIComponent(urlPath.split("?")[0]);
  if (rel === "/" || rel === "") rel = "/index.html";
  // allow serving resume pdf from resume-source
  let base = PUBLIC;
  if (rel.startsWith("/resume-source/")) base = ROOT;
  const filePath = safeJoin(base, rel);
  if (!filePath) return send(res, 403, "Forbidden");
  try {
    const stat = await fsp.stat(filePath);
    if (stat.isDirectory()) return send(res, 403, "Forbidden");
    const ext = path.extname(filePath).toLowerCase();
    const data = await fsp.readFile(filePath);
    send(res, 200, data, { "Content-Type": MIME[ext] || "application/octet-stream" });
  } catch (_) {
    // SPA-ish fallback to index.html for unknown non-file routes
    if (!path.extname(rel)) {
      try {
        const html = await fsp.readFile(path.join(PUBLIC, "index.html"));
        return send(res, 200, html, { "Content-Type": MIME[".html"] });
      } catch (_) {}
    }
    send(res, 404, "Not found");
  }
}

async function handleContact(req, res) {
  let raw;
  try { raw = await readBody(req); } catch (e) { return sendJSON(res, 413, { error: e.message }); }
  let payload;
  try { payload = JSON.parse(raw || "{}"); } catch (_) { return sendJSON(res, 400, { error: "Invalid JSON" }); }

  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim();
  const message = String(payload.message || "").trim();

  if (name.length < 2) return sendJSON(res, 400, { error: "Name is too short." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return sendJSON(res, 400, { error: "Invalid email." });
  if (message.length < 10) return sendJSON(res, 400, { error: "Message is too short." });

  const record = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: escapeHtml(name),
    email: escapeHtml(email),
    message: escapeHtml(message),
    receivedAt: new Date().toISOString(),
    source: "node"
  };

  let list = [];
  try { list = JSON.parse(await fsp.readFile(MESSAGES_FILE, "utf8")); } catch (_) { list = []; }
  list.push(record);
  await fsp.writeFile(MESSAGES_FILE, JSON.stringify(list, null, 2));

  return sendJSON(res, 200, { ok: true, message: `Thanks ${record.name}! Your message has been received.`, id: record.id });
}

const server = http.createServer(async (req, res) => {
  const { method } = req;
  const urlPath = req.url || "/";

  if (method === "OPTIONS") {
    res.writeHead(204, corsHeaders());
    return res.end();
  }

  try {
    if (method === "GET" && urlPath.startsWith("/api/profile")) {
      try {
        const data = await fsp.readFile(PROFILE_FILE, "utf8");
        return send(res, 200, data, { "Content-Type": "application/json; charset=utf-8" });
      } catch (_) { return sendJSON(res, 500, { error: "Profile data unavailable" }); }
    }

    if (method === "GET" && urlPath.startsWith("/api/messages")) {
      let list = [];
      try { list = JSON.parse(await fsp.readFile(MESSAGES_FILE, "utf8")); } catch (_) { list = []; }
      return sendJSON(res, 200, { count: list.length, messages: list });
    }

    if (method === "POST" && (urlPath.startsWith("/api/contact") || urlPath.startsWith("/api/contact.php"))) {
      return await handleContact(req, res);
    }

    if (method === "GET" && urlPath.startsWith("/api/")) {
      return sendJSON(res, 404, { error: "Unknown endpoint" });
    }

    if (method === "GET" || method === "HEAD") {
      return await serveStatic(req, res, urlPath);
    }

    return send(res, 405, "Method not allowed");
  } catch (err) {
    return sendJSON(res, 500, { error: "Internal server error" });
  }
});

server.listen(PORT, process.env.HOST || "0.0.0.0", () => {
  console.log(`\n  🚀 Portfolio running`);
  console.log(`     → http://localhost:${PORT}  (env: ${process.env.APP_ENV || "development"})\n`);
});
