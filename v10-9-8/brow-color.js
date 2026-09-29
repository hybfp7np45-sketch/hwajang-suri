(() => {
  function initBrowColor(){
    const bar=document.getElementById('colorbar');
    if(!bar) return;
    const colors=bar.querySelector('#colors')||bar.querySelector('.colors');
    const nativePicker=document.getElementById('colorpicker');
    if(!colors||!nativePicker) return;
    const fixed=['#2b211f','#4a332b','#68483a','#211b1a','#8b4f12','#a76500','#9a7200','#55362d','#b07942'];
    const key='hwajang-brow-custom-9-v1'; let custom;
    try{custom=JSON.parse(localStorage.getItem(key)||'null')}catch(e){}
    if(!Array.isArray(custom)||custom.length!==9) custom=Array(9).fill('');
    [...colors.querySelectorAll('.swatch')].forEach(x=>x.remove());
    const nativeWrap=nativePicker.closest('.pickerwrap');
    if(nativeWrap) nativeWrap.style.display='none';
    const grid=document.createElement('div');
    grid.className='brow-color-grid'; grid.style.cssText='display:grid;grid-template-columns:repeat(9,28px);grid-template-rows:repeat(2,28px);gap:6px 8px;width:max-content;flex:0 0 auto';
    function chip(c,editable,i){const b=document.createElement('button');b.type='button';b.className='swatch '+(editable?'brow-custom':'brow-fixed')+(c?'':' empty');b.dataset.browColor=c||'';b.style.background=c||'#fff';if(editable)b.dataset.slot=String(i);return b}
    fixed.forEach(c=>grid.appendChild(chip(c,false,-1)));custom.forEach((c,i)=>grid.appendChild(chip(c,true,i)));colors.insertBefore(grid,nativeWrap||colors.firstChild);colors.style.overflowX='visible';colors.style.alignItems='center';
    const eyedrop=document.createElement('button');eyedrop.type='button';eyedrop.className='brow-eyedrop';eyedrop.textContent='⌾';eyedrop.setAttribute('aria-label','스포이드');eyedrop.style.cssText='width:30px;height:30px;border:1px solid #ead8de;border-radius:50%;background:#fff;font-size:18px;padding:0;flex:0 0 30px';
    const current=document.createElement('span');current.className='brow-current-color';current.style.cssText='display:inline-block;width:28px;height:28px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px #d8cbd0;background:'+nativePicker.value+';flex:0 0 28px';
    const rainbow=document.createElement('button');rainbow.type='button';rainbow.className='brow-rainbow';rainbow.setAttribute('aria-label','컬러 선택');rainbow.style.cssText='width:32px;height:32px;border-radius:50%;border:0;background:conic-gradient(red,#ff0,#0f0,#0ff,#00f,#f0f,red);flex:0 0 32px';
    colors.append(eyedrop,current,rainbow);
    const pop=document.createElement('div');pop.className='brow-mini-picker';pop.style.cssText='display:none;position:fixed;left:50%;transform:translateX(-50%);bottom:145px;z-index:1000003;width:min(286px,calc(100vw - 32px));padding:10px;background:#fff;border:1px solid #ead8de;border-radius:14px;box-shadow:0 8px 24px #0003';
    pop.innerHTML='<div style="height:126px;border-radius:10px;background:linear-gradient(to top,#0000,#000),linear-gradient(to right,#fff,transparent),linear-gradient(to right,red,#ff0,#0f0,#0ff,#00f,#f0f,red);position:relative;overflow:hidden"><input class="mini-sv" type="range" min="0" max="100" value="72" style="position:absolute;left:8px;right:8px;bottom:8px;width:calc(100% - 16px)"></div><input class="mini-hue" type="range" min="0" max="360" value="20" style="width:100%;margin-top:9px">';
    document.body.appendChild(pop);
    const selected=()=>document.querySelector('.brow.selected');let editSlot=null;
    function markEditSlot(b){grid.querySelectorAll('.brow-custom').forEach(x=>x.style.outline='');editSlot=b;if(b)b.style.outline='2px solid #d94f7c'}
    function tint(brow,color){if(!brow||!color)return;const img=brow.querySelector('img');if(!img)return;if(!img.dataset.originalSrc)img.dataset.originalSrc=img.src;const source=img.dataset.originalSrc,hex=color.replace('#',''),tr=parseInt(hex.slice(0,2),16),tg=parseInt(hex.slice(2,4),16),tb=parseInt(hex.slice(4,6),16),src=new Image();src.onload=()=>{const cv=document.createElement('canvas');cv.width=src.naturalWidth;cv.height=src.naturalHeight;const ctx=cv.getContext('2d',{willReadFrequently:true});ctx.drawImage(src,0,0);const data=ctx.getImageData(0,0,cv.width,cv.height),p=data.data;for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const lum=(.299*p[i]+.587*p[i+1]+.114*p[i+2])/255,detail=.72+.28*lum;p[i]=Math.min(255,tr*detail);p[i+1]=Math.min(255,tg*detail);p[i+2]=Math.min(255,tb*detail)}ctx.putImageData(data,0,0);img.src=cv.toDataURL('image/png');brow.dataset.browColor=color};src.src=source}
    function hsvHex(h,s,v){s/=100;v/=100;const c=v*s,x=c*(1-Math.abs((h/60)%2-1)),m=v-c;let r=0,g=0,b=0;if(h<60)[r,g,b]=[c,x,0];else if(h<120)[r,g,b]=[x,c,0];else if(h<180)[r,g,b]=[0,c,x];else if(h<240)[r,g,b]=[0,x,c];else if(h<300)[r,g,b]=[x,0,c];else[r,g,b]=[c,0,x];return '#'+[r,g,b].map(n=>Math.round((n+m)*255).toString(16).padStart(2,'0')).join('')}
    function applyMini(){const h=+pop.querySelector('.mini-hue').value,v=+pop.querySelector('.mini-sv').value,c=hsvHex(h,78,Math.max(18,v));current.style.background=c;tint(selected(),c);if(editSlot){const i=Number(editSlot.dataset.slot);custom[i]=c;localStorage.setItem(key,JSON.stringify(custom));editSlot.dataset.browColor=c;editSlot.style.background=c;editSlot.classList.remove('empty')}}
    grid.addEventListener('click',e=>{const b=e.target.closest('.swatch');if(!b)return;e.preventDefault();e.stopPropagation();if(b.dataset.browColor){current.style.background=b.dataset.browColor;tint(selected(),b.dataset.browColor)}if(b.classList.contains('brow-custom'))markEditSlot(b);else markEditSlot(null)},true);
    rainbow.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();pop.style.display=pop.style.display==='block'?'none':'block'});
    pop.querySelectorAll('input').forEach(i=>i.addEventListener('input',applyMini));
    document.addEventListener('pointerdown',e=>{if(pop.style.display==='block'&&!pop.contains(e.target)&&!rainbow.contains(e.target))pop.style.display='none'},true);
  }
  function initPanelFlow(){
    const sheet=document.getElementById('sheet'),color=document.getElementById('colorbar'),layers=document.getElementById('layers'),edit=document.getElementById('editbar'),colorBtn=document.getElementById('colorbtn'),layerBtn=document.getElementById('layerbtn'),browTab=document.getElementById('browTab'),design=document.getElementById('designRail'),rail=document.getElementById('rail');
    if(!sheet||!color||!layers||!edit)return;
    const hideBrowSheet=()=>{sheet.className='sheet level1';sheet.style.setProperty('height','0','important');if(design)design.style.display='none';if(rail)rail.style.display='none'};
    const pinEditTop=()=>requestAnimationFrame(()=>{const r=document.getElementById('stage').getBoundingClientRect();edit.style.setProperty('position','fixed','important');edit.style.setProperty('top',(r.top+6)+'px','important');edit.style.setProperty('bottom','auto','important');edit.style.setProperty('align-items','center','important')});
    const openBrow=()=>{color.classList.remove('show');layers.classList.remove('show');sheet.style.removeProperty('height');if(design)design.style.display='flex';if(rail)rail.style.display='none';sheet.className='sheet level2';pinEditTop()};
    const openColor=e=>{if(e){e.preventDefault();e.stopImmediatePropagation()}if(!document.querySelector('.brow.selected'))return;hideBrowSheet();layers.classList.remove('show');color.classList.add('show');const iv=document.getElementById('intensity'),v=document.getElementById('intensityVal'),sel=document.querySelector('.brow.selected');if(iv&&sel){iv.value=sel.dataset.intensity||100;if(v)v.textContent=iv.value+'%'}pinEditTop()};
    const openLayer=e=>{if(e){e.preventDefault();e.stopImmediatePropagation()}hideBrowSheet();const wasOpen=layers.classList.contains('show');color.classList.remove('show');color.style.setProperty('display','none','important');layers.classList.toggle('show',!wasOpen);pinEditTop();requestAnimationFrame(()=>color.style.removeProperty('display'))};
    if(colorBtn)colorBtn.addEventListener('click',openColor,true);if(layerBtn)layerBtn.addEventListener('click',openLayer,true);if(browTab){browTab.addEventListener('pointerup',openBrow,true);browTab.addEventListener('click',openBrow,true)}window.addEventListener('resize',pinEditTop,{passive:true});pinEditTop();
  }
  function initAll(){initBrowColor();initPanelFlow()}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAll);else initAll();
})();