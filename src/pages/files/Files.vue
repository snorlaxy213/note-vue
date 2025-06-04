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
    // eslint-disable-next-line no-unused-vars
    addTab(ArticleInfo) {
      this.addTab(ArticleInfo)
    },
    removeTab(targetName) {
      if (this.editableTabs.length <= 1) {
        return
      }
      this.removeTab(targetName)
    }
  }
}
</script>
