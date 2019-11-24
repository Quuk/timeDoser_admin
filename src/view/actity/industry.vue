<template>
  <div>
    <h1>行业信息</h1>
    <div style="margin:30px 20px;font-size: 12px">
      1. 如需修改公司信息,请在公司查看页面操作<br/>
      2. 行业信息只可以修改或者添加,删除会影响线上已分类的用户,如果特殊操作请联系管理员<a href="tcyeee@outlook.com" target="_blank">tcyeee@outlook.com</a>
    </div>
    <Collapse style="width: 500px;margin:20px">
      <Panel :name="item.name" v-for="(item,index) in industryList">
        {{item.name}}
        <List slot="content">
          <Button icon="md-add" long @click="addInfo(item.id,index)">添加子项</Button>
          <ListItem v-for="(info,infoIndex) in item.list"
                    style="display: flex;justify-content: space-between; width: 100%">
            <div style="margin-left: 10px">{{info.id}}&emsp;&emsp;{{info.name}}</div>
            <Icon slot="extra" type="md-settings" style="margin-right: 20px"
                  @click="changeInfo(item.id,index,info.id,infoIndex)"/>
          </ListItem>
        </List>
      </Panel>
    </Collapse>

    <!-- 添加/修改-->
    <Modal v-model="modal1" title="公司分类" @on-ok="ok">
      <Form :label-width="120">
        <FormItem label="分类名称">
          <Input disabled style="width:300px" v-model="industryInfo.className"/>
        </FormItem>
        <FormItem label="子项名称">
          <Input style="width:300px" v-model="industryInfo.itemName"/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
    import {industryAddOne, industryGetAll, industryUpdateOne} from '@/api/data'

    export default {
        name: 'industry',
        data() {
            return {
                industryList: [],
                modal1: false,
                industryInfo: {
                    classId: null,
                    className: '',
                    itemId: null,
                    itemName: '',
                },
            }
        },
        mounted() {
            this.getAllIndustry();
        },
        methods: {
            addInfo(classId, classIndex) {
                this.industryInfo.classId = classId;
                this.industryInfo.className = this.industryList[classIndex].name;
                this.industryInfo.itemName = '';
                this.modal1 = true;
            },
            changeInfo(classId, classIndex, infoId, infoIndex) {
                this.modal1 = true;
                this.industryInfo.itemId = infoId;
                this.industryInfo.classId = classId;
                this.industryInfo.className = this.industryList[classIndex].name;
                this.industryInfo.itemName = this.industryList[classIndex].list[infoIndex].name;
            },
            getAllIndustry: function () {
                if (localStorage.getItem('industryGetAll') == null) {
                    industryGetAll().then(res => {
                        this.industryList = res.data.data
                        localStorage.setItem('industryGetAll', JSON.stringify(res.data.data))
                    })
                } else {
                    this.industryList = JSON.parse(localStorage.getItem('industryGetAll'))
                }
            },
            ok() {
                if (this.industryInfo.itemId == null) {
                    industryAddOne(this.industryInfo).then(res => {
                        if (res.data.success === true) {
                            this.$Notice.success({
                                title: "添加行业分类成功!!",
                            });
                            this.getAllIndustry();
                            localStorage.removeItem('industryGetAll')
                        } else {
                            this.$Notice.error({
                                title: res.data.msg,
                            });
                        }
                    })
                } else {
                    industryUpdateOne(this.industryInfo).then(res => {
                        if (res.data.success === true) {
                            this.$Notice.success({
                                title: "修改行业信息成功!!",
                            });
                            this.getAllIndustry();
                            localStorage.removeItem('industryGetAll')
                        }
                    })
                }
            },
        },
    }

</script>
<style>
</style>
