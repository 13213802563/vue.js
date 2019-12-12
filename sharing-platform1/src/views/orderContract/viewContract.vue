<template>
    <div>
        <mt-header :title="title" style="    position: fixed;width: 100%;z-index: 999;top: 0;">
        </mt-header>
        <div class="g-list">
            <section class="g-sec">
                <h6>提供订单家政公司信息</h6>
                <input type="hidden" name="orderCompanyId" :value="contracts.orderCompanyId">
                <input type="hidden" name="orderCompanyStatus" :value="contracts.orderCompanyStatus">

                <div class="item">
                    <span class="u-text-title">公司名称:</span>
                    <span>{{contracts.orderCompanyName}}</span>
                </div>
                <div class="item">
                    <span class="u-text-title">公司电话:</span>
                    <span>{{contracts.orderCompanyMobile}}</span>
                </div>
                <!--<div class="item">-->
                    <!--<span class="u-text-title">公司地址:</span>-->
                    <!--<span>{{contract.orderCompanyAddress}}</span>-->
                <!--</div>-->
            </section>
            <section class="g-sec">
                <h6>提供服务人员家政公司信息</h6>
                <input type="hidden" name="personConpanyId" :value="contracts.personConpanyId">
                <input type="hidden" name="personCompanyStatus" :value="contracts.personCompanyStatus">

                <div class="item">
                    <span class="u-text-title">公司名称:</span>
                    <span>{{contracts.personCompanyName}}</span>
                </div>
                <div class="item">
                    <span class="u-text-title">公司电话:</span>
                    <span>{{contracts.personCompanyMobile}}</span>
                </div>
            </section>
            <section class="g-sec">
                <h6>客户信息</h6>
                <input type="hidden" name="userId" :value="contracts.userId">
                <input type="hidden" name="userStatus" :value="contracts.userStatus">

                <div class="item">
                    <span class="u-text-title">客户名称:</span>
                    <span>{{contracts.userName}}</span>
                </div>
                <div class="item">
                    <span class="u-text-title">客户管家手机号:</span>
                    <span>{{contracts.orderRechargeMobile}}</span>
                </div>
            </section>
            <section class="g-sec">
                <h6>服务人员信息</h6>
                <input type="hidden" name="personId" :value="contracts.personId">
                <input type="hidden" name="personStatus" :value="contracts.personStatus">

                <div class="item">
                    <span class="u-text-title">服务人员姓名:</span>
                    <span>{{contracts.personName}}</span>
                </div>
                <div class="item">
                    <span class="u-text-title">服务人员管家手机号:</span>
                    <span>{{contracts.personRechargeMobile}}</span>
                </div>
            </section>
            <section class="g-sec">
                <h6>其他信息</h6>
                <div class="item">
                    <span class="u-text-title">服务人员工资总金额(元):</span>
                    <span>{{contracts.totalSalary}}</span>
                </div>
                <div class="item">
                    <span class="u-text-title">服务人员月工资(元):</span>
                    <span>{{contracts.salary}}</span>
                </div>
                <div class="item">
                    <span class="u-text-title">信息费(元):</span>
                    <span>{{contracts.infomationFee}}</span>
                </div>
                <div class="item">
                    <span>客户所需支付订单总金额(元):</span>
                    <span>{{ contracts.contractAmount}}</span>
                </div>
            </section>
            <section class="g-sec">
                <h6>合同时间</h6>
                <div class="item">
                    <span class="u-text-title">开始时间:</span>
                    <span>{{contracts.contractStartTime}}</span>
                </div>
                <div class="item">
                    <span class="u-text-title">结束时间:</span>
                    <span>{{contracts.contractEndTime}}</span>
                </div>
            </section>
            <p v-if="!btn" style="color:red;line-height: 2rem;">您已{{isText}}该合同</p>
            <p v-if="Refuse" style="color:red;line-height: 2rem;word-break: break-all;">拒绝原因：{{msg}}</p>

            <div v-if="btn">
                <button class="mergeOrderBtn" @click="refuse" style="left:0">拒绝</button>
                <button class="mergeOrderBtn" @click="comfirm" style="right: 0">同意</button>
            </div>
        </div>
        <van-dialog v-model="show" title="拒绝原因" show-cancel-button @confirm="refuseMsg">
            <textarea v-model="msg" style="width: 80%;padding: 10px;box-sizing: border-box;margin: 1rem auto;display: block;resize: none;" name="name" id="" cols="30" rows="5" maxlength="100"></textarea>
        </van-dialog>
    </div>
</template>

<script>
    import { Popup } from 'vant';
    import { Dialog } from 'vant';
    export default {
        name: "viewContract",
        data() {
            return {
                msg:'',
                show:false,
                
                isText:'同意',
                title:'确认合同',
                contractAmount:0,
                contract:{},
                contracts:[],
                orderContractId:this.$route.query.orderContractId,
                userId:this.$route.query.userId,

                btn:true,  //显示按钮
                Refuse:false //回显拒绝原因
            }
        },
        mounted(){
            let that = this;
            that.$postwc('/sharePlatform-order/auth/guest/findOrderContractById',{
                orderContractId:that.orderContractId
            }).then(res =>{
                if(res.code === 'I1-00-001'){
                    this.contracts=[]
                    this.contracts = res.data
                    //1、同意 2、拒绝
                    //this.contracts.personStatus = 0;
                    if(this.userId == this.contracts.personId){
                        if(this.contracts.personStatus == 1 ){
                            this.isText = '同意';
                            this.btn = false;
                        }
                        if(this.contracts.personStatus == 2 ){
                            this.isText = '拒绝';
                            this.btn = false;
                            this.Refuse = true;
                            this.msg = this.contracts.personRefusalCause;
                        }
                    }

                    if(this.userId == this.contracts.userId){
                        if( this.contracts.userStatus == 1 ){
                            this.isText = '同意';
                            this.btn = false;
                        }
                        if(this.contracts.userStatus == 2 ){
                            this.isText = '拒绝';
                            this.btn = false;
                            this.Refuse = true;
                            this.msg = this.contracts.userRefusalCause;
                        }
                    }

                    
                }else {

                }
            });
        },
        methods: {
            //拒绝
            refuse(){
                this.show=true;
            },
            refuseMsg(){
                let that = this;
                that.$postwc('/sharePlatform-order/auth/guest/editSignStatus',{
                    refusalCause:that.msg,
                    orderContractId:that.orderContractId,
                    userId:that.userId,
                    signStatus:2
                }).then(res =>{
                    that.$toast('您已拒绝了该合同')
                    this.isText = '拒绝';
                    this.btn = false;
                    this.Refuse = true;
                })
            },
            //确认
            comfirm(){
                let that = this;
                that.$postwc('/sharePlatform-order/auth/guest/editSignStatus',{
                    refusalCause:'',
                    orderContractId:that.orderContractId,
                    userId:that.userId,
                    signStatus:1
                }).then(res =>{
                    this.$toast('您已确认了该合同');
                    
                    this.isText = '同意';
                    this.btn = false;
                })
            },

        }
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }

    .g-list {
        padding: 0 px2rem(15px);
        margin-bottom: px2rem(80px);
        margin-top: px2rem(50px);
        .mergeOrderBtn{
            width: 49%;
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