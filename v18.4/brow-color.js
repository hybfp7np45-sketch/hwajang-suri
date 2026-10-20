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
    const key='hwajang-brow-custom-9-v2';let custom;
    try{custom=JSON.parse(localStorage.getItem(key)||'null')}catch(e){}
    if(!Array.isArray(custom)||custom.length!==9)custom=Array(9).fill('');
    const grid=document.createElement('div');grid.className='brow-restored-grid';
    grid.style.cssText='display:grid;grid-template-columns:repeat(9,28px);grid-auto-rows:28px;gap:6px 8px;width:max-content;flex:0 0 auto';
    [...fixed,...custom].forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.className='swatch '+(i<9?'brow-fixed':'brow-custom');b.dataset.browColor=c||'';if(i>=9)b.dataset.slot=String(i-9);b.style.cssText='display:block;width:28px;height:28px;border-radius:50%;border:1px solid #d8cbd0;padding:0;background:'+(c||'#fff')+';position:relative';if(i>=9&&!c){b.textContent='+';b.style.fontSize='12px';b.style.fontWeight='100';b.style.fontFamily='Arial, sans-serif';b.style.lineHeight='1';b.style.color='#aaa';b.style.display='flex';b.style.alignItems='center';b.style.justifyContent='center';b.style.textAlign='center';b.style.padding='0'}grid.appendChild(b)});
    colors.insertBefore(grid,colors.firstChild);
    const head=color.querySelector('.colorhead');
    let current=color.querySelector('.brow-current-color');if(!current&&head){current=document.createElement('span');current.className='brow-current-color';current.style.cssText='display:inline-block;width:28px;height:28px;border-radius:7px;border:1px solid #c8c8cc;box-shadow:inset 0 0 0 1px #fff;background:#5b3b2e;margin-left:8px;vertical-align:middle;flex:0 0 28px';head.querySelector('b')?.after(current)}
    let eyedrop=color.querySelector('.brow-eyedrop');
    if(!eyedrop&&head){
      eyedrop=document.createElement('button');eyedrop.type='button';eyedrop.className='brow-eyedrop';eyedrop.setAttribute('aria-label','스포이드');
      eyedrop.innerHTML='<img alt="" src="data:image/png;base64,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
" style="width:24px;height:24px;object-fit:contain;display:block">';
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
        const colorPanel=document.getElementById('colorbar');
        if(colorPanel){colorPanel.classList.remove('show');colorPanel.style.setProperty('display','none','important')}
        stage.dataset.eyedropActive='1';
        stage.style.cursor='crosshair';
        stage.style.touchAction='none';

        let live=document.getElementById('browCurrentSample');
        const rightArrow=document.querySelector('#editbar [data-n="1,0"]');
        if(!live){
          live=document.createElement('span');
          live.id='browCurrentSample';
          live.setAttribute('aria-label','현재 스포이드 색상');
          live.style.cssText='position:fixed;width:38px;height:38px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px #c8c8cc;background:#5b3b2e;z-index:2147482998;pointer-events:none;display:none;transform:translateX(-50%)';
          document.body.appendChild(live)
        }
        if(rightArrow){
          const ar=rightArrow.getBoundingClientRect();
          live.style.left=(ar.left+ar.width/2)+'px';
          live.style.top=(ar.bottom+20)+'px';
          live.style.display='block'
        }

        let marker=document.getElementById('browEyedropLens');
        if(!marker){
          marker=document.createElement('div');marker.id='browEyedropLens';
          marker.style.cssText='position:fixed;width:72px;height:72px;border-radius:50%;overflow:hidden;border:2px solid rgba(255,255,255,.98);box-shadow:0 2px 8px #0006;z-index:2147482999;pointer-events:none;display:none;background:#fff;transform:translate(-50%,-50%)';
          marker.innerHTML='<canvas width="72" height="72" style="display:block;width:72px;height:72px"></canvas><i style="position:absolute;left:50%;top:50%;width:16px;height:1.5px;background:#fff;transform:translate(-50%,-50%);border-radius:2px;box-shadow:0 0 2px #000"></i><i style="position:absolute;left:50%;top:50%;width:1.5px;height:16px;background:#fff;transform:translate(-50%,-50%);border-radius:2px;box-shadow:0 0 2px #000"></i>';
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
            const lens=marker.querySelector('canvas'),lctx=lens.getContext('2d');const srcSpan=Math.max(8,Math.round(36*source.width/r.width));lctx.clearRect(0,0,72,72);lctx.imageSmoothingEnabled=true;lctx.drawImage(source,Math.max(0,x-srcSpan/2),Math.max(0,y-srcSpan/2),Math.min(srcSpan,source.width),Math.min(srcSpan,source.height),0,0,72,72);
            const LENS_OFFSET_Y=38; /* 기준 위치보다 정확히 20px 아래 */
            marker.style.display='block';marker.style.left=ev.clientX+'px';marker.style.top=Math.max(42,ev.clientY-LENS_OFFSET_Y)+'px';
            if(current)current.style.background=hex;if(live)live.style.background=hex;
            if(commit){applyPaletteColor(hex);if(window.__suriSaveSelectedCustomColor)window.__suriSaveSelectedCustomColor(hex)}
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
          marker.style.display='none';if(live)live.style.display='none';stage.style.cursor='';delete stage.dataset.eyedropActive;eyedrop.style.background='#fff';
          activePointer=null;
          if(colorPanel){colorPanel.style.removeProperty('display');colorPanel.classList.add('show')}
        }
        stage.addEventListener('pointerdown',down,true);
        stage.addEventListener('pointermove',move,true);
        stage.addEventListener('pointerup',up,true);
        stage.addEventListener('pointercancel',cancel,true)
      },true)
    }
    const hex2rgb=x=>{x=(x||'#735b54').replace('#','');return [parseInt(x.slice(0,2),16),parseInt(x.slice(2,4),16),parseInt(x.slice(4,6),16)]};
    function applyPaletteColor(hex){if(current)current.style.background=hex;const brow=document.querySelector('.brow.selected');if(!brow||!hex)return;brow.dataset.color=hex;brow.dataset.browColor=hex;const img=brow.querySelector('img');if(!img)return;if(!img.dataset.originalSrc||img.dataset.originalSrc.startsWith('data:'))img.dataset.originalSrc=brow.dataset.src||img.getAttribute('src');const source=brow.dataset.src||img.dataset.originalSrc,[tr,tg,tb]=hex2rgb(hex),src=new Image();src.onload=()=>{const cv=document.createElement('canvas');cv.width=src.naturalWidth;cv.height=src.naturalHeight;const ctx=cv.getContext('2d',{willReadFrequently:true});ctx.drawImage(src,0,0);const data=ctx.getImageData(0,0,cv.width,cv.height),p=data.data;for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const lum=(.299*p[i]+.587*p[i+1]+.114*p[i+2])/255,detail=.72+.28*lum;p[i]=Math.min(255,tr*detail);p[i+1]=Math.min(255,tg*detail);p[i+2]=Math.min(255,tb*detail)}ctx.putImageData(data,0,0);img.src=cv.toDataURL('image/png')};src.src=source}
    let selectedCustom=null;
    const paintCustomSelection=()=>grid.querySelectorAll('.brow-custom').forEach(x=>{x.style.border=selectedCustom===x?'2px solid #72c7f2':'1px solid #d8cbd0'});
    const saveSelectedCustom=hex=>{if(!selectedCustom||!hex)return;const slot=+selectedCustom.dataset.slot;custom[slot]=hex;localStorage.setItem(key,JSON.stringify(custom));selectedCustom.dataset.browColor=hex;selectedCustom.textContent='';selectedCustom.style.background=hex;selectedCustom.style.color='transparent';paintCustomSelection()};
    grid.addEventListener('click',e=>{const sw=e.target.closest('.swatch');if(!sw)return;e.preventDefault();e.stopPropagation();if(sw.classList.contains('brow-custom')){selectedCustom=sw;paintCustomSelection();if(sw.dataset.browColor)applyPaletteColor(sw.dataset.browColor);return}if(sw.dataset.browColor)applyPaletteColor(sw.dataset.browColor)},true);
    let holdTimer=null,holdTarget=null,deleteTip=null,holdStartX=0,holdStartY=0,longPressFired=false;
    const hideDeleteTip=()=>{if(deleteTip){deleteTip.remove();deleteTip=null}};
    const clearHold=()=>{if(holdTimer)clearTimeout(holdTimer);holdTimer=null;holdTarget=null};
    const showDeleteTip=target=>{
      hideDeleteTip();
      const r=target.getBoundingClientRect(),tip=document.createElement('button');deleteTip=tip;tip.type='button';tip.textContent='삭제하기';
      tip.style.cssText='position:fixed;z-index:2147483647;padding:7px 11px;border:1px solid rgba(255,255,255,.14);border-radius:9px;background:rgba(32,32,34,.96);color:#ff5a52;font-size:13px;font-weight:500;line-height:1;box-shadow:0 3px 10px rgba(0,0,0,.22);white-space:nowrap;touch-action:manipulation;-webkit-user-select:none;user-select:none';
      document.body.appendChild(tip);const tr=tip.getBoundingClientRect();
      tip.style.left=Math.max(8,Math.min(innerWidth-tr.width-8,r.left+r.width/2-tr.width/2))+'px';
      tip.style.top=Math.max(8,r.top-tr.height-7)+'px';
      const remove=ev=>{ev.preventDefault();ev.stopPropagation();const slot=+target.dataset.slot;custom[slot]='';localStorage.setItem(key,JSON.stringify(custom));target.dataset.browColor='';target.textContent='+';target.style.background='#fff';target.style.color='#aaa';target.style.fontSize='12px';target.style.fontWeight='100';target.style.fontFamily='Arial, sans-serif';target.style.lineHeight='1';target.style.display='flex';target.style.alignItems='center';target.style.justifyContent='center';target.style.textAlign='center';target.style.padding='0';if(selectedCustom===target)selectedCustom=null;paintCustomSelection();hideDeleteTip()};
      tip.addEventListener('pointerup',remove,{once:true});tip.addEventListener('click',remove,{once:true})
    };
    const beginHold=e=>{
      hideDeleteTip();const sw=e.target.closest('.brow-custom');if(!sw||!sw.dataset.browColor)return;
      e.preventDefault();holdTarget=sw;holdStartX=e.clientX;holdStartY=e.clientY;longPressFired=false;
      if(holdTimer)clearTimeout(holdTimer);
      holdTimer=setTimeout(()=>{const target=holdTarget;if(target){longPressFired=true;showDeleteTip(target)}holdTimer=null;holdTarget=null},550)
    };
    grid.addEventListener('pointerdown',beginHold,true);
    grid.addEventListener('pointermove',e=>{if(holdTimer&&Math.hypot(e.clientX-holdStartX,e.clientY-holdStartY)>12)clearHold()},true);
    grid.addEventListener('pointerup',e=>{if(holdTimer)clearHold();if(longPressFired){e.preventDefault();e.stopImmediatePropagation();longPressFired=false}},true);
    grid.addEventListener('pointercancel',clearHold,true);
    grid.addEventListener('contextmenu',e=>{const sw=e.target.closest('.brow-custom');if(sw&&sw.dataset.browColor){e.preventDefault();e.stopPropagation()}},true);
    window.addEventListener('suri-brow-color-picked',e=>saveSelectedCustom(e.detail&&e.detail.hex));
    window.__suriSaveSelectedCustomColor=saveSelectedCustom;
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