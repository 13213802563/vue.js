<template>
    <div>
        <mt-header :title="title" style="z-index: 999;width:100%;">
            <mt-button icon="back" @click="goBack()" slot="left">返回</mt-button>
        </mt-header>
        <van-notice-bar  :text="bankMsg" left-icon="volume-o"  v-if="fromRouter != '/index/subCommission' || bankStatus == 0"/>
        <div class="content">
            <van-cell-group>
                <van-field v-model="payObj.bankCardName" required clearable :disabled="bankStatus == 1" label="收款户名:" placeholder="请输入收款户名" maxlength="6"/>
                <van-field v-model="payObj.bankName" required clearable readonly :disabled="bankStatus == 1"  label="收款银行:" placeholder="请选择收款银行" maxlength="16"
                    :right-icon="bankStatus == 1?'':'arrow-down'"
                    @click="showBankList_fn" @click-right-icon="showBankList_fn"/>
                <van-field v-model="payObj.region" required clearable readonly label="开户城市:" placeholder="请选择开户城市" maxlength="16"
                    :right-icon="bankStatus == 1?'':'arrow-down'"
                    :disabled="bankStatus == 1"
                    @click="showPicker" @click-right-icon="showPicker"/>
                <van-field v-model="payObj.bankBranch" required clearable :disabled="bankStatus == 1" label="支行信息:" placeholder="请输入支行信息" maxlength="15" />
                <van-field v-model="payObj.bankCardNum" required clearable :disabled="bankStatus == 1" label="银行卡号:" placeholder="请输入银行卡号" minlength="16" maxlength="19"/>
                <van-field v-model="payObj.bankCardMobile" required clearable :disabled="bankStatus == 1"
                     label="预留手机:" placeholder="请输入银行卡预留手机号" maxlength="11"/>
                <van-field required clearable v-model="verificationCode" center v-if="bankStatus != 1" label="验证码:" placeholder="请输入短信验证码" maxlength="6">
                    <van-button slot="button" plain size="small" type="info" :disabled="timeBtn" @click="getYzm" ref="time">{{time}}</van-button>
                </van-field>
            </van-cell-group>
            <div class="g-buttons">
                <button type="primary" size="large" :disabled="saveBtn" @click="save" v-if="bankStatus == 0">保存</button>
                <!-- <button type="primary" size="large" style="margin-top: 1rem" v-if="bankStatus == 1" @click="bankStatus=2;title = '收款信息'">修改</button> -->
                <button type="primary" size="large" style="margin-top: 1rem"
                    v-if="fromRouter == '/index/subCommission'  && bankStatus !=0"
                    @click="$router.push('/index/m_cashWithdrawal');">下一步</button>
            </div>
        </div>
        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa" vertical></van-loading>
            <div>加载中...</div>
        </section>
        <!-- <div>
            <button class="mergeOrderBtn" style="left:0" >保存</button>
        </div> -->
        <mt-popup v-model="haspick"  position="bottom" style="width: 100%;height: 12rem">
            <div style="height: 20px;line-height: 20px;padding:10px;">
                <span style="color:#26a2ff;float: left;" @click="cancelAdd">取消</span>
                <span style="color:#26a2ff;float: right;" @click="pickAdd">确定</span>
            </div>
            <mt-picker :slots="myAddressSlots" valueKey="name" @change="addressChange"></mt-picker>
        </mt-popup>
        <mt-popup v-model="showBankList"  position="bottom" style="width: 100%;height: 12rem">
            <div style="height: 20px;line-height: 20px;padding:10px;">
                <span style="color:#26a2ff;float: left;" @click="cancelBank">取消</span>
                <span style="color:#26a2ff;float: right;" @click="addBank">确定</span>
            </div>
            <mt-picker :slots="bankList" valueKey="name" @change="banckChange"></mt-picker>
        </mt-popup>
    </div>
