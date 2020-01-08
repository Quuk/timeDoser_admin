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
                        <div class="right">{{count.allUserSum}}</div>
                        <div :class="count.userAdd>0?'index-count-up':'index-count-down'">
                            <Icon v-if="count.userAdd>0" type="ios-arrow-up" style="width: 9px;"/>
                            <Icon v-else-if="count.userAdd===0" type="md-remove" style="width: 9px;"/>
                            <Icon v-else type="ios-arrow-down" style="width: 9px;"></Icon>
                            {{Math.abs(count.userAdd)}}
                        </div>
                    </div>
                    <div style="display: flex;justify-content: center;width: 100%;color: grey">总计用户</div>
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
                        <div class="right">{{count.userAdd}}</div>
                        <div :class="count.userAdd - count.exUserAdd>0?'index-count-up':'index-count-down'">
                            <Icon v-if="count.userAdd - count.exUserAdd>0" type="ios-arrow-up" style="width: 9px;"/>
                            <Icon v-else-if="count.userAdd - count.exUserAdd===0" type="md-remove" style="width: 9px;"/>
                            <Icon v-else type="ios-arrow-down" style="width: 9px;"></Icon>
                            {{Math.abs(count.userAdd - count.exUserAdd)}}
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
                        <div class="right">{{count.yesUsedSum}}</div>
                        <div :class="count.yesUsedSum - count.exYesUsedSum>0?'index-count-up':'index-count-down'">
                            <Icon v-if="count.yesUsedSum - count.exYesUsedSum>0" type="ios-arrow-up"
                                  style="width: 9px;"/>
                            <Icon v-else-if="count.yesUsedSum - count.exYesUsedSum===0" type="md-remove"
                                  style="width: 9px;"/>
                            <Icon v-else type="ios-arrow-down" style="width: 9px;"></Icon>
                            {{Math.abs(count.yesUsedSum - count.exYesUsedSum)}}
                        </div>
                    </div>
                    <div style="display: flex;justify-content: center;width: 100%;color: grey">昨日活跃账户</div>
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
                        <div class="right">{{count.workSum}}</div>
                        <div :class="count.workSum - count.exWorkSum>0?'index-count-up':'index-count-down'">
                            <Icon v-if="count.workSum - count.exWorkSum>0" type="ios-arrow-up" style="width: 9px;"/>
                            <Icon v-else-if="count.workSum - count.exWorkSum===0" type="md-remove" style="width: 9px;"/>
                            <Icon v-else type="ios-arrow-down" style="width: 9px;"></Icon>
                            {{Math.abs(count.workSum - count.exWorkSum)}}
                        </div>
                    </div>
                    <div style="display: flex;justify-content: center;width: 100%;color: grey">昨日学习时间</div>
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
                count: {
                    allUserSum: 0,
                    exUserAdd: 0,
                    exWorkSum: 0,
                    exYesUsedSum: 0,
                    userAdd: 0,
                    workSum: 0,
                    yesUsedSum: 0,
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

    .index-count-up {
        align-self: flex-end;
        margin-bottom: 3px;
        color: green;
    }

    .index-count-down {
        align-self: flex-end;
        margin-bottom: 3px;
        color: red;
    }
</style>
