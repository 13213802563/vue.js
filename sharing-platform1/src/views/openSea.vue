<template>
    <div>
        <mt-header title="捞取公海订单">
            <router-link to="/index" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <!--<router-link to="/index/orderManagerment/addOrder" slot="right">-->
                <!--<mt-button>新增</mt-button>-->
            <!--</router-link>-->
            <!--<mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>
        <div v-show="!loadingimg">
            <div class="g-list">
                <div class="item" v-for="(item, index) in seaList" :key="index" @click="toDetail(item)">
                    <div class="part">
                        <span class="u-text-title">姓名：</span>
                        <span class="u-text-des">{{item.userName}}</span>
                    </div>
                    <div class="part" v-if="Number(companyId) == item.companyId">
                        <span class="u-text-title">手机：</span>
                        <span class="u-text-des">{{item.userMobile}}</span>
                    </div>
                    <div class="part" v-if="Number(companyId) != item.companyId">
                        <span class="u-text-title">管家手机：</span>
                        <span class="u-text-des" v-html="item.regionMobile == '' ? '--' : item.regionMobile"></span>
                    </div>
                    <div class="part">
                        <span class="u-text-title">订单类型：</span>
                        <span class="u-text-des">{{item.orderTypeName}}</span>
                        <span class="u-text-title" style="margin-left: 1rem">状态：</span>
                        <span class="u-text-des">{{item.orderStatusName}}</span>
                    </div>
                    <div class="part" style="display: flex">
                        <span class="u-text-title" style="min-width: 5rem;">客户地址：</span>
                        <span class="u-text-des">{{item.userAddress}}</span>
                    </div>
                    <!--<div class="part" style="display: flex">-->
                        <!--<span class="u-text-title">佣金：</span>-->
                        <!--<span class="u-text-des">{{item.feeMoney}}元</span>-->
                    <!--</div>-->
                    <div class="part" style="text-align: left;">
                        <button class="pickup" v-if="item.isInPool == 1 && Number(companyId) !== item.companyId" @click.stop="backOtherOrder(item)">捞取</button>
                        <button class="reback" v-if="item.isInPool == 1 && Number(companyId) == item.companyId" @click.stop="backOrder(item)">收回</button>
                        <!--<button class="tosea" v-if="item.isInPool == 2" @click.stop="removeTosea(item)">放入公海池</button>-->
                    </div>
                </div>
            </div>
            <div class="no-list" v-if="seaList.length === 0">
                <img src="../assets/no-data.png" alt="">
            </div>
        </div>
        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa" />
        </section>
        <van-dialog
                v-model="Feeshow"
                title="捞单"
                show-cancel-button
                @confirm="confirmFee"
        >
            <div style="text-align: center;margin: 1.2rem auto;">
                您需要花费{{currentitem.feeMoney}}积分
            </div>
        </van-dialog>
    </div>
</template>

