<template>
  <div>
    <h1>新增企业信息</h1>
    <div style="margin:30px 20px;font-size: 12px">
      1. 如需修改公司付费相关信息,请在公司查看页面操作<br/>
      2. 公司信息目前只提供修改行业信息,如需提供更多操作请联系管理员
    </div>

    <!-- 查询 -->
    <div style="display: flex;justify-content: space-between;margin-bottom: 10px">
      <div style="display: flex">
        <DatePicker split-panels type="daterange" :options="dateScope" placeholder="选择时间范围"
                    style="width: 200px" @on-change="dateChange"/>
        <Input suffix="ios-search" search placeholder="输入公司名称或编号查询.." style="width: 230px;margin-left: 20px"
               @on-search="nameSearch" v-model="findAllParan.name"/>
      </div>
      <div>
        <Select filterable prefix="md-briefcase" style="width:150px;margin-right: 5px"
                @on-change="industryMainChange" placeholder="选择行业大类" v-model="industryMain">
          <Option v-for="item in industryMainList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select clearable filterable style="width:150px;"
                placeholder="选择行业细分" @on-change="industrydetailChangeQuery">
          <Option v-for="item in industryDetailList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
    </div>

    <!-- 公司信息 -->
    <Table border :columns="columns12" :data="companyList">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="showInfo(row)">更多信息</Button>
      </template>
    </Table>
    <div style="display: flex;justify-content: space-between;margin-top: 10px">
      <Page :total="companyCount" show-sizer show-elevator show-total :current.sync="findAllParan.pageNum"
            @on-page-size-change="pageChange" @on-change="findAll"/>
      <Button icon="md-download" type="primary">导出excl</Button>
    </div>

    <!-- 公司信息 AA95947 -->
    <Modal @on-ok="changeIndustry"
           v-model="modal1" :title="companyInfo.companyName">
      <Form :model="companyInfo" :label-width="80">
        <FormItem label="行业信息">
          <Row>
            <Col span="9" style="padding-right:10px">
              <Select filterable @on-change="industryMainChange">
                <Option v-for="item in industryMainList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
            <Col span="11">
              <Select filterable @on-change="industrydetailChange">
                <Option v-for="item in industryDetailList" :value="item.value" :key="item.value">{{ item.label }}
                </Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="班次信息">
          <Input v-model="companyInfo.attendanceSetting" style="width: 340px" disabled/>
        </FormItem>
        <FormItem label="客户模板">
          <Input v-model="companyInfo.customerTemplate" style="width: 340px" disabled/>
        </FormItem>
        <FormItem label="公司分类">
          <Input v-model="companyInfo.preference" style="width: 340px" disabled/>
        </FormItem>
        <FormItem label="信息备注">
          <Input v-model="companyInfo.remark" style="width: 340px" disabled/>
        </FormItem>
        <FormItem label="自动打卡">
          <Input v-model="companyInfo.workRemind" style="width: 340px" disabled/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
  import { companyChangeClass, companyFindAll, industryGetAll } from '@/api/data'

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
        industryMain: '',
        industry: '',
        industryList: [],
        industryMainList: [],
        industryDetailList: [],
        model12: '',
        modal1: false,
        findAllParan: {
          pageNum: 1,
          pageSize: 10,
          name: null,
          startTime: null,
          endTime: null,
          industry: null
        },
        companyList: [],
        companyCount: 0,
        companyInfo: {},
        columns12: [
          {
            title: '公司编码',
            key: 'companyCode',
            width: 100,
          }, {
            title: '公司名称',
            key: 'companyName'
          }, {
            title: '创建时间',
            key: 'createTime',
            width: 150
          }, {
            title: '员工数',
            key: 'employNum',
            width: 80,
          }, {
            title: '行业信息',
            key: 'industryName'
          }, {
            title: '创建人姓名',
            key: 'adminName',
            width: 100
          }, {
            title: '创建人手机',
            key: 'adminPhone',
            width: 120,
          }, {
            title: 'action',
            slot: 'action',
            width: 150,
            align: 'center'
          }
        ],
      }
    },
    created () {
      this.findAll()
      this.loadIndustryInfo()
    },
    methods: {
      dateChange (res) {
        this.findAllParan.startTime = res[0]
        this.findAllParan.endTime = res[1]
        this.findAll()
      },
      changeIndustry () {
        const formData = new FormData()
        formData.append('companyId', this.companyInfo.companyId)
        formData.append('classId', this.industry)
        companyChangeClass(formData).then(res => {
          if (res.data.success === true) {
            this.findAll()
          }
        })
      },
      industrydetailChangeQuery (res) {
        if (res === undefined) {
          this.industryMain = ''
        }
        this.findAllParan.industry = res
        this.findAll()
      },
      industrydetailChange (res) {
        this.industry = res
      },
      industryMainChange (res) {
        this.industryDetailList = []
        this.industryList.forEach(i => {
          if (i.id === res) {
            i.list.forEach(detail => {
              this.industryDetailList.push({
                value: detail.id,
                label: detail.name
              })
            })
          }
        })
      },

      // 获取行业信息
      loadIndustryInfo () {
        if (localStorage.getItem('industryGetAll') == null) {
          industryGetAll().then(res => {
            this.industryList = res.data.data
            localStorage.setItem('industryGetAll', JSON.stringify(res.data.data))
          })
        } else {
          this.industryList = JSON.parse(localStorage.getItem('industryGetAll'))
        }

        this.industryList.forEach(i => {
          this.industryMainList.push({
            value: i.id,
            label: i.name
          })
        })
      },
      showInfo (res) {
        this.modal1 = true
        this.companyInfo = res
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
        companyFindAll(this.findAllParan).then(res => {
          if (res.data.success === true) {
            this.companyList = res.data.data
            this.companyCount = res.data.count
          }
        })
      }
    },
  }

</script>
<style>
</style>
