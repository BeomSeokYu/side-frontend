<template>
  <div class="todoist-content">
    <!-- 빠른 할일 추가 바 -->
    <div class="todoist-quick-add mb-6" @click="$emit('create-task')">
      <v-icon color="#e44332" size="20" class="mr-3">mdi-plus-circle-outline</v-icon>
      <span class="todoist-quick-add-text">할일 추가</span>
    </div>

    <!-- 할일 목록 -->
    <div v-if="tasks.length > 0" class="todoist-task-list">
      <!-- 리스트 뷰 -->
      <template v-if="viewMode === 'list'">
        <div
          v-for="task in tasks"
          :key="task.taskId"
          class="todoist-task-item"
          :class="{ 'completed': task.isCompleted }"
        >
          <div class="todoist-task-content">
            <!-- 완료 체크박스 -->
            <div class="todoist-task-checkbox" @click="$emit('complete-task', task.taskId)">
              <v-icon
                v-if="task.isCompleted"
                color="#34a853"
                size="20"
              >
                mdi-checkbox-marked-circle
              </v-icon>
              <v-icon
                v-else
                color="#808080"
                size="20"
                class="todoist-unchecked"
              >
                mdi-checkbox-blank-circle-outline
              </v-icon>
            </div>

            <!-- 할일 정보 -->
            <div class="todoist-task-info flex-1">
              <div class="todoist-task-title" :class="{ 'completed-text': task.isCompleted }">
                {{ task.title }}
                <v-icon
                  v-if="task.isImportant"
                  color="#e44332"
                  size="16"
                  class="ml-2"
                >
                  mdi-star
                </v-icon>
              </div>
              
              <div v-if="task.description" class="todoist-task-description">
                {{ task.description }}
              </div>

              <!-- 태그들 -->
              <div class="todoist-task-tags mt-2">
                <!-- 프로젝트 태그 -->
                <v-chip
                  v-if="task.projectName"
                  size="x-small"
                  color="#f5f5f5"
                  text-color="#666"
                  class="todoist-tag mr-2"
                >
                  <v-icon size="12" class="mr-1">mdi-folder</v-icon>
                  {{ task.projectName }}
                </v-chip>

                <!-- 날짜 태그 -->
                <v-chip
                  v-if="task.endDate"
                  size="x-small"
                  :color="getDateChipColor(task.endDate)"
                  :text-color="getDateTextColor(task.endDate)"
                  class="todoist-tag mr-2"
                >
                  <v-icon size="12" class="mr-1">mdi-calendar</v-icon>
                  {{ formatDate(task.endDate) }}
                </v-chip>

                <!-- 우선순위 태그 -->
                <v-chip
                  v-if="task.priority && task.priority !== 'MEDIUM'"
                  size="x-small"
                  :color="getPriorityColor(task.priority)"
                  text-color="white"
                  class="todoist-tag mr-2"
                >
                  <v-icon size="12" class="mr-1">mdi-flag</v-icon>
                  {{ getPriorityText(task.priority) }}
                </v-chip>
              </div>
            </div>

            <!-- 액션 버튼 -->
            <div class="todoist-task-actions">
              <v-menu>
                <template v-slot:activator="{ props: menuProps }">
                  <v-btn
                    icon="mdi-dots-horizontal"
                    variant="text"
                    size="small"
                    v-bind="menuProps"
                    class="todoist-action-btn"
                  ></v-btn>
                </template>
                <v-list density="compact">
                  <v-list-item @click="$emit('edit-task', task)">
                    <template v-slot:prepend>
                      <v-icon size="16">mdi-pencil</v-icon>
                    </template>
                    <v-list-item-title>편집</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="$emit('delete-task', task.taskId)">
                    <template v-slot:prepend>
                      <v-icon size="16" color="error">mdi-delete</v-icon>
                    </template>
                    <v-list-item-title>삭제</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </div>
      </template>

      <!-- 보드 뷰 -->
      <template v-if="viewMode === 'board'">
        <div class="todoist-board-view">
          <div class="todoist-board-columns">
            <!-- TODO 컬럼 -->
            <div class="todoist-board-column">
              <h3 class="todoist-column-title">할일</h3>
              <div class="todoist-column-tasks">
                <div
                  v-for="task in todoTasks"
                  :key="task.taskId"
                  class="todoist-board-task"
                >
                  <TodoistTaskCard
                    :task="task"
                    @complete="$emit('complete-task', task.taskId)"
                    @edit="$emit('edit-task', task)"
                    @delete="$emit('delete-task', task.taskId)"
                  />
                </div>
              </div>
            </div>

            <!-- 완료 컬럼 -->
            <div class="todoist-board-column">
              <h3 class="todoist-column-title">완료</h3>
              <div class="todoist-column-tasks">
                <div
                  v-for="task in completedTasks"
                  :key="task.taskId"
                  class="todoist-board-task"
                >
                  <TodoistTaskCard
                    :task="task"
                    @complete="$emit('complete-task', task.taskId)"
                    @edit="$emit('edit-task', task)"
                    @delete="$emit('delete-task', task.taskId)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 빈 상태 -->
    <div v-else class="todoist-empty-state">
      <v-icon size="64" color="#e0e0e0" class="mb-4">mdi-check-circle-outline</v-icon>
      <h3 class="text-h6 text-grey-darken-1 mb-2">모든 할일을 완료했어요!</h3>
      <p class="text-body-2 text-grey">새로운 할일을 추가해보세요.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TodoistTaskCard from './TodoistTaskCard.vue'

