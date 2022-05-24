import instance from './index'
import qs from 'qs'

const getChatList = async (userId) => {
    return instance.request({
        method: "get",
        params: { userId: userId },
        url: "/chat/getChatZSet",
    });
}

const getChatHistory = async (userId, talkId) => {
    return instance.request({
        method: "get",
        url: "/chat/getChatHistory",
        params: {
            userId: userId,
            talkId: talkId,
        },
    });
}

export default {
    getChatList,
    getChatHistory,
}