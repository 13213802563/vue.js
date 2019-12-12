<template>
    <div>
        <mt-header title="查看公海服务人员" style="z-index: 999">
            <router-link to="/index" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <van-tabs v-model="active">
            <van-tab title="全部">
                <div v-show="!loadingimg" style="overflow: scroll; height: 100vh;position: fixed;left: 0;right: 0;top: 3rem;padding-top: 2.2rem">
                    <div class="g-list" v-if="list.length > 0" v-infinite-scroll="viewPool" :infinite-scroll-disabled="loading" infinite-scroll-distance="50">
                        <template v-for="item in list" class="g-list">
                            <div class="item">
                                <div class="part">
                                    <span class="u-text-title">服务人员：</span>
                                    <span class="u-text-des">{{item.personnelName}}</span>
                                </div>
                                <div class="part">
                                    <span class="u-text-title">城市：</span>
                                    <span class="u-text-des">{{item.serviceCity}}</span>
                                </div>
                                <div class="part">
                                    <span class="u-text-title">工作年限：</span>
                                    <span class="u-text-des">{{item.workingLife=='-1'?'':item.workingLife}}</span>
                                </div>
                                <div class="part" style="text-align: left;display: block;">
                                    <button class="edit" @click.stop="details(item)">查看
                                    </button>
                                </div>
                            </div>

                        </template>
                    </div>
                    <div class="no-list" v-else>
                        <img src="../assets/no-data.png" alt="">
                    </div>
                </div>
            </van-tab>
            <van-tab title="已查看">
                <div v-show="!loadingimg"
                     style="overflow: scroll; height: 100vh;position: fixed;left: 0;right: 0;top: 3rem;padding-top: 2.2rem">
                    <div class="g-list" v-if="rightList.length > 0" v-infinite-scroll="viewPool"
                         :infinite-scroll-disabled="loading" infinite-scroll-distance="50">
                        <template v-for="item in rightList" class="g-list">
                            <div class="item">
                                <div class="part">
                                    <span class="u-text-title">家政公司：</span>
                                    <span class="u-text-des">{{item.companyName}}</span>
                                </div>
                                <div class="part">
                                    <span class="u-text-title">家政公司电话：</span>
                                    <span class="u-text-des">{{item.companyMobile}}</span>
                                </div>
                                <div class="part">
                                    <span class="u-text-title">看人时间：</span>
                                    <span class="u-text-des">{{item.createTime}}</span>
                                </div>
                                <div class="part">
                                    <span class="u-text-title">服务人员：</span>
                                    <span class="u-text-des">{{item.personName}}</span>
                                </div>
                                <div class="part">
                                    <span class="u-text-title">城市：</span>
                                    <span class="u-text-des">{{item.cityName}}</span>
                                </div>
                                <div class="part">
                                    <span class="u-text-title">工作年限：</span>
                                    <span class="u-text-des">{{item.workingLife}}</span>
                                </div>
                            </div>

                        </template>
                    </div>
                    <div class="no-list"  v-if="noData">
                        <img src="../assets/no-data.png" alt="">
                    </div>
                </div>
            </van-tab>
        </van-tabs>

        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa"/>
        </section>
        <section v-if="loadingimgBottom">
            <div class="dataLoading" >加载中...</div>
        </section>
    </div>
</template>

