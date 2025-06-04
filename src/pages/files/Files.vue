<template>
  <div>
    <el-row>
      <el-tabs
        v-model="editableTabsValue"
        closable
        type="card"
        @tab-remove="removeTab"
      >
        <el-tab-pane
          v-for="item in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          <tab-content
            v-if="item.title === 'files'"
            @NewTab="addTab"
          ></tab-content>

          <div
            v-if="item.title !== 'files'"
            style="padding-left: 6%; padding-right: 9%"
          >
            <makedown-show
              :mk-value="item.content"
              background="#F0FFF0"
            ></makedown-show>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TabContent from './components/TabContent'
import MakedownShow from '../../components/MakedownShow.vue'

export default {
  name: 'files',
  components: {
    TabContent,
    MakedownShow
  },
  computed: {
    ...mapGetters('ui', ['currentTab', 'allTabs']),
    editableTabsValue: {
      get() {
        return this.currentTab
      },
      set(value) {
        this.$store.commit('ui/SET_ACTIVE_TAB', value)
      }
    },
    editableTabs() {
      return this.allTabs
    }
  },
  methods: {
    ...mapActions('ui', ['addTab', 'removeTab']),
    // 移除addTab方法，直接使用mapActions映射的方法
    removeTab(targetName) {
      if (this.editableTabs.length <= 1) {
        return
      }
      this.$store.dispatch('ui/removeTab', targetName)
    }
  }
}
</script>
