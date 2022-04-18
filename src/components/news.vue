<template>
  <el-card shadow="never" class="card-background">
    <div slot="header" class="clearfix">
      <span>热点消息</span>
    </div>
    <div v-for="news in newsList" :key="news.id" class="text item">
      <NewsComponent :newsContent="news.title" :newsUrl="news.picUrl" />
    </div>
  </el-card>
</template>

<script>
import NewsComponent from "./newsComponent.vue";
import newsApi from "@/axios/news.js";
export default {
  components: {
    NewsComponent,
  },
  data() {
    return {
      newsList: [],
    };
  },
  created() {
    this.initNewsList();
  },
  methods: {
    async initNewsList() {
      let resData = await newsApi.getNews();
      // 进来先清空
      this.newsList = [];
      resData = resData.data;
      console.log(resData);
      if (resData.code == 200) {
        let newsBasic = resData.newslist;
        // 将报纸类的新闻拿三条放置到this.newsList中
        for (let news of newsBasic) {
          let source = String(news.source);
          if (
            (source == "央视网" ||
              source == "BWC中文网" ||
              source.slice(-1) == "报") &&
            news.picUrl != "" &&
            news.picUrl != null
          ) {
            this.newsList.push(news);
          }
          if (this.newsList.length == 3) {
            console.log("newsBasic", newsBasic);
            console.log("newsList", this.newsList);
            return;
          }
        }
      } else {
        this.newsList = [];
      }
    },
  },
};
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.card-header {
  margin-top: 10px;
}

.card-background {
  background-color: #f7f9f9;
}

span {
  font-family: "xingGuang";
  font-size: 25px;
}
</style>