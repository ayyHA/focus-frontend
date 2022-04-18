import axios from 'axios'

const instance = axios.create({
    timeout: 5000,
});

const getNews = async () => {
    return instance.request({
        method: "get",
        url: "http://api.tianapi.com/topnews/index",
        params: { key: "4d8c623eda749769f4e45846cdb94808", num: 40 },
    });
}

export default {
    getNews,
}