window.addEventListener("load",()=>setTimeout(()=>document.getElementById("loader").classList.add("hide"),700));
document.getElementById("year").textContent=new Date().getFullYear();

const themeButton=document.getElementById("themeButton");
if(localStorage.getItem("xi-theme")==="dark"){document.body.classList.add("dark");themeButton.textContent="☾"}
themeButton.addEventListener("click",()=>{
 document.body.classList.toggle("dark");
 const dark=document.body.classList.contains("dark");
 themeButton.textContent=dark?"☾":"☀";
 localStorage.setItem("xi-theme",dark?"dark":"light");
});

const menuButton=document.getElementById("menuButton"),mobileMenu=document.getElementById("mobileMenu");
menuButton.addEventListener("click",()=>mobileMenu.classList.toggle("show"));
document.querySelectorAll(".mobile-menu a").forEach(a=>a.addEventListener("click",()=>mobileMenu.classList.remove("show")));

const navLinks=document.querySelectorAll(".nav-links a"),sections=document.querySelectorAll("section[id]");
window.addEventListener("scroll",()=>{
 let current="";
 sections.forEach(s=>{if(scrollY>=s.offsetTop-180)current=s.id});
 navLinks.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+current));
});

let counterDone=false;
function startCounter(){
 if(counterDone)return; counterDone=true;
 document.querySelectorAll("[data-count]").forEach(c=>{
  const target=Number(c.dataset.count);let n=0;
  const timer=setInterval(()=>{n++;c.textContent=n;if(n>=target)clearInterval(timer)},30);
 });
}
const counterObserver=new IntersectionObserver(e=>{if(e[0].isIntersecting)startCounter()},{threshold:.3});
counterObserver.observe(document.querySelector(".stats-grid"));

const schedules={
  senin:[
    ["07:00 - 08:00","UPC","—",""],
    ["08:00 - 09:55","B. Indonesia","IKE CINTIA DEWI, S.Pd",""],
    ["10:15 - 15:00","Teknologi Jaringan Kabel dan Nirkabel","TINO RAMBANG GUNAWAN, S.Kom",""]
  ],
  selasa:[
    ["07:00 - 09:45","Matematika","SETYOWATI, S.Pd",""],
    ["09:45 - 11:45","Pendidikan Agama","LU'LUA'TUL M., S.Ag",""],
    ["11:45 - 15:00","Mapil TKJ","SOJU PURIWANTO, S.Pd",""]
  ],
  rabu:[
    ["07:00 - 10:15","Perencanaan dan Pengalamatan Jaringan","DIANA CATUR KARTIKA SARI, S.Kom",""],
    ["10:35 - 14:10","Administrasi Sistem Jaringan","DONI ARDIANTO, S.Kom",""],
    ["14:10 - 15:00","B. Inggris","ANGGRAINI WULANSARI, S.Pd",""]
  ],
  kamis:[
    ["07:00 - 09:00","Sejarah","WINDI YUNITA, S.Pd",""],
    ["09:00 - 10:30","Pend. Pancasila","YANUAR DWIANTA, S.Pd",""],
    ["10:45 - 14:10","Pemasangan dan Konfigurasi Perangkat Jaringan","MAM JUNAIDI ABROR, S.Pd",""],
    ["14:10 - 15:00","B. Inggris","ANGGRAINI WULANSARI, S.Pd",""]
  ],
  jumat:[
    ["07:00 - 09:00","B. Jawa","RISKA HANDAYANI",""],
    ["09:00 - 10:30","Penjaskes","SANDY RIAWAN, M.Pd",""],
    ["10:45 - 11:30","BK","SITI KOMARIATUL UZ ZAHROK, S.Pd",""],
    ["11:30 - 14:55","Kreatifitas, Inovasi, dan Kewirausahaan","SITI NURUL FAUZIAH, S.E",""]
  ]
};
const scheduleList=document.getElementById("scheduleList");
function renderSchedule(day){
 scheduleList.innerHTML="";
 schedules[day].forEach((x,i)=>{
  const d=document.createElement("div");d.className="schedule-item";d.style.animationDelay=i*.06+"s";
  d.innerHTML=`<div class="schedule-time">${x[0]}</div><div><div class="schedule-subject">${x[1]}</div><div class="schedule-teacher">${x[2]}</div></div>${x[3]?`<div class="schedule-room">${x[3]}</div>`:""}`;
  scheduleList.appendChild(d);
 });
}
renderSchedule("senin");
document.querySelectorAll(".day-button").forEach(b=>b.addEventListener("click",()=>{
 document.querySelectorAll(".day-button").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderSchedule(b.dataset.day);
}));

const students=[
["Ach. Yudi","L"],["Alfi R. F.","L"],["Alvino Adityas","L"],["Alya Nur Fadilah","P"],["Aringga Rheza","L"],
["Aurellia Siva A.","P"],["Azkya Viorentina F.","P"],["Cika Ul Umha","P"],["Desvita Ayu S.","P"],["Dina Oktaviana","P"],
["Elis Nurdiyana P.","P"],["Enisa Vita Agustin","P"],["Feriska Aulia M.","P"],["Fita Dwi A.","P"],["Ines Afina R.","P"],
["Irfan Wahyu Prasetyo","L"],["Kharizma Aiya A.","P"],["Kirania Putri S.","P"],["Lucky Akbar Al F.","L"],["Marsha Aufa Nur S.","P"],
["Miftakhul Huda","L"],["Moh. Dzul Fiqri Albaqi B.","L"],["M. Indra S. P.","L"],["M. Farhan Daffa","L"],["M. Ezar Maulana M.","L"],
["M. Imam V.","L"],["Naila Naswa D.","P"],["Neneng Anjarwati","P"],["Noval Dwi Alvino","L"],["Nurissadiyah Ika F.","P"],
["Putri Ridia Artika S.","P"],["Reyhana Zema Z.","P"],["Risma Fitri Amelia","P"],["Savira Aulia Dias A.","P"],["Shela Febriyanti","P"],["Vega Aulia Renata","P"]
];
const studentsGrid=document.getElementById("studentsGrid"),searchInput=document.getElementById("studentSearch"),studentFilter=document.getElementById("studentFilter");
function renderStudents(){
 const search=searchInput.value.toLowerCase().trim(),gender=studentFilter.value;
 const filtered=students.filter(s=>s[0].toLowerCase().includes(search)&&(gender==="all"||s[1]===gender));
 studentsGrid.innerHTML="";
 if(!filtered.length){studentsGrid.innerHTML=`<div style="grid-column:1/-1;padding:40px;text-align:center;color:var(--muted)">Tidak ada siswa yang ditemukan.</div>`;return}
 filtered.forEach((s,i)=>{
  const c=document.createElement("div");c.className="student-card";c.style.animation=`slideIn .3s ease ${i*.03}s both`;
  c.innerHTML=`<div class="student-avatar">${s[0][0]}</div><span class="gender">${s[1]}</span><h3>${s[0]}</h3><p>XI TKJ 1</p>`;
  studentsGrid.appendChild(c);
 });
}
searchInput.addEventListener("input",renderStudents);studentFilter.addEventListener("change",renderStudents);renderStudents();

