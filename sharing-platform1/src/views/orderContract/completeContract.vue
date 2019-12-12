<template>
    <div>
        <mt-header :title="title" style="z-index: 999;width:100%;">
            <mt-button icon="back" @click="goBack" slot="left">返回</mt-button>
        </mt-header>
        <div class="content"  :isedit="isView" style="width:100%!important">
            <van-cell-group  v-if="contract.userRefusalCause||contract.personRefusalCause||contract.checkInstructions">
            <van-cell >
                <div class="reject rejectTitle">驳回原因</div>
                <div class="reject customerReject"  v-if="contract.userRefusalCause" >客户驳回原因:{{ contract.userRefusalCause }}</div>
                <div class="reject customerReject"  v-if="contract.personRefusalCause">服务人员驳回原因:{{ contract.personRefusalCause }}</div>
                <div class="reject customerReject" v-if="contract.checkInstructions">结算中心驳回原因:{{ contract.checkInstructions }}</div>

            </van-cell>
        </van-cell-group>
            <van-cell-group>
                <van-cell title="" value="" label="甲方(客户)信息"/>
                <van-field   v-model="contract.userName" required clearable :disabled="bankStatus == 1||isView" label="姓名:" placeholder="请输入姓名"/>

                <van-field  v-model="contract.IDType" required clearable readonly  :disabled="bankStatus == 1||isView" label="证件类型:" placeholder="请输入证件类型"
                           :right-icon="isView?'':'arrow-down'"
                           @click="isView ? '': showBankList_fn" @click-right-icon="showBankList_fn"/>

                <van-field v-model="contract.userIdnum"  required clearable :disabled="bankStatus == 1||isView" label="证件号:" placeholder="请输入证件号"  maxlength="18"/>

                <van-field  v-model="contract.region" required clearable readonly label="地址:" placeholder="请选择地址" maxlength="16"
                           :right-icon="isView?'':'arrow-down'"
                           @click="isView ? '': showPicker" @click-right-icon="showPicker"/>
                <textarea v-model="contract.userAddress" :disabled="isView" class="addCont1" name=""   rows="6" maxlength="20"  placeholder="请输入详细地址"></textarea>
            </van-cell-group>
            <van-cell-group>
                <van-cell title="" value="" label="乙方(家政公司)信息" class="titleMessage" />
                <van-field v-model="contract.personCompanyName" required     :disabled="isView || companyNumber"  maxlength="25"  label="公司名称:" placeholder="请输入公司名称"/>
                <van-field v-model="contract.region1" required clearable readonly label="地址:" placeholder="请选择地址" maxlength="16"
                           :right-icon="isView?'':'arrow-down'"
                           @click="isView ? '': showPicker1" @click-right-icon="showPicker1"/>
                <textarea class="addCont1" v-model="contract.orderCompanyAddress" :disabled="isView" name=""  rows="6" maxlength="20"  placeholder="请输入详细地址"  ></textarea>

            </van-cell-group>
            <van-cell-group>
                <van-cell title="" value="" label="丙方(服务方)信息" class="titleMessage" />

                <van-field v-model="contract.personName" required clearable :disabled="isView" label="姓名:" placeholder="请输入姓名"/>
                <van-field v-model="contract.personIdtype"  required clearable readonly :disabled="bankStatus == 1"  label="证件类型:" placeholder="请输入证件类型" maxlength="16"
                           :right-icon="isView?'':'arrow-down'"
                           @click="isView ? '': showBankList_fn_person" @click-right-icon="showBankList_fn_person"/>

                <van-field v-model="contract.personIdnum"  required clearable :disabled="bankStatus == 1||isView" label="证件号:" placeholder="请输入证件号"  maxlength="18"/>

                <van-field v-model="contract.region2" required clearable readonly label="地址:" placeholder="请选择地址" maxlength="16"
                           :right-icon="isView?'':'arrow-down'"
                                   @click="isView ? '': showPicker2" @click-right-icon="showPicker2"/>
                <textarea class="addCont1" v-model="contract.personAddress" name="" :disabled="isView" rows="6" maxlength="20"  placeholder="请输入详细地址"></textarea>

            </van-cell-group>
            <div class="serviceContent">
                <van-cell title="" value="" label="服务和款项服务" class="titleMessage" />
                <van-field v-model="contract.serviceType" required clearable readonly :disabled="bankStatus == 1"  label="服务类型:" placeholder="请输入服务类型" maxlength="16"
                           :right-icon="isView?'':'arrow-down'"
                           @click="isView ? '': showBankList_fn2" @click-right-icon="showBankList_fn2"/>

                <van-field v-model="contract.region3" required clearable readonly label="服务地址:" placeholder="请选择服务地址"
                           :right-icon="isView?'':'arrow-down'"
                           @click="isView ? '': showPicker3" @click-right-icon="showPicker3"/>
                <textarea class="addCont1" v-model="contract.serviceAddress" :disabled="isView" name=""  rows="6" maxlength="11"  placeholder="请输入详细地址" ></textarea>

                <div class="partyContent">
                    <span class="span1"><i class="iconRed">*</i>会员费:</span>
                    <input type="text" class="inputSe" placeholder="请输入会员费"  :disabled="isView"  v-model="contract.infomationFee">
                    <span class="span2">元/年</span>
                </div>
                <div class="partyContent">
                    <span class="span1"><i class="iconRed">*</i>服务费:</span>
                    <input type="text" class="inputSe" placeholder="请输入服务费"  :disabled="isView" v-model="contract.salary">
                    <span class="span2">元/月</span>
                </div>
                <div class="serviceTime">
                    <span><i>*</i>服务期限:</span>
                    <input type="text" class="timeS" onfocus="this.blur()" readonly v-model="contract.contractStartTime" @click="isView ? '': showtimerPicker('time_min')">
                    <input type="text" class="timeS" onfocus="this.blur()" readonly v-model="contract.contractEndTime" @click="isView ? '': showtimerPicker('time_max')">
                </div>
                <div class="partyContent">
                    <span class="span1"><i class="iconRed">*</i>工作天数:</span>
                    <input type="text" class="inputSe" placeholder="请输入工作天数" :disabled="isView" v-model="contract.serviceDays">
                    <span class="span2">天/月</span>
                </div>

                <div class="partyContent">
                    <span class="span1"><i class="iconRed">*</i>法定加班:</span>
                    <input type="text" class="inputSe" placeholder="请输入加班" readonly   v-bind:value="contract.holidaySalary">
                    <span class="span2">倍</span>
                    <van-icon name="arrow-down"   v-show="!isView"  style="padding-right: 6%; padding-top: 1%;float: right;" @click="showList_holidaySalary"/>
                </div>

                <van-field v-model="contract.serviceAccount" required clearable readonly :disabled="bankStatus == 1"  label="服务费结算:" placeholder="请输入服务费"
                           :right-icon="isView?'':'arrow-down'"
                           @click="isView ? '': showBankList_fn3"  @click-right-icon="showBankList_fn3"/>
            </div>
            <div class="contractContent">
                <van-cell title="" value="" label="附加合同内容" class="titleMessage" />
                <div class="itemCtont" style="display: flex;height: max-content;margin-bottom: 0.5rem">
                    <span><i class="iconRed">*</i>附加内容:</span>
                    <textarea v-model="contract.miscellaneous" :disabled="isView" class="addCont" name=""   rows="6" maxlength="50"  placeholder="请输入附加内容">
                    </textarea>
                </div>
            </div>
            <div class="g-buttons" v-if="!isView">
                <van-button type="primary"  size="large" :disabled="saveBtn" @click="save" v-if="bankStatus == 0">保存并发送合同确认短信</van-button>
            </div>
        </div>
        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa" vertical></van-loading>
            <div>加载中...</div>
        </section>
        <!--甲方地址-->
        <mt-popup v-model="haspick"  position="bottom" style="width: 100%;height: 12rem">
            <div style="height: 20px;line-height: 20px;padding:10px;">
                <span style="color:#26a2ff;float: left;" @click="cancelAdd">取消</span>
                <span style="color:#26a2ff;float: right;" @click="pickAdd">确定</span>
            </div>
            <mt-picker :slots="myAddressSlots" valueKey="name" @change="addressChange"></mt-picker>
        </mt-popup>
        <!--乙方地址-->
        <mt-popup v-model="haspick1"  position="bottom" style="width: 100%;height: 12rem">
            <div style="height: 20px;line-height: 20px;padding:10px;">
                <span style="color:#26a2ff;float: left;" @click="cancelAdd1">取消</span>
                <span style="color:#26a2ff;float: right;" @click="pickAdd1">确定</span>
            </div>
            <mt-picker :slots="myAddressSlots" valueKey="name" @change="addressChange1"></mt-picker>
        </mt-popup>
        <mt-popup v-model="haspick2"  position="bottom" style="width: 100%;height: 12rem">
            <div style="height: 20px;line-height: 20px;padding:10px;">
                <span style="color:#26a2ff;float: left;" @click="cancelAdd2">取消</span>
                <span style="color:#26a2ff;float: right;" @click="pickAdd2">确定</span>
            </div>
            <mt-picker :slots="myAddressSlots" valueKey="name" @change="addressChange2"></mt-picker>
        </mt-popup>
        <mt-popup v-model="haspick3"  position="bottom" style="width: 100%;height: 12rem">
            <div style="height: 20px;line-height: 20px;padding:10px;">
                <span style="color:#26a2ff;float: left;" @click="cancelAdd3">取消</span>
                <span style="color:#26a2ff;float: right;" @click="pickAdd3">确定</span>
            </div>
            <mt-picker :slots="myAddressSlots" valueKey="name" @change="addressChange3"></mt-picker>
        </mt-popup>
         <!--111-->
        <mt-popup v-model="showBankList"  position="bottom" style="width: 100%;height: 12rem">
            <div style="height: 20px;line-height: 20px;padding:10px;">
                <span style="color:#26a2ff;float: left;" @click="cancelBank">取消</span>
                <span style="color:#26a2ff;float: right;" @click="addBank">确定</span>
            </div>
            <mt-picker :slots="bankList" valueKey="name" @change="banckChange"></mt-picker>
        </mt-popup>
        <!--丙方证件类型-->
        <mt-popup v-model="showBankListPerson"  position="bottom" style="width: 100%;height: 12rem">
            <div style="height: 20px;line-height: 20px;padding:10px;">
                <span style="color:#26a2ff;float: left;" @click="cancelBank">取消</span>
                <span style="color:#26a2ff;float: right;" @click="addBank">确定</span>
            </div>
            <mt-picker :slots="bankList" valueKey="name" @change="banckChangePerson"></mt-picker>
        </mt-popup>
        <!--3223-->
        <mt-popup v-model="showBankList2"  position="bottom" style="width: 100%;height: 12rem">
            <div style="height: 20px;line-height: 20px;padding:10px;">
                <span style="color:#26a2ff;float: left;" @click="cancelBank">取消</span>
                <span style="color:#26a2ff;float: right;" @click="addBank">确定</span>
            </div>
            <mt-picker :slots="serviceType" valueKey="name"  @change="bankService"></mt-picker>
        </mt-popup>
        <!--3333-->
        <mt-popup v-model="showBankList3"  position="bottom" style="width: 100%;height: 12rem">
            <div style="height: 20px;line-height: 20px;padding:10px;">
                <span style="color:#26a2ff;float: left;" @click="cancelBank">取消</span>
                <span style="color:#26a2ff;float: right;" @click="addBank">确定</span>
            </div>
            <mt-picker :slots="serviceSchedule" valueKey="name"  @change="contractSchedule"></mt-picker>
        </mt-popup>
        <!--法定加班下拉-->
        <mt-popup v-model="showListHolidaySalary"  v-if="!isView"   position="bottom" style="width: 100%;height: 12rem">
            <div style="height: 20px;line-height: 20px;padding:10px;">
                <span style="color:#26a2ff;float: left;" @click="cancelBank">取消</span>
                <span style="color:#26a2ff;float: right;" @click="addBank">确定</span>
            </div>
            <mt-picker :slots="listHolidaySalary" valueKey="name"  @change="changeHolidaySalary"></mt-picker>
        </mt-popup>
        <div id="timerpicker" v-show="timePicker">
            <van-datetime-picker
                    v-model="currentDate"
                    type="datetime"
                    :min-date="minDate"
                    :max-date="maxDate"
                    @confirm="confirmTime"
                    @cancel="cancelTime"
                    bind:input="onInput"
            />
        </div>
    </div>
