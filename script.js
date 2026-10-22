const tracks = [
 {title:"Midnight City",artist:"M83",emoji:"🌃",colors:["#172a74","#21a9af"],audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"},
 {title:"Golden Hour",artist:"JVKE",emoji:"🌅",colors:["#f7971e","#ffd200"],audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"},
 {title:"Ocean Eyes",artist:"Billie Eilish",emoji:"🌊",colors:["#005c97","#363795"],audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"},
 {title:"Dreamscape",artist:"Chill Collective",emoji:"🌌",colors:["#41295a","#2f0743"],audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"},
 {title:"Sunday Best",artist:"Surfaces",emoji:"☀️",colors:["#56ab2f","#a8e063"],audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"},
 {title:"Neon Dreams",artist:"Synthwave Radio",emoji:"🌈",colors:["#ee0979","#ff6a00"],audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"},
 {title:"Coffee & Rain",artist:"Lo-Fi Beats",emoji:"☕",colors:["#603813","#b29f94"],audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"},
 {title:"Mountain Air",artist:"The Wilds",emoji:"🏔️",colors:["#134e5e","#71b280"],audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"},
 {title:"Electric Bloom",artist:"Nova",emoji:"🌺",colors:["#7b4397","#dc2430"],audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"},
 {title:"Blue Skies",artist:"Daydream",emoji:"🦋",colors:["#2980b9","#6dd5fa"],audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"}
];
const artists=[{title:"The Weeknd",artist:"Artist",emoji:"🎤",colors:["#232526","#414345"]},{title:"Taylor Swift",artist:"Artist",emoji:"✨",colors:["#42275a","#734b6d"]},{title:"Arijit Singh",artist:"Artist",emoji:"🎙️",colors:["#141e30","#243b55"]},{title:"Dua Lipa",artist:"Artist",emoji:"💫",colors:["#c31432","#240b36"]},{title:"A. R. Rahman",artist:"Artist",emoji:"🎼",colors:["#11998e","#38ef7d"]}];
const audio=document.getElementById('audio'); let current=-1, playing=false, liked=new Set(), shuffle=false, repeat=false;
const $=id=>document.getElementById(id);
function artStyle(item){return `background:linear-gradient(135deg,${item.colors[0]},${item.colors[1]})`}
function card(item,index,isArtist=false){return `<article class="music-card" data-index="${index}" data-artist="${isArtist}"><div class="cover" style="${artStyle(item)}">${item.emoji}<span class="play-overlay">▶</span></div><h3>${item.title}</h3><p>${isArtist?'Artist':item.artist==='Artist'?'Artist':`Playlist · ${item.artist}`}</p></article>`}
function render(){
 $('quickGrid').innerHTML=tracks.slice(0,6).map((t,i)=>`<div class="quick-tile" data-index="${i}"><div class="tile-art" style="${artStyle(t)}">${t.emoji}</div>${t.title}</div>`).join('');
 $('madeForYou').innerHTML=tracks.slice(0,5).map((t,i)=>card(t,i)).join('');
 $('artists').innerHTML=artists.map((a,i)=>card(a,i,true)).join('');
 $('browseGrid').innerHTML=tracks.map((t,i)=>card(t,i)).join('');
}
function toast(msg){$('toast').textContent=msg;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),2200)}
function choose(index,autoplay=true){current=(index+tracks.length)%tracks.length;const t=tracks[current];audio.src=t.audio;$('nowTitle').textContent=t.title;$('nowArtist').textContent=t.artist;$('miniCover').textContent=t.emoji;$('miniCover').style=artStyle(t);$('likeBtn').textContent=liked.has(current)?'♥':'♡';$('seek').value=0;$('elapsed').textContent='0:00';$('duration').textContent='0:00';if(autoplay)play()}
function play(){if(current<0)choose(0,false);audio.play().then(()=>{playing=true;$('playBtn').textContent='❚❚'}).catch(()=>{playing=false;$('playBtn').textContent='▶';toast('Press play again if audio is blocked by your browser.')})}
function togglePlay(){if(playing){audio.pause();playing=false;$('playBtn').textContent='▶'}else play()}
function next(){choose(shuffle?Math.floor(Math.random()*tracks.length):(current+1)%tracks.length)}
function fmt(s){if(!Number.isFinite(s))return'0:00';return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0')}
document.addEventListener('click',e=>{const cardEl=e.target.closest('[data-index]');if(cardEl){if(cardEl.dataset.artist==='true'){toast('Artist pages are a demo feature.');return}choose(Number(cardEl.dataset.index));}});
$('playBtn').onclick=togglePlay;$('nextBtn').onclick=next;$('prevBtn').onclick=()=>{if(audio.currentTime>3)audio.currentTime=0;else choose((current-1+tracks.length)%tracks.length)};
$('shuffleBtn').onclick=()=>{shuffle=!shuffle;$('shuffleBtn').style.color=shuffle?'#1ed760':'#b3b3b3';toast(shuffle?'Shuffle on':'Shuffle off')};
$('repeatBtn').onclick=()=>{repeat=!repeat;audio.loop=repeat;$('repeatBtn').style.color=repeat?'#1ed760':'#b3b3b3';toast(repeat?'Repeat on':'Repeat off')};
$('likeBtn').onclick=()=>{if(current<0){toast('Choose a song first');return}if(liked.has(current))liked.delete(current);else liked.add(current);$('likeBtn').textContent=liked.has(current)?'♥':'♡';toast(liked.has(current)?'Added to Liked Songs':'Removed from Liked Songs')};
$('volume').oninput=e=>audio.volume=Number(e.target.value);audio.volume=.7;
audio.addEventListener('timeupdate',()=>{if(Number.isFinite(audio.duration)&&audio.duration){$('seek').value=audio.currentTime/audio.duration*100;$('elapsed').textContent=fmt(audio.currentTime);$('duration').textContent=fmt(audio.duration)}});
$('seek').oninput=e=>{if(audio.duration)audio.currentTime=Number(e.target.value)/100*audio.duration};
audio.addEventListener('ended',()=>{if(!repeat)next()});
$('searchInput').addEventListener('input',e=>{const q=e.target.value.toLowerCase();$('browseGrid').innerHTML=tracks.map((t,i)=>({t,i})).filter(x=>(x.t.title+' '+x.t.artist).toLowerCase().includes(q)).map(x=>card(x.t,x.i)).join('');});
$('createPlaylist').onclick=()=>toast('Playlist created! (demo only)');$('addPlaylist').onclick=()=>toast('Playlist created! (demo only)');$('browsePodcasts').onclick=()=>toast('Podcast browsing is coming soon.');$('premiumBtn').onclick=()=>toast('This is a student demo, not the official Spotify service.');$('installBtn').onclick=()=>toast('Open index.html in your browser to use the app.');
render();
