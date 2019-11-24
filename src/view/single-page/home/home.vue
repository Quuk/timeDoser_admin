<template>
  <div>
    <Row :gutter="15">
      <i-col :xs="12" :md="8" :lg="6" v-for="(infor, i) in inforCardData" :key="`infor-${i}`"
             style="height: 90px;">
        <infor-card :color="infor.color" :icon="infor.icon" :icon-size="28" style="border: 1px #dfdfdf solid;">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Card style="border: 1px gray solid;width: auto;margin-top: 20px">
      <div style="display: flex;justify-content: space-between;margin-right: 15px">
        <div style="display: flex;align-items: flex-end">
          <h2 style="margin-left: 10px;font-family:'Microsoft YaHei',Arial,sans-serif">数据曲线</h2>
          <span style="margin-left: 6px">展现各方位数据变化</span>
        </div>
        <ButtonGroup>
          <Button :type="buttonType===0?'primary':'default'" @click="changeButtonType(0)">
            <Icon type="md-locate"/>
            用户打卡
          </Button>
          <Button :type="buttonType===1?'primary':'default'" @click="changeButtonType(1)">
            <Icon type="md-person-add"/>
            用户注册
          </Button>
          <Button :type="buttonType===2?'primary':'default'" @click="changeButtonType(2)">
            <Icon type="md-share"/>
            发出汇报
          </Button>
          <Button :type="buttonType===3?'primary':'default'" @click="changeButtonType(3)">
            <Icon type="md-map"/>
            注册企业
          </Button>
        </ButtonGroup>
      </div>
      <div style="width: 400px">
        <Divider style="margin: 0;"/>
      </div>
      <div ref="attendData" style="width: auto;height:200px;margin-top:20px;"></div>
    </Card>
    <Card style="border: 1px gray solid;width: auto;margin-top: 20px">
      <div style="display: flex;justify-content: space-between;margin-right: 15px">
        <div style="display: flex;align-items: flex-end">
          <h2 style="margin-left: 10px;font-family:'Microsoft YaHei',Arial,sans-serif">行业从属</h2>
          <span style="margin-left: 6px">统计新增公司行业,锁定目标客户</span>
        </div>
        <ButtonGroup>
          <Button :type="buttonType2===0?'primary':'default'" @click="changeButtonType2(0)">
            <Icon type="md-barcode"/>
            全部
          </Button>
          <Button :type="buttonType2===1?'primary':'default'" @click="changeButtonType2(1)">
            <Icon type="md-barcode"/>
            月数据
          </Button>
          <Button :type="buttonType2===2?'primary':'default'" @click="changeButtonType2(2)">
            <Icon type="md-barcode"/>
            季数据
          </Button>
        </ButtonGroup>
      </div>
      <div style="width: 400px">
        <Divider style="margin: 0;"/>
      </div>
      <div style="position: relative;height:200px;width:100%;margin-top:20px">
        <div ref="companyIndusty" style="height:200px;width:100%"/>
        <div style="position: absolute;width: 300px;height: 200px;right: 0;top: 0;margin-top: 20px">
          <h2 style="font-size: 17px;font-style:italic;margin-bottom: 10px">行业TOP</h2>
          <div style="margin: 2px 20px;" v-for="(item,index) in industryTop"> {{index+1}}. {{item.date}}</div>
        </div>
      </div>
    </Card>
    <Card style="border: 1px gray solid;width: auto;margin-top: 20px">
      <div style="display: flex;justify-content: space-between;margin-right: 15px">
        <div style="display: flex;align-items: flex-end">
          <h2 style="margin-left: 10px;font-family:'Microsoft YaHei',Arial,sans-serif">用户画像</h2>
          <span style="margin-left: 6px">现阶段留存用户分析</span>
        </div>
        <ButtonGroup>
          <Button :type="buttonType3===0?'primary':'default'" @click="changeButtonType3(0)">
            <Icon type="md-barcode"/>
            月度
          </Button>
          <Button :type="buttonType3===1?'primary':'default'" @click="changeButtonType3(1)">
            <Icon type="md-barcode"/>
            季度
          </Button>
        </ButtonGroup>
      </div>
      <div style="width: 400px">
        <Divider style="margin: 0;"/>
      </div>
      <div ref="employeeCount" style="width: auto;height:200px;margin-top:20px;"></div>
    </Card>
  </div>
</template>

