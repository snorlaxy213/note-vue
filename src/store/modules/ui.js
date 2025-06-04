const state = {
  // 导航状态
  activeNavIndex: 'files', // 修改默认值从 'write' 到 'files'

  // 标签页管理
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

const mutations = {
  SET_ACTIVE_NAV(state, navIndex) {
    state.activeNavIndex = navIndex;
  },
  SET_ACTIVE_TAB(state, tabValue) {
    state.editableTabsValue = tabValue;
  },
  ADD_TAB(state, articleInfo) {
    const newTabName = ++state.tabIndex + '';
    state.editableTabs.push({
      title: articleInfo.title,
      name: newTabName,
      content: articleInfo.mkValue
    });
    state.editableTabsValue = newTabName;
  },
  REMOVE_TAB(state, targetName) {
    const tabs = state.editableTabs;
    let activeName = state.editableTabsValue;

    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.name === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1];
          if (nextTab) {
            activeName = nextTab.name;
          }
        }
      });
    }

    state.editableTabsValue = activeName;
    state.editableTabs = tabs.filter(tab => tab.name !== targetName);
  }
};

const actions = {
  navigateTo({ commit }, navIndex) {
    commit('SET_ACTIVE_NAV', navIndex);
  },
  addTab({ commit }, articleInfo) {
    commit('ADD_TAB', articleInfo);
  },
  removeTab({ commit }, targetName) {
    commit('REMOVE_TAB', targetName);
  }
};

const getters = {
  activeNavIndex: state => state.activeNavIndex,
  currentTab: state => state.editableTabsValue,
  allTabs: state => state.editableTabs,
  tabCount: state => state.editableTabs.length
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
