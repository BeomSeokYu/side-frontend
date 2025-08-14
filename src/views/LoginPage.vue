<template>
  <v-container fluid class="fill-height login-container">
    <v-row no-gutters class="fill-height">
      <!-- 왼쪽 이미지/브랜딩 영역 -->
      <v-col cols="12" md="6" class="d-none d-md-flex align-center justify-center todoist-brand-side">
        <div class="text-center">
          <v-icon size="80" color="#e44332" class="mb-4">mdi-checkbox-marked-circle</v-icon>
          <h1 class="text-h3 font-weight-bold text-white mb-2">Todo</h1>
          <p class="text-h6 text-white opacity-90">할일을 체계적으로 관리하세요</p>
        </div>
      </v-col>
      
      <!-- 오른쪽 로그인 폼 영역 -->
      <v-col cols="12" md="6" class="d-flex align-center justify-center">
        <v-card class="login-card" elevation="0" max-width="400" width="100%">
          <v-card-text class="px-8 py-8">
            <div class="text-center mb-6">
              <v-icon size="40" color="#e44332" class="mb-3">mdi-checkbox-marked-circle</v-icon>
              <h2 class="text-h4 font-weight-bold text-grey-darken-2 mb-1">로그인</h2>
              <p class="text-body-1 text-grey">계정에 로그인하여 시작하세요</p>
            </div>

            <v-form @submit.prevent="handleLogin" ref="loginForm">
              <v-text-field
                v-model="email"
                label="이메일"
                type="email"
                :rules="emailRules"
                variant="outlined"
                prepend-inner-icon="mdi-email-outline"
                class="mb-4"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="비밀번호"
                :type="showPassword ? 'text' : 'password'"
                :rules="passwordRules"
                variant="outlined"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                class="mb-4"
                required
              ></v-text-field>

              <v-btn
                type="submit"
                color="#e44332"
                variant="flat"
                size="large"
                block
                class="mb-4 text-none"
                :loading="loading"
                :disabled="!email || !password"
              >
                로그인
              </v-btn>
            </v-form>

            <v-divider class="my-6"></v-divider>

            <div class="text-center">
              <p class="text-body-2 text-grey-darken-1 mb-4">테스트 계정으로 로그인</p>
              <v-btn
                variant="outlined"
                color="#e44332"
                class="mr-2 mb-2 text-none"
                size="small"
                @click="loginAsAdmin"
              >
                관리자 계정
              </v-btn>
              <v-btn
                variant="outlined"
                color="#e44332"
                class="mb-2 text-none"
                size="small"
                @click="loginAsUser"
              >
                사용자 계정
              </v-btn>
            </div>

            <!-- 에러 메시지 -->
            <v-alert
              v-if="error"
              type="error"
              variant="tonal"
              class="mt-4"
            >
              {{ error }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 반응형 데이터
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const loginForm = ref(null)

// 유효성 검사 규칙
const emailRules = [
  v => !!v || '이메일을 입력해주세요',
  v => /.+@.+\..+/.test(v) || '올바른 이메일 형식이 아닙니다'
]

const passwordRules = [
  v => !!v || '비밀번호를 입력해주세요',
  v => v.length >= 3 || '비밀번호는 최소 3자 이상이어야 합니다'
]

// 메서드
const handleLogin = async () => {
  const { valid } = await loginForm.value.validate()
  if (!valid) return

  loading.value = true
  error.value = ''

  try {
    // 실제 로그인 API 호출 시 사용할 코드
    // await store.dispatch('auth/login', { email: email.value, password: password.value })
    
    // 임시로 localStorage에 사용자 정보 저장
    const userData = {
      email: email.value,
      nickname: email.value === 'admin@todo.com' ? '관리자' : '사용자',
      role: email.value === 'admin@todo.com' ? 'ADMIN' : 'USER'
    }
    localStorage.setItem('user', JSON.stringify(userData))
    
    router.push('/todo')
  } catch (err) {
    error.value = err.message || '로그인에 실패했습니다.'
  } finally {
    loading.value = false
  }
}

const loginAsAdmin = () => {
  email.value = 'admin@todo.com'
  password.value = 'admin123'
  handleLogin()
}

const loginAsUser = () => {
  email.value = 'user@todo.com'
  password.value = 'user123'
  handleLogin()
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.todoist-brand-side {
  background: linear-gradient(135deg, #e44332 0%, #c62d1f 100%);
  position: relative;
}

.todoist-brand-side::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1" fill="white" opacity="0.1"/><circle cx="40" cy="80" r="3" fill="white" opacity="0.05"/></svg>');
  background-size: 200px 200px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.v-text-field {
  margin-bottom: 8px;
}

.v-btn {
  border-radius: 8px !important;
}
</style>