<template>
  <div>
    <div style="margin-right: 15px;display: flex;justify-content: space-between">
      <div style="display: flex;align-items: flex-end">
        <h2 style="margin-left: 10px;font-family:'Microsoft YaHei',Arial,sans-serif">角色管理</h2>
        <span style="margin-left: 6px">目前还没想好怎么写</span>
      </div>
    </div>
    <div style="width: 400px">
      <Divider style="margin: 0;"/>
    </div>
    <div style="margin: 10px 0 20px 20px;color: grey;font-size: 13px">
      1.test test test test test <br>
      2.test test test test
    </div>

    <div style="margin-bottom: 10px;display: flex;justify-content: space-between">
      <ButtonGroup>
        <Button :type="findAllParan.status===0?'primary':'default'" @click="changeButtonType(0)">
          全部
        </Button>
        <Button :type="findAllParan.status===1?'primary':'default'" @click="changeButtonType(1)">
          可用
        </Button>
        <Button :type="findAllParan.status===2?'primary':'default'" @click="changeButtonType(2)">
          禁用
        </Button>
      </ButtonGroup>

      <div>
        <Button type="primary" @click="addOne" style="margin-right: 15px">添加新角色</Button>
        <Button @click="findAll" type="primary">
          <Icon type="md-refresh"/>
          刷新
        </Button>
      </div>
    </div>

    <!-- 开屏页-->
    <Table border :columns="columns" :data="salesList">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="showInfo(row)">更多信息</Button>
      </template>
    </Table>
    <div style="display: flex;justify-content: space-between;margin-top: 10px">
      <Page :total="salesCount" show-sizer show-elevator show-total :current.sync="findAllParan.pageNum"
            @on-page-size-change="findAll" @on-change="findAll"/>
    </div>

    <!-- 活动详情 -->
    <Modal width="60" ok-text="修改"
           v-model="actionDetailModal"
           title="添加新角色" style="user-select: none;display: flex;"
           @on-ok="modalOk" @on-cancel="modalCancel">
      <div style="display: flex;">
        <div style="display: inline-block">
          <img v-if="activeDetail.pageUrl" :src="activeDetail.pageUrl" style="width: 200px;">
          <img v-else src="https://qinghi.oss-cn-qingdao.aliyuncs.com/welcomePage/default.png"
               style="width: 200px">
        </div>
        <div style="width: 400px;display: inline-block">
          <Form :label-width="100">
            <FormItem label="公司ID" style="margin: 0">
              <span style="color: grey; margin-right: 30px">{{activeDetail.comcanyId}}</span>
            </FormItem>
            <FormItem label="公司名称" style="margin:2px 0;">
              <span style="color: grey; margin-right: 30px">{{activeDetail.companyName}}</span>
            </FormItem>
            <FormItem label="状态"
                      style="margin:2px 0;">
              <RadioGroup v-model="activeDetail.status">
                <Radio :label="1">可用</Radio>
                <Radio :label="2">禁用</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="修改图片" style="margin:2px 0;">
              <Upload size="small" action="/api/qinghi/upload/uploadFile"
                      :on-remove="removeOneImg"
                      :on-success="upSuccess2" accept=".png,.jpg"
                      :data="{extName:'png'}" name="files">
                <Button icon="ios-cloud-upload-outline">点击这里上传图片</Button>
              </Upload>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>

    <!-- 创建页面 -->
    <Modal width="60" ok-text="确认添加"
           v-model="addOneModal" :closable="false"
           title="活动详情" style="user-select: none;display: flex;"
           @on-ok="createOne" @on-cancel="modalCancel">
      <div style="display: flex">
        <div style="display: inline-block">
          <img v-if="addDetail.pageUrl" :src="addDetail.pageUrl" style="width: 200px;border: black solid 1px">
          <img v-else src="https://qinghi.oss-cn-qingdao.aliyuncs.com/welcomePage/default.png"
               style="width: 200px;border: black solid 1px">
        </div>
        <div style="width: 400px;display: inline-block">
          <Form :label-width="100">
            <FormItem label="状态" style="margin:2px 0;">
              <RadioGroup v-model="addDetail.status">
                <Radio :label="1">可用</Radio>
                <Radio :label="2" :disabled="true">禁用</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="修改图片" style="margin:2px 0;">
              <Upload size="small" action="/api/qinghi/upload/uploadFile"
                      :on-remove="removeOneImg"
                      :on-success="upSuccess" accept=".png,.jpg"
                      :data="{extName:'png'}" name="files">
                <Button icon="ios-cloud-upload-outline">点击这里上传图片</Button>
              </Upload>
            </FormItem>
            <FormItem label="公司名称" style="margin:2px 0;">
              <div v-if="searchDefult">
                <span>{{searchDefult}}</span>
                <Button type="default" shape="circle" size="small" icon="md-close"
                        style="margin-left: 10px" @click="cleanSeach()"/>
              </div>
              <div v-else>
                <Input search enter-button placeholder="请输入公司编码或者名称..." style="width: 300px"
                       size="small" @on-search="search"/>
                <List v-if="searchComanyList.length > 0" :header="searchComanyTip" border
                      style="width: 300px">
                  <ListItem v-for="item in searchComanyList" style="height: 40px">
                    <Icon type="md-contacts" style="margin-right: 14px"/>
                    <div @click="setCompanyName(item)" style="width: 100%">{{item.companyCode}} /
                      {{item.companyName}}
                    </div>
                  </ListItem>
                </List>
              </div>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { companyInfo, sWelcompageAdd, sWelcompageUpdate, WelcompageDetail, WelcompageGetAll } from '@/api/data'