const modal=document.getElementById("infoModal");
document.getElementById("infoButton").addEventListener("click",()=>modal.classList.add("show"));
function closeModal(){modal.classList.remove("show")}
document.getElementById("modalClose").addEventListener("click",closeModal);
document.getElementById("modalOk").addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
document.getElementById("backTop").addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));

const revealElements=document.querySelectorAll(".section-heading,.about-grid,.teacher-grid,.announcement-grid,.gallery-grid,.cta-card");
revealElements.forEach(e=>{e.style.opacity="0";e.style.transform="translateY(25px)";e.style.transition="opacity .7s ease,transform .7s ease"});
const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.style.opacity="1";e.target.style.transform="translateY(0)";revealObserver.unobserve(e.target)}}),{threshold:.1});
revealElements.forEach(e=>revealObserver.observe(e));

/* ===== PIKET DATA ===== */
const piketData = {
  Senin:["Yudi","Alfi","Alvino","Cika","Aurellia","Azkya"],
  Selasa:["Ayu","Elis","Enisa","Feriska","Aringga","Huda"],
  Rabu:["Vita","Ines","Kharizma","Kirania","Dzul","Indra"],
  Kamis:["Marsya","Naila","Neneng","Nuris","Farhan","Ezzar"],
  Jumat:["Putri","Risma","Vega","Shela","Imam","Noval"]
};
const piketGrid=document.getElementById("piketGrid");
const piketSearch=document.getElementById("piketSearch");
const piketDay=document.getElementById("piketDay");
const piketResult=document.getElementById("piketResult");

function initials(name){return name.split(" ").slice(0,2).map(x=>x[0]).join("").toUpperCase()}

function renderPiket(){
  const q=piketSearch.value.toLowerCase().trim();
  const selected=piketDay.value;
  piketGrid.innerHTML="";
  let found=[];
  Object.entries(piketData).forEach(([day,names])=>{
    if(selected!=="all" && selected!==day)return;
    const visible=names.filter(n=>{
      if(!q) return true;
      const full=students.find(s=>s[0].toLowerCase().startsWith(n.toLowerCase()) || s[0].toLowerCase().includes(n.toLowerCase()));
      return n.toLowerCase().includes(q) || (full && full[0].toLowerCase().includes(q));
    });
    if(q) visible.forEach(n=>found.push(`${n} piket hari ${day}`));
    const card=document.createElement("article");
    card.className="piket-day"+(day===new Intl.DateTimeFormat("id-ID",{weekday:"long",timeZone:"Asia/Jakarta"}).format(new Date())?" active":"");
    card.innerHTML=`<h3>${day}</h3><small>${visible.length} anggota</small>${
      visible.map(n=>`<div class="piket-person"><span class="piket-avatar">${initials(n)}</span><div><b>${n}</b><span>Petugas kebersihan</span></div></div>`).join("")
      || `<p style="margin-top:18px;color:var(--muted);font-size:8px">Tidak ada nama yang cocok.</p>`
    }`;
    piketGrid.appendChild(card);
  });
  if(q){
    piketResult.textContent=found.length ? found.join(" • ") : "Nama siswa tidak ditemukan di jadwal piket.";
  }else{
    piketResult.textContent="Tip: ketik nama siswa untuk langsung menemukan hari piketnya.";
  }
}
piketSearch.addEventListener("input",renderPiket);
piketDay.addEventListener("change",renderPiket);
renderPiket();

/* Active navigation also supports the new sections */
const allNavLinks=document.querySelectorAll(".nav-links a, .mobile-menu a");
allNavLinks.forEach(a=>a.addEventListener("click",()=>{
  const target=document.querySelector(a.getAttribute("href"));
  if(target) setTimeout(()=>target.scrollIntoView({behavior:"smooth",block:"start"}),0);
}));

