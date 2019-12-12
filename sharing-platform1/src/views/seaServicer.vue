<template>
    <div>
        <mt-header title="捞取公海服务人员" style="z-index: 999">
            <router-link to="/index" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <div v-show="!loadingimg">
            <div style="overflow: scroll; height: 100vh;position: fixed;left: 0;right: 0;top: 0;padding-top: 2.2rem">
                <div class="g-list"  v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" infinite-scroll-distance="50" >
                    <template v-for="item in userList">
                        <div class="item" @click="goDetails(item.personnelId)">
                            <div class="part">
                                <span class="u-text-title">服务人员姓名:</span>
                                <span class="u-text-des">{{item.userName}}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">服务人员性别：</span>
                                <span class="u-text-des">{{item.sexStr}}</span>
                            </div>
                            <div class="part" v-if="item.companyId == company">
                                <span class="u-text-title">服务人员电话：</span>
                                <span class="u-text-des">{{item.mobile}}</span>
                            </div>
                            <div class="part" v-if="item.companyId != company">
                                <span class="u-text-title">管家电话：</span>
                                <span class="u-text-des" v-html="item.rechargeMobile == '' ? '--' : item.rechargeMobile.replace(item.rechargeMobile.substring(3,7),'****') "></span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">工种：</span>
                                <span class="u-text-des">{{item.workerName}}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">工作年限：</span>
                                <span class="u-text-des" v-if="item.workingLife !== 0">{{item.workingLife}}</span>
                            </div>
                            <div class="part" style="position: relative">
                                <span class="u-text-title">简介：</span>
                                <span class="u-text-des">{{item.introduction}}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">佣金：</span>
                                <span class="u-text-des">{{item.feeMoney}}元</span>
                            </div>
                            <div class="part" style="text-align: left;display: block;">
                                <button class="pickup" v-if="Number(companyId) !== item.companyId" @click.stop="backOtherOrder(item)">捞取</button>
                                <button class="reback" v-if="Number(companyId) == item.companyId" @click.stop="backOrder(item)">收回</button>
                                <!--<button v-if="item.isInPool == 2" @click.stop="removeTosea(item)">放入服务人员公海池</button>-->
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <div class="no-list" v-if="userList.length === 0">
                <img src="../assets/no-data.png" alt="">
            </div>
        </div>
        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa" />
        </section>
        <van-dialog
                v-model="Feeshow"
                title="捞人"
                show-cancel-button
                @confirm="confirmFee"
        >
            <div style="text-align: center;margin: 1.2rem auto;">
                您需要花费{{currentitem.feeMoney}}元
            </div>
        </van-dialog>
    </div>
</template>

<script>
    import { Loading } from 'vant';
    import { getlistPersonPool, getPersonFromPool, retrievePersonFromPool, moveToBroadOceanService } from '@/api/order.js'
    export default {
        name: "servicerManagerment",
        data(){
            return {
                currentPage:0,
                userList:[],
                loading: false,
                allPage: false,
                onScroll:false,
                hasChanges:0,
                loadingimg: true,
                Feeshow: false,
                currentitem: {},
                company:''
            }
        },
        components: {
            [Loading.name]: Loading
        },
        mounted() {
            // this.loadDatas()
            let that = this;
            pushHistory()
            that.gotoURL(function () {
                pushHistory()
                let obj=JSON.parse(sessionStorage.getItem('obj'))
                that.$router.push('/index');
            })
        },
        computed: {
            companyId () {
                return localStorage.getItem('companyId')
            }
        },
        methods:{
            goDetails(value){
                this.$router.push('/index/seaServicer/seaServicerDetails?personnelId=' + value)
            },
            loadMore(){
                let that = this;
                that.company=localStorage.getItem('companyId')
                that.loading = true
                if(that.allPage === true){
                    return false;
                }
                if(that.onScroll === true){
                    return false;
                }
                that.onScroll = true;
                setTimeout(() => {
                    that.currentPage++;
                    getlistPersonPool({
                        currentPage:this.currentPage,
                        pageSize:'5'
                    }).then(res => {
                        this.loadingimg = false;
                        if(res.code === 'W3-01-0001'){
                            this.$toast('登录状态已失效');
                            this.$router.push('/')
                        }
                        this.userList = this.userList.concat(res.data.data.list)
                        console.log(this.userList)
                        this.loading = false;
                        if(res.data.list.length < 5){
                            this.allPage = true;
                        }
                        this.onScroll = false;
                        this.hasChanges = 1;
                    })
                },1000)
            },
            backOtherOrder (item) {
                this.currentitem = item
                this.Feeshow = true
            },
            confirmFee () {
                getPersonFromPool({
                    // companyId: this.companyId,
                    personnelId: this.currentitem.personnelId,
                    feeMoney: this.currentitem.feeMoney
                }).then(res => {
                    console.log(res)
                    if (res.data.code == 'I1-00-001') {
                        this.$toast('操作成功');
                        this.userList = [];
                        this.currentPage = 0;
                        this.allPage = false;
                        this.onScroll = false;
                        console.log(this.currentPage)
                        this.loadMore();
                    } else {
                        this.$toast(res.data.msg);
                    }
                })
            },
            backOrder (item) {
                retrievePersonFromPool({
                    companyId: this.companyId,
                    personnelId: item.personnelId
                }).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        this.$toast('收回成功');
                        this.userList = [];
                        this.currentPage = 0;
                        this.allPage = false;
                        this.onScroll = false;
                        this.loadMore();
                    } else {
                        this.$toast(res.data.msg);
                    }
                })
            },
            removeTosea (item) {
                moveToBroadOceanService({
                    personnelId: item.personnelId
                }).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        this.$toast('操作成功');
                        this.userList = [];
                        this.currentPage = 0;
                        this.loadMore();
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
        padding-bottom: 2.8rem;

        .item {
            width:100%;
            min-height:8.875rem;
            height: max-content;
            background:rgba(255,255,255,1);
            box-shadow:0px 7px 20px 0px rgba(0,0,0,0.08);
            border-radius:6px;
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
                    font-size: px2rem(14px);


                }

                .u-text-des {
                    font-size: px2rem(14px);
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
</style>