<script>
    import {Loading} from 'vant';
    import {Dialog} from 'vant';
    import {Tab, Tabs} from 'vant';

    export default {
        name: "viewPool",
        data() {
            return {
                list: [],
                rightList: [],
                loading: false,
                allPage: false,
                onScroll: false,
                allPageRight: false,
                onScrollRight: false,
                loadingimg: true,
                loadingimgBottom:false,
                currentPage: 0,
                currentPageRight: 0,
                active: 0,
                noData:false
            }
        },
        components: {
            [Loading.name]: Loading
        },
        mounted() {
            this.viewPool()
            let that = this;
            pushHistory()
            that.gotoURL(function () {
                pushHistory()
                let obj=JSON.parse(sessionStorage.getItem('obj'))
                that.$router.push('/index');
            })
            console.log(that.loadingimgBottom)
        },
        watch: {
            active(val) {
                if (val == 1) {
                    this.viewPoolRight()
                } else {
                    this.viewPool()
                }
            }
        },
        methods: {
            viewPool() {
                let that = this;
                that.loading = true;
                if (that.allPage === true) {
                    return false;
                }
                if (that.onScroll === true) {
                    return false;
                }
                that.loadingimgBottom = true;
                that.onScroll = true;
                setTimeout(() => {
                    that.currentPage++;
                    that.$post('/sharePlatform-person/personnel/queryPersonnelListInPool', {
                        currentPage: that.currentPage,
                        pageSize: '5'
                    }).then(res => {
                        that.loadingimg = false;

                        if (res.code === 'W3-01-0001') {
                            that.$toast('登录状态已失效');
                            that.$router.push('/')
                        }
                        that.list = that.list.concat(res.data)
                        that.loading = false;
                        if (res.data.length < 5) {
                            that.allPage = false;
                            that.onScroll = true;
                        }else{
                            that.onScroll = false;
                        }
                        that.loadingimgBottom = false;

                    })
                }, 300)
            },
            details(item) {
                if (localStorage.getItem('companyId') == item.companyId) {
                    this.$router.push('/index/poolDetails?personnelId=' + item.personnelId + '&isInputBy=1')
                } else {
                    let that = this;
                    that.$post('/sharePlatform-person/personnel/checkCurrentMessageIsViewed', {
                        personnelId:item.personnelId
                    }).then(res => {
                        that.loadingimg = false;
                        if (res.code === 'W3-01-0001') {
                            that.$toast('登录状态已失效');
                            that.$router.push('/')
                        }else if(res.code==='I1-00-9999'){
                            if(res.data=='1'){
                                this.$router.push('/index/poolDetails?personnelId=' + item.personnelId + '&isInputBy=2&isViewed=1')
                            }else{
                                // Dialog.confirm({
                                //     title: '看人',
                                //     message: '您需要花费20积分，查看此服务人员'
                                // }).then(() => {
                                //     // on confir
                                //     this.$router.push('/index/poolDetails?personnelId=' + item.personnelId + '&isInputBy=2&isViewed=2')
                                // }).catch(() => {
                                //     // on cancel
                                //     console.log(1)
                                // });
                                this.$router.push('/index/poolDetails?personnelId=' + item.personnelId + '&isInputBy=2&isViewed=2')

                            }
                            that.onScroll = false;
                        }else if (res.code.indexOf('I1') != '-1') {
                            this.$toast(res.msg);
                            this.$router.go(0)
                        } else {
                            this.$toast('请求失败，请稍后重试');
                        }
                    })


                }

                //this.$router.push('/index/poolDetails?personnelId=' + item.personnelId)
            },
            viewPoolRight() {
                let that = this;
                that.loading = true
                if (that.allPageRight === true) {
                    return false;
                }
                if (that.onScrollRight === true) {
                    return false;
                }
                that.onScrollRight = true;
                setTimeout(() => {
                    that.currentPageRight++;
                    that.$post('/sharePlatform-person/seeLog/querySeeLog', {
                        currentPage: that.currentPageRight,
                        pageSize: '5'
                    }).then(res => {

                        that.loadingimg = false;
                        if (res.code === 'W3-01-0001') {
                            that.$toast('登录状态已失效');
                            that.$router.push('/')
                        }
                        that.rightList = that.rightList.concat(res.data)
                        that.loading = false;
                        if(that.rightList.length==0){
                            that.noData=true
                        }else{
                            that.noData=false
                        }

                        if (res.data.length < 5) {
                            that.allPageRight = true;
                        }
                        that.onScrollRight = false;
                    })
                }, 300)
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
    .dataLoading{
        position: fixed;
        bottom: 0;
        display: flex;
        justify-content: center;
        z-index: 21;
        left: 40%;
    }
</style>
