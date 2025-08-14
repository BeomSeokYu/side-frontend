<template>
  <v-app class="todoist-app">
    <!-- Todoist 스타일 사이드바 -->
    <v-navigation-drawer
      v-model="drawer"
      app
      permanent
      :width="300"
      class="todoist-sidebar"
      color="#fafafa"
    >
      <!-- 로고 헤더 -->
      <div class="todoist-header pa-4 d-flex align-center">
        <v-icon size="28" color="#e44332" class="mr-3">mdi-checkbox-marked-circle</v-icon>
        <span class="text-h6 font-weight-bold todoist-logo">Todo</span>
      </div>

      <!-- 빠른 할일 추가 -->
      <div class="px-4 mb-4">
        <v-btn
          color="#e44332"
          variant="flat"
          block
          size="large"
          class="todoist-add-btn text-none"
          @click="$emit('create-task')"
          prepend-icon="mdi-plus"
        >
          할일 추가
        </v-btn>
      </div>
      
      <!-- Todoist 스타일 메뉴 -->
      <v-list class="todoist-nav pa-0" nav>
        <!-- 메인 뷰들 -->
        <template v-for="(menu, index1) in todoMenuList" :key="index1">
          <template v-for="(subMenu, index2) in menu.children" :key="index2">
            <v-list-item
              :prepend-icon="subMenu.iconClass"
              :title="subMenu.memuName"
              :value="subMenu.memuName"
              class="todoist-nav-item"
              @click="handleMenuClick(subMenu)"
              :active="isMenuActive(subMenu)"
              color="#e44332"
            >
              <template v-slot:append v-if="getMenuCount(subMenu) > 0">
                <v-chip
                  size="x-small"
                  color="#e44332"
                  variant="flat"
                  class="todoist-count"
                >
                  {{ getMenuCount(subMenu) }}
                </v-chip>
              </template>
            </v-list-item>
          </template>
        </template>
        
        <v-divider class="my-2 mx-4"></v-divider>
        
        <!-- 즐겨찾기 프로젝트 -->
        <div v-if="favoriteProjects.length > 0" class="px-4 py-2">
          <div class="text-caption font-weight-medium text-grey-darken-1 mb-1">즐겨찾기</div>
          <v-list-item
            v-for="project in favoriteProjects"
            :key="`fav-${project.projectId}`"
            @click="$emit('select-project', project.projectId)"
            :active="selectedProject === project.projectId"
            class="todoist-nav-item px-2"
            density="compact"
          >
            <template v-slot:prepend>
              <v-icon :color="project.color || '#808080'" size="16">mdi-circle</v-icon>
            </template>
            <v-list-item-title class="text-body-2">{{ project.projectName }}</v-list-item-title>
            <template v-slot:append>
              <v-menu>
                <template v-slot:activator="{ props: menuProps }">
                  <v-btn
                    icon="mdi-dots-horizontal"
                    size="x-small"
                    variant="text"
                    v-bind="menuProps"
                    @click.stop
                    class="todoist-menu-btn"
                  ></v-btn>
                </template>
                <v-list density="compact">
                  <v-list-item @click="$emit('toggle-favorite', project)">
                    <v-list-item-title class="text-body-2">즐겨찾기 해제</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="$emit('edit-project', project)">
                    <v-list-item-title class="text-body-2">수정</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="$emit('delete-project', project.projectId)">
                    <v-list-item-title class="text-body-2 text-error">삭제</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-list-item>
          <v-divider class="my-2"></v-divider>
        </div>
        
        <!-- 프로젝트 목록 -->
        <div class="px-4 py-2">
          <div class="d-flex align-center mb-1">
            <span class="text-caption font-weight-medium text-grey-darken-1">프로젝트</span>
            <v-spacer></v-spacer>
            <v-btn
              icon="mdi-plus"
              size="x-small"
              variant="text"
              color="grey-darken-1"
              @click="$emit('create-project')"
            ></v-btn>
          </div>
          
          <v-list-item
            v-for="project in regularProjects"
            :key="project.projectId"
            @click="$emit('select-project', project.projectId)"
            :active="selectedProject === project.projectId"
            class="todoist-nav-item px-2"
            density="compact"
          >
            <template v-slot:prepend>
              <v-icon :color="project.color || '#808080'" size="16">mdi-circle</v-icon>
            </template>
            <v-list-item-title class="text-body-2">{{ project.projectName }}</v-list-item-title>
            <template v-slot:append>
              <v-menu>
                <template v-slot:activator="{ props: menuProps }">
                  <v-btn
                    icon="mdi-dots-horizontal"
                    size="x-small"
                    variant="text"
                    v-bind="menuProps"
                    @click.stop
                    class="todoist-menu-btn"
                  ></v-btn>
                </template>
                <v-list density="compact">
                  <v-list-item @click="$emit('toggle-favorite', project)">
                    <v-list-item-title class="text-body-2">
                      {{ project.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가' }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="$emit('edit-project', project)">
                    <v-list-item-title class="text-body-2">수정</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="$emit('delete-project', project.projectId)">
                    <v-list-item-title class="text-body-2 text-error">삭제</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-list-item>
        </div>
      </v-list>
      
      <!-- 하단 사용자 정보 -->
      <template v-slot:append>
        <div class="px-4 pb-4">
          <v-list-item
            @click="$emit('logout')"
            class="todoist-user-item"
            density="compact"
          >
            <template v-slot:prepend>
              <v-avatar size="32" color="#e44332">
                <v-icon color="white" size="18">mdi-account</v-icon>
              </v-avatar>
            </template>
            <v-list-item-title class="text-body-2">{{ currentUser?.nickname || '사용자' }}</v-list-item-title>
            <template v-slot:append>
              <v-icon size="16" color="grey">mdi-logout</v-icon>
            </template>
          </v-list-item>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Todoist 스타일 헤더 -->
    <v-app-bar
      app
      color="white"
      elevation="0"
      height="60"
      class="todoist-header-bar"
      border="b"
    >
      <v-app-bar-nav-icon 
        @click="drawer = !drawer" 
        class="d-lg-none"
        color="grey-darken-2"
      ></v-app-bar-nav-icon>
      
      <v-toolbar-title class="text-h6 font-weight-medium text-grey-darken-2">
        {{ currentViewTitle }}
      </v-toolbar-title>
      
      <v-spacer></v-spacer>
      
      <!-- Todoist 스타일 검색바 -->
      <v-text-field
        :model-value="searchQuery"
        @update:model-value="$emit('update:search-query', $event)"
        prepend-inner-icon="mdi-magnify"
        placeholder="빠른 찾기"
        single-line
        hide-details
        variant="outlined"
        density="compact"
        class="todoist-search mx-4"
        style="max-width: 280px;"
        bg-color="#f8f9fa"
      ></v-text-field>
      
      <!-- 뷰 모드 토글 -->
      <v-btn-toggle
        :model-value="viewMode"
        @update:model-value="$emit('update:view-mode', $event)"
        mandatory
        density="compact"
        class="mr-4 todoist-view-toggle"
        color="#e44332"
      >
        <v-btn value="list" size="small" variant="text">
          <v-icon size="20">mdi-format-list-bulleted</v-icon>
        </v-btn>
        <v-btn value="board" size="small" variant="text">
          <v-icon size="20">mdi-view-column</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-app-bar>

    <!-- Todoist 스타일 메인 컨텐츠 -->
    <v-main class="todoist-main">
      <div class="todoist-content-wrapper pa-6">
        <slot></slot>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

const store = useStore()
const router = useRouter()
const route = useRoute()

// Props
defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  viewMode: {
    type: String,
    default: 'list'
  },
  selectedProject: {
    type: Number,
    default: null
  },
  currentViewTitle: {
    type: String,
    default: '할일'
  }
})

