<template>
  <div class="error-component">
    <el-result
      icon="error"
      title="页面加载失败"
      sub-title="网络连接异常或页面不存在"
    >
      <template slot="extra">
        <el-button type="primary" @click="reload">重新加载</el-button>
        <el-button @click="goHome">返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<script>
export default {
  name: 'ErrorComponent',
  methods: {
    reload() {
      window.location.reload();
    },
    goHome() {
      this.$router.push('/files');
    }
  }
};
</script>

<style scoped>
.error-component {
  padding: 50px;
  text-align: center;
}
</style>
