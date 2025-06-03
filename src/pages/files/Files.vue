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
import TabContent from './components/TabContent';
import MakedownShow from '../../components/MakedownShow.vue';

export default {
  name: 'files',
  data: function () {
    return {
      editableTabsValue: '1',
      editableTabs: [
        {
          title: 'files',
          name: '1',
          content: 'files'
        }
      ],
      tabIndex: 1
    };
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    addTab(ArticleInfo) {
      let newTabName = ++this.tabIndex + '';
      this.editableTabs.push({
        title: ArticleInfo.title,
        name: newTabName,
        content: ArticleInfo.mkValue
      });
      this.editableTabsValue = newTabName;
    },

    // 判断tab是否可关闭
    getTabClosable(item) {
      // 如果不是首页，都可以关闭
      if (item.title !== 'files') {
        return true;
      }
      // 如果是首页，只有当它是唯一的tab时才不可关闭
      return this.editableTabs.length > 1;
    },

    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;

      // 找到要删除的tab
      let targetTab = tabs.find(tab => tab.name === targetName);

      // 如果当前激活的tab是要删除的tab，需要切换到其他tab
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

      // 删除tab
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);

      // 规则1：如果删除最后一个页签时，打开首页
      if (this.editableTabs.length === 0) {
        this.editableTabs = [
          {
            title: 'files',
            name: '1',
            content: 'files'
          }
        ];
        this.editableTabsValue = '1';
        this.tabIndex = 1;
      } else {
        this.editableTabsValue = activeName;
      }
    }
  },

  components: {
    TabContent,
    MakedownShow: MakedownShow
  }
};
</script>
