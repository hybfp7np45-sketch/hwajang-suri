(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function hsv2rgb(h,s,v){let f=(n,k=(n+h/60)%6)=>v-v*s*Math.max(0,Math.min(k,4-k,1));return [f(5),f(3),f(1)].map(x=>Math.round(x*255));}
function rgb2hex(r,g,b){return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');}
function rgb2hsv(r,g,b){r/=255;g/=255;b/=255;let mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn,h=0;if(d){if(mx===r)h=60*((g-b)/d%6);else if(mx===g)h=60*((b-r)/d+2);else h=60*((r-g)/d+4);}if(h<0)h+=360;return[h,mx?d/mx:0,mx];}
function hex2rgb(x){x=(x||'#735b54').replace('#','');return [parseInt(x.slice(0,2),16),parseInt(x.slice(2,4),16),parseInt(x.slice(4,6),16)];}
function boot(){
 const wrap=$('.pickerwrap'), input=wrap&&$('input[type="color"]',wrap); if(!wrap||!input||$('#suriIosPicker'))return;
 input.style.pointerEvents='none'; wrap.setAttribute('role','button'); wrap.setAttribute('aria-label','사용자 색상 선택');
 const style=document.createElement('style');style.textContent=`
 #suriIosPicker{position:fixed;inset:0;z-index:2147483000;display:none;align-items:center;justify-content:center;padding:14px;background:#0002}
 #suriIosPicker.open{display:flex}.sicp-card{width:min(366px,calc(100vw - 28px));background:#f7f7f8;border-radius:20px;box-shadow:0 18px 50px #0004;overflow:hidden;color:#111;font-family:-apple-system,BlinkMacSystemFont,"Noto Sans KR",sans-serif}
 .sicp-head{height:50px;display:grid;grid-template-columns:44px 1fr 44px;align-items:center;padding:0 8px;background:#fff}.sicp-title{display:flex;align-items:center;justify-content:center;gap:8px}.sicp-title b{font-size:17px}.sicp-current{width:22px;height:22px;border-radius:50%;border:1px solid #c8c8cc;box-shadow:inset 0 0 0 1px #fff}.sicp-x{grid-column:3;border:0;background:#e9e9ec;width:30px;height:30px;border-radius:50%;font-size:22px;line-height:26px;color:#666;justify-self:center}
 .sicp-tabs{margin:10px 12px 12px;display:grid;grid-template-columns:repeat(3,1fr);background:#e5e5e8;border-radius:9px;padding:2px}.sicp-tab{height:32px;border:0;border-radius:7px;background:transparent;font-size:13px}.sicp-tab.on{background:#fff;box-shadow:0 1px 4px #0002;font-weight:600}
 .sicp-pane{display:none;padding:0 14px 16px}.sicp-pane.on{display:block}.sicp-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:3px;background:#fff;border-radius:10px;padding:5px}.sicp-cell{aspect-ratio:1;border:0;border-radius:3px;padding:0;min-width:0}.sicp-cell.sel{outline:3px solid #fff;box-shadow:0 0 0 2px #111}
 .sicp-spectrum{height:238px;border-radius:12px;position:relative;touch-action:none;background:linear-gradient(to top,#000 0%,transparent 58%),linear-gradient(to right,#fff 0%,rgba(255,255,255,0) 42%),linear-gradient(90deg,#ff0000 0%,#ff9500 14%,#ffcc00 23%,#34c759 38%,#00c7be 50%,#0a84ff 64%,#5e5ce6 77%,#bf5af2 88%,#ff2d55 100%);overflow:hidden}.sicp-dot{position:absolute;width:24px;height:24px;border:3px solid #fff;border-radius:50%;box-shadow:0 1px 4px #0008;transform:translate(-50%,-50%);pointer-events:none}
 .sicp-sliders{display:grid;gap:15px;padding:6px 2px 4px}.sicp-row{display:grid;grid-template-columns:72px 1fr 44px;gap:9px;align-items:center;font-size:13px}.sicp-row input[type=range]{width:100%;margin:0}.sicp-val{text-align:right;font-variant-numeric:tabular-nums}.sicp-preview{height:42px;border-radius:10px;border:1px solid #d0d0d4}
 `;document.head.appendChild(style);
 const modal=document.createElement('div');modal.id='suriIosPicker';modal.innerHTML=`<div class="sicp-card"><div class="sicp-head"><div></div><div class="sicp-title"><b>색상</b><i class="sicp-current"></i></div><button class="sicp-x" aria-label="닫기">×</button></div><div class="sicp-tabs"><button class="sicp-tab on" data-tab="grid">격자</button><button class="sicp-tab" data-tab="spectrum">스펙트럼</button><button class="sicp-tab" data-tab="sliders">슬라이더</button></div><section class="sicp-pane on" data-pane="grid"><div class="sicp-grid"></div></section><section class="sicp-pane" data-pane="spectrum"><div class="sicp-spectrum"><i class="sicp-dot"></i></div></section><section class="sicp-pane" data-pane="sliders"><div class="sicp-sliders"><div class="sicp-preview"></div><label class="sicp-row">색조<input data-k="h" type="range" min="0" max="360"><span class="sicp-val" data-v="h"></span></label><label class="sicp-row">채도<input data-k="s" type="range" min="0" max="100"><span class="sicp-val" data-v="s"></span></label><label class="sicp-row">밝기<input data-k="v" type="range" min="0" max="100"><span class="sicp-val" data-v="v"></span></label></div></section></div>`;document.body.appendChild(modal);
 let [rr,gg,bb]=hex2rgb(input.value),[h,s,v]=rgb2hsv(rr,gg,bb); const dot=$('.sicp-dot',modal),spec=$('.sicp-spectrum',modal),preview=$('.sicp-preview',modal),current=$('.sicp-current',modal);
 function apply(hex){input.value=hex;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));preview.style.background=hex;current.style.background=hex;}
 function sync(){const hex=rgb2hex(...hsv2rgb(h,s,v));apply(hex);$('[data-k=h]',modal).value=h;$('[data-k=s]',modal).value=Math.round(s*100);$('[data-k=v]',modal).value=Math.round(v*100);$('[data-v=h]',modal).textContent=Math.round(h)+'°';$('[data-v=s]',modal).textContent=Math.round(s*100)+'%';$('[data-v=v]',modal).textContent=Math.round(v*100)+'%';dot.style.left=(h/360*100)+'%';dot.style.top=((1-v)*100)+'%';modal.querySelectorAll('.sicp-cell').forEach(c=>c.classList.toggle('sel',c.dataset.hex.toLowerCase()===hex.toLowerCase()));}
 const grid=$('.sicp-grid',modal);
 const iosRows=[
 ['#ffffff','#e5e5e5','#cccccc','#b2b2b2','#999999','#808080','#666666','#4d4d4d','#333333','#1a1a1a','#0d0d0d','#000000'],
 ['#ffcccc','#ffe0cc','#fff0cc','#ffffcc','#e6ffcc','#ccffcc','#ccffe6','#ccffff','#cce6ff','#ccccff','#e6ccff','#ffccff'],
 ['#ff9999','#ffc299','#ffe099','#ffff99','#ccff99','#99ff99','#99ffcc','#99ffff','#99ccff','#9999ff','#cc99ff','#ff99ff'],
 ['#ff6666','#ffa366','#ffd166','#ffff66','#b3ff66','#66ff66','#66ffb3','#66ffff','#66b3ff','#6666ff','#b366ff','#ff66ff'],
 ['#ff3333','#ff8533','#ffc233','#ffff33','#99ff33','#33ff33','#33ff99','#33ffff','#3399ff','#3333ff','#9933ff','#ff33ff'],
 ['#ff0000','#ff6600','#ffb300','#ffff00','#80ff00','#00ff00','#00ff80','#00ffff','#0080ff','#0000ff','#8000ff','#ff00ff'],
 ['#cc0000','#cc5200','#cc8f00','#cccc00','#66cc00','#00cc00','#00cc66','#00cccc','#0066cc','#0000cc','#6600cc','#cc00cc'],
 ['#990000','#993d00','#996b00','#999900','#4d9900','#009900','#00994d','#009999','#004d99','#000099','#4d0099','#990099'],
 ['#660000','#662900','#664700','#666600','#336600','#006600','#006633','#006666','#003366','#000066','#330066','#660066'],
 ['#330000','#331400','#332400','#333300','#1a3300','#003300','#00331a','#003333','#001a33','#000033','#1a0033','#330033']
 ];
 iosRows.flat().forEach(hex=>{let b=document.createElement('button');b.className='sicp-cell';b.style.background=hex;b.dataset.hex=hex;b.addEventListener('click',()=>{[rr,gg,bb]=hex2rgb(hex);[h,s,v]=rgb2hsv(rr,gg,bb);sync();});grid.appendChild(b);});
 function pickSpec(e){let r=spec.getBoundingClientRect(),x=clamp(e.clientX-r.left,0,r.width),y=clamp(e.clientY-r.top,0,r.height);h=x/r.width*360;s=clamp(x/r.width*.25+.75,0,1);v=clamp(1-y/r.height,0,1);sync();}
 spec.addEventListener('pointerdown',e=>{spec.setPointerCapture(e.pointerId);pickSpec(e)});spec.addEventListener('pointermove',e=>{if(spec.hasPointerCapture(e.pointerId))pickSpec(e)});
 modal.querySelectorAll('.sicp-tab').forEach(b=>b.onclick=()=>{modal.querySelectorAll('.sicp-tab').forEach(x=>x.classList.toggle('on',x===b));modal.querySelectorAll('.sicp-pane').forEach(x=>x.classList.toggle('on',x.dataset.pane===b.dataset.tab));});
 modal.querySelectorAll('input[type=range]').forEach(r=>r.oninput=()=>{let k=r.dataset.k,n=+r.value;if(k==='h')h=n;if(k==='s')s=n/100;if(k==='v')v=n/100;sync();});
 $('.sicp-x',modal).onclick=()=>modal.classList.remove('open');modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});
 function open(e){if(e){e.preventDefault();e.stopPropagation();}[rr,gg,bb]=hex2rgb(input.value);[h,s,v]=rgb2hsv(rr,gg,bb);sync();modal.classList.add('open');}
 wrap.addEventListener('click',open,true);wrap.addEventListener('pointerup',e=>{e.preventDefault();},true);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();