<template>
    <div>
        <mt-header title="已推送订单">
            <!--<router-link to="/index/orderManagerment" slot="left">-->
                <!--<mt-button icon="back">返回</mt-button>-->
            <!--</router-link>-->

            <mt-button icon="back" @click="goBack" slot="left">返回</mt-button>
            <!--<router-link to="/index/orderManagerment/addOrder" slot="right">-->
            <!--<mt-button>新增</mt-button>-->
            <!--</router-link>-->
            <!--<mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>
                <div v-show="!loadingimg" style="overflow: scroll; height: 100vh;position: fixed;left: 0;right: 0;">
                    <div class="g-list" v-if="rightList.length > 0" v-infinite-scroll="mergedOrder" :infinite-scroll-disabled="loading" infinite-scroll-distance="50">
                        <template v-for="item in rightList" class="g-list">
                            <div class="item"  @click="details(item)">
                                <div class="part">
                                    <span class="u-text-title">姓名：</span>
                                    <span class="u-text-des">{{item.userName}}</span>
                                </div>
                                <div class="part">
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
                                <div class="part" style="text-align: left;">
                                    <button class="pickup checkItem" @click.stop="details(item)">查看</button>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="no-list" v-else>
                        <img src="../assets/no-data.png" alt="">
                    </div>
                </div>

        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa"/>
        </section>
    </div>
</template>

<script>
    import {Loading} from 'vant';
    export default {
        name: "promotedServiceOrders",
        data() {
            return {
                companyId : localStorage.getItem('companyId'),
                rightList: [],
                leftList:[],
                loading: false,
                allPage: false,
                onScroll: false,
                allPageRight: false,
                onScrollRight: false,
                loadingimg: true,
                currentPage: 0,
                noData:false
            }
        },
        components: {
            [Loading.name]: Loading
        },
        mounted() {
            this.mergedOrder()
            let that=this
            pushHistory()
            that.gotoURL(function () {
                pushHistory()
                Dialog.close()
                that.$router.push('/index/orderManagerment');
            })
        },

        methods: {
            goBack(){
                this.$router.push({
                    name: 'orderManagerment',
                    query: {
                        val: 1
                    }
                })
            },

            //全部已推送订单
            mergedOrder() {
                let that = this;
                that.loading = true
                if (that.allPage === true) {
                    return false;
                }
                if (that.onScroll === true) {
                    return false;
                }
                that.onScroll = true;
                setTimeout(() => {
                    that.currentPage++;
                    that.$postwc('/sharePlatform-pool/orderConsumePool/listOrderPool', {
                        pageNum: that.currentPage,
                        pageSize: 5,
                    }).then(res => {
                        that.loadingimg = false;
                        if (res.code === 'W3-01-0001') {
                            that.$toast('登录状态已失效');
                            that.$router.push('/')
                        }
                        that.rightList = that.rightList.concat(res.data.list)
                        that.loading = false;
                        if (res.data.list.length < 5) {
                            that.allPage = false;
                        }
                        that.onScroll = false;
                    })
                }, 300)
            },

            //查看详情
            details(item){
                this.$router.push({
                    name: 'orderDetails',
                    query: {
                        orderId: item.orderId,
                        url: '/index/promotedServiceOrders'
                    }
                })
            },
        }
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }
    .checkItem {
        background: rgba(238, 115, 165, 0.41);
        font-size: 0.875rem;
        font-weight: bold;
        color: #fff;
        border: none;
        padding: 0.5rem 0.625rem;
    }
    .mergeOrder{
        border:none;
        background: rgba(238, 225, 87, 0.41);
        height: 2rem;
        padding: 0 0.5rem;
        margin-left: 1rem;
    }
    /*.checkItemBack{*/
        /*border:none;*/
        /*background: rgba(238, 225, 87, 0.41);*/
        /*height: 2rem;*/
        /*padding: 0 0.5rem;*/
    /*}*/
    .g-list {
        padding: 0 px2rem(15px);
        padding-bottom: 5.8rem;

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

                span {
                    display: inline-block;
                }

                .u-text-title {
                    font-weight: bold;
                    font-size: px2rem(15px);


                }

                .u-text-des {
                    font-size: px2rem(15px);
                    word-break:break-all
                }


                .edit {
                    background: #c89efc;
                    font-size: px2rem(14px);
                    font-weight: bold;
                    color: #fff;
                    border: none;
                    padding: px2rem(8px) px2rem(10px);
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
</style>
