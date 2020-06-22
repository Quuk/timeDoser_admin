<template>
  <div>
    <div style="margin-right: 15px;display: flex;justify-content: space-between">
      <div style="display: flex;align-items: flex-end">
        <h2 style="margin-left: 10px;font-family:'Microsoft YaHei',Arial,sans-serif">用户信息</h2>
        <span style="margin-left: 6px">软件所有用户详细信息</span>
      </div>
    </div>
    <div style="width: 400px">
      <Divider style="margin: 0;"/>
    </div>
    <div style="margin: 10px 0 20px 20px;color: grey;font-size: 13px">
      1.价格活动是有单独页面的,需要单独进行处理<br/>
      2.价格活动上架以后需要手动去修改价格<br/>
      3.排序数字范围为1-10序号越小排在越前面
      4.活动添加以后如果需要推送,参考这里 <a
      href="https://qinghi.oss-cn-qingdao.aliyuncs.com/temp/RE2020-06-08%20%E6%B4%BB%E5%8A%A8%E8%BF%90%E8%90%A5%E6%89%8B%E5%86%8C.html"
      target="_blank">运营后台说明</a>
    </div>

    <div style="margin-bottom: 10px;display: flex;justify-content: space-between">
      <ButtonGroup>
        <Button :type="findAllParan.status===0?'primary':'default'" @click="changeButtonType(0)">
          全部
        </Button>
        <Button :type="findAllParan.status===1?'primary':'default'" @click="changeButtonType(1)">
          进行中
        </Button>
        <Button :type="findAllParan.status===2?'primary':'default'" @click="changeButtonType(2)">
          已下线
        </Button>
        <Button :type="findAllParan.status===3?'primary':'default'" @click="changeButtonType(3)">
          隐藏
        </Button>
      </ButtonGroup>
      <div>
        <Button type="primary" @click="actionDetailModal=true" style="margin-right: 15px">定制新的运营活动</Button>
        <Button @click="findAll" type="primary">
          <Icon type="md-refresh"/>
          刷新
        </Button>
      </div>
    </div>

    <!-- 运营数据-->
    <Table border :columns="columns" :data="salesList">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="showInfo(row.id)">更多信息</Button>
      </template>
    </Table>
    <div style="display: flex;justify-content: space-between;margin-top: 10px">
      <Page :total="salesCount" show-sizer show-elevator show-total :current.sync="findAllParan.currentPage"
            @on-page-size-change="pageChange" @on-change="findAll"/>
    </div>

    <!-- 活动详情 -->
    <Modal width="70" ok-text="确定"
           v-model="actionDetailModal"
           title="活动详情" style="user-select: none;"
           @on-ok="modalOk" @on-cancel="modalCancel">
      <Form :label-width="180">
        <FormItem v-if="activeDetail.id" label="活动ID" style="margin: 0">
          <span style="color: grey; margin-right: 30px">{{activeDetail.id}}</span>
        </FormItem>
        <FormItem label="活动名称"
                  style="margin:2px 0;">
          <input style="color: grey; margin-right: 30px; width: 500px;" v-model="activeDetail.name"/>
        </FormItem>
        <FormItem label="活动状态"
                  style="margin:2px 0;">
          <RadioGroup v-model="activeDetail.status">
            <Radio :label="1">进行中</Radio>
            <Radio :label="2">已下线</Radio>
            <Radio :label="3">隐藏</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="活动排序"
                  style="margin:2px 0;">
          <InputNumber :max="10" :min="1" v-model="activeDetail.sort"/>
        </FormItem>
        <FormItem label="活动封面图片"
                  style="margin:2px 0;">
          <input style="color: grey; margin-right: 30px; width: 500px;" v-model="activeDetail.coverUrl"/>
        </FormItem>
        <FormItem label="活动H5"
                  style="margin:2px 0;">
          <input style="color: grey; margin-right: 30px; width: 500px;" v-model="activeDetail.activityUrl"/>
        </FormItem>
        <FormItem label="活动页面链接"
                  style="margin:2px 0;">
          <input style="color: grey; margin-right: 30px; width: 500px;" v-model="activeDetail.pageUrl"/>
        </FormItem>
        <FormItem label="页面内头部图片"
                  style="margin:2px 0;">
          <input style="color: grey; margin-right: 30px; width: 500px;" v-model="activeDetail.showPictures"/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import {userGetAll, userDetail, userUpdate} from '@/api/user'

  export default {
    data() {
      return {
        priceAction: false,
        hasChange: false,
        columns: [
          {
            title: '创建时间',
            key: 'createdate',
          }, {
            title: '状态',
            key: 'enable',
          }, {
            title: '用户名',
            key: 'username',
          }, {
            title: '手机号',
            key: 'mobilephone',
          }, {
            title: '账号类型',
            key: 'accountType',
          }, {
            title: '操作',
            slot: 'action',
            width: 120,
            align: 'center'
          }
        ],
        actionDetailModal: false,
        salesList: [],
        salesCount: 0,
        findAllParan: {
          currentPage: 1,
          pageSize: 10,
          status: null,
        },
        activeDetail: {
          id: null,
          name: null,
          status: 3,
          activityUrl: null,
          coverUrl: null,
          pageUrl: null,
          sort: 0
        }
      }
    },
    created() {
      this.findAll();
    },
    methods: {

      // 查看详情
      showInfo(id) {
        this.actionDetailModal = true;
        this.findDetail(id)
      },

      // 点击了退出
      modalCancel() {
        this.actionDetailModal = false;
        this.reset()
      },

      // 点击确定
      modalOk() {
        if (this.activeDetail.name === null || this.activeDetail.coverUrl === null || this.activeDetail.activityUrl === null) {
          this.$Notice.error({
            title: '操作失败',
            desc: '活动名称 / 活动封面 / 活动H5不可为空'
          });
          return;
        }
        this.activeDetail.updateDate = null;
        userUpdate(this.activeDetail).then(() => {
          this.findAll();
        })
        this.actionDetailModal = false;
        this.reset()
      },

      // 分类查询活动
      changeButtonType(type) {
        this.findAllParan.status = type;
        this.findAll();
      },

      // 查看详情
      findDetail(id) {
        userDetail(id).then(res => {
          // if (res.data.success === true) {
          //   this.activeDetail = res.data.data
          // }
        })
      },

      // 查看所有
      findAll() {
        userGetAll(this.findAllParan).then(res => {
          if (res.data.status === true) {
            this.salesList = res.data.data
            this.salesCount = res.data.total

            // 修改数据
            this.salesList.forEach(i => {
              let statusStr = '';
              if (i.enable === 0) {
                statusStr = 'error'
              } else if (i.enable === 1) {
                statusStr = '正常'
              } else if (i.enable === 2) {
                statusStr = '已注销'
              }
              i.enable = statusStr
            })
          }
        })
      },

      // 分页查询
      pageChange(res) {
        this.findAllParan.pageSize = res
        this.findAll()
      },

      // 数据复原
      reset() {
        this.activeDetail = {
          id: null,
          name: null,
          status: 3,
          activityUrl: null,
          coverUrl: null,
          pageUrl: null,
          sort: 0
        }
      }
    }
  }
</script>

<style lang="less">
</style>
