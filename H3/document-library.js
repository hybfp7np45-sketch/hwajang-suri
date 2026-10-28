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
  let menuOrder = [...selected, ...documents.map(doc => doc.id).filter(id => !selected.includes(id))];
  const byId = id => document.getElementById(id);
  const dialog = byId('allForms');
  const icons = {'consent': '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4h17l10 10v29H12a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z"/><path d="M29 4v11h10M16 23h16M16 30h16"/></svg>', 'record': '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M30 10h5a3 3 0 0 1 3 3v11M33 42H9V10h8M17 10V6h5a4 4 0 0 1 8 0h4v6H17Z"/><path d="M15 21h3m5 0h8M15 28h3m5 0h5M23 40l2-9 13-13 6 6-13 13-8 3ZM35 21l6 6"/></svg>', 'minor': '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="19" cy="14" r="9"/><path d="M3 42v-4a16 16 0 0 1 32 0v4H3ZM32 7a8 8 0 0 1 0 16m5 5a13 13 0 0 1 8 12v2h-6"/></svg>'};
  const svg = paths => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  icons.brow = svg('<path d="M5 23C13 10 30 10 43 21C28 16 16 17 5 23Z"/><path d="M9 31c9-5 21-5 30 0"/>');
  icons.scalp = svg('<path d="M10 41V24a14 14 0 0 1 28 0v17M10 24c5-1 7-6 8-10 4 7 12 10 20 10M17 7l-2 9M24 5v10M31 7l2 9"/>');
  icons.lip = svg('<path d="M4 25c8-4 13-13 20-7 7-6 12 3 20 7-9 16-31 16-40 0Z"/><path d="M4 25c12 3 28 3 40 0"/>');
  icons.eyeliner = svg('<path d="M5 26c10-14 25-14 36 0-10 10-25 10-36 0Z"/><path d="m35 20 9-6-3 12M13 18l-3-5M21 15v-5"/><circle cx="24" cy="25" r="6"/>');
  function documentIcon(id) {
    const symbol = document.createElement('span'); symbol.className = 'form-icon'; symbol.innerHTML = icons[id]; return symbol;
  }
  function homeMark(position) {
    const mark = document.createElement('span'); mark.className = 'home-mark';
    mark.setAttribute('role', 'img'); mark.setAttribute('aria-label', `홈 표시 ${position + 1}번째`);
    mark.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 3 10 8h-3v10h-5v-7h-4v7H5V11H2Z"/></svg>';
    return mark;
  }
  function renderHome() {
    byId('homeDocuments').replaceChildren(...selected.map(id => {
      const doc = documents.find(item => item.id === id);
      const a = document.createElement('a'); a.className = 'item form-card' + (id === 'consent' ? ' combined' : ''); a.href = doc.href; a.dataset.document = id;
      const symbol = documentIcon(id);
      const title = document.createElement('strong'); title.textContent = doc.title;
      const arrow = document.createElement('span'); arrow.className = 'document-chevron'; arrow.textContent = '›'; arrow.setAttribute('aria-hidden','true');
      a.append(symbol,title,arrow); return a;
    }));
  }
  function renderLibrary(focusId, direction) {
    const order = editing ? draft : menuOrder.slice(0, 6);
    byId('selectionCount').textContent = editing ? `홈 표시 ${draft.length} / 6개` : `모든 문서 ${documents.length}개`;
    byId('editHomeDocuments').textContent = '홈 표시 선택';
    byId('applyHomeDocuments').hidden = editing;
    byId('saveDocumentSelection').textContent = '완료';
    byId('editHomeDocuments').hidden = editing;
    byId('documentSelectionActions').hidden = !editing;
    byId('documentSelectionMessage').textContent = editing ? (draft.length === 6 ? '완료를 누르면 전체보기로 돌아갑니다.' : '홈에 표시할 문서를 6개 선택해 주세요.') : '';
    byId('saveDocumentSelection').disabled = draft.length !== 6;
    const list = byId('documentLibraryList'); list.replaceChildren();
    const heading = text => { const h = document.createElement('h3'); h.className = 'document-group-title'; h.textContent = text; list.append(h); };
    heading(`홈에 표시할 문서 ${order.length}개`);
    const sorted = editing ? [...order, ...menuOrder.filter(id => !order.includes(id))].map(id => documents.find(doc => doc.id === id)) : menuOrder.map(id => documents.find(doc => doc.id === id));
    sorted.forEach((doc, index) => {
      if (index === order.length) heading('홈에 표시하지 않는 문서');
      const position = order.indexOf(doc.id);
      const row = document.createElement('div'); row.className = 'document-row'; row.dataset.document = doc.id;
      const title = document.createElement('span'); title.className = 'document-title'; title.textContent = doc.title;
      if (editing) {
        const label = document.createElement('label'); label.className = 'document-choice';
        const input = document.createElement('input'); input.type = 'checkbox'; input.checked = position !== -1;
        input.setAttribute('aria-label', doc.title + ' 홈 표시');
        input.addEventListener('change', () => {
          if (input.checked && draft.length >= 6) {
            input.checked = false;
            byId('documentSelectionMessage').textContent = '최대 6개까지 표시할 수 있어요. 다른 문서를 먼저 해제해 주세요.';
            return;
          }
          draft = input.checked ? [...draft, doc.id] : draft.filter(id => id !== doc.id);
          renderLibrary(doc.id);
        });
        label.append(input); if (position !== -1) label.append(homeMark(position)); label.append(title); row.append(label);
        if (position !== -1) {
          const controls = document.createElement('div'); controls.className = 'document-order';
          const number = document.createElement('span'); number.textContent = position + 1; number.className = 'document-position'; controls.append(number);
          [['up','↑',-1],['down','↓',1]].forEach(([name, text, offset]) => {
            const button = document.createElement('button'); button.type = 'button'; button.textContent = text; button.dataset.direction = name;
            button.setAttribute('aria-label', doc.title + (offset < 0 ? ' 위로 이동' : ' 아래로 이동'));
            button.disabled = position + offset < 0 || position + offset >= order.length;
            button.addEventListener('click', () => {
              [draft[position], draft[position + offset]] = [draft[position + offset], draft[position]];
              renderLibrary(doc.id, name);
            }); controls.append(button);
          }); row.append(controls);
        }
      } else {
        const a = document.createElement('a'); a.href = doc.href;
        if (position !== -1) a.append(homeMark(position)); a.append(title); row.append(a);
        const controls = document.createElement('div'); controls.className = 'document-order';
        [['up','↑',-1],['down','↓',1]].forEach(([name,text,offset]) => {
          const button = document.createElement('button'); button.type = 'button'; button.textContent = text; button.dataset.direction = name;
          button.setAttribute('aria-label', doc.title + (offset < 0 ? ' 위로 이동' : ' 아래로 이동'));
          button.disabled = index + offset < 0 || index + offset >= menuOrder.length;
          button.addEventListener('click', () => {
            [menuOrder[index], menuOrder[index + offset]] = [menuOrder[index + offset], menuOrder[index]];
            byId('documentLibraryNotice').textContent = '순서를 바꿨어요. 홈에 적용을 누르면 저장됩니다.';
            renderLibrary(doc.id,name);
          }); controls.append(button);
        }); row.append(controls);
      }
      list.append(row);
    });
    if (focusId) {
      const row = list.querySelector(`[data-document="${focusId}"]`);
      const target = direction ? row.querySelector(`[data-direction="${direction}"]:not(:disabled)`) || row.querySelector('.document-order button:not(:disabled)') : row.querySelector('input');
      if (target) target.focus({preventScroll:true});
    }
  }
  function resetMenu() {
    menuOrder = [...selected, ...documents.map(doc => doc.id).filter(id => !selected.includes(id))];
    draft = selected.slice(); editing = false;
  }
  byId('openDocumentLibrary').addEventListener('click', () => { resetMenu(); byId('documentLibraryNotice').textContent = ''; renderLibrary(); dialog.showModal(); });
  byId('closeDocumentLibrary').addEventListener('click', () => dialog.close());
  byId('editHomeDocuments').addEventListener('click', () => { editing = true; draft = menuOrder.slice(0,6); renderLibrary(); });
  byId('cancelDocumentSelection').addEventListener('click', () => { editing = false; renderLibrary(); });
  byId('saveDocumentSelection').addEventListener('click', () => {
    if (draft.length !== 6) return;
    menuOrder = [...draft, ...menuOrder.filter(id => !draft.includes(id))];
    editing = false; renderLibrary();
    byId('documentLibraryNotice').textContent = '선택을 마쳤어요. 순서를 확인한 뒤 홈에 적용해 주세요.';
    byId('applyHomeDocuments').focus();
  });
  byId('applyHomeDocuments').addEventListener('click', () => {
    const next = menuOrder.slice(0,6);
    try { localStorage.setItem(key, JSON.stringify(next)); }
    catch (_) { byId('documentLibraryNotice').textContent = '저장하지 못했어요. 다시 시도해 주세요.'; return; }
    selected = next; renderHome(); renderLibrary();
    byId('documentLibraryNotice').textContent = '선택한 6개와 순서를 홈에 적용했어요.';
  });
  renderHome();
})();
