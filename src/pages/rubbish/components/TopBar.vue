<template>
  <div>
    <el-row style="padding: 1%">
      <el-col :span="2" style="padding-top: 6px">
        <el-button
          class="el-icon-delete"
          round
          size="mini"
          type="danger"
          @click="ForeverDelete"
          >清空</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'TopBar',
  methods: {
    ForeverDelete() {
      this.$emit('ForeverDelete');
    }
  }
};
</script>

<style scoped></style>
