(() => {
  'use strict';
  const documents = [
    {id:'consent', title:'시술 동의서 & 건강상태 확인서', kind:'동의서', href:'./customer-forms.html'},
    {id:'record', title:'시술 기록지', kind:'기록지', href:'./forms.html?type=record'},
    {id:'minor', title:'미성년자 동의서', kind:'동의서', href:'./forms.html?type=minor'},
    {id:'brow', title:'눈썹 상담차트', kind:'상담차트', href:'./chart.html?type=brow'},
    {id:'scalp', title:'두피 · 헤어라인 상담차트', kind:'상담차트', href:'./chart.html?type=scalp'},
    {id:'lip', title:'입술 상담차트', kind:'상담차트', href:'./chart.html?type=lip'},
    {id:'eyeliner', title:'아이라인 상담차트', kind:'상담차트', href:'./chart.html?type=eyeliner'}
  ];
  const key = 'hwajang-suri-h3-home-documents-v1';
  const defaults = ['consent','record','brow','scalp','lip','eyeliner'];
  let selected = defaults.slice();
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(stored) && stored.length === 6 && new Set(stored).size === 6 && stored.every(id => documents.some(doc => doc.id === id))) selected = stored;
  } catch (_) {}
  let draft = selected.slice(), editing = false;
  const byId = id => document.getElementById(id);
  const dialog = byId('allForms');
  const icon = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 4h17l10 10v29H12a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z"/><path d="M29 4v11h10M16 23h16M16 30h16M16 37h10"/></svg>';
  function renderHome() {
    byId('homeDocuments').replaceChildren(...selected.map(id => {
      const doc = documents.find(item => item.id === id);
      const a = document.createElement('a'); a.className = 'item form-card'; a.href = doc.href;
      const symbol = document.createElement('span'); symbol.className = 'form-icon'; symbol.innerHTML = icon;
      const title = document.createElement('strong'); title.textContent = doc.title;
      const arrow = document.createElement('span'); arrow.className = 'document-chevron'; arrow.textContent = '›'; arrow.setAttribute('aria-hidden','true');
      a.append(symbol,title,arrow); return a;
    }));
  }
  function renderLibrary() {
    byId('selectionCount').textContent = editing ? `홈 표시 ${draft.length} / 6개` : '모든 문서 7개';
    byId('editHomeDocuments').hidden = editing;
    byId('documentSelectionActions').hidden = !editing;
    byId('documentSelectionMessage').textContent = editing ? (draft.length === 6 ? '선택한 6개를 홈에 표시합니다.' : '홈에 표시할 문서를 6개 선택해 주세요.') : '';
    byId('saveDocumentSelection').disabled = draft.length !== 6;
    byId('documentLibraryList').replaceChildren(...documents.map(doc => {
      const row = document.createElement('div'); row.className = 'document-row';
      if (editing) {
        const label = document.createElement('label'); label.className = 'document-choice';
        const input = document.createElement('input'); input.type = 'checkbox'; input.checked = draft.includes(doc.id);
        input.addEventListener('change', () => {
          if (input.checked && draft.length >= 6) {
            input.checked = false;
            byId('documentSelectionMessage').textContent = '최대 6개까지 표시할 수 있어요. 다른 문서를 먼저 해제해 주세요.';
            return;
          }
          draft = input.checked ? [...draft, doc.id] : draft.filter(id => id !== doc.id);
          renderLibrary();
          const replacement = byId('documentLibraryList').querySelector(`[data-document="${doc.id}"] input`);
          if (replacement) replacement.focus();
        });
        const title = document.createElement('span'); title.textContent = doc.title;
        label.append(input,title); row.append(label);
      } else {
        const a = document.createElement('a'); a.href = doc.href; a.textContent = doc.title;
        const tag = document.createElement('small'); tag.textContent = selected.includes(doc.id) ? '홈 표시' : doc.kind;
        row.append(a,tag);
      }
      row.dataset.document = doc.id; return row;
    }));
  }
  byId('openDocumentLibrary').addEventListener('click', () => { editing = false; draft = selected.slice(); renderLibrary(); dialog.showModal(); });
  byId('closeDocumentLibrary').addEventListener('click', () => dialog.close());
  byId('editHomeDocuments').addEventListener('click', () => { editing = true; draft = selected.slice(); renderLibrary(); });
  byId('cancelDocumentSelection').addEventListener('click', () => { editing = false; draft = selected.slice(); renderLibrary(); });
  byId('saveDocumentSelection').addEventListener('click', () => {
    if (draft.length !== 6) return;
    selected = draft.slice();
    try { localStorage.setItem(key, JSON.stringify(selected)); }
    catch (_) { byId('documentSelectionMessage').textContent = '저장 공간을 사용할 수 없어 이 화면에서만 적용됩니다.'; renderHome(); return; }
    renderHome(); editing = false; renderLibrary(); dialog.close(); byId('openDocumentLibrary').focus();
  });
  renderHome();
})();
