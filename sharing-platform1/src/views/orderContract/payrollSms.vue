<template>
    <div>
        <mt-header title="确认工资">
<!--            <mt-button slot="left" icon="back">返回</mt-button>-->
        </mt-header>
        <div class="g-list">
            <div class="item">
                <span class="u-text-title">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:</span>
                <span class="u-text-des">{{list.personName}}</span>
            </div>

            <div class="item">
                <span class="u-text-title">身份证号:</span>
                <span class="u-text-des">{{list.idCardNum}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">服务时间:</span>
                <span class="u-text-des">{{list.startTime}}-{{list.endTime}}</span>
            </div>
            <div class="item" style="display: flex;height: unset">
                <span class="u-text-title">应出勤天数:</span>
                <span class="u-text-des" style="flex: 1;">{{list.normalWorkDays}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">请假天数:</span>
                <span class="u-text-des">{{list.leaveDays}}</span>
            </div>
            <div class="item">
                <span class="u-text-title" >加班天数</span>
                <span class="u-text-des">{{list.overTimeDays}}</span>
            </div>

            <div class="item">
                <span class="u-text-title">实际出勤天数:</span>
                <span class="u-text-des">{{list.actualWorkDays}}</span>
            </div>
            <div class="item" >
                <span class="u-text-title">服务费用:</span>
                <span class="u-text-des">{{list.normalSalary}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">实际应发工资:</span>
                <span class="u-text-des" >{{list.actualSalary}}</span>
            </div>
            <div class="part" v-if="buttonShow">
                <button class="edit" @click="confirmRelease">确认发放
                </button>
                <button class="edit" @click="overrule">驳回
                </button>
            </div>
        </div>
        <van-dialog
                v-model="isShow"
                show-cancel-button
                :beforeClose="beforeClose"
        >
            <van-field
                v-model="userName"
                rows="4"
                autosize
                type="textarea"
                maxlength="100"
                placeholder="请填写驳回原因"
                show-word-limit
        />
        </van-dialog>
    </div>
</template>

<script>
    import { Toast } from 'vant';;
    export default {
        name: "payrollSms",
        data(){
            return {
                list:[],
                userName:'',
                isShow:false,
                buttonShow:false,
            }
        },
        mounted() {
            this.loadMore()
        },
        methods:{
            loadMore() {
                let that = this;
                    that.$postwc('/sharePlatform-order/auth/guest/getSalaryRecordDetail', {
                        salaryRecordId:that.$route.query.salaryRecordId,
                        roleType:that.$route.query.roleType
                    }).then(res => {
                        that.list = res.data;
                        if(that.$route.query.roleType=='1'&&that.list.personConfirmStatus=='0'){
                            that.buttonShow=true

                        }
                        if(that.$route.query.roleType=='2'&&that.list.userConfirmStatus=='0'){
                            that.buttonShow=true
                        }
                    })
            },
            /*驳回*/
            overrule(){
                this.userName=''
                this.isShow = !this.isShow

            },
            confirmRelease(){
                this.updateConfirmStatus(1)
            },
            updateConfirmStatus(val){
                let that = this;
                that.$postwc('/sharePlatform-order/auth/guest/updateConfirmStatus', {
                    salaryRecordId: that.$route.query.salaryRecordId,
                    roleType:that.$route.query.roleType,
                    confirmStatus:val,
                    rejectReason:that.userName?that.userName:""
                }).then(res => {

                    if(res.code=='I1-00-001'){
                        that.$toast('成功');
                        window.location.reload()
                    }else{
                        that.$toast(res.msg);
                    }
                })
            },
            beforeClose(action, done) {
                if(action === 'confirm') {
                    if(!this.userName) {

                        done(false) //不关闭弹框
                        alert("请输入驳回原因")
                    }else{
                        this.updateConfirmStatus(2)
                        done()
                    }

                } else if(action === 'cancel') {
                    done() //关闭
                }
            }
        },

    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }
    .g-list{
        width: 90%;
        margin: auto;
        margin-top: px2rem(10px);
        .item{
            height: px2rem(50px);
            border-bottom: 1px solid #f4f4f4;
            line-height: px2rem(50px);
            padding-left: px2rem(10px);
            font-size: px2rem(16px);
            .u-text-title{
                font-size: px2rem(15px);
            }
            .u-text-des{
                margin-left: px2rem(5px);
            }
        }
        .part{
            display: flex;
            margin-top: px2rem(40px);
            justify-content: space-between;
            button{
                width: 40%;
                text-align: center;
                height: px2rem(40px);
                line-height: px2rem(40px);
                background: #26a2ff;
                border: 0;
                font-size: px2rem(16px);
                border-radius: px2rem(3px);
                color: #ffffff;
            }
        }
    }
</style>
