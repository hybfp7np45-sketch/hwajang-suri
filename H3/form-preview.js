import * as pdfjs from './vendor/pdf.min.mjs';
pdfjs.GlobalWorkerOptions.workerSrc='./vendor/pdf.worker.min.mjs';

const button=document.getElementById('previewForm'),status=document.getElementById('status');
const style=document.createElement('style');
style.textContent=`
#formPreviewDialog{position:fixed;inset:0;margin:auto;width:min(96vw,900px);max-width:96vw;height:calc(100dvh - 24px);max-height:calc(100dvh - 24px);padding:0;overflow:hidden;background:#eaf6fc;overscroll-behavior:contain}
#formPreviewDialog .preview-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;background:#eaf6fc;border-bottom:1px solid #ccdce6}
#formPreviewDialog h2{font-size:16px;border:0;margin:0}
#formPreviewDialog .preview-content{overflow:auto;height:calc(100% - 66px);padding:12px;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
#formPreviewDialog figure{margin:0 0 18px}
#formPreviewDialog canvas{display:block;width:100%;height:auto;background:white;box-shadow:0 2px 12px #18354818}
#formPreviewDialog figcaption,#formPreviewDialog .preview-note{font-size:12px;text-align:center;color:#536b79;margin:8px 0}
`;
document.head.append(style);
const dialog=document.createElement('dialog');dialog.id='formPreviewDialog';dialog.setAttribute('aria-labelledby','formPreviewTitle');
dialog.innerHTML='<div class="preview-heading"><h2 id="formPreviewTitle">저장되는 작성본</h2><button type="button" id="closeFormPreview">닫기</button></div><div class="preview-content"><p class="preview-note">PDF로 저장되는 문서 형태입니다. 미작성 항목도 미리 볼 수 있어요.</p><div id="formPreviewPages"></div></div>';
document.body.append(dialog);
let busy=false,scrollY=0,bodyStyle=null;
function unlock(){if(bodyStyle===null)return;document.body.style.cssText=bodyStyle;bodyStyle=null;window.scrollTo(0,scrollY);}
dialog.addEventListener('close',unlock);
dialog.querySelector('#closeFormPreview').addEventListener('click',()=>dialog.close());
button.addEventListener('click',async()=>{
 if(busy)return;busy=true;
 const controls=[button,document.getElementById('print')];
 const previous=controls.map(x=>x.disabled);controls.forEach(x=>x.disabled=true);
 status.textContent='작성본 미리보기를 만들고 있어요…';let pdf;
 try{
  const bytes=await window.exportOriginalPdf({preview:true});if(!bytes)return;
  pdf=await pdfjs.getDocument({data:bytes}).promise;
  const pages=document.createDocumentFragment();
  for(let index=1;index<=pdf.numPages;index++){
   const page=await pdf.getPage(index),base=page.getViewport({scale:1}),viewport=page.getViewport({scale:Math.min(2,1600/base.width)});
   const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);canvas.setAttribute('role','img');canvas.setAttribute('aria-label',document.querySelector('#paper h1').textContent+' 작성본 '+index+'쪽');
   await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
   const figure=document.createElement('figure'),caption=document.createElement('figcaption');caption.textContent=index+' / '+pdf.numPages+'쪽';figure.append(canvas,caption);pages.append(figure);page.cleanup();
  }
  dialog.querySelector('#formPreviewPages').replaceChildren(pages);
  dialog.querySelector('.preview-content').scrollTop=0;
  scrollY=window.scrollY;bodyStyle=document.body.style.cssText;
  Object.assign(document.body.style,{position:'fixed',top:-scrollY+'px',left:'0',right:'0',width:'100%',overflow:'hidden'});
  dialog.showModal();status.textContent='';
 }catch(error){unlock();status.textContent=error.message||'미리보기를 만들지 못했어요. 다시 시도해 주세요.';}
 finally{if(pdf)await pdf.destroy();busy=false;controls.forEach((x,i)=>x.disabled=previous[i]);}
});
