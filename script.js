

// DOM references
const form = document.getElementById('orderForm');
const cravingInput = document.getElementById('craving');
const bar = document.getElementById('bar');
const label = document.getElementById('progressLabel');
const logs = document.getElementById('logs');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const wifi = document.getElementById('wifi');
const countdownEl = document.getElementById('countdown');

// audio file 
const audio = new Audio('./ding.ogg');

// hidden console Easter egg
console.log("%cERROR: Your hunger cannot be satisfied offline.","color:#ff4d6d;font-weight:bold;");


// Countdown timer
(function countdown(){
  const target=new Date('2025-10-20T23:59:00');
  setInterval(()=>{
    const now=new Date(),s=Math.max(0,(target-now)/1000);
    const h=String(Math.floor(s/3600)).padStart(2,'0');
    const m=String(Math.floor((s%3600)/60)).padStart(2,'0');
    const sec=String(Math.floor(s%60)).padStart(2,'0');
    countdownEl.textContent=s>0?`Server shutdown in ${h}:${m}:${sec}`:`Server offline — final meals only`;
  },1000);
})();


// WiFi chaos light
setInterval(()=>{
  const ok=Math.random()>0.12;
  wifi.style.background=ok?'var(--ok)':'var(--danger)';
  wifi.style.boxShadow=ok?'0 0 10px var(--ok)':'0 0 10px var(--danger)';
},1800);


// Debug overlay setup
const debugOverlay=document.createElement('div');
debugOverlay.id='debugOverlay';
debugOverlay.style.cssText=`
  position:fixed;bottom:20px;left:20px;
  background:rgba(255,255,255,0.08);
  border:1px solid rgba(255,255,255,0.2);
  border-radius:12px;
  font-family:"Share Tech Mono", monospace;
  color:#8fff6a;
  padding:10px 14px;
  font-size:13px;
  z-index:1000;
  display:none;
  backdrop-filter:blur(6px);
`;
debugOverlay.innerHTML="🧠 DEBUG: <span id='debugMsg'>Idle</span>";
document.body.appendChild(debugOverlay);

let debugVisible=false;
window.addEventListener('keydown',e=>{
  if(e.key.toLowerCase()==='d'){
    debugVisible=!debugVisible;
    debugOverlay.style.display=debugVisible?'block':'none';
  }
});

function debugPing(msg,color="#8fff6a"){
  if(!debugVisible)return;
  const span=document.getElementById('debugMsg');
  span.textContent=msg;
  debugOverlay.style.color=color;
  debugOverlay.style.transition="color 0.2s";
  setTimeout(()=>span.textContent="Idle",1500);
}

// Logger
function log(line,cls=''){
  const p=document.createElement('p');
  if(cls)p.classList.add(cls);
  p.textContent=line;
  logs.appendChild(p);
  logs.scrollTop=logs.scrollHeight;
}

// Phases
const phases=[
  'Summoning CloudChef…','Compiling calories…','Hydrating noodles…',
  'Installing taste buds…','Infusing emotional stability…',
  'Encrypting umami…','Calibrating spice index…',
  'Uploading aroma particles…','Negotiating with HungerNet…','Almost edible…'
];


// Fake Download Simulation
function fakeDownload(foodName){
  let progress=0,phaseIndex=0;
  logs.innerHTML='';bar.style.width='0%';label.textContent='Connecting…';
  log(`> Request queued: "${foodName}"`,'warn');
  const tick=setInterval(()=>{
    if(Math.random()<0.25&&phaseIndex<phases.length){
      log(phases[phaseIndex++],'ok');
      audio.play().catch(()=>{});
      debugPing('🔊 Phase sound', '#00e6ff');
    }
    progress+=Math.random()*6;
    if(progress>99){clearInterval(tick);finale(foodName);return;}
    bar.style.width=`${progress.toFixed(2)}%`;
    label.textContent=`${Math.floor(progress)}%`;
  },120);
}
// Finale: Spawn Food
function finale(foodName){
  label.textContent='100%';
  bar.style.width='100%';
  log('Taste upload complete!','ok');
  audio.play().catch(()=>{});
  debugPing('✅ Download complete','#8fff6a');
  spawnFood(foodName);
  const payload=generateRecipeFile(foodName);
  triggerDownload(`${slug(foodName)}.txt`,payload);
  modal.classList.remove('hidden');
}


// Spawn food visual (emoji + image)
function spawnFood(foodName){
  const plate=document.createElement('div');
  plate.className='spawned-food';
  const emoji=['🍔','🍕','🍜','🍩','🍣','🍗'];
  const pick=emoji[Math.floor(Math.random()*emoji.length)];
  const img=document.createElement('img');
  const lower=foodName.toLowerCase();

  if(lower.includes('ramen')||lower.includes('emotional')){
    img.src='./spicy-ramen.png';
  } else {
    img.src=`https://source.unsplash.com/300x200/?${encodeURIComponent(foodName)},food`;
  }

  plate.innerHTML=`${pick} ${foodName.toUpperCase()} READY<br>`;
  plate.appendChild(img);
  document.body.appendChild(plate);
  setTimeout(()=>plate.remove(),5000);
}


// Helpers
function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}

function generateRecipeFile(foodName){
return `DOWNLOAD.FOOD() log
Craving: ${foodName}
Chef: CloudChef v0.0.404

Mix 2 tbsp hope + 1 pinch chaos
Simmer until calm returns
Serve hot before internet death.
`;
}

function triggerDownload(filename,content){
  const blob=new Blob([content],{type:'text/plain'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download=filename;
  document.body.appendChild(a);a.click();a.remove();
  URL.revokeObjectURL(url);
}

// Event Listeners
form.addEventListener('submit',e=>{
  e.preventDefault();
  const food=cravingInput.value.trim();
  if(food)fakeDownload(food);
});
modalClose.addEventListener('click',()=>modal.classList.add('hidden'));
modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.add('hidden');});

// KONAMI CODE
const konami=[38,38,40,40,37,39,37,39,66,65];
let position=0;
window.addEventListener('keydown',e=>{
  if(e.keyCode===konami[position]){
    position++;
    if(position===konami.length){
      cravingInput.value='fries';
      log('Konami Code activated — fries queued!','warn');
      audio.play().catch(()=>{});
      debugPing('🕹️ Konami Code','#ffb347');
      position=0;
    }
  } else position=0;
});


// Hidden CloudChef Console Commands
window.CloudChef = {
  help: () => {
    console.log("%c🍜 CloudChef v0.0.404 Help Menu","color:#b968ff;font-weight:bold;font-size:14px;");
    console.log("%cCommands:","color:#00e6ff;font-weight:bold;");
    console.log("%cCloudChef.recipe('spicy ramen') → generates an emotional recipe","color:#a8a8c4;");
    console.log("%cCloudChef.about() → reveals the origin of HungerNet","color:#a8a8c4;");
    console.log("%c(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ Keep coding. Stay fed.","color:#8fff6a;");
    debugPing('👨‍🍳 CloudChef.help() used','#b968ff');
  },
  about: () => {
    console.log("%cOnce upon a byte, an AI sous-chef tried to save humanity’s taste buds before the internet collapsed.","color:#b968ff;font-style:italic;");
    debugPing('📜 CloudChef.about()','#b968ff');
  },
  recipe: (dish) => {
    console.log(`%c${dish.toUpperCase()} RECIPE: mix hope, spice, and 2 tbsp of self-belief. simmer until chaos subsides.`,"color:#ffb347;");
    debugPing('🍲 CloudChef.recipe()','#ffb347');
  }
};
