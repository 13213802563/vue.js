<template>
    <div>
        <mt-header title="客户详情">
            <router-link to="/index/customerManagerment" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <!--<mt-button icon="back" @click="goBack" slot="left">返回</mt-button>-->
            <!--<mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>
        <div class="g-list">
            <div class="item">
                <span class="u-text-title">客户id:</span>
                <span class="u-text-des">{{detailInfo.customerId}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">客户姓名:</span>
                <span class="u-text-des">{{detailInfo.realName}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">用户名:</span>
                <span class="u-text-des">{{detailInfo.userName}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">性别:</span>
                <span class="u-text-des">{{detailInfo.sexName}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">年龄:</span>
                <span class="u-text-des" v-show="detailInfo.age !== 0">{{detailInfo.age}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">身份证号:</span>
                <span class="u-text-des">{{detailInfo.idCardNum}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">手机:</span>
                <span class="u-text-des">{{detailInfo.mobile}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">省 市 区:</span>
                <span class="u-text-des">{{address}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">详细地址:</span>
                <span class="u-text-des">{{detailInfo.address}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">来源:</span>
                <span class="u-text-des">{{detailInfo.companyName}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">更新人:</span>
                <span class="u-text-des">{{detailInfo.updateName}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">创建人:</span>
                <span class="u-text-des">{{detailInfo.createName}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">创建时间:</span>
                <span class="u-text-des">{{detailInfo.createTime}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { queryIdCustomer, queryCity } from '@/api/order.js'
    export default {
        name: "customerDetails",
        data () {
            return {
                detailInfo: {},
                province: '',
                city: '',
                county: '',
                // address:''
            }
        },
        created () {
            this.getCustomerDetail()
            this.queryCity()
        },
        computed: {
            customerId () {
                return this.$route.query.customerId
            },
            address () {
                let temp=''
                if(this.province !=null && this.province!=''&&this.province!= undefined){
                    temp = temp+ this.province;
                }
                if(this.city !=null && this.city!=''&&this.city!= undefined){
                    temp = temp+ this.city;
                }
                if(this.county !=null && this.county!=''&& this.county!= undefined){
                    temp = temp+ this.county;
                }
                return temp
            }
        },
        methods: {
            queryCity () {
                queryCity({}).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        var cityInfo = res.data.data
                        setTimeout(() => {
                            this.province = this.reginBegin(cityInfo, this.detailInfo.userProvince)
                            console.log(this.province)
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
                            this.city = this.reginBegin(cityInfo,
                                this.detailInfo.userCity)
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
            },
            reginBegin (data, str) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].code == str) {
                        return data[i].name
                    }
                }
            },
            getCustomerDetail () {
                queryIdCustomer({
                    customerId: this.customerId
                }).then(res => {
                    console.log(res)
                    if (res.data.code == 'I1-00-001') {
                        this.detailInfo = res.data.data
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
                width: 5rem;
            }

            span.u-text-des {
                word-break:break-all;
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
