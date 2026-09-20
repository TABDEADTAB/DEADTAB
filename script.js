const pages = [...document.querySelectorAll('.page')];
const tabs = [...document.querySelectorAll('.tab')];
const index = document.querySelector('#pageIndex');
const address = document.querySelector('#address');
const toast = document.querySelector('#toast');
let active = 0, wheelLock = false;

const archive = [
  ['001','crypto','the one where you checked the chart. once.'],['002','research','sources pending since 2022'],['003','memecoins','due diligence: emotionally compromised'],['004','important???','it probably was. maybe.'],
  ['005','maybe later','later is not a real time'],['006','unfinished','leave it open. it builds character.'],['007','ideas','mostly screenshots of other ideas'],['008','life','new tab, same problem']
];
document.querySelector('#archiveGrid').innerHTML = archive.map(([n,title,copy]) => `<button class="archive-card"><span class="card-number">TAB #${n}</span><h3>${title}</h3><p>${copy}</p></button>`).join('');

function openPage(target) {
  const next = pages.findIndex(page => page.id === target);
  if (next < 0 || next === active) return;
  pages[active].classList.remove('is-active');
  tabs[active]?.classList.remove('is-active');
  active = next;
  pages[active].classList.add('is-active');
  tabs[active]?.classList.add('is-active');
  pages[active].scrollTop = 0;
  address.textContent = pages[active].dataset.path;
  index.textContent = `${String(active + 1).padStart(2,'0')} / 05`;
}
document.querySelectorAll('[data-page]').forEach(el => el.addEventListener('click', () => openPage(el.dataset.page)));
window.addEventListener('wheel', event => {
  if (wheelLock || Math.abs(event.deltaY) < 20) return;
  const page = pages[active];
  const atTop = page.scrollTop < 3;
  const atBottom = page.scrollTop + page.clientHeight >= page.scrollHeight - 3;
  const direction = event.deltaY > 0 ? 1 : -1;
  if ((direction > 0 && atBottom) || (direction < 0 && atTop)) {
    event.preventDefault(); wheelLock = true;
    openPage(pages[(active + direction + pages.length) % pages.length].id);
    setTimeout(() => wheelLock = false, 620);
  }
}, {passive:false});
let touchStart = 0;
window.addEventListener('touchstart', e => touchStart = e.changedTouches[0].screenY, {passive:true});
window.addEventListener('touchend', e => { const move = e.changedTouches[0].screenY - touchStart; if (Math.abs(move) > 70) openPage(pages[(active + (move < 0 ? 1 : -1) + pages.length) % pages.length].id); }, {passive:true});
document.querySelector('#newTab').addEventListener('click', () => { toast.textContent = '847 tabs open. this feels irresponsible.'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2500); });
document.querySelector('.close-attempt').addEventListener('click', () => { toast.textContent = "you can't close me"; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2400); });
fetch('data/config.json').then(r => r.json()).then(config => {
  document.querySelectorAll('[data-config]').forEach(el => { const value = config[el.dataset.config]; if (value) el.textContent = value; });
  document.querySelectorAll('[data-config-link]').forEach(el => { const value = config[el.dataset.configLink]; if (value) { el.href = value; el.target = '_blank'; el.rel = 'noopener noreferrer'; el.classList.remove('disabled-link'); el.textContent = `${el.dataset.configLink.toUpperCase()} ↗`; } });
}).catch(() => {});
const gate = document.querySelector('#launchGate');
const countdownFields = ['days','hours','minutes','seconds'].map(id => document.querySelector(`#${id}`));
const countdownNote = document.querySelector('#countdownNote');
const countdownNotes = ['ESTIMATED. PROBABLY WRONG.','SYNC LOST. TRYING AGAIN.','TIME IS A SUGGESTION.','LAUNCH DATE: MAYBE LATER.','DO NOT TRUST THE NUMBERS.'];
let fakeSeconds = 236029;
function renderCountdown() { fakeSeconds = Math.max(0, fakeSeconds - 1); const value = [Math.floor(fakeSeconds / 86400), Math.floor(fakeSeconds / 3600) % 24, Math.floor(fakeSeconds / 60) % 60, fakeSeconds % 60]; countdownFields.forEach((field, i) => field.textContent = String(value[i]).padStart(2, '0')); }
renderCountdown();
setInterval(() => { renderCountdown(); if (Math.random() < .16) { const target = countdownFields[Math.floor(Math.random() * countdownFields.length)]; target.classList.add('glitch'); target.textContent = String(Math.floor(Math.random() * 98)).padStart(2, '0'); countdownNote.textContent = countdownNotes[Math.floor(Math.random() * countdownNotes.length)]; setTimeout(() => { target.classList.remove('glitch'); renderCountdown(); }, 220); } }, 1000);
function unlock() { gate.classList.add('is-closing'); document.querySelector('#browser').classList.add('is-ready'); setTimeout(() => gate.remove(), 600); }
document.querySelector('#unlockForm').addEventListener('submit', event => { event.preventDefault(); const input = document.querySelector('#accessKey'); const message = document.querySelector('#unlockMessage'); if (input.value === '1177711') { message.textContent = 'access granted.'; setTimeout(unlock, 350); } else { message.textContent = 'wrong tab.'; input.select(); } });
window.addEventListener('load', () => { setTimeout(() => { document.querySelector('#boot').style.display = 'none'; gate.classList.add('is-visible'); }, 1700); });
