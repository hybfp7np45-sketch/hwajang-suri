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
      eyedrop.innerHTML='<img alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABfElEQVR42q3VMWsVQRSG4WfDLdJpMMUt7BSukNjZCga0sxUbRQvBQCwtFCwiIqRJERDUziKFgpaChWKKFEJKBRXiP1CwTLEhNmdgWOeG3b07sOyZ2dn343xzDlMtjCcGHLdxGTfSQjWgwFFjvoKduRmAowK8igc+wywCdQE+H/GvtKmvwL0A5/CTOIhvZ/Cu7xks42vEf7AYdtV4gbuRwdm+GXzL4sXMrlcB/5TgfQVeFw73NG5hK8pUX4EvuI6nWbUc4UPED44rtePKsQ5rlvAY6xhne5bifdBVIMH3ozIeYgPn8D2roFbNMg3+G6dwE9u4gL0MPsp6orVA+ikd4jW8xaXUoW3g0w55GvxOV3gpgyb8Cj5iFc+7wksZlOCPAv6zK7wkkOAXA/4MT/A+KkcXeFNgO4PvxnwNb3C1Zc/8N6qF8aTpe4UfmOBl+D/TpVHjb8GmTdyf9ZobhbcnsrXDuDhqA4y5sCON812rpG0fVAXbDJVBs+EGg8M/3G5Wb4J7uIcAAAAASUVORK5CYII=" style="width:24px;height:24px;display:block">';base64,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" style="width:24px;height:24px;object-fit:contain;display:block">';
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
        stage.dataset.eyedropActive='1';const live=document.getElementById('browCurrentSample');if(live){const er=edit.getBoundingClientRect();live.style.left=(er.left+er.width/2-19)+'px';live.style.top=(er.bottom+26)+'px';live.style.display='block';}
        stage.style.cursor='crosshair';
        stage.style.touchAction='none';

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
            marker.style.display='block';marker.style.left=ev.clientX+'px';marker.style.top=Math.max(42,ev.clientY-58)+'px';
            if(current)current.style.background=hex;const live=document.getElementById('browCurrentSample');if(live)live.style.background=hex;
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
          marker.style.display='none';const live=document.getElementById('browCurrentSample');if(live)live.style.display='none';stage.style.cursor='';delete stage.dataset.eyedropActive;eyedrop.style.background='#fff';
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
    let live=document.getElementById('browCurrentSample');if(!live){live=document.createElement('span');live.id='browCurrentSample';live.setAttribute('aria-label','스포이드 선택 색상');live.style.cssText='position:fixed;width:38px;height:38px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px #c8c8cc;background:#5b3b2e;display:none;z-index:2147482998;pointer-events:none';document.body.appendChild(live)}
    restorePalette();
    if(color){color.classList.remove('show');color.style.setProperty('display','none','important')}
    const hideBrowSheet=()=>{sheet.className='sheet level1';sheet.style.setProperty('height','0','important');if(design)design.style.display='none';if(rail)rail.style.display='none'};
    const pinEditTop=()=>requestAnimationFrame(()=>{const st=document.getElementById('stage');if(!st)return;const r=st.getBoundingClientRect();edit.style.setProperty('position','fixed','important');edit.style.setProperty('top',(r.top+6)+'px','important');edit.style.setProperty('bottom','auto','important');edit.style.setProperty('align-items','center','important')});
    const openBrow=()=>{if(live)live.style.display='none';if(color)color.classList.remove('show');layers.classList.remove('show');sheet.style.removeProperty('height');if(design)design.style.display='flex';if(rail)rail.style.display='none';sheet.className='sheet level2';pinEditTop()};
    const openColor=e=>{if(live)live.style.display='none';if(e){e.preventDefault();e.stopImmediatePropagation()}if(!document.querySelector('.brow.selected'))return;hideBrowSheet();layers.classList.remove('show');if(color){color.style.removeProperty('display');color.classList.add('show')}pinEditTop()};
    const openLayer=e=>{if(live)live.style.display='none';if(e){e.preventDefault();e.stopImmediatePropagation()}hideBrowSheet();const wasOpen=layers.classList.contains('show');if(color){color.classList.remove('show');color.style.setProperty('display','none','important')}layers.classList.toggle('show',!wasOpen);pinEditTop()};
    if(colorBtn)colorBtn.addEventListener('click',openColor,true);
    if(color){color.addEventListener('click',e=>{const rainbow=e.target.closest('.pickerwrap,.brow-rainbow');if(!rainbow)return;e.preventDefault();e.stopImmediatePropagation();openIosPicker()},true)}
    if(layerBtn)layerBtn.addEventListener('click',openLayer,true);if(browTab){browTab.addEventListener('pointerup',openBrow,true);browTab.addEventListener('click',openBrow,true)}window.addEventListener('resize',pinEditTop,{passive:true});pinEditTop();
  }
  function initAll(){loadIosPicker();initPanelFlow()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAll);else initAll();
})();