// Emits
const emit = defineEmits([
  'create-task',
  'create-project', 
  'select-project',
  'menu-navigate',
  'toggle-favorite',
  'edit-project',
  'delete-project',
  'logout',
  'update:search-query',
  'update:view-mode'
])

// 반응형 데이터
const drawer = ref(true)

// 컴퓨티드
const menuList = computed(() => store.getters['common/menuList'])
const projects = computed(() => store.getters['project/getAllProjects'])
const tasks = computed(() => store.getters['task/getAllTasks'])
const currentUser = computed(() => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
})

// Todo 관련 메뉴만 필터링
const todoMenuList = computed(() => {
  return menuList.value.filter(menu => 
    menu.memuName === 'Todo' || menu.menuCode === 'Todo'
  )
})

const favoriteProjects = computed(() => 
  projects.value.filter(project => project.isFavorite)
)

const regularProjects = computed(() => 
  projects.value.filter(project => !project.isFavorite)
)

// 메서드
const handleMenuClick = (menu) => {
  if (menu.url) {
    emit('menu-navigate')  // 기본 메뉴 클릭시 프로젝트 선택 해제
    router.push(menu.url)
  }
}

const isMenuActive = (menu) => {
  return route.path === menu.url
}

const getMenuCount = (menu) => {
  if (!menu.menuCode) return 0
  
  const today = new Date().toDateString()
  const weekLater = new Date()
  weekLater.setDate(weekLater.getDate() + 7)

  switch (menu.menuCode) {
    case 'Inbox':
      return tasks.value.filter(t => !t.isCompleted).length
    case 'Today':
      return tasks.value.filter(t => 
        new Date(t.endDate).toDateString() === today && !t.isCompleted
      ).length
    case 'Week':
      return tasks.value.filter(t => 
        new Date(t.endDate) <= weekLater && !t.isCompleted
      ).length
    case 'Important':
      return tasks.value.filter(t => t.isImportant && !t.isCompleted).length
    default:
      return 0
  }
}

