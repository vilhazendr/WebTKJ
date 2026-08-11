const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT,'data');
const DB_FILE = path.join(DATA_DIR,'db.json');
const ADMIN_FILE = path.join(DATA_DIR,'admin.json');
const sessions = new Map();
const seedStudents = [
  ["Ach. Yudi","L"],["Alfi R. F.","L"],["Alvino Adityas","L"],["Alya Nur Fadilah","P"],["Aringga Rheza","L"],
  ["Aurellia Siva A.","P"],["Azkya Viorentina F.","P"],["Cika Ul Umha","P"],["Desvita Ayu S.","P"],["Dina Oktaviana","P"],
  ["Elis Nurdiyana P.","P"],["Enisa Vita Agustin","P"],["Feriska Aulia M.","P"],["Fita Dwi A.","P"],["Ines Afina R.","P"],
  ["Irfan Wahyu Prasetyo","L"],["Kharizma Aiya A.","P"],["Kirania Putri S.","P"],["Lucky Akbar Al F.","L"],["Marsha Aufa Nur S.","P"],
  ["Miftakhul Huda","L"],["Moh. Dzul Fiqri Albaqi B.","L"],["M. Indra S. P.","L"],["M. Farhan Daffa","L"],["M. Ezar Maulana M.","L"],
  ["M. Imam V.","L"],["Naila Naswa D.","P"],["Neneng Anjarwati","P"],["Noval Dwi Alvino","L"],["Nurissadiyah Ika F.","P"],
  ["Putri Ridia Artika S.","P"],["Reyhana Zema Z.","P"],["Risma Fitri Amelia","P"],["Savira Aulia Dias A.","P"],["Shela Febriyanti","P"],["Vega Aulia Renata","P"]
];
function makeUsername(name, i){
  let base=name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'.').replace(/^\.+|\.+$/g,'');
  return `${base}.${String(i+1).padStart(2,'0')}`;
}
function seedStudentAccounts(){
  const db=readDB();
  if(!Array.isArray(db.students)) db.students=[];
  const existing=new Map(db.students.map(x=>[x.name,x]));
  let changed=false;
  seedStudents.forEach(([name,gender],i)=>{
    if(!existing.has(name)){
      const username=makeUsername(name,i);
      const salt=crypto.randomBytes(16).toString('hex');
      const password=`TKJ1-${String(i+1).padStart(2,'0')}-2026`;
      db.students.push({id:`stu-${i+1}`,name,gender,username,salt,hash:hashPassword(password,salt),mustChangePassword:true});
      changed=true;
    }
  });
  if(changed) writeDB(db);
}


