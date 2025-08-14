<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="500"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="headline">새 프로젝트</span>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="$emit('close')"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <!-- 프로젝트 이름 -->
          <v-text-field
            v-model="formData.projectName"
            label="프로젝트 이름 *"
            :rules="nameRules"
            required
            outlined
            class="mb-3"
          ></v-text-field>
          
          <!-- 설명 -->
          <v-textarea
            v-model="formData.description"
            label="설명"
            outlined
            rows="3"
            class="mb-3"
          ></v-textarea>
          
          <!-- 색상 선택 -->
          <div class="mb-4">
            <v-label class="mb-2">프로젝트 색상</v-label>
            <div class="color-picker">
              <v-btn
                v-for="color in colorOptions"
                :key="color.value"
                :color="color.value"
                :variant="formData.color === color.value ? 'elevated' : 'outlined'"
                size="large"
                icon
                class="ma-1"
                @click="formData.color = color.value"
              >
                <v-icon v-if="formData.color === color.value">mdi-check</v-icon>
              </v-btn>
            </div>
          </div>
          
          <!-- 즐겨찾기 -->
          <v-switch
            v-model="formData.isFavorite"
            label="즐겨찾기에 추가"
            class="mb-3"
          ></v-switch>
        </v-form>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          @click="$emit('close')"
        >
          취소
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!valid"
          :loading="loading"
          @click="save"
        >
          저장
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'

defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'save', 'close'])

// 반응형 데이터
const valid = ref(false)
const loading = ref(false)
const form = ref()

const formData = reactive({
  projectName: '',
  description: '',
  color: '#1976D2',
  isFavorite: false
})

// 색상 옵션
const colorOptions = ref([
  { name: '블루', value: '#1976D2' },
  { name: '그린', value: '#388E3C' },
  { name: '오렌지', value: '#F57C00' },
  { name: '레드', value: '#D32F2F' },
  { name: '퍼플', value: '#7B1FA2' },
  { name: '틸', value: '#00796B' },
  { name: '인디고', value: '#303F9F' },
  { name: '핑크', value: '#C2185B' }
])

// 유효성 검사 규칙
const nameRules = [
  v => !!v || '프로젝트 이름은 필수입니다.',
  v => (v && v.length <= 100) || '프로젝트 이름은 100자 이하여야 합니다.'
]

// 메서드
const save = async () => {
  if (!form.value.validate()) return
  
  loading.value = true
  try {
    await emit('save', { ...formData })
    resetForm()
  } catch (error) {
    console.error('프로젝트 저장 실패:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.assign(formData, {
    projectName: '',
    description: '',
    color: '#1976D2',
    isFavorite: false
  })
  
  if (form.value) {
    form.value.resetValidation()
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.v-btn.v-btn--icon {
  width: 48px;
  height: 48px;
}
</style>