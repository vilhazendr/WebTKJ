// =============================
// KYOU WEB MUSIC — YOUTUBE CONFIG
// =============================
// Tempel API key milikmu di antara tanda kutip di bawah.
// Contoh: const YOUTUBE_API_KEY = "AIza...";
// Jangan membagikan API key ke orang lain.
const YOUTUBE_API_KEY = "AIzaSyDCW60S_2aSNxzxa8ZG_h5K5MQ1KJUihaE";

const $=id=>document.getElementById(id);
const STORE="kyou_web_music_v1";
const defaultSongs = [];
let state=loadState();
let player=null,ytReady=false,current=null,queue=[],queueIndex=-1,repeat=false,shuffle=false,searchTimer=null;

function loadState(){try{return Object.assign({likes:[],history:[],playlists:{},apiKey:"",autoplay:true,saveHistory:true},JSON.parse(localStorage.getItem(STORE)||"{}"))}catch(e){return {likes:[],history:[],playlists:{},apiKey:"",autoplay:true,saveHistory:true}}}
function save(){localStorage.setItem(STORE,JSON.stringify(state))}
function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function img(s){return s.thumb||`https://i.ytimg.com/vi/${encodeURIComponent(s.id)}/hqdefault.jpg`}
function toast(t){$("toast").textContent=t;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2200)}
function fmt(x){x=Math.max(0,Math.floor(x||0));return Math.floor(x/60)+":"+String(x%60).padStart(2,"0")}
function renderHome(){
 const history=state.history.map(id=>findSong(id)).filter(Boolean);
 $("content").innerHTML=`<div class="hero"><h1>${history.length ? "Good evening" : "Welcome to Kyou Web Music"}</h1>
 ${history.length ? `<div class="quick-grid">${history.slice(0,4).map(s=>`<button class="quick-card" data-play="${esc(s.id)}"><img src="${img(s)}"><span>${esc(s.title)}</span></button>`).join("")}</div>` : `<div class="empty hero-empty">🔎<br><b>Search for your music</b><br><span>Ketik judul lagu atau nama DJ di kotak pencarian untuk mulai.</span></div>`}</div>
 ${history.length ? `<div class="section-head"><h2>Recently played</h2></div><div class="track-list">${history.map(track).join("")}</div>` : ""}`;
 bindPlay();
}
function card(s){return `<div class="card"><div class="cover-wrap"><img class="cover" src="${img(s)}"><button class="cover-play" data-play="${esc(s.id)}">▶</button></div><div class="card-title">${esc(s.title)}</div><div class="card-sub">${esc(s.artist)}</div></div>`}
function track(s,i){return `<div class="track"><div class="track-num">${i==null?"":i+1}</div><img src="${img(s)}"><div class="track-info"><b>${esc(s.title)}</b><span>${esc(s.artist)}</span></div><button class="track-play" data-play="${esc(s.id)}">▶</button></div>`}
function bindPlay(){document.querySelectorAll("[data-play]").forEach(b=>b.onclick=()=>{let s=findSong(b.dataset.play)||{id:b.dataset.play,title:"YouTube song",artist:"YouTube",thumb:`https://i.ytimg.com/vi/${b.dataset.play}/hqdefault.jpg`};playSong(s)})}
function findSong(id){return defaultSongs.find(s=>s.id===id)||queue.find(s=>s.id===id)}
function renderLibrary(){
 const likes=state.likes.map(id=>findSong(id)).filter(Boolean);
 $("content").innerHTML=`<div class="hero"><h1>Your Library</h1></div><div class="section-head"><h2>Liked Songs</h2></div>${likes.length?`<div class="track-list">${likes.map(track).join("")}</div>`:`<div class="empty">Belum ada lagu yang disukai.<br>Tekan ♡ pada lagu yang sedang diputar.</div>`}`;
 bindPlay();
}
function renderSearch(q=""){
 if(!q){$("content").innerHTML=`<div class="search-page"><h1>Search</h1><div class="empty">Cari lagu, artis, atau album YouTube.</div></div>`;return}
 $("content").innerHTML=`<div class="search-page"><h1>Search results for “${esc(q)}”</h1><div id="results"><div class="empty">Searching YouTube...</div></div></div>`;
 youtubeSearch(q);
}
async function youtubeSearch(q){
 const key=YOUTUBE_API_KEY.trim() || state.apiKey;
 if(!key){$("results").innerHTML=`<div class="empty">YouTube API Key belum dipasang.<br><br><button class="green-btn" style="max-width:260px" onclick="openSettings()">Open Settings</button><p class="muted">Tambahkan YouTube Data API v3 key agar hasil pencarian tampil di sini.</p></div>`;return}
 try{
  const u=`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&q=${encodeURIComponent(q)}&key=${encodeURIComponent(key)}`;
  const r=await fetch(u); const data=await r.json();
  if(!r.ok||data.error) throw new Error(data.error?.message||"Request gagal");
  const songs=(data.items||[]).filter(x=>x.id?.videoId).map(x=>({id:x.id.videoId,title:x.snippet.title,artist:x.snippet.channelTitle,album:"YouTube",thumb:x.snippet.thumbnails?.high?.url||x.snippet.thumbnails?.medium?.url}));
  queue=songs; queueIndex=-1;
  $("results").innerHTML=songs.length?`<div class="result-source">YouTube • ${songs.length} results</div><div class="track-list">${songs.map((s,i)=>track(s,i)).join("")}</div>`:`<div class="empty">Tidak ada hasil.</div>`;
  bindPlay();
 }catch(e){$("results").innerHTML=`<div class="empty">Gagal mencari YouTube.<br><small>${esc(e.message)}</small><br><br>Pastikan API key benar dan YouTube Data API v3 aktif.</div>`}
}
function onYouTubeIframeAPIReady(){ytReady=true;player=new YT.Player("ytPlayer",{height:"1",width:"1",videoId:"",playerVars:{playsinline:1,controls:0,rel:0},events:{onReady:onPlayerReady,onStateChange:onStateChange,onError:onPlayerError}})}
function onPlayerReady(){player.setVolume(Number($("volume").value))}
function onStateChange(e){
 if(!player)return;
 if(e.data===YT.PlayerState.PLAYING){$("playBtn").textContent="Ⅱ";updateTime()}
 if(e.data===YT.PlayerState.PAUSED){$("playBtn").textContent="▶"}
 if(e.data===YT.PlayerState.ENDED){if(repeat){player.seekTo(0,true);player.playVideo()}else nextSong()}
}
function onPlayerError(){toast("Video YouTube tidak bisa diputar. Coba lagu lain.")}
function updateTime(){
 if(!player||!player.getDuration)return;
 const d=player.getDuration()||0,c=player.getCurrentTime()||0;
 $("duration").textContent=fmt(d);$("currentTime").textContent=fmt(c);
 $("progress").value=d?c/d*100:0;
 if(player.getPlayerState()===YT.PlayerState.PLAYING)requestAnimationFrame(updateTime);
}
function playSong(s){
 current=s;
 if(!queue.length||!queue.some(x=>x.id===s.id)){queue=[s,...queue.filter(x=>x.id!==s.id)];queueIndex=0}else queueIndex=queue.findIndex(x=>x.id===s.id);
 $("nowArt").src=img(s);$("nowTitle").textContent=s.title;$("nowArtist").textContent=s.artist;
 $("npArt").src=img(s);$("npTitle").textContent=s.title;$("npArtist").textContent=s.artist;
 $("likeNow").textContent=state.likes.includes(s.id)?"♥":"♡";$("likeNow").classList.toggle("liked",state.likes.includes(s.id));
 $("npLike").textContent=state.likes.includes(s.id)?"♥":"♡";$("npLike").classList.toggle("liked",state.likes.includes(s.id));
 renderNowQueue();
 if(state.saveHistory){state.history=[s.id,...state.history.filter(x=>x!==s.id)].slice(0,50);save()}
 if(ytReady&&player&&player.loadVideoById){player.loadVideoById(s.id);player.playVideo()}else toast("YouTube player masih loading...");
}
function nextSong(){
 if(!queue.length)return;
 if(shuffle)queueIndex=Math.floor(Math.random()*queue.length);else queueIndex=(queueIndex+1)%queue.length;
 playSong(queue[queueIndex]);
}
function prevSong(){if(player&&player.getCurrentTime()>4){player.seekTo(0,true);return}if(!queue.length)return;queueIndex=(queueIndex-1+queue.length)%queue.length;playSong(queue[queueIndex])}
function openSettings(){$("apiKeyInput").value=state.apiKey||"";$("autoplaySetting").checked=state.autoplay;$("saveHistorySetting").checked=state.saveHistory;$("settingsModal").classList.remove("hidden")}
function closeModals(){document.querySelectorAll(".modal").forEach(x=>x.classList.add("hidden"))}
function renderPlaylists(){$("playlistList").innerHTML=Object.keys(state.playlists).map(n=>`<button class="playlist-side" data-pl="${esc(n)}">♫ ${esc(n)}</button>`).join("");document.querySelectorAll("[data-pl]").forEach(b=>b.onclick=()=>renderPlaylist(b.dataset.pl))}
function renderPlaylist(name){const songs=(state.playlists[name]||[]).map(id=>findSong(id)).filter(Boolean);$("content").innerHTML=`<div class="hero"><h1>♫ ${esc(name)}</h1></div>${songs.length?`<div class="track-list">${songs.map(track).join("")}</div>`:`<div class="empty">Playlist masih kosong.</div>`}`;bindPlay()}
function renderNowQueue(){
 const list=queue.filter(s=>!current||s.id!==current.id).slice(0,8);
 $("npQueue").innerHTML=list.length?list.map(s=>`<button class="np-q" style="width:100%;text-align:left" data-npq="${esc(s.id)}"><img src="${img(s)}"><div><b>${esc(s.title)}</b><span>${esc(s.artist)}</span></div></button>`).join(""):`<div class="muted">Queue kosong</div>`;
 document.querySelectorAll("[data-npq]").forEach(b=>b.onclick=()=>{const s=findSong(b.dataset.npq);if(s)playSong(s)});
}
function toggleNowPlaying(){ $("nowPlayingPanel").classList.toggle("open"); if(current)renderNowQueue(); }
function init(){
 renderHome();renderPlaylists();
 document.querySelectorAll(".nav-item[data-view]").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));b.classList.add("active");if(b.dataset.view==="home")renderHome();if(b.dataset.view==="library")renderLibrary();if(b.dataset.view==="search"){ $("searchInput").focus();renderSearch($("searchInput").value)}})
 $("searchInput").addEventListener("input",()=>{clearTimeout(searchTimer);const q=$("searchInput").value.trim();if(q){document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));searchTimer=setTimeout(()=>renderSearch(q),500)}else renderHome()})
 $("clearSearch").onclick=()=>{$("searchInput").value="";renderHome()}
 $("playBtn").onclick=()=>{if(!player||!current)return toast("Pilih lagu dulu");const st=player.getPlayerState();st===YT.PlayerState.PLAYING?player.pauseVideo():player.playVideo()}
 $("nextBtn").onclick=nextSong;$("prevBtn").onclick=prevSong;
 $("shuffleBtn").onclick=()=>{shuffle=!shuffle;$("shuffleBtn").classList.toggle("liked",shuffle);toast(shuffle?"Shuffle on":"Shuffle off")}
 $("repeatBtn").onclick=()=>{repeat=!repeat;$("repeatBtn").classList.toggle("liked",repeat);toast(repeat?"Repeat on":"Repeat off")}
 $("likeNow").onclick=()=>{if(!current)return;if(state.likes.includes(current.id))state.likes=state.likes.filter(x=>x!==current.id);else state.likes.push(current.id);save();$("likeNow").textContent=state.likes.includes(current.id)?"♥":"♡";$("likeNow").classList.toggle("liked",state.likes.includes(current.id))}
 $("progress").oninput=()=>{if(player&&player.getDuration)player.seekTo((Number($("progress").value)/100)*player.getDuration(),true)}
 $("volume").oninput=()=>{if(player&&player.setVolume)player.setVolume(Number($("volume").value))}
 $("settingsBtn").onclick=openSettings;
 $("newPlaylistBtn").onclick=()=>$("playlistModal").classList.remove("hidden");
 $("createPlaylist").onclick=()=>{const n=$("playlistName").value.trim();if(!n)return;if(!state.playlists[n])state.playlists[n]=[];save();renderPlaylists();$("playlistName").value="";closeModals();toast("Playlist dibuat")}
 $("saveApiKey").onclick=()=>{state.apiKey=$("apiKeyInput").value.trim();state.autoplay=$("autoplaySetting").checked;state.saveHistory=$("saveHistorySetting").checked;save();closeModals();toast("Settings saved")}
 $("clearData").onclick=()=>{if(confirm("Hapus semua data lokal?")){localStorage.removeItem(STORE);location.reload()}}
 $("queueBtn").onclick=()=>{$("queueList").innerHTML=queue.length?queue.map((s,i)=>`<button class="queue-item" style="width:100%;text-align:left" data-q="${esc(s.id)}"><img src="${img(s)}"><div><b>${esc(s.title)}</b><span>${esc(s.artist)}</span></div></button>`).join(""):`<div class="empty">Queue kosong.</div>`;$("queueModal").classList.remove("hidden");document.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{const s=findSong(b.dataset.q);if(s){closeModals();playSong(s)}})}
 document.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeModals);
 $("queueBtn").onclick=toggleNowPlaying;
 $("mobilePlayer").onclick=toggleNowPlaying;
 $("closeNowPlaying").onclick=()=>$("nowPlayingPanel").classList.remove("open");
 $("npPlay").onclick=()=>$("playBtn").click();
 $("npPrev").onclick=prevSong;
 $("npNext").onclick=nextSong;
 $("npLike").onclick=()=>$("likeNow").click();
 document.querySelectorAll(".mobile-nav [data-view]").forEach(b=>b.onclick=()=>{
   const v=b.dataset.view;
   document.querySelectorAll(".nav-item[data-view]").forEach(x=>x.classList.toggle("active",x.dataset.view===v));
   if(v==="home")renderHome(); if(v==="library")renderLibrary(); if(v==="search"){ $("searchInput").focus(); renderSearch($("searchInput").value); }
 });
 $("profileBtn").onclick=()=>toast("Guest mode • data tersimpan di perangkat");
}
window.openSettings=openSettings;
window.onYouTubeIframeAPIReady=onYouTubeIframeAPIReady;
document.addEventListener("DOMContentLoaded",init);
