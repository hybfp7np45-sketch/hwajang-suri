(()=>{'use strict';
const opened=new Promise((resolve,reject)=>{const request=indexedDB.open('hwajang-suri-custom-documents-v1',1);request.onupgradeneeded=()=>request.result.createObjectStore('templates',{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(new Error('이 브라우저에서 문서를 보관할 수 없어요. 일반 브라우저에서 다시 열어 주세요.'));});
async function run(mode,action){const db=await opened;return new Promise((resolve,reject)=>{const tx=db.transaction('templates',mode);let result;const request=action(tx.objectStore('templates'));request.onsuccess=()=>{result=request.result;};tx.oncomplete=()=>resolve(result);tx.onerror=tx.onabort=()=>reject(new Error('문서를 보관하지 못했어요. 기기 저장 공간을 확인해 주세요.'));});}
window.CustomDocuments={remove:id=>run('readwrite',s=>s.delete(id)),all:()=>run('readonly',s=>s.getAll()),get:id=>run('readonly',s=>s.get(id)),put:item=>run('readwrite',s=>s.put(item))};
})();
