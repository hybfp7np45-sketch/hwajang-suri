(()=>{
const titles={privacy:'개인정보 수집·이용 동의서',photoRecord:'기록용 촬영·보관 동의서',photoUse:'교육·홍보 활용 동의서',photoDiscount:'할인 조건 교육·홍보 활용 동의서'};
window.PolicyForms={titles,body(kind,{field,fields,signs}){
const choice=(name,label,items,multi=false)=>`<fieldset class="policy-choice"><legend>${label}</legend><div class="options">${items.map(x=>`<label><input type="${multi?'checkbox':'radio'}" name="${name}" value="${x}">${x}</label>`).join('')}</div></fieldset>`;
const agree=()=>choice('policyAgree','위 내용을 읽고 설명을 들은 후 선택합니다.',['동의','미동의']);
const common=`<p class="policy-draft">변호사 검토 전 초안입니다. 업소는 보유기간·연락처·활용 범위를 고객 작성 전에 구체적으로 고지해 주세요.</p><h2>업소 및 고객 정보</h2>${fields(field('정보를 처리하는 업소명'),field('문의·철회 요청 연락처','tel'),field('고객 성명'),field('연락처','tel'),field('관련 시술일','date'),field('관련 시술 부위'))}`;
const period=()=>`<h2>보유·이용기간 및 권리</h2>${fields(field('보유·이용기간 (작성 전 업소가 고지)','text',true))}<p>고지한 기간이 끝나거나 처리 목적을 달성하면 지체 없이 파기합니다. 동의 철회·처리정지·열람·정정·삭제는 위 연락처로 요청할 수 있습니다. 다른 법령에 따라 별도 보존이 필요한 자료는 해당 근거·기간·항목을 고지하고 분리하여 보관하며, 그 목적 외로 이용하지 않습니다.</p>`;
const signatures=()=>signs('동의일','고객','설명한 시술자');
if(kind==='privacy')return common+`<h2>수집·이용 내용</h2><p>목적: 상담·예약·본인 확인, 시술계획 확인, 사후관리 연락 및 관련 기록 관리.</p><p>항목: 성명, 연락처, 시술일·부위 및 상담·시술 관련 기록 중 필요한 최소 정보. 생년월일은 연령 확인이 필요한 경우에만 수집합니다. 주민등록번호는 수집하지 않습니다.</p><p>건강정보는 이 동의에 포함되지 않으며 건강상태 확인서에서 별도로 동의받습니다. 촬영물의 수집·보관 및 교육·홍보 공개 활용도 각각 별도로 선택합니다. 광고성 연락 수신 동의는 이 서식에 포함되지 않습니다.</p>`+period()+`<p>동의를 거부할 수 있습니다. 다만 성명·연락처 등 상담·예약 및 사후관리에 필요한 최소 정보를 확인할 수 없으면 해당 업무가 제한될 수 있습니다. 선택적 교육·홍보 활용에 동의하지 않았다는 이유로 일반 시술을 거절하지 않습니다.</p>`+agree()+signatures();
const note=(label,text)=>`<p data-label="${label}">${text}</p>`;
const record=kind==='photoRecord',discount=kind==='photoDiscount';
const photoCommon=`<p class="policy-draft">촬영·사용 범위와 보관기간을 확인한 뒤 작성해 주세요.</p><h2>기본 정보</h2>${fields(field('업소명'),field('업소 연락처','tel'),field('고객 성명'),field('촬영·시술일','date'),field('촬영 부위','text',true))}`;
const shooting=`<h2>촬영 및 사용 안내</h2>${note('촬영 용도',record?'촬영한 사진·동영상은 시술 전후 비교, 경과 확인 및 고객관리 기록용으로 사용됩니다.':'촬영한 사진·동영상은 수업자료와 SNS 업로드 및 그 외 업소의 상업적 홍보용으로 사용됩니다.')}${choice('media','촬영 자료',['사진','동영상'],true)}${choice('face','촬영 범위',['시술 부위만','마스크 촬영','얼굴 전체'])}${note('사용 범위',record?'시술 부위·경과와 촬영물을 업소 내부 기록으로 보관합니다. 외부 홍보에는 별도 동의 후 사용합니다.':'시술 부위·경과와 촬영물을 위 용도로 활용하며, 목적에 맞게 크기 조정·자르기·자막 등 편집을 할 수 있습니다. 이름·연락처는 공개하지 않습니다.')}`;
const photoPeriod=()=>`<h2>보관 및 동의 확인</h2>${fields(field('보유·이용기간 (작성 전 업소가 고지)','text',true))}${note('보관 안내','촬영물은 안내한 기간 동안 보관·이용하고 기간 종료·목적 달성 시 파기합니다. 법령상 보존이 필요한 경우에는 해당 기준에 따릅니다.')}${note('동의 안내','동의는 선택사항입니다. 동의 변경·철회는 위 연락처로 요청할 수 있으며, 관련 법령에 따라 처리합니다.')}${!discount?note('시술 안내','촬영·사용에 동의하지 않아도 일반 시술을 받으실 수 있습니다.'):''}`;
const benefit=discount?`<h2>촬영 동의 할인 혜택</h2>${fields(field('정상 시술가 (원)'),field('촬영·활용 동의 할인액 (원)'),field('할인 후 실제 결제액 (원)'),field('할인 대상 시술·제공 시점·조건','area',true))}${note('할인 적용','사진·동영상 촬영과 위 용도의 사용에 동의하시면 안내한 할인 혜택이 적용됩니다. 동의하지 않는 경우에는 할인 없이 정상가로 진행됩니다.')}`:'';
return photoCommon+shooting+benefit+photoPeriod()+agree()+signatures();
}};
})();

