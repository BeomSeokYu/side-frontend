<template>
  <div
    class="task-item"
    :class="{ 'completed': task.isCompleted }"
    @click="$emit('edit', task)"
  >
    <!-- 왼쪽: 체크박스와 내용 -->
    <div class="task-content">
      <v-checkbox
        :model-value="task.isCompleted"
        @change="$emit('complete', task.taskId)"
        @click.stop
        color="primary"
        hide-details
        density="compact"
        class="task-checkbox"
      ></v-checkbox>
      
      <div class="task-details">
        <div class="task-title-row">
          <span
            :class="{ 'completed-text': task.isCompleted }"
            class="task-title"
          >
            {{ task.title }}
          </span>
          
          <!-- 중요 표시 -->
          <v-icon
            v-if="task.isImportant"
            color="warning"
            size="16"
            class="ml-2"
          >
            mdi-star
          </v-icon>
        </div>
        
        <!-- 설명 -->
        <div
          v-if="task.description"
          class="task-description"
        >
          {{ task.description }}
        </div>
        
        <!-- 메타 정보 -->
        <div class="task-meta">
          <!-- 마감일 -->
          <span
            class="meta-item"
            :class="getDueDateClass(task.endDate)"
          >
            <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
            {{ formatDate(task.endDate) }}
          </span>
          
          <!-- 프로젝트 -->
          <span
            v-if="task.projectName"
            class="meta-item project-tag"
          >
            <v-icon size="14" class="mr-1">mdi-folder</v-icon>
            {{ task.projectName }}
          </span>
          
          <!-- 우선순위 -->
          <span
            v-if="task.priority && task.priority !== 'NORMAL'"
            class="meta-item priority-tag"
            :class="getPriorityClass(task.priority)"
          >
            <v-icon size="14" class="mr-1">mdi-flag</v-icon>
            {{ getPriorityText(task.priority) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 오른쪽: 액션 버튼 -->
    <div class="task-actions">
      <v-menu>
        <template v-slot:activator="{ props: menuProps }">
          <v-btn
            icon="mdi-dots-horizontal"
            size="small"
            variant="text"
            v-bind="menuProps"
            @click.stop
            class="action-btn"
          ></v-btn>
        </template>
        <v-list density="compact">
          <v-list-item @click="$emit('edit', task)">
            <template v-slot:prepend>
              <v-icon size="small">mdi-pencil</v-icon>
            </template>
            <v-list-item-title>수정</v-list-item-title>
          </v-list-item>
          
          <v-list-item @click="toggleImportant">
            <template v-slot:prepend>
              <v-icon size="small">{{ task.isImportant ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
            </template>
            <v-list-item-title>
              {{ task.isImportant ? '중요 해제' : '중요 표시' }}
            </v-list-item-title>
          </v-list-item>
          
          <v-divider></v-divider>
          
          <v-list-item @click="$emit('delete', task.taskId)">
            <template v-slot:prepend>
              <v-icon size="small" color="error">mdi-delete</v-icon>
            </template>
            <v-list-item-title class="text-error">삭제</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['complete', 'edit', 'delete', 'toggleImportant'])

// 메서드
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
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


const getDueDateClass = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  const daysDiff = Math.ceil((date - today) / (1000 * 60 * 60 * 24))
  
  if (daysDiff < 0) {
    return 'overdue' // 지난 날짜
  } else if (daysDiff <= 1) {
    return 'due-soon' // 오늘/내일
  } else {
    return 'normal' // 여유있는 날짜
  }
}

const getPriorityClass = (priority) => {
  const classes = {
    'HIGH': 'priority-high',
    'URGENT': 'priority-urgent',
    'LOW': 'priority-low'
  }
  return classes[priority] || ''
}

const getPriorityText = (priority) => {
  const texts = {
    'HIGH': '높음',
    'URGENT': '긴급',
    'LOW': '낮음'
  }
  return texts[priority] || priority
}

const toggleImportant = () => {
  emit('toggleImportant', props.task.taskId)
}
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  background-color: rgb(var(--v-theme-surface));
  border-radius: 8px;
  border: 1px solid rgb(var(--v-theme-surface-variant));
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.task-item:hover {
  background-color: rgb(var(--v-theme-surface-variant));
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-item.completed {
  opacity: 0.6;
}

.task-content {
  display: flex;
  align-items: flex-start;
  flex: 1;
  gap: 12px;
}

.task-checkbox {
  margin-top: 2px;
}

.task-details {
  flex: 1;
  min-width: 0;
}

.task-title-row {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.task-title {
  font-size: 14px;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
  transition: all 0.2s ease;
}

.completed-text {
  text-decoration: line-through;
  color: rgb(var(--v-theme-on-surface-variant)) !important;
}

.task-description {
  font-size: 13px;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-bottom: 8px;
  line-height: 1.4;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: rgb(var(--v-theme-on-surface-variant));
  padding: 2px 6px;
  border-radius: 4px;
}

.meta-item.overdue {
  color: rgb(var(--v-theme-error));
  background-color: rgba(var(--v-theme-error), 0.1);
}

.meta-item.due-soon {
  color: rgb(var(--v-theme-warning));
  background-color: rgba(var(--v-theme-warning), 0.1);
}

.meta-item.normal {
  color: rgb(var(--v-theme-on-surface-variant));
}

.meta-item.project-tag {
  background-color: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
}

.meta-item.priority-high {
  background-color: rgba(var(--v-theme-warning), 0.1);
  color: rgb(var(--v-theme-warning));
}

.meta-item.priority-urgent {
  background-color: rgba(var(--v-theme-error), 0.1);
  color: rgb(var(--v-theme-error));
}

.meta-item.priority-low {
  background-color: rgba(var(--v-theme-success), 0.1);
  color: rgb(var(--v-theme-success));
}

.task-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
  margin-left: 8px;
}

.task-item:hover .task-actions {
  opacity: 1;
}

.action-btn {
  min-width: 32px !important;
  width: 32px !important;
  height: 32px !important;
}
</style>