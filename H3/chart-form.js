(()=>{
'use strict';
const M=window.ChartModel,byId=id=>document.getElementById(id);
const type=new URLSearchParams(location.search).get('type'),config=Object.hasOwn(M.configs,type)?M.configs[type]:null;
if(!config){byId('main').textContent='차트를 찾을 수 없습니다. 홈에서 다시 선택해 주세요.';document.querySelectorAll('header button').forEach(b=>b.hidden=true);return;}
document.title=config.title+' · 화장수리';byId('chartTitle').textContent=config.title;
const form=byId('chartForm'),allFields=M.fieldsFor(type);
function makeField(f){
 const choice=!!f.options,wrap=document.createElement(choice?'fieldset':'label');wrap.className='field';wrap.dataset.field=f.id;
 if(choice&&f.options.some(x=>x.length>18))wrap.classList.add('long-options');
 const label=document.createElement(choice?'legend':'span');label.textContent=f.label;if(f.required){const tag=document.createElement('small');tag.className='required';tag.textContent='필수';label.append(tag);}wrap.append(label);
 if(choice){const options=document.createElement('div');options.className='options';f.options.forEach(value=>{const label=document.createElement('label');label.className='option';const input=document.createElement('input');input.type=f.kind==='radio'?'radio':'checkbox';input.name=f.id;input.value=value;label.append(input,document.createTextNode(value));options.append(label);});wrap.append(options);}
 else{const input=document.createElement(f.kind==='area'?'textarea':'input');input.id='field-'+f.id;input.name=f.id;if(input.tagName==='INPUT')input.type=['date','tel'].includes(f.kind)?f.kind:'text';else input.rows=f.rows||3;if(f.autocomplete)input.autocomplete=f.autocomplete;if(f.placeholder)input.placeholder=f.placeholder;if(f.inputmode)input.inputMode=f.inputmode;if(f.required){input.required=true;input.setAttribute('aria-required','true');}input.enterKeyHint=f.kind==='area'?'enter':'next';wrap.append(input);}
 return wrap;
}
for(const f of [...M.common,...config.customer])byId('customerFields').append(makeField(f));
for(const f of config.practitioner)byId('practitionerFields').append(makeField(f));
const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
const part=t=>parts.find(p=>p.type===t).value;form.elements.namedItem('date').value=`${part('year')}-${part('month')}-${part('day')}`;
function data(){const values={};for(const f of allFields){const controls=[...form.querySelectorAll(`[name="${f.id}"]`)];values[f.id]=f.kind==='multi'?controls.filter(x=>x.checked).map(x=>x.value):f.kind==='radio'?(controls.find(x=>x.checked)?.value||''):(controls[0]?.value||'').trim();}return values;}
let outputUrl=null,previewUrl=null,busy=false;
function invalidate(){if(outputUrl){URL.revokeObjectURL(outputUrl);outputUrl=null;}byId('saveResult').replaceChildren();byId('saveResult').hidden=true;byId('status').textContent='';}
function refreshConditions(){const d=data();for(const f of allFields){if(f.condition)form.querySelector(`[data-field="${f.id}"]`).hidden=!M.visible(f,d);}}
form.addEventListener('input',()=>{invalidate();refreshConditions();});form.addEventListener('change',()=>{invalidate();refreshConditions();});refreshConditions();
form.addEventListener('submit',e=>e.preventDefault());
byId('toPractitioner').addEventListener('click',()=>{byId('practitionerSection').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});});
for(const input of form.querySelectorAll('input[type=tel]'))input.addEventListener('input',()=>{const digits=input.value.replace(/\D/g,'');if(digits.startsWith('010')&&digits.length===11)input.value=digits.replace(/(\d{3})(\d{4})(\d{4})/,'$1-$2-$3');});
const canvas=()=>document.createElement('canvas');
function layer(d){return drawing.drawTo(M.renderOverlay(canvas(),M.build(type,d)));}
async function background(){const image=new Image();image.decoding='async';await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('원래 차트 양식을 불러오지 못했어요. 다시 시도해 주세요.'));image.src=`./charts/${type}.jpg?v=${M.VERSION}`;});return image;}
const drawingHost=document.createElement('div');byId('practitionerFields').before(drawingHost);
const drawing=window.ChartDrawing.create({type,host:drawingHost,onChange:invalidate,isBusy:()=>busy,loadBackground:background});
function status(message,error=false){byId('status').textContent=message;byId('status').classList.toggle('error',error);}
function setBusy(value){busy=value;for(const id of ['previewChart','saveChart','saveChartBottom'])byId(id).disabled=value;for(const control of form.querySelectorAll('input,textarea,button'))control.disabled=value;}
byId('previewChart').addEventListener('click',async()=>{
 if(busy)return;setBusy(true);status('작성본을 준비하고 있어요…');try{await document.fonts.ready;const overlay=layer(data()),image=await background();const preview=canvas();preview.width=M.W*2;preview.height=M.H*2;const ctx=preview.getContext('2d');ctx.drawImage(image,0,0,preview.width,preview.height);ctx.drawImage(overlay,0,0);const blob=await new Promise(resolve=>preview.toBlob(resolve,'image/jpeg',.94));if(!blob)throw new Error('미리보기를 만들지 못했어요. 다시 시도해 주세요.');if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=URL.createObjectURL(blob);byId('chartPreview').src=previewUrl;byId('previewStatus').textContent='PDF 저장 시 이 A4 양식에 입력 내용이 들어갑니다.';byId('previewDialog').showModal();status('');}catch(e){status(e.message||'미리보기를 만들지 못했어요.',true);}finally{setBusy(false);}
});
byId('closePreview').addEventListener('click',()=>byId('previewDialog').close());
function filename(d){const clean=s=>s.replace(/[\\/:*?"<>|\u0000-\u001f]/g,'').trim();const p=d.date.split('-');return `${p.length===3?`${p[0]}년 ${Number(p[1])}월 ${Number(p[2])}일 `:''}${clean(d.name)} ${config.title}.pdf`;}
async function save({preview=false,bundle=false}={}){
 if(busy)return;const d=data();if(!preview&&!d.name){status('고객 성함을 먼저 입력해 주세요.',true);const input=form.elements.namedItem('name');input.scrollIntoView({block:'center'});input.focus();return;}
 setBusy(true);status('원래 상담차트 양식에 작성 내용을 넣고 있어요…');
 try{await document.fonts.ready;const overlay=layer(d);if(!window.PDFLib)throw new Error('PDF 저장 기능을 불러오지 못했어요. 새로고침 후 다시 시도해 주세요.');const response=await fetch(`./charts/${type}.pdf?v=${M.VERSION}`);if(!response.ok)throw new Error('차트 양식을 불러오지 못했어요. 다시 시도해 주세요.');const pdf=await PDFLib.PDFDocument.load(await response.arrayBuffer());const page=pdf.getPages()[0];if(!page)throw new Error('차트 양식에 문제가 있어요.');const png=await pdf.embedPng(overlay.toDataURL('image/png'));page.drawImage(png,{x:0,y:0,width:page.getWidth(),height:page.getHeight()});const name=filename(d);pdf.setTitle(name.replace(/\.pdf$/,''));const bytes=await pdf.save();if(preview||bundle)return bytes;const blob=new Blob([bytes],{type:'application/pdf'}),file=new File([blob],name,{type:'application/pdf'});if(outputUrl)URL.revokeObjectURL(outputUrl);outputUrl=URL.createObjectURL(blob);const result=byId('saveResult');result.replaceChildren();const download=document.createElement('a');download.href=outputUrl;download.download=name;download.className='result-link primary';download.id='readyPdf';download.textContent='작성한 PDF 내려받기';const preview=document.createElement('a');preview.href=outputUrl;preview.target='_blank';preview.rel='noopener';preview.className='result-link';preview.id='previewPdf';preview.textContent='저장본 확인';result.append(download,preview);result.hidden=false;
 const share=async()=>{try{await navigator.share({files:[file],title:config.title});status('공유·저장 화면을 닫았어요. 선택한 위치에서 저장 여부를 확인해 주세요.');}catch(e){status(e.name==='AbortError'?'저장이 취소됐어요. 입력 내용은 화면에 남아 있어요.':'PDF 내려받기 버튼으로 저장해 주세요.');}};
 if(navigator.canShare?.({files:[file]})){const button=document.createElement('button');button.type='button';button.textContent='PDF 공유 / 파일에 저장';button.addEventListener('click',share);result.append(button);await share();}
 else{status('PDF를 만들었어요. ‘작성한 PDF 내려받기’를 눌러 저장해 주세요.');download.click();}
 result.scrollIntoView({behavior:'smooth',block:'center'});
 }catch(e){status(e.message||'PDF를 저장하지 못했어요. 다시 시도해 주세요.',true);}finally{setBusy(false);}
}
window.exportChartPdf=save;
byId('saveChart').addEventListener('click',save);byId('saveChartBottom').addEventListener('click',save);
})();