const seedMaterials = [
  {id:'linux-command',cat:'linux',tag:'Linux',icon:'🐧',title:'Linux Command Dasar',desc:'Perintah penting untuk navigasi file, membuat folder, menyalin, memindahkan, dan menghapus file.',content:'Linux menggunakan terminal sebagai salah satu cara utama mengelola sistem.\n\nPerintah penting:\nls — melihat isi direktori\ncd — berpindah direktori\npwd — melihat lokasi direktori saat ini\nmkdir — membuat direktori\ntouch — membuat file kosong\ncp — menyalin file\nmv — memindahkan atau mengganti nama\nrm — menghapus file\ncat — membaca isi file\n\nContoh:\ncd /var/www\nmkdir project\ncd project\ntouch index.html\nls -la'},
  {id:'linux-permission',cat:'linux',tag:'Linux',icon:'🔐',title:'Linux Permission & chmod',desc:'Memahami owner, group, permission rwx, chmod, chown, dan keamanan file.',content:'r = read, w = write, x = execute.\n\nContoh:\nchmod 755 script.sh\n\n755 berarti owner rwx, group r-x, dan user lain r-x.\n\nPerintah terkait:\nls -l\nchmod 644 file.txt\nchown user:group file.txt\n\nHindari chmod 777 untuk file penting.'},
  {id:'linux-package',cat:'linux',tag:'Linux',icon:'📦',title:'Package Management',desc:'Mengelola aplikasi Linux menggunakan package manager seperti apt.',content:'Pada Debian/Ubuntu, package manager yang umum adalah APT.\n\nContoh:\nsudo apt update\nsudo apt upgrade\nsudo apt install nginx\nsudo apt remove nginx\napt search nginx'},
  {id:'linux-systemd',cat:'linux',tag:'Linux',icon:'⚙️',title:'Service & systemctl',desc:'Mengelola service Linux dan melihat status layanan.',content:'systemd digunakan pada banyak distro Linux modern.\n\nPerintah:\nsystemctl status nginx\nsudo systemctl start nginx\nsudo systemctl stop nginx\nsudo systemctl restart nginx\nsudo systemctl enable nginx'},
  {id:'linux-network',cat:'linux',tag:'Linux',icon:'🌐',title:'Networking Linux',desc:'Perintah ip, ping, ss, curl, dan resolusi DNS untuk troubleshooting.',content:'Perintah yang berguna:\nip addr\nip route\nping 8.8.8.8\nss -tulpn\ncurl -I https://example.com\n\nUrutan troubleshooting: interface → IP → route → DNS → aplikasi.'},
  {id:'ipv4-subnet',cat:'network',tag:'Jaringan',icon:'🌐',title:'IPv4 & Subnetting',desc:'CIDR, subnet mask, network address, broadcast, dan jumlah host.',content:'CIDR menunjukkan jumlah bit network. Contoh /24 = 255.255.255.0.\n\nUntuk /24, total alamat adalah 256 dan pada subnet klasik tersedia 254 host usable.\n\nNetwork address = alamat awal subnet.\nBroadcast = alamat terakhir subnet.'},
  {id:'routing-basic',cat:'network',tag:'Jaringan',icon:'📡',title:'Routing Dasar',desc:'Static route, default route, gateway, dan tabel routing.',content:'Routing menentukan ke mana paket harus dikirim.\n\nGateway = router tujuan berikutnya.\nDefault route = jalur ketika tidak ada route lebih spesifik.\nStatic route = route yang dikonfigurasi manual.'},
  {id:'dhcp-dns',cat:'network',tag:'Jaringan',icon:'📶',title:'DHCP & DNS',desc:'Memahami pembagian IP otomatis dan penerjemahan nama domain.',content:'DHCP memberikan IP address, subnet mask, gateway, dan DNS secara otomatis.\n\nDNS menerjemahkan nama seperti example.com menjadi alamat IP.'},
  {id:'vlan',cat:'network',tag:'Jaringan',icon:'🔀',title:'VLAN & Trunk',desc:'Membagi jaringan secara logis dan membawa beberapa VLAN melalui satu link.',content:'VLAN memisahkan broadcast domain secara logis. Access port umumnya membawa satu VLAN, sedangkan trunk dapat membawa beberapa VLAN menggunakan tagging.'},
  {id:'html-basic',cat:'coding',tag:'Coding',icon:'💻',title:'HTML Dasar',desc:'Struktur dokumen HTML, semantic tags, link, image, dan form.',content:'HTML membentuk struktur halaman.\n\nGunakan elemen semantik seperti header, nav, main, section, article, dan footer.'},
  {id:'css-basic',cat:'coding',tag:'Coding',icon:'🎨',title:'CSS Dasar',desc:'Selector, box model, flexbox, grid, responsive design, dan variables.',content:'CSS mengatur tampilan halaman.\n\nKonsep penting: selector, specificity, box model, flexbox, grid, media query, dan CSS variables.'},
  {id:'js-basic',cat:'coding',tag:'Coding',icon:'⚡',title:'JavaScript Dasar',desc:'Variable, function, DOM, event, array, object, fetch, dan localStorage.',content:'JavaScript membuat halaman interaktif.\n\nContoh:\nconst button = document.querySelector("button");\nbutton.addEventListener("click", () => alert("Halo XI TKJ 1"));'},
  {id:'git-basic',cat:'coding',tag:'Coding',icon:'🌿',title:'Git Dasar',desc:'Repository, commit, branch, pull, push, dan clone.',content:'Alur dasar:\ngit clone URL\ngit status\ngit add .\ngit commit -m "update"\ngit push'},
  {id:'web-security',cat:'security',tag:'Security',icon:'🛡️',title:'Web Security Dasar',desc:'XSS, CSRF, HTTPS, validasi input, dan keamanan password.',content:'Keamanan web dimulai dari validasi input dan prinsip least privilege. XSS berkaitan dengan input tidak tepercaya yang masuk ke HTML/JS. HTTPS melindungi data saat transit.'},
  {id:'auth-security',cat:'security',tag:'Security',icon:'🔑',title:'Authentication & Session',desc:'Konsep login, password hashing, session token, dan logout.',content:'Backend sebaiknya menyimpan password sebagai hash menggunakan scrypt, bcrypt, atau Argon2. Setelah login berhasil, server memberikan session/token.'},
  {id:'sql-basic',cat:'database',tag:'Database',icon:'🗄️',title:'SQL Dasar',desc:'SELECT, INSERT, UPDATE, DELETE, WHERE, ORDER BY, dan JOIN.',content:'SQL digunakan untuk mengelola data relasional.\n\nContoh:\nSELECT * FROM students;\nSELECT * FROM tasks WHERE status = \'todo\';\n\nGunakan parameterized query pada backend.'},
  {id:'api-basic',cat:'database',tag:'Backend',icon:'🔌',title:'REST API Dasar',desc:'Konsep endpoint, GET, POST, PUT/PATCH, DELETE, JSON, dan status code.',content:'GET /api/materials → mengambil materi\nPOST /api/materials → menambah materi\nDELETE /api/materials/:id → menghapus materi\n\nStatus umum: 200, 201, 400, 401, 404, 500.'}
];

