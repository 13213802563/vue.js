<template>
    <div>
        <mt-header title="公海服务人员详情">
            <mt-button slot="left" icon="back" @click="back">返回</mt-button>
            <!--<mt-button slot="right" @click="goEdit">修改</mt-button>-->
        </mt-header>
        <div class="g-list">
            <div class="item">
                <span class="u-text-title">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:</span>
                <span class="u-text-des">{{userInfo.userName}}</span>
            </div>
            <!--<div class="item">-->
                <!--<span class="u-text-title">身份证号:</span>-->
                <!--<span class="u-text-des">{{userInfo.idCardNum}}</span>-->
            <!--</div>-->
            <div class="item">
                <span class="u-text-title">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:</span>
                <span class="u-text-des">{{userInfo.sexStr}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄:</span>
                <span class="u-text-des">{{userInfo.age}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">工&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;种:</span>
                <span class="u-text-des">{{userInfo.workerName}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">工作城市:</span>
                <span class="u-text-des">{{userInfo.serviceCityStr}}</span>
            </div>
            <!--<div class="item">-->
                <!--<span class="u-text-title">手机号码:</span>-->
                <!--<span class="u-text-des">{{userInfo.mobile}}</span>-->
            <!--</div>-->
            <div class="item">
                <span class="u-text-title">籍&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贯:</span>
                <span class="u-text-des">{{userInfo.userProvince}} {{userInfo.userCity}} {{userInfo.userAreaStr}}</span>
            </div>
            <div class="item" style="display: flex;height: unset">
                <span class="u-text-title">家庭地址:</span>
                <span class="u-text-des">{{userInfo.address}}</span>
            </div>
            <div class="item">
                <span class="u-text-title">工作年限:</span>
                <span class="u-text-des" >{{userInfo.workingLife=='-1'?'':userInfo.workingLife}}</span>
            </div>
            <div class="item" style="display: flex;height: unset">
                <span class="u-text-title">介&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;绍:</span>
                <span class="u-text-des">{{userInfo.introduction}}</span>
            </div>
        </div>
        <div class="g-pics">
            <template v-for="value in picList">
                <template v-if="value.type > 2"> <!-- 只显示健康证，如需显示身份证 删掉v-if即可 -->
                    <p style="margin-top: 0.5rem">{{checkImgType(value.type)}}</p>
                    <img :src="value.url" alt="">
                </template>
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
            pushHistory()
            that.gotoURL(function () {
                pushHistory()
                let obj=JSON.parse(sessionStorage.getItem('obj'))
                that.$router.push('/index/seaServicer');
            })
            that.$post('/sharePlatform-person/personnel/loadPersonnel',{
                personnelId:that.$route.query.personnelId
            }).then(res => {
                that.userInfo = res.data

                let arr = that.userInfo.listPic.sort(function (a,b) {
                    return a.type - b.type
                })
                this.picList = arr;
            })
        },
        methods:{
            back () {
                this.$router.push('/index/seaServicer')
            },
            goEdit(){
                let id = this.$route.query.personnelId;
                this.$router.push('/index/seaServicer')
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
                width: 5rem;

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