/* ===== XI TKJ PRO FEATURES ===== */
const proTasks=[
 {id:1,title:'Konfigurasi VLAN & Trunk',subject:'Administrasi Jaringan',deadline:'2026-08-13',status:'todo',desc:'Buat topologi VLAN, trunk, dan dokumentasi konfigurasi.'},
 {id:2,title:'Subnetting IPv4',subject:'Perencanaan Jaringan',deadline:'2026-08-14',status:'doing',desc:'Kerjakan 20 soal subnetting dan simpan hasil perhitungan.'},
 {id:3,title:'Landing Page XI TKJ',subject:'Pemrograman Web',deadline:'2026-08-16',status:'done',desc:'Buat landing page responsif menggunakan HTML, CSS, dan JS.'}
];
const knowledgeFallback=[
 {id:'linux-command',icon:'🐧',cat:'linux',tag:'Linux',title:'Linux Command Dasar',desc:'Perintah penting untuk navigasi file, membuat folder, menyalin, memindahkan, dan menghapus file.',content:'Linux menggunakan terminal sebagai salah satu cara utama mengelola sistem.\n\nPerintah penting:\nls — melihat isi direktori\ncd — berpindah direktori\npwd — melihat lokasi direktori saat ini\nmkdir — membuat direktori\ntouch — membuat file kosong\ncp — menyalin file\nmv — memindahkan atau mengganti nama\nrm — menghapus file\ncat — membaca isi file'},
 {id:'linux-permission',icon:'🔐',cat:'linux',tag:'Linux',title:'Linux Permission & chmod',desc:'Owner, group, permission rwx, chmod, chown, dan keamanan file.',content:'r = read, w = write, x = execute.\n\nContoh: chmod 755 script.sh\n\n755 berarti owner rwx, group r-x, user lain r-x.'},
 {id:'linux-package',icon:'📦',cat:'linux',tag:'Linux',title:'Package Management',desc:'Mengelola aplikasi Linux dengan APT.',content:'sudo apt update\nsudo apt upgrade\nsudo apt install nginx\nsudo apt remove nginx'},
 {id:'linux-systemd',icon:'⚙️',cat:'linux',tag:'Linux',title:'Service & systemctl',desc:'Mengelola service Linux dan memeriksa status layanan.',content:'systemctl status nginx\nsudo systemctl start nginx\nsudo systemctl stop nginx\nsudo systemctl restart nginx\nsudo systemctl enable nginx'},
 {id:'linux-network',icon:'🌐',cat:'linux',tag:'Linux',title:'Networking Linux',desc:'ip, ping, ss, curl, route, dan troubleshooting koneksi.',content:'ip addr\nip route\nping 8.8.8.8\nss -tulpn\ncurl -I https://example.com'},
 {id:'ipv4-subnet',icon:'🌐',cat:'network',tag:'Jaringan',title:'IPv4 & Subnetting',desc:'CIDR, subnet mask, network address, broadcast, dan jumlah host.',content:'/24 = 255.255.255.0. Pada subnet klasik /24 terdapat 256 alamat dan 254 host usable.'},
 {id:'routing-basic',icon:'📡',cat:'network',tag:'Jaringan',title:'Routing Dasar',desc:'Static route, default route, gateway, dan tabel routing.',content:'Routing menentukan ke mana paket harus dikirim. Default route digunakan ketika tidak ada route yang lebih spesifik.'},
 {id:'dhcp-dns',icon:'📶',cat:'network',tag:'Jaringan',title:'DHCP & DNS',desc:'Pembagian IP otomatis dan penerjemahan nama domain.',content:'DHCP memberikan IP, subnet mask, gateway, dan DNS. DNS menerjemahkan nama domain menjadi alamat IP.'},
 {id:'vlan',icon:'🔀',cat:'network',tag:'Jaringan',title:'VLAN & Trunk',desc:'Membagi jaringan secara logis dan membawa beberapa VLAN melalui satu link.',content:'Access port umumnya membawa satu VLAN. Trunk dapat membawa beberapa VLAN dengan tagging.'},
 {id:'html-basic',icon:'💻',cat:'coding',tag:'Coding',title:'HTML Dasar',desc:'Struktur dokumen, semantic tags, link, image, dan form.',content:'HTML membentuk struktur halaman menggunakan elemen seperti header, nav, main, section, article, dan footer.'},
 {id:'css-basic',icon:'🎨',cat:'coding',tag:'Coding',title:'CSS Dasar',desc:'Selector, box model, flexbox, grid, dan responsive design.',content:'CSS mengatur tampilan. Pelajari selector, specificity, box model, flexbox, grid, media query, dan variables.'},
 {id:'js-basic',icon:'⚡',cat:'coding',tag:'Coding',title:'JavaScript Dasar',desc:'DOM, event, array, object, fetch, dan localStorage.',content:'JavaScript membuat halaman interaktif dan dapat memakai fetch() untuk berkomunikasi dengan backend.'},
 {id:'git-basic',icon:'🌿',cat:'coding',tag:'Coding',title:'Git Dasar',desc:'Repository, commit, branch, pull, push, dan clone.',content:'git clone URL\ngit status\ngit add .\ngit commit -m "update"\ngit push'},
 {id:'web-security',icon:'🛡️',cat:'security',tag:'Security',title:'Web Security Dasar',desc:'XSS, CSRF, HTTPS, validasi input, dan keamanan password.',content:'Validasi input, output encoding, HTTPS, dan least privilege merupakan dasar keamanan aplikasi web.'},
 {id:'auth-security',icon:'🔑',cat:'security',tag:'Security',title:'Authentication & Session',desc:'Login, password hashing, session token, dan logout.',content:'Backend sebaiknya menyimpan password dalam bentuk hash menggunakan scrypt, bcrypt, atau Argon2.'},
 {id:'sql-basic',icon:'🗄️',cat:'database',tag:'Database',title:'SQL Dasar',desc:'SELECT, INSERT, UPDATE, DELETE, WHERE, ORDER BY, dan JOIN.',content:'SQL digunakan untuk mengelola data relasional. Gunakan parameterized query pada backend untuk mencegah SQL injection.'},
 {id:'api-basic',icon:'🔌',cat:'database',tag:'Backend',title:'REST API Dasar',desc:'GET, POST, PUT/PATCH, DELETE, JSON, dan status code.',content:'GET /api/materials mengambil materi. POST /api/materials menambah materi. DELETE /api/materials/:id menghapus materi.'}
];
let knowledge=[];
const API_BASE=(window.KYOU_CONFIG&&window.KYOU_CONFIG.API_BASE)||'';
const ADMIN_TOKEN_KEY='xi-admin-token';
function adminToken(){return sessionStorage.getItem(ADMIN_TOKEN_KEY)||''}
async function apiFetch(path,options={}){const headers={'Content-Type':'application/json',...(options.headers||{})};if(adminToken())headers.Authorization='Bearer '+adminToken();const r=await fetch(API_BASE+path,{...options,headers});if(!r.ok){let e={};try{e=await r.json()}catch{};throw new Error(e.error||`HTTP ${r.status}`)}return r.json()}
async function loadKnowledge(){try{const data=await apiFetch('/api/materials');knowledge=data.items||[];}catch(e){knowledge=knowledgeFallback;toast('Backend belum aktif — materi lokal ditampilkan.')}renderKnowledge()}
function renderKnowledge(){const grid=document.getElementById('knowledgeGrid');if(!grid)return;const q=(document.getElementById('knowledgeSearch').value||'').toLowerCase();const f=document.getElementById('knowledgeFilter').value;grid.innerHTML=knowledge.filter(k=>(f==='all'||k.cat===f)&&(`${k.title} ${k.desc} ${k.tag} ${k.content||''}`.toLowerCase().includes(q))).map(k=>`<article class="knowledge-card"><div class="knowledge-icon">${escapeHTML(k.icon||'📘')}</div><span class="tag">${escapeHTML(k.tag||k.cat)}</span><h3>${escapeHTML(k.title)}</h3><p>${escapeHTML(k.desc||'')}</p><button class="mini-btn" onclick="openMaterial('${escapeHTML(k.id)}')">Buka materi →</button></article>`).join('')||'<div class="knowledge-card">Materi tidak ditemukan.</div>'}
async function openMaterial(id){try{const k=knowledge.find(x=>x.id===id)||await apiFetch('/api/materials/'+encodeURIComponent(id));const box=document.getElementById('materialDetail');box.innerHTML=`<span class="eyebrow">${escapeHTML(k.tag||k.cat)}</span><h2>${escapeHTML(k.title)}</h2><p>${escapeHTML(k.desc||'')}</p><pre class="material-content">${escapeHTML(k.content||'Materi belum memiliki isi.')}</pre>`;document.getElementById('materialModal').classList.add('show');document.getElementById('materialModal').setAttribute('aria-hidden','false')}catch(e){toast(e.message)}}
window.openMaterial=openMaterial;
document.getElementById('knowledgeSearch')?.addEventListener('input',renderKnowledge);document.getElementById('knowledgeFilter')?.addEventListener('change',renderKnowledge);document.getElementById('materialClose')?.addEventListener('click',()=>document.getElementById('materialModal').classList.remove('show'));document.getElementById('materialModal')?.addEventListener('click',e=>{if(e.target.id==='materialModal')e.target.classList.remove('show')});loadKnowledge();