function ensureData(){
  fs.mkdirSync(DATA_DIR,{recursive:true});
  if(!fs.existsSync(DB_FILE))fs.writeFileSync(DB_FILE,JSON.stringify({materials:seedMaterials,tasks:[],announcements:[],files:[],students:[]},null,2));
  if(!fs.existsSync(ADMIN_FILE))fs.writeFileSync(ADMIN_FILE,JSON.stringify({username:'kinkndra',salt:'0d8028c06de46c1e72081accbc56f886',hash:'bc792527e03b88df3d76bf54cdfdf6f726eb428cc8ec1993c97b52b2285e2b5b7773d68b459402aebff2007b92d23b255cb8ed0ca8c59cd9a926ef18f0069976'},null,2));
}
function readDB(){ensureData();return JSON.parse(fs.readFileSync(DB_FILE,'utf8'))}
function writeDB(db){fs.writeFileSync(DB_FILE,JSON.stringify(db,null,2))}
function readAdmin(){ensureData();return JSON.parse(fs.readFileSync(ADMIN_FILE,'utf8'))}
function hashPassword(password,salt){return crypto.scryptSync(password,salt,64).toString('hex')}
function send(res,status,data,headers={}){const body=typeof data==='string'?data:JSON.stringify(data);res.writeHead(status,{'Content-Type':typeof data==='string'?'text/plain; charset=utf-8':'application/json; charset=utf-8','Cache-Control':'no-store',...headers});res.end(body)}
function auth(req,res){const token=(req.headers.authorization||'').replace(/^Bearer\s+/,'');return token&&sessions.has(token)}
function body(req){return new Promise((resolve,reject)=>{let d='';req.on('data',c=>{d+=c;if(d.length>1e6)req.destroy()});req.on('end',()=>{try{resolve(d?JSON.parse(d):{})}catch(e){reject(e)}});req.on('error',reject)})}
function safePath(p){const clean=String(p||'/').replace(/^\/+/, '');const resolved=path.resolve(ROOT,clean);return resolved===ROOT||resolved.startsWith(ROOT+path.sep)?resolved:null}

