<template>
  <div id="app">
    <el-row class="app-container">
      <!-- 侧边导航 -->
      <el-col :span="1">
        <el-menu
          :collapse="true"
          :default-active="navIndex"
          class="sidebar-menu"
        >
          <el-menu-item class="el-menu-item" index="home" @click="Link('home')">
            <i class="el-icon-house"></i>
            <span slot="title">Home</span>
          </el-menu-item>

          <el-menu-item
            class="el-menu-item"
            index="write"
            @click="Link('write')"
          >
            <i class="el-icon-edit"></i>
            <span slot="title">Write</span>
          </el-menu-item>

          <el-menu-item index="files" @click="Link('files')">
            <i class="el-icon-folder-opened"></i>
            <span slot="title">Folder</span>
          </el-menu-item>

          <el-menu-item index="rubbish" @click="Link('rubbish')">
            <i class="el-icon-delete"></i>
            <span slot="title">Rubbish</span>
          </el-menu-item>

          <el-menu-item index="mybook" @click="Link('mybook')">
            <i class="el-icon-reading"></i>
            <span slot="title">MyBook</span>
          </el-menu-item>

          <el-menu-item index="manage" @click="Link('manage')">
            <i class="el-icon-s-tools"></i>
            <span slot="title">Manage</span>
          </el-menu-item>
        </el-menu>
      </el-col>

      <!-- 页面内容区域 -->
      <el-col :span="23" class="main-content">
        <!-- 添加路由缓存支持 -->
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" :key="$route.fullPath" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" :key="$route.fullPath" />
      </el-col>
    </el-row>

    <!-- 添加全局错误提示组件 -->
    <ErrorToast />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapGetters('ui', ['activeNavIndex']),
    navIndex() {
      return this.activeNavIndex || this.$route.name;
    }
  },
  methods: {
    ...mapActions('ui', ['navigateTo']),
    Link(path) {
      const targetPath = '/' + path;
      if (this.$route.path !== targetPath) {
        this.navigateTo(path);
        this.$router.push(targetPath);
      }
    }
  }
};
</script>

<style>
/* 重置默认样式，防止出现最外层滚动条 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  overflow: hidden; /* 防止最外层滚动条 */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  overflow: hidden; /* 防止应用层面的滚动条 */
}

.app-container {
  height: 100vh;
  margin: 0;
}

.sidebar-menu {
  position: relative;
  height: 100vh;
  border-right: 1px solid #e6e6e6;
}

.main-content {
  height: 100vh;
  overflow-y: auto; /* 改为允许垂直滚动 */
  padding: 10px;
}

/* 加深图标颜色 */
.sidebar-menu .el-menu-item i {
  color: #000000 !important;
}

/* 鼠标悬停时的图标颜色 */
.sidebar-menu .el-menu-item:hover i {
  color: #66b1ff !important;
}

/* 激活状态的图标颜色 */
.sidebar-menu .el-menu-item.is-active i {
  color: #409eff !important;
}
</style>