function escapeHTML(x){return String(x).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function toast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),2200)}
function loadTasks(){try{return JSON.parse(localStorage.getItem('xi-pro-tasks'))||proTasks}catch{return proTasks}}
function saveTasks(x){localStorage.setItem('xi-pro-tasks',JSON.stringify(x));document.getElementById('taskStat').textContent=x.filter(t=>t.status!=='done').length}
function renderTasks(){const grid=document.getElementById('taskGrid');if(!grid)return;const q=(document.getElementById('taskSearch').value||'').toLowerCase();const f=document.getElementById('taskFilter').value;const tasks=loadTasks().filter(t=>(f==='all'||t.status===f)&&(`${t.title} ${t.subject}`.toLowerCase().includes(q)));grid.innerHTML=tasks.map(t=>`<article class="task-card"><span class="status">${t.status==='done'?'🟢 Selesai':t.status==='doing'?'🟡 Dikerjakan':'🔴 Belum'}</span><small>${escapeHTML(t.subject)}</small><h3>${escapeHTML(t.title)}</h3><p>${escapeHTML(t.desc)}</p><div class="task-meta"><span>⏰ ${t.deadline}</span><span>Task #${t.id}</span></div><div class="task-actions">${t.status!=='done'?`<button class="mini-btn" onclick="cycleTask(${t.id})">Ubah Status</button>`:''}<button class="mini-btn" onclick="deleteTask(${t.id})">Hapus</button></div></article>`).join('')||'<div class="task-card">Tidak ada tugas yang cocok.</div>'}
function cycleTask(id){const a=loadTasks(),t=a.find(x=>x.id===id);if(!t)return;t.status=t.status==='todo'?'doing':t.status==='doing'?'done':'todo';saveTasks(a);renderTasks();toast('Status tugas diperbarui')}
function deleteTask(id){saveTasks(loadTasks().filter(x=>x.id!==id));renderTasks();toast('Tugas dihapus')}
window.cycleTask=cycleTask;window.deleteTask=deleteTask;
document.getElementById('taskSearch')?.addEventListener('input',renderTasks);document.getElementById('taskFilter')?.addEventListener('change',renderTasks);document.getElementById('addTaskBtn')?.addEventListener('click',()=>{const title=prompt('Nama tugas?');if(!title)return;const subject=prompt('Mata pelajaran?')||'Umum';const deadline=prompt('Deadline (YYYY-MM-DD)?')||new Date().toISOString().slice(0,10);const a=loadTasks();a.push({id:Date.now(),title,subject,deadline,status:'todo',desc:'Tugas ditambahkan melalui dashboard admin.'});saveTasks(a);renderTasks();toast('Tugas berhasil ditambahkan')});renderTasks();
function renderKnowledge(){const grid=document.getElementById('knowledgeGrid');if(!grid)return;const q=(document.getElementById('knowledgeSearch').value||'').toLowerCase();const f=document.getElementById('knowledgeFilter').value;grid.innerHTML=knowledge.filter(k=>(f==='all'||k.cat===f)&&(`${k.title} ${k.desc} ${k.tag}`.toLowerCase().includes(q))).map(k=>`<article class="knowledge-card"><div class="knowledge-icon">${k.icon}</div><span class="tag">${k.tag}</span><h3>${k.title}</h3><p>${k.desc}</p><button class="mini-btn" onclick="toast('Materi ${k.title} siap dikembangkan')">Buka materi →</button></article>`).join('')}
document.getElementById('knowledgeSearch')?.addEventListener('input',renderKnowledge);document.getElementById('knowledgeFilter')?.addEventListener('change',renderKnowledge);renderKnowledge();

