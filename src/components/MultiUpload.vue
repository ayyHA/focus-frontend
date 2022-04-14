<template>
  <div>
    <el-upload
      action="''"
      list-type="picture-card"
      :limit="imageCountLimit"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :on-exceed="handleExceed"
      :http-request="uploadPictures"
      :auto-upload="false"
      multiple="true"
      class="upload"
      ref="elUpload"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import messageApi from "@/axios/message.js";
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      srcList: [],
      imageCountLimit: 3,
    };
  },
  watch: {
    srcList() {
      this.$nextTick(() => {
        this.resizeImageSize();
      });
    },
  },
  mounted() {
    this.resizeImageSize();
  },
  methods: {
    /* 移除图片时的钩子 */
    handleRemove(file, fileList) {
      this.srcList.splice(this.srcList.indexOf(file), 1);
      console.log(file, fileList);
    },
    /* 预览图片时的钩子 */
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    /* 文件状态改变的钩子 */
    // 添加文件、上传成功和上传失败时都会被调用,注意remove文件的时候不会调用
    handleChange(file, fileList) {
      /* 图片类型检测和大小检测 */
      const typeList = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
      const isTypeValid = typeList.includes(file.raw.type);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isTypeValid)
        return this.$message.error("图片格式只能是 JPG/PNG/GIF!");
      if (!isLt2M) return this.$message.error("图片大小不能超过 2MB!");
      /* 响应式更改数组 */
      this.srcList.push(file);
    },
    /* 文件超出个数限制时的钩子 */
    handleExceed(files, fileList) {
      this.$message.error("最多上传" + this.imageCountLimit + "张图片");
    },
    /* 自定义文件上传方法 */
    async uploadPictures() {
      // 将待上传的图片列表存入formdata
      let formData = new FormData();
      this.srcList.forEach((file) => {
        formData.append("fileList", file.raw);
      });
      // 调用后端接口上传
      let picturesRes = await messageApi.uploadMultiPictures(formData);
      /* 清空el-upload里的上传列表 */
      this.$refs.elUpload.clearFiles();
      // 回传上传图片的信息
      return picturesRes;
    },
    /* el-upload大小重置，以适配需求 */
    resizeImageSize() {
      let dom = document.getElementsByClassName("upload")[0];
      let width = dom.clientWidth;
      const margin = 10;
      const size = `${(width - 2 * margin) / 3 - 1}px`;
      let image = dom.getElementsByClassName("el-upload--picture-card")[0];
      image.style.width = size;
      image.style.height = size;
      image.style["line-height"] = size;
      if (this.srcList.length === 3) {
        image.style.display = "none";
      } else {
        image.style.display = "";
      }
      image = dom.getElementsByClassName("el-upload-list__item");
      for (let i of image) {
        i.style.width = size;
        i.style.height = size;
      }
    },
    getSrcListLength() {
      return this.srcList.length;
    },
  },
};
</script>
<style scoped>
/* .upload ::v-deep .el-upload-list .el-upload-list__item {
  width: 33%;
  width: 33%;
}
.upload ::v-deep .el-upload-list .el-upload-list__item {
  width: 33%;
} */
</style>