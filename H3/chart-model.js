(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ChartModel=api;})(typeof window!=='undefined'?window:globalThis,()=>{
'use strict';
const W=1334,H=1888,VERSION='chart-form-v1';
const text=(id,label,box,extra={})=>({id,label,box,kind:'text',...extra});
const area=(id,label,box,extra={})=>text(id,label,box,{kind:'area',...extra});
const choices=(id,label,options,positions,extra={})=>({id,label,options,positions,kind:'multi',...extra});
const radio=(id,label,options,positions,extra={})=>choices(id,label,options,positions,{kind:'radio',...extra});
const yesno=(id,label,y)=>radio(id,label,['예','아니오'],[[1101,y],[1173,y]]);
const when=(id,trigger,y)=>text(id,'받은 적이 있다면 언제인가요?',[982,y,249,28],{condition:{id:trigger,value:'예'},placeholder:'예: 2024년 3월'});
const common=[
 text('date','작성 날짜',null,{kind:'date'}),
 text('name','성함',[779,258,458,29],{autocomplete:'name',required:true}),
 radio('gender','성별',['여','남'],[[775,320],[867,320]]),
 text('age','나이',[1060,314,173,29],{inputmode:'numeric',placeholder:'예: 36세'}),
 text('phone','연락처',[800,369,438,29],{kind:'tel',autocomplete:'tel',placeholder:'010-1234-5678'}),
 area('address','주소',[780,425,455,132],{autocomplete:'street-address',rows:2}),
 radio('visit','방문 구분',['신규','재방문'],[[96,324],[96,274]]),
 text('lastVisit','마지막 방문 시기',[449,266,202,27],{condition:{id:'visit',value:'재방문'},placeholder:'예: 2025년 6월'}),
 choices('channels','방문 경로 (중복 선택 가능)',['지인 소개','오프라인 광고배너','인스타','블로그','카페','검색'],[[96,375],[96,467],[96,510],[235,510],[376,510],[96,549]]),
 text('referrer','소개자 성함',[263,411,104,23],{condition:{id:'channels',value:'지인 소개'}}),
 text('referrerPhone','소개자 연락처',[482,411,173,23],{kind:'tel',condition:{id:'channels',value:'지인 소개'}}),
 text('banner','광고배너를 보신 장소',[510,459,144,24],{condition:{id:'channels',value:'오프라인 광고배너'}}),
 text('socialName','인스타·블로그·카페 이름',[556,509,99,23],{condition:{id:'channels',any:['인스타','블로그','카페']}}),
 text('search','검색어',[336,546,319,24],{condition:{id:'channels',value:'검색'}})
];
const notes=(consultation,residual,final)=>[
 area('consultation','상담 내용',consultation,{rows:5}),
 area('residual','잔흔 여부',residual,{rows:3,placeholder:'기존 시술의 잔흔·색상·상태 등을 입력해 주세요.'}),
 ...(final?[area('finalTechnique','최종 들어가는 기법',final,{rows:3})]:[])
];
const customerPreferences=[
 '자연스럽게 원한다','진하게 원한다','눈썹 화장을 한 것처럼 보이고 싶다','한 올 한 올 내 눈썹 털처럼 보이고 싶다','눈썹이 갈색이었으면 한다','눈썹이 없어질 때 빨간색으로 남는 게 싫다','눈썹이 남들보다 빨리 빠지는 것 같다'
];
const configs={
 brow:{title:'눈썹 상담차트',customer:[
  area('desiredDesign','원하는 디자인 · 눈썹 모양 (있으면 작성)',[710,638,527,71]),
  area('desiredMethod','원하는 기법 (있으면 작성)',[710,789,527,70]),
  choices('preferences','맞춤 기법을 찾고 싶다면 체크해 주세요 (중복 선택 가능)',customerPreferences,[1001,1042,1082,1122,1164,1206,1247].map(y=>[710,y]))
 ],practitioner:[
  ...notes([95,1354,566,415],[710,1354,528,131],null),
  choices('finalTechnique','최종 들어가는 기법 (중복 선택 가능)',['엠보 기법','콤보','수지 새도우','머신 새도우','헤어스트록','페더링'],[[710,1598],[986,1598],[710,1670],[986,1670],[710,1742],[986,1742]])
 ]},
 scalp:{title:'두피 · 헤어라인 상담차트',customer:[
  area('desiredShape','원하는 헤어라인 모양 (있으면 작성)',[442,1265,794,44]),
  area('desiredArea','보완하고 싶은 부위 · 범위',[336,1342,900,44]),
  area('desiredMethod','원하는 기법 · 진하기 (있으면 작성)',[420,1418,816,44])
 ],practitioner:[
  choices('sites','시술 부위 (중복 선택 가능)',['민머리','정수리','가르마','헤어라인','흉터 커버','M자 탈모','구레나룻','기타'],[[94,644],[205,644],[316,644],[426,644],[556,644],[692,644],[829,644],[959,644]]),
  text('siteOther','기타 시술 부위',[1059,632,177,30],{condition:{id:'sites',value:'기타'}}),
  ...notes([95,1549,566,220],[710,1547,528,48],[710,1680,528,90])
 ]},
 lip:{title:'입술 상담차트',customer:[
  area('desiredShape','원하는 입술 모양 · 컬러 (있으면 작성)',[95,1041,565,44]),
  area('desiredTone','원하는 입술 톤 · 진하기 (있으면 작성)',[95,1153,565,44]),
  area('requests','보완하고 싶은 부분 · 요청사항',[95,1265,565,44]),
  yesno('tattoo','입술문신을 받은 적이 있나요?',615),when('tattooWhen','tattoo',656),
  yesno('filler','입술 및 입꼬리 필러를 받은 적이 있나요?',763),when('fillerWhen','filler',804),
  yesno('blister','입가 및 입술에 물집(수포)가 난 적이 있나요?',924)
 ],practitioner:[
  choices('darkLip','다크립 영역 (중복 선택 가능)',['보랏빛','갈색빛','회색빛','자줏빛'],[[710,1067],[961,1067],[710,1113],[961,1113]]),
  ...notes([95,1397,566,373],[710,1227,528,79],[710,1619,528,151]),
  area('lipCondition','각질 및 입술상태',[710,1397,528,132],{rows:3})
 ]},
 eyeliner:{title:'아이라인 상담차트',customer:[
  area('desiredShape','원하는 아이라인 모양 · 범위 (있으면 작성)',[95,1041,565,44]),
  area('desiredStyle','원하는 두께 · 꼬리 길이 · 컬러 (있으면 작성)',[95,1153,565,44]),
  area('requests','보완하고 싶은 부분 · 요청사항',[95,1265,565,44])
 ],practitioner:[
  choices('eyelid','쌍꺼풀 (중복 선택 가능)',['홑꺼풀','속쌍꺼풀','인라인','아웃라인','인아웃라인'],[[710,648],[962,648],[710,689],[962,689],[710,730]]),
  choices('eyeShape','눈매 (중복 선택 가능)',['몽고주름','올라간 눈매','내려간 눈매','점막 들림','앞쪽 말림','쌍꺼풀 처짐'],[[710,848],[962,848],[710,889],[962,889],[710,930],[962,930]]),
  choices('design','작업사항 · 디자인 (중복 선택 가능)',['점막','꼬리연장','눈매교정디자인','쌍꺼풀연장','언더라인','밑트임'],[[710,1056],[962,1056],[710,1097],[962,1097],[710,1138],[962,1138]]),
  choices('color','컬러 (중복 선택 가능)',['블랙','다크브라운','브라운'],[[710,1252],[879,1252],[1081,1252]]),
  ...notes([95,1397,566,373],[710,1397,528,132],[710,1619,528,151])
 ]}
};
function fieldsFor(type){return [...common,...configs[type].customer,...configs[type].practitioner];}
function visible(f,data){if(!f.condition)return true;const c=f.condition,value=data[c.id];const values=Array.isArray(value)?value:[value];return c.any?c.any.some(v=>values.includes(v)):values.includes(c.value);}
function build(type,data){
 const ops=[];
 if(data.date){const p=data.date.split('-');if(p.length===3){[[775,201,64,p[0]],[936,201,50,String(Number(p[1]))],[1094,201,50,String(Number(p[2]))]].forEach(([x,y,w,value])=>ops.push({text:value,x,y,w,h:29,label:'작성 날짜'}));}}
 for(const f of fieldsFor(type)){
  if(!visible(f,data)||!data[f.id]||f.id==='date')continue;
  if(f.positions){const values=Array.isArray(data[f.id])?data[f.id]:[data[f.id]];f.options.forEach((value,i)=>{if(values.includes(value))ops.push({tick:f.positions[i],label:f.label});});}
  else if(f.box){const [x,y,w,h]=f.box;ops.push({text:String(data[f.id]),x,y,w,h,label:f.label});}
 }
 return ops;
}
function wrap(ctx,text,width,size,font){ctx.font=`${size}px ${font}`;const out=[];for(const para of text.replace(/\r\n?/g,'\n').split('\n')){let line='';for(const char of para){if(line&&ctx.measureText(line+char).width>width){out.push(line);line=char;}else line+=char;}out.push(line);}return out;}
function renderOverlay(canvas,ops,font='-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans CJK KR",sans-serif'){
 const ctx=canvas.getContext('2d');canvas.width=W*2;canvas.height=H*2;ctx.scale(2,2);ctx.fillStyle='#173b54';ctx.strokeStyle='#173b54';ctx.textBaseline='top';ctx.lineCap='round';ctx.lineJoin='round';
 for(const o of ops){
  if(o.tick){const [x,y]=o.tick;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x+2,y+7);ctx.lineTo(x+6,y+12);ctx.lineTo(x+13,y+2);ctx.stroke();continue;}
  let size=22,lines=wrap(ctx,o.text,o.w-4,size,font);
  while(size>14&&lines.length*size*1.24>o.h-2){size-=.5;lines=wrap(ctx,o.text,o.w-4,size,font);}
  if(lines.length*size*1.24>o.h-2)throw new Error(`「${o.label}」의 내용이 저장 양식의 칸보다 길어요. 내용을 조금 줄여 주세요.`);
  ctx.font=`${size}px ${font}`;lines.forEach((line,n)=>ctx.fillText(line,o.x+2,o.y+1+n*size*1.24));
 }
 return canvas;
}
return {W,H,VERSION,common,configs,fieldsFor,visible,build,renderOverlay};
});
