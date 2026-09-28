(() => {
  function initBrowColor(){
    const bar=document.getElementById('colorbar');
    if(!bar) return;
    const colors=bar.querySelector('#colors')||bar.querySelector('.colors');
    if(!colors) return;
    const presets=[['#2b211f','다크브라운'],['#4a332b','브라운'],['#68483a','라이트브라운'],['#211b1a','블랙브라운']];
    if(!colors.querySelector('.brow-preset')) presets.slice().reverse().forEach(([c,n])=>{const b=document.createElement('button');b.type='button';b.className='swatch brow-preset';b.dataset.browColor=c;b.style.background=c;b.setAttribute('aria-label',n);colors.insertBefore(b,colors.firstChild)});
    const selected=()=>document.querySelector('.brow.selected');
    function tint(brow,color){
      if(!brow) return; const img=brow.querySelector('img'); if(!img) return;
      if(!img.dataset.originalSrc) img.dataset.originalSrc=img.src;
      const source=img.dataset.originalSrc,hex=color.replace('#','');
      const tr=parseInt(hex.slice(0,2),16),tg=parseInt(hex.slice(2,4),16),tb=parseInt(hex.slice(4,6),16),src=new Image();
      src.onload=()=>{const cv=document.createElement('canvas');cv.width=src.naturalWidth;cv.height=src.naturalHeight;const ctx=cv.getContext('2d',{willReadFrequently:true});ctx.drawImage(src,0,0);const data=ctx.getImageData(0,0,cv.width,cv.height),p=data.data;for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const lum=(.299*p[i]+.587*p[i+1]+.114*p[i+2])/255,detail=.35+.65*lum;p[i]=Math.min(255,tr*detail);p[i+1]=Math.min(255,tg*detail);p[i+2]=Math.min(255,tb*detail)}ctx.putImageData(data,0,0);img.src=cv.toDataURL('image/png');brow.dataset.browColor=color};src.src=source;
    }
    colors.addEventListener('click',e=>{const b=e.target.closest('.brow-preset');if(!b)return;e.preventDefault();e.stopPropagation();tint(selected(),b.dataset.browColor)},true);
    const picker=document.getElementById('colorpicker');if(picker)picker.addEventListener('input',e=>tint(selected(),e.target.value),true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initBrowColor);else initBrowColor();
})();