ensureData();
seedStudentAccounts();
const server=http.createServer(async(req,res)=>{
  try{
    const parsed=url.parse(req.url,true); const pathname=decodeURIComponent(parsed.pathname||'/');
    if(pathname==='/api/health')return send(res,200,{ok:true,name:'XI TKJ 1 Backend',time:new Date().toISOString()});
    if(pathname==='/api/auth/login'&&req.method==='POST'){
      const b=await body(req),admin=readAdmin();const expected=Buffer.from(admin.hash,'hex'),actual=Buffer.from(hashPassword(String(b.password||''),admin.salt),'hex');
      if(b.username!==admin.username||expected.length!==actual.length||!crypto.timingSafeEqual(expected,actual))return send(res,401,{error:'Username atau password salah.'});
      const token=crypto.randomBytes(32).toString('hex');sessions.set(token,{username:admin.username,createdAt:Date.now()});return send(res,200,{ok:true,token,user:{username:admin.username}});
    }
    if(pathname==='/api/auth/logout'&&req.method==='POST'){if(auth(req,res)){sessions.delete((req.headers.authorization||'').replace(/^Bearer\s+/,''));return send(res,200,{ok:true})}return send(res,401,{error:'Unauthorized'})}
    if(pathname==='/api/auth/me'&&req.method==='GET')return auth(req,res)?send(res,200,{ok:true}):send(res,401,{error:'Unauthorized'});

    if(pathname==='/api/student/login'&&req.method==='POST'){
      const b=await body(req),db=readDB(),student=(db.students||[]).find(x=>x.username===String(b.username||'').trim().toLowerCase());
      if(!student)return send(res,401,{error:'Username siswa tidak ditemukan.'});
      const actual=Buffer.from(hashPassword(String(b.password||''),student.salt),'hex'),expected=Buffer.from(student.hash,'hex');
      if(actual.length!==expected.length||!crypto.timingSafeEqual(actual,expected))return send(res,401,{error:'Password salah.'});
      const token=crypto.randomBytes(32).toString('hex');sessions.set(token,{role:'student',studentId:student.id,username:student.username,createdAt:Date.now()});
      return send(res,200,{ok:true,token,user:{id:student.id,name:student.name,username:student.username,gender:student.gender,mustChangePassword:!!student.mustChangePassword}});
    }
    if(pathname==='/api/student/me'&&req.method==='GET'){
      const token=(req.headers.authorization||'').replace(/^Bearer\s+/,'');const sess=sessions.get(token);
      if(!sess||sess.role!=='student')return send(res,401,{error:'Unauthorized'});
      const db=readDB(),student=(db.students||[]).find(x=>x.id===sess.studentId);
      if(!student)return send(res,404,{error:'Akun siswa tidak ditemukan.'});
      return send(res,200,{ok:true,user:{id:student.id,name:student.name,username:student.username,gender:student.gender,mustChangePassword:!!student.mustChangePassword}});
    }
    if(pathname==='/api/admin/students'&&req.method==='GET'){
      if(!auth(req,res))return send(res,401,{error:'Unauthorized'});
      const db=readDB();
      return send(res,200,{items:(db.students||[]).map(x=>({id:x.id,name:x.name,gender:x.gender,username:x.username,mustChangePassword:!!x.mustChangePassword}))});
    }
    if(pathname==='/api/admin/students/reset'&&req.method==='POST'){
      if(!auth(req,res))return send(res,401,{error:'Unauthorized'});
      const b=await body(req),db=readDB(),student=(db.students||[]).find(x=>x.id===b.id);
      if(!student)return send(res,404,{error:'Siswa tidak ditemukan.'});
      const password=`TKJ1-${String((db.students.indexOf(student)+1)).padStart(2,'0')}-2026`,salt=crypto.randomBytes(16).toString('hex');
      student.salt=salt;student.hash=hashPassword(password,salt);student.mustChangePassword=true;writeDB(db);
      return send(res,200,{ok:true,username:student.username,password});
    }

    if(pathname==='/api/materials'&&req.method==='GET'){
      let rows=readDB().materials||[];const q=String(parsed.query.q||'').toLowerCase(),cat=String(parsed.query.category||'all');if(cat!=='all')rows=rows.filter(x=>x.cat===cat);if(q)rows=rows.filter(x=>`${x.title} ${x.desc} ${x.tag} ${x.content}`.toLowerCase().includes(q));return send(res,200,{items:rows});
    }
    if(pathname.startsWith('/api/materials/')){
      const id=pathname.split('/').pop(),db=readDB(),idx=db.materials.findIndex(x=>x.id===id);
      if(req.method==='GET'){if(idx<0)return send(res,404,{error:'Materi tidak ditemukan'});return send(res,200,db.materials[idx])}
      if(!auth(req,res))return send(res,401,{error:'Unauthorized'});
      if(idx<0)return send(res,404,{error:'Materi tidak ditemukan'});
      if(req.method==='DELETE'){db.materials.splice(idx,1);writeDB(db);return send(res,200,{ok:true})}
      if(req.method==='PUT'){const b=await body(req);db.materials[idx]={...db.materials[idx],...b,id};writeDB(db);return send(res,200,db.materials[idx])}
    }
    if(pathname==='/api/materials'&&req.method==='POST'){
      if(!auth(req,res))return send(res,401,{error:'Unauthorized'});const b=await body(req);if(!b.title||!b.content)return send(res,400,{error:'Judul dan isi materi wajib diisi.'});const db=readDB();const row={id:`m-${Date.now()}`,title:String(b.title),cat:String(b.cat||'linux'),tag:String(b.tag||b.cat||'Linux'),icon:String(b.icon||'📘'),desc:String(b.desc||''),content:String(b.content),createdAt:new Date().toISOString()};db.materials.unshift(row);writeDB(db);return send(res,201,row);
    }
    if(pathname==='/api/admin/stats'&&req.method==='GET'){if(!auth(req,res))return send(res,401,{error:'Unauthorized'});const db=readDB();return send(res,200,{students:36,materials:db.materials.length,tasks:db.tasks.length,announcements:db.announcements.length})}
    if(pathname.startsWith('/api/'))return send(res,404,{error:'API endpoint tidak ditemukan'});

    let filePath=pathname==='/'?path.join(ROOT,'index.html'):safePath(pathname);
    if(!filePath)return send(res,403,'Forbidden');
    if(!fs.existsSync(filePath)||fs.statSync(filePath).isDirectory())filePath=path.join(ROOT,'index.html');
    const ext=path.extname(filePath).toLowerCase();const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8'};
    res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream'});fs.createReadStream(filePath).pipe(res);
  }catch(e){console.error(e);send(res,500,{error:'Server error',detail:e.message})}
});
server.listen(PORT,()=>console.log(`XI TKJ 1 backend: http://localhost:${PORT}`));
