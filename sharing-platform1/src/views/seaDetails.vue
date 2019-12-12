<template>
    <div>
        <mt-header title="订单详情">
            <router-link to="/index/openSea" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <!--<mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>
        <div class="g-list">
            <div class="item">
                <span class="u-text-title">姓名:</span>
                <span class="u-text-des">{{detailInfo.userName}}</span>
            </div>
            <div class="item" v-if="Number(companyId) == detailInfo.companyId">
                <span class="u-text-title">手机：</span>
                <span class="u-text-des">{{detailInfo.userMobile}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">订单类型:</span>
                <span class="u-text-des">{{detailInfo.orderTypeName}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">订单状态:</span>
                <span class="u-text-des">{{detailInfo.orderStatusName}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">客户省市区:</span>
                <span class="u-text-des">{{province}}{{city}}{{county}}</span>
            </div>
            <div class="item" style="display: flex;height: unset">
                <span class="u-text-title">客户地址:</span>
                <span class="u-text-des">{{detailInfo.userAddress}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">负&nbsp;&nbsp;责&nbsp;&nbsp;人:</span>
                <span class="u-text-des">{{detailInfo.rechargeName}}</span>
            </div>

            <div class="item" v-if="Number(companyId) != detailInfo.companyId">
                <span class="u-text-title">管家手机：</span>
                <span class="u-text-des" v-html="detailInfo1.regionMobile == '' ? '--' : detailInfo1.regionMobile"></span>
            </div>
            <div class="item">
                <span class="u-text-title">创建时间:</span>
                <span class="u-text-des">{{detailInfo.createTime}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">开始时间:</span>
                <span class="u-text-des">{{detailInfo.createTime}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">结束时间:</span>
                <span class="u-text-des">{{detailInfo1.endTime}}</span>
            </div>
        </div>
    </div>
</template>
<!--regionMobile-->
<script>
    import { getSeaList, queryCity } from '@/api/order.js'
    export default {
        name: "seaDetails",
        data () {
            return {
                companyId : localStorage.getItem('companyId'),
                detailInfo: {},
                detailInfo1:{},
                province: '',
                city: '',
                county: '',
                timer: null
            }
        },
        created () {
            this.getOrderDetail()
            this.timer = setTimeout(() => {
                this.queryCity()
            }, 100)
        },
        computed: {
            orderid () {
                return this.$route.query.orderId
            }
        },
        methods: {
            queryCity () {
                queryCity({
                    levels: 2
                }).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        var cityInfo = res.data.data
                        setTimeout(() => {
                            this.city = this.reginBegin(cityInfo, this.detailInfo.userCity)
                        }, 100)
                    } else {
                        this.$toast(res.data.msg);
                    }
                })
                queryCity({
                    levels: 3
                }).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        var cityInfo = res.data.data
                        setTimeout(() => {
                            this.county = this.reginBegin(cityInfo, this.detailInfo.userArea)
                        }, 100)
                    } else {
                        this.$toast(res.data.msg);
                    }
                })

                this.$postwc('/sharePlatform-order/Order/queryOrderDetailById',{
                    orderId:this.$route.query.orderId
                }).then(res => {
                    console.log(res)
                    this.detailInfo = res.data.order;
                    this.detailInfo1 = res.data;
                    // if (res.data.code == 'I1-00-001') {
                    //     var cityInfo = res.data.data
                    //     setTimeout(() => {
                    //
                    //         this.province = this.reginBegin(cityInfo, this.detailInfo.userProvince)
                    //     }, 100)
                    // } else {
                    //     this.$toast(res.data.msg);
                    // }
                });
            },
            reginBegin (data, str) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].code == str) {
                        return data[i].name
                    }
                }
            },
            getOrderDetail () {
                getSeaList({}).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        var list = res.data.data.list;
                        for (let i = 0; i < list.length; i++) {
                            list[i].orderId == this.orderid ? this.detailInfo = list[i] : []
                        }
                    } else {
                        this.$toast(res.data.msg);
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
            height: px2rem(44px);
            line-height: px2rem(44px);
            border-bottom: 1px solid #eee;

            span.u-text-title {
                display: inline-block;
                min-width: 5rem;

            }

            span.u-text-des {
            }
        }

        button {
            width: 100%;
            height: 2.5rem;
            border: none;
            background: #26a2ff;
            color: #fff;
            font-weight: bold;
            outline: none;
            margin-bottom: 2rem;
            margin-top: 1rem;
        }
    }
</style>