const toolModal=document.getElementById('toolModal'),toolContent=document.getElementById('toolModalContent');
function openTool(type){toolModal.classList.add('show');let html='';if(type==='password')html=`<h2>🔐 Password Generator</h2><input id="toolLen" type="number" min="6" max="64" value="18"><div class="tool-actions"><button class="btn btn-primary" onclick="genPass()">Generate</button></div><div class="tool-result" id="toolResult"></div>`;
else if(type==='base64')html=`<h2>🔤 Base64 Encoder / Decoder</h2><textarea id="toolInput" placeholder="Teks..."></textarea><div class="tool-actions"><button class="btn btn-primary" onclick="b64('e')">Encode</button><button class="mini-btn" onclick="b64('d')">Decode</button></div><div class="tool-result" id="toolResult"></div>`;
else if(type==='json')html=`<h2>{ } JSON Formatter</h2><textarea id="toolInput" placeholder='{"hello":"world"}'></textarea><button class="btn btn-primary" onclick="fmtJSON()">Format</button><div class="tool-result" id="toolResult"></div>`;
else if(type==='ip')html=`<h2>🌐 IPv4 Quick Calculator</h2><input id="ipInput" value="192.168.1.10/24"><button class="btn btn-primary" onclick="calcIP()">Calculate</button><div class="tool-result" id="toolResult"></div>`;
else if(type==='hash')html=`<h2># SHA-256</h2><textarea id="toolInput" placeholder="Teks yang akan di-hash"></textarea><button class="btn btn-primary" onclick="hashText()">Hash</button><div class="tool-result" id="toolResult"></div>`;
else if(type==='color')html=`<h2>🎨 Color Picker</h2><input id="colorInput" type="color" value="#6675ff" oninput="document.getElementById('colorValue').textContent=this.value"><div class="tool-result" id="colorValue">#6675ff</div>`;
else if(type==='regex')html=`<h2>.* Regex Tester</h2><input id="regexPattern" placeholder="^XI"><textarea id="regexText" placeholder="Teks..." ></textarea><button class="btn btn-primary" onclick="testRegex()">Test</button><div class="tool-result" id="toolResult"></div>`;
else if(type==='qr')html=`<h2>▦ QR Generator</h2><input id="qrInput" placeholder="https://..." value="XI TKJ 1"><button class="btn btn-primary" onclick="makeQR()">Generate QR</button><div class="tool-result" id="toolResult">QR generator siap. Untuk versi offline penuh, gunakan library QR lokal.</div>`;toolContent.innerHTML=html}
function genPass(){const n=Math.min(64,Math.max(6,Number(document.getElementById('toolLen').value)||18)),c='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';let s='';crypto.getRandomValues(new Uint32Array(n)).forEach(v=>s+=c[v%c.length]);document.getElementById('toolResult').textContent=s}
function b64(m){try{const v=document.getElementById('toolInput').value;document.getElementById('toolResult').textContent=m==='e'?btoa(unescape(encodeURIComponent(v))):decodeURIComponent(escape(atob(v)))}catch(e){document.getElementById('toolResult').textContent='Input tidak valid.'}}
function fmtJSON(){try{document.getElementById('toolResult').textContent=JSON.stringify(JSON.parse(document.getElementById('toolInput').value),null,2)}catch(e){document.getElementById('toolResult').textContent='JSON error: '+e.message}}
function calcIP(){const raw=document.getElementById('ipInput').value.trim();const [ip,cidr]=raw.split('/');const p=ip.split('.').map(Number);const n=Number(cidr);if(p.length!==4||p.some(x=>x<0||x>255)||n<0||n>32){document.getElementById('toolResult').textContent='Format IPv4/CIDR tidak valid.';return}const val=p.reduce((a,x)=>(a<<8)+x,0)>>>0;const mask=n===0?0:(0xffffffff<<(32-n))>>>0;const net=(val&mask)>>>0;const bc=(net|(~mask>>>0))>>>0;const fmt=x=>[(x>>>24)&255,(x>>>16)&255,(x>>>8)&255,x&255].join('.');document.getElementById('toolResult').textContent=`Network: ${fmt(net)}\nBroadcast: ${fmt(bc)}\nCIDR: /${n}\nUsable hosts: ${n>=31?Math.pow(2,32-n):Math.max(0,Math.pow(2,32-n)-2)}`}
async function hashText(){const data=new TextEncoder().encode(document.getElementById('toolInput').value),buf=await crypto.subtle.digest('SHA-256',data);document.getElementById('toolResult').textContent=[...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('')}
function testRegex(){try{const r=new RegExp(document.getElementById('regexPattern').value,'g'),t=document.getElementById('regexText').value,m=[...t.matchAll(r)].map(x=>x[0]);document.getElementById('toolResult').textContent=`${m.length} match:\n${m.join('\n')}`}catch(e){document.getElementById('toolResult').textContent=e.message}}
function makeQR(){document.getElementById('toolResult').textContent='Isi: '+document.getElementById('qrInput').value+'\nQR module bisa ditambahkan offline tanpa API.'}
window.genPass=genPass;window.b64=b64;window.fmtJSON=fmtJSON;window.calcIP=calcIP;window.hashText=hashText;window.testRegex=testRegex;window.makeQR=makeQR;
document.querySelectorAll('.tool-card').forEach(b=>b.addEventListener('click',()=>openTool(b.dataset.tool)));document.getElementById('toolClose')?.addEventListener('click',()=>toolModal.classList.remove('show'));toolModal?.addEventListener('click',e=>{if(e.target===toolModal)toolModal.classList.remove('show')});

function updateClock(){const now=new Date();document.getElementById('liveClock')&&(document.getElementById('liveClock').textContent=now.toLocaleTimeString('id-ID',{hour12:false}));const today=now.toLocaleDateString('id-ID',{weekday:'long'}).toLowerCase();const key={senin:'senin',selasa:'selasa',rabu:'rabu',kamis:'kamis',jumat:'jumat'}[today];if(key){const arr=schedules[key];const mins=now.getHours()*60+now.getMinutes();const found=arr.find(x=>{const [a,b]=x[0].split(' - ').map(t=>{const [h,m]=t.split(':').map(Number);return h*60+m});return mins<b});if(found){document.getElementById('nextClassName').textContent=found[1];document.getElementById('nextClassLabel').textContent=found[0];let [h,m]=found[0].split(' - ')[0].split(':').map(Number);let target=new Date(now);target.setHours(h,m,0,0);if(target<now)target.setDate(target.getDate()+1);let diff=Math.max(0,target-now),hh=Math.floor(diff/3600000),mm=Math.floor(diff%3600000/60000),ss=Math.floor(diff%60000/1000);document.getElementById('classCountdown').textContent=[hh,mm,ss].map(x=>String(x).padStart(2,'0')).join(':')}}}
setInterval(updateClock,1000);updateClock();

async function adminRender(tab='overview'){
 const c=document.getElementById('adminContent');if(!c)return;
 if(tab==='materials'){
  let rows=[];try{rows=(await apiFetch('/api/materials')).items||[]}catch(e){c.innerHTML=`<p class="error">${escapeHTML(e.message)}</p>`;return}
  c.innerHTML=`<div class="admin-head-row"><div><h3>📚 Kelola Materi</h3><p style="color:var(--muted)">Tambah materi Linux, Jaringan, Coding, Security, dan Database tanpa mengedit script.js.</p></div><button class="btn btn-primary" id="adminAddMaterial">＋ Tambah Materi</button></div><div class="admin-material-list">${rows.map(m=>`<article class="admin-material-row"><span>${escapeHTML(m.icon||'📘')}</span><div><b>${escapeHTML(m.title)}</b><small>${escapeHTML(m.tag||m.cat)}</small><p>${escapeHTML(m.desc||'')}</p></div><button class="mini-btn danger" data-del-material="${escapeHTML(m.id)}">Hapus</button></article>`).join('')}</div>`;
  document.getElementById('adminAddMaterial')?.addEventListener('click',adminAddMaterial);
  c.querySelectorAll('[data-del-material]').forEach(b=>b.addEventListener('click',async()=>{if(!confirm('Hapus materi ini?'))return;try{await apiFetch('/api/materials/'+encodeURIComponent(b.dataset.delMaterial),{method:'DELETE'});await loadKnowledge();adminRender('materials');toast('Materi dihapus')}catch(e){toast(e.message)}}));
  return;
 }
 const tasks=loadTasks();
 if(tab==='overview')c.innerHTML=`<div class="admin-cards"><div class="admin-mini"><small>Siswa</small><b>36</b><span>anggota kelas</span></div><div class="admin-mini"><small>Tugas aktif</small><b>${tasks.filter(t=>t.status!=='done').length}</b><span>perlu dipantau</span></div><div class="admin-mini"><small>Materi</small><b>${knowledge.length}</b><span>tersedia</span></div></div><h3 style="margin-top:25px">🚀 Quick actions</h3><div class="task-actions"><button class="btn btn-primary" onclick="document.getElementById('addTaskBtn').click()">＋ Tambah tugas</button><button class="mini-btn" onclick="adminRender('materials')">📚 Kelola materi</button><button class="mini-btn" onclick="exportClassBackup()">Export backup</button></div>`;
 else if(tab==='tasks')c.innerHTML=`<h3>Daftar tugas</h3><table class="admin-table"><tr><th>Tugas</th><th>Mapel</th><th>Status</th><th>Deadline</th></tr>${tasks.map(t=>`<tr><td>${escapeHTML(t.title)}</td><td>${escapeHTML(t.subject)}</td><td>${t.status}</td><td>${t.deadline}</td></tr>`).join('')}</table>`;
 else if(tab==='students')c.innerHTML=`<h3>Database siswa</h3><table class="admin-table"><tr><th>#</th><th>Nama</th><th>Gender</th></tr>${students.map((s,i)=>`<tr><td>${i+1}</td><td>${escapeHTML(s[0])}</td><td>${s[1]}</td></tr>`).join('')}</table>`;
 else if(tab==='announcements')c.innerHTML=`<h3>Pengumuman</h3><p style="color:var(--muted)">Modul pengumuman masih lokal pada versi ini.</p>`;
 else if(tab==='files')c.innerHTML=`<h3>📁 File Center</h3><p style="color:var(--muted)">Kelola link/modul yang tersimpan di perangkat.</p><button class="btn btn-primary" onclick="document.getElementById('addFileBtn')?.click()">＋ Tambah file/link</button>`;
 else c.innerHTML=`<h3>⚙️ Pengaturan Kelas</h3><p style="color:var(--muted)">Backend aktif. Data materi tersimpan di server.</p>`;
}
async function adminAddMaterial(){
 const title=prompt('Judul materi?');if(!title)return;const cats={linux:'Linux',network:'Jaringan',coding:'Coding',security:'Security',database:'Database'};const cat=prompt('Kategori: linux / network / coding / security / database','linux')||'linux';const tag=cats[cat]||cat;const desc=prompt('Deskripsi singkat?')||'';const content=prompt('Isi materi? (bisa beberapa baris)')||'';if(!content)return;try{await apiFetch('/api/materials',{method:'POST',body:JSON.stringify({title,cat,tag,icon:cat==='linux'?'🐧':cat==='network'?'🌐':cat==='coding'?'💻':cat==='security'?'🛡️':'🗄️',desc,content})});await loadKnowledge();adminRender('materials');toast('Materi berhasil ditambahkan')}catch(e){toast(e.message)}}
window.adminRender=adminRender;window.adminAddMaterial=adminAddMaterial;
document.querySelectorAll('.admin-tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.admin-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');adminRender(b.dataset.admin)}));adminRender();

