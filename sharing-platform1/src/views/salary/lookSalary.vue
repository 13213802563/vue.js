<template>
    <div>
        <mt-header :title="this.$route.query.text" style="    position: fixed;width: 100%;z-index: 999;top: 0;">
            <mt-button icon="back" @click="goBack" slot="left">返回</mt-button>
        </mt-header>
        <div class="g-list">
            <div class="item">
                <span class='u-text-title'>姓名:</span>
                <span class="u-text-content">{{list.personName}}</span>
            </div>
            <div class="item">
                <span class='u-text-title'>身份证号:</span>
                <span class="u-text-content">{{list.idCardNum}}</span>
            </div>
            <div class="item">
                <span class='u-text-title'>服务时间:</span>
                <span class="u-text-content">{{list.startTime}}--{{list.endTime}}</span>
            </div>
            <div class="item">
                <span class='u-text-title'>应出勤天数:</span>
                <span class="u-text-content">{{list.normalWorkDays}}</span>
            </div>
            <div class="item">
                <span class='u-text-title'>请假天数:</span>
                <span class="u-text-content">{{list.leaveDays}}</span>
            </div>
            <div class="item">
                <span class='u-text-title'>加班天数:</span>
                <span class="u-text-content">{{list.overTimeDays}}</span>
            </div>
            <div class="item">
                <span class='u-text-title'>实际出勤天数:</span>
                <span class="u-text-content">{{list.actualWorkDays}}</span>
            </div>
            <div class="item">
                <span class='u-text-title'>服务费用:</span>
                <span class="u-text-content" >{{list.normalSalary}}</span>
            </div>
            <div class="item">
                <span class='u-text-title'>实际应发工资:</span>
                <span >{{list.actualSalary}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "lookSalary",
        data() {
            return {
               list:[]
            }
        },
        mounted(){
            let that = this;
            that.$postwc('/sharePlatform-order/auth/guest/getSalaryRecordDetail', {
                salaryRecordId: this.$route.query.salaryRecordId,

            }).then(res => {
                if (res.code == 'I1-00-001') {  //通过
                    that.list=res.data
                }

            })


        },
        methods: {
            goBack() {
                this.$router.push({
                    name: 'addAlreadySalary',
                    query: {
                        orderContractId: this.$route.query.orderContractId,
                        orderSignedId: this.$route.query.orderSignedId,
                        orderId: this.$route.query.orderId,
                        type: 'view',
                        status: 'finish',
                        text: '已填报工资'
                    }
                })
            }
        }

    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }
    .g-list{
        width: 90%;
        margin: auto;
        margin-top: px2rem(50px);
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
