<template>
    <div>
        <mt-header title="已推送订单" style="z-index: 999">
            <router-link slot="left" to="/index/servicerManagerment?active=1">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <div v-show="loadingimg"
             style="overflow: scroll; height: 100vh;position: fixed;left: 0;right: 0;top: 3rem;    overflow-x: hidden;">
            <div class="g-list" v-if="list.length > 0" :infinite-scroll-disabled="loading"
                 infinite-scroll-distance="50">
                <template v-for="item in list" class="g-list">

                    <div class="item">
                        <div class="part">
                            <span class="u-text-title">客户姓名：</span>
                            <span class="u-text-des">{{item.userName}}</span>
                        </div>
                        <div class="part">
                            <span class="u-text-title">管家手机号：</span>
                            <span class="u-text-des">{{item.regionMobile}}</span>
                        </div>
                        <div class="part">
                            <span class="u-text-title">订单类型：</span>
                            <span class="u-text-des">{{item.orderTypeName}}</span>
                            <span class="u-text-title" style="margin-left: 1rem;">状态：</span>
                            <span class="u-text-des">{{item.orderStatusName}}</span>
                        </div>
                        <div class="part" style="width: 100%;word-break: break-all;">
                            <span class="u-text-title">客户地址：</span>
                            <span class="u-text-des" style="width:70%;">{{item.userAddress}}</span>
                        </div>
                        <div class="part" style="text-align: left;display: block;">
                            <button class="edit" @click.stop="details(item)">查看
                            </button>
                        </div>
                        <div class="checkId" v-if="isRadio==1"  style="text-align: right;margin-right: 1rem;">
                            <label>
                                <input  type="radio"
                                        :value="item" v-model="isChecked" :disabled="item.orderStatusName=='已合单'?true:false"
                                       >
                            </label>
                        </div>
                    </div>

                </template>
            </div>

        </div>
        <div class="button" v-if="isRadio==1">
            <button @click="add(list)">确认</button>
        </div>
    </div>
</template>


<script>
    import {Loading} from 'vant';

    export default {
        name: "pushOrderList",
        components: {
            [Loading.name]: Loading,
        },
        data() {
            return {
                list: JSON.parse(sessionStorage.getItem('dataList')),
                loading: false,
                loadingimg: true,
                isChecked: [],
                isRadio:this.$route.query.value,
                isBtn: false,
            }
        },
        methods: {
            details(val){
                this.$router.push('/index/viewPublicOrders/viewPublicOrdersDetails?orderId='+val.orderId+'&value='+this.$route.query.value+'&personnelId='+this.$route.query.personnelId)
            },
            add(val){
                let thats = this;
                if (thats.isBtn === true) {
                    return false;
                }
                thats.isBtn = true;
                let arr = [];
                let that = this.isChecked;

                if (this.isChecked.length === 0) {
                    this.$toast('请勾选需要推送的服务人员');
                    thats.isBtn = false;
                    return false;
                }
                thats.$post('/sharePlatform-person/personnel/myWantMergeOrder', {
                    orderId:that.orderId,
                    rechargeBy:that.rechargeBy,
                    updateBy:that.updateBy,
                    serverPersonId:this.$route.query.personnelId,
                    otherPushNum:sessionStorage.getItem('otherPushNum')
                }).then(res => {
                    if (res.code === 'W3-01-0001') {
                        that.$toast('登录状态已失效');
                        thats.$router.push('/')
                    }else if (res.code === 'I1-00-9999') {
                        this.$toast('合单成功  ，请等待订单方发起合同确认');
                        this.$router.push('/index/servicerManagerment?active=1')
                    } else {
                        this.$toast(res.msg);
                        thats.isBtn = false;
                    }

                })
            },
        },

    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }
    .button {
        background: #ffffff;
        padding: 0.5rem 0;
        width: 100%;
        position: absolute;
        bottom: 0rem;

        button {

            width: 90%;
            margin-left: 5%;
            padding: 1rem 0;
            background: #23bcfc;
            color: #fff;
            border: 0;
            border-radius: 0.5rem;
        }

    }
    .g-list {
        padding: 0 px2rem(15px);
        padding-bottom: 7rem;

        .item {
            width: 100%;
            min-height: 8.875rem;
            height: max-content;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 7px 20px 0px rgba(0, 0, 0, 0.08);
            border-radius: 6px;
            margin-bottom: 1rem;
            margin-top: 1rem;
            border: 1px solid #ddd;
            padding-bottom: 0.5rem;

            .part {
                padding: 0 px2rem(15px);
                margin-top: px2rem(15px);
                display: flex;

                button {
                    margin: 0.3rem 0;
                }

                span {
                    display: inline-block;
                }

                .u-text-title {
                    font-weight: bold;
                    font-size: px2rem(16px);


                }

                .u-text-des {
                    font-size: px2rem(16px);
                }


                .btns {
                    position: absolute;
                    right: px2rem(15px);
                    bottom: 0rem;

                    button {
                        border: none;
                        height: px2rem(25px);
                        padding: 0 px2rem(3px);
                    }

                    .edit {
                        background: #fc4949;
                        font-size: px2rem(14px);
                        font-weight: bold;
                        color: #fff;
                    }

                    .move {
                        background: #60a0fc;
                        font-size: px2rem(14px);
                        font-weight: bold;
                        color: #fff;
                        margin-left: px2rem(10px);
                    }
                }

                button {
                    margin-right: px2rem(10px);
                }
            }
        }
    }

    .no-list {
        padding: px2rem(65px) px2rem(15px) 0;
        text-align: center;
        font-size: px2rem(15px);

        img {
            width: px2rem(260px);
        }
    }

    .loading {
        padding-top: 6rem;

        div {
            margin: 0 auto;
        }
    }

    .edit {
        border: none;
        background: rgba(0, 183, 238, 0.41);
        height: 2rem;
        padding: 0 0.5rem;
    }

    .tosea {
        border: none;
        background: rgba(2, 238, 107, 0.41);
        height: 2rem;
        padding: 0 0.5rem;
    }

    .reback {
        border: none;
        background: rgba(238, 225, 87, 0.41);
        height: 2rem;
        padding: 0 0.5rem;
    }

    .watchingPool {
        border: none;
        background: rgba(115, 68, 238, 0.41);
        height: 2rem;
        padding: 0 0.5rem;
    }

    .van-dialog {
        .van-dialog__content {
            text-align: center;

            input {
                border: none;
                border-bottom: 1px solid #ddd;
                height: 1.5625rem;
                line-height: 1.5625rem;
                width: 15rem;
                outline: none;
                margin: 1.2rem auto;
            }
        }
    }
</style>