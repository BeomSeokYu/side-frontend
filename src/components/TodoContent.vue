<template>
  <div class="content-wrapper pa-6">
    <!-- 빠른 추가 -->
    <div
      class="quick-add-bar mb-6"
      @click="$emit('create-task')"
    >
      <v-icon color="primary" class="mr-3">mdi-plus</v-icon>
      <span class="text-medium-emphasis">할일 추가...</span>
    </div>

    <!-- 할일 목록 -->
    <div class="tasks-container">
      <!-- 리스트 뷰 -->
      <div v-if="viewMode === 'list'" class="task-list">
        <div v-if="tasks.length === 0" class="empty-state text-center py-12">
          <v-icon size="80" color="grey-lighten-2">mdi-check-circle-outline</v-icon>
          <h3 class="text-h6 text-medium-emphasis mt-4 mb-2">모든 할일 완료!</h3>
          <p class="text-body-2 text-medium-emphasis">새로운 할일을 추가해보세요.</p>
        </div>
        
        <TaskItem
          v-for="task in tasks"
          :key="task.taskId"
          :task="task"
          @complete="$emit('complete-task', $event)"
          @edit="$emit('edit-task', $event)"
          @delete="$emit('delete-task', $event)"
          class="mb-2"
        />
      </div>
      
      <!-- 보드 뷰 -->
      <div v-else class="task-board">
        <TaskBoard
          :tasks="tasks"
          @complete="$emit('complete-task', $event)"
          @edit="$emit('edit-task', $event)"
          @delete="$emit('delete-task', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import TaskItem from '@/components/TaskItem.vue'
import TaskBoard from '@/components/TaskBoard.vue'

// Props
defineProps({
  tasks: {
    type: Array,
    default: () => []
  },
  viewMode: {
    type: String,
    default: 'list'
  }
})

// Emits
defineEmits([
  'create-task',
  'complete-task',
  'edit-task',
  'delete-task'
])
</script>

<style scoped>
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.quick-add-bar {
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-surface-variant));
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.quick-add-bar:hover {
  background-color: rgb(var(--v-theme-surface-variant));
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-list {
  background-color: rgb(var(--v-theme-surface));
  border-radius: 8px;
  min-height: 400px;
}

.empty-state {
  padding: 60px 20px;
}
</style>