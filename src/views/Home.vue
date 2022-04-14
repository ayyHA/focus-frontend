<template>
  <div>
    <el-row>
      <el-col :span="6">
        <Menu />
      </el-col>
      <el-col :span="12">
        <el-row><MenuTitle /></el-row>
        <el-row><router-view /></el-row>
      </el-col>
      <el-col :span="6">
        <News />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Menu from "@/components/menu.vue";
import News from "@/components/news.vue";
import MenuTitle from "@/components/menuTitle.vue";

export default {
  data() {
    return {};
  },
  components: {
    Menu,
    News,
    MenuTitle,
  },
};
</script>

<style>
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>