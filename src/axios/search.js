import instance from './index'
import qs from 'qs'

const searchByKeywords = async (keywords) => {
    return instance.request({
        method: "get",
        url: "/search/byKeywords",
        params: { keywords: keywords },
    });
}

const searchByNickname = async (nickname) => {
    return instance.request({
        method: 'get',
        url: '/search/byNickname',
        params: { nickname: nickname },
    });
}

export default {
    searchByKeywords,
    searchByNickname,
}