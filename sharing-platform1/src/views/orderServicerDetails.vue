<template>
    <div>
        <mt-header title="服务人员详情">
            <mt-button slot="left" icon="back" @click="back">返回</mt-button>
            <!--$route.query.type=1  从公海服务员人员进入  也用于判断入口-->
            <mt-button slot="right" @click="goEdit" v-if="this.$route.query.isInPool== 2&&this.$route.query.seeNum ==0&&this.$route.query.type!=1">修改</mt-button>
        </mt-header>
        <div class="g-list">
            <div class="item">
                <span class="u-text-title">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:</span>
                <span class="u-text-des">{{userInfo.userName}}</span>
            </div>
            <div class="item" v-if="this.$route.query.type!=1">
                <span class="u-text-title">身份证号:</span>
                <span class="u-text-des">{{userInfo.idCardNum}}</span>
<!--                <span class="u-text-des" v-if="userInfo.companyId == userInfo.source">{{userInfo.idCardNum}}</span>-->
<!--                <span class="u-text-des" v-else>{{addStar(userInfo.idCardNum)}}</span>-->
            </div>
            <div class="item">
                <span class="u-text-title">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:</span>
                <span class="u-text-des">{{userInfo.sexStr}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄:</span>
                <span class="u-text-des">{{userInfo.age}}</span>
            </div>
            <div class="item" style="display: flex;height: unset">
                <span class="u-text-title">工&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;种:</span>
                <span class="u-text-des" style="flex: 1;">{{userInfo.workerName}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">工作城市:</span>
                <span class="u-text-des">{{userInfo.serviceCityStr}}</span>
            </div>
            <div class="item">
                <span class="u-text-title" >{{entry[1]}}:</span>
                <span class="u-text-des">{{userInfo.mobile}}</span>
            </div>
<!--            <div class="item"  v-if="userInfo.companyId == userInfo.source">-->
<!--                <span class="u-text-title">手机号码:</span>-->
<!--                <span class="u-text-des">{{userInfo.mobile}}</span>-->
<!--            </div>-->
<!--            <div class="item"  v-if="userInfo.companyId !== userInfo.source">-->
<!--                <span class="u-text-title">管家手机:</span>-->
<!--                <span class="u-text-des" v-html="userInfo.rechargeMobile == '' ? '&#45;&#45;' : userInfo.rechargeMobile"></span>-->
<!--            </div>-->
            <div class="item">
                <span class="u-text-title">籍&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贯:</span>
                <span class="u-text-des" style="flex: 1;">{{userInfo.userProvince}} {{userInfo.userCity}} {{userInfo.userAreaStr}}</span>
            </div>
            <div class="item" style="display: flex;height: unset">
                <span class="u-text-title">家庭地址:</span>
                <span class="u-text-des" style="flex: 1;">{{userInfo.address}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">工作年限:</span>
                <span class="u-text-des" >{{userInfo.workingLife=='-1'?'':userInfo.workingLife}}</span>
            </div>
            <div class="item" style="display: flex;height: unset">
                <span class="u-text-title">介&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;绍:</span>
                <span class="u-text-des" style="flex: 1;">{{userInfo.introduction}}</span>
            </div>
        </div>
        <div class="g-pics">
            <!--value.type>2用于不显示身份证正反面  如需显示删掉即可-->
            <template v-for="value in picList">
                <p v-if="value.type>2||entry[0]" style="margin-top: 0.5rem">{{checkImgType(value.type)}}</p>
                <img v-if="value.type>2||entry[0]" :src="value.url" alt="">
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        name: "servicerDetails",
        data(){
            return {
                userInfo:[],
                picList:[],
                name: ''
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm=>{
                vm.name=from.name;
            })
        },
        mounted() {
            let that = this;
            // pushHistory()
            // that.gotoURL(function () {
            //     pushHistory()
            //     let obj=JSON.parse(sessionStorage.getItem('obj'))
            //     that.$router.push('/index/servicerManagerment');
            //})
            if(that.$route.query.type=='1'){
                console.log('公海池详情')
                that.$post('/sharePlatform-person/personnel/loadOpenPersonnel',{
                    personnelId:that.$route.query.personnelId
                }).then(res => {
                    that.userInfo = res.data

                    let arr = that.userInfo.listPic.sort(function (a,b) {
                        return a.type - b.type
                    })
                    that.picList = arr;

                    console.log(that.picList)
                })
            }else{
                that.$post('/sharePlatform-person/personnel/loadPersonnel',{
                    personnelId:that.$route.query.personnelId
                }).then(res => {
                    that.userInfo = res.data

                    let arr = that.userInfo.listPic.sort(function (a,b) {
                        return a.type - b.type
                    })
                    that.picList = arr;
                    console.log(that.picList)
                })
            }

        },
        methods:{

            addStar (str) {
                return str.replace(/(\d{6})\d{6}(\d{3})/, '$1******$2')
            },
            back () {
                if(this.$route.query.type=='1'){
                    this.$router.push('/index/queryAllServicePersonnel');
                }
                else if(this.$route.query.type=='order'){
                    this.$router.push('/index/orderManagerment/promotedServicePersonnel?type=order');
                }else if(this.$route.query.type=='4'){
                    //this.$router.push('/index/viewPublicOrders/mergeOrderManagerment');

                    this.$router.push({
                        name: 'mergeOrderManagerment',
                        query: {
                            orderTypeName:this.$route.query.orderTypeName,
                            orderId:this.$route.query.orderId
                        }
                    })
                }
                else{
                    this.$router.push('/index/servicerManagerment');
                }
            },
            goEdit(){
                let id = this.$route.query.personnelId;
                sessionStorage.clear()
                let obj=Object.assign({},this.$route.query,{type:1})
                sessionStorage.setItem('obj',JSON.stringify(obj))
                if(this.$route.query.type=='1'){
                    this.$router.push('/index/servicerManagerment/editServicer?personnelId=' + id+'&type=1')
                }else{
                    this.$router.push('/index/servicerManagerment/editServicer?personnelId=' + id)
                }

            },
            checkImgType(value){
                switch (value) {
                    case 1:
                        return '身份证正面'
                    case 2:
                        return '身份证反面'
                    case 3:
                        return '健康证正面'
                    case 4:
                        return '健康证反面'
                    default:
                        break;
                }
            }
        },
        computed:{
            entry(){
                if(this.$route.query.type!='1'){
                    return  [this.$route.query.type!='1','服务人员手机']
                }else{
                    return [this.$route.query.type!='1','管家手机']
                }
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

        .item {
            line-height: px2rem(44px);
            border-bottom: 1px solid #eee;

            span.u-text-title {
                display: inline-block;
                width: 7rem;

            }

            span.u-text-des {

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

    .g-pics {
        padding: 0 px2rem(15px);
        img {
            width: 100%;

        }
    }
</style>
