<template>
  <div
    v-loading.fullscreen.lock="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-text="拼命加载中"
  >
    <el-row>
      <el-col :span="6">
        <el-button plain size="mini" type="primary" @click="open('目录名称')">
          <i class="el-icon-folder-add" style="margin-right: 4px"></i>新建文件夹
        </el-button>

        <el-button plain size="mini" type="success" @click="goToWrite">
          <i class="el-icon-document-add" style="margin-right: 4px"></i>新建笔记
        </el-button>

        <el-button plain size="mini" type="warning" @click="UploadMd()">
          <i class="el-icon-upload2" style="margin-right: 4px"></i>上传md
        </el-button>
      </el-col>
    </el-row>

    <!--上传dig-->
    <el-dialog :visible.sync="editDialogVisible" title="提示" width="30%">

      <el-upload ref="upload" :auto-upload="false" :http-request="ht" multiple>
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>

        <el-button
          size="small"
          style="margin-left: 10px"
          type="success"
          @click="submitUpload"
          >上传到服务器
        </el-button>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="CloseUpLoad">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/network/request';
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'Navigate',
  data: function () {
    return {
      Nav: [],
      loading: false,
      editDialogVisible: false
    };
  },

  computed: {
    ...mapState('folders', ['currentNote', 'loading'])
  },

  methods: {

    CloseUpLoad() {
      this.$parent.$refs.FileList.Total++;
      if (
        this.$parent.$refs.FileList.currentPage <
        Math.ceil(this.$parent.$refs.FileList.Total / 10)
      ) {
        this.$parent.$refs.FileList.handleCurrentChange(
          Math.ceil(this.$parent.$refs.FileList.Total / 10)
        );
      } else {
        this.$parent.$refs.FileList.handleCurrentChange(
          this.$parent.$refs.FileList.currentPage
        );
      }
      this.editDialogVisible = false;
    },

    ht(files) {
      this.loading = true;
      let formData = new FormData();
      formData.append(files.file.name, files.file);
      request({
        url: '/article/upload_md',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Folder-Title': this.Nav[this.Nav.length - 1]
        }
        // eslint-disable-next-line no-unused-vars
      }).then(resp => {
        this.loading = false;
        if (resp.data.code == 200) {
          this.$message({
            message: resp.data.msg,
            type: 'success'
          });
        } else {
          this.$message({
            message: resp.data.msg,
            type: 'error'
          });
        }
      });
    },

    submitUpload() {
      this.$refs.upload.submit();
    },

    UploadMd() {
      this.editDialogVisible = true;
    },

    // 新增方法：直接跳转到写作页面
    goToWrite() {
      // 检查当前路由是否已经在写作页面
      if (this.$route.path !== '/write') {
        this.$router.push('/write');
      }
    },

    open(title) {
      if (title === '目录名称') {
        this.$prompt(title, '创建', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          this.loading = true;
          request({
            url: '/folder/add',
            params: {
              title: value,
              FatherTitle: this.Nav[this.Nav.length - 1]
            }
          })
            .then(resp => {
              this.$message({
                type: 'success',
                message: resp.data.msg
              });
              this.loading = false;
              this.$parent.$refs.FileList.FolderList.push(resp.data.data);
              this.$parent.$refs.FileList.Total++;
              if (this.$parent.$refs.FileList.FolderList.length > 10) {
                this.$parent.$refs.FileList.handleCurrentChange(
                  this.$parent.$refs.FileList.currentPage + 1
                );
              } else {
                this.$parent.$refs.FileList.handleCurrentChange(
                  this.$parent.$refs.FileList.currentPage
                );
              }
            })
            .catch(err => {
              this.$message({
                type: 'success',
                message: err
              });
            });
        });
      }
    }
  }
};
</script>

<style scoped></style>
