<template>
    <div>
        <mt-header title="客户管理系统" style="z-index: 999;">
            <router-link to="/index" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <router-link to="/index/customerManagerment/addCustomer" slot="right">
                <mt-button>新增</mt-button>
            </router-link>
            <!--<mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>
        <div class="tab" v-show="!loadingimg">
            <section class="g-list" v-if="customerList.length > 0" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="50">
                <div class="item" v-for="(item, index) in customerList" :key="index" @click="toDetail(item)">
                    <div class="part">
                        <span class="u-text-title">姓名：</span>
                        <span class="u-text-des">{{item.realName}}</span>
                        <span class="u-text-title" style="margin-left: 1rem">性别：</span>
                        <span class="u-text-des">{{item.sexName}}</span>
                    </div>
                    <div class="part">
                        <span class="u-text-title">身份证号：</span>
                        <span class="u-text-des">{{item.idCardNum}}</span>
                    </div>
                    <div class="part">
                        <span class="u-text-title">年龄：</span>
                        <span class="u-text-des" v-show="item.age !== 0">{{item.age}}</span>
                        <span class="u-text-title" style="margin-left: 1rem">用户名：</span>
                        <span class="u-text-des">{{item.username}}</span>
                    </div>
                    <div class="part" style="position: relative">
                        <span class="u-text-title">客户来源：</span>
                        <span>{{item.companyName}}</span>
                    </div>
                    <div class="part" style="display: flex;">
                        <span class="u-text-title" style="min-width: 5rem;">详细地址：</span>
                        <span class="u-text-des">{{item.address}}</span>
                    </div>
                    <div class="part" style="text-align: left;">
                        <button class="edit" @click.stop="updateCustomer(item)">修改客户信息</button>
                    </div>
                </div>
            </section>
            <div class="no-list" v-else>
                <img src="../assets/no-data.png" alt="">
            </div>
        </div>
        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa" />
        </section>

        <section v-if="loadingimgBottom">
            <div class="dataLoading" >加载中...</div>
        </section>
    </div>
</template>

<script>
    import { queryCustomer } from '@/api/order.js';
    import { Loading } from 'vant';
    export default {
        name: "customerManagerment",
        data () {
            return {
                customerList: [],
                loading: false,
                currentPage: 0,
                pageSize: 5,
                firstPage: false,
                lastPage: false,
                loadingimg: true,
                loadingimgBottom:true
            }
        },
        components: {
            [Loading.name]: Loading
        },
        created () {
            this.getList()
        },
        methods: {
            // 获取客户列表
            getList () {
                this.loadingimgBottom = true;
                queryCustomer({
                    pageNum: this.currentPage,
                    pageSize: this.pageSize
                }).then(res => {
                    this.loadingimg = false;
                    if (res.data.code === 'I1-00-001') {
                        this.customerList = this.customerList.concat(res.data.data.list)
                        this.loading = false;
                        if (res.data.data.list.length < 5) {
                            this.lastPage = true
                        }
                        this.firstPage = false;
                    } else {
                        this.$toast(res.data.msg);
                    }
                    this.loadingimgBottom = false;
                })
            },
            loadMore () {
                // if (this.firstPage == true || this.lastPage == true ) {
                //     return false
                // }
                // this.loading = true
                // setTimeout(() => {
                //     this.currentPage++;
                //     this.getList();
                //     this.firstPage = false
                // },1000)
            },
            // 跳转详情页
            toDetail (item) {
                this.$router.push({
                    name: 'customerDetail',
                    query: {
                        customerId: item.customerId
                    }
                })
            },
            // 跳转修改客户信息
            updateCustomer (item) {
                this.$router.push({
                    name: 'updateCustomer',
                    query: {
                        customerId: item.customerId
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
   .dataLoading{
        position: fixed;
        bottom: 0;
        display: flex;
        justify-content: center;
        z-index: 21;
        left: 40%;
    }
    .tab {
        overflow: scroll;
        height: 100vh;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        padding-top: 2.2rem;
        .g-list {
            padding: 0 px2rem(15px) px2rem(45px);
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
                        word-break:break-all;
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
                        margin-right: px2rem(10px);
                    }
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
        border:none;
        background: rgba(0, 183, 238, 0.41);
        height: 2rem;
        padding: 0 0.5rem;
    }
</style>
