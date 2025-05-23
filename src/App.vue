<template>
  <div id="app">
    <el-row style="margin-bottom: 1%">
      <!--侧边导航-->
      <el-col :span="1">
        <el-menu :collapse="true" :default-active="navIndex">
          <el-menu-item index="write" @click="Link('write')">
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
      <el-col :span="23">
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

</style>
