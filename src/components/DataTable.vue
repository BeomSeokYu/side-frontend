<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :item-key="itemValue"
    :items-per-page="itemsPerPage"
    :density="density"
    :show-expand="showExpand"
    @click:row="handleRowClick"
  >
  <!-- :sort-by="[{ key: 'calories', order: 'asc' }]" 기본 sort 설정 시 사용 -->
  <!-- hide-default-header 헤더 숨기기 -->
  <!-- hide-default-footer 푸터 숨기기 -->
  <!-- show-select 셀렉트 박스 표시 -->


  <!-- 팝업 형태로 표시 -->
  <template v-slot:top>

      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="text-h5">정말로 삭제하시겠습니까?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="closeDelete">취소</v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">삭제</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <!-- 테이블 뒤 컬럼에 수정 삭제 버튼 표시 -->
    <!-- eslint-disable-next-line vue/valid-v-slot -->
    <template v-slot:item.actions="{ item }">
      <v-icon
        class="me-2"
        size="small"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        size="small"
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <div>조회된 항목이 없습니다.</div>
    </template>

    <!-- 테이블 내에 체크박스 표시 -->
    <!-- eslint-disable-next-line vue/valid-v-slot -->
    <template v-slot:item.exclusive="{ item }">
      <v-checkbox
        v-model="item.selected"
        readonly
      ></v-checkbox>
    </template>

    <!-- 테이블 앞에 ID 컬럼 헤더 명칭 UpperCase 표시 -->
    <!-- eslint-disable-next-line vue/valid-v-slot -->
    <template v-if="displayId" v-slot:header.id="{ column }">
      {{ column.title.toUpperCase() }}
    </template>

    <!-- 헤더 슬롯 사용 예시 -->
    <template v-if="displayHeaderSlot" v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
      <tr>
        <template v-for="column in columns" :key="column.key">
          <td>
            <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{ column.title }}</span>
            <template v-if="isSorted(column)">
              <v-icon :icon="getSortIcon(column)"></v-icon>
            </template>
            <v-icon v-if="column.removable" icon="$close" @click="() => remove(column.key)"></v-icon>
          </td>
        </template>
      </tr>
    </template>

    <!-- 아이템 슬롯 사용 예시 -->
    <template v-if="displayItemSlot" v-slot:item="{ item }">
      <tr>
        <td>{{ item.name }}</td>
        <td>{{ item.calories }}</td>
        <td>{{ item.fat }}</td>
        <td>{{ item.carbs }}</td>
        <td>{{ item.protein }}</td>
        <td>{{ item.iron }}</td>
      </tr>
    </template>

    <!-- 아이템 키 슬롯 사용 예시 -->
    <!-- eslint-disable-next-line vue/valid-v-slot -->
    <template v-if="displayItemKeySlot" v-slot:item.calories="{ value }">
      <v-chip :color="getColor(value)">
        {{ value }}
      </v-chip>
    </template>

    <!-- 그룹 헤더 슬롯 사용 예시 -->
    <template v-if="displayGroupHeaderSlot" v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
      <tr>
        <td :colspan="columns.length">
          <VBtn
            :icon="isGroupOpen(item) ? '$expand' : '$next'"
            size="small"
            variant="text"
            @click="toggleGroup(item)"
          ></VBtn>
          {{ item.value ? 'Contains gluten' : 'Gluten free' }}
        </td>
      </tr>
    </template>

    <!-- 확장 가능한 row 표시 -->
    <!-- eslint-disable-next-line vue/valid-v-slot -->
    <template v-if="showExpand" v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Expandable Table</v-toolbar-title>
      </v-toolbar>
    </template>
    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">
          More info about {{ item.name }}
        </td>
      </tr>
    </template>

    <!-- 로딩 표시 -->
    <template v-if="displayLoading" v-slot:loading>
      <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
    </template>

  </v-data-table>
</template>

<script>
export default {
  props: {
    headers: {
      type: Array,
      require: false,
      default: () => {
        return [];
      },
    },
    items: {
      type: Array,
      require: false,
      default: () => {
        return [];
      },
    },
    itemValue: {
      type: String,
      require: false,
      default: () => {
        return "name";            // 표시할 데이터 속성명
      },
    },
    itemsPerPage: {
      type: Number,
      require: false,
      default: () => {
        return 10;
      },
    },
    density: {                    // 테이블 표시 사이즈
      type: String,
      require: false,
      default: () => {
        return 'comfortable';     // 'default' | 'comfortable' | 'compact'
      },
    },

    // 표시 여부
    displayId: {
      type: Boolean,
      require: false,
      default: () => {
        return false;
      },
    },
    displayHeaderSlot: {
      type: Boolean,
      require: false,
      default: () => {
        return false;
      },
    },
    displayItemSlot: {
      type: Boolean,
      require: false,
      default: () => {
        return false;
      },
    },
    displayItemKeySlot: {
      type: Boolean,
      require: false,
      default: () => {
        return false;
      },
    },
    displayGroupHeaderSlot: {
      type: Boolean,
      require: false,
      default: () => {
        return false;
      },
    },
    displayLoading: {
      type: Boolean,
      require: false,
      default: () => {
        return false;
      },
    },
    showExpand: {
      type: Boolean,
      require: false,
      default: () => {
        return false;
      },
    },
  },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {},
    defaultItem: {},
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
  },

  methods: {
    // Emit Event
    handleRowClick(e, data) {
      this.$emit('rowClick', data);
    },

    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.$emit('editItem', this.editedIndex, this.editedItem);
    },

    deleteItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.$emit('deleteItem', this.editedIndex, this.editedItem);
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