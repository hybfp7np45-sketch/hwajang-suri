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
  
  let menuOrder = [...selected, ...documents.map(doc => doc.id).filter(id => !selected.includes(id))];
  const byId = id => document.getElementById(id);
  const dialog = byId('allForms');
  const icons = {'consent': '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4h17l10 10v29H12a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z"/><path d="M29 4v11h10M16 23h16M16 30h16"/></svg>', 'record': '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M30 10h5a3 3 0 0 1 3 3v11M33 42H9V10h8M17 10V6h5a4 4 0 0 1 8 0h4v6H17Z"/><path d="M15 21h3m5 0h8M15 28h3m5 0h5M23 40l2-9 13-13 6 6-13 13-8 3ZM35 21l6 6"/></svg>', 'minor': '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="19" cy="14" r="9"/><path d="M3 42v-4a16 16 0 0 1 32 0v4H3ZM32 7a8 8 0 0 1 0 16m5 5a13 13 0 0 1 8 12v2h-6"/></svg>'};
  const svg = paths => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  icons.brow = '<svg viewBox="0 0 29 35" aria-hidden="true"><image href="./assets/brow-selected.svg?v=2" width="29" height="35"/></svg>';
  icons.scalp = '<svg viewBox="0 0 29 35" aria-hidden="true"><image href="./assets/scalp-selected.svg?v=2" x="0.725" y="0.875" width="27.55" height="33.25"/></svg>';
  icons.lip = svg('<path d="M4 25c8-4 13-13 20-7 7-6 12 3 20 7-9 16-31 16-40 0Z"/><path d="M4 25c12 3 28 3 40 0"/>');
  icons.eyeliner = '<svg viewBox="0 0 29 35" aria-hidden="true"><image href="./assets/eyeliner-selected.svg?v=2" width="29" height="35"/></svg>';
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
    byId('selectionCount').textContent = `모든 문서 ${documents.length}개`;
    const list = byId('documentLibraryList'); list.replaceChildren();
    menuOrder.forEach((id, index) => {
      const doc = documents.find(item => item.id === id);
      const row = document.createElement('div'); row.className = 'document-row'; row.dataset.document = id;
      const a = document.createElement('a'); a.href = doc.href;
      if (index < 6) a.append(homeMark(index));
      const title = document.createElement('span'); title.className = 'document-title'; title.textContent = doc.title;
      a.append(title); row.append(a);
      const controls = document.createElement('div'); controls.className = 'document-order';
      [['up','↑',-1],['down','↓',1]].forEach(([name,label,offset]) => {
        const button = document.createElement('button'); button.type = 'button'; button.textContent = label; button.dataset.direction = name;
        button.setAttribute('aria-label',doc.title + (offset < 0 ? ' 위로 이동' : ' 아래로 이동'));
        button.disabled = index + offset < 0 || index + offset >= menuOrder.length;
        button.addEventListener('click', () => {
          [menuOrder[index], menuOrder[index+offset]] = [menuOrder[index+offset], menuOrder[index]];
          byId('documentLibraryNotice').textContent = '';
          renderLibrary(id,name);
        }); controls.append(button);
      });
      row.append(controls); list.append(row);
    });
    if (focusId) {
      const row = list.querySelector(`[data-document="${focusId}"]`);
      const target = row.querySelector(`[data-direction="${direction}"]:not(:disabled)`) || row.querySelector('button:not(:disabled)');
      if (target) target.focus({preventScroll:true});
    }
  }
  byId('openDocumentLibrary').addEventListener('click', () => {
    menuOrder = [...selected,...documents.map(doc => doc.id).filter(id => !selected.includes(id))];
    byId('documentLibraryNotice').textContent = ''; renderLibrary(); dialog.showModal();
  });
  byId('closeDocumentLibrary').addEventListener('click', () => dialog.close());
  byId('applyHomeDocuments').addEventListener('click', () => {
    const next = menuOrder.slice(0,6);
    try { localStorage.setItem(key,JSON.stringify(next)); }
    catch (_) { byId('documentLibraryNotice').textContent = '저장하지 못했어요. 다시 시도해 주세요.'; return; }
    selected = next; renderHome(); renderLibrary();
    byId('documentLibraryNotice').textContent = '';
    dialog.close();
  });
  renderHome();
})();
