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

export default {
    getUserInfo,
    uploadAvatar,
    uploadBackground,
    updateUserDetails,
    getSignStatus,
    doSign,
}

