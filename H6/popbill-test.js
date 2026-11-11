/* Popbill pilot setup. Provider credentials are configured on the server only. */
(() => {
  function mount() {
    const panel = document.getElementById('bkPanel-message');
    const host = panel?.querySelector('.bk-panel-content');
    if (!host || host.querySelector('#popbillPilot')) return;
    const card = document.createElement('section');
    card.id = 'popbillPilot';
    card.className = 'bk-card msg-form';
    card.innerHTML = `<h2>팝빌 문자 수신 테스트</h2>
      <p class="msg-muted">무료 테스트 포인트로 본인 휴대폰에 1건을 보내는 단계예요.</p>
      <p role="status"><strong>발송 서버 준비 완료 · 팝빌 승인 대기</strong></p>
      <ol class="msg-muted"><li>팝빌 연동 신청 후 테스트 키 발급</li><li>테스트 계정에 발신번호 등록·승인</li><li>본인 번호로 문자 1건 발송 후 수신 확인</li></ol>
      <p><a href="https://developers.popbill.com/customer-center/partner-request" target="_blank" rel="noopener noreferrer">팝빌 연동 신청</a></p><p><a class="bk-primary" style="display:block;text-align:center;padding:12px;text-decoration:none;border-radius:10px" href="https://suri-popbill-sms-test.j8yqfsnqjp.chatgpt.site/" target="_blank" rel="noopener noreferrer">문자 테스트 서버 열기</a></p>
      <label>받을 본인 휴대폰번호<input id="pbPilotPhone" type="tel" inputmode="tel" autocomplete="tel" placeholder="010-0000-0000" maxlength="13"></label>
      <label>시험할 문자<textarea id="pbPilotText" maxlength="1000">[화장수리] 문자 연결 테스트입니다.</textarea></label>
      <div class="msg-preview" id="pbPilotPreview"></div><p id="pbPilotLength" class="msg-muted" aria-live="polite"></p>
      <button type="button" class="bk-primary" disabled>문자 1건 발송 · 연결 준비 중</button>
      <p class="msg-muted">아직 문자를 보내지 않았어요. 테스트 키는 앱 입력칸이나 고객정보에 저장하지 않아요.</p>`;
    host.querySelector('.msg-nav')?.before(card);
    const phone = card.querySelector('#pbPilotPhone');
    const text = card.querySelector('#pbPilotText');
    const draw = () => {
      const bytes = [...text.value].reduce((n, ch) => n + (ch.charCodeAt(0) < 128 ? 1 : 2), 0);
      card.querySelector('#pbPilotPreview').textContent = text.value;
      card.querySelector('#pbPilotLength').textContent = `${bytes}byte · ${bytes <= 90 ? '단문 SMS' : '장문 LMS'}${bytes > 2000 ? ' · 2,000byte 이내로 줄여 주세요.' : ''}`;
    };
    phone.addEventListener('input', () => {
      phone.setCustomValidity(/^010\d{8}$/.test(phone.value.replace(/[-\s]/g, '')) ? '' : '본인 휴대폰번호를 확인해 주세요.');
    });
    text.addEventListener('input', draw);
    draw();
    for (const button of panel.querySelectorAll('#msgRunTest, #msgFailTest')) {
      button.textContent = button.id === 'msgRunTest' ? '발송 흐름만 확인' : '실패 흐름만 확인';
    }
  }
  new MutationObserver(mount).observe(document.body, {childList: true, subtree: true});
  mount();
})();
