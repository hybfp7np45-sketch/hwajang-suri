(()=>{
if(!Object.hasOwn(PolicyForms.titles,new URLSearchParams(location.search).get('type')))return;
const paper=document.getElementById('paper');paper.classList.add('policy-paper');
const termLabel=text=>text.startsWith('목적:')?'이용 목적':text.startsWith('항목:')?'수집 항목':text.startsWith('건강정보')?'별도 동의':text.startsWith('고지한')?'보관·파기 및 권리':text.startsWith('동의를 거부')?'동의 거부 안내':text.startsWith('시술 전')?'촬영 원칙':text.startsWith('마스크')?'촬영 시 유의사항':text.startsWith('SNS')?'이 동의의 제외 범위':text.startsWith('촬영·보관에')?'거부·철회 안내':text.startsWith('공개 게시물')?'공개 및 철회 안내':text.startsWith('촬영 및')?'할인 제공 조건':text.startsWith('할인을 받았더라도')?'철회 및 할인액':text.startsWith('이 동의에는')?'대가 및 거부권':'확인 사항';
let section,number=0;
for(const el of [...paper.children]){
 if(el.tagName==='H2'){section=document.createElement('section');section.className='policy-section';el.before(section);el.dataset.number=String(++number).padStart(2,'0');section.append(el);}
 else if(section&&!el.classList.contains('notice'))section.append(el);
}
for(const p of paper.querySelectorAll('.policy-section>p')){
 p.className='policy-copy';p.dataset.label=p.dataset.label||termLabel(p.textContent);
 const label=document.createElement('strong');label.className='policy-term-label';label.textContent=p.dataset.label;
 const text=document.createElement('span');text.className='policy-term-text';
 for(const sentence of p.textContent.replace(/^(목적|항목):\s*/,'').split(/(?<=\.)\s+/)){const line=document.createElement('span');line.textContent=sentence;text.append(line);}
 p.replaceChildren(label,text);
}
const style=document.createElement('style');style.textContent=`
.policy-paper .eyebrow{letter-spacing:.06em}.policy-paper h1{margin:22px 0 18px;font-weight:500}.policy-paper .policy-section{margin:26px 0}.policy-paper .policy-section h2{display:flex;gap:10px;align-items:center;font-size:17px;margin:0;padding:10px 12px;background:#edf4f7;border-top:2px solid #839aa9;border-bottom:1px solid #c4d3dd}.policy-paper h2:before{content:attr(data-number);color:#587789;font-size:13px}.policy-paper .fields{gap:0;border-left:1px solid #d0dce4;border-top:1px solid #d0dce4;margin:12px 0}.policy-paper label.field{padding:12px;border-right:1px solid #d0dce4;border-bottom:1px solid #d0dce4}.policy-paper .field>span{margin-bottom:6px}.policy-copy{display:grid;grid-template-columns:125px 1fr;margin:0!important;border-bottom:1px solid #d0dce4;font-size:14px}.policy-term-label{background:#f3f7f9;padding:14px 12px;font-size:13px}.policy-term-text{padding:12px 14px}.policy-term-text>span{display:block;margin-bottom:7px}.policy-term-text>span:last-child{margin:0}.policy-paper .policy-choice{border:1px solid #d0dce4;padding:12px 14px;margin:12px 0}.policy-paper .policy-choice legend{font-size:13px;padding:0 5px}.policy-paper .policy-choice .options{gap:8px 20px;margin:0}.policy-paper .policy-choice label{font-size:14px}.policy-paper .signblock{border-top:1px solid #98aeba;padding-top:16px;margin-top:22px}.policy-paper .required-key{font-size:12px}.policy-paper .policy-draft{font-size:11px;background:none;border-left:3px solid #b5c9d6;border-radius:0;padding:6px 12px;color:#6d7d87}@media(max-width:600px){.policy-copy{grid-template-columns:95px 1fr}.policy-term-label{padding:12px 9px;font-size:12px}.policy-term-text{padding:12px;font-size:13px;line-height:1.75}.policy-paper .policy-section h2{font-size:16px}}
`;document.head.append(style);

window.renderPolicyPdf=async()=>{
 await document.fonts.ready;
 const pdf=await PDFLib.PDFDocument.create(),W=1240,H=1754,L=80,R=W-L,CW=W-2*L,BOTTOM=H-85;
 const compact=new URLSearchParams(location.search).get('type')!=='privacy';
 const title=paper.querySelector('h1').textContent,canvases=[];
 let canvas,ctx,y,pageNo=0,activeHeading=null;
 const font=(size=20,bold=false)=>{ctx.font=(bold?'600 ':'')+size+'px -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans CJK KR",sans-serif';ctx.textBaseline='top';};
 const wrap=(text,width,size=20,bold=false)=>{font(size,bold);const out=[];for(const paragraph of String(text||'').split('\n')){let line='';for(const char of paragraph){if(line&&ctx.measureText(line+char).width>width){out.push(line);line=char;}else line+=char;}out.push(line);}return out;};
 const draw=(lines,x,top,size=20,bold=false,color='#283e4b')=>{font(size,bold);ctx.fillStyle=color;lines.forEach((line,i)=>ctx.fillText(line,x,top+i*size*1.5));};
 const line=(x1,top,x2,color='#c3d0d9')=>{ctx.strokeStyle=color;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x1,top);ctx.lineTo(x2,top);ctx.stroke();};
 const rect=(x,top,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(x,top,w,h);};
 function page(){canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;ctx=canvas.getContext('2d');rect(0,0,W,H,'#fff');canvases.push(canvas);pageNo++;draw(['상담·시술 서식'],L,46,16,false,'#657d8c');draw(['FORM '+({privacy:'05',photoRecord:'06',photoUse:'07',photoDiscount:'08'}[new URLSearchParams(location.search).get('type')])],R-100,46,16,false,'#657d8c');draw([title+(pageNo>1?' · 계속':'')],L,93,32,false);line(L,152,R,'#829ba9');y=compact?168:178;}
 function headingBar(text,num){rect(L,y,CW,compact?38:46,'#edf3f7');draw([num],L+14,y+11,18,true,'#607b8c');draw([text],L+62,y+9,22,true);line(L,y,R,'#869eac');y+=compact?48:58;}
 const ensure=(h,continuation=true)=>{if(h>BOTTOM-250)throw new Error('입력 내용이 너무 깁니다. 긴 내용을 줄인 뒤 다시 확인해 주세요.');if(y+h>BOTTOM){page();if(continuation&&activeHeading)headingBar(activeHeading.text+' (계속)',activeHeading.num);}};
 function heading(text,num){ensure(110,false);activeHeading={text,num};headingBar(text,num);}
 const displayName=name=>({'정보를 처리하는 업소명':'업소명','문의·철회 요청 연락처':'문의·철회 연락처','보유·이용기간 (작성 전 업소가 고지)':'보유·이용기간','구체적인 촬영 부위·범위 또는 가림 조건':'촬영 부위·가림 조건','게시 계정·사이트 / 교육 대상·방식 / 인쇄물·광고 범위':'상세 활용 범위','할인 대상 시술·제공 시점·조건':'할인 대상·제공 조건'}[name]||name);
 function fields(group){const all=[...group.querySelectorAll('label.field')];for(let i=0;i<all.length;){const row=[all[i++]];if(!row[0].classList.contains('wide')&&all[i]&&!all[i].classList.contains('wide'))row.push(all[i++]);const width=CW/row.length;const cells=row.map(el=>({label:wrap(displayName(el.querySelector('span').textContent),165,18,true),value:wrap(el.querySelector('input,textarea').value||' ',width-197,20)}));const height=Math.max(compact?50:60,...cells.map(c=>Math.max(c.label.length*27,c.value.length*30)+(compact?16:24)));ensure(height+10);line(L,y,R);cells.forEach((c,n)=>{const x=L+n*width;rect(x,y,183,height,'#f2f6f8');draw(c.label,x+12,y+12,18,true);draw(c.value,x+195,y+12);ctx.strokeStyle='#c3d0d9';ctx.strokeRect(x,y,width,height);});y+=height;}y+=compact?8:14;}
 function term(p){const label=p.dataset.label,text=p.querySelector('.policy-term-text').innerText;const labelLines=wrap(label,165,18,true),sentences=text.split('\n').filter(Boolean);let lines=[];for(const sentence of sentences)lines.push(...wrap('· '+sentence,CW-213,20));const h=Math.max(lines.length*30,labelLines.length*27)+(compact?16:24);ensure(h+8);rect(L,y,183,h,'#f2f6f8');draw(labelLines,L+12,y+13,18,true);draw(lines,L+198,y+12);line(L,y,R);line(L,y+h,R);y+=h+(compact?4:8);}
 function choice(el){const legend=el.querySelector('legend').textContent;const items=[...el.querySelectorAll('input')].map(input=>(input.checked?'☑ ':'☐ ')+input.value);const columns=el.querySelector('input').name==='channels'?2:items.some(x=>x.length>17)?1:Math.min(items.length,3);const rows=Math.ceil(items.length/columns),legendLines=wrap(legend,CW-28,19,true);const h=legendLines.length*28+rows*(compact?30:36)+(compact?18:28);ensure(h+10);ctx.strokeStyle='#bdcdd7';ctx.strokeRect(L,y,CW,h);draw(legendLines,L+14,y+12,19,true);items.forEach((item,i)=>draw([item],L+18+(i%columns)*(CW/columns),y+18+legendLines.length*28+Math.floor(i/columns)*(compact?30:36),20));y+=h+(compact?8:14);}
 function signatures(el){ensure(compact?155:190);line(L,y,R,'#829ba9');draw(['동의일: '+(el.querySelector('input')?.value||'        년       월       일')],L,y+14,20);y+=compact?45:57;const sigs=[...el.querySelectorAll('.sig')],width=CW/sigs.length;for(let i=0;i<sigs.length;i++){const x=L+i*width;ctx.strokeStyle='#bdcdd7';ctx.strokeRect(x,y,width,compact?90:112);draw([sigs[i].closest('.signrow').querySelector('span').textContent],x+15,y+13,19,true);const image=sigs[i].querySelector('img');if(image){const ratio=Math.min((width-175)/image.naturalWidth,(compact?55:75)/image.naturalHeight),w=image.naturalWidth*ratio,h=image.naturalHeight*ratio;ctx.drawImage(image,x+158+(width-175-w)/2,y+(compact?25:30),w,h);}else draw(['(서명)'],x+width-90,y+(compact?62:73),18,false,'#7a8f9c');}y+=compact?108:130;}
 page();
 for(const section of paper.querySelectorAll('.policy-section')){
  const h=section.querySelector('h2');heading(h.textContent,h.dataset.number);
  for(const el of section.children){if(el===h)continue;if(el.classList.contains('fields'))fields(el);else if(el.classList.contains('policy-copy'))term(el);else if(el.classList.contains('policy-choice'))choice(el);else if(el.classList.contains('signblock'))signatures(el);}
  y+=compact?4:10;
 }
 for(let i=0;i<canvases.length;i++){ctx=canvases[i].getContext('2d');line(L,H-62,R);draw(['화장수리 · 검토용 초안'],L,H-45,15,false,'#728692');draw([(i+1)+' / '+canvases.length],R-65,H-45,15,false,'#728692');const png=await pdf.embedPng(canvases[i].toDataURL('image/png'));pdf.addPage([595.28,841.89]).drawImage(png,{x:0,y:0,width:595.28,height:841.89});}
 return pdf.save();
};
})();