/* Private Control Panel login via backend */
const adminLoginModal=document.getElementById('adminLoginModal');
const adminPortal=document.getElementById('adminPortal');
const adminLoginForm=document.getElementById('adminLoginForm');
const adminLoginError=document.getElementById('adminLoginError');
function showAdminLogin(){if(!adminLoginModal)return;adminLoginModal.classList.add('show');adminLoginModal.setAttribute('aria-hidden','false');setTimeout(()=>document.getElementById('adminUsername')?.focus(),80)}
function hideAdminLogin(){adminLoginModal?.classList.remove('show');adminLoginModal?.setAttribute('aria-hidden','true')}
function openAdminPortal(){hideAdminLogin();window.hideEntryGate?.();adminPortal?.classList.add('show');adminPortal?.setAttribute('aria-hidden','false');adminRender('overview')}
function closeAdminPortal(){adminPortal?.classList.remove('show');adminPortal?.setAttribute('aria-hidden','true')}
document.getElementById('adminTrigger')?.addEventListener('click',showAdminLogin);
document.getElementById('adminLoginClose')?.addEventListener('click',()=>{hideAdminLogin();window.showEntryGate?.()});
document.getElementById('adminPortalClose')?.addEventListener('click',closeAdminPortal);
document.getElementById('adminLogout')?.addEventListener('click',async()=>{try{await apiFetch('/api/auth/logout',{method:'POST'})}catch{}sessionStorage.removeItem(ADMIN_TOKEN_KEY);closeAdminPortal();toast('Sesi admin ditutup')});
adminLoginForm?.addEventListener('submit',async e=>{e.preventDefault();const u=document.getElementById('adminUsername')?.value.trim(),pw=document.getElementById('adminPassword')?.value;try{const data=await apiFetch('/api/auth/login',{method:'POST',body:JSON.stringify({username:u,password:pw})});sessionStorage.setItem(ADMIN_TOKEN_KEY,data.token);adminLoginError.textContent='';adminLoginForm.reset();openAdminPortal();toast('Login berhasil. Selamat datang, Admin.')}catch(err){adminLoginError.textContent=err.message;document.getElementById('adminPassword').value=''}});

[adminLoginModal,adminPortal].forEach(m=>m?.addEventListener('click',e=>{if(e.target===m){if(m===adminLoginModal){hideAdminLogin();window.showEntryGate?.()}else closeAdminPortal();}}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){hideAdminLogin();window.showEntryGate?.();closeAdminPortal();}});



/* ===== XI TKJ 1 ULTIMATE CLASS FEATURES ===== */
const CLASS_EVENTS=[
  {date:'2026-08-12',title:'Praktik Mikrotik',type:'Praktik',desc:'Konfigurasi dasar router dan jaringan.'},
  {date:'2026-08-13',title:'Deadline VLAN & Trunk',type:'Tugas',desc:'Pengumpulan konfigurasi VLAN.'},
  {date:'2026-08-14',title:'Quiz Subnetting',type:'Quiz',desc:'Latihan subnetting IPv4.'},
  {date:'2026-08-16',title:'Project Landing Page',type:'Project',desc:'Presentasi project web kelas.'}
];
function localDateKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
let calDate=new Date();
function renderCalendar(){
 const grid=document.getElementById('calendarGrid'); if(!grid)return;
 const y=calDate.getFullYear(),m=calDate.getMonth(),first=new Date(y,m,1),last=new Date(y,m+1,0);
 const title=document.getElementById('calTitle'); if(title)title.textContent=new Intl.DateTimeFormat('id-ID',{month:'long',year:'numeric'}).format(calDate);
 const start=first.getDay(),days=last.getDate(); let h='';
 for(let i=0;i<start;i++)h+='<span class="cal-empty"></span>';
 for(let d=1;d<=days;d++){const key=localDateKey(new Date(y,m,d));const ev=CLASS_EVENTS.find(e=>e.date===key);const today=key===localDateKey(new Date());h+=`<button class="cal-day ${today?'today':''} ${ev?'has-event':''}" data-date="${key}"><b>${d}</b>${ev?'<i></i>':''}</button>`}
 grid.innerHTML=h;
 grid.querySelectorAll('.cal-day').forEach(b=>b.addEventListener('click',()=>{const ev=CLASS_EVENTS.filter(e=>e.date===b.dataset.date);const list=document.getElementById('agendaList');if(list&&ev.length)list.innerHTML=ev.map(e=>`<article class="agenda-item"><b>${escapeHTML(e.title)}</b><span>${escapeHTML(e.type)}</span><p>${escapeHTML(e.desc)}</p></article>`).join('');else if(list)list.innerHTML='<div class="empty-state">Tidak ada agenda pada tanggal ini.</div>'}));
 renderAgenda();
}
function renderAgenda(){
 const list=document.getElementById('agendaList');if(!list)return;
 const now=localDateKey(new Date());const upcoming=CLASS_EVENTS.filter(e=>e.date>=now).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,6);
 list.innerHTML=upcoming.map(e=>`<article class="agenda-item"><div><b>${escapeHTML(e.title)}</b><p>${escapeHTML(e.desc)}</p></div><span>${new Date(e.date+'T00:00:00').toLocaleDateString('id-ID',{day:'2-digit',month:'short'})}</span></article>`).join('')||'<div class="empty-state">Belum ada agenda.</div>';
 const c=document.getElementById('agendaCount');if(c)c.textContent=upcoming.length+' agenda';
}
document.getElementById('calPrev')?.addEventListener('click',()=>{calDate.setMonth(calDate.getMonth()-1);renderCalendar()});
document.getElementById('calNext')?.addEventListener('click',()=>{calDate.setMonth(calDate.getMonth()+1);renderCalendar()});
renderCalendar();

