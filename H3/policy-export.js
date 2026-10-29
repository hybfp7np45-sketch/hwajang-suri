(()=>{
const type=new URLSearchParams(location.search).get('type');if(!Object.hasOwn(PolicyForms.titles,type))return;
const aliases={'정보를 처리하는 업소명':'업소명','문의·철회 요청 연락처':'업소 연락처'};
const labels=[...document.querySelectorAll('label.field')],find=name=>labels.find(x=>[name,aliases[name]].includes(x.querySelector('span')?.textContent))?.querySelector('input,textarea');
find('정보를 처리하는 업소명').value='화장수리';find('보유·이용기간 (작성 전 업소가 고지)').placeholder=type==='privacy'||type==='photoRecord'?'예: 시술일로부터 5년 (고지 후 사용)':'예: 동의일로부터 3년 (고지 후 사용)';
const keys=['정보를 처리하는 업소명','문의·철회 요청 연락처','고객 성명',...(type==='privacy'?['연락처']:[]),'보유·이용기간 (작성 전 업소가 고지)'];if(type==='photoDiscount')keys.push('정상 시술가 (원)','촬영·활용 동의 할인액 (원)','할인 후 실제 결제액 (원)');
const hint=document.querySelector('.hint');hint.textContent=type==='privacy'?'검토용 초안 · 업소가 기간과 활용 범위를 먼저 고지한 뒤 고객이 선택·서명합니다. 입력 내용은 자동 보관되지 않습니다.':'내용을 확인하고 동의 여부를 선택한 뒤 서명해 주세요. 작성 후 PDF로 저장할 수 있습니다.';
let busy=false,url=null;window.exportOriginalPdf=async({preview=false,bundle=false}={})=>{if(busy)return;const status=document.getElementById('status');if(!preview||bundle){for(const key of keys){if(!find(key)?.value.trim()){status.textContent=key+'을 입력해 주세요.';find(key)?.focus();return;}}
if(!document.querySelector('input[name=policyAgree]:checked')){status.textContent='동의 또는 미동의를 선택해 주세요.';return;}
if(type!=='privacy'&&document.querySelector('input[name=policyAgree]:checked').value==='동의'){
 for(const name of ['media','face'])if(!document.querySelector('input[name='+name+']:checked')){status.textContent='촬영 자료와 촬영 범위를 선택해 주세요.';return;}

}
if(type==='photoDiscount'){const n=k=>Number(find(k).value.replace(/[,원\s]/g,''));const [normal,discount,paid]=['정상 시술가 (원)','촬영·활용 동의 할인액 (원)','할인 후 실제 결제액 (원)'].map(n);if(![normal,discount,paid].every(Number.isFinite)||normal<0||discount<0||paid<0||normal-discount!==paid){status.textContent='정상가 - 할인액 = 실제 결제액이 되도록 금액을 확인해 주세요.';return;}}
if(!document.querySelector('.signrow input').value){status.textContent='동의일을 입력해 주세요.';return;}
for(const sig of document.querySelectorAll('.sig'))if(!sig.querySelector('img')){status.textContent=sig.getAttribute('aria-label')+'를 완료해 주세요.';return;}
}
busy=true;status.textContent='PDF를 만들고 있어요…';try{const bytes=await window.renderPolicyPdf();if(preview||bundle)return bytes;const name=find('고객 성명').value.replace(/[\\/:*?"<>|]/g,'')+' '+PolicyForms.titles[type]+'.pdf',blob=new Blob([bytes],{type:'application/pdf'}),file=new File([blob],name,{type:'application/pdf'});if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(blob);document.getElementById('readyPdf')?.remove();const a=document.createElement('a');a.id='readyPdf';a.href=url;a.download=name;a.textContent='작성한 PDF 내려받기';document.querySelector('.toolbar').append(a);status.textContent='PDF를 만들었어요.';if(navigator.canShare?.({files:[file]})){try{await navigator.share({files:[file],title:PolicyForms.titles[type]});}catch(e){if(e.name!=='AbortError')status.textContent='PDF 내려받기를 눌러 주세요.';}}else a.click();}catch(e){status.textContent=e.message;}finally{busy=false;}};
})();




