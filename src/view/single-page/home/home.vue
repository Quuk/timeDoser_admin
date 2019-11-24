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
      <div  style="width: auto;height:200px;margin-top:20px;"></div>
    </Card>
  </div>
</template>

<script>
    import InforCard from '_c/info-card'
    import CountTo from '_c/count-to'

    export default {
        name: 'home',
        components: {InforCard, CountTo},
        data() {
            return {
                buttonType: 0, // 0:打卡统计 1:注册统计 2:汇报统计 3: 企业统计
                inforCardData: [
                    {title: '昨日打卡统计', icon: 'md-locate', count: 0, color: '#2d8cf0'},
                    {title: '昨日注册统计', icon: 'md-person-add', count: 0, color: '#19be6b'},
                    {title: '昨日汇报统计', icon: 'md-share', count: 0, color: '#ff9900'},
                    {title: '昨日新增企业', icon: 'md-map', count: 0, color: '#ed3f14'},
                ],
            }
        },
        created() {
        },
        methods: {
        }
    }
</script>

<style lang="less">
  .count-style {
    font-size: 30px;
  }
</style>
