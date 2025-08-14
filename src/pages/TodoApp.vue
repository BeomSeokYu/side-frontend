<template>
  <TodoLayout
    :search-query="searchQuery"
    :view-mode="viewMode"
    :selected-project="selectedProject"
    :current-view-title="currentViewTitle"
    @create-task="showTaskDialog = true"
    @create-project="showProjectDialog = true"
    @select-project="selectProject"
    @menu-navigate="resetProjectSelection"
    @toggle-favorite="toggleFavorite"
    @edit-project="editProject"
    @delete-project="deleteProject"
    @logout="logout"
    @update:search-query="searchQuery = $event"
    @update:view-mode="viewMode = $event"
  >
    <TodoistContent
      :tasks="filteredTasks"
      :view-mode="viewMode"
      @create-task="showTaskDialog = true"
      @complete-task="completeTask"
      @edit-task="editTask"
      @delete-task="deleteTask"
    />
    
    <!-- Todoist 스타일 할일 다이얼로그 -->
    <TodoistTaskDialog
      v-model="showTaskDialog"
      :task="editingTask"
      :projects="projects"
      @save="saveTask"
      @close="closeTaskDialog"
    />

    <!-- Todoist 스타일 프로젝트 다이얼로그 -->
    <TodoistProjectDialog
      v-model="showProjectDialog"
      @save="saveProject"
      @close="showProjectDialog = false"
    />
  </TodoLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import TodoLayout from '@/layouts/TodoLayout.vue'
import TodoistContent from '@/components/TodoistContent.vue'
import TodoistTaskDialog from '@/components/TodoistTaskDialog.vue'
import TodoistProjectDialog from '@/components/TodoistProjectDialog.vue'

const store = useStore()
const route = useRoute()
const router = useRouter()

// 반응형 데이터
const searchQuery = ref('')
const showTaskDialog = ref(false)
const showProjectDialog = ref(false)
const editingTask = ref(null)
// const selectedView = ref('inbox') // 라우트 기반으로 변경되어 사용하지 않음
const selectedProject = ref(null)
const viewMode = ref('list')

// 컴퓨티드
const tasks = computed(() => store.getters['task/getAllTasks'])
const projects = computed(() => store.getters['project/getAllProjects'])

// DB에서 가져온 메뉴 기반으로 제목 결정
const menuList = computed(() => store.getters['common/menuList'])

const currentViewTitle = computed(() => {
  if (selectedProject.value) {
    const project = projects.value.find(p => p.projectId === selectedProject.value)
    return project?.projectName || '프로젝트'
  }
  
  // DB 메뉴에서 현재 라우트에 맞는 제목 찾기
  const findMenuTitle = (menus) => {
    for (const menu of menus) {
      if (menu.url === route.path) {
        return menu.memuName
      }
      if (menu.children) {
        const childTitle = findMenuTitle(menu.children)
        if (childTitle) return childTitle
      }
    }
    return null
  }
  
  const menuTitle = findMenuTitle(menuList.value)
  return menuTitle || '할일'
})


const filteredTasks = computed(() => {
  let filtered = tasks.value

  // 라우트와 프로젝트 기반 필터링
  if (selectedProject.value) {
    filtered = filtered.filter(task => task.projectId === selectedProject.value)
  } else {
    // 라우트 기반 필터링
    switch (route.path) {
      case '/todo/today': {
        const today = new Date().toDateString()
        filtered = filtered.filter(task => 
          new Date(task.endDate).toDateString() === today && !task.isCompleted
        )
        break
      }
      case '/todo/week': {
        const weekLater = new Date()
        weekLater.setDate(weekLater.getDate() + 7)
        filtered = filtered.filter(task => 
          new Date(task.endDate) <= weekLater && !task.isCompleted
        )
        break
      }
      case '/todo/important':
        filtered = filtered.filter(task => task.isImportant && !task.isCompleted)
        break
      case '/todo/inbox':
      case '/todo':
      default:
        filtered = filtered.filter(task => !task.isCompleted)
        break
    }
  }

  // 검색 필터링
  if (searchQuery.value) {
    filtered = filtered.filter(task =>
      task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  return filtered
})

// 메서드
const selectProject = (projectId) => {
  selectedProject.value = projectId
}

const resetProjectSelection = () => {
  selectedProject.value = null
}

const completeTask = async (taskId) => {
  try {
    // 현재 할일의 완료 상태 확인
    const task = tasks.value.find(t => t.taskId === taskId)
    if (task) {
      if (task.isCompleted) {
        await store.dispatch('task/uncompleteTask', taskId)
      } else {
        await store.dispatch('task/completeTask', taskId)
      }
    }
  } catch (error) {
    console.error('할일 완료 처리 실패:', error)
  }
}

const editTask = (task) => {
  editingTask.value = { ...task }
  showTaskDialog.value = true
}

const deleteTask = async (taskId) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    try {
      await store.dispatch('task/deleteTask', taskId)
    } catch (error) {
      console.error('할일 삭제 실패:', error)
    }
  }
}

const saveTask = async (taskData) => {
  try {
    if (editingTask.value) {
      await store.dispatch('task/updateTask', { id: editingTask.value.taskId, data: taskData })
    } else {
      await store.dispatch('task/createTask', taskData)
    }
    closeTaskDialog()
  } catch (error) {
    console.error('할일 저장 실패:', error)
  }
}

const saveProject = async (projectData) => {
  try {
    await store.dispatch('project/createProject', projectData)
    showProjectDialog.value = false
  } catch (error) {
    console.error('프로젝트 저장 실패:', error)
  }
}

const closeTaskDialog = () => {
  showTaskDialog.value = false
  editingTask.value = null
}

// updateCounts는 TodoLayout에서 처리하므로 제거

const toggleFavorite = async (project) => {
  try {
    await store.dispatch('project/toggleFavorite', project.projectId)
  } catch (error) {
    console.error('즐겨찾기 업데이트 실패:', error)
  }
}

const editProject = (project) => {
  // 프로젝트 수정 로직
  console.log('프로젝트 수정:', project)
}

const deleteProject = async (projectId) => {
  if (confirm('정말 삭제하시겠습니까? 이 프로젝트의 모든 할일도 함께 삭제됩니다.')) {
    try {
      await store.dispatch('project/deleteProject', projectId)
      // 삭제된 프로젝트가 현재 선택된 프로젝트라면 선택 해제
      if (selectedProject.value === projectId) {
        selectedProject.value = null
      }
    } catch (error) {
      console.error('프로젝트 삭제 실패:', error)
    }
  }
}

const logout = () => {
  // 로그아웃 로직
  if (confirm('로그아웃 하시겠습니까?')) {
    localStorage.removeItem('user')
    router.push('/login')
  }
}

// 생명주기
onMounted(async () => {
  try {
    await store.dispatch('task/fetchTasks')
    await store.dispatch('project/fetchProjects')
  } catch (error) {
    console.error('데이터 로딩 실패:', error)
  }
})
</script>

<style scoped>
.sidebar {
  border-right: 1px solid rgb(var(--v-theme-surface-variant));
  background-color: rgb(var(--v-theme-surface));
}

.sidebar-header {
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
}

.sidebar-item {
  border-radius: 8px;
  margin: 2px 8px;
}

.sidebar-item:hover {
  background-color: rgb(var(--v-theme-surface-variant));
}

.main-content {
  background-color: rgb(var(--v-theme-background));
}

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

.v-navigation-drawer {
  box-shadow: none !important;
}

.v-app-bar {
  box-shadow: none !important;
}
</style>