<template>
    <div>
        <mt-header title="修改订单">
            <router-link to="/index/orderManagerment" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <!--<mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>
        <div class="g-list" v-if="newOrderinfo.order">
            <section class="g-sec">
                <h6>客户信息</h6>
                <div class="item">
                    <span><i>*</i>客户姓名:</span>
                    <input type="text" v-model="newOrderinfo.order.userName" maxlength="15">
                </div>
                <div class="item">
                    <span><i>*</i>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:</span>
                    <van-radio-group v-model="sex" style="display: inline-block;margin-left: 0.6rem;font-size: 0.875rem;">
                        <van-radio name="1" style="display: inline;margin-right: 0.6rem;">男</van-radio>
                        <van-radio name="2" style="display: inline;">女</van-radio>
                    </van-radio-group>
                </div>
                <div class="item">
                    <span><i>*</i>客户手机:</span>
                    <input type="text" v-model="newOrderinfo.order.userMobile">
                </div>
                <div class="item">
                    <span><i>*</i>客户省 市 区:</span>
                    <input type="text" readonly @click="showPicker" v-model="region">
                </div>
            </section>
            <section class="g-sec">
                <h6>订单详情</h6>
                <div class="item" style="display: flex;height: max-content;margin-bottom: 0.5rem">
                    <span><i>*</i>服务地址:</span>
                    <textarea class="text" name=""  cols="30" rows="10" v-model="newOrderinfo.address" style="font-size: 0.875rem;"  maxlength="50"></textarea>
                </div>
                <div class="item">
                    <span><i>*</i>开始时间:</span>
                    <input type="text" readonly v-model="newOrderinfo.startTime" @click="showtimerPicker('min')">
                </div>
                <div class="item">
                    <span>结束时间:</span>
                    <input type="text" readonly v-model="newOrderinfo.endTime" @click="showtimerPicker('max')">
                </div>
                <div class="item" style="display: flex">
                    <span><i>*</i>订单类型:</span>
                    <van-radio-group v-model="levelradio" style="display: inline-block;margin-left: 0.6rem;font-size: 0.875rem;" >
                        <van-radio :name="item.allId" style="display: inline;margin-right: 0.6rem;" v-for="(item, index) in orderType" :key="index" disabled>{{item.name}}</van-radio>
                    </van-radio-group>
                </div>
                <div class="item">
                    <span><i>*</i>支付金额:</span>
                    <input type="text" v-model="newOrderinfo.order.totalPay" maxlength="10" @input="checkPoint">
                </div>
                <div class="item" style="display: flex;height: max-content;margin-bottom: 0.5rem">
                    <span>备注:</span>
                    <textarea class="text" name=""  cols="30" rows="10" v-model="newOrderinfo.remark"  maxlength="50"
                              onchange="this.value=this.value.substring(0, 50)"
                              onkeydown="this.value=this.value.substring(0, 50)"
                              onkeyup="this.value=this.value.substring(0, 50)" ></textarea>
                </div>
            </section>
            <section class="g-sec">
                <h6>服务人员要求</h6>
                <div v-if="eduBg" class="item" style="display: flex;height: max-content;margin-bottom: 0.5rem">
                    <span>学历:</span>
                    <van-radio-group v-model="eduradio" style="display: inline-block;margin-left: 0.6rem;font-size: 0.875rem;">
                        <van-radio :name="item.index" style="display: inline;margin-right: 0.6rem;" v-for="(item, index) in eduBg" :key="index">{{item.text}}</van-radio>
                    </van-radio-group>
                </div>
                <div class="item">
                    <span>最小年龄:</span>
                    <input type="text" v-model="newOrderinfo.minAge">
                </div>
                <div class="item">
                    <span>最大年龄:</span>
                    <input type="text" v-model="newOrderinfo.maxAge">
                </div>
            </section>
            <button @click="addNew()">保存</button>
        </div>
        <mt-popup v-model="haspick"  position="bottom" style="width: 100%;height: 12rem">
            <div style="height: 20px;line-height: 20px;padding:10px;">
                <span style="color:#26a2ff;float: left;" @click="cancelAdd">取消</span>
                <span style="color:#26a2ff;float: right;" @click="pickAdd">确定</span>
            </div>
            <mt-picker :slots="myAddressSlots" valueKey="name" @change="addressChange"></mt-picker>
        </mt-popup>
        <div id="timerpicker" v-show="timePicker">
            <van-datetime-picker
                    v-model="currentDate"
                    type="datetime"
                    :min-date="minDate"
                    :max-date="maxDate"
                    @confirm="confirmTime"
                    @cancel="cancelTime"
            />
        </div>
    </div>
</template>


