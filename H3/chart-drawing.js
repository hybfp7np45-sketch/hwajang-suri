(()=>{
'use strict';
const regions={
 brow:[{label:'눈썹 디자인',box:[74,579,609,701]}],
 lip:[{label:'입술 디자인',box:[74,579,609,407]}],
 eyeliner:[{label:'아이라인 디자인',box:[74,579,609,407]}],
 scalp:[{label:'정면',box:[74,680,370,563]},{label:'위에서',box:[445,680,386,563]},{label:'측면',box:[832,680,428,563]}]
};
function paint(ctx,stroke){
 ctx.strokeStyle=ctx.fillStyle=stroke.color;ctx.lineWidth=stroke.size;ctx.lineCap=ctx.lineJoin='round';
 const p=stroke.points;ctx.beginPath();ctx.arc(p[0][0],p[0][1],stroke.size/2,0,Math.PI*2);ctx.fill();
 if(p.length>1){ctx.beginPath();ctx.moveTo(...p[0]);for(let i=1;i<p.length;i++)ctx.lineTo(...p[i]);ctx.stroke();}
}
window.ChartDrawing={create({type,host,onChange,isBusy,loadBackground}){
 const views=regions[type].map(r=>({...r,strokes:[],history:[]}));let active=0,color='#222222',size=3,current=null,pointer=null,bg=null;
 host.className='drawing-editor';host.innerHTML='<h3>그림에 디자인하기</h3><p class="draw-help">그림 위를 손가락으로 그려 주세요. 그린 내용은 PDF에 함께 저장돼요.</p><div class="drawing-tabs" aria-label="그림 선택"></div><div class="drawing-tools"><label class="brush-size">브러시 크기 <output id="brushValue">3</output><input id="brushSize" type="range" min="1" max="12" value="3" aria-label="브러시 크기"></label><div class="drawing-colors" role="group" aria-label="브러시 색상"></div><div class="drawing-actions"><button type="button" class="draw-undo">되돌리기</button><button type="button" class="draw-clear">이 그림 지우기</button></div></div><p class="drawing-status" role="status">그림을 불러오고 있어요…</p><canvas class="drawing-canvas" aria-label="손가락으로 디자인을 그리는 영역"></canvas>';
 const board=host.querySelector('canvas'),ctx=board.getContext('2d'),tabs=host.querySelector('.drawing-tabs'),undo=host.querySelector('.draw-undo'),clear=host.querySelector('.draw-clear'),message=host.querySelector('.drawing-status');
 const tabButtons=views.map((v,i)=>{const b=document.createElement('button');b.type='button';b.textContent=v.label;b.addEventListener('click',()=>{finish();active=i;redraw();});tabs.append(b);return b;});tabs.hidden=views.length===1;
 for(const [name,hex] of [['검정','#222222'],['갈색','#79503b'],['빨강','#df404b'],['분홍','#e78aad'],['파랑','#287fb7'],['흰색','#ffffff']]){const b=document.createElement('button');b.type='button';b.className='color-swatch';b.style.setProperty('--swatch',hex);b.setAttribute('aria-label',name);b.setAttribute('aria-pressed',String(hex===color));b.addEventListener('click',()=>{color=hex;host.querySelectorAll('.color-swatch').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));});host.querySelector('.drawing-colors').append(b);}
 host.querySelector('#brushSize').addEventListener('input',e=>{size=Number(e.target.value);host.querySelector('output').value=String(size);});
 function redraw(){const v=views[active], [x,y,w,h]=v.box;board.width=w*2;board.height=h*2;ctx.setTransform(2,0,0,2,0,0);ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);if(bg)ctx.drawImage(bg,x*bg.width/1334,y*bg.height/1888,w*bg.width/1334,h*bg.height/1888,0,0,w,h);for(const s of v.strokes)paint(ctx,s);tabButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===active)));board.setAttribute('aria-label',v.label+' — 손가락으로 디자인을 그리는 영역');undo.disabled=!v.history.length||isBusy();clear.disabled=!v.strokes.length||isBusy();}
 function point(e){const r=board.getBoundingClientRect(),v=views[active];return [Math.max(0,Math.min(v.box[2],(e.clientX-r.left)*v.box[2]/r.width)),Math.max(0,Math.min(v.box[3],(e.clientY-r.top)*v.box[3]/r.height))];}
 function finish(){if(pointer!==null&&board.hasPointerCapture(pointer))board.releasePointerCapture(pointer);pointer=null;current=null;}
 board.addEventListener('pointerdown',e=>{if(isBusy()||!bg||pointer!==null||e.button!==0)return;e.preventDefault();const v=views[active];v.history.push(v.strokes.slice());current={color,size:size*v.box[2]/board.getBoundingClientRect().width,points:[point(e)]};v.strokes.push(current);pointer=e.pointerId;board.setPointerCapture(pointer);paint(ctx,current);onChange();undo.disabled=clear.disabled=false;});
 board.addEventListener('pointermove',e=>{if(e.pointerId!==pointer||!current)return;e.preventDefault();const events=e.getCoalescedEvents?.()||[e];for(const sample of events){const prev=current.points[current.points.length-1],next=point(sample);current.points.push(next);paint(ctx,{color:current.color,size:current.size,points:[prev,next]});}});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])board.addEventListener(event,e=>{if(e.pointerId===pointer)finish();});
 undo.addEventListener('click',()=>{finish();const v=views[active];if(v.history.length)v.strokes=v.history.pop();onChange();redraw();});
 clear.addEventListener('click',()=>{finish();const v=views[active];v.history.push(v.strokes.slice());v.strokes=[];onChange();redraw();});
 redraw();loadBackground().then(image=>{bg=image;message.textContent=views.length>1?'정면 · 위에서 · 측면을 하나씩 선택해 그려 주세요.':'그림 밖에서는 화면을 위아래로 움직일 수 있어요.';redraw();}).catch(()=>{message.textContent='그림을 불러오지 못했어요. 새로고침 후 다시 시도해 주세요.';});
 return {drawTo(canvas){finish();const out=canvas.getContext('2d');out.save();out.setTransform(canvas.width/1334,0,0,canvas.height/1888,0,0);for(const v of views){out.save();out.beginPath();out.rect(...v.box);out.clip();out.translate(v.box[0],v.box[1]);for(const stroke of v.strokes)paint(out,stroke);out.restore();}out.restore();return canvas;}};
}};
})();
