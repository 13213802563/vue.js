<template>
    <div>
        <mt-header title="查看公海服务人员详情" style="z-index: 999">
            <router-link to="/index/queryAllServicePersonnel" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <div v-show="!loadingimg" style="overflow: scroll; height: 100vh;position: fixed;left: 0;right: 0;top: 0;padding-top: 2.2rem">
            <div class="g-list" v-if="list.length > 0"  :infinite-scroll-disabled="loading">
                <template v-for="item in list" class="g-list">
                    <div class="item">
                        <div class="part">
                            <span class="u-text-title">服务人员:</span>
                            <span class="u-text-des">{{item.personnelName}}</span>
                        </div>
                        <div class="part">
                            <span class="u-text-title">城市:</span>
                            <span class="u-text-des">{{item.serviceCity}}</span>
                        </div>
                        <div class="part">
                            <span class="u-text-title">工作年限:</span>
                            <span class="u-text-des">{{item.workingLife=='-1'?'':item.workingLife}}</span>
                        </div>
                        <div class="part">
                            <span class="u-text-title">公司名称:</span>
                            <span class="u-text-des">{{item.companyName}}</span>
                        </div>
                        <div class="part">
                            <span class="u-text-title">公司电话:</span>
                            <span class="u-text-des">{{item.companyMobile}}</span>
                        </div>
                    </div>
                </template>
            </div>

        </div>
        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa"/>
        </section>
    </div>
</template>

<script>
    import {Loading} from 'vant';
    import {Dialog} from 'vant';
    export default {
        name: "poolDetails",
        data() {
            return {
                list: [],
                loading: false,
                loadingimg: true,
            }
        },
        components: {
            [Loading.name]: Loading
        },
        mounted() {
            this.detailList()
        },
        methods: {
            detailList() {
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
                    that.$post('/sharePlatform-person/personnel/queryPersonnelDetailInPool', {
                        personnelId:that.$route.query.personnelId,
                        isInputBy:that.$route.query.isInputBy,
                        isViewed:that.$route.query.isViewed
                    }).then(res => {
                        that.loadingimg = false;
                        that.loading = false;
                        if (res.code === 'W3-01-0001') {
                            that.$toast('登录状态已失效');
                            that.$router.push('/')
                        }else if(res.code==='I1-00-9999'){
                            that.list = that.list.concat(res.data)
                            if (res.data.length < 5) {
                                that.allPage = true;
                            }
                            that.onScroll = false;
                        }else if (res.code.indexOf('I1') != '-1') {
                            Dialog.alert({
                                title: '温馨提示',
                                message: res.msg
                            }).then(() => {
                                // on close
                                that.$router.push('/index/queryAllServicePersonnel')
                            });
                        } else {
                            this.$toast('请求失败，请稍后重试');
                        }

                    })

                }, 300)
            },
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
                    background: #fc4949;
                    font-size: px2rem(14px);
                    font-weight: bold;
                    color: #fff;
                    border: none;
                    height: px2rem(25px);
                    padding: px2rem(5px) px2rem(10px);
                }
            }
        }
    }

    .loading {
        padding-top: 6rem;

        div {
            margin: 0 auto;
        }
    }
</style>
