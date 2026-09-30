(()=>{
  function loadIosPicker(){
    if(document.querySelector('script[data-suri-ios-picker]')) return;
    const s=document.createElement('script');
    s.src='./ios-color-picker.js?cb=picker0929brow7363';
    s.dataset.suriIosPicker='1';
    document.head.appendChild(s);
  }
  function openIosPicker(){
    const open=()=>{const modal=document.getElementById('suriIosPicker');if(modal){modal.classList.add('open');return true}return false};
    if(open()) return;
    loadIosPicker();
    let tries=0;const timer=setInterval(()=>{tries++;if(open()||tries>40)clearInterval(timer)},25);
  }
  function restorePalette(){
    const color=document.getElementById('colorbar');
    if(!color)return;
    const colors=color.querySelector('#colors')||color.querySelector('.colors');
    if(!colors)return;
    colors.querySelectorAll('.brow-restored-grid').forEach(x=>x.remove());
    const old=[...colors.querySelectorAll('.swatch')];
    old.forEach(x=>x.style.display='none');
    const fixed=['#2b211f','#4a332b','#68483a','#211b1a','#8b4f12','#a76500','#9a7200','#55362d','#b07942'];
    const key='hwajang-brow-custom-9-v1';let custom;
    try{custom=JSON.parse(localStorage.getItem(key)||'null')}catch(e){}
    if(!Array.isArray(custom)||custom.length!==9)custom=Array(9).fill('');
    const grid=document.createElement('div');grid.className='brow-restored-grid';
    grid.style.cssText='display:grid;grid-template-columns:repeat(9,28px);grid-template-rows:repeat(2,28px);gap:6px 8px;width:max-content;flex:0 0 auto';
    [...fixed,...custom].forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.className='swatch '+(i<9?'brow-fixed':'brow-custom');b.dataset.browColor=c||'';if(i>=9)b.dataset.slot=String(i-9);b.style.cssText='display:block;width:28px;height:28px;border-radius:50%;border:1px solid #d8cbd0;padding:0;background:'+(c||'#fff');grid.appendChild(b)});
    colors.insertBefore(grid,colors.firstChild);
    const head=color.querySelector('.colorhead');
    let current=color.querySelector('.brow-current-color');if(!current&&head){current=document.createElement('span');current.className='brow-current-color';current.style.cssText='display:inline-block;width:28px;height:28px;border-radius:7px;border:1px solid #c8c8cc;box-shadow:inset 0 0 0 1px #fff;background:#5b3b2e;margin-left:8px;vertical-align:middle;flex:0 0 28px';head.querySelector('b')?.after(current)}
    let eyedrop=color.querySelector('.brow-eyedrop');
    if(!eyedrop&&head){
      eyedrop=document.createElement('button');eyedrop.type='button';eyedrop.className='brow-eyedrop';eyedrop.setAttribute('aria-label','스포이드');
      eyedrop.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" transform="rotate(-45 12 12)"><path d="M9.6 3.2h4.8v3.2l-1.05 1.05v8.85l-1.35 3.1-1.35-3.1V7.45L9.6 6.4V3.2Z"/><path d="M9.6 6.4h4.8"/></g></svg>';
      eyedrop.style.cssText='width:32px;height:32px;border:1px solid #d8cbd0;border-radius:50%;background:#fff;color:#444;display:flex;align-items:center;justify-content:center;padding:0;flex:0 0 32px;margin-left:auto';
      head.appendChild(eyedrop)
    }
    if(eyedrop&&!eyedrop.dataset.pickerBound){
      eyedrop.dataset.pickerBound='1';
      eyedrop.addEventListener('click',e=>{
        e.preventDefault();e.stopPropagation();
        const photo=document.getElementById('photo'),stage=document.getElementById('stage');
        if(!photo||!stage||!photo.src)return;
        eyedrop.style.background='#fff1f5';
        stage.dataset.eyedropActive='1';
        stage.style.cursor='crosshair';
        stage.style.touchAction='none';

        let marker=document.getElementById('browEyedropLens');
        if(!marker){
          marker=document.createElement('div');marker.id='browEyedropLens';
          marker.style.cssText='position:fixed;width:54px;height:54px;border-radius:50%;border:1.5px solid rgba(255,255,255,.95);box-shadow:0 1px 5px #0004;z-index:2147482999;pointer-events:none;display:none;background:rgba(30,30,30,.16);transform:translate(-50%,-50%)';
          marker.innerHTML='<i style="position:absolute;left:50%;top:50%;width:12px;height:1.5px;background:#fff;transform:translate(-50%,-50%);border-radius:2px;box-shadow:0 0 1px #0008"></i><i style="position:absolute;left:50%;top:50%;width:1.5px;height:12px;background:#fff;transform:translate(-50%,-50%);border-radius:2px;box-shadow:0 0 1px #0008"></i>';
          document.body.appendChild(marker)
        }

        const source=document.createElement('canvas');
        source.width=photo.naturalWidth;source.height=photo.naturalHeight;
        const sourceCtx=source.getContext('2d',{willReadFrequently:true});
        try{sourceCtx.drawImage(photo,0,0)}catch(_){cleanup();return}
        let activePointer=null,lastSample=0;

        const sample=(ev,commit=false)=>{
          const r=photo.getBoundingClientRect();
          if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)return;
          const now=performance.now();
          if(!commit&&now-lastSample<32)return;
          lastSample=now;
          const x=Math.max(0,Math.min(source.width-1,Math.floor((ev.clientX-r.left)/r.width*source.width)));
          const y=Math.max(0,Math.min(source.height-1,Math.floor((ev.clientY-r.top)/r.height*source.height)));
          try{
            const p=sourceCtx.getImageData(x,y,1,1).data;
            const hex='#'+[p[0],p[1],p[2]].map(n=>n.toString(16).padStart(2,'0')).join('');
            marker.style.display='block';marker.style.left=ev.clientX+'px';marker.style.top=Math.max(34,ev.clientY-64)+'px';marker.style.background=hex;
            if(current)current.style.background=hex;
            if(commit)applyPaletteColor(hex)
          }catch(_){}
        };
        const down=ev=>{
          if(activePointer!==null)return;
          activePointer=ev.pointerId;
          ev.preventDefault();ev.stopImmediatePropagation();
          try{stage.setPointerCapture(ev.pointerId)}catch(_){}
          sample(ev,false)
        };
        const move=ev=>{
          if(ev.pointerId!==activePointer)return;
          ev.preventDefault();ev.stopImmediatePropagation();
          sample(ev,false)
        };
        const up=ev=>{
          if(ev.pointerId!==activePointer)return;
          ev.preventDefault();ev.stopImmediatePropagation();
          sample(ev,true);cleanup()
        };
        const cancel=ev=>{
          if(activePointer!==null&&ev.pointerId!==activePointer)return;
          ev.preventDefault();ev.stopImmediatePropagation();cleanup()
        };
        function cleanup(){
          stage.removeEventListener('pointerdown',down,true);
          stage.removeEventListener('pointermove',move,true);
          stage.removeEventListener('pointerup',up,true);
          stage.removeEventListener('pointercancel',cancel,true);
          marker.style.display='none';stage.style.cursor='';delete stage.dataset.eyedropActive;eyedrop.style.background='#fff';
          activePointer=null
        }
        stage.addEventListener('pointerdown',down,true);
        stage.addEventListener('pointermove',move,true);
        stage.addEventListener('pointerup',up,true);
        stage.addEventListener('pointercancel',cancel,true)
      },true)
    }
    const hex2rgb=x=>{x=(x||'#735b54').replace('#','');return [parseInt(x.slice(0,2),16),parseInt(x.slice(2,4),16),parseInt(x.slice(4,6),16)]};
    function applyPaletteColor(hex){if(current)current.style.background=hex;const brow=document.querySelector('.brow.selected');if(!brow||!hex)return;brow.dataset.color=hex;brow.dataset.browColor=hex;const img=brow.querySelector('img');if(!img)return;if(!img.dataset.originalSrc)img.dataset.originalSrc=img.src;const source=img.dataset.originalSrc,[tr,tg,tb]=hex2rgb(hex),src=new Image();src.onload=()=>{const cv=document.createElement('canvas');cv.width=src.naturalWidth;cv.height=src.naturalHeight;const ctx=cv.getContext('2d',{willReadFrequently:true});ctx.drawImage(src,0,0);const data=ctx.getImageData(0,0,cv.width,cv.height),p=data.data;for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const lum=(.299*p[i]+.587*p[i+1]+.114*p[i+2])/255,detail=.72+.28*lum;p[i]=Math.min(255,tr*detail);p[i+1]=Math.min(255,tg*detail);p[i+2]=Math.min(255,tb*detail)}ctx.putImageData(data,0,0);img.src=cv.toDataURL('image/png')};src.src=source}
    grid.addEventListener('click',e=>{const sw=e.target.closest('.swatch');if(!sw||!sw.dataset.browColor)return;e.preventDefault();e.stopPropagation();applyPaletteColor(sw.dataset.browColor)},true);
  }
  function initPanelFlow(){
    const sheet=document.getElementById('sheet'),color=document.getElementById('colorbar'),layers=document.getElementById('layers'),edit=document.getElementById('editbar'),colorBtn=document.getElementById('colorbtn'),layerBtn=document.getElementById('layerbtn'),browTab=document.getElementById('browTab'),design=document.getElementById('designRail'),rail=document.getElementById('rail');
    if(!sheet||!layers||!edit)return;
    restorePalette();
    if(color){color.classList.remove('show');color.style.setProperty('display','none','important')}
    const hideBrowSheet=()=>{sheet.className='sheet level1';sheet.style.setProperty('height','0','important');if(design)design.style.display='none';if(rail)rail.style.display='none'};
    const pinEditTop=()=>requestAnimationFrame(()=>{const st=document.getElementById('stage');if(!st)return;const r=st.getBoundingClientRect();edit.style.setProperty('position','fixed','important');edit.style.setProperty('top',(r.top+6)+'px','important');edit.style.setProperty('bottom','auto','important');edit.style.setProperty('align-items','center','important')});
    const openBrow=()=>{if(color)color.classList.remove('show');layers.classList.remove('show');sheet.style.removeProperty('height');if(design)design.style.display='flex';if(rail)rail.style.display='none';sheet.className='sheet level2';pinEditTop()};
    const openColor=e=>{if(e){e.preventDefault();e.stopImmediatePropagation()}if(!document.querySelector('.brow.selected'))return;hideBrowSheet();layers.classList.remove('show');if(color){color.style.removeProperty('display');color.classList.add('show')}pinEditTop()};
    const openLayer=e=>{if(e){e.preventDefault();e.stopImmediatePropagation()}hideBrowSheet();const wasOpen=layers.classList.contains('show');if(color){color.classList.remove('show');color.style.setProperty('display','none','important')}layers.classList.toggle('show',!wasOpen);pinEditTop()};
    if(colorBtn)colorBtn.addEventListener('click',openColor,true);
    if(color){color.addEventListener('click',e=>{const rainbow=e.target.closest('.pickerwrap,.brow-rainbow');if(!rainbow)return;e.preventDefault();e.stopImmediatePropagation();openIosPicker()},true)}
    if(layerBtn)layerBtn.addEventListener('click',openLayer,true);if(browTab){browTab.addEventListener('pointerup',openBrow,true);browTab.addEventListener('click',openBrow,true)}window.addEventListener('resize',pinEditTop,{passive:true});pinEditTop();
  }
  function initAll(){loadIosPicker();initPanelFlow()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAll);else initAll();
})();