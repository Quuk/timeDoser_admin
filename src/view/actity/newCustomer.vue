<template>
  <div>
    <h1>新增用户信息</h1>
    <div style="margin:30px 20px;font-size: 12px">
      1. 用户信息暂时不提供修改,如果需要提供相关功能请联系管理员<br/>
    </div>

    <!-- 查询 -->
    <div style="display: flex;justify-content: space-between;margin-bottom: 10px">
      <DatePicker split-panels type="daterange" :options="dateScope" placeholder="选择时间范围"
                  style="width: 200px" @on-change="dateChange"/>
      <Input suffix="ios-search" search placeholder="输入用户名称查询.." style="width: 230px" @on-search="nameSearch"/>
    </div>

    <!-- 公司信息 -->
    <Table border :columns="columns12" :data="customerList">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
    </Table>
    <div style="display: flex;justify-content: space-between;margin-top: 10px">
      <Page :total="customerCount" show-sizer show-elevator show-total
            :current.sync="findAllParan.pageNum" @on-page-size-change="pageChange" @on-change="findAll"/>
      <Button icon="md-download" type="primary">导出excl</Button>
    </div>

  </div>
</template>
<script>
  import { findAllCustomer } from '@/api/data'

  export default {
    name: 'industry',
    data () {
      return {
        dateScope: {
          shortcuts: [
            {
              text: '一天内',
              value () {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24)
                return [start, end]
              }
            },
            {
              text: '一周内',
              value () {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                return [start, end]
              }
            },
            {
              text: '单月内',
              value () {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                return [start, end]
              }
            },
            {
              text: '三月内',
              value () {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                return [start, end]
              }
            }
          ]
        },
        findAllParan: {
          pageNum: 1,
          pageSize: 10,
          name: null,
          startTime: null,
          endTime: null,
          industry: null
        },
        customerList: [],
        customerCount: 0,
        columns12: [
          {
            title: '用户ID',
            key: 'id'
          },
          {
            title: '用户名称',
            key: 'name'
          },
          {
            title: '创建时间',
            key: 'createTime'
          },
          {
            title: '创建设备',
            key: 'ditch'
          },
          {
            title: '手机号',
            key: 'phone'
          },
        ],
      }
    },
    created () {
      this.findAll()
    },
    methods: {
      dateChange (res) {
        this.findAllParan.startTime = res[0]
        this.findAllParan.endTime = res[1]
        this.findAll()
      },
      nameSearch (res) {
        this.findAllParan.name = res
        this.findAll()
      },
      pageChange (res) {
        this.findAllParan.pageSize = res
        this.findAll()
      },
      changeType (type) {
        this.findAllParan.type = type
        this.findAll()
      },
      findAll () {
        findAllCustomer(this.findAllParan).then(res => {
          if (res.data.success === true) {
            this.customerList = res.data.data
            this.customerCount = res.data.count
          }
        })
      }
    },
  }

</script>
<style>
</style>
