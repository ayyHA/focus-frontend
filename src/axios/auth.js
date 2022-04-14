import instance from './index'
import qs from 'qs'

const signIn = async (loginForm) => {
    let data = {
        username: loginForm.username,
        password: loginForm.password,
        client_id: "ayyHA",
        client_secret: "123456",
        grant_type: "password",
    };
    return instance.request({
        method: "post",
        url: "/oauth/oauth/token",
        data: qs.stringify(data),
        headers: { 'Content-type': 'application/x-www-form-urlencoded;charset=utf-8' }
    })
}

const signUp = async (registerForm) => {
    let data = {
        username: registerForm.username,
        password: registerForm.password,
        nickname: registerForm.nickname,
        email: registerForm.email,
        updateAt: Date.now(),
    };
    return instance.request({
        method: "post",
        url: "/oauth/signUp",
        data: data,
    })
}

const checkToken = async (waitCheckToken) => {
    let tokenStr = String(waitCheckToken);
    let token = tokenStr.split(' ')[1];
    return instance.request({
        method: "post",
        url: "/oauth/oauth/check_token",
        data: qs.stringify({ token: token }),
        headers: { 'Content-type': 'application/x-www-form-urlencoded;charset=utf-8' }
    })
}

export default {
    signIn,
    signUp,
    checkToken,
}

