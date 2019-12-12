
<template>
    <div>
        <mt-header title="已推送订单" style="z-index: 999">
            <router-link slot="left" to="/index/servicerManagerment">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
<!--        <div v-show="!loadingimg"-->
<!--             style="overflow: scroll; height: 100vh;position: fixed;left: 0;right: 0;top: 3rem;padding-top: 2.2rem">-->
<!--            <div class="g-list" v-if="list.length > 0" v-infinite-scroll="listData" :infinite-scroll-disabled="loading"-->
<!--                 infinite-scroll-distance="50">-->
<!--                <template v-for="item in list" class="g-list">-->
<!--                    <div class="item">-->
<!--                        <div class="part">-->
<!--                            <span class="u-text-title">客户姓名：</span>-->
<!--&lt;!&ndash;                            <span class="u-text-des">{{item.personnelName}}</span>&ndash;&gt;-->
<!--                            <span class="u-text-des">王世博</span>-->
<!--                        </div>-->
<!--                        <div class="part">-->
<!--                            <span class="u-text-title">管家手机号：</span>-->
<!--&lt;!&ndash;                            <span class="u-text-des">{{item.personnelName}}</span>&ndash;&gt;-->
<!--                        </div>-->
<!--                        <div class="part">-->
<!--                            <span class="u-text-title">订单类型：</span>-->
<!--&lt;!&ndash;                            <span class="u-text-des">{{item.serviceCity}}</span>&ndash;&gt;-->
<!--                            <span class="u-text-title">状态：</span>-->
<!--&lt;!&ndash;                            <span class="u-text-des">{{item.serviceCity}}</span>&ndash;&gt;-->
<!--                        </div>-->
<!--                        <div class="part">-->
<!--                            <span class="u-text-title">客户地址：</span>-->
<!--&lt;!&ndash;                            <span class="u-text-des">{{item.workingLife=='-1'?'':item.workingLife}}</span>&ndash;&gt;-->
<!--                        </div>-->
<!--                        <div class="part" style="text-align: left;display: block;">-->
<!--                            <button class="edit" @click.stop="details(item)">查看-->
<!--                            </button>-->
<!--                        </div>-->
<!--                    </div>-->

<!--                </template>-->
<!--            </div>-->
<!--            <div class="no-list" v-else>-->
<!--                <img src="../assets/no-data.png" alt="">-->
<!--            </div>-->
<!--        </div>-->
        <template class="g-list">
            <div class="item">
                <div class="part">
                    <span class="u-text-title">客户姓名：</span>
                    <!--                            <span class="u-text-des">{{item.personnelName}}</span>-->
                    <span class="u-text-des">王世博</span>
                </div>
                <div class="part">
                    <span class="u-text-title">管家手机号：</span>
                    <!--                            <span class="u-text-des">{{item.personnelName}}</span>-->
                </div>
                <div class="part">
                    <span class="u-text-title">订单类型：</span>
                    <!--                            <span class="u-text-des">{{item.serviceCity}}</span>-->
                    <span class="u-text-title">状态：</span>
                    <!--                            <span class="u-text-des">{{item.serviceCity}}</span>-->
                </div>
                <div class="part">
                    <span class="u-text-title">客户地址：</span>
                    <!--                            <span class="u-text-des">{{item.workingLife=='-1'?'':item.workingLife}}</span>-->
                </div>
                <div class="part" style="text-align: left;display: block;">
                    <button class="edit" @click.stop="details(item)">查看
                    </button>
                </div>
                <van-checkbox v-model="checked">复选框</van-checkbox>
            </div>

        </template>
        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa"/>
        </section>
        <section v-if="loadingimgBottom">
            <div class="dataLoading">加载中...</div>
        </section>
    </div>
</template>


<script>
    import {Loading} from 'vant';
    import { Checkbox, CheckboxGroup } from 'vant';
    export default {
        name: "addPushOrder",
        components: {
            [Loading.name]: Loading,
        },
        data() {
            return {
                currentPage: 0,
                list: [],
                loading: false,
                allPage: false,
                onScroll: false,
                loadingimgBottom: false,
                loadingimg: false,
                noData: false,
                checked: false
            }
        },
        methods: {
            listData() {
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
                    that.$post('/sharePlatform-person/personnel/queryPersonnel', {
                        currentPage: that.currentPage,
                        pageSize: '5',
                        companyId: localStorage.getItem('companyId')
                    }).then(res => {
                        that.loadingimg = false;
                        if (res.code === 'W3-01-0001') {
                            that.$toast('登录状态已失效');
                            that.$router.push('/')
                        }
                        that.list = that.list.concat(res.data.list)
                        that.loading = false;

                        if (res.data.list.length < 5) {
                            that.allPage = true;
                        }
                        that.onScroll = false;
                    })

                }, 300)
            }
        },
        mounted() {
            // this.listData();
            let that = this;
            // pushHistory()
            // that.gotoURL(function () {
            //     pushHistory()
            //     let obj = JSON.parse(sessionStorage.getItem('obj'))
            //     that.$router.push('/index');
            // })
        },

    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }

    .g-list {
        padding: 0 px2rem(15px);
        padding-bottom: 6rem;

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