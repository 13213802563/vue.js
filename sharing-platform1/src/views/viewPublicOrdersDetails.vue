<template>
    <div>
        <mt-header title="查看订单详情">
            <mt-button slot="left" icon="back" @click="prev">返回</mt-button>
        </mt-header>
        <div class="g-list">
            <div class="item">
                <span class="u-text-title">姓名:</span>
                <span class="u-text-des">{{detailInfo.userName}}</span>
            </div>
            <!--<div class="item">-->
                <!--<span class="u-text-title">客户电话:</span>-->
                <!--<span class="u-text-des">{{detailInfo.userMobile}}</span>-->
            <!--</div>-->
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
            <div class="item" v-show="!this.$route.query.type=='11'" style="display: flex;height: unset">
                <span class="u-text-title" >客户地址:</span>
                <span class="u-text-des" style="word-break:break-all">{{detailInfo.userAddress}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">负&nbsp;&nbsp;责&nbsp;&nbsp;人:</span>
                <span class="u-text-des">{{detailInfo.rechargeName}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">管家电话:</span>
                <span class="u-text-des">{{detailInfo1.regionMobile}}</span>
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

<script>
    import {getOrderinfo,queryCity } from '@/api/order.js'
    export default {
        name: "viewPublicOrderDetails",
        data () {
            return {
                detailInfo: {},
                detailInfo1:{},
                province: '',
                city: '',
                county: '',
                timer: null,
                urlParams:this.$route.query,
            }
        },
        created () {
            // this.getOrderDetail()
            this.timer = setTimeout(() => {
                this.queryCity()
            }, 100)
        },
        computed: {
            orderid () {
                return this.$route.orderId
            }
        },
        methods: {
            prev(){
                let that=this
                if(this.$route.query.type==33){
                    this.$router.push('/index/viewPublicOrders')
                }
                if(this.$route.query.type==11){
                    this.$router.push('/index/addOrderList?personnelId='+sessionStorage.getItem('personnelId')+'&orderTypeName='+sessionStorage.getItem('orderTypeName')+'&confirmBy='+sessionStorage.getItem('confirmBy'))
                }else if(this.$route.query.type==22){
                    this.$router.push('/index/pushOrderList')
                }else if(this.$route.query.type=='orderStatusOne'){
                    this.$router.push('/index/servicerManagerment?active=1&orderStatus=1')
                }else if(this.$route.query.type=='orderStatusTwo'){
                    this.$router.push('/index/servicerManagerment?active=1&orderStatus=2')
                }else if(this.$route.query.type=='active'){
                    this.$router.push('/index/servicerManagerment?active=2')
                }
                if(that.urlParams.value){
                    that.$router.push('/index/pushOrderList?value='+that.$route.query.value+'&personnelId='+that.$route.query.personnelId)
                }
            },
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
                    localStorage.setItem('consumeCount',res.data.order.consumeCount + 1);
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
                getOrderinfo({}).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        var list = res.data.data.list;
                        // for (let i = 0; i < list.length; i++) {
                        //     list[i].orderId == this.orderid ? this.detailInfo = list[i] : []
                        // }
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
