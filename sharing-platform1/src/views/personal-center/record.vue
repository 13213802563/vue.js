<template>
    <div>
        <mt-header title="收支记录" style="z-index: 999;width:100%;">
            <mt-button icon="back" @click="$router.push('/index/subCommission')" slot="left">返回</mt-button>
        </mt-header>
        <div class="main" v-show="!loadingImg">
            <div v-if="recordList.length > 0" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" infinite-scroll-distance="50" >
                <template>
                    <div class="listBox item" v-for="(score ,index ) in recordList" :key="index">
                        <h4 class="titleType">{{ score.TYPE_CODE_NAME }}</h4>
                        <!-- <p v-if="score.TYPE_DESC == '支出'">银行卡号：{{ score.BANK_CARD_NUM }}</p> -->
                        <p style="margin-bottom: 0.5rem">
                            <span class="creatTime" v-if="score.TYPE_DESC == '支出'" style="color:#ccc;">银卡尾号（{{ score.BANK_CARD_NUM }}）</span>
                            <span class="creatTime" v-if="score.TYPE_DESC == '收入' && score.SHOWTYPE == '1' " style="color:#ccc;">订单号：{{ score.NOORMOBILE }}</span>
                            <span class="creatTime" v-if="score.TYPE_DESC == '收入'" style="color:#ccc;">管家账号：{{ score.RECHARGE }}</span>
                            <span class="status" style="text-align:center;">{{ score.DESCN }}</span>
                            <span class="integral" v-if="score.TYPE_DESC == '支出'">-{{score.MONEY}}</span>
                            <span class="integral" v-if="score.TYPE_DESC == '收入'">+{{score.MONEY}}</span>
                        </p>
                        <p style="margin-bottom: 0.5rem;color:#ccc;"  v-if="score.TYPE_DESC == '收入'  && score.SHOWTYPE == '2' ">服务人员手机号：{{ score.NOORMOBILE }}</p>
                        <p>{{score.CREATE_TIME}}</p>
                    </div>
                </template>
            </div>
            <div class="no-list" v-else>
                <img src="../../assets/no-data.png" alt="" style="width:100%">
            </div>
        </div>
        <section v-if="loadingImgBottom">
            <div class="dataLoading">加载中...</div>
        </section>
    </div>
</template>

<script>
    import {Loading} from 'vant';
    export default {
        name: "record",
        data(){
            return {
                loadingImgBottom: false,
                currentPage:0,
                recordList:[],
                loading: false,
                onScroll:false,
                loadingImg:true
            }
        },
        components: {
            [Loading.name]: Loading
        },
        methods:{
            loadMore(){
                let that = this;
                that.loading = true
                if (that.onScroll === true) {
                    return false;
                }
                that.onScroll = true;
                that.loadingImgBottom=true;
                setTimeout(() => {
                    that.currentPage++;
                    //TODO:更换接口
                    let url = '/sharePlatform-pay/userScoreAccount/queryUserScoreAccountList';
                        url = '/sharePlatform-order/accountPay/findAccountIncomeAndExpensesList';
                    that.$postwc(url,{
                        pageNum:that.currentPage,
                        pageSize:10,
                    }).then(res => {
                        that.loadingImg = false;
                        that.loadingImgBottom=false;
                        that.loading = false;
                        if(res.data == null) {console.log('数据为空'); return false};
                        that.recordList = that.recordList.concat(res.data.list);
                        if(that.currentPage === res.data.pages){
                            that.onScroll = true;
                        }else {
                            that.onScroll = false;
                        }
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
    .main{
        overflow: scroll;
        height: 92vh;
        position: fixed;
        left: 0;
        right: 0;
        padding-top:0;
        margin-bottom: 1rem;
    }
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
    .dataLoading {
        position: fixed;
        bottom: 1rem;
        display: flex;
        justify-content: center;
        z-index: 21;
        left: 40%;
    }
</style>