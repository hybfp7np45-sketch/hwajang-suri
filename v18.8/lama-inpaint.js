/* V18.7 LaMa browser inference: process original photo/result only, never .brow overlays. */
(function(){
let sessionPromise=null;
const DIAG='suri_lama_diag_v188';
function stage(name){try{localStorage.setItem(DIAG,JSON.stringify({stage:name,at:Date.now()}))}catch(e){}}
function lastStage(){try{const d=JSON.parse(localStorage.getItem(DIAG)||'null');return d&&Date.now()-d.at<3600000?d.stage:null}catch(e){return null}}
async function runtime(progress){
 const report=(name,msg)=>{stage(name);progress(msg)};
 const yieldUI=()=>new Promise(resolve=>setTimeout(resolve,35));
 const withTimeout=(p,ms,label)=>Promise.race([p,new Promise((_,reject)=>setTimeout(()=>reject(Error(label+' 시간 초과 ('+Math.round(ms/1000)+'초)')),ms))]);
 if(!sessionPromise)sessionPromise=(async()=>{
  if(!window.ort){
   report('1 라이브러리 다운로드','진단 1/7: 실행 라이브러리 다운로드…');await yieldUI();
   await withTimeout(new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/ort.min.js';script.onload=resolve;script.onerror=()=>reject(Error('실행 라이브러리 다운로드 실패'));document.head.appendChild(script)}),30000,'라이브러리');
  }
  report('2 WASM 환경 설정','진단 2/7: WASM 실행 환경 설정…');
  ort.env.wasm.wasmPaths='https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/';
  ort.env.wasm.numThreads=1;await yieldUI();
  const url='https://huggingface.co/edgetools/lama/resolve/main/lama_fp32.onnx';
  report('3 모델 서버 연결','진단 3/7: 모델 서버 연결 중…');await yieldUI();
  const controller=new AbortController();
  const abort=setTimeout(()=>controller.abort(),60000);
  let response;
  try{response=await fetch(url,{signal:controller.signal,cache:'no-store'});}
  catch(e){clearTimeout(abort);throw Error('모델 연결 실패: '+e.message+' (네트워크/CORS 확인)')}
  if(!response.ok){clearTimeout(abort);throw Error('모델 서버 HTTP '+response.status)}
  const total=Number(response.headers.get('content-length'))||0;
  report('4 모델 파일 수신','진단 4/7: 모델 다운로드 시작'+(total?' ('+Math.round(total/1048576)+'MB)':'')+'…');await yieldUI();
  let bytes;
  try{
   if(response.body&&response.body.getReader){
    const reader=response.body.getReader(),chunks=[];let loaded=0,last=0;
    while(true){
     const {done,value}=await reader.read();if(done)break;
     chunks.push(value);loaded+=value.byteLength;
     const now=Date.now();
     if(now-last>500){last=now;report('4 다운로드 '+Math.round(loaded/1048576)+'MB'+(total?'/'+Math.round(total/1048576)+'MB':''),'진단 4/7: 다운로드 '+Math.round(loaded/1048576)+'MB'+(total?'/'+Math.round(total/1048576)+'MB':'')+'…');await yieldUI();}
    }
    clearTimeout(abort);
    report('5 모델 데이터 병합','진단 5/7: 다운로드 완료, 모델 데이터 병합 ('+Math.round(loaded/1048576)+'MB)…');await yieldUI();
    bytes=new Uint8Array(loaded);let offset=0;
    for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
   }else{
    const buffer=await response.arrayBuffer();clearTimeout(abort);
    bytes=new Uint8Array(buffer);
    report('5 모델 다운로드 완료','진단 5/7: 다운로드 완료 ('+Math.round(bytes.byteLength/1048576)+'MB)…');await yieldUI();
   }
  }catch(e){clearTimeout(abort);throw e}
  report('6 모델 세션 초기화','진단 6/7: ONNX 모델 초기화 중 ('+Math.round(bytes.byteLength/1048576)+'MB)…');await yieldUI();
  const sess=await withTimeout(ort.InferenceSession.create(bytes,{executionProviders:['wasm'],graphOptimizationLevel:'all'}),120000,'모델 초기화');
  report('7 모델 준비 완료','진단 7/7: 모델 준비 완료');await yieldUI();
  return sess;
 })().catch(e=>{stage('오류: '+e.message);sessionPromise=null;throw e});
 return sessionPromise;
}
window.suriLamaInpaint=async function(crop,mask,progress){
 const prev=lastStage();progress(prev&&prev!=='모델 준비 완료'?'이전 실행 마지막 단계: '+prev+' / 다시 진단 중…':'AI 실행 진단 시작…');
 const session=await runtime(progress);
 stage('AI 추론 준비');progress('AI 모델 준비 완료. 피부 복원 처리 중…');
 const S=512,c=document.createElement('canvas');c.width=c.height=S;
 const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(crop,0,0,S,S);
 const rgba=ctx.getImageData(0,0,S,S);
 const mc=document.createElement('canvas');mc.width=mc.height=S;
 const mx=mc.getContext('2d',{willReadFrequently:true});
 const originalMask=document.createElement('canvas');originalMask.width=crop.width;originalMask.height=crop.height;
 const om=originalMask.getContext('2d');const md=om.createImageData(crop.width,crop.height);
 for(let i=0;i<mask.length;i++){md.data[i*4]=255;md.data[i*4+1]=255;md.data[i*4+2]=255;md.data[i*4+3]=mask[i]?255:0}
 om.putImageData(md,0,0);mx.drawImage(originalMask,0,0,S,S);
 const maskData=mx.getImageData(0,0,S,S).data;
 const image=new Float32Array(3*S*S),hole=new Float32Array(S*S);
 for(let i=0;i<S*S;i++){hole[i]=maskData[i*4+3]>35?1:0;for(let ch=0;ch<3;ch++)image[ch*S*S+i]=rgba.data[i*4+ch]/255}
 progress('AI가 피부를 복원하는 중…');
 const input={image:new ort.Tensor('float32',image,[1,3,S,S]),mask:new ort.Tensor('float32',hole,[1,1,S,S])};
 const output=await session.run(input);
 const values=output[session.outputNames[0]].data;
 const result=ctx.createImageData(S,S);
 for(let i=0;i<S*S;i++){for(let ch=0;ch<3;ch++)result.data[i*4+ch]=Math.max(0,Math.min(255,values[ch*S*S+i]));result.data[i*4+3]=255}
 const predicted=document.createElement('canvas');predicted.width=predicted.height=S;predicted.getContext('2d').putImageData(result,0,0);
 const full=document.createElement('canvas');full.width=crop.width;full.height=crop.height;full.getContext('2d').drawImage(predicted,0,0,full.width,full.height);
 const out=full.getContext('2d').getImageData(0,0,full.width,full.height);
 const orig=crop.getContext('2d').getImageData(0,0,crop.width,crop.height);
 const blended=new Uint8ClampedArray(out.data.length);
 for(let i=0;i<mask.length;i++){const a=mask[i]?255:0;for(let ch=0;ch<3;ch++)blended[i*4+ch]=out.data[i*4+ch];blended[i*4+3]=a}
 const fc=document.createElement('canvas');fc.width=crop.width;fc.height=crop.height;
 fc.getContext('2d').putImageData(new ImageData(blended,crop.width,crop.height),0,0);
 return fc;
};
})();