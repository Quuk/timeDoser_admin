import axios from '@/libs/api.request'

// 管理后台登录
export const adminCount = () => {
    return axios.request({
        url: '/api/timeDoser/adminIndex/getCount',
        method: 'get'
    })
};
