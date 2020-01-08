<template>
    <div style="height: 300px;margin-top: 5px">
        <div style="display: flex">
            <div class="index-displayCard"
                 onMouseOver="this.style='box-shadow: -1px 1px 2px 0.5px #c5c5c5;border: 0;transform:translateY(-1px)'"
                 onmouseout="this.style='box-shadow: 0;border: 0.5px solid #dfdfdf'">
                <div class="left" style="background-color: #ff7751">
                    <Icon type="md-bonfire" style="color: white" size="33"/>
                </div>
                <div style="width: 60%">
                    <div style="display: flex;justify-content: center;">
                        <div class="right">{{count.allUserCount}}</div>
                        <div style="align-self: flex-end;margin-bottom: 3px;color: green">
                            <Icon type="ios-arrow-up" style="width: 9px;"/>
                            2
                        </div>
                    </div>
                    <div style="display: flex;justify-content: center;width: 100%;color: grey">总计用户数</div>
                </div>
            </div>
            <div class="index-displayCard"
                 onMouseOver="this.style='box-shadow: -1px 1px 2px 0.5px #c5c5c5;border: 0;transform:translateY(-1px)'"
                 onmouseout="this.style='box-shadow: 0;border: 0.5px solid #dfdfdf'">
                <div class="left" style="background-color: #00bf72">
                    <Icon type="md-brush" style="color: white" size="33"/>
                </div>
                <div style="width: 60%">
                    <div style="display: flex;justify-content: center;">
                        <div class="right">{{count.yesterdayCount}}</div>
                        <div style="align-self: flex-end;margin-bottom: 3px;color: red">
                            <Icon type="ios-arrow-down" style="width: 9px;"/>
                            3
                        </div>
                    </div>
                    <div style="display: flex;justify-content: center;width: 100%;color: grey">昨日新增用户</div>
                </div>
            </div>
            <div class="index-displayCard"
                 onMouseOver="this.style='box-shadow: -1px 1px 2px 0.5px #c5c5c5;border: 0;transform:translateY(-1px)'"
                 onmouseout="this.style='box-shadow: 0;border: 0.5px solid #dfdfdf'">
                <div class="left" style="background-color: #ff9736">
                    <Icon type="md-desktop" style="color: white" size="33"/>
                </div>
                <div style="width: 60%">
                    <div style="display: flex;justify-content: center;">
                        <div class="right">{{count.yesterdayCreatTimeCount}}</div>
                        <div style="align-self: flex-end;margin-bottom: 3px;color: red">
                            <Icon type="ios-arrow-down" style="width: 9px;"/>
                            5
                        </div>
                    </div>
                    <div style="display: flex;justify-content: center;width: 100%;color: grey">昨日学习时间</div>
                </div>
            </div>
            <div class="index-displayCard"
                 onMouseOver="this.style='box-shadow: -1px 1px 2px 0.5px #c5c5c5;border: 0;transform:translateY(-1px)'"
                 onmouseout="this.style='box-shadow: 0;border: 0.5px solid #dfdfdf'">
                <div class="left" style="background-color: #008eea">
                    <Icon type="logo-rss" style="color: white" size="33"/>
                </div>
                <div style="width: 60%">
                    <div style="display: flex;justify-content: center;">
                        <div class="right">{{count.yesterdayUsedCount}}</div>
                        <div style="align-self: flex-end;margin-bottom: 3px;color: red">
                            <Icon type="ios-arrow-down" style="width: 9px;"/>
                            5
                        </div>
                    </div>
                    <div style="display: flex;justify-content: center;width: 100%;color: grey">昨日活跃用户</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {adminCount} from '@/api/data'

    export default {
        name: 'home',
        data() {
            return {
                count:{
                    allUserCount: 0,
                    yesterdayCount: 0,
                    yesterdayCreatTimeCount: 0,
                    yesterdayUsedCount: 0,
                }
            }
        },
        created() {
            this.getAdminCount();
        },
        methods: {
            getAdminCount() {
                adminCount().then(res => {
                  this.count = res.data.data;
                })
            }
        }
    }
</script>

<style lang="less">
    .test {
        border: 1px red solid;
    }

    .index-displayCard {
        width: 25%;
        max-width: 400px;
        display: flex;
        flex-direction: row;
        height: 65px;
        border-radius: 5px;
        margin: 6px;
        border: 0.5px solid #dfdfdf;
        user-select: none;

        .left {
            width: 40%;
            background-color: grey;
            height: 100%;
            border-radius: 4px 0 0 4px;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center
        }

        .right {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin: 5px 5px 0 5px;
        }
    }
</style>