export default {
  data () {
    return {
      priceAction: false,
      hasChange: false,
      columns: [
        {
          title: '公司名称',
          key: 'companyName',
          width: 400
        }, {
          title: '状态',
          key: 'status'
        }, {
          title: '更新时间',
          key: 'creatDate'
        }, {
          title: '操作',
          slot: 'action',
          width: 120,
          align: 'center'
        }
      ],
      actionDetailModal: false,
      addOneModal: false,
      salesList: [],
      salesCount: 0,
      searchComanyList: [],
      searchComanyTip: '',
      searchDefult: null,
      findAllParan: {
        pageNum: 1,
        pageSize: 10,
        status: 1
      },
      activeDetail: {
        comcanyId: null,
        companyName: null,
        status: null,
        creatDate: null,
        pageUrl: null
      },
      addDetail: {
        comcanyId: null,
        companyName: null,
        status: 1,
        pageUrl: null
      }
    }
  },
  created () {
    this.findAll()
  },
  methods: {

    // 清空文件
    clearFiles () {

    },

    // 移除了一张图片
    removeOneImg () {
      this.addDetail.pageUrl = null
    },

    // 创建一个页面定制
    createOne () {
      if (this.addDetail.comcanyId === null || this.addDetail.pageUrl === null) {
        this.$Notice.error({
          title: '公司和图片都是必选!'
        })
        return
      }
      sWelcompageAdd(this.addDetail).then(() => {
        // 清空临时数据
        this.modalCancel()
        this.findAll()
      })
    },

    // 上传成功以后
    upSuccess (res) {
      this.addDetail.pageUrl = res.data.list.successFiles[0]
    },

    // 修改时候的上传成功以后
    upSuccess2 (res) {
      this.activeDetail.pageUrl = res.data.list.successFiles[0]
    },

    // 清空搜索
    cleanSeach () {
      this.searchDefult = null
      this.searchComanyList = []
    },

    // 设置关联公司的名称
    setCompanyName (item) {
      this.addDetail.comcanyId = item.companyId
      this.searchDefult = item.companyCode + ' - ' + item.companyName
    },

    // 打开创建页面
    addOne () {
      this.addOneModal = true
    },

    // 公司名称搜索
    search (data) {
      companyInfo(data).then(res => {
        if (res.data.data.length === 0) {
          this.$Notice.info({
            title: '没有查询到任何公司信息!'
          })
          return
        }
        this.searchComanyList = res.data.data
        this.searchComanyTip = '共查询出' + res.data.data.length + '家公司, 请选择一家公司查看详情'
      })
    },

    // 查看详情
    showInfo (row) {
      this.actionDetailModal = true
      this.findDetail(row)
    },

    // 点击了退出 清空所有临时数据
    modalCancel () {
      this.actionDetailModal = false
      this.activeDetail = {
        id: null,
        name: null,
        status: null,
        activityUrl: null,
        coverUrl: null,
        pageUrl: null,
        sort: null
      }
      this.addDetail = {
        comcanyId: null,
        companyName: null,
        status: 1,
        pageUrl: null
      }
      this.searchDefult = null
      this.searchComanyList = []
      this.clearFiles()
    },

    // 点击确定
    modalOk () {
      this.activeDetail.updateDate = null
      sWelcompageUpdate(this.activeDetail).then(() => {
        this.findAll()
      })
      this.modalCancel()
    },

    // 分类查询活动
    changeButtonType (type) {
      this.findAllParan.status = type
      this.findAll()
    },

    // 查看详情
    findDetail (row) {
      WelcompageDetail(row.id).then(res => {
        if (res.data.success === true) {
          this.activeDetail = res.data.data
          this.activeDetail.companyName = row.companyName
        }
      })
    },

    // 查看所有
    findAll () {
      WelcompageGetAll(this.findAllParan).then(res => {
        if (res.data.success === true) {
          this.salesList = res.data.data
          this.salesCount = res.data.count

          // 修改数据
          this.salesList.forEach(i => {
            let statusStr = ''
            if (i.status === 1) {
              statusStr = '可用'
            } else if (i.status === 2) {
              statusStr = '禁用'
            }
            i.status = statusStr
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
</style>
