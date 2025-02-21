import { createVuetify } from 'vuetify';
import 'vuetify/styles';                          // Vuetify의 기본 스타일 불러오기
import * as components from 'vuetify/components'; // Vuetify 컴포넌트 불러오기
import * as directives from 'vuetify/directives'; // Vuetify 디렉티브 불러오기
import '@mdi/font/css/materialdesignicons.css';   // MDI 아이콘 폰트 불러오기

export default createVuetify({
  components,
  directives,
  icons: {
    iconfont: 'mdi',  // 사용할 아이콘 폰트 설정
  },
});