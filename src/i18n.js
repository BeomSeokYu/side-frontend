import { createI18n } from 'vue-i18n';

// JSON 파일을 가져오는 함수
function loadLocaleMessages() {
  const locales = require.context('/src/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

export default createI18n({
  locale: 'ko', // 기본 언어 설정
  fallbackLocale: 'ko', // 지원하지 않는 언어일 경우 기본 언어로 설정
  messages: loadLocaleMessages() // 메시지 파일 로드
});