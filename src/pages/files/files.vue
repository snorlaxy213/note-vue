<template>
  <div>
    <el-row>
      <el-tabs v-model="editableTabsValue" closable type="card" @tab-remove="removeTab">
        <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name">
          <tab-content v-if="item.title === 'files'" @NewTab="addTab"></tab-content>

          <div v-if="item.title !== 'files'" style="padding-left: 6%; padding-right: 9%">
            <makedown-show :mk-value="item.content" background="#F0FFF0"></makedown-show>
          </div>

        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import TabContent from "./components/tab-content.vue";
import MakedownShow from "../../components/MakedownShow.vue";

export default {
  name: "files",
  data: function () {
    return {
      editableTabsValue: "1",
      editableTabs: [
        {
          title: "files",
          name: "1",
          content: "files",
        },
      ],
      tabIndex: 1,
    };
  },
  methods: {

    // eslint-disable-next-line no-unused-vars
    addTab(ArticleInfo) {
      let newTabName = ++this.tabIndex + "";
      this.editableTabs.push({
        title: ArticleInfo.title,
        name: newTabName,
        content: ArticleInfo.mkValue,
      });
      this.editableTabsValue = newTabName;
    },

    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
    },
  },

  components: {
    TabContent,
    MakedownShow: MakedownShow,
  },
};
</script>
