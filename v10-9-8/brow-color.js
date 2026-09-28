(() => {
  function initBrowColor(){
    const bar=document.getElementById('colorbar');
    if(!bar) return;
    const colors=bar.querySelector('#colors')||bar.querySelector('.colors');
    const picker=document.getElementById('colorpicker');
    if(!colors||!picker) return;

    const fixed=['#2b211f','#4a332b','#68483a','#211b1a','#8b4f12','#a76500','#9a7200'];
    const defaults=['#342824','#5a3c30','#76503f','#2c2422','#4d332b','#805b49','#3b2c28'];
    const key='hwajang-brow-custom-7-v1';
    let custom;
    try{custom=JSON.parse(localStorage.getItem(key)||'null')}catch(e){}
    if(!Array.isArray(custom)||custom.length!==7) custom=defaults.slice();

    // Keep the picker control, rebuild the palette as fixed 7 + editable 7.
    [...colors.querySelectorAll('.swatch')].forEach(x=>x.remove());
    const pickerWrap=picker.closest('.pickerwrap');
    const grid=document.createElement('div');
    grid.className='brow-color-grid';
    grid.style.cssText='display:grid;grid-template-columns:repeat(7,32px);gap:9px;width:max-content;flex:0 0 auto';

    function chip(c,editable,i){
      const b=document.createElement('button');
      b.type='button'; b.className='swatch '+(editable?'brow-custom':'brow-fixed');
      b.dataset.browColor=c; b.style.background=c;
      if(editable)b.dataset.slot=String(i);
      return b;
    }
    fixed.forEach(c=>grid.appendChild(chip(c,false,-1)));
    custom.forEach((c,i)=>grid.appendChild(chip(c,true,i)));
    colors.insertBefore(grid,pickerWrap||colors.firstChild);
    colors.style.overflowX='visible';
    if(pickerWrap){pickerWrap.style.flex='0 0 36px';pickerWrap.style.alignSelf='center'}

    const selected=()=>document.querySelector('.brow.selected');
    let editSlot=null,longTimer=null,longStart=null;

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
      tint(selected(),b.dataset.browColor);
    },true);

    // Editable second row: long-press a chip to replace that saved color.
    grid.addEventListener('pointerdown',e=>{
      const b=e.target.closest('.brow-custom');if(!b)return;
      longStart={x:e.clientX,y:e.clientY,b};
      longTimer=setTimeout(()=>{editSlot=b;picker.value=b.dataset.browColor;picker.click();longTimer=null},500);
    },true);
    const cancelLong=e=>{if(longTimer){clearTimeout(longTimer);longTimer=null}longStart=null};
    grid.addEventListener('pointermove',e=>{if(longStart&&(Math.abs(e.clientX-longStart.x)>8||Math.abs(e.clientY-longStart.y)>8))cancelLong()},true);
    grid.addEventListener('pointerup',cancelLong,true);grid.addEventListener('pointercancel',cancelLong,true);

    // Rainbow picker changes the brow immediately. If opened by long-pressing a second-row chip,
    // that slot is also replaced and saved persistently.
    const picked=e=>{
      const c=e.target.value;tint(selected(),c);
      if(editSlot){
        const i=Number(editSlot.dataset.slot);
        custom[i]=c;localStorage.setItem(key,JSON.stringify(custom));
        editSlot.dataset.browColor=c;editSlot.style.background=c;
      }
    };
    picker.addEventListener('input',picked,true);
    picker.addEventListener('change',e=>{picked(e);editSlot=null},true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initBrowColor);else initBrowColor();
})();