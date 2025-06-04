<template>
  <div>
    <el-page-header content="MyBook" @back="goBack"> </el-page-header>
    <el-divider></el-divider>

    <el-row>
      <el-button size="mini" type="success" @click="dialogVisible = true"
        >添加书籍</el-button
      >
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        tooltip-effect="dark"
      >
        <el-table-column label="ID" prop="id" width="60"> </el-table-column>
        <el-table-column label="更新时间" width="100">
          <template slot-scope="scope">
            <el-link>{{ scope.row.updated_at.slice(0, 10) }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="图书" width="500">
          <template slot-scope="scope">
            <el-link>{{ scope.row.title }}【{{ scope.row.writer }}】</el-link>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="300">
          <template slot-scope="scope">
            <el-link :href="scope.row.img_url">{{ scope.row.img_url }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="300">
          <template slot-scope="scope">
            <el-radio v-model="scope.row.status" label="在读">在读</el-radio>
            <el-radio v-model="scope.row.status" label="想读">想读</el-radio>
            <el-radio v-model="scope.row.status" label="读完">读完</el-radio>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="Delete(scope.row)"
              >删除</el-button
            >
            <el-button size="mini" type="primary" @click="Update(scope.row)"
              >保存修改</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-dialog
      v-loading="loading"
      :visible.sync="dialogVisible"
      title="Book"
      width="50%"
    >
      Title:
      <el-input v-model="book.title"></el-input>
      Writer:
      <el-input v-model="book.writer"></el-input>
      Status:
      <el-radio v-model="book.status" label="在读">在读</el-radio>
      <el-radio v-model="book.status" label="想读">想读</el-radio>
      <el-radio v-model="book.status" label="读完">读完</el-radio>

      <el-upload
        :before-upload="UploadImg"
        :show-file-list="false"
        class="avatar-uploader"
      >
        <img v-if="book.img_url" :src="book.img_url" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddBook">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'MyBook',
  computed: {
    ...mapGetters('books', [
      'bookList',
      'currentBook',
      'isDialogVisible',
      'isLoading'
    ]),
    tableData() {
      return this.bookList;
    },
    loading() {
      return this.isLoading;
    },
    dialogVisible: {
      get() {
        return this.isDialogVisible;
      },
      set(value) {
        this.$store.commit('books/SET_DIALOG_VISIBLE', value);
      }
    },
    book: {
      get() {
        return this.currentBook;
      },
      set(value) {
        this.$store.commit('books/SET_CURRENT_BOOK', value);
      }
    }
  },
  mounted() {
    this.fetchBooks();
  },
  methods: {
    ...mapActions('books', [
      'fetchBooks',
      'addBook',
      'updateBook',
      'deleteBook',
      'uploadBookImage'
    ]),
    goBack() {
      this.$router.push('/manage');
    },
    async Delete(val) {
      try {
        await this.deleteBook(val.id);
        this.$message({
          type: 'success',
          message: '删除成功'
        });
      } catch (error) {
        this.$message({
          type: 'error',
          message: '删除失败'
        });
      }
    },
    async Update(val) {
      try {
        await this.updateBook(val);
        this.$message({
          type: 'success',
          message: '更新成功'
        });
      } catch (error) {
        this.$message({
          type: 'error',
          message: '更新失败'
        });
      }
    },
    async UploadImg(file) {
      try {
        const imageUrl = await this.uploadBookImage(file);
        this.$store.commit('books/SET_CURRENT_BOOK', {
          ...this.currentBook,
          img_url: imageUrl
        });
        this.$message({
          type: 'success',
          message: '图片上传成功'
        });
      } catch (error) {
        this.$message({
          type: 'error',
          message: '图片上传失败'
        });
      }
    },
    async AddBook() {
      try {
        await this.addBook();
        this.$message({
          type: 'success',
          message: '添加成功'
        });
      } catch (error) {
        this.$message({
          type: 'error',
          message: '添加失败'
        });
      }
    }
  }
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
