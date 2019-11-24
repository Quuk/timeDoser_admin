<template>
  <div>
    <h1 style="margin-bottom: 14px">运营数据</h1>
    <div style="margin:30px 20px;font-size: 12px">
      1. 运营相关数据，目前统计的是日周月报、项目相关、客户相关功能的用户使用情况(默认查询本周数据)<br/>
      2. 如需提供更多操作请联系管理员
    </div>
    <!-- 查询条件选取模块 -->
    <div style="display: flex;justify-content: space-between;margin: 20px">
      <div style="display: flex;">
        <ButtonGroup>
          <Button :type="operationQuery.type===1?'primary':'default'" @click="changeType(1)">日周月报</Button>
          <Button :type="operationQuery.type===2?'primary':'default'" @click="changeType(2)">客户相关</Button>
          <Button :type="operationQuery.type===3?'primary':'default'" @click="changeType(3)">项目相关</Button>
        </ButtonGroup>
        <Row style="margin-left:15px">
          <Col span="10">
            <DatePicker style="width: 200px" type="daterange" placement="bottom-end" placeholder="选择查询日期范围"
                        :value="defaultValue" format="yyyy-MM-dd" @on-change="selectDate"></DatePicker>
          </Col>
        </Row>
      </div>
      <div>
        <Button icon="md-download" @click="downExcl" type="primary">导出excl</Button>
      </div>
    </div>

    <!-- 日周月报相关 -->
    <div v-if="operationQuery.type===1" style="display: flex;width: auto">
      <div style="width: 350px;margin-left: 10px">
        <h3>日报统计数据</h3>
        <Table border :columns="columns" :data="dayRepList">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看详情</Button>
          </template>
        </Table>
      </div>
      <div style="width: 350px;margin-left: 10px">
        <h3>周报统计数据</h3>
        <Table border :columns="columns" :data="weekRepList">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看详情</Button>
          </template>
        </Table>
      </div>
      <div style="width: 350px;margin-left: 10px">
        <h3>月报统计数据</h3>
        <Table border :columns="columns" :data="monthRepList">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看详情</Button>
          </template>
        </Table>
      </div>
    </div>

    <!-- 客户模块汇报相关 -->
    <div v-if="operationQuery.type===2" style="display: flex;width: auto">
      <div style="width: 350px;margin-left: 10px">
        <h3>用户拓客数据统计</h3>
        <Table border :columns="newCusColumns" :data="newCusList">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看详情</Button>
          </template>
        </Table>
      </div>
      <div style="width: 350px;margin-left: 10px">
        <h3>客户跟进汇报统计</h3>
        <Table border :columns="columns" :data="cusVisitList">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看详情</Button>
          </template>
        </Table>
      </div>
      <div style="width: 350px;margin-left: 10px">
        <h3>客户成单汇报统计</h3>
        <Table border :columns="columns" :data="cusSaleList">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看详情</Button>
          </template>
        </Table>
      </div>
    </div>
    <div v-if="operationQuery.type===2" style="display: flex;width: auto;margin-top: 30px">
      <div style="display: flex">
        <div style="width: 350px;margin-left: 10px">
          <h3>客户外勤汇报统计</h3>
          <Table border :columns="columns" :data="cusOutList">
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看详情</Button>
            </template>
          </Table>
        </div>
        <div style="width: 350px;margin-left: 10px">
          <h3>事务预约统计</h3>
          <Table border :columns="columns" :data="appointmentList">
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看详情</Button>
            </template>
          </Table>
        </div>
      </div>
    </div>

    <!-- 项目模块汇报相关 -->
    <div v-if="operationQuery.type===3" style="display: flex;width: auto">
      <div style="width: 350px;margin-left: 10px">
        <h3>用户新建项目数据统计</h3>
        <Table border :columns="newProjectColumns" :data="newProjectList">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看详情</Button>
          </template>
        </Table>
      </div>
      <div style="width: 350px;margin-left: 10px">
        <h3>项目跟进汇报统计</h3>
        <Table border :columns="columns" :data="projectFollowList">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看详情</Button>
          </template>
        </Table>
      </div>
      <div style="width: 350px;margin-left: 10px">
        <h3>项目外勤汇报统计</h3>
        <Table border :columns="columns" :data="projectOutList">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看详情</Button>
          </template>
        </Table>
      </div>
    </div>
    <div v-if="operationQuery.type===3" style="display: flex;width: auto;margin-top: 30px">
      <div style="width: 350px;margin-left: 10px">
        <h3>工作任务数量统计</h3>
        <Table border :columns="columns" :data="projectTaskList">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看详情</Button>
          </template>
        </Table>
      </div>
    </div>

  </div>
