<template>
  <div
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
          <el-input v-model="currentNote.title" placeholder="标题"></el-input>
        </div>
      </el-row>

      <el-row>
        <mavon-editor
          ref="md"
          v-model="currentNote.mkValue"
          :ishljs="true"
          :preview="true"
          :subfield="true"
          :defaultOpen="preview"
          style="height: 700px"
          @imgAdd="ImgAdd"
          @imgDel="ImgDel"
          @save="Save"
        />
      </el-row>
    </el-col>

    <!--编辑器侧边信息-->
    <el-col :span="3" style="padding-top: 1%">
      <!--日期-->
      <div style="text-align: center">
        创建日期:<i class="el-icon-date" style="color: deepskyblue">{{currentNote.created_at }}</i>
        <br />
        最近更新:<i class="el-icon-date" style="color: orange">{{currentNote.updated_at }}</i>
      </div>
      <el-divider></el-divider>

      <!--目录-->
      <div>
        目录:
        <el-cascader
          v-model="currentNote.folder_id"
          :options="options"
          :props="props"
          clearable
          filterable
        ></el-cascader>
      </div>
      <el-divider></el-divider>

      <!--保存-->
      <div style="text-align: center">
        <div style="display: flex; gap: 10px; justify-content: center; align-items: center;">
          <el-button type="success" @click="FinishSave">保存文章</el-button>
          <el-button type="danger" plain @click="DeleteCache">清空</el-button>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script>
import request from '@/network/request';
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'write',
  components: {},

  mounted() {
    if (this.$route.params.article) {
      // 从其他页面传递文章参数进入编辑模式
      this.setCurrentNote(this.$route.params.article);
    } else {
      // 直接进入write页面，重置为新文章
      this.resetToNewArticle();
    }
  },

  // 在组件销毁之前执行的操作
  beforeDestroy() {
    // 检查当前笔记的ID是否既不为0也不为空，以确定是否需要保存笔记
    if (this.currentNote.id !== 0 && this.currentNote.id != null) {
      // 调用保存临时笔记的方法，将当前笔记保存到临时存储或服务器
      this.saveTempNote(this.currentNote);
    }
  },


  data: function () {
    return {
      //目录
      options: [],
      props: {
        checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          request({
            url: '/folder/sub_folder',
            params: {
              id: node.value
            }
          }).then(resp => {
            resolve(resp.data.data);
          });
        }
      }
    };
  },

  computed: {
    ...mapState('notes', ['currentNote', 'loading'])
  },

  methods: {
    ...mapActions('notes', ['saveTempNote']),
    ...mapMutations('notes', {
      setCurrentNote: 'SET_CURRENT_NOTE',
      setLoading: 'SET_LOADING'
    }),

    // 添加重置为新文章的方法
    resetToNewArticle() {
      const defaultArticle = {
        id: null,
        created_at: this.getCurrentDate(),
        updated_at: this.getCurrentDate(),
        title: '',
        dir_path: [],
        mkValue: '',
        folder_id: 0
      };
      this.setCurrentNote(defaultArticle);

      // 强制重置mavon-editor组件
      this.$nextTick(() => {
        if (this.$refs.md) {
          this.$refs.md.d_value = '';
          this.$refs.md.s_preview_switch = false;
        }
      });
    },

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
      this.setLoading(true);
      const noteData = {
        ...this.currentNote,
        mkValue: this.$refs.md.$data.d_value
      };

      request({
        method: 'post',
        url: '/article/update',
        data: noteData
      })
        .then(resp => {
          this.$message({
            type: 'success',
            message: resp.data.msg
          });
          this.setCurrentNote(resp.data.data);
          this.setLoading(false);
        })
        .catch(error => {
          console.error('保存失败:', error);
          this.setLoading(false);
        });
    },

    //编辑器
    //保存 Ctrl+S回调
    Save(mkValue) {
      const noteData = {
        ...this.currentNote,
        mkValue: mkValue
      };
      this.setLoading(true);

      request({
        url: '/article/update',
        method: 'post',
        data: noteData
      })
        .then(resp => {
          this.$message({
            type: 'success',
            message: resp.data.msg
          });
          this.setCurrentNote(resp.data.data);
          this.setLoading(false);
        })
        .catch(err => {
          console.log(err);
          this.setLoading(false);
        });
    },

    //图片上传七牛云 图片名字唯一
    ImgAdd(pos, imgFile) {
      console.log(imgFile); //防止报错
      let data = new FormData();
      data.append('img', imgFile);
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
        if (resp.data.code === 500) {
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
        const defaultArticle = {
          id: null,
          created_at: this.getCurrentDate(),
          updated_at: this.getCurrentDate(),
          title: '',
          dir_path: [],
          mkValue: '',
          folder_id: 0
        };
        this.setCurrentNote(defaultArticle);
      });
    }
  }
};
</script>

<style scoped></style>
