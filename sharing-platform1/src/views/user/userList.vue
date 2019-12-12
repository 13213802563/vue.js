<template>
    <div>
        <mt-header title="管家系统" style="z-index: 999">
            <router-link to="/index" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <router-link to="/index/addUser" slot="right">
                <mt-button>新增</mt-button>
            </router-link>
        </mt-header>

        <div v-show="!loadingimg"
            style="overflow: scroll; position: fixed;left: 0;right: 0;top:2.4rem;bottom:0;">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" v-if="userList.length > 0">
                <div class="g-list">
                    <template v-for="value in userList">
                        <div class="item" :key="value.bmsUserId">
                            <div class="part">
                                <span class="u-text-title">账号：</span>
                                <span class="u-text-des">{{value.bmsUserName}}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">手机号：</span>
                                <span class="u-text-des">{{value.mobile}}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">角色：</span>
                                <span class="u-text-des">{{value.roleName}}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">状态：</span>
                                <span class="u-text-des">{{value.accountStatus == 1 ? '禁用': '启用'}}</span>
                            </div>
                            <div class="part" style="text-align: left;display: block;">
                                <button class="edit"
                                        @click.stop="updateOrder(value)">修改信息
                                </button>
                                <button v-if="value.accountStatus == 1" class="tosea" @click.stop="updateUserState(value)">启用</button>
                                <button v-if="value.accountStatus != 1"  class="reback" @click.stop="updateUserState(value)">禁用</button>
                            </div>
                        </div>
                    </template>
                </div>
            </van-list>
            <div class="no-list" v-if="userList && userList.length <= 0">
                <img src="@/assets/no-data.png" alt="">
            </div>
        </div>

        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa"/>
        </section>
    </div>
</template>

<script>
    // import {moveFromBroadOcean, moveToBroadOceanService} from '@/api/order.js';
    import {Loading} from 'vant';
    import {Dialog} from 'vant';
    export default {
        name: "servicerManagerment",
        components: {
            [Loading.name]: Loading,
        },
        data() {
            return {
                currentPage: 0,
                userList: [],
                loading: false,
                allPage: false,
                onScroll: false,
                loadingimg: false,
                loadingimgBottom: false,
                searchVal:'',
                searchState:true,

                //调用后台接口返回的参数
                pageNum: 2,   //当前页
                pageSize: 5,  //每页的数量
                pages: 0,     //总页数
                size: 5,      //当前页的数量
                total: 16,    //总条数

                list: [],
                loading: false,
                finished: false
            }
        },
        computed:{
            searchStates(){
                let that=this;
                return that.searchState=false
            }
        },
        watch: {
            searchVal:function(val, oldVal){
                let that=this
                that.allPage=false;
                that.onScroll=false;
                that.searchState=false;
                that.currentPage=0;
                if(val==''){
                    that.userList=[];
                    that.loadMore()
                    console.log(that.list)
                }
            }

        },
        methods: {
            // 绘制列表，支持翻页滚动
            onLoad() {
                // 异步更新数据
                let that = this;
                setTimeout(() => {
                    that.currentPage++;
                    that.$postwc('/sharePlatform-auth/userManage/queryUserList', {
                        pageNum: that.currentPage,
                        pageSize: '5',
                        companyId: localStorage.getItem('companyId')
                    }).then(res => {
                        that.userList = that.userList.concat(res.data.list);
                        // 加载状态结束
                        this.loading = false;
                        if(that.currentPage == res.data.pages){
                            this.finished = true;
                        }
                    })
                }, 300)
            },
            //禁用启用功能，改变用户状态
            updateUserState(val){
                let title = '是否禁用该账号';
                let btn = '禁用';
                let accountStatus = 1;
                let text = '禁用成功！';
                
                if(val.accountStatus == 1){
                    title = '是否启用该账号';
                    btn = '启用';
                    accountStatus = 0 ;
                    text = '启用成功！';
                }

                Dialog.confirm({
                    title: title,
                    message: '',
                    confirmButtonText:btn
                }).then(() => {
                    this.$postwc('/sharePlatform-auth/userManage/updateUserState',{
                        accountStatus: accountStatus,
                        bmsUserId: val.bmsUserId
                    }).then(res => {
                        if(res.code == 'I1-00-001'){
                            val.accountStatus = accountStatus
                            this.$toast(text);
                        }else{
                            this.$toast(res.msg)
                        }
                    })
                // on confirm
                })
            },
            //查看详情
            goDetails(value) {
                this.$router.push('/index/userDetails?bmsUserId=' + value.bmsUserId)
            },
            //修改详情
            updateOrder(item) {
                this.$router.push('/index/editUser?bmsUserId=' + item.bmsUserId)
            },
            /*搜索，该功能暂时未开发*/
            onSearch(){
                let that = this;
                that.loading = true;
                console.log(that.searchVal)
                if (that.allPage === true) {
                    return false;
                }
                if (that.onScroll === true) {
                    return false;
                }
                that.loadingimgBottom = true;
                that.onScroll = true;
                setTimeout(() => {
                    that.$post('/sharePlatform-person/personnel/managerSearch', {
                        searchValue: that.searchVal,
                    }).then(res => {
                        that.loadingimg = false;
                        if (res.code === 'W3-01-0001') {
                            that.$toast('登录状态已失效');
                            that.$router.push('/')
                        }
                        that.userList = res.data;
                        if(that.userList.length>0){
                            that.onScroll = true;
                            that.loadingimgBottom = false;
                        }else{
                            that.searchState=true
                        }


                    })
                }, 300)

            }
        },
        mounted() {
            this.onLoad();
        }
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }

    .g-list {
        padding: 0 px2rem(15px);
        // padding-bottom: 6rem;

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
