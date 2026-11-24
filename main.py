from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from pathlib import Path

from .agent import AgentService, BrowserSessions

BASE = Path(__file__).resolve().parent.parent
browsers = BrowserSessions()
agent: AgentService | None = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global agent
    await browsers.start()
    agent = AgentService(browsers)
    yield
    await browsers.close()

app = FastAPI(title="AI Life Assistant", version="1.0.0", description="A general-purpose web research and workflow agent.", lifespan=lifespan)
app.mount("/static", StaticFiles(directory=BASE / "static"), name="static")

class ChatRequest(BaseModel):
    session_id: str = Field(min_length=1, max_length=100)
    message: str = Field(min_length=1, max_length=8000)

class ApprovalRequest(BaseModel):
    approval_id: str = Field(min_length=1, max_length=100)

@app.get("/")
async def home():
    return FileResponse(BASE / "static" / "index.html")

@app.get("/api/health")
async def health():
    return {"status": "ok", "ai_configured": bool(__import__('os').getenv('OPENAI_API_KEY'))}

@app.post("/api/chat")
async def chat(payload: ChatRequest):
    if agent is None:
        raise HTTPException(503, "Agent is starting. Try again shortly.")
    return await agent.chat(payload.session_id, payload.message)

@app.post("/api/approve")
async def approve(payload: ApprovalRequest):
    if agent is None:
        raise HTTPException(503, "Agent is starting.")
    result = await agent.approve(payload.approval_id)
    if not result.get("ok"):
        raise HTTPException(400, result.get("error", "Action failed"))
    return result
