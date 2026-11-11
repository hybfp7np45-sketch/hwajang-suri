/** Server-side sandbox pilot. Set runtime secrets locally, never in the web page. */
import popbill from 'popbill';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';

const required = ['POPBILL_LINK_ID', 'POPBILL_SECRET_KEY', 'POPBILL_CORP_NUM', 'POPBILL_USER_ID', 'POPBILL_SENDER', 'POPBILL_TEST_RECIPIENT'];
for (const name of required) {
  if (!process.env[name]) throw new Error(`서버 설정 필요: ${name}`);
}
const digits = value => String(value).replace(/[-\s]/g, '');
const corp = digits(process.env.POPBILL_CORP_NUM);
const sender = digits(process.env.POPBILL_SENDER);
const recipient = digits(process.env.POPBILL_TEST_RECIPIENT);
const userId = process.env.POPBILL_USER_ID;
if (!/^\d{10}$/.test(corp) || !/^\d{8,11}$/.test(sender) || !/^010\d{8}$/.test(recipient)) {
  throw new Error('사업자번호·승인된 발신번호·본인 수신번호를 확인해 주세요.');
}
const operation = process.argv[2];
const requestNum = process.argv[3];
if (!['send', 'status'].includes(operation) || !/^[A-Za-z0-9_-]{1,36}$/.test(requestNum || '')) {
  throw new Error('사용법: npm run pilot -- send|status 고유요청번호');
}
popbill.config({LinkID: process.env.POPBILL_LINK_ID, SecretKey: process.env.POPBILL_SECRET_KEY, IsTest: true, IPRestrictOnOff: false, UseStaticIP: false, UseLocalTimeYN: false});
const service = popbill.MessageService();
const call = (method, ...args) => new Promise((resolveCall, reject) => service[method](...args, resolveCall, reject));
const directory = resolve(process.env.POPBILL_PILOT_STATE_DIR || '.popbill-pilot');
await mkdir(directory, {recursive: true, mode: 0o700});
const file = resolve(directory, `${requestNum}.json`);
if (operation === 'status') {
  const record = JSON.parse(await readFile(file, 'utf8'));
  const results = await call('getMessagesRN', corp, requestNum, userId);
  // No message bodies or phone numbers are printed to shared logs.
  console.log(JSON.stringify({requestNum, receiptNum: record.receiptNum, messages: results.map(item => ({state: item.state, result: item.result}))}));
} else {
  const text = process.env.POPBILL_TEST_TEXT || '[화장수리] 문자 연결 테스트입니다.';
  const bytes = [...text].reduce((n, char) => n + (char.charCodeAt(0) < 128 ? 1 : 2), 0);
  if (!text.trim() || bytes > 2000 || /#\{/.test(text)) throw new Error('시험 문구와 길이를 확인해 주세요.');
  const senderResult = await call('checkSenderNumber', corp, sender, userId);
  if (senderResult.code !== 200) throw new Error('발신번호 승인이 필요합니다.');
  // Exclusive durable record blocks repeated or concurrent dispatches with this ID.
  const record = {requestNum, status: 'dispatching', at: new Date().toISOString()};
  await writeFile(file, JSON.stringify(record), {flag: 'wx', mode: 0o600});
  try {
    const receiptNum = bytes <= 90
      ? await call('sendSMS', corp, sender, recipient, '본인 테스트', text, '', false, '화장수리', requestNum, userId)
      : await call('sendLMS', corp, sender, recipient, '본인 테스트', '문자 연결 테스트', text, '', false, '화장수리', requestNum, userId);
    record.receiptNum = receiptNum;
    record.status = 'accepted';
    await writeFile(file, JSON.stringify(record), {mode: 0o600});
    console.log('팝빌 접수 완료. status 조회와 실제 휴대폰 수신 확인이 필요합니다.');
  } catch (error) {
    record.status = 'needs_review';
    await writeFile(file, JSON.stringify(record), {mode: 0o600});
    throw new Error(`결과 확인 필요. 재발송 전 같은 요청번호로 status를 조회하세요. 오류 코드 ${error.code || '미확인'}`);
  }
}
