<template>
  <v-card
    class="task-card"
    :class="{ 'completed': task.isCompleted, 'dragging': isDragging }"
    elevation="1"
    @mousedown="isDragging = false"
    @dragend="isDragging = false"
  >
    <v-card-text class="pa-3">
      <!-- 헤더 -->
      <div class="d-flex align-center mb-2">
        <v-checkbox
          :model-value="task.isCompleted"
          @change="$emit('complete', task.taskId)"
          color="primary"
          hide-details
          density="compact"
          class="mr-2"
        ></v-checkbox>
        
        <v-spacer></v-spacer>
        
        <!-- 중요 표시 -->
        <v-icon
          v-if="task.isImportant"
          color="amber"
          small
        >
          mdi-star
        </v-icon>
        
        <!-- 액션 메뉴 -->
        <v-menu offset-y>
          <template v-slot:activator="{ props: menuProps }">
            <v-btn
              icon="mdi-dots-vertical"
              size="small"
              variant="text"
              v-bind="menuProps"
            ></v-btn>
          </template>
          <v-list dense>
            <v-list-item @click="$emit('edit', task)">
              <template v-slot:prepend>
                <v-icon size="small">mdi-pencil</v-icon>
              </template>
              <v-list-item-title>수정</v-list-item-title>
            </v-list-item>
            <v-list-item @click="$emit('delete', task.taskId)">
              <template v-slot:prepend>
                <v-icon size="small" color="error">mdi-delete</v-icon>
              </template>
              <v-list-item-title class="text-error">삭제</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      
      <!-- 제목 -->
      <h4
        class="task-title"
        :class="{ 'text-decoration-line-through': task.isCompleted }"
      >
        {{ task.title }}
      </h4>
      
      <!-- 설명 -->
      <p
        v-if="task.description"
        class="task-description text-caption text-medium-emphasis mb-2"
      >
        {{ task.description }}
      </p>
      
      <!-- 메타 정보 -->
      <div class="task-meta">
        <!-- 마감일 -->
        <div class="d-flex align-center mb-1">
          <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
          <span
            class="text-caption"
            :class="getDueDateClass(task.endDate)"
          >
            {{ formatDate(task.endDate) }}
          </span>
        </div>
        
        <!-- 프로젝트 -->
        <div v-if="task.projectName" class="d-flex align-center mb-1">
          <v-icon size="small" class="mr-1">mdi-folder</v-icon>
          <span class="text-caption text-medium-emphasis">{{ task.projectName }}</span>
        </div>
        
        <!-- 우선순위 -->
        <div v-if="task.priority && task.priority !== 'NORMAL'" class="d-flex align-center mb-1">
          <v-icon
            size="small"
            :color="getPriorityColor(task.priority)"
            class="mr-1"
          >
            mdi-flag
          </v-icon>
          <span class="text-caption">{{ getPriorityText(task.priority) }}</span>
        </div>
        
        <!-- 태그 -->
        <div v-if="task.tags && task.tags.length > 0" class="mt-2">
          <v-chip
            v-for="tag in task.tags.slice(0, 3)"
            :key="tag"
            size="x-small"
            variant="outlined"
            class="mr-1 mb-1"
          >
            #{{ tag }}
          </v-chip>
          <v-chip
            v-if="task.tags.length > 3"
            size="x-small"
            variant="outlined"
            class="mr-1 mb-1"
          >
            +{{ task.tags.length - 3 }}
          </v-chip>
        </div>
        
        <!-- 담당자 -->
        <div
          v-if="task.assignees && task.assignees.length > 0"
          class="d-flex align-center mt-2"
        >
          <v-avatar
            v-for="assignee in task.assignees.slice(0, 3)"
            :key="assignee.userId"
            size="20"
            class="mr-1"
          >
            <v-img
              v-if="assignee.profileImage"
              :src="assignee.profileImage"
            ></v-img>
            <span v-else style="font-size: 10px;">
              {{ assignee.nickname.charAt(0).toUpperCase() }}
            </span>
          </v-avatar>
          <span v-if="task.assignees.length > 3" class="text-caption ml-1">
            +{{ task.assignees.length - 3 }}
          </span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  task: {
    type: Object,
    required: true
  }
})

defineEmits(['complete', 'edit', 'delete'])

const isDragging = ref(false)

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
    return 'text-error' // 지난 날짜
  } else if (daysDiff <= 1) {
    return 'text-warning' // 오늘/내일
  } else {
    return 'text-medium-emphasis' // 여유있는 날짜
  }
}

const getPriorityColor = (priority) => {
  const colors = {
    'HIGH': 'warning',
    'URGENT': 'error',
    'LOW': 'success'
  }
  return colors[priority] || 'medium-emphasis'
}

const getPriorityText = (priority) => {
  const texts = {
    'HIGH': '높음',
    'URGENT': '긴급',
    'LOW': '낮음'
  }
  return texts[priority] || priority
}
</script>

<style scoped>
.task-card {
  transition: all 0.2s ease;
  cursor: move;
  border-radius: 8px;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.task-card.dragging {
  transform: rotate(5deg);
  opacity: 0.8;
}

.task-card.completed {
  opacity: 0.6;
}

.task-title {
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.3;
  margin-bottom: 8px;
}

.task-description {
  font-size: 0.8rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-meta {
  font-size: 0.75rem;
}

.v-chip {
  font-size: 0.65rem !important;
  height: 20px !important;
}

.v-avatar {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>