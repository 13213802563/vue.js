<template>
    <div>
        <mt-header :title="this.$route.query.text" style="    position: fixed;width: 100%;z-index: 999;top: 0;">
            <mt-button icon="back" @click="goBack" slot="left">返回</mt-button>
        </mt-header>

        <div class="headTip">
            <h1 v-if="isCloseTip==true">请确保服务人员已在家政家园认证，以便工资及时发放</h1>
        </div>
        <div class="reject">
            <h2>驳回原因</h2>
            <div class="client">{{userRejectReason?'客户驳回原因'+userRejectReason:"暂无客户驳回原因"}}</div>
            <div class="personnel">{{personRejectReason?'服务人员驳回原因'+personRejectReason:"暂无服务人员驳回原因"}}</div>
            <div class="">{{approveRejectReason?'结算中心驳回原因'+approveRejectReason:"暂无结算中心驳回原因"}}</div>
        </div>
        <div class="item">
            <span class="salaryName">姓        名*:</span>
            <input type="text" v-model="peopleName" maxlength="15" :disabled="true">
        </div>

        <div class="item">
            <span class="salaryID">身份证号*:</span>
            <input type="text" style="width: 50%"  v-model="peopleID" maxlength="18" :disabled="true">

            <button @click="verifyBtn()" v-bind:disabled="isBtn==true">验证</button>
        </div>
        <div class="item time">
            <span class="minDate">服务时间*:</span>
            <input type="text" readonly v-model="startTime" @click="showtimerPicker('min')" class="starTimeDate">
            <span class="line">--</span>
            <input type="text  width:10%;margin:0 auto;" readonly v-model="endTime" @click="showtimerPicker('max')"
                   class="endTimeDate">
            <!--</div>-->
        </div>
        <div class="item">
            <span class="shouldTime">应出勤天数*:</span>
            <input type="number" v-model="shouldTime" maxlength="18" @change='checkData(shouldTime,1)' @blur.prevent="changeCount()"> 天

        </div>
        <div class="item">
            <span class="leaveTime">请假天数*:</span>
            <input type="number" v-model="leaveTime" maxlength="18" @change='checkData(leaveTime,2)' @blur.prevent="changeCount()"> 天

        </div>
        <div class="item">
            <span class="overTime">加班天数*:</span>
            <input type="number" v-model="overTime" maxlength="18" @change='checkData(overTime,3)'  @blur.prevent="changeCount()"> 天

        </div>
        <div class="item">
            <span class="alreadyTime">实际出勤天数*:</span>
            <input type="number" v-model="alreadyTime" maxlength="18"  :disabled="true"> 天

        </div>
        <div class=" item" style="margin-bottom: 3rem;">
            <span class="alreadySalary">实际应发工资*:</span>
            <input type="number" v-model="actualSalary" maxlength="18" :disabled="true"> 元

        </div>

        <button @click="save()" class="saveBtn">保存并发送工资确认短信</button>

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
    import {Popup} from 'vant';
    import {Dialog} from 'vant';

    var curTime = new Date();
    export default {
        name: "addWriteSalary",

        data() {
            return {
                newOrderinfo: {},
                personRejectReason:"",
                userRejectReason:"",
                approveRejectReason:"",
                peopleName: '',
                peopleID: '',
                shouldTime: '',//应出勤天数
                leaveTime: '',//请假天数
                overTime: '',//加班天使
                alreadyTime: '',//实际出勤天数
                actualSalary: '',//实际发工资
                idIdentify: '',//是否验证，已验证为（不显示）1 未验证未（显示）0
                isCloseTip: true,//是否关闭提示，false关闭  true打开
                peoplePhone: '',//手机号
                normalSalary: "",//合同规定月工资
                workTypeName:"",
                workType:"",
                minDate: new Date(),
                maxDate: new Date(2020, 12, 31),
                currentDate: new Date(),
                timePicker: false,
                updateTime: '',
                startTime: curTime.getFullYear() + '-' + (curTime.getMonth() + 1) + '-' + curTime.getDate(),
                endTime: curTime.getFullYear() + '-' + (curTime.getMonth() + 1) + '-' + curTime.getDate(),
                isBtn: false,//验证按钮是否可以点击
                list: []
            }


        },

        mounted() {
            this.dataList()

        },
        methods: {
            closeTips() {
                this.isCloseTip = false;

            },
            checkData(value,index) {
                var str = value.replace(/[^\d\.]/g, '');
                var pointIndex = str.search(/\./);
                if(-1 !== pointIndex) {
                     str = str.substr(0, pointIndex + 1).replace(/\./, '.5') ;
                    if(index==1){
                        if(str!=value){
                            this.$toast('请输入0.5的倍数或整数');
                            this.shouldTime=''
                            return
                        }
                    }else if(index==2){
                        if(str!=value){
                            this.$toast('请输入0.5的倍数或整数');
                            this.leaveTime=''
                            return;
                        }

                    }else{
                        if(str!=value){
                            this.$toast('请输入0.5的倍数或整数');
                            this.overTime=""
                            return;
                        }

                    }
                }


            },
            changeCount() {
                if ((this.shouldTime||this.shouldTime==0)&& (this.overTime||this.overTime==0)&& (this.leaveTime||this.leaveTime==0)) {
                    this.alreadyTime = Number(this.shouldTime) + Number(this.overTime) - Number(this.leaveTime);
                    this.actualSalary = ((this.$route.query.money ? this.$route.query.money : this.normalSalary) / this.shouldTime * this.alreadyTime).toFixed(2);
                }

            },
            dataList() {
                let that = this;
                that.$postwc('/sharePlatform-order/auth/guest/getSalaryRecordDetail', {
                    salaryRecordId: that.$route.query.salaryRecordId,
                    roleType: that.$route.query.roleType
                }).then(res => {
                    that.peopleName = res.data.personName
                    that.peopleID = res.data.idCardNum
                    that.startTime = res.data.startTime
                    that.endTime = res.data.endTime
                    that.shouldTime = res.data.normalWorkDays
                    that.leaveTime = res.data.leaveDays//请假天数
                    that.overTime = res.data.overTimeDays//加班天使
                    that.alreadyTime = res.data.actualWorkDays//实际出勤天数
                    that.actualSalary = res.data.actualSalary//实际发工资
                    that.normalSalary = res.data.normalSalary//实际发工资
                    that.workTypeName = res.data.workTypeName//实际发工资
                    that.workType = res.data.workType//实际发工资
                    that.personRejectReason = res.data.personRejectReason//服务人员拒绝原因
                    that.userRejectReason = res.data.userRejectReason//客户拒绝原因
                    that.approveRejectReason = res.data.approveRejectReason//客户拒绝原因
                    that.peoplePhone = res.data.personMobile//服务人员手机号
                })
            },
            verifyBtn() {
                let that = this;
                if (that.peopleName == '' || that.peopleID == '') {
                    this.$toast('请输入相关信息');
                    return;
                }
                var nameReg = /^[a-zA-Z\u4e00-\u9fa5]+$/
                if (!nameReg.test(this.peopleName.userName)) {
                    this.$toast('姓名只允许中英文')
                    return;
                }

                if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(that.peopleID))) {
                    this.$toast("请输入正确的身份证号码");
                    return;
                }

                that.$postwc('/sharePlatform-order/salary/verify', {
                    personName: that.peopleName,
                    idCardNum: that.peopleID,
                }).then(res => {

                    if (res.code == 'I1-00-001') {  //验证通过
                        this.isBtn = true;
                        that.peoplePhone = res.data.mobile;
                    } else { //验证未通过
                        this.$toast(res.msg);
                    }

                })

            },
            save() {
                // starTime: '',
                //     endTime: '',
                let that = this;
                if(that.isInformation==false){
                    this.$toast('请先验证信息');
                    return;
                }
                if (that.peopleName == '' || that.peopleID == '') {
                    this.$toast('请输入相关信息');
                    return;
                }
                var nameReg = /^[a-zA-Z\u4e00-\u9fa5]+$/
                if (!nameReg.test(this.peopleName.userName)) {
                    this.$toast('姓名只允许中英文')
                    return;
                }
                if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(that.peopleID))) {
                    this.$toast("请输入正确的身份证号码");
                    return;
                }
                if (this.shouldTime<0||this.shouldTime=="") {
                    this.shouldTime==""
                    this.$toast('请输入应出勤天数但不能小于0');
                    return;
                }
                if (this.leaveTime <0||this.leaveTime=="") {
                    this.leaveTime==""
                    this.$toast('请输入请假天数但不能小于0');
                    return;
                }
                if (this.overTime <0||this.overTime=="") {
                    this.overTime==""
                    this.$toast('请输入加班天数但不能小于0');
                    return;
                }

                if (!this.startTime) {
                    this.$toast('请选择开始时间')
                    return;
                }
                if (!this.endTime) {
                    this.$toast('请选择结束时间')
                    return;
                }
                if (new Date(this.startTime).valueOf() > new Date(this.endTime).valueOf() || new Date(this.startTime).valueOf() == new Date(this.endTime).valueOf()) {
                    this.$toast('开始时间只能小于结束时间')
                    return;
                }
                that.$postwc('/sharePlatform-order/salary/save', {
                    salaryRecordId: that.$route.query.salaryRecordId,
                    orderContractId: that.$route.query.orderContractId,//合同关闭
                    orderSignedId: that.$route.query.orderSignedId,//签约订单 ID
                    orderNo: that.$route.query.orderId,    //订单
                    personName: that.peopleName,    // 服务人员
                    idCardNum: that.peopleID,   // 服务人员身份
                    personMobile :that.peoplePhone,   // 服务人员手
                    startTime: that.startTime,     //开始
                    endTime: that.endTime,    //结束
                    normalWorkDays: that.shouldTime,  //应出勤
                    leaveDays: that.leaveTime,    //请假
                    overTimeDays: that.overTime,   // 加班
                    actualWorkDays: that.alreadyTime,   //实际出勤
                    actualSalary: that.actualSalary,    //实际发放
                    workTypeName: that.workTypeName,
                    workType: that.workType,

                }).then(res => {
                    if (res.code == 'I1-00-001') {  //验证通过
                        this.$router.push({
                            name: 'addAlreadySalary',
                            path: '/index/addAlreadySalary',
                            query: {
                                orderContractId:this.$route.query.orderContractId,
                                orderSignedId:this.$route.query.orderSignedId,
                                orderId:this.$route.query.orderId,
                                type:'view',
                                status:'finish',
                                text:'已填报工资',
                            }
                        })

                    }else{
                        this.$toast(res.msg)
                    }
                })

            },
            showtimerPicker(item) {
                if (item == 'min') {
                    this.minDate = new Date()
                    // this.currentDate = new Date(this.newOrderinfo.startTime.replace(/-/g,'/'))
                    this.currentDate = new Date(this.startTime.replace(/-/g, '/'))
                } else {
                    // this.minDate = new Date(this.newOrderinfo.startTime.replace(/-/g,'/'))
                    // this.currentDate = new Date(this.newOrderinfo.endTime.replace(/-/g,'/'))
                    this.minDate = new Date(this.startTime.replace(/-/g, '/'))
                    this.currentDate = new Date(this.endTime.replace(/-/g, '/'))
                }
                this.timePicker = true
                this.updateTime = item
            },
            confirmTime(value) {
                var d = new Date(value)
                var a = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                if (this.updateTime == 'min') {
                    this.startTime = a
                } else {
                    this.endTime = a
                }
                this.timePicker = false
            },
            cancelTime() {
                this.timePicker = false
            },
            addZero(m) {
                return m < 10 ? '0' + m : m;
            },
            goBack() {
                    this.$router.push({
                        name: 'addAlreadySalary',
                        path: '/index/addAlreadySalary',
                        query: {
                            orderContractId:this.$route.query.orderContractId,
                            orderSignedId:this.$route.query.orderSignedId,
                            orderId:this.$route.query.orderId,
                            type:'view',
                            status:'finish',
                            text:'已填报工资',
                        }
                    })

            }
        },
        watch:{

        }
    }

