<template>
  <div style="display: flex;margin: 20px">
    <div style="margin: 20px">
      <Card style="width: 400px;border: 1px #818181 solid">
        <p slot="title">
          <Icon type="md-construct" style="margin-right: 5px"/>
          ios包审核状态
        </p>
        <i-Switch slot="extra" v-model="status" @on-change="updateIosStatus">
          <Icon type="md-checkmark" slot="open"></Icon>
          <Icon type="md-close" slot="close"></Icon>
        </i-Switch>
        <div>1.修改ios的线上包审核状态</div>
        <div>-打开: 线上包在App Store处于审核阶段</div>
        <div>-关闭: 线上包审核结束</div>
      </Card>
    </div>
  </div>
</template>
<script>
    import {findCheckIOSStatus, updateIosCheckStatus} from '@/api/data'

    export default {
        name: 'controller',
        data() {
            return {
                status: false
            }
        },
        methods: {
            checkIOS() {
                findCheckIOSStatus().then(res => {
                    if (res.data.success === true) {
                        this.status = res.data.data.list
                    }
                })
            },
            updateIosStatus() {
                updateIosCheckStatus(this.status).then(res => {
                    if (res.data.success === true) {
                        this.checkIOS()
                    }
                })
            }
        },
        created() {
            this.checkIOS()
        }
    }
</script>

<style>
</style>
