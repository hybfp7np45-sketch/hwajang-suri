(()=>{
'use strict';
const KEY='suri-practitioner-profile-v1';
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(_){return null}}
function apply(){
 const p=read();if(!p)return;
 const names=new Set(['담당 시술자','시술자']);
 const shops=new Set(['상호','업소 상호','정보를 처리하는 업소명']);
 const phones=new Set(['업소 연락처','문의·철회 요청 연락처']);
 document.querySelectorAll('label.field').forEach(label=>{
  const title=label.querySelector('span')?.textContent.trim();
  const input=label.querySelector('input,textarea');if(!input)return;
  const value=names.has(title)?p.name:shops.has(title)?p.shop:phones.has(title)?p.phone:null;
  if(value!=null&&(!input.value||input.value===input.dataset.profileValue)){input.value=value;input.dataset.profileValue=value;input.dispatchEvent(new Event('input',{bubbles:true}));}
 });
 document.querySelectorAll('.sig').forEach(button=>{
  if(!/시술자/.test(button.getAttribute('aria-label')||''))return;
  if(button.querySelector('img')&&!button.dataset.profileSignature)return;
  if(p.signature){const img=new Image();img.src=p.signature;img.alt='시술자 서명';button.replaceChildren(img);button._strokes=p.strokes||[];button.dataset.profileSignature='1';}
 });
}
document.addEventListener('click',e=>{const b=e.target.closest?.('.sig');if(b)delete b.dataset.profileSignature;});
window.PractitionerProfile={read,apply};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
window.addEventListener('storage',e=>{if(e.key===KEY)apply()});
const host=document.querySelector('.library-header-actions');if(!host)return;
const style=document.createElement('style');style.textContent=`
#practitionerDialog,#profileSignDialog{box-sizing:border-box;width:min(94vw,480px);max-height:90dvh;overflow:auto;border:1px solid #b9dce9;border-radius:20px;padding:20px;background:#f6fcff;color:#233744;font:15px/1.5 -apple-system,BlinkMacSystemFont,sans-serif}
#practitionerDialog::backdrop,#profileSignDialog::backdrop{background:#17374866}
#practitionerDialog h2,#profileSignDialog h2{margin:0 0 16px;font-size:20px}
#practitionerDialog label{display:block;margin:12px 0}
#practitionerDialog input{box-sizing:border-box;display:block;width:100%;margin-top:5px;padding:11px;font-size:16px;border:1px solid #bfd7e4;border-radius:10px;background:white;color:#233744}
#practitionerDialog button,#profileSignDialog button,#openPractitioner{font:inherit;touch-action:manipulation;border:1px solid #b9dce9;border-radius:10px;padding:9px 13px;background:#eaf6fd;color:#287fa9}
#practitionerDialog .profile-actions,#profileSignDialog .profile-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}
#practitionerDialog .profile-primary,#profileSignDialog .profile-primary{background:#287fa9;color:white;border-color:#287fa9}
#profileSignature{width:100%;height:92px;background:white!important;border-style:dashed!important}
#profileSignature img{width:100%;height:70px;object-fit:contain}
#practitionerDialog p{font-size:12px;color:#607d8b}
#profileSignDialog{width:min(96vw,740px);padding:16px}
#profileSignCanvas{display:block;width:100%;height:clamp(180px,45dvh,370px);background:white;border:1px solid #bfd7e4;border-radius:12px;touch-action:none}
.library-header-actions{display:flex;gap:7px;align-items:center;flex-wrap:wrap}
`;document.head.append(style);
const open=document.createElement('button');open.type='button';open.id='openPractitioner';open.textContent='시술자 정보';host.prepend(open);
const dialog=document.createElement('dialog');dialog.id='practitionerDialog';
dialog.innerHTML='<h2>시술자 정보</h2><form id="practitionerProfileForm"><label>시술자 이름<input name="name" maxlength="60" autocomplete="name"></label><label>상호명<input name="shop" maxlength="100" autocomplete="organization"></label><label>연락처<input name="phone" type="tel" maxlength="40" autocomplete="tel"></label><label>시술자 사인</label><button type="button" id="profileSignature">눌러서 사인하기</button><p>이 기기·브라우저에 저장되며, 동의서의 해당 항목에 자동으로 들어갑니다.</p><p id="profileStatus" role="status"></p><div class="profile-actions"><button type="button" id="profileCancel">닫기</button><button class="profile-primary" type="submit">저장하기</button></div></form>';
document.body.append(dialog);
const sign=document.createElement('dialog');sign.id='profileSignDialog';
sign.innerHTML='<h2>시술자 사인</h2><canvas id="profileSignCanvas" aria-label="손가락으로 사인하는 영역"></canvas><div class="profile-actions"><button type="button" id="profileSignClear">지우기</button><button type="button" id="profileSignCancel">취소</button><button type="button" id="profileSignDone" class="profile-primary">적용하기</button></div>';
document.body.append(sign);
const form=dialog.querySelector('form'),preview=dialog.querySelector('#profileSignature'),canvas=sign.querySelector('canvas'),ctx=canvas.getContext('2d');
let signature='',savedStrokes=[],strokes=[],active=null,pointer=null;
function showPreview(){preview.replaceChildren();if(signature){const img=new Image();img.src=signature;img.alt='저장할 시술자 사인';preview.append(img)}else preview.textContent='눌러서 사인하기'}
open.onclick=()=>{const p=read()||{};['name','shop','phone'].forEach(k=>form.elements[k].value=p[k]||'');signature=p.signature||'';savedStrokes=p.strokes||[];showPreview();dialog.querySelector('#profileStatus').textContent='';dialog.showModal()};
dialog.querySelector('#profileCancel').onclick=()=>dialog.close();
function draw(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,3);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,r.width,r.height);ctx.strokeStyle=ctx.fillStyle='#233744';ctx.lineWidth=2.5;ctx.lineCap=ctx.lineJoin='round';for(const s of strokes){if(!s.length)continue;ctx.beginPath();ctx.arc(s[0].x*r.width,s[0].y*r.height,1.25,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(s[0].x*r.width,s[0].y*r.height);s.slice(1).forEach(p=>ctx.lineTo(p.x*r.width,p.y*r.height));ctx.stroke()}}
preview.onclick=()=>{strokes=JSON.parse(JSON.stringify(savedStrokes));sign.showModal();requestAnimationFrame(draw)};
canvas.onpointerdown=e=>{if(pointer!==null)return;e.preventDefault();pointer=e.pointerId;canvas.setPointerCapture(pointer);active=[];strokes.push(active);point(e)};
function point(e){const r=canvas.getBoundingClientRect();active.push({x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))});draw()}
canvas.onpointermove=e=>{if(e.pointerId!==pointer||!active)return;e.preventDefault();point(e)};
function end(e){if(e.pointerId===pointer){pointer=null;active=null}}
canvas.onpointerup=end;canvas.onpointercancel=end;canvas.onlostpointercapture=end;
sign.querySelector('#profileSignClear').onclick=()=>{strokes=[];active=null;pointer=null;draw()};
sign.querySelector('#profileSignCancel').onclick=()=>sign.close();
sign.querySelector('#profileSignDone').onclick=()=>{signature=strokes.length?canvas.toDataURL('image/png'):'';savedStrokes=JSON.parse(JSON.stringify(strokes));showPreview();sign.close()};
sign.addEventListener('close',()=>{pointer=null;active=null});
window.addEventListener('resize',()=>{if(sign.open)draw()});
form.onsubmit=e=>{e.preventDefault();const p={name:form.elements.name.value.trim(),shop:form.elements.shop.value.trim(),phone:form.elements.phone.value.trim(),signature,strokes:savedStrokes};try{localStorage.setItem(KEY,JSON.stringify(p));apply();dialog.close();const notice=document.getElementById('documentLibraryNotice');if(notice)notice.textContent='시술자 정보를 저장했어요.'}catch(_){dialog.querySelector('#profileStatus').textContent='저장 공간을 사용할 수 없어요. 브라우저 설정을 확인해 주세요.'}};
})();
