<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="headline">
          {{ task ? '할일 수정' : '새 할일' }}
        </span>
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
          <!-- 제목 -->
          <v-text-field
            v-model="formData.title"
            label="할일 제목 *"
            :rules="titleRules"
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
          
          <!-- 프로젝트 선택 -->
          <v-select
            v-model="formData.projectId"
            :items="projectItems"
            label="프로젝트 *"
            :rules="projectRules"
            required
            outlined
            class="mb-3"
          >
            <template v-slot:item="{ item }">
              <v-icon :color="item.raw.color" class="mr-3">mdi-circle</v-icon>
              {{ item.title }}
            </template>
            <template v-slot:selection="{ item }">
              <v-icon :color="item.raw.color" class="mr-2" small>mdi-circle</v-icon>
              {{ item.title }}
            </template>
          </v-select>
          
          <v-row>
            <!-- 시작 날짜 -->
            <v-col cols="6">
              <v-text-field
                v-model="formData.startDate"
                label="시작 날짜 *"
                type="datetime-local"
                :rules="startDateRules"
                required
                outlined
              ></v-text-field>
            </v-col>
            
            <!-- 마감 날짜 -->
            <v-col cols="6">
              <v-text-field
                v-model="formData.endDate"
                label="마감 날짜 *"
                type="datetime-local"
                :rules="endDateRules"
                required
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          
          <v-row>
            <!-- 우선순위 -->
            <v-col cols="6">
              <v-select
                v-model="formData.priority"
                :items="priorityItems"
                label="우선순위"
                outlined
              >
                <template v-slot:item="{ item }">
                  <v-icon :color="item.raw.color" class="mr-3" small>mdi-flag</v-icon>
                  {{ item.title }}
                </template>
                <template v-slot:selection="{ item }">
                  <v-icon :color="item.raw.color" class="mr-2" small>mdi-flag</v-icon>
                  {{ item.title }}
                </template>
              </v-select>
            </v-col>
            
            <!-- 예상 시간 -->
            <v-col cols="6">
              <v-text-field
                v-model.number="formData.estimatedHours"
                label="예상 시간 (시간)"
                type="number"
                min="0"
                max="100"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          
          <!-- 태그 -->
          <v-combobox
            v-model="formData.tags"
            label="태그"
            multiple
            chips
            small-chips
            deletable-chips
            outlined
            class="mb-3"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip
                small
                close
                @click:close="removeTag(index)"
              >
                #{{ item }}
              </v-chip>
            </template>
          </v-combobox>
          
          <!-- 중요 표시 -->
          <v-switch
            v-model="formData.isImportant"
            label="중요한 할일로 표시"
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
          {{ task ? '수정' : '저장' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  task: Object,
  projects: Array
})

const emit = defineEmits(['update:modelValue', 'save', 'close'])

// 반응형 데이터
const valid = ref(false)
const loading = ref(false)
const form = ref()

const formData = reactive({
  title: '',
  description: '',
  projectId: null,
  startDate: '',
  endDate: '',
  priority: 'NORMAL',
  estimatedHours: null,
  tags: [],
  isImportant: false
})

// 컴퓨티드
const projectItems = computed(() => {
  return props.projects?.map(project => ({
    title: project.projectName,
    value: project.projectId,
    color: project.color || 'primary'
  })) || []
})

const priorityItems = ref([
  { title: '낮음', value: 'LOW', color: 'success' },
  { title: '보통', value: 'NORMAL', color: 'primary' },
  { title: '높음', value: 'HIGH', color: 'warning' },
  { title: '긴급', value: 'URGENT', color: 'error' }
])

// 유효성 검사 규칙
const titleRules = [
  v => !!v || '제목은 필수입니다.',
  v => (v && v.length <= 200) || '제목은 200자 이하여야 합니다.'
]

const projectRules = [
  v => !!v || '프로젝트를 선택해주세요.'
]

const startDateRules = [
  v => !!v || '시작 날짜는 필수입니다.'
]

const endDateRules = [
  v => !!v || '마감 날짜는 필수입니다.',
  v => {
    if (!v || !formData.startDate) return true
    return new Date(v) >= new Date(formData.startDate) || '마감 날짜는 시작 날짜보다 늦어야 합니다.'
  }
]

// 메서드
const save = async () => {
  if (!form.value.validate()) return
  
  loading.value = true
  try {
    // 날짜 형식 변환
    const taskData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString()
    }
    
    await emit('save', taskData)
    resetForm()
  } catch (error) {
    console.error('할일 저장 실패:', error)
  } finally {
    loading.value = false
  }
}

const removeTag = (index) => {
  formData.tags.splice(index, 1)
}

const resetForm = () => {
  Object.assign(formData, {
    title: '',
    description: '',
    projectId: null,
    startDate: '',
    endDate: '',
    priority: 'NORMAL',
    estimatedHours: null,
    tags: [],
    isImportant: false
  })
  
  if (form.value) {
    form.value.resetValidation()
  }
}

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().slice(0, 16)
}

// 워처
watch(() => props.task, (newTask) => {
  if (newTask) {
    Object.assign(formData, {
      title: newTask.title || '',
      description: newTask.description || '',
      projectId: newTask.projectId || null,
      startDate: formatDateForInput(newTask.startDate),
      endDate: formatDateForInput(newTask.endDate),
      priority: newTask.priority || 'NORMAL',
      estimatedHours: newTask.estimatedHours || null,
      tags: [...(newTask.tags || [])],
      isImportant: newTask.isImportant || false
    })
  } else {
    resetForm()
    // 기본값 설정
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    formData.startDate = now.toISOString().slice(0, 16)
    formData.endDate = tomorrow.toISOString().slice(0, 16)
  }
}, { immediate: true })

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    resetForm()
  }
})
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}

.v-text-field, .v-textarea, .v-select, .v-combobox {
  margin-bottom: 8px;
}

.v-chip {
  margin: 2px;
}
</style>