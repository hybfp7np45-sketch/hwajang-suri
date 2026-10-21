/* V18.7 LaMa browser inference: process original photo/result only, never .brow overlays. */
(function(){
let sessionPromise=null;
const DIAG='suri_lama_diag_v188';
function stage(name){try{localStorage.setItem(DIAG,JSON.stringify({stage:name,at:Date.now()}))}catch(e){}}
function lastStage(){try{const d=JSON.parse(localStorage.getItem(DIAG)||'null');return d&&Date.now()-d.at<3600000?d.stage:null}catch(e){return null}}
async function runtime(progress){
 const timeout=(promise,ms,label)=>Promise.race([promise,new Promise((_,reject)=>setTimeout(()=>reject(Error(label+' 시간 초과 ('+Math.round(ms/1000)+'초). 네트워크 또는 아이폰 메모리 문제일 수 있습니다.')),ms))]);
 if(!sessionPromise)sessionPromise=(async()=>{
  if(!window.ort){
   stage('실행 라이브러리 다운로드');progress('진단 1/3: AI 실행 라이브러리 다운로드 중…');
   await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/ort.min.js';s.onload=resolve;s.onerror=()=>reject(Error('AI 실행 라이브러리 다운로드 실패'));document.head.appendChild(s)});
  }
  stage('실행 라이브러리 로드 완료');progress('진단 2/3: 실행 환경 설정 중…');
  ort.env.wasm.wasmPaths='https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/';
  ort.env.wasm.numThreads=1;
  const url='https://huggingface.co/edgetools/lama/resolve/main/lama_fp32.onnx';
  stage('AI 모델 다운로드 또는 초기화');progress('진단 3/3: AI 모델 다운로드·초기화 중…');
  const sess=await timeout(ort.InferenceSession.create(url,{executionProviders:['wasm'],graphOptimizationLevel:'all'}),120000,'AI 모델 다운로드/초기화');
  stage('모델 준비 완료');return sess;
 })().catch(e=>{sessionPromise=null;throw e});
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