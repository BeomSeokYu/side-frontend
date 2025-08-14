<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="550"
    persistent
    class="todoist-dialog"
  >
    <v-card class="todoist-task-card" elevation="8">
      <!-- 헤더 -->
      <v-card-title class="todoist-dialog-header pa-4 d-flex align-center">
        <v-icon color="#e44332" class="mr-3" size="24">mdi-plus-circle-outline</v-icon>
        <span class="text-h6 font-weight-medium">
          {{ task ? '할일 편집' : '빠른 할일 추가' }}
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

      <!-- 할일 입력 폼 -->
      <v-card-text class="pa-0">
        <div class="todoist-task-input pa-4">
          <!-- 할일 제목 -->
          <v-textarea
            v-model="formData.title"
            placeholder="할일 이름을 입력하세요. 예: 회의 준비하기"
            variant="plain"
            rows="2"
            auto-grow
            hide-details
            class="todoist-title-input mb-3"
            :class="{ 'error': titleError }"
          ></v-textarea>

          <!-- 설명 -->
          <v-textarea
            v-model="formData.description"
            placeholder="설명"
            variant="plain"
            rows="3"
            auto-grow
            hide-details
            class="todoist-desc-input mb-4"
          ></v-textarea>

          <!-- 속성들 -->
          <div class="todoist-attributes">
            <!-- 프로젝트 선택 -->
            <div class="todoist-attr-row mb-3">
              <v-icon color="#808080" size="20" class="mr-3">mdi-folder-outline</v-icon>
              <v-select
                v-model="formData.projectId"
                :items="projectItems"
                placeholder="프로젝트 선택"
                variant="outlined"
                density="compact"
                hide-details
                class="todoist-select"
              ></v-select>
            </div>

            <!-- 날짜 선택 -->
            <div class="todoist-attr-row mb-3">
              <v-icon color="#808080" size="20" class="mr-3">mdi-calendar</v-icon>
              <div class="d-flex ga-2 flex-1">
                <v-text-field
                  v-model="formData.startDate"
                  type="date"
                  placeholder="시작일"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="todoist-date-input"
                ></v-text-field>
                <v-text-field
                  v-model="formData.endDate"
                  type="date"
                  placeholder="마감일"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="todoist-date-input"
                ></v-text-field>
              </div>
            </div>

            <!-- 우선순위 -->
            <div class="todoist-attr-row mb-3">
              <v-icon color="#808080" size="20" class="mr-3">mdi-flag-outline</v-icon>
              <v-select
                v-model="formData.priority"
                :items="priorityItems"
                placeholder="우선순위"
                variant="outlined"
                density="compact"
                hide-details
                class="todoist-select"
              ></v-select>
            </div>

            <!-- 중요 표시 -->
            <div class="todoist-attr-row mb-4">
              <v-icon color="#808080" size="20" class="mr-3">mdi-star-outline</v-icon>
              <v-switch
                v-model="formData.isImportant"
                label="중요한 할일로 표시"
                color="#e44332"
                hide-details
                class="todoist-switch"
              ></v-switch>
            </div>
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
          :disabled="!formData.title || !formData.projectId"
          class="todoist-save-btn text-none ml-2"
        >
          {{ task ? '저장' : '할일 추가' }}
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
  task: {
    type: Object,
    default: null
  },
  projects: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'save', 'close'])

// 반응형 데이터
const titleError = ref(false)
const formData = ref({
  title: '',
  description: '',
  projectId: null,
  priority: 'MEDIUM',
  isImportant: false,
  startDate: '',
  endDate: ''
})

// 컴퓨티드
const projectItems = computed(() => 
  props.projects.map(project => ({
    title: project.projectName,
    value: project.projectId
  }))
)

const priorityItems = computed(() => [
  { title: '낮음', value: 'LOW' },
  { title: '보통', value: 'MEDIUM' },
  { title: '높음', value: 'HIGH' },
  { title: '긴급', value: 'URGENT' }
])

// 메서드
const handleSave = () => {
  if (!formData.value.title) {
    titleError.value = true
    return
  }
  
  if (!formData.value.projectId && props.projects.length > 0) {
    formData.value.projectId = props.projects[0].projectId
  }

  // 날짜를 LocalDateTime 형식으로 변환
  const taskData = {
    ...formData.value,
    startDate: formData.value.startDate ? `${formData.value.startDate}T09:00:00` : null,
    endDate: formData.value.endDate ? `${formData.value.endDate}T18:00:00` : null
  }

  emit('save', taskData)
}

const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    projectId: null,
    priority: 'MEDIUM',
    isImportant: false,
    startDate: '',
    endDate: ''
  }
  titleError.value = false
}

// 와처
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    if (props.task) {
      // 편집 모드
      formData.value = {
        title: props.task.title || '',
        description: props.task.description || '',
        projectId: props.task.projectId || null,
        priority: props.task.priority || 'MEDIUM',
        isImportant: props.task.isImportant || false,
        startDate: props.task.startDate ? props.task.startDate.split('T')[0] : '',
        endDate: props.task.endDate ? props.task.endDate.split('T')[0] : ''
      }
    } else {
      resetForm()
    }
  }
})

watch(() => formData.value.title, () => {
  if (titleError.value && formData.value.title) {
    titleError.value = false
  }
})
</script>

<style scoped>
.todoist-dialog {
  z-index: 1000;
}

.todoist-task-card {
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

.todoist-task-input {
  background-color: #ffffff;
}

.todoist-title-input {
  font-size: 16px;
  font-weight: 500;
}

.todoist-title-input.error {
  border: 2px solid #e44332 !important;
  border-radius: 8px;
  padding: 8px;
}

.todoist-desc-input {
  font-size: 14px;
  color: #666;
}

.todoist-attributes {
  margin-top: 16px;
}

.todoist-attr-row {
  display: flex;
  align-items: center;
}

.flex-1 {
  flex: 1;
}

.todoist-select, .todoist-date-input {
  font-size: 14px;
}

.todoist-select .v-field, .todoist-date-input .v-field {
  border-radius: 6px !important;
  background-color: #f8f9fa !important;
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