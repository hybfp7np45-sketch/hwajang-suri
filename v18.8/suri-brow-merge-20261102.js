/* 화장수리 v18.8 기존 눈썹 복구 통합. 원본 사진 및 새 디자인 이미지 비파괴. */
(function(){
'use strict';
const photo=document.getElementById('photo'),world=document.getElementById('world'),stage=document.getElementById('stage');
const toolbar=document.querySelector('.edit-guidebar');
if(!photo||!world||!stage||!toolbar)return;
const css=document.createElement('style');css.id='suri-brow-merge-css';css.textContent=[
'#app{grid-template-rows:58px minmax(0,1fr) 76px!important}',
'#bottomControls{height:76px!important}',
'#eraserPanelSlot{bottom:76px!important}',
'.edit-guidebar{height:38px!important;flex-wrap:nowrap!important;gap:6px!important;padding:0 4px!important;justify-content:center!important}',
'#suriBrowTopToolbar{position:absolute;top:8px;left:7px;right:7px;z-index:2147482000;display:flex;gap:4px;justify-content:center;align-items:center;pointer-events:none}',
'#suriBrowTopToolbar button{pointer-events:auto;touch-action:manipulation;border:1px solid #cde9f8;color:#348eb1;background:rgba(250,254,255,.94);font-size:10px!important;font-weight:700;white-space:nowrap;border-radius:12px;height:27px;padding:0 6px;flex:1 1 auto;min-width:0;box-shadow:0 1px 4px #0002}',
'#suriBrowTopToolbar #globalUndoV185{min-width:55px!important;padding:0 5px!important}',
'#suriBrowTopToolbar #editGuideToggle.on{background:#dff5fd!important}',
'#suriCompare{position:absolute!important;left:50%!important;bottom:12px!important;transform:translateX(-50%);z-index:2147482500!important;border:1px solid #b3d9eb!important;border-radius:16px!important;background:rgba(255,255,255,.90)!important;box-shadow:0 2px 8px #0002!important;color:#2c83a7!important;min-width:90px!important;height:29px!important;touch-action:none!important;font-size:11px!important;font-weight:700!important}',
'#suriManualDone{position:absolute;right:8px;top:44px;z-index:2147482800;background:#e7f8fe;border:1px solid #83d4ec;border-radius:11px;height:32px;padding:0 12px;color:#217fa4;font-size:11px;font-weight:700}',
'#suriSeparate,#suriHairErase,#suriCompare{font-size:10px!important;min-width:0!important;padding:0 6px!important;white-space:nowrap!important;border:1px solid #c9eaf8!important;background:#f4fbff!important;color:#348db3!important;border-radius:12px!important;height:26px!important;font-weight:700!important}',
'#suriSeparate.busy{animation:suriBrowPulse .8s infinite alternate}',
'@keyframes suriBrowPulse{from{opacity:1}to{opacity:.34}}',
'.brow .rh.rot{top:auto!important;bottom:-28px!important;left:calc(50% - 7px)!important;width:14px!important;height:14px!important}',
'.brow .rh.rot:before{font-size:12px!important;line-height:18px!important}',
'.brow .rh.del{top:-19px!important;right:-4px!important;width:10px!important;height:10px!important;background:#d94f7c!important;opacity:1!important;border-radius:3px!important}',
'.brow .rh.del:before{color:#fff!important;font-size:10px!important;line-height:10px!important}',
'#suriRotationReadout{display:none;position:fixed;z-index:2147483601;bottom:calc(145px + env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);background:#fff;border:1px solid #d3eefa;border-radius:7px;padding:3px 9px;color:#3695bd;font:700 12px/18px sans-serif;pointer-events:none;box-shadow:0 2px 7px #0002}',
'#suriHairPanel{display:none;position:absolute;left:0;right:0;bottom:0;z-index:2147483000;background:#fff;padding:8px 10px calc(8px + env(safe-area-inset-bottom));box-shadow:0 -5px 16px #0002;border-radius:15px 15px 0 0;font:12px sans-serif}',
'#suriHairPanel.show{display:grid;gap:7px}',
'#suriHairPanel .toolbar{display:flex;justify-content:space-between;gap:7px;align-items:center}',
'#suriHairPanel button{min-height:30px;border-radius:8px;background:#e9f8fe;border:1px solid #b6e4f5;color:#348eb1;padding:4px 8px;font-weight:700}',
'#suriHairPanel label{display:flex;align-items:center;gap:8px}',
'#suriHairPanel input{flex:1}',
'#suriHairStatus{position:absolute;z-index:2147482600;left:8px;right:8px;top:40px;text-align:center;font:600 11px sans-serif;color:#2385a9;pointer-events:none;text-shadow:0 1px 3px white}',
'#suriManualTip{display:none;position:absolute;z-index:2147483600;top:82px;left:8px;right:8px;background:#fffffff0;padding:8px;border-radius:10px;text-align:center;font:12px sans-serif;color:#157d9e}',
'#suriManualTip.show{display:block}',
'body.suri-hair-edit #browErasePanel,body.suri-hair-edit #browErasePanelV133{display:none!important}'
].join('');document.head.appendChild(css);
function button(id,text,parent){const b=document.createElement('button');b.id=id;b.type='button';b.textContent=text;(parent||stage).appendChild(b);return b;}
// Keep the original 18.8 bottom area exactly as it was. Put editing actions on the photo top.
const topbar=document.createElement('div');topbar.id='suriBrowTopToolbar';stage.appendChild(topbar);
const undo=document.getElementById('globalUndoV185'),guide=document.getElementById('editGuideToggle');
if(guide)topbar.appendChild(guide);if(undo)topbar.appendChild(undo);
const separate=button('suriSeparate','기존 눈썹 분리',topbar);
const eraseButton=button('suriHairErase','기존 눈썹 지우기',topbar);
const compare=button('suriCompare','원본 보기',stage);
compare.setAttribute('aria-label','누르고 있는 동안 사진 원본 보기');
const rotation=document.createElement('div');rotation.id='suriRotationReadout';rotation.textContent='0°';document.body.appendChild(rotation);
const status=document.createElement('div');status.id='suriHairStatus';stage.appendChild(status);
const panel=document.createElement('div');panel.id='suriHairPanel';panel.innerHTML='<div class="toolbar"><strong>기존 눈썹만 지우기</strong><button id="suriHairUndo" type="button">되돌리기</button><button id="suriHairDone" type="button">완료</button></div><label>브러시 <input id="suriHairSize" type="range" min="1" max="50" value="24"><output id="suriHairSizeLabel">24</output> px</label><label>지우기 강도 <input id="suriHairStrength" type="range" min="10" max="100" value="70"><output id="suriHairStrengthLabel">70</output>%</label><small>새로 불러온 눈썹 디자인에는 적용되지 않습니다. 두 손가락 확대 가능.</small>';
document.getElementById('bottomControls').appendChild(panel);
const tip=document.createElement('div');tip.id='suriManualTip';tip.textContent='얼굴 자동 인식에 실패했습니다. 사진에서 눈썹 두 곳을 각각 드래그해 지정하세요.';stage.appendChild(tip);
const manualDone=button('suriManualDone','영역 지정 완료',stage);manualDone.style.display='none';
const hair=document.createElement('canvas');hair.id='suriExistingHairTop';hair.style.cssText='position:absolute;z-index:100000;pointer-events:none;display:none;image-rendering:auto';
const skin=document.createElement('canvas');skin.id='suriExistingSkinRepair';skin.style.cssText='position:absolute;z-index:7;pointer-events:none;display:none';
const selection=document.createElement('canvas');selection.id='suriExistingManualSelection';selection.style.cssText='position:absolute;z-index:100002;display:none;touch-action:none';
world.append(skin,hair,selection);
window.suriExistingHairLayerCanvas=hair;
window.suriExistingSkinLayerCanvas=skin;
let original=null,sourcePixels=null,cleanPixels=null,regionMask=null,active=false,editing=false,manual=false,working=false,seq=0;
let history=[],pointers=new Map(),activePointer=null,last=null,zoomStart=null,manualStart=null,manualIndex=null,manualAreas=[];
const sizeInput=document.getElementById('suriHairSize'),strengthInput=document.getElementById('suriHairStrength');
for(const [inp,label] of [[sizeInput,'suriHairSizeLabel'],[strengthInput,'suriHairStrengthLabel']])inp.oninput=()=>document.getElementById(label).textContent=inp.value;
function say(s){status.textContent=s||'';}
function place(){
 const w=Math.max(1,photo.offsetWidth),h=Math.max(1,photo.offsetHeight),x=photo.offsetLeft,y=photo.offsetTop;
 for(const c of [hair,skin,selection]){c.style.left=x+'px';c.style.top=y+'px';c.style.width=w+'px';c.style.height=h+'px';}
}
function clear(){
 seq++;active=false;working=false;manual=false;editing=false;history=[];manualAreas=[];regionMask=null;original=sourcePixels=cleanPixels=null;
 hair.style.display=skin.style.display=selection.style.display='none';hair.width=hair.height=skin.width=skin.height=selection.width=selection.height=0;
 manualDone.style.display='none';tip.classList.remove('show');separate.classList.remove('busy');separate.textContent='기존 눈썹 분리';panel.classList.remove('show');document.body.classList.remove('suri-hair-edit');say('');
}
photo.addEventListener('load',()=>{clear();place();});
new ResizeObserver(place).observe(stage);
function showHair(){active=true;hair.style.display='block';skin.style.display='block';selection.style.display='none';manual=false;manualDone.style.display='none';tip.classList.remove('show');separate.textContent='분리 완료 ✓';say('기존 눈썹 분리 완료 · 기존 눈썹 고정 (맨 위)');setTimeout(()=>{if(active&&!editing)say('')},3500);}
function drawManual(){
 const c=selection.getContext('2d');c.clearRect(0,0,selection.width,selection.height);c.save();c.strokeStyle='#23aadd';c.lineWidth=Math.max(2,selection.width/450);c.fillStyle='#38b1e84a';
 for(const r of manualAreas){c.beginPath();c.ellipse(r.x,r.y,Math.max(3,r.rx),Math.max(3,r.ry),0,0,2*Math.PI);c.fill();c.stroke();}
 c.restore();
}
function coords(e){const r=selection.getBoundingClientRect();return {x:(e.clientX-r.left)*selection.width/Math.max(1,r.width),y:(e.clientY-r.top)*selection.height/Math.max(1,r.height)};}
function manualMode(reason){
 manual=true;working=false;separate.classList.remove('busy');separate.textContent='수동 분리 중';manualAreas=[];tip.classList.add('show');manualDone.style.display='inline-block';if(reason)console.warn('Automatic brow selection unavailable:',reason);
 selection.style.display='block';selection.style.pointerEvents='auto';drawManual();say('자동 인식 불가 · 눈썹 영역을 손가락으로 지정 후 [영역 지정 완료]');
}
selection.addEventListener('pointerdown',e=>{if(!manual||e.pointerType==='mouse'&&e.button!==0)return;e.preventDefault();e.stopPropagation();selection.setPointerCapture(e.pointerId);manualStart=coords(e);manualIndex=Math.min(1,manualAreas.length);});
selection.addEventListener('pointermove',e=>{if(!manualStart)return;e.preventDefault();e.stopPropagation();const p=coords(e);const r={x:(p.x+manualStart.x)/2,y:(p.y+manualStart.y)/2,rx:Math.abs(p.x-manualStart.x)/2,ry:Math.abs(p.y-manualStart.y)/2};manualAreas[manualIndex]=r;drawManual();});
selection.addEventListener('pointerup',e=>{if(!manualStart)return;e.preventDefault();e.stopPropagation();const p=coords(e);const r={x:(p.x+manualStart.x)/2,y:(p.y+manualStart.y)/2,rx:Math.max(10,Math.abs(p.x-manualStart.x)/2),ry:Math.max(6,Math.abs(p.y-manualStart.y)/2)};manualAreas[manualIndex]=r;manualStart=null;manualIndex=null;drawManual();});
async function faceRegions(){
 // Detect at reduced size so full-resolution iPhone photos do not stall FaceMesh.
 if(!window.FaceMesh)throw Error('자동 얼굴 인식 모듈 없음');
 const detector=new window.FaceMesh({locateFile:f=>'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/'+f});
 detector.setOptions({maxNumFaces:1,staticImageMode:true,minDetectionConfidence:.45,refineLandmarks:false});
 const preview=document.createElement('canvas');
 const scale=Math.min(1,720/Math.max(photo.naturalWidth,photo.naturalHeight));
 preview.width=Math.max(1,Math.round(photo.naturalWidth*scale));
 preview.height=Math.max(1,Math.round(photo.naturalHeight*scale));
 preview.getContext('2d').drawImage(photo,0,0,preview.width,preview.height);
 let timeout;
 try{
  const points=await Promise.race([
   new Promise((resolve,reject)=>{detector.onResults(r=>resolve(r.multiFaceLandmarks?.[0]||null));Promise.resolve(detector.send({image:preview})).catch(reject);}),
   new Promise((_,reject)=>{timeout=setTimeout(()=>reject(Error('자동 얼굴 인식 시간 초과')),9000);})
  ]);
  if(!points)throw Error('얼굴 인식 실패');
  const sets=[[70,63,105,66,107,55,65,52,53,46],[300,293,334,296,336,285,295,282,283,276]];
  return sets.map(ids=>{const a=ids.map(k=>points[k]);const xmin=Math.min(...a.map(p=>p.x)),xmax=Math.max(...a.map(p=>p.x)),ymin=Math.min(...a.map(p=>p.y)),ymax=Math.max(...a.map(p=>p.y)),bw=(xmax-xmin)*original.width,bh=(ymax-ymin)*original.height;return {x:(xmin+xmax)*original.width/2,y:(ymin+ymax)*original.height/2,rx:Math.max(9,bw*.65),ry:Math.max(bh*.95,bw*.16)};});
 }finally{clearTimeout(timeout);try{detector.close()}catch(e){}}
}
async function setup(){
 if(!photo.complete||!photo.naturalWidth)throw Error('먼저 사진을 불러와 주세요');
 place();
 const rate=Math.min(1,1600/Math.max(photo.naturalWidth,photo.naturalHeight));
 const w=Math.max(1,Math.round(photo.naturalWidth*rate)),h=Math.max(1,Math.round(photo.naturalHeight*rate));
 for(const c of [hair,skin,selection]){c.width=w;c.height=h;}
 const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(photo,0,0,w,h);
 original=c;sourcePixels=ctx.getImageData(0,0,w,h);
}
function makeMask(regions){
 const c=document.createElement('canvas');c.width=original.width;c.height=original.height;const ctx=c.getContext('2d');
 ctx.fillStyle='white';for(const r of regions){ctx.beginPath();ctx.ellipse(r.x,r.y,Math.max(2,r.rx),Math.max(2,r.ry),0,0,Math.PI*2);ctx.fill();}
 const data=ctx.getImageData(0,0,c.width,c.height).data,mask=new Uint8Array(c.width*c.height);
 for(let i=0;i<mask.length;i++)mask[i]=data[i*4+3];return mask;
}
async function compute(regions,job){
 const w=original.width,h=original.height,n=w*h,src=sourcePixels.data;
 regionMask=makeMask(regions);const lum=new Float32Array(n),integral=new Float64Array((w+1)*(h+1));
 for(let p=0;p<n;p++){const k=p*4;lum[p]=.299*src[k]+.587*src[k+1]+.114*src[k+2]}
 for(let y=1;y<=h;y++){let row=0;for(let x=1;x<=w;x++){row+=lum[(y-1)*w+x-1];integral[y*(w+1)+x]=integral[(y-1)*(w+1)+x]+row;}}
 const avg=(x,y,r)=>{const x0=Math.max(0,x-r),x1=Math.min(w-1,x+r),y0=Math.max(0,y-r),y1=Math.min(h-1,y+r),st=w+1;return(integral[(y1+1)*st+x1+1]-integral[y0*st+x1+1]-integral[(y1+1)*st+x0]+integral[y0*st+x0])/((x1-x0+1)*(y1-y0+1));};
 const out=new ImageData(w,h);const d=out.data;
 for(let y=3;y<h-3;y++){
  for(let x=3;x<w-3;x++){const p=y*w+x;if(!regionMask[p])continue;const v=lum[p],local=avg(x,y,4),wide=avg(x,y,12);let ridge=0;
   for(const [dx,dy] of [[1,0],[0,1],[1,1],[1,-1]]){const a=lum[(y+dy*2)*w+x+dx*2],b=lum[(y-dy*2)*w+x-dx*2];ridge=Math.max(ridge,Math.min(a,b)-v);}
   const contrast=Math.max(0,local-v,wide-v-2),signal=Math.max(contrast*.93,ridge*.8+contrast*.32),alpha=Math.min(1,Math.max(0,(signal-7)/13));
   const k=p*4;d[k]=src[k];d[k+1]=src[k+1];d[k+2]=src[k+2];d[k+3]=Math.round(255*Math.pow(alpha,.8)*regionMask[p]/255);}
  if(y%200===0){if(job!==seq)return;await new Promise(r=>requestAnimationFrame(r));}
 }
 if(job!==seq)return;
 hair.getContext('2d',{willReadFrequently:true}).putImageData(out,0,0);
 // Keep a separate skin-repair source that is revealed only by the existing-brow eraser.
 // Use skin pixels sampled immediately above/below each ROI, not a flat solid color.
 cleanPixels=new Uint8ClampedArray(n*4);
 for(const r of regions){
  const minX=Math.max(0,Math.floor(r.x-r.rx)),maxX=Math.min(w-1,Math.ceil(r.x+r.rx));
  const minY=Math.max(0,Math.floor(r.y-r.ry)),maxY=Math.min(h-1,Math.ceil(r.y+r.ry));
  for(let x=minX;x<=maxX;x++){
   const ya=Math.max(0,Math.floor(minY-Math.max(4,r.ry*.32))),yb=Math.min(h-1,Math.ceil(maxY+Math.max(4,r.ry*.34)));
   for(let y=minY;y<=maxY;y++){const p=y*w+x;if(!regionMask[p])continue;const a=Math.max(0,Math.min(1,(y-minY)/Math.max(1,maxY-minY))),p0=(ya*w+x)*4,p1=(yb*w+x)*4,k=p*4;
    for(let c=0;c<3;c++)cleanPixels[k+c]=Math.round(src[p0+c]*(1-a)+src[p1+c]*a);
    cleanPixels[k+3]=255;
   }
  }
 }
 showHair();
}
async function separateNow(regions){
 if(working)return;
 working=true;separate.classList.add('busy');separate.textContent='분리 중…';
 const job=seq;
 try{if(!original)await setup();say('기존 눈썹을 추출하고 있습니다…');await new Promise(r=>requestAnimationFrame(r));await compute(regions,job);}
 catch(e){if(job===seq){console.warn('Suri existing eyebrow separation',e);say('분리 실패: '+e.message);manualMode();}}
 finally{working=false;separate.classList.remove('busy');separate.textContent=active?'분리 완료 ✓':'기존 눈썹 분리';}
}
separate.onclick=async ()=>{
 if(working)return;
 if(!photo.complete||!photo.naturalWidth){alert('먼저 고객 사진을 불러와 주세요.');return;}
 if(active){if(!confirm('기존 눈썹 분리를 다시 실행할까요?'))return;}
 clear();
 try{await setup();working=true;separate.classList.add('busy');say('얼굴 눈썹 위치 인식 중…');
  const regions=await faceRegions();working=false;separate.classList.remove('busy');await separateNow(regions);
 }catch(e){console.warn('Suri brow face detection:',e);manualMode(e.message);}
};
manualDone.onclick=async ()=>{if(manualAreas.length<1){say('눈썹 영역을 드래그해 주세요.');return;}const regions=manualAreas.filter(r=>r&&r.rx>2&&r.ry>2).slice();manual=false;selection.style.display='none';tip.classList.remove('show');manualDone.style.display='none';await separateNow(regions);};
const getPair=()=>({hair:hair.getContext('2d',{willReadFrequently:true}),skin:skin.getContext('2d',{willReadFrequently:true})});
function snap(){const {hair:hc,skin:sc}=getPair();history.push([hc.getImageData(0,0,hair.width,hair.height),sc.getImageData(0,0,skin.width,skin.height)]);if(history.length>5)history.shift();}
function undoErase(){if(!history.length)return;const [h,s]=history.pop(),pair=getPair();pair.hair.putImageData(h,0,0);pair.skin.putImageData(s,0,0);}
function dabAt(e){
 if(!active||!regionMask||!cleanPixels)return;
 const rect=hair.getBoundingClientRect(),x=(e.clientX-rect.left)*hair.width/Math.max(rect.width,1),y=(e.clientY-rect.top)*hair.height/Math.max(rect.height,1);
 const rad=Math.max(1,+sizeInput.value/2*hair.width/Math.max(rect.width,1)),str=+strengthInput.value/100,w=hair.width,h=hair.height;
 const x0=Math.max(0,Math.floor(x-rad)),x1=Math.min(w,Math.ceil(x+rad)),y0=Math.max(0,Math.floor(y-rad)),y1=Math.min(h,Math.ceil(y+rad));
 if(x1<=x0||y1<=y0)return;
 const pair=getPair(),rw=x1-x0,rh=y1-y0,hd=pair.hair.getImageData(x0,y0,rw,rh),sd=pair.skin.getImageData(x0,y0,rw,rh);
 for(let yy=0;yy<rh;yy++)for(let xx=0;xx<rw;xx++){const gx=x0+xx,gy=y0+yy,p=gy*w+gx;if(!regionMask[p])continue;const t=Math.hypot(gx+.5-x,gy+.5-y)/rad;if(t>=1)continue;
  const v=Math.min(1,str*Math.pow(1-t, .45)),k=(yy*rw+xx)*4,src=p*4;
  hd.data[k+3]=Math.round(hd.data[k+3]*(1-v));
  for(let c=0;c<3;c++)sd.data[k+c]=cleanPixels[src+c];
  sd.data[k+3]=Math.min(255,Math.round(sd.data[k+3]+(255-sd.data[k+3])*v));
 }
 pair.hair.putImageData(hd,x0,y0);pair.skin.putImageData(sd,x0,y0);
}
function finishEdit(){editing=false;pointers.clear();activePointer=null;panel.classList.remove('show');document.body.classList.remove('suri-hair-edit');say('');}
eraseButton.onclick=()=>{if(!active){say('먼저 기존 눈썹 분리를 실행해 주세요.');return;}if(document.body.classList.contains('suri-photo-erase-active'))document.getElementById('magicEraseToggle')?.click();editing=!editing;panel.classList.toggle('show',editing);document.body.classList.toggle('suri-hair-edit',editing);if(editing)say('기존 눈썹 영역만 지우는 중');else say('');};
panel.querySelector('#suriHairDone').onclick=finishEdit;
panel.querySelector('#suriHairUndo').onclick=undoErase;
stage.addEventListener('pointerdown',e=>{if(!editing||panel.contains(e.target)||e.target.closest('button'))return;if(e.pointerType==='mouse'&&e.button!==0)return;
 e.preventDefault();e.stopImmediatePropagation();pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(pointers.size===2){undoErase();activePointer=null;last=null;const a=[...pointers.values()];zoomStart={dist:Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y)||1,scale:typeof zoom==='number'?zoom:1,panX:typeof panX==='number'?panX:0,panY:typeof panY==='number'?panY:0,cx:(a[0].x+a[1].x)/2,cy:(a[0].y+a[1].y)/2};return;}
 if(pointers.size===1){activePointer=e.pointerId;last={x:e.clientX,y:e.clientY};snap();dabAt(e);}
},true);
stage.addEventListener('pointermove',e=>{if(!editing||!pointers.has(e.pointerId))return;e.preventDefault();e.stopImmediatePropagation();const p=pointers.get(e.pointerId);p.x=e.clientX;p.y=e.clientY;
 if(pointers.size===2&&zoomStart){const a=[...pointers.values()],dist=Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y)||1,cx=(a[0].x+a[1].x)/2,cy=(a[0].y+a[1].y)/2;
  if(typeof zoom==='number'&&typeof panX==='number'&&typeof panY==='number'){zoom=Math.max(1,Math.min(4,zoomStart.scale*dist/zoomStart.dist));panX=zoomStart.panX+cx-zoomStart.cx;panY=zoomStart.panY+cy-zoomStart.cy;world.style.transform='translate('+panX+'px,'+panY+'px) scale('+zoom+')';}return;}
 if(activePointer!==e.pointerId||!last)return;
 const n=Math.max(1,Math.ceil(Math.hypot(e.clientX-last.x,e.clientY-last.y)/Math.max(2,+sizeInput.value/4)));
 const prev={...last};for(let i=1;i<=n;i++)dabAt({clientX:prev.x+(e.clientX-prev.x)*i/n,clientY:prev.y+(e.clientY-prev.y)*i/n});last={x:e.clientX,y:e.clientY};
},true);
function up(e){if(!editing||!pointers.has(e.pointerId))return;e.preventDefault();e.stopImmediatePropagation();pointers.delete(e.pointerId);if(activePointer===e.pointerId){activePointer=null;last=null;}if(pointers.size<2)zoomStart=null;}
stage.addEventListener('pointerup',up,true);stage.addEventListener('pointercancel',up,true);
function showOriginal(e){e.preventDefault();if(!photo.naturalWidth)return;document.body.classList.add('suri-show-original');for(const c of [hair,skin])c.style.visibility='hidden';document.querySelectorAll('.brow').forEach(x=>x.style.visibility='hidden');const erased=window.browEraseCanvas;if(erased)erased.style.visibility='hidden';}
function hideOriginal(e){if(e)e.preventDefault();document.body.classList.remove('suri-show-original');for(const c of [hair,skin])c.style.visibility='';document.querySelectorAll('.brow').forEach(x=>x.style.visibility='');const erased=window.browEraseCanvas;if(erased)erased.style.visibility='';}
compare.addEventListener('pointerdown',showOriginal);['pointerup','pointercancel','pointerleave'].forEach(ev=>compare.addEventListener(ev,hideOriginal));compare.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter')showOriginal(e)});compare.addEventListener('keyup',hideOriginal);
let angleActive=false;
stage.addEventListener('pointerdown',e=>{const el=e.target.closest('[data-h="rot"]');if(!el)return;angleActive=true;rotation.style.display='block';rotation.textContent='0°';},true);
stage.addEventListener('pointermove',()=>{if(!angleActive)return;const el=document.querySelector('.brow.selected');if(!el)return;const deg=Math.round(Number(el.dataset.rot)||0);rotation.textContent=(deg>0?'+':'')+deg+'°';},false);
for(const ev of ['pointerup','pointercancel'])stage.addEventListener(ev,()=>{if(!angleActive)return;angleActive=false;setTimeout(()=>{if(!angleActive)rotation.style.display='none';},650);},false);
const layerBox=document.getElementById('layers');if(layerBox){new MutationObserver(()=>{const ex=layerBox.querySelector('[data-fixed="existing"]');if(ex&&ex.textContent!=='기존 눈썹 고정 · 맨 위')ex.textContent='기존 눈썹 고정 · 맨 위';}).observe(layerBox,{childList:true});}
})();