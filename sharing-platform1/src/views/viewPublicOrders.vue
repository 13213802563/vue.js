<template>
    <div>
        <mt-header title="查看公海订单">
            <router-link to="/index" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <div style="z-index: 999;position: fixed;width:100%;background: rgb(255, 255, 255);">
            <section>
                <form action="/">
                    <van-search
                            v-model="searchName"
                            placeholder="输入姓名、手机号、工种进行搜索"
                            maxlength="16"
                            show-action
                            @input="changeSearchName"
                            @search="onSearch"
                            @cancel="onCancel"
                            @clear="clear"
                    >
                        <div slot="action" @click="onSearch">搜索</div>
                    </van-search>
                </form>
            </section>
            <div>
                <div class="item searchs" style="touch-action: none;">
                    <div>
                        <span>订单类型：</span>
                        <input v-model="orderTypeValue" type="text" readonly @click="orderTypeDom = true;">
                    </div>
                    <div>
                        <span>城市：</span>
                        <input v-model="cityValue" type="text" readonly @click="haspick = true">
                    </div>
                </div>
            </div>
            <!-- <div class="van-dropdown-menu van-hairline--top-bottom">
                <div role="button" tabindex="0" class="van-dropdown-menu__item">
                    <span class="van-dropdown-menu__title" :class="select == 0 ? 'van-dropdown-menu__title--active': ''" 
                        @click="select = 0;orderTypeDom = true;">
                        <div class="van-ellipsis">{{orderTypeValue}}</div>
                    </span>
                </div>
                <div role="button" tabindex="0" class="van-dropdown-menu__item">
                    <span class="van-dropdown-menu__title" :class="select == 1 ? 'van-dropdown-menu__title--active': ''"
                        @click="select = 1;haspick = true">
                        <div class="van-ellipsis">{{cityValue}}</div>
                    </span>
                </div>
            </div> -->
         </div>
        <div v-show="!loadingimg" class="pooll-list">
            <div class="g-list" v-if="publiceOrderList.length > 0" v-infinite-scroll="viewPool" :infinite-scroll-disabled="loading" infinite-scroll-distance="50">
                <template v-for="item in publiceOrderList" class="g-list">
                    <div class="item"  @click="details(item)" :key="item.orderId">
                        <div class="part">
                            <span class="u-text-title">客户姓名：</span>
                            <span class="u-text-des">{{item.userName}}</span>
                        </div>
                        <div class="part">
                            <span class="u-text-title">订单类型：</span>
                            <span class="u-text-des">{{item.orderTypeName}}</span>
                            <span class="u-text-title" style="margin-left: 1rem">状态：</span>
                            <span class="u-text-des">{{item.orderStatusName}}</span>
                        </div>
                        <div class="part" style="display: flex">
                            <span class="u-text-title" style="min-width: 5rem;">客户地址：</span>
                            <span class="u-text-des">{{item.userAddress}}</span>
                        </div>
                        <div class="part">
                            <span class="u-text-title">管家手机号：</span>
                            <span class="u-text-des" v-html="item.regionMobile == '' ? '--' : item.regionMobile"></span>
                        </div>
                        <div class="part" style="display: flex">
                            <span class="u-text-title" style="min-width: 5rem;">公司名称：</span>
                            <span class="u-text-des">{{item.companyName}}</span>
                        </div>

                        <div class="part" style="text-align: left;">
                            <button class="edit" @click.stop="details(item)">查看</button>
                            <button class="edit" style='margin-left: 0.5rem;' @click.stop="mergeOrder(item)">我要合单</button>
                            <!--推送服务人员页面已推送的订单 按钮展示为 已推送-->
                            <!--<button class="mergeOrder">已推送</button>-->
                        </div>
                    </div>
                </template>
                <section v-if="loadingimgBottom">
                    <div class="dataLoading" > 
                        <van-loading />
                        加载中...
                    </div>
                </section>
                <section v-else>
                    <div class="dataLoading" > 
                        没有更多数据了
                    </div>
                </section>
            </div>
            <div class="no-list" v-else>
                <img src="../assets/no-data.png" alt="">
            </div>
        </div>
        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa"/>
        </section>

       

        <van-dialog
                v-model="Feeshow"
                title="捞单"
                show-cancel-button
                @confirm="confirmFee"
        >
            <div style="text-align: center;margin: 1.2rem auto;">
                您需要花费{{currentitem.feeMoney}}元
            </div>
        </van-dialog>
        <!-- 地址三级联动 -->
        <mt-popup v-model="haspick" position="bottom" class="mt-popup-my">
            <div class="buttons">
                <button class="cancel" @click="haspick = false">取消</button>
                <button class="select" @click="pickAdd">确定</button>
            </div>
            <mt-picker :slots="myAddressSlots" valueKey="name" @change="addressChange"></mt-picker>
        </mt-popup>
        <mt-popup v-model="orderTypeDom" position="bottom" class="mt-popup-my">
            <div class="buttons">
                <button class="cancel" @click="orderTypeDom = false">
                    取消
                </button>
                <button class="select" @click="confirm">
                    确认
                </button>
            </div>
            <mt-picker :slots="orderTypes" valueKey="name" @change="onChange"></mt-picker>
        </mt-popup>
        <!-- <div v-if="orderTypeDom" class="v-modal" style="z-index: 2000;"></div>
        <van-picker v-if="orderTypeDom"
            style="position:absolute;bottom:0;left:0;right:0;z-index: 2000;height: 12rem;"
            show-toolbar
            title="订单类型"
            :default-index="defaultIndex"
            :columns="orderTypes"
            @cancel="orderTypeDom = false"
            @confirm="confirm"
            @change="onChange" 
        /> -->
        <!-- <van-picker :columns="columns" @change="onChange" /> -->
    </div>
