<template>
  <div v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中">
    <div class="folder-item">
      <!-- 文件名列 -->
      <div class="folder-name">
        <el-link style="font-size: 14px" @click="AccessFolder">
          <i class="el-icon-folder" style="margin-right: 6px; color: #409eff; font-size: 16px;"></i>
          <span style="font-weight: 500;">{{ FolderInfo.title }}</span>
        </el-link>
      </div>

      <!-- 标签列 -->
      <div class="folder-tags">
        <el-tag size="small" type="info">文件夹</el-tag>
      </div>

      <!-- 修改时间列 -->
      <div class="folder-time">
        <span>{{ FolderInfo.updated_at.slice(0, 16) }}</span>
      </div>

      <!-- 类型列 -->
      <div class="folder-type">
        <span>文件夹</span>
      </div>

      <!-- 大小列 -->
      <div class="folder-size">
        <span>-</span>
      </div>

      <!-- 操作列 -->
      <div class="folder-actions">
        <el-button size="mini" icon="el-icon-edit" @click="editDialogVisible = true" title="编辑"></el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete" @click="Delete" title="删除"></el-button>
      </div>
    </div>

    <!--编辑框-->
    <el-dialog :visible.sync="editDialogVisible" title="修改文件夹名称" width="30%">
      <el-input v-model="FolderInfo.title"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button plain type="primary" @click="Update">确 定</el-button>
      </span>
    </el-dialog>
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
      editDialogVisible: false,
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
        this.editDialogVisible = false;
      });
    },

    AccessFolder() {
      this.loading = true;
      request({
        url: "/folder/sub_file/" + 1, // 点击文件夹时总是从第一页开始
        params: {
          title: this.FolderInfo.title,
          folder_id: this.FolderInfo.id,
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
.folder-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.3s;
  font-size: 14px;
  border-radius: 4px;
  margin: 0 4px;
}

.folder-item:hover {
  background-color: #f8f9fa;
  border-radius: 4px;
}

.folder-name {
  flex: 0 0 30%;
  display: flex;
  align-items: center;
  gap: 6px;
}

.folder-tags {
  flex: 0 0 20%;
  display: flex;
  align-items: center;
  gap: 6px;
}

.folder-time {
  flex: 0 0 15%;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;
}

.folder-type {
  flex: 0 0 10%;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;
}

.folder-size {
  flex: 0 0 10%;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;
}

.folder-actions {
  flex: 0 0 15%;
  display: flex;
  align-items: center;
  gap: 6px;
}

.folder-item:last-child {
  border-bottom: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .folder-name {
    flex: 0 0 50%;
  }
  
  .folder-tags {
    flex: 0 0 25%;
  }
  
  .folder-time {
    flex: 0 0 25%;
  }
  
  .folder-type,
  .folder-size {
    display: none;
  }
}
</style>