</template>
<script>
    import { Area,NoticeBar,Dialog,RadioGroup,Radio, DatetimePicker} from 'vant';
    import { getOrderType, getOrderinfo, updateOrder, queryCity } from '@/api/order.js'
    import threeLevelAddress from '../../api/CityCode.json';
    import { parse } from 'url';
    export default {
        name: "m_enterBusiness",
        data(){
            return {
                value1: 0,
                pickerValue:'',
                selectInput:[],
                contract:{
                    checkStatus:'',
                    contractStartTime:'2010/01/01 00:00:00',
                    contractEndTime:'2030/12/31 00:00:00',
                    userId:'',
                    orderContractId:'',
                    personId:'',
                    orderCompanyId:'',
                    personCompanyId:'',
                    orderSignedId:'',
                    region:'',
                    region1:'',
                    region2:'',
                    region3:'',
                    IDType:'',
                    personIdtype:'',//丙方证件类型
                    personCompanyName:'',
                    cardType2:'',
                    personIdnum:'',
                    personName:'',
                    orderContractNo:'',
                    // 甲方
                    userProvince:'',
                    userCity:'',
                    userArea:'',
                    userAddress:'',
                    // 乙方
                    personCompanyProvince:'',
                    personCompanyCity:'',
                    personCompanyArea:'',
                    orderCompanyAddress:'',
                    // 丙方
                    personProvince:'',
                    personCity:'',
                    personArea:'',
                    personAddress:'',
                    // 服务
                    serviceAddressProvince:'',
                    serviceAddressCity:'',
                    serviceAddressArea:'',
                    serviceAddress:'',
                    serviceType:'',
                    serviceAccount:'',
                    infomationFee:'',
                    salary:'',
                    serviceDays:'',
                    holidaySalary:'',
                    miscellaneous:'',
                    JiaAdress:'',
                    BingAdress:'',
                    ServiceAdress:'',
                    YiAdress:'',
                    orderSelect1:'',
                    selectPersonIdtype:'',
                    orderSelect2:'',
                    orderSelect3:'',
                    orderSelect4:'',
                    personMobile:'',
                    userMobile:'',
                    personStatus:0,
                    userStatus:0,
                    contractStatus:2,
                    checkInstructions:'',
                    // 客户拒绝签约原因
                    userRefusalCause:'',
                    // 服务人员拒绝签约原因
                    personRefusalCause:'',
                },
                companyNumber:false,
                polDate:'',
                editcon:'',
                bankList:[
                    {
                        flex: 1,
                        values:this.getIDType(),
                        className: 'slot1',
                        textAlign: 'center'
                    }
                ],
                serviceType:[
                    {
                        flex: 1,
                        values:this.getserviceType(),
                        className: 'slot2',
                        textAlign: 'center'
                    }
                ],
                serviceSchedule:[
                    {
                        flex: 1,
                        values:this.getserviceSchedule(),
                        className: 'slot3',
                        textAlign: 'center'
                    }
                ],
                //法定加班
                listHolidaySalary:[
                    {
                        flex: 1,
                        values:this.getHolidaySalary(),
                        className: 'slot4',
                        textAlign: 'center'
                    }
                ],
                bankStatus: 0,  //0 无银行卡（或者点修改按钮） 1
                showBankList:false,
                showBankListPerson:false, //丙方证件类型
                showListHolidaySalary:false,//法定加班
                showBankList2:false,
                showBankList3:false,
                loadingimg: false,
                fromRouter:'',
                // title:'收款信息',
                title: this.$route.query.text,

                timeBtn:false,
                verificationCode:'',
                tradeNo:'',
                saveBtn:false,


                myAddressSlots1: [
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
                    },{
                        divider: true,
                        content: '-',
                        className: 'slot4'
                    }, {
                        flex: 1,
                        values:  this.getCountyArr("请选择","请选择"),
                        className: 'slot5',
                        textAlign: 'center'
                    }
                ],
                myAddressSlots2: [
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
                    },{
                        divider: true,
                        content: '-',
                        className: 'slot4'
                    }, {
                        flex: 1,
                        values:  this.getCountyArr("请选择","请选择"),
                        className: 'slot5',
                        textAlign: 'center'
                    }
                ],
                myAddressSlots3: [
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
                    },{
                        divider: true,
                        content: '-',
                        className: 'slot4'
                    }, {
                        flex: 1,
                        values:  this.getCountyArr("请选择","请选择"),
                        className: 'slot5',
                        textAlign: 'center'
                    }
                ],
                myAddressSlots4: [
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
                    },{
                        divider: true,
                        content: '-',
                        className: 'slot4'
                    }, {
                        flex: 1,
                        values:  this.getCountyArr("请选择","请选择"),
                        className: 'slot5',
                        textAlign: 'center'
                    }
                ],
                newOrderinfo: {},
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
                    },{
                        divider: true,
                        content: '-',
                        className: 'slot4'
                    }, {
                        flex: 1,
                        values:  this.getCountyArr("请选择","请选择"),
                        className: 'slot5',
                        textAlign: 'center'
                    }
                ],
                isView:'',
                region:'',//三级地址
                province:'',//省
                city:'',//市
                county:'',//县
                provinceCode:'',//省级代码
                cityCode:'', //市级代码
                countyCode:'',//县级代码
                regionInit:false,
                orderType: [],
                haspick: false,
                haspick1: false,
                haspick2: false,
                haspick3: false,
                levelradio: 1,
                eduBg: [
                    {
                        index: 'ed0',
                        text: '小学'
                    },
                    {
                        index: 'ed1',
                        text: '初中'
                    },
                    {
                        index: 'ed2',
                        text: '高中'
                    },
                    {
                        index: 'ed3',
                        text: '本科'
                    },
                    {
                        index: 'ed4',
                        text: '硕士'
                    }
                ],
                minHour: 10,
                maxHour: 20,
                minDate: new Date(),
                maxDate: new Date('2030/12/31  12:20:10'),
                currentDate: new Date(),
                timePicker: false,
                timePicker1:false,
                updateTime: '',
                cityInfo: {}
            }
        },
        components: {
            [Area.name]: Area,
            [RadioGroup.name]: RadioGroup,
            [Radio.name]: Radio,
            [DatetimePicker.name]: DatetimePicker
        },
        created(){
            this.queryCity()
        },
        mounted(){
            // this.isView=false;
            this.isView=this.$route.query.isView;

            if(this.$route.query.orderContractId == null || this.$route.query.orderContractId == ''){
                this.getDefaultContractInfo()
            }else {
                this.getContractDetail()
            }
            this.polr();
        },
        computed:{
            orderId () {
                return this.$route.query.orderId
            },
            address () {
                return this.province + ' ' + this.city + ' ' + this.county
            },
        },
        methods:{
            onInput(event) {
                console.log(event)
                console.log(event.detail)
                this.setData({
                    currentDate: event.detail
                });
            },
            polr(){
                return this.selectInput=[this.getIDType(),this.getserviceType(),this.getserviceSchedule(),this.getHolidaySalary()]
            },
            //法定加班
            getHolidaySalary(){
                let pol = [];
                let holidaySalary=[
                    {value:0,text:'请选择'},
                    {value:1,text:'1'},
                    {value:2,text:'2'},
                    {value:3,text:'3'},
                ];
                for(var i = 0 ;i<holidaySalary.length;i++){
                    pol.push({code:holidaySalary[i].value,name:holidaySalary[i].text})
                };
                // pol.unshift({code: '',name:'请选择'});
                return pol;
            },
            getIDType(){
                let pol = [];
                let IDType=[
                    {value:0,text:'请选择'},
                    {value:1,text:'身份证'},
                    {value:2,text:'护照'},
                    {value:3,text:'军官证'}
                ];
                for(var i = 0 ;i<IDType.length;i++){
                    pol.push({code:IDType[i].value,name:IDType[i].text})
                };
                // pol.unshift({code: '',name:'请选择'});
                return pol;
            },
            getserviceType(){
                let arry = [];
                let serviceType=[
                    {value:0,text:'请选择'},
                    {value:1,text:'月嫂'},
                    {value:2,text:'保姆'},
                    {value:3,text:'育婴师'},
                    {value:4,text:'老人陪护'},
                    {value:5,text:'钟点工'}
                ]
                for(var i = 0 ;i<serviceType.length;i++){
                    arry.push({code:serviceType[i].value,name:serviceType[i].text})
                };
                // arry.unshift({code: '',name:'请选择'});
                return arry;
            },
            //查看合同
            getContractDetail(){
                let that = this;
                that.$postwc('/sharePlatform-order/orderContract/findOrderContractById',{
                    orderContractId:this.$route.query.orderContractId,
                }).then(res =>{
                    if(res.code === 'I1-00-001'){
                        this.contract=[];
                        this.contract = res.data;
                        if (res.data.personCompanyName != ""){
                            this.companyNumber = true;
                        }
                        this.contract.userRefusalCause = res.data.userRefusalCause;
                        this.contract.personRefusalCause = res.data.personRefusalCause;
                        this.contract.checkInstructions = res.data.checkInstructions;
                        this.contract.contractStartTime=(!res.data.contractStartTime?'':res.data.contractStartTime.replace(/-/g,'/'));
                        this.contract.contractEndTime=(!res.data.contractEndTime?'':res.data.contractEndTime.replace(/-/g,'/'));
                    switch (res.data.userIdtype) {
                            case 0:this.contract.IDType = '请选择';break;
                            case 1:this.contract.IDType = '身份证';break;
                            case 2:this.contract.IDType = '护照';break;
                            case 3:this.contract.IDType = '军官证';break;
                        }
                        switch (res.data.personIdtype) {
                            case 0:this.contract.personIdtype = '请选择';break;
                            case 1:this.contract.personIdtype = '身份证';break;
                            case 2:this.contract.personIdtype = '护照';break;
                            case 3:this.contract.personIdtype = '军官证';break;
                        }
                        switch (res.data.serviceType) {
                            case 0:this.contract.serviceType = '请选择';break;
                            case 1:this.contract.serviceType = '月嫂';break;
                            case 2:this.contract.serviceType = '保姆';break;
                            case 3:this.contract.serviceType = '育婴师';break;
                            case 4:this.contract.serviceType = '老人陪护';break;
                            case 5:this.contract.serviceType = '钟点工';break;
                        }
                        switch (res.data.serviceAccount) {
                            case 0:this.contract.serviceAccount = '请选择';break;
                            case 1:this.contract.serviceAccount = '按月支付';break;
                            case 2:this.contract.serviceAccount = '按季支付';break;
                            case 3:this.contract.serviceAccount = '半年支付';break;
                            case 4:this.contract.serviceAccount = '按年支付';break;
                        }
                        var listProvince = this.getProvinceArr();
                        var listCounty=this.getCountyArr();
                        for (var i=0;i<listProvince.length;i++){

                            // userArea: "101001001002"
                            // userCity: "101001001"
                            // userId: "240302846956938"
                            if (listProvince[i].code == res.data.userProvince){
                                var province = listProvince[i].name;
                                var listCity = this.getCityArr(province);
                                for (var m=0;m<listCity.length;m++){
                                    if (listCity[m].code == res.data.userCity){
                                        var city = listCity[m].name;
                                        var listCounty=this.getCountyArr(province,city);
                                        for (var n=0;n<listCounty.length;n++){
                                            if (listCounty[n].code === res.data.userArea){
                                                var county = listCounty[n].name;
                                                that.contract.region = province + city + county;
                                            }
                                        }
                                    }
                                }
                            }
                            if (listProvince[i].code == res.data.personCompanyProvince){
                                var province1 = listProvince[i].name;
                                var listCity = this.getCityArr(province1);
                                for (var m=0;m<listCity.length;m++){
                                    if (listCity[m].code == res.data.personCompanyCity){
                                        var city1 = listCity[m].name;
                                        var listCounty=this.getCountyArr(province1,city1);
                                        for (var n=0;n<listCounty.length;n++){
                                            if (listCounty[n].code == res.data.personCompanyArea){
                                                var county1 = listCounty[n].name;
                                                that.contract.region1 = province1 + city1  + county1;
                                            }
                                        }
                                    }
                                }
                            }
                            if (listProvince[i].code == res.data.personProvince){
                                var province2 = listProvince[i].name;
                                var listCity = this.getCityArr(province2);
                                for (var m=0;m<listCity.length;m++){
                                    if (listCity[m].code == res.data.personCity){
                                        var city2 = listCity[m].name;
                                        var listCounty=this.getCountyArr(province2,city2);
                                        for (var n=0;n<listCounty.length;n++){
                                            if (listCounty[n].code == res.data.personArea){
                                                var county2 = listCounty[n].name;
                                                this.contract.region2 = province2 + city2  + county2;
                                            }
                                        }
                                    }
                                }
                            }
                            if (listProvince[i].code == res.data.serviceAddressProvince){
                                var province3 = listProvince[i].name;
                                var listCity = this.getCityArr(province3);
                                for (var m=0;m<listCity.length;m++){
                                    if (listCity[m].code == res.data.serviceAddressCity){
                                        var city3 = listCity[m].name;
                                        var listCounty=this.getCountyArr(province3,city3);
                                        for (var n=0;n<listCounty.length;n++){
                                            if (listCounty[n].code == res.data.serviceAddressArea){
                                                var county3 = listCounty[n].name;
                                                this.contract.region3 = province3 + city3  + county3;
                                            }
                                        }
                                    }
                                }
                            }

                        }

                    }else {
                        this.$toast(res.msg)
                    }
                })
            },
            getserviceSchedule(){
                let arry = [];
                let serviceSchedule=[
                    {value:0,text:'请选择'},
                    {value:1,text:'按月支付'},
                    {value:2,text:'按季支付'},
                    {value:3,text:'半年支付'},
                    {value:4,text:'按年支付'},
                ];
                for(var i = 0 ;i<serviceSchedule.length;i++){
                    arry.push({code:serviceSchedule[i].value,name:serviceSchedule[i].text})
                };
                // arry.unshift({code: '',name:'请选择'});
                return arry;

            },
            //法定加班
            changeHolidaySalary(picker,values){
                this.contract.holidaySalary = values[0]["name"] == "请选择" ? "" : values[0]["name"];
            },
            contractSchedule(picker, values){
                this.contract.serviceAccount= values[0]["name"] == "请选择" ? "" : values[0]["name"];
            },
            bankService(picker, values){
                this.contract.serviceType = values[0]["name"] == "请选择" ? "" : values[0]["name"];
            },
            banckChange(picker, values){
                // this.payObj.bankGateId = values[0].code;
                this.contract.IDType = values[0]["name"] == "请选择" ? "" : values[0]["name"];
            },
            banckChangePerson(picker, values){
                this.contract.personIdtype = values[0]["name"] == "请选择" ? "" : values[0]["name"];
            },
            goBack(){
                // console.log("dksfkdf",this.contract.contractStatus)
                if(this.contract.contractStatus===5){
                    // debugger
                    this.$router.push({
                        name:'orderManagerment',
                        query:{
                            val:2,
                            mergeActive:1
                        }
                    });
                }else if(this.contract.contractStatus===4){
                    this.$router.push({
                        name:'orderManagerment',
                        query:{
                            val:1,
                            mergeActive:2
                        }
                    });
                }else{
                    this.$router.push({
                        name:'orderManagerment',
                        query:{
                            val:1,
                            mergeActive:1
                        }
                    });
                }
            },
            addBank () {
                this.showBankList = false;
                this.showBankListPerson = false;
                this.showBankList2 = false;
                this.showBankList3 = false;
                this.showListHolidaySalary = false;//法定加班
            },
            cancelBank () {
                this.showBankList = false;
                this.showBankListPerson = false;
                this.showBankList2 = false;
                this.showBankList3 = false;
                this.showListHolidaySalary = false;//法定加班
            },
            onDelete() {
                this.$toast('delete');
            },
            //获取默认合同信息
            getDefaultContractInfo(){
                let that = this;
                that.$postwc('/sharePlatform-order/orderSigned/defaultContractInfo',{
                    orderSignedId:this.$route.query.orderSignedId
                }).then(res =>{
                    console.log(res.data)
                    if(res.code === 'I1-00-001'){
                        this.contract = res.data;
                        this.contract.checkInstructions=res.data.checkInstructions;
                        this.contract.contractStartTime=(!res.data.contractStartTime?'':res.data.contractStartTime.replace(/-/g,'/'));
                        this.contract.contractEndTime=(!res.data.contractEndTime?'':res.data.contractEndTime.replace(/-/g,'/'));
                    }else {
                        this.$toast(res.msg)
                    }
                })
            },
            showBankList_fn(){
                if(this.bankStatus != 1){
                    this.showBankList = !this.showBankList
                }
            },
            showBankList_fn_person(){
                if(this.bankStatus != 1){
                    this.showBankListPerson = !this.showBankListPerson
                }
            },
            showBankList_fn2(){
                if(this.bankStatus != 1){
                    this.showBankList2 = !this.showBankList2
                }
            },
            showBankList_fn3(){
                if(this.bankStatus != 1){
                    this.showBankList3 = !this.showBankList3
                }
            },
            //法定加班
            showList_holidaySalary(){
                if(this.bankStatus != 1){
                    this.showListHolidaySalary = !this.showListHolidaySalary;
                }
            },
            queryCity () {
                queryCity({}).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        var cityInfo = res.data.data
                        setTimeout(() => {
                            this.province = this.reginBegin(cityInfo, this.provinceCode)
                            this.myAddressSlots[0].defaultIndex = parseInt(this.getProvinceFromCode(this.province,true))
                        }, 100)
                    } else {
                        this.$toast(res.data.msg);
                    }
                })
                queryCity({
                    levels: 2
                }).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        var cityInfo = res.data.data
                        setTimeout(() => {
                            this.city = this.reginBegin(cityInfo, this.cityCode)
                        }, 100)
                    } else {
                        this.$toast(res.data.msg);
                    }
                })
                queryCity({
                    levels: 3
                }).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        var cityInfo = res.data.data
                        setTimeout(() => {
                            this.county = this.reginBegin(cityInfo, this.countyCode)
                        }, 100)
                    } else {
                        this.$toast(res.data.msg);
                    }
                })
            },

            reginBegin (data, str) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].code == str) {
                        return data[i].name
                    }
                }
            },
            addressChange(picker, values){
                if (this.regionInit){
                    //取值并赋值
                    this.region = values[0]["name"] + values[1]["name"] + values[2]["name"];
                    this.province = values[0]["name"];
                    this.city = values[1]["name"];
                    this.county = values[2]["name"];

                    this.provinceCode = values[0]["code"];
                    this.cityCode = values[1]["code"];
                    this.countyCode = values[2]["code"];
                    // 甲方
                       this.contract.userProvince=this.provinceCode,
                           this.contract.userCity=this.cityCode,
                        this.contract.userArea=this.countyCode,
                    //给市、县赋值
                    picker.setSlotValues(1, this.getCityArr(values[0]["name"]));
                    picker.setSlotValues(2, this.getCountyArr(values[0]["name"], values[1]["name"]));
                }else {
                    this.regionInit = true;
                }
            },
            addressChange1(picker, values){
                if (this.regionInit){
                    //取值并赋值
                    this.region = values[0]["name"] + values[1]["name"] + values[2]["name"];
                    this.province = values[0]["name"];
                    this.city = values[1]["name"];
                    this.county = values[2]["name"];
                    this.provinceCode = values[0]["code"];
                    this.cityCode = values[1]["code"];
                    this.countyCode = values[2]["code"];

                   this.contract.personCompanyProvince=this.provinceCode,
                    this.contract.personCompanyCity=this.cityCode,
                    this.contract.personCompanyArea=this.countyCode,
                    //给市、县赋值
                    picker.setSlotValues(1, this.getCityArr(values[0]["name"]));
                    picker.setSlotValues(2, this.getCountyArr(values[0]["name"], values[1]["name"]));
                }else {
                    this.regionInit = true;
                }
            },
            addressChange2(picker, values){
                if (this.regionInit){
                    //取值并赋值
                    this.region = values[0]["name"] + values[1]["name"] + values[2]["name"];
                    this.province = values[0]["name"];
                    this.city = values[1]["name"];
                    this.county = values[2]["name"];
                    this.provinceCode = values[0]["code"];
                    this.cityCode = values[1]["code"];
                    this.countyCode = values[2]["code"];

                    this.contract. personProvince=this.provinceCode,
                    this.contract.personCity=this.cityCode,
                    this.contract.personArea=this.countyCode,

                    //给市、县赋值
                    picker.setSlotValues(1, this.getCityArr(values[0]["name"]));
                    picker.setSlotValues(2, this.getCountyArr(values[0]["name"], values[1]["name"]));
                }else {
                    this.regionInit = true;
                }
            },
            addressChange3(picker, values){
                if (this.regionInit){
                    //取值并赋值
                    this.region = values[0]["name"] + values[1]["name"] + values[2]["name"];
                    this.province = values[0]["name"];
                    this.city = values[1]["name"];
                    this.county = values[2]["name"];
                    this.provinceCode = values[0]["code"];
                    this.cityCode = values[1]["code"];
                    this.countyCode = values[2]["code"];

                    this.contract.serviceAddressProvince=this.provinceCode,
                    this.contract.serviceAddressCity=this.cityCode,
                    this.contract.serviceAddressArea=this.countyCode,
                    //给市、县赋值
                    picker.setSlotValues(1, this.getCityArr(values[0]["name"]));
                    picker.setSlotValues(2, this.getCountyArr(values[0]["name"], values[1]["name"]));
                }else {
                    this.regionInit = true;
                }
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
                if (code){
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
            getAreaFromCode(code,index){
                for(let i in threeLevelAddress){
                    if(threeLevelAddress[i].cityCode === code.toString().substr(0,6)){
                        for(let j in threeLevelAddress[i].childList){
                            if(threeLevelAddress[i].childList[j].cityCode === code.toString().substr(0,9)){
                                for(let k in threeLevelAddress[i].childList[j].childList){
                                    if(threeLevelAddress[i].childList[j].childList[k].cityCode === code.toString().substr(0,12)){
                                        // return threeLevelAddress[i].childList[j].childList[k].cityName
                                        if (!index) {
                                            return threeLevelAddress[i].childList[j].childList[k].cityName
                                        } else {
                                            return k
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            showtimerPicker (item) {
                let that=this;
                if (item == 'time_min') {
                    that.minDate = new Date()
                    that.currentDate = new Date((that.contract.contractEndTime?that.contract.contractEndTime:'2019/09/10 10:30:00'))
                }else{
                    that.minDate = new Date((that.contract.contractStartTime?that.contract.contractStartTime:'2019/09/10 10:30:00'))
                    that.currentDate = new Date((that.contract.contractStartTime?that.contract.contractStartTime:'2019/09/10 10:30:00'))
                }
                that.timePicker = true
                that.updateTime = item

            },
            showPicker () {
                this.haspick = !this.haspick
                this.stop()
            },
            showPicker1 () {
                this.haspick1 = !this.haspick1;
                this.stop()
            },
            showPicker2 () {
                this.haspick2 = !this.haspick2;
                this.stop()
            },
            showPicker3 () {
                this.haspick3 = !this.haspick3;
                this.stop()
            },
            pickAdd () {
                if (this.region == '') {
                    this.contract.region = '北京市北京市东城区'
                } else {
                    this.contract.region = this.region;
                }
                this.haspick = false;
                this.move()
            },
            pickAdd1 () {
                if (this.region == '') {
                    this.contract.region1 = '北京市北京市东城区'
                } else {
                    this.contract.region1 = this.region;
                }
                this.haspick1 = false;
                this.move()
            },
            pickAdd2 () {
                if (this.region == '') {
                    this.contract.region2 = '北京市北京市东城区';
                } else {
                    this.contract.region2 = this.region;
                }
                this.haspick2 = false;
                this.move()
            },
            pickAdd3 () {
                if (this.region == '') {
                    this.contract.region3 = '北京市北京市东城区';
                } else {
                    this.contract.region3 = this.region;
                }
                this.haspick3 = false;
                this.move();
            },
            cancelAdd () {
                this.haspick = false;
                this.move();
            },
            cancelAdd1 () {
                this.haspick1 = false;
                this.move();
            },
            cancelAdd2 () {
                this.haspick2 = false;
                this.move();
            },
            cancelAdd3 () {
                this.haspick3 = false;
                this.move();
            },
            confirmTime (value) {
                var d = new Date(value)
                var a = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + this.addZero(d.getMinutes())

                if (this.updateTime == 'time_min' ) {
                    this.contract.contractStartTime = a
                } else {
                    this.contract.contractEndTime = a
                }
                this.timePicker = false
            },
            addZero (m) {
                return m < 10 ? '0'+m : m;
            },
            cancelTime () {
                this.timePicker = false;
            },
            //禁止滚动
            stop(e){
                var mo=function(e){
                };
                document.body.style.overflow='hidden';
                document.addEventListener("touchmove",mo,false);//禁止页面滑动
            },
            /***取消滑动限制***/
            move(e){
                var mo=function(e){e.preventDefault();};
                document.body.style.overflow='';//出现滚动条
                document.removeEventListener("touchmove",mo,false);
            },
            critique(){
                if(!this.contract.userName){
                    this.$toast('请输入姓名')
                    return false;
                }
                if(!this.contract.IDType){
                    this.$toast('请选择证件类型')
                    return false;
                }
                if(!this.contract.IDType){
                    this.$toast('请选择证件类型')
                    return false;
                }
                if(!this.contract.region||!this.contract.region1||!this.contract.region2||!this.contract.region3){
                    this.$toast('请选择省市区地址')
                    return false;
                }
                if(!this.contract.personCompanyName){
                    this.$toast('请输入公司名称')
                    return false;
                }
                if(!this.contract.personName){
                    this.$toast('请选择服务方姓名')
                    return false;
                }
                if(!this.contract.personIdtype){
                    this.$toast('请选择服务方证件类型')
                    return false;
                }
                if(!this.contract.personIdnum){
                    this.$toast('请输入服务方证件号')
                    return false;
                }
                if(!this.contract.personIdnum){
                    this.$toast('请输入服务方证件号')
                    return false;
                }
                if(!this.contract.serviceType){
                    this.$toast('请选择服务类型')
                    return false;
                }
                if(!this.contract.serviceType){
                    this.$toast('请选择服务类型')
                    return false;
                }
                if(!this.contract.infomationFee){
                    this.$toast('请填写会员费')
                    return false;
                }
                if(!this.contract.salary){
                    this.$toast('请填写服务费')
                    return false;
                }
                if(!this.contract.contractStartTime){
                    this.$toast('请选择开始时间')
                    return false;
                }
                if(!this.contract.contractEndTime){
                    this.$toast('请选择结束时间')
                    return false;
                }
                if (new Date(this.contract.contractStartTime).valueOf() > new Date(this.contract.contractEndTime).valueOf() || new Date(this.contract.contractStartTime).valueOf() == new Date(this.contract.contractEndTime).valueOf()) {
                    this.$toast('订单开始时间需小于结束时间')
                    return false;
                }
                if(!this.contract.holidaySalary){
                    this.$toast('请填写法定加班')
                    return false;
                }
                if(!this.contract.serviceAccount){
                    this.$toast('请填写服务费结算')
                    return false;
                }

                if (this.contract.serviceDays>31) {
                    this.$toast('工作天数不能大于31天')
                    return false;
                }
                return true;
            },
            save(){
                if(!this.critique()){
                    return ;
                }else{
                    this.saveBtn=true;
                    let arr2=this.polr();
                    var that = this;
                    arr2[0].forEach(function(item,index){
                        if(that.contract.IDType===item.name){
                            that.contract.orderSelect1= item.code;
                        }
                        if(that.contract.personIdtype===item.name){
                            that.contract.selectPersonIdtype= item.code;
                        }
                    })
                    arr2[1].forEach(function(item,index){
                        if(that.contract.serviceType===item.name){
                            that.contract.orderSelect2= item.code;
                        }
                    })
                    arr2[2].forEach(function(item,index){
                        if(that.contract.serviceAccount===item.name){
                            that.contract.orderSelect3= item.code;
                        }
                    })
                    //法定加班
                    arr2[3].forEach(function(item,index){
                        if(that.contract.holidaySalary===item.name){
                            that.contract.orderSelect4= item.code;
                        }
                    })
                    //新建
                    this.$postwc('/sharePlatform-order/orderContract/createOrEdit', {
                        contractEndTime: this.contract.contractEndTime ,
                        contractStartTime: this.contract.contractStartTime,

                        detailJiaAdress: this.contract.region+this.contract.userAddress,
                        detailYiAdress: this.contract.region1+this.contract.orderCompanyAddress,
                        detailBingAdress: this.contract.region2+this.contract.personAddress,
                        detailServiceAdress: this.contract.region3+this.contract.serviceAddress,

                        holidaySalary:this.contract.holidaySalary,
                        infomationFee:  this.contract.infomationFee,
                        miscellaneous: this.contract.miscellaneous,

                        personCompanyName: this.contract.personCompanyName,
                        personIdnum: this.contract.personIdnum,
                        personIdtype: this.contract.selectPersonIdtype,
                        personName: this.contract.personName,

                        salary: this.contract.salary,
                        serviceAccount:this.contract.orderSelect3,
                        serviceDays: this.contract.serviceDays,
                        serviceType: this.contract.orderSelect2,
                        userIdnum: this.contract.userIdnum,
                        userIdtype: this.contract.orderSelect1,
                        userName:this.contract.userName,
                        isShortTime:'1',
                        userId:this.contract.userId,
                        orderContractId:this.contract.orderContractId,
                        personId:this.contract.personId,
                        orderCompanyId:this.contract.orderCompanyId,
                        personCompanyId:this.contract.personCompanyId,
                        orderSignedId:this.contract.orderSignedId,
                        personMobile:this.contract.personMobile,
                        userMobile:this.contract.userMobile,
                        orderContractNo:this.contract.orderContractNo,
                        // 甲方
                        userProvince:this.contract.userProvince,
                        userCity:this.contract.userCity,
                        userArea:this.contract.userArea,
                        userAddress:this.contract.userAddress,
                        // 乙方
                        personCompanyProvince:this.contract.personCompanyProvince,
                        personCompanyCity:this.contract.personCompanyCity,
                        personCompanyArea:this.contract.personCompanyArea,
                        orderCompanyAddress:this.contract.orderCompanyAddress,
                        // 丙方
                        personProvince:this.contract.personProvince,
                        personCity:this.contract.personCity,
                        personArea:this.contract.personArea,
                        personAddress:this.contract.personAddress,
                        // 服务
                        serviceAddressProvince:this.contract.serviceAddressProvince,
                        serviceAddressCity:this.contract.serviceAddressCity,
                        serviceAddressArea:this.contract.serviceAddressArea,
                        serviceAddress:this.contract.serviceAddress,
                        personStatus:0,
                        userStatus:0,
                        contractStatus:2,
                        // 客户拒绝签约原因
                        userRefusalCause:this.contract.userRefusalCause,
                        // 服务人员拒绝签约原因
                        personRefusalCause:this.contract.personRefusalCause,
                    }).then(res => {
                        if(res.code === 'I1-00-001'){
                            this.saveBtn=true;
                            this.$toast('合同保存成功，已发送确认短信');
                            // this.isBtns=false;
                            this.$router.push({
                                name: 'orderManagerment',
                                query: {
                                    val:1
                                }
                            })
                        }else  if(res.code === 'S1-00-001'){
                            this.saveBtn=false;
                            this.$toast('企业信息不完善！');
                        }else{
                            this.saveBtn=false;
                            this.$toast(res.data.msg);
                        }
                    }).catch(err => {
                        // this.isBtns=false;
                        this.saveBtn=false;
                        this.$toast('网络异常，请稍后再试');
                    });

                }
            }
        },
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }
    .reject{
        font-size:  .9rem;
        line-height: 24px;
        background-color: #fff;
        padding: 10px 0px;
        border-bottom: 1px solid #ebedf0;
    }
    .rejectTitle{
        font-weight: bold;
    }
    .customerReject{
        font-size: .8rem;
        padding-left: 5px;
    }
    .serverReject{
        font-size: .8rem;
        padding-left: 5px;
        padding-top: 10px;
        padding-bottom: 0;
        border: none;
    }
    .serviceTime {
        border-bottom: 1px solid whitesmoke;
        padding-bottom: .3rem;
        span{
            font-size: .9rem;
            padding-left: .5rem;
            i{
                color: red;
                padding-right: .3rem;
            }
        }
        .timeS{
            width: 30%;
            font-size: .9rem;
            padding: 3px;
            border: 1px solid #f0ede5;
            line-height: 1.1rem;
            margin-right: 1rem;
            margin-left: .5rem;
        }
    }
    #timerpicker,#timerpicker1 {
        position: fixed;
        bottom: 0;
        left:0;
        right:0;
    }
    .addCont1{
        margin: 1% 0% 1% 25%;
        /* margin: .3rem 1rem .3rem 6rem; */
        /* padding: .2rem; */
        font-size: .9rem;
        width: 68%;
        padding: 1%;
        border: 1px solid #ebe1e1;
    }
    .van-cell__label{
        font-size:px2rem(15px)!important;
    }

    .contractContent{
        width:100%;
        .itemCtont{
            padding: 1.5rem .5rem;
            font-size: .9rem;
            .iconRed{
                color:red;
                padding-right: px2rem(2px);
            }
            .addCont{
                width: 70%;
                margin: 0 2% 0 2%;
                padding: 1%;
                border: 1px solid #ebe1e1;
            }
        }
    }
    .serviceContent{
        .partyContent{
            width:100%;
            height: px2rem(22px);
            margin: px2rem(8px)  px2rem(8px);
            line-height: px2rem(22px);
            padding-bottom: px2rem(2px);
            border-bottom: 1px solid rgba(242,243,245,.8);
            .span1{
                width: 24%!important;
                display:inline-block;
                font-size: .9rem;
                .iconRed{
                    color:red;
                    padding-right: px2rem(2px);
                }
            }
            .inputSe{
                width: 50%;
                border: none;
                /*margin:0 2% 0 2%;*/
                font-size: .9rem;
                padding-left: .5rem;
            }
            .span2{
                font-size: .8rem;
            }

        }

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
            line-height: 2.2rem;
            border: none;
            background: #27a9ff;
            color: #fff;
            font-size: 1rem;
            border-radius: 10rem;
        }
    }
    .addBan{
        width: 100%!important;
        #addField{
            width: 70%!important;
            float: left;
        }
        span{
            width: 20%!important;
            float: left;
        }
    }
</style>
