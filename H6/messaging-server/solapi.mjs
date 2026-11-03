/** Server-only SOLAPI adapter. Never load this file in H6's browser. */
const enc = new TextEncoder();
export async function authorization(apiKey, secret, date = new Date().toISOString(), salt = crypto.randomUUID().replaceAll('-', '')) {
  if (!apiKey || !secret) throw new Error('SOLAPI credentials are missing');
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), {name:'HMAC',hash:'SHA-256'}, false, ['sign']);
  const signature = Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,enc.encode(date+salt))), x=>x.toString(16).padStart(2,'0')).join('');
  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
}
export function messagePayload(input, config) {
  const number = v=>String(v||'').replace(/[-\s]/g,'');
  const to=number(input.to),from=number(config.sender);
  if(!/^0\d{8,10}$/.test(to)||!/^\d{8,11}$/.test(from))throw Error('수신번호와 인증된 발신번호를 확인해 주세요.');
  if(!['SMS','LMS','ATA'].includes(input.type))throw Error('지원하지 않는 발송 종류입니다.');
  if(config.testOnly!==false&&to!==number(config.testRecipient))throw Error('시험 모드에서는 등록된 본인 번호로만 발송할 수 있습니다.');
  const m={to,from,type:input.type};
  if(input.type==='ATA') {
    if(!config.pfId||!config.templateId)throw Error('카카오 채널과 승인된 템플릿을 먼저 연결해 주세요.');
    m.kakaoOptions={pfId:config.pfId,templateId:config.templateId,variables:input.variables||{},disableSms:input.fallback!==true};
  } else {
    if(typeof input.text!=='string'||!input.text.trim())throw Error('안내 문구를 입력해 주세요.');
    // Conservative EUC-KR-style length estimate; supplier strict validation is authoritative.
    const bytes=[...input.text].reduce((n,ch)=>n+(ch.charCodeAt(0)<128?1:2),0);
    if(bytes>(input.type==='SMS'?90:2000))throw Error(input.type==='SMS'?'짧은 문자 길이를 넘었어요. 긴 문자로 선택해 주세요.':'긴 문자 길이를 초과했어요.');
    m.text=input.text;if(input.type==='LMS')m.subject='예약 안내';
  }
  return m;
}
export function previousDay(date,hour){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isInteger(hour)||hour<0||hour>23)throw Error('날짜 또는 시간이 올바르지 않습니다.');
  const day=new Date(date+'T12:00:00Z');if(!Number.isFinite(+day)||day.toISOString().slice(0,10)!==date)throw Error('날짜가 올바르지 않습니다.');
  day.setUTCDate(day.getUTCDate()-1);return day.toISOString().slice(0,10)+'T'+String(hour).padStart(2,'0')+':00:00+09:00';
}
export function createSolapi({apiKey,apiSecret,fetchImpl=fetch}){
  async function call(method,path,body){
    const r=await fetchImpl('https://api.solapi.com'+path,{method,headers:{Authorization:await authorization(apiKey,apiSecret),'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(15000)});
    const data=await r.json();if(!r.ok){const e=Error(data.errorMessage||'솔라피 요청이 거절되었습니다.');e.code=data.errorCode;e.status=r.status;throw e;}return data;
  }
  const path=id=>{if(!/^G4V[A-Za-z0-9]+$/.test(id))throw Error('올바르지 않은 발송 ID');return '/messages/v4/groups/'+id;};
  return {
    async prepare(message,saveGroup){
      // Caller MUST durably record an operation id before calling; never retry an ambiguous request automatically.
      const g=await call('POST','/messages/v4/groups',{strict:true,allowDuplicates:false});
      if(!g.groupId)throw Error('솔라피 발송 ID를 받지 못했습니다.');
      await saveGroup(g.groupId); // Persist ID before adding messages or scheduling.
      const added=await call('PUT',path(g.groupId)+'/messages',{messages:[message]});
      if(added.count?.registeredFailed>0||added.errorCount>0||added.count?.registeredSuccess===0)throw Error('메시지 접수에 실패했습니다. 발송 내역을 확인해 주세요.');
      return g.groupId;
    },
    async dispatch(groupId,scheduledDate){
      if(scheduledDate){const t=new Date(scheduledDate),limit=new Date();limit.setUTCMonth(limit.getUTCMonth()+6);if(!Number.isFinite(+t)||+t<=Date.now()||t>limit)throw Error('예약 발송은 현재 이후 6개월 이내로 지정해 주세요.');return call('POST',path(groupId)+'/schedule',{scheduledDate});}
      return call('POST',path(groupId)+'/send',{});
    },
    info:groupId=>call('GET',path(groupId)),
    async cancel(groupId){const g=await call('GET',path(groupId));if(g.status==='SCHEDULED')return call('DELETE',path(groupId)+'/schedule');if(g.status==='PENDING'||g.status==='DELETED')return g;throw Error('이미 발송이 시작되어 취소할 수 없습니다.');}
  };
}