</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }
#timerpicker{
    position: fixed;
    bottom: 0;
    width: 100%;
}
    .reject{
        width: 95%;
        margin: auto;
        h2{
            font-size: px2rem(15px);
            font-weight: 800;
            margin: px2rem(5px) px2rem(5px);
            padding: px2rem(5px) px2rem(0px);
            border-bottom: 1px solid #f4f4f4;
        }
        div{
            font-size: px2rem(12px);
            color: #333;
            padding: px2rem(5px) px2rem(0px);
            border-bottom: 1px solid #f4f4f4;

        }

    }
    .saveBtn {
        width: 100%;
        margin: auto;
        padding: 0.5rem 0;
        border: 0;
        background: #62c4fc;
        border-radius: 3px;
        font-size: 1.1rem;
        color: #fff;
        position: fixed;
        bottom: 0;
    }

    .headTip {
        margin-top: px2rem(50px);

        h1 {
            font-size: px2rem(12px);
            width: 100%;
            text-align: center;
            color: #fc4949;
        }
    }

    .item {
        width: 100%;
        padding: px2rem(20px) px2rem(10px);
        border: 1px solid #f4f4f4;

        span {
            width: 30%;
            display: inline-block;
        }

        input {
            width: 60%;
        }
    }

    .time {

        span {
            display: inline;

        }

        span:first-child {
            display: inline-block;
        }

        input {
            width: 27% !important;
        }
    }

</style>
