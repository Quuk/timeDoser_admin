<template>
  <div>
    <h1 style="margin-bottom: 14px">所有的商品</h1>

    <div style="margin:20px">
      1. 修改任意数据都会留下操作记录,且会直接影响线上用户,操作前请三思<br/>
      2. 商品只可修改,不可新增/删除,活动前后可以在这里直接修改价格,如需更多操作请联系管理员 <a href="tcyeee@outlook.com" target="_blank">tcyeee@outlook.com</a>
    </div>

    <!-- 所有的商品信息 -->
    <Table border :columns="columns" :data="businessList">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看详情</Button>
      </template>
    </Table>

    <Modal style="display: flex; flex-direction: row;"
           v-model="modal2" title="编辑商品" @on-ok="confirm">
      <Form :model="formItem" :label-width="110">
        <FormItem label="icon">
          <Avatar :src="business.icon" size="large" shape="square"/>
          <a :href="business.url" style="margin-left: 30px" target="_Blank">点击查看详情页面</a>
        </FormItem>
        <FormItem label="商品名称">
          <Input v-model="business.name"/>
        </FormItem>
        <FormItem label="商品副标题">
          <Input v-model="business.nameRemark"/>
        </FormItem>
        <FormItem label="现价">
          <InputNumber :min="0" :step="100" v-model="business.price"/>
          <span style="margin-left: 20px">{{business.priceRemark}}</span>
        </FormItem>
        <FormItem label="原价">
          <InputNumber :min="0" :step="100" v-model="business.preDiscountPrice"/>
          <span style="margin-left: 20px">{{business.priceRemark}}</span>
        </FormItem>
        <FormItem label="买断价">
          <InputNumber :min="0" :step="100" v-model="business.perpetualPrice"/>
          <span style="margin-left: 20px">/买断</span>
        </FormItem>
        <FormItem label="买断原价">
          <InputNumber :min="0" :step="100" v-model="business.perpetualPreDiscountPrice"/>
          <span style="margin-left: 20px">/买断</span>
        </FormItem>
        <FormItem label="是否可用">
          <i-switch v-model="business.type" size="large" :true-value="1" :false-value="0">
            <span slot="open">可用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
        <FormItem label="备注信息">
          <Input v-model="business.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}"/>
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>

<script>
  import Tables from '_c/tables'
  import { getAllBusiness, updateBusiness } from '@/api/data'

  export default {
    name: 'business',
    components: { Tables },
    data () {
      return {
        formItem: {
          input: '',
          select: '',
          radio: 'male',
          checkbox: [],
          switch: true,
          date: '',
          time: '',
          slider: [20, 50],
          textarea: ''
        },
        modal2: false,
        columns: [
          { title: '商品ID', key: 'id', width: 90 },
          { title: '商品名称', key: 'name' },
          { title: '商品备注', key: 'nameRemark' },
          { title: '年价[现价]', key: 'price', width: 100 },
          { title: '年价[原价]', key: 'preDiscountPrice', width: 100 },
          { title: '买断[现价]', key: 'perpetualPrice', width: 100 },
          { title: '买断[原价]', key: 'perpetualPreDiscountPrice', width: 100 },
          {
            title: 'Action',
            slot: 'action',
            width: 100,
            align: 'center'
          }
        ],
        businessList: [],
        business: {},
      }
    },
    methods: {
      getAllBusiness () {
        if (localStorage.getItem('allBusiness') == null) {
          getAllBusiness().then(res => {
            if (res.data.success === true) {
              this.businessList = res.data.data
              localStorage.setItem('allBusiness', JSON.stringify(res.data.data))
            }
          })
        } else {
          this.businessList = JSON.parse(localStorage.getItem('allBusiness'))
        }
      },
      show (index) {
        this.business = this.businessList[index]
        this.modal2 = true
      },
      confirm () {
        this.$Modal.confirm({
          title: '危险操作警告',
          content: '修改商品信息会影响到线上所有用户,是否继续?',
          onOk: () => {
            this.update()
          },
        })
      },
      update () {
        updateBusiness(this.business).then(() => {
          this.success(this.business)
          localStorage.removeItem('allBusiness')
          this.getAllBusiness()
        })
      },
      success (nodesc) {
        this.$Notice.success({
          title: nodesc.name + ' 商品属性修改成功!',
        })
      },
    },
    mounted () {
      this.getAllBusiness()
    }
  }
</script>

<style>

</style>