<script>
    import { Area, RadioGroup, Radio, DatetimePicker } from 'vant';
    import threeLevelAddress from '../api/CityCode.json';
    import { getOrderType, getOrderinfo, updateOrder, queryCity } from '@/api/order.js'
    export default {
        name: "addOrder",
        data () {
            return {
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
                minDate: new Date(),
                maxDate: new Date(2020, 12, 31),
                currentDate: new Date(),
                timePicker: false,
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
        computed: {
            orderId () {
                return this.$route.query.orderId
            },
            sex: {
                get () {
                    return String(this.newOrderinfo.sex)
                },
                set (val) {
                    this.newOrderinfo.sex = val
                }
            },
            eduradio: {
                get () {
                    return this.newOrderinfo.education
                },
                set (val) {
                    this.newOrderinfo.education = val
                }
            },
            address () {
                return this.province + ' ' + this.city + ' ' + this.county
            }
        },
        created () {
            this.getOrderinfo()
            this.queryCity()
            this.getOrderType()
        },
        methods:{
            checkPoint () {
                var payReg = /^\d+(\.\d{1,2})?$/
                if (!payReg.test(this.newOrderinfo.order.totalPay)) {
                    var s = this.newOrderinfo.order.totalPay + "";
                    this.newOrderinfo.order.totalPay = this.newOrderinfo.order.totalPay.substring(0,this.newOrderinfo.order.totalPay.indexOf(".") + 3);
                }
            },
            getOrderinfo () {
                getOrderinfo({
                    orderId: this.orderId
                }).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        this.newOrderinfo = res.data.data
                        console.log("订单对象："+res.data.data)
                        this.newOrderinfo.minAge == 0 ?  this.newOrderinfo.minAge = '' :  this.newOrderinfo.minAge = this.newOrderinfo.minAge
                        this.newOrderinfo.maxAge == 0 ?  this.newOrderinfo.maxAge = '' :  this.newOrderinfo.maxAge = this.newOrderinfo.maxAge
                        this.levelradio = Number(this.newOrderinfo.order.orderType)
                        this.provinceCode = this.newOrderinfo.order.userProvince
                        this.cityCode = this.newOrderinfo.order.userCity
                        this.countyCode = this.newOrderinfo.order.userArea
                        this.myAddressSlots[0].defaultIndex = parseInt(this.getProvinceFromCode(this.provinceCode,true))
                        let $ProvinceName = this.getProvinceFromCode(this.cityCode)

                        this.myAddressSlots[2].values = this.getCityArr($ProvinceName)
                        this.myAddressSlots[2].defaultIndex = parseInt(this.getCityFromCode(this.cityCode,true))
                        let $cityName = this.getCityFromCode(this.cityCode)
                        let $areaName = this.getAreaFromCode(this.countyCode)
                        this.myAddressSlots[4].values = this.getCountyArr($ProvinceName,$cityName)
                        this.myAddressSlots[4].defaultIndex = parseInt(this.getAreaFromCode(this.countyCode,true))
                    } else {
                        this.$toast(res.data.msg);
                    }
                })
            },
            getOrderType () {
                getOrderType({}).then(res => {
                    if (res.data.code === "I1-00-9999") {
                        this.orderType = res.data.data
                    } else {
                        that.$toast(res.data.msg);
                    }
                })
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
                    // console.log(picker.getSlotValue(0));
                    // console.table(picker.getSlotValues(0));
                    // console.table(picker.getValues());
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
                if (item == 'min') {
                    this.minDate = new Date()
                    this.currentDate = new Date(this.newOrderinfo.startTime.replace(/-/g,'/'))
                } else {
                    this.minDate = new Date(this.newOrderinfo.startTime.replace(/-/g,'/'))
                    this.currentDate = new Date(this.newOrderinfo.endTime.replace(/-/g,'/'))
                }
                this.timePicker = true
                this.updateTime = item
            },
            showPicker () {
                this.haspick = !this.haspick
                this.stop()
            },
            pickAdd () {
                if (this.region == '') {
                    this.newOrderinfo.region = '北京市北京市东城区'
                } else {
                    this.newOrderinfo.region = this.region
                }
                this.haspick = false
                this.move()
            },
            cancelAdd () {
                this.haspick = false
                this.move()
            },
            confirmTime (value) {
                var d = new Date(value)
                var a = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + this.addZero(d.getMinutes())
                if (this.updateTime == 'min' ) {
                    this.newOrderinfo.startTime = a
                } else {
                    this.newOrderinfo.endTime = a
                }
                this.timePicker = false
            },
            addZero (m) {
                return m < 10 ? '0'+m : m;
            },
            cancelTime () {
                this.timePicker = false
            },
            addNew () {
                var orderTypeName
                for (let i = 0; i < this.orderType.length; i++) {
                    if (this.orderType[i].allId == this.levelradio) {
                        orderTypeName = this.orderType[i].name
                    }
                }
                var nameReg = /^[a-zA-Z\u4e00-\u9fa5]+$/
                if(!this.newOrderinfo.order.userName){
                    this.$toast('请输入姓名')
                    return false;
                }
                var phoneReg = /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/
                if (!nameReg.test(this.newOrderinfo.order.userName)) {
                    this.$toast('姓名只允许中英文')
                    return false;
                }
                if(!this.newOrderinfo.order.userMobile){
                    this.$toast('请输入手机号码')
                    return false;
                }
                if (!phoneReg.test(this.newOrderinfo.order.userMobile)) {
                    this.$toast('手机号格式不正确')
                    return false;
                }
                if(!this.provinceCode||this.provinceCode=='0000'){
                    this.$toast('请输入选择客户所在省')
                    console.log(this.$toast('请输入选择客户所在省'))
                    return false;
                }
                if (!this.newOrderinfo.address) {
                    this.$toast('请输入服务地址')
                    return false;
                }
                if(this.newOrderinfo.address.length > 50){
                    this.$toast('输入服务地址超出范围')
                    this.isBtns=false;
                    return false;
                }
                if(!this.newOrderinfo.startTime){
                    this.$toast('请选择开始时间')
                    return false;
                }
                if(!this.newOrderinfo.endTime){
                    this.$toast('请选择结束时间')
                    return false;
                }
                if (new Date(this.newOrderinfo.startTime).valueOf() > new Date(this.newOrderinfo.endTime).valueOf() || new Date(this.newOrderinfo.startTime).valueOf() == new Date(this.newOrderinfo.endTime).valueOf()) {
                    this.$toast('订单开始时间只能小于结束时间')
                    return false;
                }
                var ageReg = /[0-9]/
                if (parseInt(this.newOrderinfo.minAge) > parseInt(this.newOrderinfo.maxAge)) {
                    this.$toast('最小年龄不得大于最大年龄')
                    return false;
                }
                if(!this.levelradio){
                    this.$toast('请填写订单类型')
                    return false;
                }
                if(!this.newOrderinfo.order.totalPay){
                    this.$toast('请填写支付金额')
                    return false;
                }
                var payReg = /^\d+(\.\d{1,2})?$/
                if (!payReg.test(this.newOrderinfo.order.totalPay)) {
                    this.$toast('支付金额只能输入两位小数')
                    return false;
                }
                updateOrder({
                    orderId: this.orderId,
                    order: {
                        userId: this.newOrderinfo.order.userId,
                        userName: this.newOrderinfo.order.userName,
                        userMobile: this.newOrderinfo.order.userMobile,
                        userProvince: this.provinceCode,
                        userCity: this.cityCode,
                        userArea: this.countyCode,
                        orderType: this.levelradio,
                        orderTypeName: orderTypeName,
                        totalPay: this.newOrderinfo.order.totalPay,
                        userId:this.newOrderinfo.order.userId
                    },
                    sex: this.sex,
                    address: this.newOrderinfo.address,
                    education: this.eduradio,
                    startTime: this.newOrderinfo.startTime,
                    endTime: this.newOrderinfo.endTime,
                    minAge: this.newOrderinfo.minAge,
                    maxAge: this.newOrderinfo.maxAge,
                    remark: this.newOrderinfo.remark,

                }).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        this.$toast('修改成功');
                        this.$router.push({
                            name: 'orderManagerment'
                        })
                    } else {
                        this.$toast(res.data.msg);
                    }
                })
            },
            //禁止滚动
            stop(){
                var mo=function(e){e.preventDefault();};
                document.body.style.overflow='hidden';
                document.addEventListener("touchmove",mo,false);//禁止页面滑动
            },
            /***取消滑动限制***/
            move(){
                var mo=function(e){e.preventDefault();};
                document.body.style.overflow='';//出现滚动条
                document.removeEventListener("touchmove",mo,false);
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
        .g-sec {
            margin-bottom: 1rem;
            h6 {
                font-size: px2rem(16px);
                height: px2rem(44px);
                line-height: px2rem(44px);
            }
        }
        .item {
            min-height: px2rem(44px);
            border-bottom: 1px solid #eee;
            padding-top: px2rem(7px);
            span {
                display: inline-block;
                min-width: 7rem;
                text-align: right;
                font-size: 0.875rem;
                i {
                    font-style: normal;
                    color:red;
                }
            }

            input {
                border: 1px solid #ddd;
                height: px2rem(25px);
                line-height: px2rem(25px);
                width: 14rem;
                outline: none;
                font-size: 0.875rem;
            }

            .text {
                resize: none;
                border: 1px solid #ddd;
                height: 5rem;
                width: 16rem;
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
    .pickAdd {
        position: fixed;
        bottom:0;
        left:0;
        right:0;
    }
    #timerpicker {
        position: fixed;
        bottom: 0;
        left:0;
        right:0;
    }
</style>