</template>

<script>
    import {exportRepCountList, getRepStatistics} from '@/api/data'

    export default {
  name: 'operationData',
  data () {
    return {
      status: true,
      operationQuery: {
        startTime: new Date(),
        endTime: new Date(),
        type: 1
      },
      dayRepList: [],
      monthRepList: [],
      weekRepList: [],

      newCusList: [],
      cusVisitList: [],
      cusSaleList: [],
      cusOutList: [],
      appointmentList: [],

      newProjectList: [],
      projectFollowList: [],
      projectOutList: [],
      projectTaskList: [],

      defaultValue: ['', ''],
      operationVO: {
        startDate: '',
        endDate: '',
        type: 1
      },
      columns: [
        { title: '汇报时间', key: 'date' },
        { title: '汇报数量', key: 'repCount' },
        { title: '汇报人数', key: 'userCount' }
      ],
      newCusColumns: [
        { title: '统计时间', key: 'date' },
        { title: '拓客总数', key: 'repCount' },
        { title: '使用拓客功能公司数', key: 'userCount' }
      ],
      newProjectColumns: [
        { title: '统计时间', key: 'date' },
        { title: '新建项目数', key: 'repCount' },
        { title: '新建项目公司数', key: 'userCount' }
      ]
    }
  },
  methods: {
    changeType (type) {
      this.operationQuery.type = type
      this.getReportStatisticsData()
    },
    getReportStatisticsData () {
      getRepStatistics(this.operationQuery).then(res => {
        if (res.data.success === true) {
          if (this.operationQuery.type === 1) {
            this.dayRepList = res.data.data.dayRepList
            this.weekRepList = res.data.data.weekRepList
            this.monthRepList = res.data.data.monthRepList
          } else if (this.operationQuery.type === 2) {
            this.newCusList = res.data.data.newCusList
            this.cusSaleList = res.data.data.cusSaleList
            this.cusVisitList = res.data.data.cusVisitList
            this.cusOutList = res.data.data.cusOutList
            this.appointmentList = res.data.data.appointmentList
          } else if (this.operationQuery.type === 3) {
            this.newProjectList = res.data.data.newProjectList
            this.projectFollowList = res.data.data.projectFollowList
            this.projectOutList = res.data.data.projectOutList
            this.projectTaskList = res.data.data.projectTaskList
          } else {
            window.alert('查询失败,为选择正确的查询分类')
          }
        } else {
          window.alert('查询失败,请联系管理员')
        }
      })
    },
    getDayOfWeek () {
      const date = new Date()
      const today = date.getDay()
      let stepSunDay = -today + 1
      if (today === 0) {
        stepSunDay = -7
      }
      const stepMonday = 7 - today
      const time = date.getTime()
      const monday = new Date(time + stepSunDay * 24 * 3600 * 1000)
      const sunday = new Date(time + stepMonday * 24 * 3600 * 1000)
      this.operationQuery.startTime = monday// 本周一的日期 （起始日期）
      this.operationQuery.endTime = sunday// 本周日的日期 （结束日期）
      this.defaultValue = [monday, sunday]
    },
    selectDate (dateValue) {
      if (dateValue[0] !== '' && dateValue[1] !== '') {
        this.operationQuery.startTime = dateValue[0]
        this.operationQuery.endTime = dateValue[1]
      } else {
        this.getDayOfWeek()
      }
      this.getReportStatisticsData()
    },
    downExcl () {
      this.operationVO.startDate = this.operationQuery.startTime
      this.operationVO.endDate = this.operationQuery.endTime
      this.operationVO.type = this.operationQuery.type
      exportRepCountList(this.operationVO).then(res => {
        if (res.status === 200) {
          const content = res.data
          const blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=UTF-8' })
          const a = document.createElement('a')
          const href = window.URL.createObjectURL(blob)
          a.href = href
          console.log(res.headers)
          a.download = decodeURIComponent('operation_statistics')
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          window.URL.revokeObjectURL(href)
        } else {
          window.alert('导出文件出错了,请联系管理员')
        }
      })
    }
  },
  created () {
    this.getDayOfWeek()
    this.getReportStatisticsData()
  }
}
</script>