const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  },
  viewMode: {
    type: String,
    default: 'list'
  }
})

defineEmits(['create-task', 'complete-task', 'edit-task', 'delete-task'])

// 컴퓨티드
const todoTasks = computed(() => 
  props.tasks.filter(task => !task.isCompleted)
)

const completedTasks = computed(() => 
  props.tasks.filter(task => task.isCompleted)
)

// 메서드
const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
  
  if (date.toDateString() === today.toDateString()) {
    return '오늘'
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return '내일'
  } else {
    return date.toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric' 
    })
  }
}

const getDateChipColor = (dateString) => {
  if (!dateString) return '#f5f5f5'
  
  const date = new Date(dateString)
  const today = new Date()
  
  if (date < today) {
    return '#ffebee' // 지난 날짜 - 연한 빨강
  } else if (date.toDateString() === today.toDateString()) {
    return '#fff3e0' // 오늘 - 연한 주황
  }
  return '#f5f5f5' // 기본 - 회색
}

const getDateTextColor = (dateString) => {
  if (!dateString) return '#666'
  
  const date = new Date(dateString)
  const today = new Date()
  
  if (date < today) {
    return '#d32f2f' // 지난 날짜 - 빨강
  } else if (date.toDateString() === today.toDateString()) {
    return '#f57c00' // 오늘 - 주황
  }
  return '#666' // 기본 - 회색
}

const getPriorityColor = (priority) => {
  const colors = {
    'LOW': '#4caf50',
    'MEDIUM': '#ff9800',
    'HIGH': '#f44336',
    'URGENT': '#e91e63'
  }
  return colors[priority] || '#808080'
}

const getPriorityText = (priority) => {
  const texts = {
    'LOW': '낮음',
    'MEDIUM': '보통',
    'HIGH': '높음',
    'URGENT': '긴급'
  }
  return texts[priority] || '보통'
}
</script>

<style scoped>
.todoist-content {
  max-width: 800px;
}

/* 빠른 추가 바 */
.todoist-quick-add {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #fafafa;
}

.todoist-quick-add:hover {
  border-color: #e44332;
  background-color: #fff8f7;
}

.todoist-quick-add-text {
  color: #666;
  font-size: 14px;
}

/* 할일 항목 */
.todoist-task-item {
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.todoist-task-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.todoist-task-item.completed {
  opacity: 0.6;
}

.todoist-task-content {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  gap: 12px;
}

.todoist-task-checkbox {
  cursor: pointer;
  padding: 2px;
}

.todoist-unchecked {
  transition: color 0.2s ease;
}

.todoist-task-checkbox:hover .todoist-unchecked {
  color: #e44332;
}

.todoist-task-info {
  flex: 1;
  min-width: 0;
}

.todoist-task-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  display: flex;
  align-items: center;
}

.todoist-task-title.completed-text {
  text-decoration: line-through;
  color: #999;
}

.todoist-task-description {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
  line-height: 1.4;
}

.todoist-task-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.todoist-tag {
  font-size: 11px !important;
  height: 20px !important;
}

.todoist-task-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.todoist-task-item:hover .todoist-task-actions {
  opacity: 1;
}

.todoist-action-btn {
  color: #666 !important;
}

/* 보드 뷰 */
.todoist-board-view {
  width: 100%;
}

.todoist-board-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.todoist-board-column {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.todoist-column-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.todoist-column-tasks {
  min-height: 200px;
}

.todoist-board-task {
  margin-bottom: 12px;
}

/* 빈 상태 */
.todoist-empty-state {
  text-align: center;
  padding: 80px 20px;
}
</style>