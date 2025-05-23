<template>
  <div v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中">
    <!-- 添加标题栏 -->
    <el-row class="folder-header">
      <el-col :span="16">
        <span class="header-text" style="font-size: 17px">文件名</span>
      </el-col>
      <el-col :span="4">
        <span class="header-text" style="font-size: 17px">修改时间</span>
      </el-col>
      <el-col :span="2">
        <span class="header-text" style="font-size: 17px">类型</span>
      </el-col>
      <el-col :span="2">
        <span class="header-text" style="font-size: 17px">大小</span>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="16">
        <el-tooltip effect="light" placement="right">
          <div slot="content">
            <el-link icon="el-icon-edit" @click="dialogVisible = true"></el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link class="el-icon-delete" @click="Delete"></el-link>
          </div>

          <el-link style="font-size: 14px" @click="AccessFolder">
            <i class="el-icon-folder" style="margin-right: 1px"></i>
            {{ FolderInfo.title }}
          </el-link>
        </el-tooltip>
      </el-col>

      <!--编辑框-->
      <el-dialog :visible.sync="dialogVisible" title="修改" width="30%">
        <el-input v-model="FolderInfo.title"></el-input>
        <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button plain type="primary" @click="Update">确 定</el-button>
                </span>
      </el-dialog>

      <!--日期-->
      <el-col :span="4">
        <i class="el-icon-date" style="color: gainsboro">{{
            FolderInfo.updated_at.slice(0, 16)
          }}</i>
      </el-col>
    </el-row>

    <!--横线-->
    <el-row>
      <hr style="border: 0.08em solid lightgoldenrodyellow"/>
    </el-row>
  </div>
</template>

<script>
import request from "@/network/request";

export default {
  name: "Folder",
  props: ["FolderInfo"],
  data: function () {
    return {
      loading: false,
      dialogVisible: false,
    };
  },
  methods: {
    Delete() {
      this.loading = true;
      request({
        url: "/folder/delete",
        params: this.FolderInfo,
      }).then((resp) => {
        this.$message({
          type: "success",
          message: resp.data.msg,
        });

        this.$emit("DeleteFolder", resp.data.data);
        this.loading = false;
      });
    },
    Update() {
      this.loading = true;
      request({
        url: "/folder/update",
        params: this.FolderInfo,
      }).then((resp) => {
        this.$message({
          type: "success",
          message: "修改成功: " + this.FolderInfo.title,
        });
        console.log(resp.status); //防止报错
        this.loading = false;
        this.dialogVisible = false;
      });
    },
    AccessFolder() {
      this.loading = true;
      request({
        url: "/folder/sub_file/" + 1,
        params: {
          title: this.FolderInfo.title,
        },
      }).then((resp) => {
        this.$emit(
            "AccessFolder",
            resp.data.Folders,
            resp.data.Articles,
            resp.data.Nav.reverse(),
            resp.data.Total
        );
        this.loading = false;
      });
    },
  },
};
</script>

<style scoped>
.folder-header {
  padding: 15px 20px;
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: 20px;
  /* 增加与内容的间距 */
}

.header-text {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.folder-content {
  padding: 0 20px;
  /* 添加内容区域的内边距 */
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .folder-header {
    padding: 12px 15px;
    margin-bottom: 15px;
  }

  .header-text {
    font-size: 12px;
  }

  .folder-content {
    padding: 0 15px;
  }
}
</style>