/* Quiz Center */
const quizBank=[
 {q:'Subnet mask untuk /24 adalah...',o:['255.255.0.0','255.255.255.0','255.0.0.0','255.255.255.252'],a:1},
 {q:'Perintah Linux untuk melihat isi folder adalah...',o:['ls','cd','pwd','mkdir'],a:0},
 {q:'Port default HTTPS adalah...',o:['21','53','80','443'],a:3},
 {q:'Tag HTML untuk membuat tautan adalah...',o:['<p>','<a>','<link>','<href>'],a:1},
 {q:'Protokol yang biasa digunakan untuk memperoleh IP otomatis adalah...',o:['FTP','DHCP','SSH','SMTP'],a:1},
 {q:'Perintah Git untuk mengambil repository dari remote adalah...',o:['git push','git merge','git clone','git init'],a:2},
 {q:'Primary key pada database berfungsi untuk...',o:['Mengidentifikasi record secara unik','Menyimpan gambar','Menjalankan server','Menghapus tabel'],a:0},
 {q:'XSS termasuk kategori...',o:['Serangan pada browser/web','Serangan kabel fiber','Format database','Sistem operasi'],a:0}
];
let quizIndex=0,quizScore=0,quizAnswered=false;
function renderQuiz(){
 const q=quizBank[quizIndex];if(!q)return;
 document.getElementById('quizQuestion').textContent=q.q;
 document.getElementById('quizProgress').textContent=`Soal ${quizIndex+1} / ${quizBank.length}`;
 document.getElementById('quizScore').textContent=`Skor: ${quizScore}`;
 const wrap=document.getElementById('quizOptions');wrap.innerHTML=q.o.map((x,i)=>`<button class="quiz-option" data-i="${i}">${String.fromCharCode(65+i)}. ${escapeHTML(x)}</button>`).join('');
 quizAnswered=false;document.getElementById('quizResult').textContent='';
 wrap.querySelectorAll('.quiz-option').forEach(b=>b.addEventListener('click',()=>answerQuiz(Number(b.dataset.i))));
}
function answerQuiz(i){
 if(quizAnswered)return;quizAnswered=true;const q=quizBank[quizIndex],opts=document.querySelectorAll('.quiz-option');
 opts.forEach((b,n)=>{b.disabled=true;if(n===q.a)b.classList.add('correct');if(n===i&&i!==q.a)b.classList.add('wrong')});
 if(i===q.a){quizScore++;document.getElementById('quizResult').textContent='✅ Benar!';}else document.getElementById('quizResult').textContent=`❌ Kurang tepat. Jawaban: ${q.o[q.a]}`;
 document.getElementById('quizScore').textContent=`Skor: ${quizScore}`;
}
function nextQuiz(){if(!quizAnswered){toast('Jawab soal dulu.');return}if(quizIndex<quizBank.length-1){quizIndex++;renderQuiz()}else{document.getElementById('quizResult').textContent=`🏁 Selesai! Skor akhir ${quizScore}/${quizBank.length}.`;localStorage.setItem('xi-last-quiz',JSON.stringify({score:quizScore,total:quizBank.length,date:Date.now()}))}}
function resetQuiz(){quizIndex=0;quizScore=0;renderQuiz()}
document.getElementById('quizNext')?.addEventListener('click',nextQuiz);document.getElementById('quizReset')?.addEventListener('click',resetQuiz);renderQuiz();

/* Code Playground */
const defaultCode={html:`<main><h1>XI TKJ 1</h1><p>Halo dari Code Lab 🚀</p><button onclick="document.body.style.background='#111827'">Klik aku</button></main>`,css:`body{font-family:Arial;padding:30px;background:#0b1020;color:white}h1{color:#7c8cff}`,js:`console.log('Hello XI TKJ 1');`};
function runCode(){
 const h=document.getElementById('codeHtml')?.value||'',c=document.getElementById('codeCss')?.value||'',j=document.getElementById('codeJs')?.value||'';
 const frame=document.getElementById('codePreview');if(!frame)return;
 frame.srcdoc=`<!doctype html><html><head><meta charset="utf-8"><style>${c.replace(/<\/style/gi,'<\\/style')}</style></head><body>${h}<script>${j.replace(/<\/script/gi,'<\\/script')}<\/script></body></html>`;
 const st=document.getElementById('codeStatus');if(st)st.textContent='Running';
 localStorage.setItem('xi-code-lab',JSON.stringify({h,c,j}));
 setTimeout(()=>{if(st)st.textContent='Selesai'},300);
}
function resetCode(){document.getElementById('codeHtml').value=defaultCode.html;document.getElementById('codeCss').value=defaultCode.css;document.getElementById('codeJs').value=defaultCode.js;runCode()}
document.getElementById('codeRun')?.addEventListener('click',runCode);document.getElementById('codeReset')?.addEventListener('click',resetCode);
try{const saved=JSON.parse(localStorage.getItem('xi-code-lab'));if(saved){document.getElementById('codeHtml').value=saved.h;document.getElementById('codeCss').value=saved.c;document.getElementById('codeJs').value=saved.j}}catch{}
runCode();

/* File Center */
const DEFAULT_FILES=[
 {id:1,title:'Modul Jaringan Dasar',type:'PDF / Modul',url:'',icon:'📘'},
 {id:2,title:'Kisi-kisi Administrasi Jaringan',type:'Dokumen',url:'',icon:'🗂️'},
 {id:3,title:'Google Drive Kelas',type:'Link',url:'',icon:'☁️'}
];
function loadFiles(){try{return JSON.parse(localStorage.getItem('xi-files'))||DEFAULT_FILES}catch{return DEFAULT_FILES}}
function saveFiles(x){localStorage.setItem('xi-files',JSON.stringify(x))}
function renderFiles(){
 const grid=document.getElementById('fileGrid');if(!grid)return;
 const q=(document.getElementById('fileSearch').value||'').toLowerCase();
 const rows=loadFiles().filter(f=>`${f.title} ${f.type}`.toLowerCase().includes(q));
 grid.innerHTML=rows.map(f=>{
   const action=f.url
     ? `<a class="mini-btn" target="_blank" rel="noopener" href="${escapeHTML(f.url)}">Buka</a>`
     : `<button class="mini-btn" onclick="toast('Tambahkan URL melalui tombol Tambah File/Link.')">Siapkan</button>`;
   return `<article class="file-card"><div class="file-icon">${f.icon||'📄'}</div><div><span>${escapeHTML(f.type)}</span><h3>${escapeHTML(f.title)}</h3><p>${f.url?'Tersedia sebagai link.':'Belum ada URL/file yang dipasang.'}</p></div><div class="file-actions">${action}</div></article>`;
 }).join('')||'<div class="empty-state">File tidak ditemukan.</div>';
}
function addFile(){
 const title=prompt('Nama file / materi?');if(!title)return;const type=prompt('Jenis (PDF/Modul/Link)?')||'Dokumen';const url=prompt('URL file atau Google Drive (opsional)?')||'';const a=loadFiles();a.push({id:Date.now(),title,type,url,icon:url?'🔗':'📄'});saveFiles(a);renderFiles();toast('File/link ditambahkan')}
