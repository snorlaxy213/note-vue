<template>
  <div>
    <el-row>
      <el-col :span="18">
        <el-tooltip effect="light" placement="right">
          <div slot="content">
            <el-link icon="el-icon-refresh-right" @click="Recover"></el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link class="el-icon-info"></el-link>
          </div>

          <el-link style="font-weight: bolder;font-size: 17px" target="_blank" @click="dialogVisible=true">
            <i class="el-icon-document" style="margin-right: 1px"></i>
            {{ FileInfo.title }}
          </el-link>
        </el-tooltip>
      </el-col>

      <!--日期-->
      <el-col :span="4">
        <i class="el-icon-date" style="color: gainsboro">{{ FileInfo.deleted_time }}</i>
      </el-col>
    </el-row>

    <!--横线-->
    <el-row>
      <hr style=" border:0.08em solid lightgoldenrodyellow">
    </el-row>

    <el-dialog
        :visible.sync="dialogVisible"
        title="提示"
        width="90%"
    >
      {{ FileInfo.mkHtml }}
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "RubbishFile",
  props: ["FileInfo"],
  data: function () {
    console.log(JSON.stringify(this.FileInfo))
    return {
      editDialogVisible: false
    }
  },
  methods: {
    Recover() {
      this.$emit("Recover", this.FileInfo.id)
    }
  }
}
</script>

<style scoped>

</style>