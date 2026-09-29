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
 #suriIosPicker{position:fixed;inset:0;z-index:2147483000;display:none;align-items:flex-end;justify-content:center;padding:0 14px;background:#0002}
 #suriIosPicker.open{display:flex}.sicp-card{width:min(366px,calc(100vw - 28px));background:#f7f7f8;border-radius:20px 20px 0 0;box-shadow:0 18px 50px #0004;overflow:hidden;color:#111;font-family:-apple-system,BlinkMacSystemFont,"Noto Sans KR",sans-serif;padding-bottom:env(safe-area-inset-bottom)}
 .sicp-head{height:50px;display:grid;grid-template-columns:1fr 44px;align-items:center;padding:0 8px 0 16px;background:#fff}.sicp-title{display:flex;align-items:center;justify-content:flex-start;gap:8px}.sicp-title b{font-size:17px}.sicp-current{width:22px;height:22px;border-radius:50%;border:1px solid #c8c8cc;box-shadow:inset 0 0 0 1px #fff}.sicp-x{grid-column:2;border:0;background:#e9e9ec;width:30px;height:30px;border-radius:50%;font-size:22px;line-height:26px;color:#666;justify-self:center}
 .sicp-tabs{margin:10px 12px 12px;display:grid;grid-template-columns:repeat(3,1fr);background:#e5e5e8;border-radius:9px;padding:2px}.sicp-tab{height:32px;border:0;border-radius:7px;background:transparent;font-size:13px}.sicp-tab.on{background:#fff;box-shadow:0 1px 4px #0002;font-weight:600}
 .sicp-pane{display:none;padding:0 14px 16px;height:282px;box-sizing:content-box}.sicp-pane.on{display:block}.sicp-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:0;background:#fff;border-radius:10px;overflow:hidden;padding:0}.sicp-cell{aspect-ratio:1;border:0;border-radius:0;padding:0;min-width:0}.sicp-cell.sel{outline:3px solid #fff;outline-offset:-4px;box-shadow:inset 0 0 0 2px #111}
 .sicp-spectrum{height:282px;border-radius:12px;position:relative;touch-action:none;background:linear-gradient(to right,#fff 0%,rgba(255,255,255,0) 50%,#000 100%),linear-gradient(to bottom,#ff3b30 0%,#ff9500 13%,#ffcc00 24%,#34c759 38%,#00c7be 50%,#0a84ff 64%,#5e5ce6 76%,#bf5af2 88%,#ff2d55 100%);overflow:hidden}.sicp-dot{position:absolute;width:24px;height:24px;border:3px solid #fff;border-radius:50%;box-shadow:0 1px 4px #0008;transform:translate(-50%,-50%);pointer-events:none}
 .sicp-sliders{display:grid;gap:15px;padding:6px 2px 4px}.sicp-row{display:grid;grid-template-columns:72px 1fr 44px;gap:9px;align-items:center;font-size:13px}.sicp-row input[type=range]{width:100%;margin:0}.sicp-val{text-align:right;font-variant-numeric:tabular-nums}.sicp-preview{height:42px;border-radius:10px;border:1px solid #d0d0d4}
 `;document.head.appendChild(style);
 const modal=document.createElement('div');modal.id='suriIosPicker';modal.innerHTML=`<div class="sicp-card"><div class="sicp-head"><div class="sicp-title"><b>색상</b><i class="sicp-current"></i></div><button class="sicp-x" aria-label="닫기">×</button></div><div class="sicp-tabs"><button class="sicp-tab on" data-tab="grid">격자</button><button class="sicp-tab" data-tab="spectrum">스펙트럼</button><button class="sicp-tab" data-tab="sliders">슬라이더</button></div><section class="sicp-pane on" data-pane="grid"><div class="sicp-grid"></div></section><section class="sicp-pane" data-pane="spectrum"><div class="sicp-spectrum"><i class="sicp-dot"></i></div></section><section class="sicp-pane" data-pane="sliders"><div class="sicp-sliders"><div class="sicp-preview"></div><label class="sicp-row">색조<input data-k="h" type="range" min="0" max="360"><span class="sicp-val" data-v="h"></span></label><label class="sicp-row">채도<input data-k="s" type="range" min="0" max="100"><span class="sicp-val" data-v="s"></span></label><label class="sicp-row">밝기<input data-k="v" type="range" min="0" max="100"><span class="sicp-val" data-v="v"></span></label></div></section></div>`;document.body.appendChild(modal);
 let [rr,gg,bb]=hex2rgb(input.value),[h,s,v]=rgb2hsv(rr,gg,bb); const dot=$('.sicp-dot',modal),spec=$('.sicp-spectrum',modal),preview=$('.sicp-preview',modal),current=$('.sicp-current',modal);
 function apply(hex){input.value=hex;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));preview.style.background=hex;current.style.background=hex;}
 function sync(){const hex=rgb2hex(...hsv2rgb(h,s,v));apply(hex);$('[data-k=h]',modal).value=h;$('[data-k=s]',modal).value=Math.round(s*100);$('[data-k=v]',modal).value=Math.round(v*100);$('[data-v=h]',modal).textContent=Math.round(h)+'°';$('[data-v=s]',modal).textContent=Math.round(s*100)+'%';$('[data-v=v]',modal).textContent=Math.round(v*100)+'%';let sx=v<1?50+(1-v)*50:s*50;dot.style.left=sx+'%';dot.style.top=(h/360*100)+'%';modal.querySelectorAll('.sicp-cell').forEach(c=>c.classList.toggle('sel',c.dataset.hex.toLowerCase()===hex.toLowerCase()));}
 const grid=$('.sicp-grid',modal);
 const iosRows=[
 ['#ffffff','#ebebeb','#d6d6d6','#c2c2c2','#adadad','#999999','#858585','#707070','#5c5c5c','#474747','#333333','#000000'],
 ['#004d40','#00695c','#00796b','#00897b','#009688','#26a69a','#4db6ac','#80cbc4','#b2dfdb','#e0f2f1','#f1f8e9','#fff8e1'],
 ['#006064','#00838f','#0097a7','#00acc1','#00bcd4','#26c6da','#4dd0e1','#80deea','#b2ebf2','#e0f7fa','#f0f4c3','#fff3e0'],
 ['#0d47a1','#1565c0','#1976d2','#1e88e5','#2196f3','#42a5f5','#64b5f6','#90caf9','#bbdefb','#e3f2fd','#f8bbd0','#fce4ec'],
 ['#1a237e','#283593','#303f9f','#3949ab','#3f51b5','#5c6bc0','#7986cb','#9fa8da','#c5cae9','#e8eaf6','#e1bee7','#f3e5f5'],
 ['#4a148c','#6a1b9a','#7b1fa2','#8e24aa','#9c27b0','#ab47bc','#ba68c8','#ce93d8','#e1bee7','#f3e5f5','#f8bbd0','#fce4ec'],
 ['#880e4f','#ad1457','#c2185b','#d81b60','#e91e63','#ec407a','#f06292','#f48fb1','#f8bbd0','#fce4ec','#ffcdd2','#ffebee'],
 ['#b71c1c','#c62828','#d32f2f','#e53935','#f44336','#ef5350','#e57373','#ef9a9a','#ffcdd2','#ffebee','#ffe0b2','#fff3e0'],
 ['#e65100','#ef6c00','#f57c00','#fb8c00','#ff9800','#ffa726','#ffb74d','#ffcc80','#ffe0b2','#fff3e0','#fff9c4','#fffde7'],
 ['#f57f17','#f9a825','#fbc02d','#fdd835','#ffeb3b','#ffee58','#fff176','#fff59d','#fff9c4','#fffde7','#f1f8e9','#ffffff']
 ];
 iosRows.flat().forEach(hex=>{let b=document.createElement('button');b.className='sicp-cell';b.style.background=hex;b.dataset.hex=hex;b.addEventListener('click',()=>{[rr,gg,bb]=hex2rgb(hex);[h,s,v]=rgb2hsv(rr,gg,bb);sync();});grid.appendChild(b);});
 function pickSpec(e){let r=spec.getBoundingClientRect(),x=clamp(e.clientX-r.left,0,r.width),y=clamp(e.clientY-r.top,0,r.height),xn=x/r.width;h=y/r.height*360;if(xn<=.5){s=xn*2;v=1}else{s=1;v=1-(xn-.5)*2}sync();}
 spec.addEventListener('pointerdown',e=>{spec.setPointerCapture(e.pointerId);pickSpec(e)});spec.addEventListener('pointermove',e=>{if(spec.hasPointerCapture(e.pointerId))pickSpec(e)});
 modal.querySelectorAll('.sicp-tab').forEach(b=>b.onclick=()=>{modal.querySelectorAll('.sicp-tab').forEach(x=>x.classList.toggle('on',x===b));modal.querySelectorAll('.sicp-pane').forEach(x=>x.classList.toggle('on',x.dataset.pane===b.dataset.tab));});
 modal.querySelectorAll('input[type=range]').forEach(r=>r.oninput=()=>{let k=r.dataset.k,n=+r.value;if(k==='h')h=n;if(k==='s')s=n/100;if(k==='v')v=n/100;sync();});
 $('.sicp-x',modal).onclick=()=>modal.classList.remove('open');modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});
 function open(e){if(e){e.preventDefault();e.stopPropagation();}[rr,gg,bb]=hex2rgb(input.value);[h,s,v]=rgb2hsv(rr,gg,bb);sync();modal.classList.add('open');}
 wrap.addEventListener('click',open,true);wrap.addEventListener('pointerup',e=>{e.preventDefault();},true);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();