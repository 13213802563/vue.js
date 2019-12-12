<template>
    <div>
        <mt-header title="订单详情">
            <!--<router-link to="/index/orderManagerment" slot="left">-->
                <!--<mt-button icon="back">返回</mt-button>-->
            <!--</router-link>-->

            <mt-button icon="back" @click="goBack" slot="left">返回</mt-button>
            <!--<mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>
        <div class="g-list" v-if="detailInfo.order">
            <div class="item">
                <span class="u-text-title">订单号:</span>
                <span class="u-text-des">{{detailInfo.order.orderId}}</span>
            </div>
            <!--<div class="item">-->
                <!--<span class="u-text-title">客户手机:</span>-->
                <!--<span class="u-text-des">{{detailInfo.order.userMobile}}</span>-->
            <!--</div>-->
            <div class="item">
                <span class="u-text-title">客户姓名:</span>
                <span class="u-text-des">{{detailInfo.order.userName}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">客户手机:</span>
                <span class="u-text-des">{{detailInfo.order.userMobile}}</span>
            </div>
            <!--regionMobile-->
            <!--<div class="item" v-if="Number(companyId) == detailInfo.order.companyId">-->
                <!--<span class="u-text-title">客户手机:</span>-->
                <!--<span class="u-text-des">{{detailInfo.order.userMobile}}</span>-->
            <!--</div>-->
            <div class="item"  v-if="Number(companyId) != detailInfo.order.companyId">
                <span class="u-text-title">管家手机:</span>
                <span class="u-text-des" v-html="detailInfo.order.regionMobile == '' ? '--' : detailInfo.order.regionMobile"></span>
            </div>
            <div class="item">
                <span class="u-text-title">客户省市区:</span>
                <span class="u-text-des">{{province}} {{city}} {{county}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">负&nbsp;&nbsp;责&nbsp;&nbsp;人:</span>
                <span class="u-text-des">{{detailInfo.order.rechargeName}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">创&nbsp;&nbsp;建&nbsp;&nbsp;人:</span>
                <span class="u-text-des">{{detailInfo.createName}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:</span>
                <span class="u-text-des">{{detailInfo.sexName}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">创建时间:</span>
                <span class="u-text-des">{{detailInfo.createTime}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">开始时间:</span>
                <span class="u-text-des">{{detailInfo.startTime}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">结束时间:</span>
                <span class="u-text-des">{{detailInfo.endTime}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">所属公司:</span>
                <span class="u-text-des">{{detailInfo.order.companyName}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">订单类型:</span>
                <span class="u-text-des">{{detailInfo.order.orderTypeName}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">订单状态:</span>
                <span class="u-text-des">{{detailInfo.order.orderStatusName}}</span>
            </div>
            <!--<div class="item">-->
                <!--<span class="u-text-title">支付状态:</span>-->
                <!--<span class="u-text-des">{{detailInfo.order.payStatusName}}</span>-->
            <!--</div>-->
        </div>
    </div>
</template>

<script>
    import { getOrderinfo, queryCity } from '@/api/order.js'
    export default {
        name: "orderDetails",
        data () {
            return {
                detailInfo: {},
                cityInfo: {},
                province: '',
                city: '',
                county: '',
                provinceCode: '',
                cityCode: '',
                countyCode: '',
                timer: null,
                companyId:localStorage.getItem('companyId'),
                active:0
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
        beforeDestroy () {
            clearInterval(this.timer);
        },
        methods: {
            goBack(){
                var url = this.$route.query.url;
                var val = this.$route.query.val;
                this.$router.push(url);
            },
            queryCity () {
                queryCity({}).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        var cityInfo = res.data.data
                        setTimeout(() => {
                            this.province = this.reginBegin(cityInfo, this.provinceCode)
                        }, 100)
                    } else {
                        this.$toast(res.data.msg);
                    }
                })
                queryCity({
                    levels: 2
                }).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        var cityInfo = res.data.data
                        setTimeout(() => {
                            this.city = this.reginBegin(cityInfo, this.cityCode)
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
                            this.county = this.reginBegin(cityInfo, this.countyCode)
                        }, 100)
                    } else {
                        this.$toast(res.data.msg);
                    }
                })
            },
            reginBegin (data, str) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].code == str) {
                        return data[i].name
                    }
                }
            },
            getOrderDetail () {
                getOrderinfo({
                    orderId: this.orderid
                }).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        this.detailInfo = res.data.data;
                        this.provinceCode = this.detailInfo.order.userProvince
                        this.cityCode = this.detailInfo.order.userCity
                        this.countyCode = this.detailInfo.order.userArea
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
