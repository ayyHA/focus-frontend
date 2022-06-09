import instance from './index'
import qs from 'qs'

const uploadMultiPictures = async (formdata) => {
    return instance.request({
        method: "post",
        url: "/message/uploadMultiPictures",
        data: formdata,
        headers: { 'Content-type': 'multipart/form-data' },
    });
}

const publishMessage = async (messageDto) => {
    return instance.request({
        method: "post",
        url: "/message/publishMessage",
        data: messageDto,
    });
}

const getMessageInfoList = async (page) => {
    return instance.request({
        method: "get",
        url: "/message/showMessage",
        params: { page: page },
    });
}

const saveLike = async (messageId, userId, likeCount) => {
    return instance.request({
        method: "post",
        url: "/message/like/saveLike",
        params: {
            messageId: messageId,
            userId: userId,
            likeCount: likeCount,
        },
    });
}

const saveUnlike = async (messageId, userId, likeCount) => {
    return instance.request({
        method: "post",
        url: "/message/like/saveUnlike",
        params: {
            messageId: messageId,
            userId: userId,
            likeCount: likeCount,
        },
    });
}

const getLikeData = async (userId) => {
    return instance.request({
        method: "get",
        url: `/message/like/getLikeData/${userId}`,
    });
}

const getUserMessages = async (authorId, pageNum) => {
    return instance.request({
        method: "get",
        url: '/message/getMessagesByAuthorId',
        params: {
            authorId: authorId,
            pageNum: pageNum,
        }
    });
}

const getPinnedMessage = async (userId) => {
    return instance.request({
        method: 'get',
        url: '/message/getPinnedMessage',
        params: { userId: userId },
    });
}

const deleteMessageById = async (messageId) => {
    return instance.request({
        method: 'delete',
        url: '/message/deleteMessageById',
        params: { messageId },
    });
}

const getReplies = async (authorId, messageId) => {
    return instance.request({
        method: "get",
        url: "/message/getReplies",
        params: {
            inReplyToAuthorId: authorId,
            conversationId: messageId,
        }
    });
}

const getRetweetedMessage = async (conversationId) => {
    return instance.request({
        method: 'get',
        url: '/message/getRetweetedMessage',
        params: { conversationId },
    });
}

export default {
    uploadMultiPictures,
    publishMessage,
    getMessageInfoList,
    saveLike,
    saveUnlike,
    getLikeData,
    getUserMessages,
    getPinnedMessage,
    deleteMessageById,
    getReplies,
    getRetweetedMessage,
}