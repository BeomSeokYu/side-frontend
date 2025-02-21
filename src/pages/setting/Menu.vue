<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container>
    <v-card>
      <data-table
        :headers="headers"
        :items="gridData"
        :display-id="true"
      ></data-table>
    </v-card>
  </v-container>
</template>

<script>
import DataTable from '@/components/DataTable.vue'
import { httpGet } from '@/axios'

export default {

  components: {
    DataTable,
  },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        title: 'id',
        align: 'end',
        sortable: false,
        key: 'id',
      },
      { title: '메뉴 이름', key: 'memuName' },
      { title: '상위 메뉴 이름', key: 'parentId', align: 'end' },
      { title: '메뉴 타입', key: 'menuType' },
      { title: '사용 유무', key: 'isUsed' },
      { title: '레이아웃 타입', key: 'layoutType' },
      { title: 'URL', key: 'url' },
    ],
    gridData: [],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
    defaultItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  created () {
    this.getMenuData()
  },

  methods: {
    async getMenuData() {
      const data = await httpGet('/api/menu/list')
      this.gridData = data;
    },

    editItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>