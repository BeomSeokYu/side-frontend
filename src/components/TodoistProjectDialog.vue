<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="450"
    persistent
    class="todoist-dialog"
  >
    <v-card class="todoist-project-card" elevation="8">
      <!-- 헤더 -->
      <v-card-title class="todoist-dialog-header pa-4 d-flex align-center">
        <v-icon color="#e44332" class="mr-3" size="24">mdi-folder-plus-outline</v-icon>
        <span class="text-h6 font-weight-medium">
          {{ project ? '프로젝트 편집' : '새 프로젝트' }}
        </span>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="$emit('close')"
          class="todoist-close-btn"
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <!-- 프로젝트 입력 폼 -->
      <v-card-text class="pa-4">
        <div class="todoist-project-input">
          <!-- 프로젝트 이름 -->
          <div class="mb-4">
            <label class="todoist-label">프로젝트 이름</label>
            <v-text-field
              v-model="formData.projectName"
              placeholder="프로젝트 이름을 입력하세요"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :rules="nameRules"
              class="todoist-name-input"
              :class="{ 'error': nameError }"
            ></v-text-field>
          </div>

          <!-- 설명 -->
          <div class="mb-4">
            <label class="todoist-label">설명</label>
            <v-textarea
              v-model="formData.description"
              placeholder="프로젝트 설명을 입력하세요 (선택사항)"
              variant="outlined"
              rows="3"
              density="comfortable"
              hide-details
              class="todoist-desc-input"
            ></v-textarea>
          </div>

          <!-- 색상 선택 -->
          <div class="mb-4">
            <label class="todoist-label">색상</label>
            <div class="todoist-color-picker">
              <div 
                v-for="color in colorOptions" 
                :key="color.value"
                class="todoist-color-option"
                :class="{ 'selected': formData.color === color.value }"
                :style="{ backgroundColor: color.value }"
                @click="formData.color = color.value"
                :title="color.name"
              >
                <v-icon v-if="formData.color === color.value" color="white" size="16">
                  mdi-check
                </v-icon>
              </div>
            </div>
          </div>

          <!-- 즐겨찾기 -->
          <div class="todoist-favorite-section">
            <v-switch
              v-model="formData.isFavorite"
              label="즐겨찾기에 추가"
              color="#e44332"
              hide-details
              class="todoist-switch"
            ></v-switch>
          </div>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <!-- 액션 버튼 -->
      <v-card-actions class="todoist-dialog-actions pa-4 d-flex justify-end">
        <v-btn
          variant="text"
          @click="$emit('close')"
          class="todoist-cancel-btn text-none"
        >
          취소
        </v-btn>
        <v-btn
          color="#e44332"
          variant="flat"
          @click="handleSave"
          :disabled="!formData.projectName"
          class="todoist-save-btn text-none ml-2"
        >
          {{ project ? '저장' : '프로젝트 추가' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  project: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'save', 'close'])

// 반응형 데이터
const nameError = ref(false)
const formData = ref({
  projectName: '',
  description: '',
  color: '#4285f4',
  isFavorite: false
})

// 컴퓨티드
const colorOptions = computed(() => [
  { name: '파랑', value: '#4285f4' },
  { name: '빨강', value: '#e44332' },
  { name: '초록', value: '#34a853' },
  { name: '노랑', value: '#fbbc04' },
  { name: '보라', value: '#9c27b0' },
  { name: '주황', value: '#ff9800' },
  { name: '분홍', value: '#e91e63' },
  { name: '청록', value: '#009688' },
  { name: '회색', value: '#757575' }
])

const nameRules = computed(() => [
  v => !!v || '프로젝트 이름을 입력해주세요',
  v => (v && v.length <= 100) || '프로젝트 이름은 100자 이하여야 합니다'
])

// 메서드
const handleSave = () => {
  if (!formData.value.projectName) {
    nameError.value = true
    return
  }

  emit('save', formData.value)
}

const resetForm = () => {
  formData.value = {
    projectName: '',
    description: '',
    color: '#4285f4',
    isFavorite: false
  }
  nameError.value = false
}

// 와처
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    if (props.project) {
      // 편집 모드
      formData.value = {
        projectName: props.project.projectName || '',
        description: props.project.description || '',
        color: props.project.color || '#4285f4',
        isFavorite: props.project.isFavorite || false
      }
    } else {
      resetForm()
    }
  }
})

watch(() => formData.value.projectName, () => {
  if (nameError.value && formData.value.projectName) {
    nameError.value = false
  }
})
</script>

<style scoped>
.todoist-dialog {
  z-index: 1000;
}

.todoist-project-card {
  border-radius: 12px !important;
  overflow: hidden;
}

.todoist-dialog-header {
  background-color: #fafafa;
  border-bottom: none;
}

.todoist-close-btn {
  opacity: 0.6;
  transition: opacity 0.2s;
}

.todoist-close-btn:hover {
  opacity: 1;
}

.todoist-project-input {
  background-color: #ffffff;
}

.todoist-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.todoist-name-input .v-field, .todoist-desc-input .v-field {
  border-radius: 8px !important;
  background-color: #fafafa !important;
}

.todoist-name-input.error .v-field {
  border-color: #e44332 !important;
  border-width: 2px !important;
}

.todoist-color-picker {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.todoist-color-option {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.todoist-color-option:hover {
  transform: scale(1.1);
}

.todoist-color-option.selected {
  border-color: #333;
  transform: scale(1.1);
}

.todoist-favorite-section {
  margin-top: 16px;
}

.todoist-switch {
  font-size: 14px;
}

.todoist-dialog-actions {
  background-color: #fafafa;
}

.todoist-cancel-btn {
  color: #666 !important;
  font-weight: 500 !important;
}

.todoist-save-btn {
  font-weight: 600 !important;
  border-radius: 6px !important;
  box-shadow: none !important;
}

.todoist-save-btn:disabled {
  background-color: #e0e0e0 !important;
  color: #999 !important;
}
</style>