</template>

<script>
    import {Loading} from 'vant';
    import {Dialog} from 'vant';
    import {Tab, Tabs} from 'vant';
    import { retrieveOrderFromPool,getOrderType } from '@/api/order.js'
    import threeLevelAddress from '@/api/CityCode.json';

    export default {
        name: "viewPool",
        data() {
            return {
                Feeshow: false,
                currentitem: {},
                companyId : localStorage.getItem('companyId'),
                publiceOrderList: [],
                loading: false,
                allPage: false,
                onScroll: false,
                loadingimg: true,
                currentPage: 0,
                active: 0,
                noData:false,
                searchName:'',
                approvalStatus:0,
                reason:'',     //提示驳回原因
                searchState:true,
                loadingimgBottom:true,

                select:0,// 0 选中工种，1选中城市
                // 地址三级联动
                haspick: false,
                myAddressSlots: [
                    {
                        flex: 1,
                        values: this.getProvinceArr(),
                        className: 'slot1',
                        textAlign: 'center'
                    }, {
                        divider: true,
                        content: '-',
                        className: 'slot2'
                    }, {
                        flex: 1,
                        values:  this.getCityArr("请选择"),
                        className: 'slot3',
                        textAlign: 'center'
                    }
                    // ,{
                    //     divider: true,
                    //     content: '-',
                    //     className: 'slot4'
                    // }, {
                    //     flex: 1,
                    //     values:  this.getCountyArr("请选择","请选择"),
                    //     className: 'slot5',
                    //     textAlign: 'center'
                    // }
                ],
                region:'',//三级地址
                province:'',//省
                city:'',//市
                county:'',//县
                provinceCode:'',//省级代码
                cityCode:'', //市级代码
                cityValue:'',//
                countyCode:'',//县级代码

                orderTypeDom:false,
                defaultIndex:0,
                orderTypeCode:'',//订单类型代码
                orderTypeValue:'全部',
                orderTypes: [
                    {
                        flex: 1,
                        values: '',
                        className: 'slot6',
                        textAlign: 'center',
                    }
                ]
            }
        },
        components: {
            [Loading.name]: Loading
        },
        created () {
            this.$postwc('/sharePlatform-auth/auth/getUserCheckStatus',{
            }).then(res => {
                this.approvalStatus = res.data.approvalStatus;
                if(this.approvalStatus == 2) this.reason = res.data.reason;
                console.log(this.approvalStatus);
            });

            this.getOrderType();
        },
        mounted() {
            this.viewPool()
            let that=this
            pushHistory()
            that.gotoURL(function () {
                pushHistory()
                Dialog.close()
                that.$router.push('/index');
            })
        },

        watch: {
            searchName:function(val, oldVal){
                let that=this
                that.allPage=false;
                that.onScroll=false;
                that.searchState=false;
                that.currentPage=0;
                if(val !== oldVal){
                    this.searchState = true
                    that.publiceOrderList=[];
                    this.onSearch()
                }
                if(val==''){
                    that.publiceOrderList=[];
                    that.viewPool()
                }
            }
        },

        methods: {
            getOrderType () {
                let that = this;
                getOrderType({}).then(res => {
                    if (res.data.code === "I1-00-9999") {
                        this.orderTypes[0].values = res.data.data;
                        this.orderTypes[0].values.unshift({
                            allId: '',
                            createBy: 0,
                            createTime: "2019-05-10 00:00:02",
                            log: "",
                            name: "全部",
                            updateBy: 0,
                            updateTime: "",
                            valid: 0,
                            version: 0,
                        });
                    } else {
                        that.$toast(res.data.msg);
                    }
                });
            },
            confirm(){
                this.orderTypeDom = false;
                this.onScroll = false;
                this.currentPage = 0;
                this.publiceOrderList = [];
                this.viewPool();
            },
            onChange(picker, value, index) {
                if(value[0] == undefined) return false;
                this.orderTypeValue = value[0].name;
                this.orderTypeCode = value[0].allId;
            },
            //=============地址三级联动======start=========
            pickAdd () {
                if (this.province == '') {
                    return false
                }
                console.log(this.province);
                this.onScroll = false;
                this.currentPage = 0;
                this.publiceOrderList = [];
                this.viewPool();
                this.haspick = false;
            },
            addressChange(picker, values){
                this.cityValue = values[1].name;
                //取值并赋值
                //this.region = values[0]["name"] + values[1]["name"] + values[2]["name"];
                this.province = values[0]["name"];
                this.city = values[1]["name"];
                //this.county = values[2]["name"];
                this.provinceCode = values[0]["code"] == '0000' ? '': values[0]["code"];
                this.cityCode = values[1]["code"] == '0000' ? '': values[1]["code"];
                //this.countyCode = values[2]["code"] == '0000' ? '': values[2]["code"];
                //给市、县赋值
                picker.setSlotValues(1, this.getCityArr(values[0]["name"]));
                //picker.setSlotValues(2, this.getCountyArr(values[0]["name"], values[1]["name"]));
            },
            // 省级对象数组
            getProvinceArr() {
                let provinceArr = [];
                threeLevelAddress.forEach(function (item) {
                    let obj = {};
                    obj.name = item.cityName;
                    obj.code = item.cityCode;
                    provinceArr.push(obj);
                });
                return provinceArr;
            },
            // 市级对象数组
            getCityArr(province) {
                let cityArr = [];
                threeLevelAddress.forEach(function (item) {
                    if (item.cityName === province) {
                        item.childList.forEach(function (args) {
                            let obj = {};
                            obj.name = args.cityName;
                            obj.code = args.cityCode;
                            cityArr.push(obj);
                        });
                    }
                });
                return cityArr;
            },
            // 区级对象数组
            getCountyArr(province,city){
                let countyArr = [];
                threeLevelAddress.forEach(function(item){
                    if (item.cityName === province){
                        item.childList.forEach(function (args) {
                            if (args.cityName === city){
                                args.childList.forEach(function (param) {
                                    let obj = {};
                                    obj.name=param.cityName;
                                    obj.code=param.cityCode;
                                    countyArr.push(obj);
                                })
                            }
                        });
                    }
                });
                return countyArr;
            },
            //============地址三级联动=====end=========
            //全部公海订单
            viewPool() {
                let that = this;
                this.searchState = false
                that.loading = true
                if (that.allPage === true) {
                    return false;
                }
                if (that.onScroll === true) {
                    return false;
                }
                that.loadingimgBottom = true;
                setTimeout(() => {
                    that.currentPage++;
                    that.$postwc('/sharePlatform-pool/orderConsumePool/listOrderPool', {
                        pageNum: that.currentPage,
                        userName:this.searchName,
                        userMobile:this.searchName,
                        orderTypeName:this.searchName,
                        userProvince: this.provinceCode,
                        userCity: this.cityCode,
                        userArea: this.countyCode,

                        orderType:this.orderTypeCode,
                        pageNum: this.currentPage,
                        
                        pageSize: 5,
                        isInPool:2  //0自己2看单
                    }).then(res => {
                        that.loadingimg = false;
                        if (res.code === 'W3-01-0001') {
                            that.$toast('登录状态已失效');
                            that.$router.push('/')
                        }else {
                        // this.publiceOrderList=[]
                        that.publiceOrderList = that.publiceOrderList.concat(res.data.list)
                        that.loading = false;

                        if(that.currentPage == res.data.pages){
                            that.onScroll = true;
                            that.loadingimgBottom = false;
                        }

                        this.searchState = true;
                        }
                        
                    })
                }, 300)
            },

            //查看详情
            details(item){
                let that = this;
                if(that.approvalStatus === 1){
                    that.$postwc('/sharePlatform-pool/orderConsumePool/getOrderDetailFromPool',{
                        orderId:item.orderId,
                        isInPool:2
                    }).then(res =>{

                    })
                    this.$router.push('/index/viewPublicOrders/viewPublicOrdersDetails?type=33&orderId=' + item.orderId)
                }
                if(that.approvalStatus === 0){
                    Dialog.confirm({
                        title: '',
                        message: '您需完善企业信息并通过审核后，才可进行本操作',
                        confirmButtonText:'去完善信息'
                    }).then(() => {
                        that.$router.push({ path: '/information', query: { url: '/index/viewPublicOrders' }});
                    }).catch(() => {
                        // on cancel
                        that.isBtns=false;
                    });
                }
                if(that.approvalStatus === 2){
                    Dialog.confirm({
                        title: '',
                        message: '企业注册信息被驳回，请修改信息并通过审核后，才可进行本操作\n 驳回原因：' + that.reason,
                        confirmButtonText:'去完善信息'
                    }).then(() => {
                        // on confirm
                        console.log(1)
                        that.$router.push({ path: '/information', query: { url: '/index/viewPublicOrders' }});
                    }).catch(() => {
                        // on cancel
                        that.isBtns=false;
                    });
                }
                if(that.approvalStatus === 3){
                    this.$toast('已上传执照，审核中，请耐心等待');
                    that.isBtns=false;
                }
            },

            //搜索回车、确定键
            onSearch(){
                if(this.searchName == ''){
                    return false
                }
                if(this.searchState === true){
                    this.searchState = false
                    this.currentPage = 0
                    this.allPage=false
                    this.onScroll=false
                    this.publiceOrderList = []
                    this.viewPool()
                }
            },
            //搜索取消
            onCancel(){
                this.currentPage = 0
                this.publiceOrderList=[]
                this.viewPool()
            },
            //清除搜索
            clear(){
                this.currentPage = 0
                this.publiceOrderList=[]
                this.viewPool()
            },
            changeSearchName(){
                if(this.searchName.length === 0 || this.searchName.value === ''){
                    this.currentPage = 0
                    this.publiceOrderList=[]
                    this.viewPool()
                }
            },

            //合单
            mergeOrder(item){
                let that = this;
                if(that.approvalStatus === 1){
                    this.$postwc('/sharePlatform-order/orderCombine/checkCompanyStatus',{
                        companyId:item.companyId
                    }).then(res=>{
                        if(res.data != 1 || res.code!= 'I1-00-001'){
                            this.$toast('该家政公司尚未通过注册审核，暂无法与该家政公司进行合单');
                            return false
                        } else {
                            that.personUncombinedList(item);
                        }
                    })

                }
                if(that.approvalStatus === 0){
                    Dialog.confirm({
                        title: '',
                        message: '您需完善企业信息并通过审核后，才可进行本操作',
                        confirmButtonText:'去完善信息'
                    }).then(() => {
                        that.$router.push({ path: '/information', query: { url: '/index/viewPublicOrders' }});
                    }).catch(() => {
                        // on cancel
                        that.isBtns=false;
                    });
                }
                if(that.approvalStatus === 2){
                    Dialog.confirm({
                        title: '',
                        message: '企业注册信息被驳回，请修改信息并通过审核后，才可进行本操作\n 驳回原因：' + that.reason,
                        confirmButtonText:'去完善信息'
                    }).then(() => {
                        // on confirm
                        console.log(1)
                        that.$router.push({ path: '/information', query: { url: '/index/viewPublicOrders' }});
                    }).catch(() => {
                        // on cancel
                        that.isBtns=false;
                    });
                }
                if(that.approvalStatus === 3){
                    this.$toast('已上传执照，审核中，请耐心等待');
                    that.isBtns=false;
                }
            },
            confirmFee () {
                getOrderFromPool({
                    orderId: this.currentitem.orderId,
                    isInPool: 2
                }).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        this.$toast('移出成功');
                        location.reload();
                    } else {
                        this.$toast(res.data.msg);
                    }
                })

            },

            personUncombinedList(item){
                this.$postwc('/sharePlatform-order/orderCombine/personUncombinedList',{
                    companyId:localStorage.getItem('companyId')
                }).then(res => {
                    if(res.data!==null && res.data.length > 0){
                        this.$router.push({
                            name:'mergeOrderManagerment',
                            query: {
                                orderId: item.orderId,
                                orderTypeName:item.orderTypeName,
                                confirmBy:item.rechargeBy
                            }
                        })
                    }else {
                        Dialog.confirm({
                            title: '',
                            message: '您暂无可推送的服务人员，请录入服务人员后再来合单',
                            confirmButtonText:'去录服务人员'
                        }).then(() => {
                            this.$router.push({ path: '/index/servicerManagerment/addServicer',
                                query: {
                                    // url: '/index/viewPublicOrders',
                                    mark:1
                                }
                            });
                        }).catch(() => {
                            // on cancel
                        });
                    }
                })
            },

            //查看按钮不扣积分
            toDetails(item){
                if(item.isInPool == 2 ){
                    orderId: item.orderId
                    this.$router.push('/index/viewPublicOrders/viewPublicOrdersDetails?orderId=' + item.orderId)
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }
    .searchs {
        display: flex;
        align-items: center;
        justify-content: space-around;

        div {
            text-align: center;

            input {
                border: 1px solid #ccc;
                border-radius: 0.2rem;
                width: 50%;
                text-align: center;
                padding: 0.2rem 0;
            }
        }

    }
    .mt-popup-my {
        width: 100%;
        height: 12rem;

        div.buttons {
            position: relative;
            height: 2rem;

            button {
                width: 6rem;
                height: 2rem;
                border: none;
                color: #00b7ee;
                background: #fff;
                z-index: 999;
                outline: none;
            }

            .cancel {
                position: absolute;
                left: 0;
                width: 50%;
                text-align: left;
                padding-left: 2rem;
            }

            .select {
                position: absolute;
                right: 0;
                width: 50%;
                text-align: right;
                padding-right: 2rem;
            }
        }
    }
    .van-dropdown-menu {
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        height: 50px;
        background-color: #fff;
        -webkit-user-select: none;
        user-select: none;
        a:focus, input:focus, button:focus, textarea:focus, [class*='van-']:focus {
                outline: none;
            }
        .van-dropdown-menu__item {
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            -webkit-box-flex: 1;
            -webkit-flex: 1;
            flex: 1;
            -webkit-box-align: center;
            -webkit-align-items: center;
            align-items: center;
            -webkit-box-pack: center;
            -webkit-justify-content: center;
            justify-content: center;
            min-width: 0;
            
            .van-dropdown-menu__title {
                position: relative;
                box-sizing: border-box;
                max-width: 100%;
                padding: 0 8px;
                color: #323233;
                font-size: 15px;
                line-height: 18px;
                &:after {
                    position: absolute;
                    top: 50%;
                    right: -4px;
                    margin-top: -5px;
                    border: 3px solid;
                    border-color: transparent transparent currentColor currentColor;
                    -webkit-transform: rotate(-45deg);
                    transform: rotate(-45deg);
                    opacity: 0.8;
                    content: '';
                }
            }
            .van-dropdown-menu__title--active {
                color: #1989fa;
            }
        }
    }
    .dataLoading{
        display: flex;
        justify-content: center;
        color: rgb(201, 201, 201);
        line-height: 30px;
    }
    .pooll-list{
        overflow: scroll;
        position: fixed;
        left: 0;
        right: 0;
        top: 8rem;
        bottom: 0;
    }
    .checkItem {
        background: rgba(238, 115, 165, 0.41);
        font-size: 0.875rem;
        font-weight: bold;
        color: #fff;
        border: none;
        padding: 0.5rem 0.625rem;
    }
    .mergeOrder{
        border:none;
        background: rgba(238, 225, 87, 0.41);
        height: 2rem;
        padding: 0 0.5rem;
        margin-left: 1rem;
    }
    /*.checkItemBack{*/
    /*border:none;*/
    /*background: rgba(238, 225, 87, 0.41);*/
    /*height: 2rem;*/
    /*padding: 0 0.5rem;*/
    /*}*/
    .g-list {
        padding: 0 px2rem(15px);
        padding-bottom: 16px;
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
                    word-break:break-all
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
    .edit{
        background: #c89efc;
        font-size: 0.875rem;
        font-weight: bold;
        color: #fff;
        border: none;
        padding: 0.5rem 0.625rem;
    }
</style>
