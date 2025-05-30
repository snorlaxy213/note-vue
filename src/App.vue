<template>
  <div id="app">
    <el-row>
      <!--侧边导航-->
      <el-col :span="1">
        <el-menu :collapse="true" :default-active="navIndex" class="sidebar-menu">
          <el-menu-item class="el-menu-item" index="write" @click="Link('write')">
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
            <i class="el-icon-s-tools"></i><span slot="title">Manage</span>
          </el-menu-item>
        </el-menu>
      </el-col>

      <!--页面-->
      <el-col :span="23" style="padding: 10px">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      rate: null
    }
  },
  methods: {
    Link(path) {
      this.$router.push("/" + path)
    }
  },
  computed: {
    navIndex() {
      return this.$route.name;
    }
  }
}
</script>

<style>
.sidebar-menu {
  position: relative;
  height: 100vh;
  border-right: 1px solid #e6e6e6;
}

/* 加深图标颜色 */
.sidebar-menu .el-menu-item i {
  color: #000000 !important; /* 使用Element UI的主色调 */
}

/* 鼠标悬停时的图标颜色 */
.sidebar-menu .el-menu-item:hover i {
  color: #66b1ff !important; /* 悬停时稍微亮一些 */
}

/* 激活状态的图标颜色 */
.sidebar-menu .el-menu-item.is-active i {
  color: #409EFF !important; /* 激活状态保持主色调 */
}
</style>
