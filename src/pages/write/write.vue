<template>
  <div
    v-loading.fullscreen.lock="loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    element-loading-spinner="el-icon-loading"
    element-loading-text="拼命加载中"
    style="padding-left: 1%"
  >
    <!--编辑器-->
    <el-col :span="21" style="padding-right: 1%">
      <el-row>
        <div
          style="
            text-align: center;
            margin-bottom: 1%;
            margin-top: 1%;
            font-size: 30px;
          "
        >
          <el-input v-model="article.title" placeholder="标题"></el-input>
        </div>
      </el-row>
      <el-row>
        <mavon-editor
          ref="md"
          v-model="article.mkValue"
          :ishljs="true"
          style="height: 700px"
          @imgAdd="ImgAdd"
          @imgDel="ImgDel"
          @save="Save"
        />
      </el-row>
    </el-col>

    <!--编辑器侧边信息-->
    <el-col :span="3" style="padding-top: 2%">
      <!--日期-->
      <div style="text-align: center">
        创建日期:
        <i class="el-icon-date" style="color: deepskyblue">{{
          article.created_at
        }}</i
        ><br />
        最近更新:
        <i class="el-icon-date" style="color: orange">{{
          article.updated_at
        }}</i>
      </div>
      <el-divider></el-divider>

      <!--目录-->
      <div>
        目录:
        <el-cascader
          v-model="article.dir_path"
          :options="options"
          :props="props"
          clearable
          filterable
        ></el-cascader>
      </div>
      <el-divider></el-divider>

      <!--保存-->
      <div style="text-align: center">
        <el-button type="success" @click="FinishSave">保存文章</el-button>
        <el-link @click="DeleteCache">清空</el-link>
      </div>
    </el-col>
  </div>
</template>

<script>
import request from '@/network/request';

export default {
  name: 'write',
  components: {},

  mounted() {
    if (this.$route.params.article) {
      this.article = this.$route.params.article;
    } else {
      this.loading = true;
      // 设置当前日期
      const currentDate = this.getCurrentDate();
      request({
        url: '/article/temp_get'
      }).then(resp => {
        this.article = resp.data.data;
        // 如果后端返回的日期为空或默认值，则使用当前日期
        if (!this.article.created_at || this.article.created_at === '0-0-0-0') {
          this.article.created_at = currentDate;
        }
        if (!this.article.updated_at || this.article.updated_at === '0-0-0-0') {
          this.article.updated_at = currentDate;
        }
        this.loading = false;
      });
    }
  },

  beforeDestroy() {
    if (this.article.id !== 0 && this.article.id != null) {
      request({
        url: '/article/temp_save',
        method: 'post',
        data: this.article
      }).then(resp => {
        // 移除消息提示，静默保存
        console.log('文章已自动保存:', resp.data.msg);
      });
    }
  },

  data: function () {
    return {
      loading: false,
      //目录
      options: [],
      props: {
        checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          // eslint-disable-next-line no-console
          request({
            url: '/folder/sub_folder',
            params: {
              id: node.value
              // title: node.label
            }
          }).then(resp => {
            resolve(resp.data.data);
          });
        }
      },

      article: {
        id: null,
        created_at: '0-0-0-0',
        updated_at: '0-0-0-0',
        title: '无标题',
        dir_path: [],
        mkValue: '',
        folder_id: 0
      }
    };
  },

  methods: {
    // 获取当前日期
    getCurrentDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },

    //点击保存事件
    FinishSave() {
      this.loading = true;
      this.article.mkValue = this.$refs.md.$data.d_value;
      request({
        method: 'post',
        url: '/article/update',
        data: this.article
      }).then(resp => {
        this.$message({
          type: 'success',
          message: resp.data.msg
        });
        this.article = resp.data.data;
        this.loading = false;
      });
    },

    //编辑器
    //保存 Ctrl+S回调
    Save(mkValue) {
      this.article.mkValue = mkValue;
      this.loading = true;

      request({
        url: '/article/update',
        method: 'post',
        data: this.article
      })
        .then(resp => {
          this.$message({
            type: 'success',
            message: resp.data.msg
          });
          this.article = resp.data.data;
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },

    //图片上传七牛云 图片名字唯一
    ImgAdd(pos, imgfile) {
      console.log(imgfile); //防止报错
      let data = new FormData();
      data.append('img', imgfile);
      this.loading = true;
      request({
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        url: '/qiniu/img_upload',
        data: data
      })
        .then(resp => {
          this.$message({
            type: 'success',
            message: resp.data.msg
          });

          this.$refs.md.$img2Url(pos, resp.data.data);
          this.loading = false;
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err
          });
        });
    },

    //图片从七牛云删除
    ImgDel(file) {
      this.loading = true;
      request({
        url: '/qiniu/img_delete',
        params: {
          img_name: file[1].name
        }
      }).then(resp => {
        if (resp.data.code == 500) {
          this.$message({
            type: 'error',
            message: resp.data.msg
          });
        } else {
          this.$message({
            type: 'success',
            message: resp.data.msg
          });
        }

        this.loading = false;
      });
    },

    //清空redis缓存
    DeleteCache() {
      request({
        url: '/article/temp_delete'
      }).then(resp => {
        this.$message({
          type: 'success',
          message: resp.data.msg
        });
        this.article = {
          id: null,
          created_at: null,
          updated_at: null,
          title: '无标题',
          dir_path: [],
          mkValue: '',
          folder_id: 0
        };
      });
    }
  }
};
</script>

<style scoped></style>