// 생명주기
onMounted(async () => {
  try {
    await store.dispatch('common/fetchMenuList')
    await store.dispatch('project/fetchProjects')
    await store.dispatch('task/fetchTasks')
  } catch (error) {
    console.error('데이터 로딩 실패:', error)
  }
})
</script>

<style scoped>
/* Todoist 전체 스타일 */
.todoist-app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 사이드바 스타일 */
.todoist-sidebar {
  background-color: #fafafa !important;
  border-right: 1px solid #e0e0e0 !important;
}

.todoist-header {
  border-bottom: 1px solid #e8e8e8;
}

.todoist-logo {
  color: #202020;
  font-size: 18px;
}

.todoist-add-btn {
  border-radius: 8px !important;
  height: 36px !important;
  text-transform: none !important;
  font-weight: 500 !important;
  box-shadow: none !important;
}

.todoist-nav {
  padding: 0 !important;
}

.todoist-nav-item {
  margin: 1px 12px !important;
  border-radius: 6px !important;
  min-height: 32px !important;
  padding: 0 8px !important;
}

.todoist-nav-item:hover {
  background-color: #f0f0f0 !important;
}

.todoist-nav-item.v-list-item--active {
  background-color: #ffefe5 !important;
  color: #e44332 !important;
}

.todoist-count {
  font-size: 11px !important;
  font-weight: 500 !important;
  height: 18px !important;
  min-width: 20px !important;
}

.todoist-menu-btn {
  opacity: 0;
  transition: opacity 0.2s;
}

.todoist-nav-item:hover .todoist-menu-btn {
  opacity: 1;
}

.todoist-user-item {
  border-radius: 6px !important;
  margin: 0 !important;
  padding: 8px !important;
}

.todoist-user-item:hover {
  background-color: #f0f0f0 !important;
}

/* 헤더 바 스타일 */
.todoist-header-bar {
  border-bottom: 1px solid #e8e8e8 !important;
}

.todoist-search {
  max-width: 280px;
}

.todoist-search .v-field {
  border-radius: 6px !important;
  background-color: #f8f9fa !important;
}

.todoist-search .v-field__outline {
  --v-field-border-opacity: 0.12;
}

.todoist-view-toggle {
  background-color: #f8f9fa;
  border-radius: 6px;
}

.todoist-view-toggle .v-btn {
  border-radius: 4px !important;
}

/* 메인 컨텐츠 스타일 */
.todoist-main {
  background-color: #ffffff !important;
}

.todoist-content-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

/* 전체 제거 */
.v-navigation-drawer, .v-app-bar {
  box-shadow: none !important;
}
</style>