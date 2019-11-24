<template>
  <div>
    <h1 style="margin-bottom: 14px;">现有的优惠券</h1>

    <div style="margin:20px">
      1. 修改任意数据都会留下操作记录,且会直接影响线上用户,操作前请三思<br/>
      2. 优惠券只可添加/修改,不可删除,如果需要删除请联系管理员 <a href="tcyeee@outlook.com" target="_blank">tcyeee@outlook.com</a><br/>
      3. 优惠券如果不设置范围,系统则默认所有功能可用<br/>
      4. 优惠券如果超过使用期限则无法领取,无法使用,设置请按照运营情况填写
    </div>
    <!-- 现有的优惠券 -->
    <div style="display: flex;justify-content: space-between">
      <div></div>
      <Button type="primary" @click="addOne" style="margin-bottom: 15px">添加新的优惠券</Button>
    </div>
    <Table border :columns="columns" :data="couponsList">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看详情</Button>
      </template>
    </Table>

    <!-- 添加弹窗 -->
    <Modal style="display: flex; flex-direction: row;"
           v-model="modal1"
           title="编辑优惠券"
           @on-ok="update">
      <Form :model="formItem" :label-width="110">
        <FormItem label="优惠券名称">
          <Input v-model="coupons.name"/>
        </FormItem>
        <FormItem label="商品价格满足">
          <InputNumber :min="0" :step="100" v-model="coupons.meetPrice"/>&nbsp;&nbsp;元时可减免&nbsp;&nbsp;<InputNumber
          :min="0" :step="100" v-model="coupons.discountsPrice"/>&nbsp;元
        </FormItem>
        <FormItem label="截止时间">
          <DatePicker type="datetime" v-model="coupons.endDate" style="width: 200px"/>
        </FormItem>
        <FormItem label="是否可用">
          <i-switch v-model="coupons.canUse" size="large">
            <span slot="open">可用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
        <FormItem label="备注信息">
          <Input v-model="coupons.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"/>
        </FormItem>
        <FormItem label="优惠券范围">
          <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
            <Checkbox
              :indeterminate="indeterminate"
              :value="checkAll"
              @click.prevent.native="handleCheckAll">全选
            </Checkbox>
          </div>
          <CheckboxGroup v-model="businessIds" @on-change="checkAllGroupChange">
            <Checkbox v-for="item in businessList" :label="' [ '+item.id +' ] '+ item.businessTitle"
                      :value="item.id"></Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
    import Tables from '_c/tables'
    import {getAllBusiness, getAllCoupones, updateCoupones} from '@/api/data'

    export default {
        name: 'coupons',
        components: {Tables},
        data() {
            return {
                indeterminate: true,
                checkAll: false,
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
                modal1: false,
                columns: [
                    {title: '优惠券ID', key: 'id', width: 90},
                    {title: '优惠券名称', key: 'name'},
                    {title: '备注', key: 'remark'},
                    {title: '是否可用', key: 'type', width: 100},
                    {
                        title: 'Action',
                        slot: 'action',
                        width: 250,
                        align: 'center'
                    }
                ],
                couponsList: [],
                coupons: {},
                businessList: [],
                businessIds: [],
                businessAllIds: [],
            }
        },
        mounted() {
            this.getAllCoupones();
            this.getAllBusiness();
        },
        methods: {
            getAllCoupones() {
                if(localStorage.getItem('allCoupones')==null){
                    getAllCoupones().then(res => {
                        if (res.data.success === true) {
                            this.couponsList = res.data.data;
                            localStorage.setItem('allCoupones', JSON.stringify(res.data.data))
                        }
                    })
                } else {
                    this.couponsList = JSON.parse(localStorage.getItem('allCoupones'))
                }
            },
            update() {
                let scope = [];
                this.businessIds.forEach(i => {
                    scope.push({
                        id: parseInt(i.slice(2, 6))
                    })
                });
                let coupons = this.coupons;
                coupons.scope = scope;
                updateCoupones(coupons).then(() => {
                    this.success(this.coupons);
                    localStorage.removeItem('allCoupones')
                    this.getAllCoupones();
                });
            },
            show(index) {
                this.businessIds = [];
                this.coupons = this.couponsList[index];
                this.coupons.scope.forEach(i => {
                    this.businessIds.push(' [ ' + i.id + ' ] ' + i.businessTitle);
                });
                this.modal1 = true;
            },
            addOne() {
                this.businessIds = [];
                this.coupons = {};
                this.modal1 = true
            },
            confirm() {
                this.$Modal.confirm({
                    title: '危险操作警告',
                    content: '修改优惠券会影响到线上已经领取的用户,是否继续?',
                    onOk: () => {
                        this.update();
                    },
                });
            },
            success(nodesc) {
                this.$Notice.success({
                    title: nodesc.name + ' 优惠券属性修改成功!',
                });
            },
            handleCheckAll() {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                if (this.checkAll) {
                    this.businessIds = this.businessAllIds;
                } else {
                    this.businessIds = [];
                }
            },
            // 检查多选更新
            checkAllGroupChange(data) {
                if (data.length === this.businessList.length) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
            },
            getAllBusiness() {
                getAllBusiness().then(res => {
                    if (res.data.success === true) {
                        this.businessList = res.data.data;
                        res.data.data.forEach(i => {
                            this.businessAllIds.push(' [ ' + i.id + ' ] ' + i.businessTitle);
                        });
                    }
                });
            },
        },
    }
</script>
<style>
</style>
