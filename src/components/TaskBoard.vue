<template>
  <div class="task-board">
    <v-row>
      <v-col
        v-for="column in columns"
        :key="column.status"
        cols="12"
        md="4"
      >
        <v-card class="board-column" elevation="2">
          <v-card-title class="column-header">
            <v-icon :color="column.color" class="mr-2">{{ column.icon }}</v-icon>
            {{ column.title }}
            <v-spacer></v-spacer>
            <v-chip small :color="column.color" outlined>
              {{ getTasksByStatus(column.status).length }}
            </v-chip>
          </v-card-title>
          
          <v-card-text class="column-content">
            <div
              class="task-drop-zone"
              @drop="onDrop($event, column.status)"
              @dragover.prevent
              @dragenter.prevent
            >
              <TaskCard
                v-for="task in getTasksByStatus(column.status)"
                :key="task.taskId"
                :task="task"
                draggable="true"
                @dragstart="onDragStart($event, task)"
                @complete="$emit('complete', $event)"
                @edit="$emit('edit', $event)"
                @delete="$emit('delete', $event)"
                class="mb-3"
              />
              
              <!-- 빈 상태 -->
              <div
                v-if="getTasksByStatus(column.status).length === 0"
                class="empty-column"
              >
                <v-icon size="48" color="grey lighten-3">{{ column.icon }}</v-icon>
                <p class="grey--text caption mt-2">할일이 없습니다</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import TaskCard from '@/components/TaskCard.vue'

const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['complete', 'edit', 'delete', 'updateStatus'])

const columns = ref([
  {
    status: 'TODO',
    title: '할 일',
    color: 'blue',
    icon: 'mdi-clipboard-list-outline'
  },
  {
    status: 'IN_PROGRESS',
    title: '진행 중',
    color: 'orange',
    icon: 'mdi-clock-outline'
  },
  {
    status: 'DONE',
    title: '완료',
    color: 'green',
    icon: 'mdi-check-circle-outline'
  }
])

const draggedTask = ref(null)

// 메서드
const getTasksByStatus = (status) => {
  return props.tasks.filter(task => task.status === status)
}

const onDragStart = (event, task) => {
  draggedTask.value = task
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/html', event.target)
}

const onDrop = (event, targetStatus) => {
  if (draggedTask.value && draggedTask.value.status !== targetStatus) {
    emit('updateStatus', {
      taskId: draggedTask.value.taskId,
      status: targetStatus
    })
  }
  draggedTask.value = null
}
</script>

<style scoped>
.task-board {
  height: 100%;
}

.board-column {
  height: 600px;
  display: flex;
  flex-direction: column;
}

.column-header {
  background-color: #fafafa;
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 16px;
}

.column-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.task-drop-zone {
  min-height: 500px;
}

.empty-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  margin: 16px 0;
}

.v-card.board-column:hover {
  transform: none;
}
</style>