<script>
    import InforCard from '_c/info-card'
    import CountTo from '_c/count-to'
    import {attendDisplay, companyCreateTimeCount, companyIndustry, getIndexData} from '@/api/data'
    import echarts from 'echarts'
    import {off, on} from '@/libs/tools'

    export default {
        name: 'home',
        components: {InforCard, CountTo},
        data() {
            return {
                buttonType: 0, // 0:打卡统计 1:注册统计 2:汇报统计 3: 企业统计
                buttonType2: 0, // 0:周数据 1:月数据 2:季数据
                buttonType3: 0, // 0:月数据 2:季数据
                attendData: null,
                companyIndusty: null,
                employeeCount: null,
                industryTop: [],
                dateList: [],
                countList: [],
                inforCardData: [
                    {title: '昨日打卡统计', icon: 'md-locate', count: 0, color: '#2d8cf0'},
                    {title: '昨日注册统计', icon: 'md-person-add', count: 0, color: '#19be6b'},
                    {title: '昨日汇报统计', icon: 'md-share', count: 0, color: '#ff9900'},
                    {title: '昨日新增企业', icon: 'md-map', count: 0, color: '#ed3f14'},
                ],
            }
        },
        created() {
            this.loadIndexData();
            this.drawLine(0);
            this.companyIndustyDisplay(0);
            this.companyEmployeeCount(0);
        },
        beforeDestroy() {
            off(window, 'resize', this.resize)
        },
        methods: {
            companyEmployeeCount(type) {
                const date = [];
                const count = [];

                companyCreateTimeCount(type).then(res => {
                    res.data.data.forEach(i=>{
                        date.push(i.date)
                        count.push(i.count)
                    })

                    const option = {
                        tooltip: {},
                        xAxis: {
                            data: date,
                            silent: false,
                            splitLine: {
                                show: false
                            }
                        },
                        grid: {
                            top: '20%',
                            left: '0%',
                            right: '0%',
                            bottom: '3%',
                            containLabel: true
                        },
                        yAxis: {},
                        series: [{
                            name: '员工数',
                            type: 'bar',
                            data: count,
                            animationDelay: function (idx) {
                                return idx * 10;
                            }
                        }],
                        animationEasing: 'elasticOut',
                    };

                    this.$nextTick(() => {
                        this.employeeCount = echarts.init(this.$refs.employeeCount);
                        this.employeeCount.setOption(option);
                        on(window, 'resize', this.resize);
                    })
                })
            },
            companyIndustyDisplay(type) {
                this.industryTop = [];
                companyIndustry(type).then(res => {
                    let names = [];
                    let dataList = [];
                    if (res.data.success === true) {
                        res.data.data.forEach(i => {
                            let name = i.date.replace(/[\r\n]/g, "");
                            names.push(name);
                            dataList.push({value: i.count, name: name})
                        })

                        // 截取TOP
                        this.industryTop.push(res.data.data[0])
                        this.industryTop.push(res.data.data[1])
                        this.industryTop.push(res.data.data[2])
                        this.industryTop.push(res.data.data[3])
                        this.industryTop.push(res.data.data[4])
                    }

                    const option = {
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b}: {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            x: 'left',
                            data: names,
                        },
                        series: [
                            {
                                name: '所属行业',
                                type: 'pie',
                                radius: ['60%', '90%'],
                                avoidLabelOverlap: true,
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center',
                                    },
                                    emphasis: {
                                        show: true,
                                        textStyle: {
                                            fontSize: '20',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: true
                                    }
                                },
                                data: dataList
                            }
                        ]
                    };
                    this.$nextTick(() => {
                        this.companyIndusty = echarts.init(this.$refs.companyIndusty);
                        this.companyIndusty.setOption(option);
                        on(window, 'resize', this.resize);
                    })
                })
            },
            // 打卡曲线 刷新
            changeButtonType(type) {
                this.buttonType = type;
                this.drawLine(type)
            },
            // 行业从属 刷新
            changeButtonType2(type) {
                this.buttonType2 = type;
                this.companyIndustyDisplay(type);
            },
            // 用户画像 刷新
            changeButtonType3(type) {
                this.buttonType3 = type;
            },
            drawLine(type) {
                this.dateList = [];
                this.countList = [];

                attendDisplay(type).then(res => {
                    res.data.data.forEach(i => {
                        this.countList.push(i.count);
                        this.dateList.push(i.date)
                    });
                    const option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                            }
                        },
                        grid: {
                            top: '3%',
                            left: '1.2%',
                            right: '1%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: 'category',
                                boundaryGap: false,
                                data: this.dateList
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: '统计',
                                type: 'line',
                                stack: '总量',
                                data: this.countList
                            }
                        ]
                    };
                    this.$nextTick(() => {
                        this.attendData = echarts.init(this.$refs.attendData);
                        this.attendData.setOption(option);
                        on(window, 'resize', this.resize);
                    })
                })
            },
            resize() {
                this.attendData.resize()
                this.companyIndusty.resize()
                this.employeeCount.resize()
            },
            loadIndexData() {
                getIndexData().then(res => {
                    if (res.data.success === true) {
                        this.inforCardData = [
                            {
                                title: '昨日打卡统计',
                                icon: 'md-locate',
                                count: res.data.data.attendanceCount,
                                color: '#2d8cf0'
                            },
                            {
                                title: '昨日注册统计',
                                icon: 'md-person-add',
                                count: res.data.data.registerCount,
                                color: '#19be6b'
                            },
                            {title: '昨日汇报统计', icon: 'md-share', count: res.data.data.reportCount, color: '#ff9900'},
                            {title: '昨日新增企业', icon: 'md-map', count: res.data.data.companyCount, color: '#ed3f14'}
                        ]
                    }
                })
            }
        }
    }
</script>

<style lang="less">
  .count-style {
    font-size: 30px;
  }
</style>
