<template>
  <el-dialog :visible.sync="dialogVisible" width="40%">
    <el-row>
      <el-col :span="2">
        <el-image :src="avatarUrl" class="avatar-style"></el-image>
      </el-col>
      <el-col :span="22">
        <editor
          id="tinymce"
          v-model="tinymceContentWithHTML"
          :init="init"
          ref="tinymceText"
        ></editor>
      </el-col>
      <el-col :offset="2" :span="22">
        <multi-upload ref="multiUpload" style="margin-top: 10px" />
      </el-col>
    </el-row>

    <span slot="footer">
      <el-tag
        :key="tag"
        v-for="tag in dynamicTags"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
      >
        {{ tag }}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
        v-show="dynamicTags.length < 3"
      >
      </el-input>
      <el-button
        v-else
        class="button-new-tag"
        size="small"
        @click="showInput"
        v-show="dynamicTags.length < 3"
        >+ 新关键词</el-button
      >
      <el-select
        v-model="grantType"
        placeholder="谁可以看"
        class="select-style"
      >
        <el-option
          v-for="item in options"
          :key="String(item.value)"
          :label="item.label"
          :value="item.value"
        >
        </el-option> </el-select
      ><el-button
        type="primary"
        @click="publishMessage"
        v-loading.fullscreen.lock="isLoading"
        >发 布</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import tinymce from "tinymce";
import "tinymce/themes/silver/theme";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/icons/default";
import "tinymce/plugins/emoticons"; // 插入表情插件
import "tinymce/plugins/image"; // 插入图片插件
import "tinymce/plugins/imagetools"; // 图片编辑工具
import "tinymce/plugins/wordcount"; // 字数统计插件
// import "tinymce/plugins/quickbars"; // 选中和换行显示的菜单栏，只提供图片上传
import MultiUpload from "./MultiUpload.vue";
import messageApi from "@/axios/message.js";
export default {
  components: { Editor, MultiUpload },
  props: {
    //0-original;1-replied_to;2-retweeted
    messageType: {
      type: Number,
      default: 0,
    },
    conversationId: {
      type: Number,
      default: null,
    },
    inReplyToAuthorId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dialogVisible: false,
      init: {
        selector: "#tinymce",
        language_url: "/tinymce/zh_CN.js",
        language: "zh_CN",
        skin_url: "/tinymce/skins/ui/oxide",
        plugins: "emoticons wordcount ", //引入插件
        toolbar: "undo redo | emoticons ", //工具栏
        browser_spellcheck: true, // 开启拼写检查（英文单词的）
        branding: false, // 去水印
        elementpath: false, //禁用编辑器底部的状态栏
        statusbar: false, // 隐藏编辑器底部的状态栏
        paste_data_images: false, // 不允许粘贴图像
        menubar: false, // 隐藏最上方menu
        emoticons_database_url: "/tinymce/emojis/emojis.js",
        // quickbars_insert_toolbar: "quickimage", // 换行只显示图片插入
        // quickbars_selection_toolbar: false, // 选中文本的quickbar不予显示
        // quickbars_image_toolbar: false, // 图片插入的不给使用alignleft那些进行格式调整
        // setup: (editor) => {
        //   editor.on("keyDown", this.handleHTMLContentChange);
        // },
      },
      tinymceContentWithHTML: "",
      isLoading: false,
      options: [
        {
          value: 0,
          label: "仅自己可看",
        },
        {
          value: 1,
          label: "粉丝可看",
        },
        {
          value: 2,
          label: "关注的人可看",
        },
        {
          value: 3,
          label: "全部人可看",
        },
      ],
      grantType: 0,
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
    };
  },
  mounted() {
    tinymce.init({});
  },
  computed: {
    avatarUrl() {
      return this.$store.state.userInfo.avatarUrl;
    },
  },
  methods: {
    /* 显示对话框 */
    showDialog() {
      this.dialogVisible = true;
    },
    /* 获取tinymce的纯文本 */
    getTinymcyContent() {
      var activeEditor = tinymce.activeEditor;
      var editBody = activeEditor.getBody();
      activeEditor.selection.select(editBody);
      var text = activeEditor.selection.getContent({ format: "text" });
      return text;
    },
    /* 上传message */
    async uploadMessage(text, images) {
      let keywords = this.dynamicTags.toString();
      /* 组织请求体 */
      let messageInfo = {
        text: text,
        images: images,
        authorId: this.$store.state.userInfo.id,
        type: this.messageType,
        conversationId: this.conversationId,
        inReplyToAuthorId: this.inReplyToAuthorId,
        keywords: keywords,
        grantType: this.grantType,
      };
      /* 向后端提交信息 */
      let publishRes = await messageApi.publishMessage(messageInfo);
      /* 清空tinymce文本框的内容 */
      tinymce.activeEditor.setContent("");
      return publishRes;
    },
    /* 发布message，需要上传文本和图片 */
    async publishMessage() {
      // loading的遮罩
      this.isLoading = true;
      // 上传图片前，先看看有没有图片要传
      let imagesLength = this.$refs.multiUpload.getSrcListLength();
      if (imagesLength == 0) {
        let text = this.getTinymcyContent();
        let publishRes = await this.uploadMessage(text, null);
        publishRes = publishRes.data;
        /* 上传信息失败 */
        if (publishRes.code == 2005) {
          this.$message.error(publishRes.msg);
        } else if (publishRes.code == 2006) {
          /* 上传消息成功 */
          // 即刻显示新消息
          localStorage.setItem(
            "updateMessageInfoDto",
            JSON.stringify(publishRes.data)
          );
          // 让homepage获取数据
          this.$store.commit("updateMessages_");
        }
        // 对话框隐藏
        this.dialogVisible = false;
        // loading的遮罩
        this.isLoading = false;
        return;
      }
      /* 上传图片 */
      let picturesRes = await this.$refs.multiUpload.uploadPictures();
      picturesRes = picturesRes.data;
      /* 上传图片失败 */
      if (picturesRes.code == 2003) {
        this.$message.error(picturesRes.msg);
        /* 清空tinymce文本框的内容 */
        tinymce.activeEditor.setContent("");
        // 对话框隐藏
        this.dialogVisible = false;
        // loading的遮罩
        this.isLoading = false;
        return;
      }
      /* 上传图片成功,获取图片们的url */
      let images = picturesRes.data.images;
      /* 获取文本信息 */
      let text = this.getTinymcyContent();
      console.log(text, images);
      /* 上传message，获取响应信息 */
      let publishRes = await this.uploadMessage(text, images);

      publishRes = publishRes.data;
      /* 上传信息失败 */
      if (publishRes.code == 2005) {
        this.$message.error(publishRes.msg);
      }
      // 对话框隐藏
      this.dialogVisible = false;
      // loading的遮罩
      this.isLoading = false;
    },
    handleClose(tag) {
      // 标签删掉一个，则在对应的数组删除该元素
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      // inputvalue非空，则认为是有用的关键字，加入数组中
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
  },
};
</script>

<style scoped>
.avatar-style {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.select-style {
  width: 150px;
  margin-right: 10px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  margin-right: 10px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  margin-right: 10px;
  /* vertical-align: bottom; */
}
</style>