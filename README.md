# AI Life Assistant — Your Personal Digital Agent

A full-stack starter for a general-purpose AI web agent. It combines an LLM tool-calling loop, public-web search, a Playwright browser, and a human-approval gate for potentially consequential clicks.

## What it can do

- Search public web pages and return source URLs/snippets.
- Open webpages and inspect visible page text and links.
- Fill common web form fields without submitting them.
- Click ordinary navigation links/buttons.
- Pause and ask for explicit approval before clicks whose labels suggest sending, buying, booking, paying, submitting, deleting, cancelling, or applying.
- Maintain a separate browser context and conversation history per session.

This is an extensible foundation, not a guarantee that every website or task works. Sites may require login, CAPTCHA, MFA, custom controls, or block automation. The agent must not bypass those controls. It does not currently send email, make payments, book travel, or execute arbitrary local-computer actions. Add purpose-built integrations for those workflows and retain approval gates.

## Requirements

- Python 3.10+
- An OpenAI API key
- Chromium browser installed through Playwright

## Run locally (macOS / Windows / Linux)

```bash
python -m venv .venv
# macOS/Linux
source .venv/bin/activate
# Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env
# Edit .env and set OPENAI_API_KEY=your_key
playwright install chromium
uvicorn app.main:app --reload
```

Open http://127.0.0.1:8000.

On macOS, if the `playwright` command is not found, run:

```bash
python -m playwright install chromium
```

## Configuration

| Variable | Purpose | Default |
|---|---|---|
| `OPENAI_API_KEY` | Enables LLM reasoning and tool selection | unset |
| `OPENAI_MODEL` | Chat Completions model name | `gpt-4.1-mini` |
| `APP_HOST` / `APP_PORT` | Reserved for deployment configuration | `127.0.0.1` / `8000` |
| `MAX_TOOL_ROUNDS` | Maximum tool-calling rounds per request | `8` |

The OpenAI API is billed separately from ChatGPT subscriptions. Never commit `.env` or expose your API key in frontend code.

## API

- `GET /api/health` — health and AI-key configuration status.
- `POST /api/chat` — body: `{"session_id":"browser-session-1","message":"Research..."}`.
- `POST /api/approve` — body: `{"approval_id":"..."}`.

## Run tests

```bash
pytest -q
```

## Project layout

```text
app/
  agent.py       # LLM loop, browser tools, approval gate, session management
  main.py        # FastAPI application and HTTP endpoints
static/
  index.html     # Chat interface
  style.css      # UI styling
  app.js         # Browser-side chat and approval handling
tests/
  test_agent.py  # Safety-classification tests
```

## Important security work before public deployment

This starter is intended for local development/demo use. Before exposing it to the internet, add authentication, per-user session isolation, rate limiting, CSRF protection, encrypted secret storage, audit logs, strict outbound-network/SSRF protections, browser sandboxing, approval binding to exact action details, persistent job state, and a robust policy engine. Do not deploy the in-memory approval/session store as a multi-user production system.

## Suggested next modules

1. Document ingestion and analysis (PDF, DOCX, spreadsheets).
2. Structured extraction and comparison tables.
3. Calendar/email integrations using official OAuth APIs.
4. Site-specific adapters for travel, shopping, and productivity platforms.
5. Long-running jobs, progress updates, retries, and resumable workflows.

## Repository URL

After extracting this folder, create a new GitHub repository and push it:

```bash
git init
git add .
git commit -m "Initial AI Life Assistant agent"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ai-life-assistant.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. The repository URL becomes `https://github.com/YOUR-USERNAME/ai-life-assistant`.
