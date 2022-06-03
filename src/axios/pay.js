import instance from './index'

const doReward = async (sourceId, targetId, amountOfCoin) => {
    return instance.request({
        method: 'post',
        url: '/pay/doReward',
        params: {
            sourceId,
            targetId,
            amountOfCoin,
        },
    });
}

export default {
    doReward,
}