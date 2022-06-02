import instance from './index'

const getUserInfo = async (username) => {
    return instance.request({
        method: "get",
        url: "/user/get/" + username,
    });
}

const uploadAvatar = async (formData) => {
    return instance.request({
        data: formData,
        method: "post",
        url: "/user/uploadAvatar",
        headers: { 'Content-type': 'multipart/form-data' },
    });
}

const uploadBackground = async (formData) => {
    return instance.request({
        data: formData,
        method: "post",
        url: "/user/uploadBackground",
        headers: { 'Content-type': 'multipart/form-data' },
    });
}

const updateUserDetails = async (userInfoDto) => {
    return instance.request({
        data: userInfoDto,
        method: 'post',
        url: '/user/updateUserDetails',
    });
}

const getSignStatus = async (userId, date) => {
    return instance.request({
        method: 'get',
        params: {
            userId: userId,
            date: date,
        },
        url: "/user/getSignStatus",
    });
}

const doSign = async (userId, date) => {
    return instance.request({
        method: 'get',
        params: {
            userId: userId,
            date: date,
        },
        url: "/user/doSign",
    });
}

const getUserInfoById = async (userId) => {
    return instance.request({
        method: 'get',
        params: { userId: userId },
        url: "/user/getUserInfoDtoById",
    });
}

const getFollowStatus = async (sourceId, targetId) => {
    return instance.request({
        method: "get",
        params: {
            sourceId: sourceId,
            targetId: targetId,
        },
        url: "/user/friend/getFollowStatus",
    });
}

const followUser = async (sourceId, targetId, date) => {
    return instance.request({
        method: "post",
        params: {
            sourceId: sourceId,
            targetId: targetId,
            date: date,
        },
        url: "/user/friend/followUser",
    });
}

const unFollowUser = async (sourceId, targetId, date) => {
    return instance.request({
        method: "post",
        params: {
            sourceId: sourceId,
            targetId: targetId,
            date: date,
        },
        url: "/user/friend/unFollowUser",
    });
}

export default {
    getUserInfo,
    uploadAvatar,
    uploadBackground,
    updateUserDetails,
    getSignStatus,
    doSign,
    getUserInfoById,
    getFollowStatus,
    followUser,
    unFollowUser,
}

