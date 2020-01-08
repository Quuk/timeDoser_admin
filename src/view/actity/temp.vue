<template>
  <div>
    <Card style="border: 1px #a0a0a0 solid;margin: 20px 0">
      <div ref="attendData" style="width: auto;height:200px;margin-top:20px;"></div>
    </Card>
  </div>
</template>

<script>
    import echarts from 'echarts'
    import {off, on} from '@/libs/tools'


    export default {
        name: 'home',
        data() {
            return {
                buttonType: 0, // 0:打卡统计 1:注册统计 2:汇报统计 3: 企业统计
                attendData: null,
            }
        },
        created() {
            this.drawLine();
        },
        beforeDestroy() {
            off(window, 'resize', this.resize)
        },
        methods: {
            changeButtonType(type) {
                this.buttonType = type;
                this.drawLine(type)
            },
            drawLine() {
                const xAxisData = [];
                const data1 = [];
                for (let i = 0; i < 50; i++) {
                    xAxisData.push('类目' + i);
                    data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
                }
                const option = {
                        legend: {
                            data: ['员工数', 'bar2'],
                            align: 'left'
                        },
                        toolbox: {
                            feature: {
                                magicType: {
                                    type: ['stack', 'tiled']
                                },
                                dataView: {},
                                saveAsImage: {
                                    pixelRatio: 2
                                }
                            }
                        },
                        xAxis: {
                            data: xAxisData,
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
                            data: data1,
                            animationDelay: function (idx) {
                                return idx * 10;
                            }
                        }],
                        animationEasing: 'elasticOut',
                    };

                this.$nextTick(() => {
                    this.attendData = echarts.init(this.$refs.attendData);
                    this.attendData.setOption(option);
                    on(window, 'resize', this.resize);
                })
            },
            resize() {
                this.attendData.resize()
            },
        }
    }
</script>

<style lang="less">
  .count-style {
    font-size: 30px;
  }
</style>
