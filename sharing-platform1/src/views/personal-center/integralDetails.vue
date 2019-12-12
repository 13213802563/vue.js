<template>
    <div>
        <mt-header title="账户积分" style="z-index: 999;width:100%;">
            <mt-button icon="back" @click="$router.push('/index/per-center')" slot="left">返回</mt-button>
            <!-- <router-link to="$router.back(-1)" slot="left">
            </router-link> -->
            <!--<mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>
        <div class="money">
            <h3 style="padding-left:1rem;padding-top:1.1rem;color:white">总积分： {{totalScore}}</h3>
        </div>
        <div>
            <div class="month" v-show="!isMonthShow">
                <span style="display: inline-block;padding-left: 1rem; padding-top: 0.5rem;">{{singleMonth}}月</span>
            </div>
        </div>
        <div class="main">
            <div v-show="!loadingimg" style="overflow: scroll; height: 80vh;position: fixed;left: 0;right: 0;padding-top:0;margin-bottom: 1rem">
                <div v-if="userList.length > 0" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" infinite-scroll-distance="50" >
                    <template>
                        <div class="listBox item" v-for="(score,index) in userList" :key="index">
                            <h4 class="titleType">{{ score.typeDetailName }}</h4>
                            <p>
                                <span class="creatTime">{{ score.createTime }}</span>
                                <span class="status">{{ score.typeName }}</span>
                                <span class="integral">{{score.showScore}}</span>
                            </p>
                        </div>
                    </template>
                </div>
                <div class="no-list" v-else>
                    <img src="../../assets/no-data.png" alt="" style="width:100%">
                </div>
            </div>

        </div>
        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa"/>
        </section>
    </div>
</template>

<script>
    import {Loading} from 'vant';
    export default {
        name: "IntegralDetails",
        data(){
            return {
                currentPage:0,
                userList:[],
                loading: false,
                allPage: false,
                onScroll:false,
                loadingimg: true,
                Feeshow: false,
                feeMoney: '',
                currentItem: {},
                totalScore:0,
                month:[],
                singleMonth:0,
                isMonthShow:true
            }
        },
        created(){
            this.$postwc('/sharePlatform-pay/userScoreAccount/queryUserScoreAccount',{
            }).then(res => {
                this.totalScore = res.data.totalScore;
            })
        },
        components: {
            [Loading.name]: Loading
        },
        methods:{
            loadMore(){
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
                    that.$postwc('/sharePlatform-pay/userScoreAccount/queryUserScoreAccountList',{
                        pageNum:that.currentPage,
                        pageSize:10,
                    }).then(res => {
                        console.log(res);
                        that.loadingimg = false;
                        that.userList = that.userList.concat(res.data.list)
                        that.loading = false;
                        that.singleMonth = res.data.list[0].createTime.slice(5,7);
                        //TODO:截取月份
                        this.isMonthShow= this.singleMonth == 0 ? true : false;
                        console.log(this.isMonthShow)

                        if(res.data.list.length < 5){
                            that.allPage = true;
                        }
                        that.onScroll = false;
                    })
                },300)
            },
        },
        mounted() {
            this.loadMore()
        },
    }
</script>

<style scoped>
    .el-button{
        text-align: left !important;
    }
    .title{
        text-align: center;
        display: initial;
        color: white;
        margin-left:35%;
    }
    .el-header{
        padding:0 !important;
        background-color: rgba(38, 162, 255, 1);
        color: #333;
        text-align: left;
        line-height: 60px;
    }
    .el-button--text{
        color:white;
    }

    .money{
        width:100%;
        height: 60px;
        background-color: #4A3535;

    }
    h2{
        color:white;
    }
    .month{
        width:100%;
        text-align: left;
        background-color: #efefef;
        padding:0;
        height: 2rem;
    }
    .listBox{
        box-shadow: 0px 1px 0px 0px  #f1f1f1;
        padding-bottom: 1rem;
        margin:1rem 1rem;
    }
    .creatTime{
        width:60%;
        text-align: left;
        display: inline-block;
    }
    .status{
        width:20%;
        display: inline-block;
    }
    .integral{
        width:20%;
        text-align: right;
        display: inline-block;
    }
    .titleType{
        text-align: left;
        margin-bottom: 1rem;
    }
    .no-list{
        padding: 4.0625rem 0.9375rem 0;
        text-align: center;
        font-size: 0.9375rem;
    }
    .no-list img{
        width: 16.25rem;
    }

</style>