const sessionId = localStorage.getItem('aila-session') || crypto.randomUUID();
localStorage.setItem('aila-session', sessionId);
const messages = document.getElementById('messages');
const form = document.getElementById('chatForm');
const promptBox = document.getElementById('prompt');
const sendBtn = document.getElementById('sendBtn');
const approvalBox = document.getElementById('approval');
let activeApproval = null;
function addMessage(role, text) {
  const row = document.createElement('div'); row.className = `message ${role}`;
  const avatar = document.createElement('span'); avatar.className = 'avatar'; avatar.textContent = role === 'user' ? 'YOU' : '✳';
  const content = document.createElement('div'); content.className = 'content';
  const name = document.createElement('b'); name.textContent = role === 'user' ? 'YOU' : 'AI LIFE ASSISTANT';
  const p = document.createElement('p'); p.textContent = text;
  content.append(name,p); row.append(avatar,content); messages.append(row); messages.scrollTop = messages.scrollHeight;
}
form.addEventListener('submit', async e => {
  e.preventDefault(); const message = promptBox.value.trim(); if (!message) return;
  addMessage('user', message); promptBox.value = ''; sendBtn.disabled = true; sendBtn.textContent = 'WORKING…'; approvalBox.classList.add('hidden');
  try {
    const response = await fetch('/api/chat', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({session_id:sessionId,message})});
    const data = await response.json(); if (!response.ok) throw new Error(data.detail || 'Request failed');
    addMessage('assistant', data.reply || 'Task finished.');
    if (data.approval_required) { activeApproval = data.approval_id; document.getElementById('approvalText').textContent = `The agent wants to click “${data.action.name}”. This may submit information or change something on the website.`; approvalBox.classList.remove('hidden'); }
  } catch(err) { addMessage('assistant', `I hit an error: ${err.message}`); }
  finally { sendBtn.disabled = false; sendBtn.textContent = 'RUN TASK ↗'; promptBox.focus(); }
});
document.getElementById('approveBtn').addEventListener('click', async () => {
  if (!activeApproval) return; const id = activeApproval; activeApproval = null;
  try { const r = await fetch('/api/approve',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({approval_id:id})}); const d = await r.json(); if(!r.ok) throw new Error(d.detail || 'Action failed'); addMessage('assistant', 'Approved action result: ' + JSON.stringify(d.result)); }
  catch(e){addMessage('assistant','Approval failed: '+e.message)} finally {approvalBox.classList.add('hidden')}
});
document.getElementById('denyBtn').addEventListener('click',()=>{activeApproval=null;approvalBox.classList.add('hidden');addMessage('assistant','Action cancelled. I have not clicked the button.')});
