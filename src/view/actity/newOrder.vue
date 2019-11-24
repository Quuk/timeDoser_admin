<template>
  <div>
    <h1>新增订单信息</h1>
    <div style="margin:30px 20px;font-size: 12px">
      1. 订单信息暂时不提供修改,如果需要提供相关功能请联系管理员<br/>
      2. 测试会产生0.01元的订单,选择'去除测试数据'以后,则会剔除1元以下订单
    </div>

    <!-- 查询 -->
    <div style="display: flex;justify-content: space-between;margin-bottom: 10px">
      <DatePicker split-panels type="daterange" :options="dateScope" placeholder="选择时间范围"
                  style="width: 200px" @on-change="dateChange"/>
      <div>
        去除测试数据:
        <i-switch v-model="findAllParan.status" style="margin-right: 15px" :true-value="1" :false-value="0"
                  @on-change="findAll">
          <Icon type="md-checkmark" slot="open"></Icon>
          <Icon type="md-close" slot="close"></Icon>
        </i-switch>
        <Input suffix="ios-search" search placeholder="输入公司名/公司编码/付款人姓名查询.." style="width: 230px"
               @on-search="nameSearch"/>
      </div>
    </div>

    <!-- 公司信息 -->
    <Table border :columns="columns12" :data="orderList">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
    </Table>
    <div style="display: flex;justify-content: space-between;margin-top: 10px">
      <Page :total="orderCount" show-sizer show-elevator show-total
            :current.sync="findAllParan.pageNum" @on-page-size-change="pageChange" @on-change="findAll"/>
      <Button icon="md-download" type="primary">导出excl</Button>
    </div>
  </div>
</template>
<script>
  import { findAllOrder } from '@/api/data'

  export default {
        name: 'industry',
        data() {
            return {
                dateScope: {
                    shortcuts: [
                        {
                            text: '一天内',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24);
                                return [start, end];
                            }
                        },
                        {
                            text: '一周内',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                return [start, end];
                            }
                        },
                        {
                            text: '单月内',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                return [start, end];
                            }
                        },
                        {
                            text: '三月内',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                return [start, end];
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
                orderList: [],
                orderCount: 0,
                columns12: [
                    {
                        title: '公司名称',
                        key: 'companyName'
                    }, {
                        title: '购买产品',
                        key: 'bussinessName',
                        width: 170
                    }, {
                        title: '公司编码',
                        key: 'companyCode'
                    }, {
                        title: '创建时间',
                        key: 'createDate',
                        width: 170
                    }, {
                        title: '付款金额',
                        key: 'balance'
                    }, {
                        title: '时长(年)',
                        key: 'year',
                        width: 90
                    }, {
                        title: '数量(个)',
                        key: 'count',
                        width: 90
                    }, {
                        title: '开发票',
                        key: 'invoice',
                        width: 90
                    }, {
                        title: '操作用户',
                        key: 'userName'
                    }, {
                        title: '优惠券',
                        key: 'couponsName'
                    },
                ],
            }
        },
        created() {
            this.findAll()
        },
        methods: {
            dateChange(res) {
                this.findAllParan.startTime = res[0];
                this.findAllParan.endTime = res[1];
                this.findAll()
            },
            nameSearch(res) {
                this.findAllParan.name = res
                this.findAll()
            },
            pageChange(res) {
                this.findAllParan.pageSize = res
                this.findAll()
            },
            changeType(type) {
                this.findAllParan.type = type
                this.findAll()
            },
            findAll() {
                findAllOrder(this.findAllParan).then(res => {
                    if (res.data.success === true) {
                        this.orderList = res.data.data;
                        this.orderCount = res.data.count;
                    }
                })
            }
        },
    }

</script>
<style>
</style>
