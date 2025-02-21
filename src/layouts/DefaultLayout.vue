<template>
  <v-app>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Template</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer app permanent v-model="drawer">
      <v-list v-model:opened="open" v-for="(menu, index1) in menuList" :key="index1">
        <v-list-group v-if="menu.children" :value="menu.memuName">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="menu.iconClass"
              :title="menu.memuName"
            ></v-list-item>
          </template>

          <template v-for="(subMenu, index2) in menu.children" :key="index2">
            <v-list-group
              v-if="subMenu.children"
              :value="subMenu.memuName"
              :class="'depth-2'"
            >
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  :prepend-icon="subMenu.iconClass"
                  :title="subMenu.memuName"
                ></v-list-item>
              </template>

              <template v-for="(branchMenu, index3) in subMenu.children" :key="index3">
                <v-list-item
                  :prepend-icon="branchMenu.iconClass"
                  :title="branchMenu.memuName"
                  :value="branchMenu.memuName"
                  :class="'last-indent-depth'"
                  @click="$router.push(branchMenu.url)"
                >
                </v-list-item>
              </template>
            </v-list-group>

            <v-list-item v-else
              :prepend-icon="subMenu.iconClass"
              :title="subMenu.memuName"
              :value="subMenu.memuName"
              :class="'last-indent-depth'"
              @click="$router.push(subMenu.url)"
            ></v-list-item>
          </template>

        </v-list-group>

        <v-list-item v-else
          :prepend-icon="menu.iconClass"
          :title="menu.memuName"
          :value="menu.memuName"
          @click="$router.push(menu.url)"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'DefaultLayout',

  // lifecycle
  mounted() {
  },

  data: () => ({
    drawer: true,
    open: [],
  }),

  computed: {
    ...mapGetters('common', ['menuList']),
  },

  methods: {
  },

  watch: {
    // open(newVal) {
    //   console.log('open', newVal);
    // },
  },

}
</script>

<style scoped>
.v-list-group__items .v-list-item {
    padding-inline-start: 16px !important;    /* 기존 메뉴 indentation 되는 것 무시 */
}

.v-list {
    padding: 0px !important;                  /* 기존 메뉴 1-depth의 padding 무시 */
}

.depth-2 {
    padding-inline-start: 16px;
}

.last-indent-depth {
    margin-left: 16px;
}
</style>

















    <!-- sampleMenuList: [
      {
        memuName: 'Home',
        iconClass: 'mdi-home-circle',
      },
      {
        memuName: 'Users',
        iconClass: 'mdi-account',
        children: [
          {
            memuName: 'Admins',
            iconClass: 'mdi-shield-crown',
            children: [
              {
                memuName: 'Management',
                iconClass:'mdi-account-multiple-outline'
              },
              {
                memuName: 'Settings',
                iconClass:'mdi-cog-outline'
              },
            ],
          },
          {
            memuName: 'Actions',
            iconClass: 'mdi-gesture-tap',
            children: [
              {
                memuName: 'Create',
                iconClass:'mdi-plus-outline'
              },
              {
                memuName: 'Read',
                iconClass:'mdi-file-outline'
              },
              {
                memuName: 'Update',
                iconClass:'mdi-update'
              },
              {
                memuName: 'Delete',
                iconClass:'mdi-delete'
              },
            ],
          },
        ],
      }
    ], -->