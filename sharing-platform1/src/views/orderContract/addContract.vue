<template>
    <div>
        <mt-header :title="this.$route.query.text" style="position: fixed;width: 100%;z-index: 999;top: 0;">
            <mt-button icon="back" @click="goBack" slot="left">返回</mt-button>
        </mt-header>
        <div class="g-list">
            <input type="hidden" name="orderContractId" :value="contract.orderContractId">
            <input type="hidden" name="orderSignedId" :value="contract.orderSignedId">
            <input type="hidden" name="userMobile" :value="contract.userMobile">
            <input type="hidden" name="personMobile" :value="contract.personMobile">

            <section class="g-sec">
                <h6>提供订单家政公司信息</h6>
                <input type="hidden" name="orderCompanyId" :value="contract.orderCompanyId">
                <input type="hidden" name="orderCompanyStatus" :value="contract.orderCompanyStatus">

                <div class="item">
                    <span class="u-text-title">公司名称:</span>
                    <span>{{contract.orderCompanyName}}</span>
                </div>
                <div class="item">
                    <span class="u-text-title">公司电话:</span>
                    <span>{{contract.orderCompanyMobile}}</span>
                </div>
            </section>
            <section class="g-sec">
                <h6>提供服务人员家政公司信息</h6>
                <input type="hidden" name="personConpanyId" :value="contract.personConpanyId">
                <input type="hidden" name="personCompanyStatus" :value="contract.personCompanyStatus">

                <div class="item">
                    <span class="u-text-title">公司名称:</span>
                    <span>{{contract.personCompanyName}}</span>
                </div>
                <div class="item">
                    <span class="u-text-title">公司电话:</span>
                    <span>{{contract.personCompanyMobile}}</span>
                </div>
            </section>
            <section class="g-sec">
                <h6>客户信息</h6>
                <input type="hidden" name="userId" :value="contract.userId">
                <input type="hidden" name="userStatus" :value="contract.userStatus">

                <div class="item">
                    <span class="u-text-title">客户名称:</span>
                    <span>{{contract.userName}}</span>
                </div>
                <div class="item">
                    <span class="u-text-title">客户管家手机号:</span>
                    <span>{{contract.orderRechargeMobile}}</span>
                </div>
            </section>
            <section class="g-sec">
                <h6>服务人员信息</h6>
                <input type="hidden" name="personId" :value="contract.personId">
                <input type="hidden" name="personStatus" :value="contract.personStatus">

                <div class="item">
                    <span class="u-text-title">服务人员姓名:</span>
                    <span>{{contract.personName}}</span>
                </div>
                <div class="item">
                    <span class="u-text-title">服务人员管家手机号:</span>
                    <span>{{contract.personRechargeMobile}}</span>
                </div>
            </section>
            <section class="g-sec">
                <h6>其他信息</h6>
                <div class="item">
                    <span><i>*</i>服务人员工资总金额(元):</span>
                    <input v-if="this.$route.query.type === 'edit'" type="number" min="0" v-model="contract.totalSalary" maxlength="8" @click="timePicker = false" style="padding-left:0.2rem" required>
                    <span v-if="this.$route.query.type == 'view'">{{contract.totalSalary}}</span>
                </div>
                <div class="item">
                    <span><i>*</i>服务人员月工资(元):</span>
                    <input v-if="this.$route.query.type === 'edit'" type="number" min="0" v-model="contract.salary" maxlength="8" @click="timePicker = false" style="padding-left:0.2rem" required>
                    <span v-if="this.$route.query.type == 'view'">{{contract.salary}}</span>
                </div>
                <div class="item">
                    <span>信息费(元):</span>
                    <input v-if="this.$route.query.type === 'edit'" type="number" min="0" v-model="contract.infomationFee" maxlength="8" @click="timePicker = false" style="padding-left:0.2rem">
                    <span v-if="this.$route.query.type == 'view'">{{contract.infomationFee}}</span>
                </div>
                <div class="item">
                    <span>客户所需支付订单总金额(元):</span>
                    <span>{{ Number(contract.totalSalary) +Number(contract.infomationFee)}}</span>
                </div>
                <p style="color:#777;font-size: 0.6rem">注：客户所需支付订单总金额 = {服务人员工资总金额 + 信息费}</p>
                <div class="item">
                    <span><i>*</i>服务开始时间:</span>
                    <input v-if="this.$route.query.type === 'edit'" type="text" readonly v-model="contract.contractStartTime" @click="showtimerPicker('min')">
                    <span v-if="this.$route.query.type == 'view'">{{contract.contractStartTime}}</span>
                </div>
                <div class="item">
                    <span><i>*</i>服务结束时间:</span>
                    <input v-if="this.$route.query.type === 'edit'" type="text" readonly v-model="contract.contractEndTime" @click="showtimerPicker('max')">
                    <span v-if="this.$route.query.type == 'view'">{{contract.contractEndTime}}</span>
                </div>
            </section>
            <div>
                <button v-if="this.$route.query.type != 'view'" class="mergeOrderBtn" @click="saveContract">保存合同，发送合同确认短信</button>
            </div>
        </div>

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
    export default {
        name: "addContract",
        data() {
            return {
                contract:{},
                orderSignedId:this.$route.query.orderSignedId,
                orderContractId:this.$route.query.orderContractId,

                minDate: new Date(),
                maxDate: new Date(2020, 12, 31),
                currentDate: new Date(),
                timePicker: true,
                updateTime: '',
                sexradio: '1',
                levelradio: 0,
                eduradio: 'ed0',
                isBtns:false,
            }
        },

        components: {
            [Area.name]: Area,
            [RadioGroup.name]: RadioGroup,
            [Radio.name]: Radio,
            [DatetimePicker.name]: DatetimePicker
        },
        mounted(){
            console.log(this.orderContractId)
            if(this.orderContractId == null || this.orderContractId == ''){
                this.getDefaultContractInfo()
            }else {
                this.getContractDetail()
            }

        },
        methods: {
            showtimerPicker (item) {
                // item.onfocus()
                if (item == 'min') {
                    this.minDate = new Date()
                    this.currentTime = new Date()
                } else {
                    this.minDate = this.currentTime
                }
                this.timePicker = true
                this.updateTime = item
            },
            confirmTime (value) {
                var d = new Date(value)
                var a = d.getFullYear() + '-' + this.addZero((d.getMonth() + 1)) + '-' + this.addZero(d.getDate()) + ' ' + this.addZero(d.getHours()) + ':' + this.addZero(d.getMinutes())
                if (this.updateTime == 'min' ) {
                    this.contract.contractStartTime = a
                } else {
                    this.contract.contractEndTime = a
                }
                this.timePicker = false
            },
            cancelTime () {
                this.timePicker = false
            },
            addZero (m) {
                return m < 10 ? '0'+m : m;
            },

            //获取默认合同信息
            getDefaultContractInfo(){
                let that = this;
                that.$postwc('/sharePlatform-order/orderSigned/defaultContractInfo',{
                    orderSignedId:that.orderSignedId
                }).then(res =>{
                    console.log(res.data)
                    if(res.code === 'I1-00-001'){
                        this.contract = res.data
                    }else {
                        this.$toast(res.msg)
                    }
                })
            },

            //查看合同
            getContractDetail(){
                let that = this;
                that.$postwc('/sharePlatform-order/orderContract/findOrderContractById',{
                    orderContractId:that.orderContractId
                }).then(res =>{
                    if(res.code === 'I1-00-001'){
                        this.contract=[]
                        this.contract = res.data
                    }else {
                        this.$toast(res.msg)
                    }
                })
            },

            //返回
            goBack(){
                // debugger
                if(this.$route.query.value=='prePayment'){

                    this.$router.push('/index/servicerManagerment?active=1&orderStatus=2')
                    return
                }else if(this.$route.query.value=='completed'){

                    this.$router.push('/index/servicerManagerment?active=2')
                    return
                }
                if(this.$route.query.status == 'contractConfirm'){
                    this.$router.push({
                        name: 'orderManagerment',
                        query: {
                            val:1,
                            mergeActive:1
                        }
                    })
                }
                if(this.$route.query.status == 'awaitingPay'){
                    this.$router.push({
                        name: 'orderManagerment',
                        query: {
                            val:1,
                            mergeActive:2
                        }
                    })
                }
                if(this.$route.query.status == 'finish'){
                    this.$router.push({
                        name: 'orderManagerment',
                        query: {
                            val:2
                        }
                    })
                } else{
                    //isShortTime:1 正式  2 临时
                    this.contract.isShortTime = 2;
                    this.$postwc('/sharePlatform-order/orderContract/createOrEdit', this.contract).then(res => {
                        this.$router.push({
                            name: 'orderManagerment',
                            query: {
                                val:1,
                                mergeActive:1
                            }
                        })
                    })
                }
            },

            //保存合同
            saveContract(){
                if(!this.contract.totalSalary){
                    this.$toast('请填写服务人员工资总金额')
                    return false;
                }
                if (this.contract.totalSalary<=0) {
                    this.$toast('服务人员工资总金额不能小于等于0')
                    return false;
                }
                var payReg = /^\d+(\.\d{1,2})?$/
                if (!payReg.test(Number(this.contract.totalSalary))) {
                    this.$toast('服务人员工资总金额只能输入两位小数')
                    return false;
                }

                if(!this.contract.salary){
                    this.$toast('请填写服务人员月工资')
                    return false;
                }
                if (this.contract.salary<=0) {
                    this.$toast('服务人员月工资不能小于等于0')
                    return false;
                }
                if (!payReg.test(Number(this.contract.salary))) {
                    this.$toast('服务人员月工资只能输入两位小数')
                    return false;
                }

                if (this.contract.infomationFee<0) {
                    this.$toast('信息费不能小于0')
                    return false;
                }
                if (!payReg.test(Number(this.contract.infomationFee))) {
                    this.$toast('信息费只能输入两位小数')
                    return false;
                }
                // if(!this.contract.infomationFee){
                //     this.$toast('请填写信息费')
                //     return false;
                // }
                if(Number(this.contract.totalSalary)<Number(this.contract.salary)){
                    this.$toast('服务人员工资总金额不小于服务人员月工资')
                    return false
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

                if(this.isBtns){ return false };
                this.isBtns=true;

                //isShortTime:1 正式  2 临时
                this.contract.isShortTime = 1;
                this.contract.contractStartTime = this.contract.contractStartTime;
                this.contract.contractEndTime = this.contract.contractEndTime;
                this.contract.personStatus=0;
                this.contract.userStatus=0;
                this.contract.contractStatus = 2;
                this.contract.userRefusalCause = '';
                this.contract.personRefusalCause = '';
                this.contract.contractAmount = Number(this.contract.totalSalary)+Number(this.contract.infomationFee);

                this.$postwc('/sharePlatform-order/orderContract/createOrEdit', this.contract).then(res => {
                    this.$toast('合同保存成功，已发送确认短信');
                    this.isBtns=false;
                    this.$router.push({
                        name: 'orderManagerment',
                        query: {
                            val:1
                        }
                    })
                }).catch( err => {
                    this.isBtns=false;
                    this.$toast('网络异常，请稍后再试');
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }
    #timerpicker {
        position: fixed;
        bottom: 0;
        left:0;
        right:0;
    }
    .g-list {
        padding: 0 px2rem(15px);
        margin-bottom: px2rem(80px);
        margin-top: px2rem(50px);
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
            left:0;
            right: 0;
        }
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
            line-height: 2rem;
            border-bottom: 1px solid #eee;
            span {
                display: inline-block;
                /*font-size: px2rem(14px);*/
                i {
                    font-style: normal;
                    color:red;
                }
            }
            span.u-text-title {
                display: inline-block;
                min-width: 5rem;

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

    }
</style>
