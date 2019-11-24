<template>
  <div style="display: flex; align-items: center; justify-content: center; margin-top: 50px;flex-direction: column;">

    <h1 style="margin-right: 50px">修改公司信息</h1>
    <div style="margin: 10px 50px 0 0;color: grey">查找修改公司优惠券/商品/项目数量等各方面属性</div>

    <!-- 搜索框 -->
    <Input search enter-button placeholder="请输入公司编码或者名称..." style="margin: 70px 70px 0 70px;width:800px"
           size="large" @on-search="search"/>

    <!-- 提示框 -->
    <List v-if="searchComanyList.length > 0" :header="searchComanyTip" border style="width: 800px">
      <ListItem v-for="item in searchComanyList">
        <Icon type="md-contacts" style="margin-right: 14px"/>
        <div @click="findOne(item.companyId)" style="width: 100%;">{{item.companyName}}</div>
      </ListItem>
    </List>

    <!-- 结果框 -->
    <Card style="width:700px;margin-top: 70px"
          v-if="companyInfo.companyId !== undefined && searchComanyList.length ===0">
      <div style="display: flex; align-items: center; justify-content: center;margin: 50px;flex-direction: column;">
        <h2>{{companyInfo.companyName}}</h2>
        <h4>{{companyInfo.companyCode}}</h4>
      </div>

      <!-- 领取的优惠券信息 -->
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <h3 style="margin: 10px">领取的优惠券信息</h3>
        <Button type="primary" shape="circle" icon="md-add" style="margin-right: 10px" @click="queryAddlink"/>
      </div>
      <div style="margin:0 20px;font-size: 12px">
        1. 优惠券可以领取和放弃,如果需要修改优惠券信息请在优惠券页面操作
      </div>
      <div>
        <Table border :columns="columns4" :data="couponsMapUser">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="error" size="small" @click="deleteQuery(index)">删除</Button>
          </template>
        </Table>
      </div>

      <!-- 购买的商品信息 -->
      <div style="display: flex; align-items: center; justify-content: space-between;margin-top: 30px">
        <h3 style="margin: 10px">购买的商品信息</h3>
        <Button type="primary" shape="circle" icon="md-add" style="margin-right: 10px" @click="buyBusiness"/>
      </div>
      <div style="margin:0 20px;font-size: 12px">
        1. 修改任意数据都会留下操作记录,且会直接影响线上用户,操作前请三思<br/>
        2. 商品只可添加,不可删除或修改,如果需要删除请联系管理员 <a href="tcyeee@outlook.com" target="_blank">tcyeee@outlook.com</a>
      </div>
      <div>
        <Table border :columns="columns3" :data="bussinessMapUser">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
        </Table>
      </div>

      <!-- 客户及项目容量 -->
      <div style="display: flex; align-items: center; justify-content: space-between;margin-top: 30px">
        <h3 style="margin: 10px">客户及项目容量</h3>
      </div>
      <div style="margin:0 20px;font-size: 12px">
        1. 修改任意数据都会留下操作记录,且会直接影响线上用户,操作前请三思<br/>
        2. 客户或者项目数量不可以设置为无限,如果客户要求设置无上限,可以将数量设置为99999999<br/>
        3. 如需更多操作请联系管理员 <a href="tcyeee@outlook.com" target="_blank">tcyeee@outlook.com</a>
      </div>
      <div>
        <Table border :columns="columns2" :data="companyCountInfo">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="info" size="small" @click="modal5=true">修改</Button>
          </template>
        </Table>
      </div>
    </Card>

    <!-- 添加优惠券弹窗 -->
    <Modal style="display: flex; flex-direction: row;"
           v-model="modal2" title="添加优惠券" @on-ok="addLink">
      <Form :model="formItem" :label-width="110">
        <FormItem label="公司名称">
          <Input v-model="companyInfo.companyName" disabled/>
        </FormItem>
        <FormItem label="优惠券名称">
          <Select v-model="model3" style="width:200px">
            <Option v-for="item in couponsList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>

    <!-- 手动修改容量弹窗 -->
    <Modal style="display: flex; flex-direction: row;" v-model="modal5" title="手动修改容量" @on-ok="configProjectNum">
      <Form :model="formItem" :label-width="110">
        <FormItem label="公司名称">
          <Input v-model="companyInfo.companyName" disabled style="width:300px"/>
        </FormItem>
        <FormItem label="客户容量">
          <InputNumber :min="1" :step="1" v-model="companyInfo.customCount"></InputNumber>
        </FormItem>
        <FormItem label="项目容量">
          <InputNumber :min="1" :step="1" v-model="companyInfo.projectCount"></InputNumber>
        </FormItem>
      </Form>
    </Modal>

    <!-- 手动购买商品弹窗 -->
    <Modal style="display: flex; flex-direction: row;"
           v-model="modal4" title="手动添加商品" @on-ok="addOneBusiness">
      <Form :model="formItem" :label-width="110">
        <FormItem label="公司名称">
          <Input v-model="companyInfo.companyName" disabled style="width:300px"/>
        </FormItem>
        <FormItem label="商品名称">
          <Select v-model="model3" style="width:300px">
            <Option v-for="item in businessList" :value="item.id" @click.native="selectBussiness = item">{{ item.name
              }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="购买时长">
          <RadioGroup v-model="buyOneInfo.type">
            <Radio :label="0">一年</Radio>
            <Radio :label="1">永久</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="购买数量">
          <InputNumber :max="20" :min="1" :step="1" v-model="buyOneInfo.amount"></InputNumber>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
    import {
        companyBuyOne,
        companyConfigProjectNum,
        companyFindBuy,
        companyGetOne,
        companyInfo,
        couponesAddLink,
        couponesDeleteLink,
        couponesQueryLink,
        getAllBusiness,
        getAllCoupones
    } from '@/api/data'

    export default {
        name: 'company',
        data() {
            return {
                couponsMapUser: [],
                columns4: [
                    {title: '公司名称', key: 'companyName', width: 190},
                    {title: '优惠券ID', key: 'couponsId', width: 100},
                    {title: '领取的优惠券名称', key: 'couponsName'},
                    {title: '状态', key: 'status', width: 80},
                    {
                        title: 'Action',
                        slot: 'action',
                        width: 80,
                        align: 'center'
                    }
                ],
                columns3: [
                    {title: '商品ID', key: 'businessId', width: 80},
                    {title: '商品Name', key: 'businessName'},
                    {title: '购买时间', key: 'startDate'},
                    {title: '到期时间', key: 'endDate'},
                    {title: '数量', key: 'amount', width: 70},
                ],
                columns2: [
                    {title: '客户已用容量', key: 'customUsed'},
                    {title: '客户全部容量', key: 'customCount'},
                    {title: '项目已用容量', key: 'projectUsed'},
                    {title: '项目全部容量', key: 'projectCount'},
                    {
                        title: 'Action',
                        slot: 'action',
                        width: 80,
                        align: 'center'
                    }
                ],
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
                searchComanyList: [],
                searchComanyTip: '',
                companyInfo: {},
                companyCountInfo: [],  // 公司客户/项目容量信息
                modal2: false,
                model3: '',
                modal4: false,
                modal5: false,
                couponsList: [],
                bussinessMapUser: [],
                businessList: [],
                selectBussiness: {},
                buyOneInfo: {         // 购买一件商品时的参数
                    companyId: null,
                    bussinessId: null,
                    type: 0,            // 0:一年 1:永久
                    amount: 1,          // 数量
                },
                ConfigProjectNumParam: {
                    companyId: null,
                    customCount: null,
                    projectCount: null,
                }
            }
        },
        mounted() {
            this.getAllCoupones();
        },
        methods: {
            configProjectNum() {
                let param = this.ConfigProjectNumParam;
                param.companyId = this.companyInfo.companyId;
                param.customCount = this.companyInfo.customCount;
                param.projectCount = this.companyInfo.projectCount;
                companyConfigProjectNum(param).then(res => {
                    if (res.data.success === true) {
                        this.$Notice.success({
                            title: '目标公司容量修改成功!!',
                        });
                    } else {
                        this.$Notice.error({
                            title: '目标公司容量修改失败!!',
                        });
                    }
                })
            },
            addOneBusiness() {
                let param = this.buyOneInfo;
                param.bussinessId = this.selectBussiness.id
                param.companyId = this.companyInfo.companyId

                this.$Modal.confirm({
                    title: '危险操作警告',
                    content: '直接添加会产生不会留下订单信息,且会直接影响线上指定用户,是否继续?',
                    onOk: () => {
                        companyBuyOne(param).then(() => {
                            this.$Notice.success({
                                title: '添加商品成功!!',
                            });

                            // 查看公司购买信息
                            companyFindBuy(this.companyInfo.companyId).then(res => {
                                this.bussinessMapUser = res.data.data
                            })
                        });
                    },
                });
            },
            buyBusiness() {
                getAllBusiness().then(res => {
                    if (res.data.success === true) {
                        this.businessList = res.data.data;
                        this.modal4 = true
                    }
                });
            },
            getAllCoupones() {
                if (localStorage.getItem('allCoupones') == null) {
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

            // 添加优惠券
            addLink() {
                let param = {
                    "couponsId": this.model3,
                    "companyId": this.companyInfo.companyId
                };
                couponesAddLink(param).then(res => {
                    if (res.data.success === true) {
                        this.$Notice.success({
                            title: res.data.msg,
                        });
                        this.findOne(this.companyInfo.companyId)
                    } else {
                        this.$Notice.error({
                            title: '公司已有相同优惠券,不可重复创建!!',
                        });
                    }
                })
            },
            queryAddlink() {
                this.modal2 = true;
            },

            // 删除优惠券提示
            deleteQuery(index) {
                this.$Modal.confirm({
                    title: '危险操作警告',
                    content: '删除优惠券会直接影响到线上已经领取的用户,是否继续?',
                    onOk: () => {
                        this.deleteOne(index);
                    },
                });
            },

            // 删除优惠券
            deleteOne(index) {
                couponesDeleteLink(this.couponsMapUser[index].linkId).then(() => {
                    this.findOne(this.companyInfo.companyId)
                    this.$Notice.success({
                        title: '删除优惠券成功!',
                    });
                })
            },
            search(data) {
                companyInfo(data).then(res => {
                    if (res.data.data == null) {
                        this.$Notice.info({
                            title: '没有查询到任何公司信息!',
                        });
                        return
                    }
                    this.searchComanyList = res.data.data;
                    this.searchComanyTip = '共查询出' + res.data.data.length + '家公司, 请选择一家公司查看详情';
                })
            },

            // 单个公司信息
            findOne(companyId) {
                this.searchComanyList = [];
                companyGetOne(companyId).then(res => {
                    if (res.data.data == null) {
                        this.$Notice.error({
                            title: '查询出错!',
                        });
                        return
                    }
                    this.companyInfo = res.data.data;
                    this.companyCountInfo = [];
                    this.companyCountInfo.push(res.data.data);
                })


                // 查找优惠券信息
                const param = new FormData();
                param.append('companyId', companyId);
                couponesQueryLink(param).then(res => {
                    this.couponsMapUser = res.data.data
                })

                // 查看公司购买信息
                companyFindBuy(companyId).then(res => {
                    this.bussinessMapUser = res.data.data
                })
            },
        },
    }
</script>
<style>
</style>