</template>
<script>
    import { Area,NoticeBar,Dialog } from 'vant';
    import threeLevelAddress from '../../api/CityCode.json';
    import { parse } from 'url';
    export default {
        name: "m_receivables",
        data(){
            return {
                payObj:{},
                showBankList:false,
                getBankName:'',
                bankList:[
                    {
                        flex: 1,
                        values: this.getbankList(),
                        className: 'slot1',
                        textAlign: 'center'
                    }
                ],
                myAddressSlots: [
                    {
                        flex: 1,
                        values: this.getProvinceArr(),
                        className: 'slot1',
                        textAlign: 'center',
                        defaultIndex:0
                    },
                    {
                        divider: true,
                        content: '-',
                        className: 'slot2'
                    },
                    {
                        flex: 1,
                        values:  this.getCityArr("请选择"),
                        className: 'slot3',
                        textAlign: 'center',
                        defaultIndex:0
                    }
                ],
                region:'',//三级地址
                province:'',//省
                city:'',//市
                county:'',//县
                provinceCode:'',//省级代码
                cityCode:'', //市级代码
                countyCode:'',//县级代码
                regionInit:false,
                haspick: false,
                getRegion:'',
                loadingimg: false,
                fromRouter:'',
                title:'收款信息',

                time:'获取验证码',
                timeBtn:false,
                verificationCode:'',

                bankStatus: 0,  //0 无银行卡（或者点修改按钮） 1
                bankMsg:'请完善收款信息，以便提现',
                tradeNo:'',
                saveBtn:false
            }
        },
        components: {
            [Area.name]: Area
        },
        mounted(){
            this.getInitData();
        },
        computed: {
            add () {
                return this.payObj.province + ' ' + this.payObj.city + ' ' + this.payObj.county
            }
        },
        methods:{
            //获取验证码
            getYzm(){
                if(this.checkInput() == false) return false;
                this.timeBtn = true;

                let timer;
                let time = 60;

                console.log(this.payObj);
                let url = '/sharePlatform-order/accountPay/addBankCard';
                this.$postwc(url,{
                    bankBranch: this.payObj.bankBranch,
                    bankCardName: this.payObj.bankCardName,
                    bankCardNum: this.payObj.bankCardNum,
                    bankCityCode:this.payObj.bankCityCode,
                    bankCityName:this.payObj.bankCityName,
                    gateId:this.payObj.bankGateId,
                    bankName: this.payObj.bankName,
                    bankCardMobile:this.payObj.bankCardMobile,
                    userBankcardId:this.payObj.userBankcardId?this.payObj.userBankcardId:''
                }).then(res=>{
                    this.loadingimg = false;
                    if(res.code == 'I1-00-001'){
                        this.tradeNo = res.data.tradeNo;
                        if(!!res.data.tradeNo == false){
                            this.$toast('银行卡信息填写有误，请核对后重新输入');
                            this.timeBtn = false;
                            return false;
                        };
                        this.$toast('验证码发送成功');
                        timer = setInterval( ()=> {
                            time--;
                            if(time == 0) {
                                clearInterval(timer);
                                this.time = "重新获取";
                                this.timeBtn = false;
                            } else {
                                this.time = time + " 秒后重试";
                            }
                        }, 1000);
                    }else{
                        this.timeBtn = false;
                        //this.$toast(res.msg);
                        this.$toast('银行卡信息填写有误，请核对后重新输入');
                    }
                })
                .catch(err =>{
                    this.$toast('网络请求超时');
                    this.timeBtn = false;
                });
            },
            getInitData(){
                this.fromRouter = this.$route.query.url;

                this.$postwc('/sharePlatform-order/accountPay/findBankCardByUserId',{}).then(res =>{
                    //{"msg":"执行成功","code":"I1-00-001","redirectUrl":"","data":{"code":"0","bankCard":{"bankBranch":"我问他安慰她我","bankName":"中国工商银行","updateTime":null,"userId":443626422257146,"bankCardMobile":null,"version":1,"userBankcardId":625319747722874,"valid":1,"protocolLd":null,"isDefault":1,"createBy":603021272581626,"createTime":"2019-11-01T13:01:37.000+0000","updateBy":null,"deleteTime":null,"gateId":"ICBC","bankCardNum":"6282284568458536854","bankCardState":1,"deleteBy":null,"bankCardName":"张安","bankCityName":"北京市","bankCityCode":"101001001"},"bankList":[{"bankListId":1,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/9de55b58270748238590b18a9077e261.png","bankCode":"ICBC","bankSupport":"1","bankName":"中国工商银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:03:28.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},{"bankListId":2,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/e39a390f9c2f4832becfb6b1ea699c05.png","bankCode":"CMB","bankSupport":"1","bankName":"招商银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},{"bankListId":3,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/9dd1881d606649fc81264ed45aa0e403.png","bankCode":"ABC","bankSupport":"1","bankName":"中国农业银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},{"bankListId":4,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/4cc9249cb12d467784a7ba6bc26a9c86.png","bankCode":"CCB","bankSupport":"1","bankName":"中国建设银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},{"bankListId":5,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/4e4de703ec144fbe835701c342f58564.png","bankCode":"CMBC","bankSupport":"1","bankName":"中国民生银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},{"bankListId":6,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/84a31dc4521d43f68aad9d8d9f219eb0.png","bankCode":"SPDB","bankSupport":"1","bankName":"浦发银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},{"bankListId":7,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/4ccc4ae29e4f4d5ca5f8ba7749193942.png","bankCode":"BOC","bankSupport":"1","bankName":"中国银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},{"bankListId":8,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/1ddffb93cd494bce8678468f4b232a3c.png","bankCode":"CEB","bankSupport":"1","bankName":"光大银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},{"bankListId":9,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/1a6243081cd64c74bdc32da0efb347e3.png","bankCode":"SHB","bankSupport":"1","bankName":"上海银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},{"bankListId":10,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/03bd0bb4569949899ec9a124c66208e5.png","bankCode":"SPAB","bankSupport":"1","bankName":"平安银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},{"bankListId":11,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/a7845db0a8a548ff95b7376c52a950ee.png","bankCode":"CZB","bankSupport":"1","bankName":"浙商银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},{"bankListId":12,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/6c3337bf69884c01957764c44973f6c0.png","bankCode":"COMM","bankSupport":"1","bankName":"交通银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},{"bankListId":13,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/6c3337bf69884c01957764c44973f6c0.png","bankCode":"CITIC","bankSupport":"1","bankName":"中信银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:49.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},{"bankListId":14,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/55fd738f6e3e4af6a500c09774399e7c.png","bankCode":"CIB","bankSupport":"1","bankName":"兴业银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:49.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},{"bankListId":15,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/9de55b58270748238590b18a9077e261.png","bankCode":"ICBC","bankSupport":"2","bankName":"中国工商银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-18T09:36:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null}],"bankCardCode":"I1-00-001","bankListCode":"I1-00-001"},"log":"","control":0,"type":"系统","status":0}

                    //回显银行卡列表
                    if(res.data.bankListCode == "I1-00-001"){
                        let arry = [];
                        let bankListAjax = res.data.bankList;
                        for(var i = 0 ;i<bankListAjax.length;i++){
                            arry.push({code:bankListAjax[i].bankListId,name:bankListAjax[i].bankName,bankGateId:bankListAjax[i].bankCode});
                        };
                        arry.unshift({code: '',name:'请选择'});
                        this.bankList[0].values = arry;
                    };
                    //回显绑定银行卡信息
                    //this.bankStatus = 0;
                    if(res.data.bankCardCode == "I1-00-001"){
                        sessionStorage.setItem('bankCard',JSON.stringify(res.data.bankCard));
                        if(this.fromRouter == "/index/subCommission") this.title = "确认收款信息";
                        this.bankStatus = 1;
                        this.bankMsg = '已绑定银行卡，银行卡不可更改！！';
                        this.payObj = res.data.bankCard;
                        if(!!this.payObj.bankGateId == false) this.payObj.bankGateId = this.searchBankIdByName(res.data.bankCard.bankName);
                        // sessionStorage.setItem('mobile',res.data.bankCard.bankCardMobile);
                        //省市县赋值
                        if( res.data.bankCard.bankCityCode){
                            let bankCityCode = res.data.bankCard.bankCityCode;
                            let proNme = this.getProvinceFromCode(bankCityCode);
                            let cityName = this.getCityFromCode(bankCityCode);
                            this.payObj.region = proNme + cityName;
                            this.myAddressSlots[0].defaultIndex = parseInt(this.getProvinceFromCode(bankCityCode,true));
                            //let $ProvinceName = this.getProvinceFromCode(proNme)
                            this.myAddressSlots[2].values = this.getCityArr(proNme);
                            this.myAddressSlots[2].defaultIndex = parseInt(this.getCityFromCode(bankCityCode,true));
                        }
                    }
                });
            },
            getbankList(){
                let arry = [];
                let bankListAjax =[
                    {"bankListId":1,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/9de55b58270748238590b18a9077e261.png","bankGateId":"ICBC","bankSupport":"1","bankName":"中国工商银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:03:28.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},
                    {"bankListId":2,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/e39a390f9c2f4832becfb6b1ea699c05.png","bankGateId":"CMB","bankSupport":"1","bankName":"招商银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},
                    {"bankListId":3,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/9dd1881d606649fc81264ed45aa0e403.png","bankGateId":"ABC","bankSupport":"1","bankName":"中国农业银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},
                    {"bankListId":4,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/4cc9249cb12d467784a7ba6bc26a9c86.png","bankGateId":"CCB","bankSupport":"1","bankName":"中国建设银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},
                    {"bankListId":5,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/4e4de703ec144fbe835701c342f58564.png","bankGateId":"CMBC","bankSupport":"1","bankName":"中国民生银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},
                    {"bankListId":6,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/84a31dc4521d43f68aad9d8d9f219eb0.png","bankGateId":"SPDB","bankSupport":"1","bankName":"浦发银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},
                    {"bankListId":7,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/4ccc4ae29e4f4d5ca5f8ba7749193942.png","bankGateId":"BOC","bankSupport":"1","bankName":"中国银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},
                    {"bankListId":8,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/1ddffb93cd494bce8678468f4b232a3c.png","bankGateId":"CEB","bankSupport":"1","bankName":"光大银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},
                    {"bankListId":9,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/1a6243081cd64c74bdc32da0efb347e3.png","bankGateId":"SHB","bankSupport":"1","bankName":"上海银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},
                    {"bankListId":10,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/03bd0bb4569949899ec9a124c66208e5.png","bankGateId":"SPAB","bankSupport":"1","bankName":"平安银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},
                    {"bankListId":11,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/a7845db0a8a548ff95b7376c52a950ee.png","bankGateId":"CZB","bankSupport":"1","bankName":"浙商银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},
                    {"bankListId":12,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/6c3337bf69884c01957764c44973f6c0.png","bankGateId":"COMM","bankSupport":"1","bankName":"交通银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},
                    {"bankListId":13,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/6c3337bf69884c01957764c44973f6c0.png","bankGateId":"CITIC","bankSupport":"1","bankName":"中信银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:49.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},
                    {"bankListId":14,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/55fd738f6e3e4af6a500c09774399e7c.png","bankGateId":"CIB","bankSupport":"1","bankName":"兴业银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-17T05:18:49.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null},
                    {"bankListId":15,"bankLogoUrl":"http://erp.95081.com/img/img/2018/07/31/9de55b58270748238590b18a9077e261.png","bankGateId":"ICBC","bankSupport":"2","bankName":"中国工商银行","updateTime":null,"version":null,"valid":1,"createBy":1,"createTime":"2019-10-18T09:36:48.000+0000","updateBy":null,"deleteTime":null,"deleteBy":null}
                ];
                for(var i = 0 ;i<bankListAjax.length;i++){
                    arry.push({code:bankListAjax[i].bankListId,name:bankListAjax[i].bankName,bankGateId:bankListAjax[i].bankGateId})
                };
                arry.unshift({code: '',name:'请选择'});
                return arry;
            },
            searchBankIdByName(name){
                let code = ''
                this.bankList[0].values.forEach((i,t) =>{
                    code = i.bankGateId;
                });
                return code;
            },
            goBack(){
                //this.$router.back(-1);
                var url = this.$route.query.url;
                this.$router.push(url);
            },
            banckChange(picker, values){
                this.payObj.bankGateId = values[0].bankGateId;
                this.payObj.bankName = values[0]["name"] == "请选择" ? "" : values[0]["name"];
            },
            addBank () {
                this.showBankList = false;
                this.getBankName = this.payObj.bankName;
            },
            cancelBank () {
                this.payObj.bankName = this.getBankName;
                this.showBankList = false;
            },
            //确定地址
            pickAdd () {
                this.haspick = false
                this.getRegion = this.payObj.region;
            },
            //取消地址
            cancelAdd () {
                this.payObj.region = this.getRegion;
                if(this.getRegion != this.payObj.region){
                    this.payObj.region=this.payObj.region;
                }
                this.haspick = false
            },
            onInput(value) {
               this.$toast(value);
            },
            onDelete() {
                this.$toast('delete');
            },
            addressChange(picker, values){
                if (this.regionInit){
                    //取值并赋值
                    let provinceName = values[0]["name"] == "请选择" ? "" : values[0]["name"];
                    let cityNmae = values[1]["name"] == "请选择" ? "" : values[1]["name"];
                    this.payObj.region = provinceName + cityNmae;
                    this.payObj.provinceCode = values[0]["code"];
                    this.payObj.cityCode = values[1]["code"];
                    //给市、县赋值
                    picker.setSlotValues(1, this.getCityArr(values[0]["name"]));

                    this.payObj.bankCityCode = values[1].code;
                    this.payObj.bankCityName = values[1].name;
                }else {
                    this.regionInit = true;
                }
            },
            showBankList_fn(){
                if(this.bankStatus != 1){
                    this.showBankList = !this.showBankList
                }
            },
            showPicker () {
                if(this.bankStatus != 1){
                    this.haspick = !this.haspick
                }
            },
            checkInput(){
                var nameReg = /^[a-zA-Z\u4e00-\u9fa5]+$/
                if(!this.payObj.bankCardName){
                    this.$toast('收款人不能为空');
                    return false;
                };
                if(!nameReg.test(this.payObj.bankCardName)){
                    this.$toast('收款人只允许中英文')
                    return false;
                };
                if(this.payObj.bankName ==''|| this.payObj.bankName ==null){
                    this.$toast('请选择收款银行')
                    return false;
                }
                if(this.payObj.region == '' || this.payObj.region == undefined){
                    this.$toast('请输入选择开户行所在城市')
                    return false;
                }
                if(!this.payObj.bankBranch){
                    this.$toast('支行信息不能为空')
                    return false;
                }
                if(!nameReg.test(this.payObj.bankBranch)){
                    this.$toast('支行信息只允许中英文')
                    return false;
                }
                var bankCardNum = /[0-9]/
                var bankCardNum1="10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
                if(!this.payObj.bankCardNum){
                    this.$toast('请填写银行卡号')
                    return false;
                }
                if(!bankCardNum.test(this.payObj.bankCardNum)){
                    this.$toast('银行卡号只能是数字')
                    return false;
                }
                if(this.payObj.bankCardNum.length<16 || this.payObj.bankCardNum.length>19){
                    this.$toast('请正确填写银行卡号')
                    return false;
                }
                if(bankCardNum1.indexOf(this.payObj.bankCardNum.substring(0, 2)) == -1) {
                    this.$toast('银行卡号开头6位不符合规范');
                    return false;
                }
                var phoneReg = /^((13[0-9])|(14[0-9])|(15[0-9])|(16[0-9])|(17[0-9])|(18[0-9]))\d{8}$/
                if(!this.payObj.bankCardMobile){
                    this.$toast('请输入手机号码')
                    return false;
                }
                if (!phoneReg.test(this.payObj.bankCardMobile)) {
                    this.$toast('手机号格式不正确')
                    return false;
                }
                return true;
            },
            save(){
                if(this.checkInput() == false) return false;
                if(this.verificationCode == ''){
                    this.$toast('验证码不能为空');
                    return false;
                };
                if(!!this.tradeNo == false){
                    return false;
                };
                this.saveBtn = true;
                return false;
                let url = '/sharePlatform-order/accountPay/bindBankCard';
                this.$postwc(url,{
                    tradeNo: this.tradeNo,
                    code: this.verificationCode
                }).then(res=>{
                    if(res.code == 'I1-00-001'){
                        this.$toast('保存成功');
                        if(this.fromRouter == "/index/subCommission"){
                            this.bankStatus = 1;
                            this.title = "确认收款信息";
                        }else{
                            this.getInitData();
                        };
                    }
                    else {
                        this.saveBtn = false;
                        this.$toast(res.msg);
                    }
                }).catch(err =>{
                    this.saveBtn = false;
                    this.$toast('网络请求超时')
                })
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
            // 根据code获取省名称或索引
            getProvinceFromCode(code,index){
                let c = code || this.workCityReback
                for(let i in threeLevelAddress){
                    if(threeLevelAddress[i].cityCode === code.toString().substr(0,6)){
                        if(!index){
                            return threeLevelAddress[i].cityName
                        }else{
                            return i;
                        }
                    }
                }
            },
            // 根据code获取市名称或索引
            getCityFromCode(code,index){
                for(let i in threeLevelAddress){
                    if(threeLevelAddress[i].cityCode === code.toString().substr(0,6)){
                        for(let j in threeLevelAddress[i].childList){
                            if(threeLevelAddress[i].childList[j].cityCode === code.toString().substr(0,9)){
                                if(!index){
                                    return threeLevelAddress[i].childList[j].cityName
                                }else{
                                    return j
                                }
                            }
                        }
                    }
                }
            },
            // 根据code获取区名称
            getAreaFromCode(code,type){
                for(let i in threeLevelAddress){
                    if(threeLevelAddress[i].cityCode === code.toString().substr(0,6)){
                        for(let j in threeLevelAddress[i].childList){
                            if(threeLevelAddress[i].childList[j].cityCode === code.toString().substr(0,9)){
                                for(let k in threeLevelAddress[i].childList[j].childList){
                                    if(threeLevelAddress[i].childList[j].childList[k].cityCode === code.toString().substr(0,12)){
                                        if(!type){
                                            return threeLevelAddress[i].childList[j].childList[k].cityName
                                        }else{
                                            return k
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
    @return $px / 16px * 1rem
    }
    .mergeOrderBtn{
        width: 100%;
        height: px2rem(42px);
        border: none;
        background: #26a2ff;
        color: #fff;
        font-weight: bold;
        outline: none;
        margin-top: px2rem(16px);
        position: fixed;
        bottom:0;
    }
    .g-list {
        padding: 0 px2rem(15px);
    .g-sec {
        margin-bottom: 1rem;
    }
    .item {
        padding: px2rem(7px) 0;
        border-bottom: 1px solid #eee;
        select{
            border: 1px solid #ddd;
            height: 1.5625rem;
            line-height: 1.5625rem;
            width: 15rem;
            outline: none;
        }
    span {
        display: inline-block;
        min-width: 6rem;
        text-align: right;
        font-size: px2rem(14px);
    i {
        font-style: normal;
        color:red;
    }
    }

    input {
        border: 1px solid #ddd;
        height: px2rem(25px);
        line-height: px2rem(25px);
        width: 15rem;
        outline: none;
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
    .content{
        padding:1rem 0rem 2rem;overflow: auto;
    }
    .loading {
        text-align:center;color:#1989fa;position: absolute;left: 0;right: 0;line-height: 40px;
        padding-top: 6rem;
        div {
            margin: 0 auto;
        }
    }
    .g-buttons {
        margin: 0 auto;
        margin-top: 2rem;
        padding:0 2rem;
        button {
            display: block;
            width: 100%;
            height: 2.2rem;
            border: none;
            background: #27a9ff;
            color: #fff;
            font-size: 1rem;
            border-radius: 10rem;
        }
    }
</style>
