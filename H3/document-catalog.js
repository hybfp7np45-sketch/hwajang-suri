(()=>{
'use strict';
const key='hwajang-suri-h3-document-combinations-v1';
const definitions=[['consent','시술 동의서','forms'],['health','건강상태 확인서','forms'],['privacy','개인정보 수집·이용 동의서','forms'],['photoRecord','기록용 촬영·보관 동의서','forms'],['photoUse','교육·홍보 활용 동의서','forms'],['photoDiscount','할인 조건 교육·홍보 활용 동의서','forms'],['record','시술 기록지','forms'],['minor','미성년자 동의서','forms'],['brow','눈썹 상담차트','chart'],['scalp','두피 · 헤어라인 상담차트','chart'],['lip','입술 상담차트','chart'],['eyeliner','아이라인 상담차트','chart']];
const builtins=definitions.map(([id,title,kind])=>({id,title,kind,href:'./'+kind+'.html?v=combos3&type='+encodeURIComponent(id)}));
function read(){try{const value=JSON.parse(localStorage.getItem(key));return Array.from({length:6},(_,i)=>{const item=Array.isArray(value)?value[i]:null;return item&&typeof item.name==='string'&&Array.isArray(item.documents)&&item.documents.length?{name:item.name.slice(0,40),documents:[...new Set(item.documents.filter(x=>typeof x==='string'))]}:null;});}catch(_){return Array(6).fill(null);}}
function save(index,value){if(!Number.isInteger(index)||index<0||index>5)throw new Error('조합 위치를 확인해 주세요.');const slots=read();slots[index]=value?{name:value.name.trim().slice(0,40),documents:[...new Set(value.documents)]}:null;localStorage.setItem(key,JSON.stringify(slots));return slots;}
async function all(){const imported=await CustomDocuments.all();return [...builtins,...imported.sort((a,b)=>a.createdAt-b.createdAt).map(x=>({id:x.id,title:x.title,kind:'custom',custom:true,href:'./custom-document.html?v=combos3&id='+encodeURIComponent(x.id)}))];}
window.DocumentCombos={key,builtins,read,save,all};
})();
