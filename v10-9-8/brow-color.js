(() => {
  function initBrowColor(){
    const bar=document.getElementById('colorbar');
    if(!bar) return;
    const colors=bar.querySelector('#colors')||bar.querySelector('.colors');
    const picker=document.getElementById('colorpicker');
    if(!colors||!picker) return;

    const fixed=['#2b211f','#4a332b','#68483a','#211b1a','#8b4f12','#a76500','#9a7200'];
    const key='hwajang-brow-custom-7-v2';
    let custom;
    try{custom=JSON.parse(localStorage.getItem(key)||'null')}catch(e){}
    if(!Array.isArray(custom)||custom.length!==7) custom=Array(7).fill(null);

    [...colors.querySelectorAll('.swatch')].forEach(x=>x.remove());
    const pickerWrap=picker.closest('.pickerwrap');
    const grid=document.createElement('div');
    grid.className='brow-color-grid';
    grid.style.cssText='display:grid;grid-template-columns:repeat(7,32px);grid-template-rows:repeat(2,32px);gap:8px 9px;width:max-content;flex:0 0 auto';

    function paintSlot(b,c){
      if(c){b.dataset.browColor=c;b.style.background=c;b.classList.remove('empty')}
      else{delete b.dataset.browColor;b.style.background='#fff';b.classList.add('empty')}
    }
    function chip(c,editable,i){
      const b=document.createElement('button');
      b.type='button'; b.className='swatch '+(editable?'brow-custom':'brow-fixed');
      if(editable)b.dataset.slot=String(i);
      paintSlot(b,c);
      return b;
    }
    fixed.forEach(c=>grid.appendChild(chip(c,false,-1)));
    custom.forEach((c,i)=>grid.appendChild(chip(c,true,i)));
    colors.insertBefore(grid,pickerWrap||colors.firstChild);
    colors.style.overflowX='visible';
    colors.style.alignItems='center';
    if(pickerWrap){pickerWrap.style.flex='0 0 36px';pickerWrap.style.alignSelf='center'}

    const selected=()=>document.querySelector('.brow.selected');
    let editSlot=null,longPressTimer=null,longPressed=false;

    function markEditSlot(b){
      grid.querySelectorAll('.brow-custom').forEach(x=>x.style.outline='');
      editSlot=b;
      if(b) b.style.outline='2px solid #d94f7c';
    }

    function tint(brow,color){
      if(!brow||!color)return;
      const img=brow.querySelector('img');if(!img)return;
      if(!img.dataset.originalSrc)img.dataset.originalSrc=img.src;
      const source=img.dataset.originalSrc,hex=color.replace('#','');
      const tr=parseInt(hex.slice(0,2),16),tg=parseInt(hex.slice(2,4),16),tb=parseInt(hex.slice(4,6),16),src=new Image();
      src.onload=()=>{const cv=document.createElement('canvas');cv.width=src.naturalWidth;cv.height=src.naturalHeight;const ctx=cv.getContext('2d',{willReadFrequently:true});ctx.drawImage(src,0,0);const data=ctx.getImageData(0,0,cv.width,cv.height),p=data.data;for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const lum=(.299*p[i]+.587*p[i+1]+.114*p[i+2])/255,detail=.72+.28*lum;p[i]=Math.min(255,tr*detail);p[i+1]=Math.min(255,tg*detail);p[i+2]=Math.min(255,tb*detail)}ctx.putImageData(data,0,0);img.src=cv.toDataURL('image/png');brow.dataset.browColor=color};src.src=source;
    }

    grid.addEventListener('click',e=>{
      const b=e.target.closest('.swatch');if(!b)return;
      e.preventDefault();e.stopPropagation();
      if(longPressed){longPressed=false;return}
      if(b.classList.contains('brow-custom')) markEditSlot(b); else markEditSlot(null);
      if(b.dataset.browColor)tint(selected(),b.dataset.browColor);
    },true);

    const startLongPress=e=>{
      const b=e.target.closest('.brow-custom');if(!b)return;
      clearTimeout(longPressTimer);longPressed=false;
      longPressTimer=setTimeout(()=>{
        const i=Number(b.dataset.slot);custom[i]=null;localStorage.setItem(key,JSON.stringify(custom));
        paintSlot(b,null);markEditSlot(b);longPressed=true;
      },650);
    };
    const cancelLongPress=()=>{clearTimeout(longPressTimer);longPressTimer=null};
    grid.addEventListener('pointerdown',startLongPress,true);
    grid.addEventListener('pointerup',cancelLongPress,true);
    grid.addEventListener('pointercancel',cancelLongPress,true);
    grid.addEventListener('pointerleave',cancelLongPress,true);

    const picked=e=>{
      const c=e.target.value;
      tint(selected(),c);
      if(editSlot){
        const i=Number(editSlot.dataset.slot);
        custom[i]=c;localStorage.setItem(key,JSON.stringify(custom));paintSlot(editSlot,c);
      }
    };
    picker.addEventListener('input',picked,true);
    picker.addEventListener('change',picked,true);
  }

  function initEditbarDock(){
    const edit=document.getElementById('editbar');
    if(!edit)return;
    const style=document.createElement('style');
    style.textContent='.editbar{position:fixed!important;bottom:auto;align-items:flex-end!important;flex-wrap:nowrap!important}.editbar .nudge{align-self:flex-end}';
    document.head.appendChild(style);
    const gap=5;
    const visiblePanel=()=>{
      const candidates=[document.getElementById('colorbar'),document.getElementById('layers'),document.getElementById('sheet')];
      let best=null;
      for(const el of candidates){if(!el)continue;const cs=getComputedStyle(el),r=el.getBoundingClientRect();if(cs.display==='none'||cs.visibility==='hidden'||r.height<2)continue;if(!best||r.top<best.top)best=r}
      if(best)return best;const nav=document.querySelector('nav');return nav?nav.getBoundingClientRect():null;
    };
    const dock=()=>{if(!edit.classList.contains('show'))return;const r=visiblePanel();if(!r)return;edit.style.top='auto';edit.style.bottom=Math.max(0,window.innerHeight-r.top+gap)+'px'};
    const obs=new MutationObserver(()=>requestAnimationFrame(dock));
    [edit,document.getElementById('colorbar'),document.getElementById('layers'),document.getElementById('sheet')].filter(Boolean).forEach(el=>obs.observe(el,{attributes:true,attributeFilter:['class','style']}));
    window.addEventListener('resize',dock,{passive:true});window.addEventListener('orientationchange',()=>setTimeout(dock,120),{passive:true});document.addEventListener('click',()=>requestAnimationFrame(dock),true);requestAnimationFrame(dock);
  }

  function initAll(){initBrowColor();initEditbarDock()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAll);else initAll();
})();