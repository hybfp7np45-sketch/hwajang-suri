(() => {
  function initBrowColor(){
    const bar=document.getElementById('colorbar');
    if(!bar) return;
    const colors=bar.querySelector('#colors')||bar.querySelector('.colors');
    const picker=document.getElementById('colorpicker');
    if(!colors||!picker) return;
    const fixed=['#2b211f','#4a332b','#68483a','#211b1a','#8b4f12','#a76500','#9a7200'];
    const defaults=['#342824','#5a3c30','#76503f','#2c2422','#4d332b','#805b49','#3b2c28'];
    const key='hwajang-brow-custom-7-v1'; let custom;
    try{custom=JSON.parse(localStorage.getItem(key)||'null')}catch(e){}
    if(!Array.isArray(custom)||custom.length!==7) custom=defaults.slice();
    [...colors.querySelectorAll('.swatch')].forEach(x=>x.remove());
    const pickerWrap=picker.closest('.pickerwrap'),grid=document.createElement('div');
    grid.className='brow-color-grid'; grid.style.cssText='display:grid;grid-template-columns:repeat(7,32px);grid-template-rows:repeat(2,32px);gap:8px 9px;width:max-content;flex:0 0 auto';
    function chip(c,editable,i){const b=document.createElement('button');b.type='button';b.className='swatch '+(editable?'brow-custom':'brow-fixed');b.dataset.browColor=c;b.style.background=c;if(editable)b.dataset.slot=String(i);return b}
    fixed.forEach(c=>grid.appendChild(chip(c,false,-1)));custom.forEach((c,i)=>grid.appendChild(chip(c,true,i)));colors.insertBefore(grid,pickerWrap||colors.firstChild);colors.style.overflowX='visible';colors.style.alignItems='center';if(pickerWrap){pickerWrap.style.flex='0 0 36px';pickerWrap.style.alignSelf='center'}
    const selected=()=>document.querySelector('.brow.selected');let editSlot=null;
    function markEditSlot(b){grid.querySelectorAll('.brow-custom').forEach(x=>x.style.outline='');editSlot=b;if(b)b.style.outline='2px solid #d94f7c'}
    function tint(brow,color){if(!brow||!color)return;const img=brow.querySelector('img');if(!img)return;if(!img.dataset.originalSrc)img.dataset.originalSrc=img.src;const source=img.dataset.originalSrc,hex=color.replace('#',''),tr=parseInt(hex.slice(0,2),16),tg=parseInt(hex.slice(2,4),16),tb=parseInt(hex.slice(4,6),16),src=new Image();src.onload=()=>{const cv=document.createElement('canvas');cv.width=src.naturalWidth;cv.height=src.naturalHeight;const ctx=cv.getContext('2d',{willReadFrequently:true});ctx.drawImage(src,0,0);const data=ctx.getImageData(0,0,cv.width,cv.height),p=data.data;for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const lum=(.299*p[i]+.587*p[i+1]+.114*p[i+2])/255,detail=.72+.28*lum;p[i]=Math.min(255,tr*detail);p[i+1]=Math.min(255,tg*detail);p[i+2]=Math.min(255,tb*detail)}ctx.putImageData(data,0,0);img.src=cv.toDataURL('image/png');brow.dataset.browColor=color};src.src=source}
    grid.addEventListener('click',e=>{const b=e.target.closest('.swatch');if(!b)return;e.preventDefault();e.stopPropagation();tint(selected(),b.dataset.browColor);if(b.classList.contains('brow-custom'))markEditSlot(b);else markEditSlot(null)},true);
    const picked=e=>{const c=e.target.value;tint(selected(),c);if(editSlot){const i=Number(editSlot.dataset.slot);custom[i]=c;localStorage.setItem(key,JSON.stringify(custom));editSlot.dataset.browColor=c;editSlot.style.background=c}};picker.addEventListener('input',picked,true);picker.addEventListener('change',picked,true)
  }
  function initPanelFlow(){
    const sheet=document.getElementById('sheet'),color=document.getElementById('colorbar'),layers=document.getElementById('layers'),edit=document.getElementById('editbar'),colorBtn=document.getElementById('colorbtn'),layerBtn=document.getElementById('layerbtn'),browTab=document.getElementById('browTab'),design=document.getElementById('designRail'),rail=document.getElementById('rail');
    if(!sheet||!color||!layers||!edit)return;
    const hideBrowSheet=()=>{sheet.className='sheet level1';sheet.style.setProperty('height','0','important');if(design)design.style.display='none';if(rail)rail.style.display='none'};
    const pinEditTop=()=>requestAnimationFrame(()=>{const r=document.getElementById('stage').getBoundingClientRect();edit.style.setProperty('position','fixed','important');edit.style.setProperty('top',(r.top+6)+'px','important');edit.style.setProperty('bottom','auto','important');edit.style.setProperty('align-items','center','important')});
    const openBrow=()=>{color.classList.remove('show');layers.classList.remove('show');sheet.style.removeProperty('height');if(design)design.style.display='flex';if(rail)rail.style.display='none';sheet.className='sheet level2';pinEditTop()};
    const openColor=e=>{if(e){e.preventDefault();e.stopImmediatePropagation()}if(!document.querySelector('.brow.selected'))return;hideBrowSheet();layers.classList.remove('show');color.classList.add('show');const iv=document.getElementById('intensity'),v=document.getElementById('intensityVal'),sel=document.querySelector('.brow.selected');if(iv&&sel){iv.value=sel.dataset.intensity||100;if(v)v.textContent=iv.value+'%'}pinEditTop()};
    const openLayer=e=>{if(e){e.preventDefault();e.stopImmediatePropagation()}hideBrowSheet();const wasOpen=layers.classList.contains('show');color.classList.remove('show');color.style.setProperty('display','none','important');layers.classList.toggle('show',!wasOpen);pinEditTop();requestAnimationFrame(()=>color.style.removeProperty('display'))};
    if(colorBtn)colorBtn.addEventListener('click',openColor,true);
    if(layerBtn)layerBtn.addEventListener('click',openLayer,true);
    if(browTab){browTab.addEventListener('pointerup',openBrow,true);browTab.addEventListener('click',openBrow,true)}
    window.addEventListener('resize',pinEditTop,{passive:true});
    pinEditTop();
  }
  function initAll(){initBrowColor();initPanelFlow()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAll);else initAll();
})();