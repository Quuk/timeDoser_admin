import axios from '@/libs/api.request'

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const uploadImg = formData => {
  return axios.request({
    url: 'image/upload',
    data: formData
  })
}

export const getOrgData = () => {
  return axios.request({
    url: 'get_org_data',
    method: 'get'
  })
}

export const getTreeSelectData = () => {
  return axios.request({
    url: 'get_tree_select_data',
    method: 'get'
  })
}

// 首页数据加载
export const getIndexData = () => {
  return axios.request({
    url: '/api/qinghi/index/getIndexBaseInfo',
    method: 'get'
  })
}

// 首页数据加载
export const getAllCoupones = () => {
  return axios.request({
    url: '/api/qinghi/coupones/findAll',
    method: 'get'
  })
}

// 修改优惠券
export const updateCoupones = formData => {
  return axios.request({
    url: '/api/qinghi/coupones/update',
    method: 'post',
    data: formData
  })
}

// 查看所有的商品信息
export const getAllBusiness = () => {
  return axios.request({
    url: '/api/qinghi/business/findAll',
    method: 'get'
  })
}

// 修改商品信息
export const updateBusiness = formData => {
  return axios.request({
    url: '/api/qinghi/business/update',
    method: 'post',
    data: formData
  })
}

// 查看所有优惠券关联
export const couponesQueryLink = formData => {
  return axios.request({
    url: '/api/qinghi/coupones/queryLink',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 添加优惠券关联
export const couponesAddLink = formData => {
  return axios.request({
    url: '/api/qinghi/coupones/addLink',
    method: 'post',
    data: formData
  })
}

// 删除优惠券关联
export const couponesDeleteLink = formData => {
  return axios.request({
    url: '/api/qinghi/coupones/deleteLink?linkId=' + formData,
    method: 'get'
  })
}

// 查看所有公司信息
export const companyInfo = formData => {
  return axios.request({
    url: '/api/qinghi/company/searchCompany?queryCompany=' + formData,
    method: 'get'
  })
}

// 查看单个公司信息
export const companyGetOne = formData => {
  return axios.request({
    url: '/api/qinghi/company/getOne?companyId=' + formData,
    method: 'get'
  })
}

// 查看公司购买信息
export const companyFindBuy = formData => {
  return axios.request({
    url: '/api/qinghi/business/findBuy?companyId=' + formData,
    method: 'get'
  })
}

// 查看公司购买信息
export const companyBuyOne = formData => {
  return axios.request({
    url: '/api/qinghi/business/buyOne',
    method: 'post',
    data: formData
  })
}

// 更新公司的容量信息
export const companyConfigProjectNum = formData => {
  return axios.request({
    url: '/api/qinghi/business/configProjectNum',
    method: 'post',
    data: formData
  })
}

// 管理后台登录
export const adminLogin = formData => {
  return axios.request({
    url: '/api/qinghi/setting/login',
    method: 'post',
    data: formData
  })
}

// [公司分类] findAll
export const industryGetAll = () => {
  return axios.request({
    url: '/api/qinghi/industry/findAll',
    method: 'get'
  })
}

// [公司分类] update one
export const industryUpdateOne = formData => {
  return axios.request({
    url: '/api/qinghi/industry/updateOne',
    method: 'post',
    data: formData
  })
}

// [公司分类] add one
export const industryAddOne = formData => {
  return axios.request({
    url: '/api/qinghi/industry/addOne',
    method: 'post',
    data: formData
  })
}

// [公司信息] find all
export const companyFindAll = formData => {
  return axios.request({
    url: '/api/qinghi/companyAdmin/findAll',
    method: 'post',
    data: formData
  })
}

// [用户信息] find all
export const findAllCustomer = formData => {
  return axios.request({
    url: '/api/qinghi/companyAdmin/findAllCustomer',
    method: 'post',
    data: formData
  })
}

// 打卡数据折线图
export const attendDisplay = formData => {
  return axios.request({
    url: '/api/qinghi/adminIndex/attendDisplay?type=' + formData,
    method: 'get'
  })
}

// [订单信息] find all
export const findAllOrder = formData => {
  return axios.request({
    url: '/api/qinghi/companyAdmin/findAllOrder',
    method: 'post',
    data: formData
  })
}

// [公司信息] 修改公司分类
export const companyChangeClass = formData => {
  return axios.request({
    url: '/api/qinghi/company/changeClass',
    method: 'post',
    data: formData
  })
}

// [公司信息] 查看ios审核状态
export const findCheckIOSStatus = formData => {
  return axios.request({
    url: '/api/qinghi/noBusiness/getAuditStatus',
    method: 'get',
    data: formData
  })
}

// [公司信息] 修改ios审核状态
export const updateIosCheckStatus = formData => {
  return axios.request({
    url: '/api/qinghi/noBusiness/updateAuditStatus?status=' + formData,
    method: 'get'
  })
}

// [运营数据汇报统计] 导出日周月报统计数据
export const exportRepCountList = formData => {
  return axios.request({
    url: '/api/mail/exportOperationData',
    method: 'post',
    data: formData
  })
}

// [运营数据汇报统计] 查看日周月报统计数据
export const getRepStatistics = formData => {
  return axios.request({
    url: '/api/qinghi/noBusiness/getReportStatistics',
    method: 'post',
    data: formData
  })
};

// [首页信息] 查看新增公司行业分布
export const companyIndustry = formData => {
  return axios.request({
    url: '/api/qinghi/adminIndex/newCompanyAttendDisplay?type=' + formData,
    method: 'get',
  })
}

/**
 * [管理后台]活跃公司员工数量分布
 *
 * @param type 0:月度 1:季度
 * @return data
 */
export const companyEmployeeCount = type => {
  return axios.request({
    url: '/api/qinghi/adminIndex/companyEmployeeCount?type=' + type,
    method: 'get',
  })
}

/**
 * [管理后台]活跃公司创建时间分布
 *
 * @param type 0:月度 1:季度
 * @return data
 */
export const companyCreateTimeCount = type => {
  return axios.request({
    url: '/api/qinghi/adminIndex/companyCreateTimeCount?type=' + type,
    method: 'get',
  })
}

/**
 * [管理后台]活跃公司行业分布
 *
 * @param type 0:月度 1:季度
 * @return data
 */
export const companyIndustyCount = type => {
  return axios.request({
    url: '/api/qinghi/adminIndex/companyIndustyCount?type=' + type,
    method: 'get',
  })
}
