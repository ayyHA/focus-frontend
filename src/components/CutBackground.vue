<template>
  <div>
    <el-button id="edit-avatar" @click="showDialog" style="display: none"
      >编辑背景板</el-button
    >
    <el-dialog
      title="设置背景板"
      :visible.sync="isShowDialog"
      width="800px"
      @close="closeDialog"
    >
      <input
        type="file"
        style="display: none"
        id="input-file"
        accept="image/png, image/jpeg, image/jpg, image/bmp"
        @change="uploadImg($event)"
      />
      <el-row>
        <el-col style="height: 200px">
          <div class="container-left">
            <div v-if="isShowFileButton" class="btn-box">
              <el-popover
                width="100"
                trigger="hover"
                :content="'图片不可大于 ' + imageMaxSize + ' MB'"
                placement="top-start"
              >
                <div
                  class="choose-file-btn"
                  @click="changeFile"
                  slot="reference"
                >
                  选 择 图 片
                </div>
              </el-popover>
            </div>
            <div v-else class="cropper-box">
              <vueCropper
                style="width: 800; height: 200px"
                ref="cropper"
                :img="options.img"
                :auto-crop="options.autoCrop"
                :fixed-box="options.fixedBox"
                :can-move-box="options.canMoveBox"
                :auto-crop-width="autoCropWidth"
                :auto-crop-height="autoCropHeight"
                :center-box="options.centerBox"
                :info-true="options.infoTrue"
                :full="options.full"
                :original="options.original"
                @realTime="realTime"
              >
              </vueCropper>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col style="height: 200px">
          <h2 style="text-align: center; margin: 5px auto">背景板预览</h2>
          <div class="show-preview">
            <div
              :style="{
                width: autoCropWidth + 'px',
                height: autoCropHeight + 'px',
              }"
              class="preview"
            >
              <img :src="previews.url" :style="previews.img" alt="" />
            </div>
          </div>
          <div v-show="!isShowFileButton" class="preview-footer">
            <el-button @click="changeFile" style="margin-top: 10px"
              >更 换 图 片</el-button
            >
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="commitCut"
          v-loading.fullscreen.lock="fullscreenLoading"
          :disabled="Object.keys(previews).length === 0"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import userApi from "@/axios/user.js";
export default {
  name: "CutBackground",
  props: {
    // 图片的大小限制，默认 3 MB
    imageMaxSize: {
      type: Number,
      default: 3,
    },
    //截图框宽度
    autoCropWidth: {
      type: Number,
      default: 100,
    },
    //截图框高度
    autoCropHeight: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      isShowDialog: false, // 弹窗状态
      isShowFileButton: true, // 选择文件的按钮状态
      options: {
        // vue-cropper的参数
        img: "", //裁剪的图片blob地址
        autoCrop: true, //默认生成截图框
        fixedBox: true, //固定截图框大小
        canMoveBox: true, //截图框能拖动
        // autoCropWidth: 100, //截图框宽度
        // autoCropHeight: 100, //截图框高度
        centerBox: false, //截图框被限制在图片里面 //**//**/
        infoTrue: false, //true为展示真实输出图片宽高，false展示看到的截图框宽高
        full: false, //false按原比例裁切图片，不失真
        original: true, // 上传图片按照原始比例渲染
      },
      previews: {}, // 预览图对象
      fullscreenLoading: false, // 全屏加载遮罩状态
      imageUrl: "", // 上传后的图片地址
      fileName: "", // 上传的图片名称，如abc.png这样
    };
  },
  methods: {
    // 显示对话框弹窗
    showDialog() {
      this.isShowDialog = true;
    },
    // 关闭截图对话框弹窗
    closeDialog() {
      this.isShowDialog = false;
      this.previews = {};
      this.isShowFileButton = true;
    },
    // 点击选择图片或更换图片按钮，变更裁剪图片
    changeFile() {
      document.getElementById("input-file").click();
    },
    // 变更裁剪图片
    uploadImg(e) {
      let file = e.target.files[0];
      // 判断文件格式是否符合要求规范
      if (!/\.(jpg|jpeg|png|bmp|JPG|PNG)$/.test(e.target.value)) {
        this.$message.error("图片类型必须是,jpeg,jpg,png,bmp中的一种");
        return false;
      }
      // 判断文件是否超出大小限制
      if (file.size / 1024 / 1024 > this.imageMaxSize) {
        this.$message.error("图片不可大于 " + this.imageMaxSize + " MB");
        return false;
      }

      // 获取文件的文件名
      let originPathFileName = e.target.value;
      let fileArray = String(originPathFileName).split("\\");
      this.fileName = fileArray.pop();

      //fileReader 接口，用于异步读取文件数据
      let reader = new FileReader();
      reader.readAsDataURL(file); //重要 以dataURL形式读取文件
      reader.onload = (e) => {
        // this.options.img = window.URL.createObjectURL(new Blob([e.target.result])) 转化为blob格式
        this.options.img = e.target.result;
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
      };
      this.isShowFileButton = false;
    },
    // 同步实时预览的数据
    realTime(data) {
      this.previews = data;
    },
    //确认截图,上传到后台
    commitCut() {
      this.fullscreenLoading = true;
      let formData = new FormData();
      this.$refs.cropper.getCropBlob(async (res) => {
        // res是裁剪后图片的blob对象,遍历组件上传数据的对象 => 添加到formData对象中
        formData.append("file", res);
        formData.append("fileName", this.fileName);
        // 调用后端接口,将裁剪后的图像上传
        let result = await userApi.uploadBackground(formData);
        result = result.data;
        // 上传成功
        if (result.code == "2008") {
          console.log(result.msg);
          this.imageUrl = result.data.path;
          this.closeDialog();
          this.fullscreenLoading = false;
          this.SetUrl();
        } else {
          console.log(result.msg);
          this.fullscreenLoading = false;
        }
      });
    },
    // 将裁剪后的图片传出给父组件
    SetUrl() {
      this.$emit("getUrl", this.imageUrl);
    },
  },
};
</script>

<style lang="scss" scoped>
.container-left {
  width: 100%;
  height: 100%;
  .btn-box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .cropper-box {
    width: 100%;
    height: 100%;
  }
}

.choose-file-btn {
  width: 160px;
  height: 80px;
  font-size: 22px;
  font-weight: 600;
  line-height: 80px;
  text-align: center;
  color: #333;
  border: #aaa 1px solid;
  cursor: pointer;
  transition: 0.25s;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
}
.choose-file-btn:hover {
  color: #fff;
  background: #00d7c6;
  border: #00d7c6 1px solid;
  transform: scale(1.15);
}

.show-preview {
  display: flex;
  justify-content: center;
}

.preview {
  //   border-radius: 50%;
  overflow: hidden;
  border: 1px solid #ccc;
  background: #ccc;
}

.preview-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  //   padding-top: 15px;
}
</style>