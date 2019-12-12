<template>
    <div>
        <mt-header title="新增订单">
            <!--<router-link to="/index/orderManagerment" slot="left">-->
                <!--queryAllServicePersonnel-->
                <mt-button icon="back"  @click="goBack" slot="left">返回</mt-button>
            <!--</router-link>-->
            <!--<mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>
        <div class="g-list">
            <section class="g-sec">
                <h6>客户信息</h6>
                <div class="item">
                    <span><i>*</i>客户姓名:</span>
                    <input type="text" v-model="newOrderinfo.userName" maxlength="15">
                </div>
                <div class="item">
                    <span><i>*</i>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:</span>
                    <van-radio-group v-model="sexradio" style="display: inline-block;font-size: 0.875rem;margin-left: 0.6rem;">
                        <van-radio name="1" style="display: inline;margin-right: 0.6rem;">男</van-radio>
                        <van-radio name="2" style="display: inline;">女</van-radio>
                    </van-radio-group>
                </div>
                <div class="item">
                    <span><i>*</i>客户手机:</span>
                    <input type="text" v-model="newOrderinfo.userMobile">
                </div>
                <div class="item">
                    <span><i>*</i>客户省 市 区:</span>
                    <input type="text" readonly v-model="add" @click="showPicker">
                </div>
            </section>
            <section class="g-sec">
                <h6>订单详情</h6>
                <div class="item" style="display: flex;height: max-content;margin-bottom: 0.5rem">
                    <span><i>*</i>服务地址:</span>
                    <textarea class="text" name=""  cols="30" rows="10" v-model="newOrderinfo.address" maxlength="50">
                    </textarea>
                </div>
                <div class="item">
                    <span><i>*</i>开始时间:</span>
                    <input type="text" readonly v-model="startTime" @click="showtimerPicker('min')">
                </div>
                <div class="item">
                    <span><i>*</i>结束时间:</span>
                    <input type="text" readonly v-model="endTime" @click="showtimerPicker('max')">
                </div>
                <div class="item" style="display: flex;height: max-content;margin-bottom: 0.5rem">
                    <span><i>*</i>订单类型:</span>
                    <van-radio-group v-model="levelradio" style="display: inline-block;margin-left: 0.6rem;">
                        <van-radio :name="item.allId" style="display: inline;font-size: 0.875rem;margin-right: 0.6rem;" v-for="(item, index) in orderType" :key="index">{{item.name}}</van-radio>
                    </van-radio-group>
                </div>
                <div class="item">
                    <span><i>*</i>支付金额:</span>
                    <input type="text" v-model="newOrderinfo.totalPay" maxlength="10" @input="checkPoint">
                </div>
                <div class="item" style="display: flex;height: max-content;margin-bottom: 0.5rem">
                    <span>备注:</span>
                    <textarea class="text" name=""  cols="30" rows="10" v-model="newOrderinfo.remark"  maxlength="150"></textarea>
                </div>
            </section>
            <section class="g-sec">
                <h6>服务人员要求</h6>
                <div class="item" style="display: flex;height: max-content;margin-bottom: 0.5rem">
                    <span>学历:</span>
                    <van-radio-group v-model="eduradio" style="display: inline-block;margin-left: 0.6rem;">
                        <van-radio :name="item.index" style="display: inline;font-size: 0.875rem;margin-right: 0.6rem;" v-for="(item, index) in eduBg" :key="index">{{item.text}}</van-radio>
                    </van-radio-group>
                </div>
                <div class="item">
                    <span>最小年龄:</span>
                    <input type="text" v-model="newOrderinfo.minage" maxlength="3">
                </div>
                <div class="item">
                    <span>最大年龄:</span>
                    <input type="text" v-model="newOrderinfo.maxage" maxlength="3">
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
    import { addOrder, getOrderType } from '../api/order.js'
    export default {
        name: "addOrder",
        data () {
            return {
                isBtns:false,
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
                haspick: false,
                radio: '1',
                orderType: [],
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
                startTime: '',
                endTime: '',
                updateTime: '',
                sexradio: '1',
                levelradio: 0,
                eduradio: 'ed0'
            }
        },
        components: {
            [Area.name]: Area,
            [RadioGroup.name]: RadioGroup,
            [Radio.name]: Radio,
            [DatetimePicker.name]: DatetimePicker
        },
        created () {
            this.getOrderType()
        },
        computed: {
            add () {
                return this.province + ' ' + this.city + ' ' + this.county
            }
        },
        methods:{
            goBack() {
                let pathName;
                if(this.$route.query.name =="queryAllServicePersonnel"){
                    pathName = "queryAllServicePersonnel";
                }else{
                    pathName = "orderManagerment";
                }
                this.$router.push({
                    name:pathName,
                })
            },

            checkPoint () {
                var payReg = /^\d+(\.\d{1,2})?$/
                if (!payReg.test(this.newOrderinfo.totalPay)) {
                    var s = this.newOrderinfo.totalPay + "";
                    this.newOrderinfo.totalPay = this.newOrderinfo.totalPay.substring(0,this.newOrderinfo.totalPay.indexOf(".") + 3);
                }
            },
            addressChange(picker, values){
                if (this.regionInit){
                    console.log(values);
                    //取值并赋值
                    this.region = values[0]["name"] + values[1]["name"] + values[2]["name"];
                    this.province = values[0]["name"];
                    this.city = values[1]["name"];
                    this.county = values[2]["name"];
                    this.provinceCode = values[0]["code"];
                    this.cityCode = values[1]["code"];
                    this.countyCode = values[2]["code"];
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
            showtimerPicker (item) {
                if (item == 'min') {
                    this.minDate = new Date()
                    this.currentTime = new Date()
                } else {
                    this.minDate = this.currentTime
                }
                this.timePicker = true
                this.updateTime = item
            },
            showPicker () {
                this.haspick = !this.haspick
            },
            pickAdd () {
                if (this.province == '') {
                    return false
                }
                this.haspick = false
            },
            cancelAdd () {
                this.haspick = false
            },
            getOrderType () {
                let that = this;
                getOrderType({}).then(res => {
                    console.log(res)
                    if (res.data.code === "I1-00-9999") {
                        this.orderType = res.data.data
                        this.levelradio = this.orderType[0].allId
                    } else {
                        that.$toast(res.data.msg);
                    }
                })
            },
            confirmTime (value) {
                var d = new Date(value)
                var a = d.getFullYear() + '-' + this.addZero((d.getMonth() + 1)) + '-' + this.addZero(d.getDate()) + ' ' + this.addZero(d.getHours()) + ':' + this.addZero(d.getMinutes())
                if (this.updateTime == 'min' ) {
                    this.startTime = a
                } else {
                    this.endTime = a
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
                if(this.isBtns){
                    return
                };
                this.isBtns=true;
                var orderTypeName
                for (let i = 0; i < this.orderType.length; i++) {
                    if (this.orderType[i].allId == this.levelradio) {
                        orderTypeName = this.orderType[i].name
                    }
                }
                var nameReg = /^[a-zA-Z\u4e00-\u9fa5]+$/
                if(!this.newOrderinfo.userName){
                    this.$toast('请输入姓名')
                    this.isBtns=false;
                    return false;
                }
                if (!nameReg.test(this.newOrderinfo.userName)) {
                    this.$toast('姓名只允许中英文')
                    this.isBtns=false;
                    return false;
                }
                var phoneReg = /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/
                if(!this.newOrderinfo.userMobile){
                    this.$toast('请输入手机号码')
                    this.isBtns=false;
                    return false;
                }
                if (!phoneReg.test(this.newOrderinfo.userMobile)) {
                    this.$toast('手机号格式不正确')
                    this.isBtns=false;
                    return false;
                }
                if(!this.provinceCode||this.provinceCode=='0000'){
                    this.$toast('请输入选择客户所在省')
                    this.isBtns=false;
                    return false;
                }
                if(!this.newOrderinfo.address){
                    this.$toast('请输入服务地址')
                    this.isBtns=false;
                    return false;
                }
                if(this.newOrderinfo.address.length > 50){
                    this.$toast('输入服务地址超出范围')
                    this.isBtns=false;
                    return false;
                }
                if(!this.startTime){
                    this.$toast('请选择开始时间')
                    this.isBtns=false;
                    return false;
                }
                if(!this.endTime){
                    this.$toast('请选择结束时间')
                    this.isBtns=false;
                    return false;
                }
                if (new Date(this.startTime).valueOf() > new Date(this.endTime).valueOf() || new Date(this.startTime).valueOf() == new Date(this.endTime).valueOf()) {
                    this.$toast('订单开始时间只能小于结束时间')
                    this.isBtns=false;
                    return false;
                }
                var ageReg = /[0-9]/
                if (this.newOrderinfo.minage && !ageReg.test(this.newOrderinfo.minage) || this.newOrderinfo.maxage && !ageReg.test(this.newOrderinfo.maxage)) {
                    this.$toast('年龄只能是数字')
                    return false;
                }
                if (Number(this.newOrderinfo.minage) > Number(this.newOrderinfo.maxage)) {
                    this.$toast('最小年龄不得大于最大年龄')
                    return false;
                }
                if(!orderTypeName){
                    this.$toast('请填写订单类型名称')
                    this.isBtns=false;
                    return false;
                }
                console.log(this.newOrderinfo.totalPay)
                if(!this.newOrderinfo.totalPay){
                    this.$toast('请填写支付金额')
                    this.isBtns=false;
                    return false;
                }
                var payReg = /^\d+(\.\d{1,2})?$/
                if (!payReg.test(Number(this.newOrderinfo.totalPay))) {
                    this.$toast('支付金额只能输入两位小数')
                    this.isBtns=false;
                    return false;
                }
                addOrder({
                    order: {
                        userName: this.newOrderinfo.userName,
                        userMobile: this.newOrderinfo.userMobile,
                        userProvince: this.provinceCode,
                        userCity: this.cityCode,
                        userArea: this.countyCode,
                        orderType: this.levelradio,
                        orderTypeName: orderTypeName,
                        payStatus: this.newOrderinfo.payStatus,
                        totalPay: this.newOrderinfo.totalPay,
                        companyId: localStorage.getItem('companyId'),
                        source: localStorage.getItem('companyId')
                    },
                    sex: this.sexradio,
                    address: this.newOrderinfo.address,
                    education: this.eduradio,
                    startTime: this.startTime,
                    endTime: this.endTime,
                    minAge: this.newOrderinfo.minage,
                    maxAge: this.newOrderinfo.maxage,
                    remark: this.newOrderinfo.remark
                }).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        this.$toast('创建成功')

                        let pathName;
                        if(this.$route.query.name =="queryAllServicePersonnel"){
                            pathName = "queryAllServicePersonnel";
                        }else{
                            pathName = "orderManagerment";
                        }
                        this.$router.push({
                            name:pathName,
                        })
                        //
                        // this.$router.push({
                        //     name: 'orderManagerment'
                        // })
                    } else {
                        this.$toast(res.data.msg);
                        this.isBtns=false;
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
            padding: px2rem(7px) 0;
            border-bottom: 1px solid #eee;
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

            .text {
                resize: none;
                border: 1px solid #ddd;
                height: 5rem;
                width: 16rem;
                outline: none;
            }
            .van-radio__label {
                margin-left: 4px!important;
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