<script>
    import { Loading } from 'vant';
    import {Dialog} from 'vant';
    import { getSeaList, getOrderFromPool, retrieveOrderFromPool, moveToBroadOcean } from '@/api/order.js'
    export default {
        name: "openSea",
        data () {
            return {
                seaList: [],
                loadingimg: true,
                Feeshow: false,
                currentitem: {},

                //审核状态 0:未上传执照，待审核，1:审核通过，2:审核未通过，3：已上传执照，审核中
                approvalStatus:0,
                //审核驳回原因
                reason:''
            }
        },
        mounted(){
            let that=this
            pushHistory()
            that.gotoURL(function () {
                pushHistory()
                Dialog.close()
                that.$router.push('/index');
            })
        },
        created () {
            this.getOrderpool();
            this.$postwc('/sharePlatform-auth/auth/getUserCheckStatus',{
            }).then(res => {
                this.approvalStatus = res.data.approvalStatus;
                if(this.approvalStatus == 2) this.reason = res.data.reason;
                console.log(this.approvalStatus);
            })
        },
        components: {
            [Loading.name]: Loading
        },
        computed: {
            companyId () {
                return localStorage.getItem('companyId')
            }
        },
        methods: {
            //获取订单
            getOrderpool () {
                getSeaList({
                    isInPool:1
                }).then(res => {
                    this.loadingimg = false
                    if (res.data.code == 'I1-00-001') {
                        this.seaList = res.data.data.list;
                    } else {
                        this.$toast(res.data.msg);
                    }
                })
            },
            backOtherOrder (item) {
                let that = this;
                if(that.approvalStatus === 1){
                    this.currentitem = item
                    this.Feeshow = true
                }
                if(that.approvalStatus === 0){
                    Dialog.confirm({
                        title: '',
                        message: '您需完善企业信息并通过审核后，才可进行本操作',
                        confirmButtonText:'去完善信息'
                    }).then(() => {
                        // on confirm
                        // moveToBroadOcean({
                        //     orderId: item.orderId,
                        //     isInPool: 1
                        // }).then(res => {
                        //     if (res.data.code == 'I1-00-001') {
                        //         this.$toast('操作成功');
                        //         this.currentPage = 0;
                        //         this.orderlist = [];
                        //         this.getOrderList();
                        //         location.reload();
                        //     } else {
                        //         this.$toast(res.data.msg);
                        //     }
                        // })
                        console.log(1)
                        that.$router.push({ path: '/information', query: { url: '/index/openSea' }});
                    }).catch(() => {
                        // on cancel
                        that.isBtns=false;
                    });
                }
                if(that.approvalStatus === 2){
                    Dialog.confirm({
                        title: '',
                        message: '企业注册信息被驳回，请修改信息并通过审核后，才可进行本操作\n 驳回原因：' + that.reason,
                        confirmButtonText:'去完善信息'
                    }).then(() => {
                        // on confirm
                        // moveToBroadOcean({
                        //     orderId: item.orderId,
                        //     isInPool: 1
                        // }).then(res => {
                        //     if (res.data.code == 'I1-00-001') {
                        //         this.$toast('操作成功');
                        //         this.currentPage = 0;
                        //         this.orderlist = [];
                        //         this.getOrderList();
                        //         location.reload();
                        //     } else {
                        //         this.$toast(res.data.msg);
                        //     }
                        // })
                        console.log(1)
                        that.$router.push({ path: '/information', query: { url: '/index/openSea' }});
                    }).catch(() => {
                        // on cancel
                        that.isBtns=false;
                    });
                }
                if(that.approvalStatus === 3){
                    this.$toast('已上传执照，审核中，请耐心等待');
                    that.isBtns=false;
                }

            },
            confirmFee () {
                getOrderFromPool({
                    // companyId: this.companyId,
                    feeMoney: this.currentitem.feeMoney,
                    orderId: this.currentitem.orderId,
                    isInPool: 1
                }).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        this.$toast('移出成功');
                        location.reload();
                    } else {
                        this.$toast('账户余额不足');
                    }
                })
            },
            // 订单移入公海
            removeTosea (item) {
                moveToBroadOcean({
                    orderId: this.orderId
                }).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        this.$toast('操作成功');
                        location.reload();
                    } else {
                        this.$toast(res.data.msg);
                    }
                })
            },
            //移入有效订单
            backOrder (item) {
                let that=this;
                Dialog.confirm({
                    title: '收回',
                    message: '确认收回？'
                }).then(() => {
                    // on confirm
                    console.log(1)
                    that.$postwc('/sharePlatform-pool/orderPool/retrieveOrderFromPool', {
                        companyId: item.companyId,
                        orderId: item.orderId,
                        isInPool:1
                    }).then(res => {
                        if (res.code == 'I1-00-001') {
                            this.$toast('收回成功');
                            location.reload();
                        } else {
                            this.$toast('收回失败');
                            return false
                        }
                    })
                }).catch(() => {
                    // on cancel
                    console.log(2)
                });
                // retrieveOrderFromPool({
                //     companyId: item.companyId,
                //     orderId: item.orderId
                // }).then(res => {
                //     if (res.data.code == 'I1-00-001') {
                //         this.$toast('移出成功');
                //         location.reload();
                //     } else {
                //         this.$toast(res.data.msg);
                //     }
                // })
            },
            toDetail (item) {
                this.$router.push({
                    name: 'seaDetail',
                    query: {
                        orderId: item.orderId
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }

    .g-list {
        padding: 0 px2rem(15px);


        .item {
            width:100%;
            height: max-content;
            padding-bottom: 0.5rem;
            background:rgba(255,255,255,1);
            box-shadow:0px 7px 20px 0px rgba(0,0,0,0.08);
            border-radius:6px;
            margin-bottom: 1rem;
            margin-top: 1rem;
            border: 1px solid #ddd;

            .part {
                padding: 0 px2rem(15px);
                margin-top: px2rem(15px);

                span {
                    display: inline-block;
                }

                .u-text-title {
                    font-weight: bold;
                    font-size: px2rem(16px);


                }

                .u-text-des {
                    font-size: px2rem(16px);
                    word-break: break-all;
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
                    /*font-size: 14px;*/
                    /*padding: 8px;*/
                    /*border: 1px solid #26a2ff;*/
                    /*border-radius: 6px;*/
                    /*background: #fff;*/
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

    .pickup {
        border:none;
        background: rgba(238, 115, 165, 0.41);
        height: 2rem;
        padding: 0 0.5rem;
    }
    .reback {
        border:none;
        background: rgba(238, 225, 87, 0.41);
        height: 2rem;
        padding: 0 0.5rem;

    }
    .tosea {
        border:none;
        background: rgba(2, 238, 107, 0.41);
        height: 2rem;
        padding: 0 0.5rem;
    }
</style>