document.getElementById('fileSearch')?.addEventListener('input',renderFiles);document.getElementById('addFileBtn')?.addEventListener('click',addFile);renderFiles();window.addFile=addFile;

/* Notification Center */
function buildNotifications(){
 const tasks=loadTasks().filter(t=>t.status!=='done').slice(0,4);
 const items=[
  {icon:'📢',title:'Portal kelas aktif',text:'Selamat datang di pusat aktivitas XI TKJ 1.',time:'Terbaru'},
  ...tasks.map(t=>({icon:'📝',title:`Tugas: ${t.title}`,text:`Deadline ${t.deadline} · ${t.subject}`,time:'Tugas'})),
  ...CLASS_EVENTS.slice(0,3).map(e=>({icon:'📅',title:e.title,text:e.desc,time:e.date}))
 ];
 const list=document.getElementById('notificationList');if(!list)return;
 list.innerHTML=items.map((n,i)=>`<article class="notification-item ${i<3?'unread':''}"><div class="notification-icon">${n.icon}</div><div><b>${escapeHTML(n.title)}</b><p>${escapeHTML(n.text)}</p></div><span>${escapeHTML(n.time)}</span></article>`).join('');
 const unread=items.length?Math.min(9,items.filter((_,i)=>i<3).length):0;
 const count=document.getElementById('notificationCount');if(count)count.textContent=unread;
}
document.getElementById('notificationButton')?.addEventListener('click',()=>document.getElementById('notifications')?.scrollIntoView({behavior:'smooth'}));
document.getElementById('markNotifications')?.addEventListener('click',()=>{document.querySelectorAll('.notification-item.unread').forEach(x=>x.classList.remove('unread'));const c=document.getElementById('notificationCount');if(c)c.textContent='0';toast('Semua notifikasi ditandai dibaca')});
buildNotifications();

function exportClassBackup(){
 const payload={tasks:loadTasks(),files:loadFiles(),quiz:localStorage.getItem('xi-last-quiz'),code:localStorage.getItem('xi-code-lab'),exportedAt:new Date().toISOString()};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='XI-TKJ-1-backup.json';a.click();URL.revokeObjectURL(url);toast('Backup JSON dibuat');
}
window.exportClassBackup=exportClassBackup;

// PWA service worker
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));


/* ===== STUDENT ACCOUNTS / PORTAL ===== */
(() => {
  const loginModal = document.getElementById('studentLoginModal');
  const areaModal = document.getElementById('studentAreaModal');
  const loginForm = document.getElementById('studentLoginForm');
  const loginUser = document.getElementById('studentUsername');
  const loginPass = document.getElementById('studentPassword');
  const loginError = document.getElementById('studentLoginError');
  const welcome = document.getElementById('studentWelcome');
  const openers = [document.getElementById('studentPortalButton'), document.getElementById('studentPortalButton2')].filter(Boolean);
  const closeLogin = document.getElementById('studentLoginClose');
  const closeArea = document.getElementById('studentAreaClose');
  const logout = document.getElementById('studentLogout');

  function openLogin(){ if(loginModal) loginModal.classList.add('show'); }
  function close(m){ if(m) m.classList.remove('show'); }
  openers.forEach(x=>x.addEventListener('click', openLogin));
  closeLogin?.addEventListener('click',()=>{close(loginModal);window.showEntryGate?.();});
  closeArea?.addEventListener('click',()=>close(areaModal));
  loginModal?.addEventListener('click',e=>{if(e.target===loginModal)close(loginModal)});
  areaModal?.addEventListener('click',e=>{if(e.target===areaModal)close(areaModal)});

  loginForm?.addEventListener('submit', async (e)=>{
    e.preventDefault(); loginError.textContent='Memeriksa akun...';
    try{
      const r=await fetch(API_BASE+'/api/student/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:loginUser.value.trim(),password:loginPass.value})});
      const data=await r.json();
      if(!r.ok) throw new Error(data.error||'Login gagal');
      sessionStorage.setItem('studentToken',data.token);
      sessionStorage.setItem('studentUser',JSON.stringify(data.user));
      close(loginModal); window.hideEntryGate?.(); renderStudentArea(data.user); loginForm.reset();
    }catch(err){loginError.textContent=err.message}
  });

  function renderStudentArea(user){
    if(!areaModal||!user)return;
    welcome.textContent=`${user.name} • ${user.username}`;
    areaModal.classList.add('show');
  }
  logout?.addEventListener('click',()=>{
    sessionStorage.removeItem('studentToken');sessionStorage.removeItem('studentUser');close(areaModal);
  });

  try{
    const saved=JSON.parse(sessionStorage.getItem('studentUser')||'null');
    if(saved) renderStudentArea(saved);
  }catch{}
})();






/* ===== ENTRY FLOW — ONE WEBSITE, THREE ACCESS MODES ===== */
(() => {
  const gate = document.getElementById('entryGate');
  const guest = document.getElementById('entryGuest');
  const student = document.getElementById('entryStudent');
  const admin = document.getElementById('entryAdmin');

  const setLocked = (locked) => {
    document.body.classList.toggle('entry-locked', locked);
  };

  const showGate = () => {
    if(!gate) return;
    gate.classList.remove('entry-login-wait');
    gate.setAttribute('aria-hidden','false');
    setLocked(true);
  };

  const hideGate = () => {
    if(!gate) return;
    gate.classList.remove('entry-login-wait');
    gate.setAttribute('aria-hidden','true');
    setLocked(false);
  };

  const openStudent = () => {
    // Website remains visible + blurred behind the login modal.
    gate?.classList.add('entry-login-wait');
    const modal = document.getElementById('studentLoginModal');
    if(modal){
      modal.classList.add('show');
      modal.setAttribute('aria-hidden','false');
      setTimeout(() => document.getElementById('studentUsername')?.focus(), 120);
    }
  };

  const openAdmin = () => {
    // Same visual treatment for Control Panel.
    gate?.classList.add('entry-login-wait');
    if(typeof showAdminLogin === 'function'){
      showAdminLogin();
    } else {
      const modal = document.getElementById('adminLoginModal');
      if(modal){
        modal.classList.add('show');
        modal.setAttribute('aria-hidden','false');
        setTimeout(() => document.getElementById('adminUsername')?.focus(), 120);
      }
    }
  };

  guest?.addEventListener('click', () => {
    localStorage.setItem('xi_tkj1_entry_mode','guest');
    hideGate();
  });

  student?.addEventListener('click', openStudent);
  admin?.addEventListener('click', openAdmin);

  // First visit always starts at the chooser.
  showGate();

  window.showEntryGate = showGate;
  window.hideEntryGate = hideGate;
  window.openEntryGate = showGate;
})();
