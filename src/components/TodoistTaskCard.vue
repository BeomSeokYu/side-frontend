<template>
  <v-card 
    class="todoist-task-card"
    :class="{ 'completed': task.isCompleted }"
    elevation="1"
  >
    <v-card-text class="pa-3">
      <!-- 헤더 -->
      <div class="todoist-card-header d-flex align-start">
        <!-- 체크박스 -->
        <div class="todoist-card-checkbox mr-3" @click="$emit('complete')">
          <v-icon
            v-if="task.isCompleted"
            color="#34a853"
            size="18"
          >
            mdi-checkbox-marked-circle
          </v-icon>
          <v-icon
            v-else
            color="#808080"
            size="18"
            class="todoist-unchecked"
          >
            mdi-checkbox-blank-circle-outline
          </v-icon>
        </div>

        <!-- 제목 -->
        <div class="flex-1">
          <div class="todoist-card-title" :class="{ 'completed-text': task.isCompleted }">
            {{ task.title }}
            <v-icon
              v-if="task.isImportant"
              color="#e44332"
              size="14"
              class="ml-1"
            >
              mdi-star
            </v-icon>
          </div>
        </div>

        <!-- 액션 메뉴 -->
        <v-menu>
          <template v-slot:activator="{ props: menuProps }">
            <v-btn
              icon="mdi-dots-horizontal"
              variant="text"
              size="x-small"
              v-bind="menuProps"
              class="todoist-card-menu"
            ></v-btn>
          </template>
          <v-list density="compact">
            <v-list-item @click="$emit('edit')">
              <template v-slot:prepend>
                <v-icon size="14">mdi-pencil</v-icon>
              </template>
              <v-list-item-title>편집</v-list-item-title>
            </v-list-item>
            <v-list-item @click="$emit('delete')">
              <template v-slot:prepend>
                <v-icon size="14" color="error">mdi-delete</v-icon>
              </template>
              <v-list-item-title>삭제</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <!-- 설명 -->
      <div 
        v-if="task.description" 
        class="todoist-card-description mt-2"
        :class="{ 'completed-text': task.isCompleted }"
      >
        {{ task.description }}
      </div>

      <!-- 메타 정보 -->
      <div class="todoist-card-meta mt-3">
        <!-- 프로젝트 -->
        <div 
          v-if="task.projectName" 
          class="todoist-meta-item d-flex align-center mb-1"
        >
          <v-icon size="12" color="#666" class="mr-1">mdi-folder</v-icon>
          <span class="todoist-meta-text">{{ task.projectName }}</span>
        </div>

        <!-- 날짜 -->
        <div 
          v-if="task.endDate" 
          class="todoist-meta-item d-flex align-center mb-1"
        >
          <v-icon size="12" color="#666" class="mr-1">mdi-calendar</v-icon>
          <span 
            class="todoist-meta-text"
            :class="getDateClass(task.endDate)"
          >
            {{ formatDate(task.endDate) }}
          </span>
        </div>

        <!-- 우선순위 -->
        <div 
          v-if="task.priority && task.priority !== 'MEDIUM'" 
          class="todoist-meta-item d-flex align-center"
        >
          <v-icon 
            size="12" 
            :color="getPriorityColor(task.priority)" 
            class="mr-1"
          >
            mdi-flag
          </v-icon>
          <span 
            class="todoist-meta-text"
            :style="{ color: getPriorityColor(task.priority) }"
          >
            {{ getPriorityText(task.priority) }}
          </span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  task: {
    type: Object,
    required: true
  }
})

defineEmits(['complete', 'edit', 'delete'])

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

const getDateClass = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const today = new Date()
  
  if (date < today) {
    return 'overdue'
  } else if (date.toDateString() === today.toDateString()) {
    return 'today'
  }
  return ''
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
.todoist-task-card {
  border-radius: 8px !important;
  border: 1px solid #e8e8e8 !important;
  transition: all 0.2s ease;
  cursor: pointer;
}

.todoist-task-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12) !important;
}

.todoist-task-card.completed {
  opacity: 0.6;
}

.todoist-card-header {
  align-items: flex-start;
}

.todoist-card-checkbox {
  cursor: pointer;
  padding: 2px;
}

.todoist-unchecked {
  transition: color 0.2s ease;
}

.todoist-card-checkbox:hover .todoist-unchecked {
  color: #e44332;
}

.todoist-card-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  word-break: break-word;
}

.todoist-card-title.completed-text {
  text-decoration: line-through;
  color: #999;
}

.todoist-card-description {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  word-break: break-word;
}

.todoist-card-description.completed-text {
  color: #999;
}

.todoist-card-meta {
  border-top: 1px solid #f0f0f0;
  padding-top: 8px;
}

.todoist-meta-item {
  min-height: 16px;
}

.todoist-meta-text {
  font-size: 11px;
  color: #666;
}

.todoist-meta-text.overdue {
  color: #d32f2f;
  font-weight: 500;
}

.todoist-meta-text.today {
  color: #f57c00;
  font-weight: 500;
}

.todoist-card-menu {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.todoist-task-card:hover .todoist-card-menu {
  opacity: 1;
}
</style>