<template>
    <div>
        <mt-header title="行政区域">
            <mt-button icon="back" @click="goBack" slot="left">退出</mt-button>
            <!-- <router-link to="/" replace slot="left">
                <mt-button icon="back" @click="back">退出</mt-button>
            </router-link> -->
            <!--<mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>
        <div class="g-btns">
            <template v-for="value in areas">
                <div class="item" @click="goIndex(value.bmsAdminRegionId)" :key="value.bmsAdminRegionId">
                    {{value.bmsAdminRegionName}}
                </div>
            </template>

        </div>
    </div>
</template>

<script>
    export default {
        name: "areas",
        data(){
            return {
                logType:0,// 0、账后手机号登录 1、短信验证码登录
                areas:[]
            }
        },
        mounted() {
            //this.bodyHeight=document.documentElement.clientHeight
            let that = this;
            // 取分区值
            that.areas = that.$store.state.areas || JSON.parse(localStorage.getItem('areas'));
            that.logType = localStorage.getItem('logType');
        },
        methods:{
            goBack(){
                localStorage.clear();
                sessionStorage.clear();
                this.$router.push('/');
            },
            goIndex(value){
                if(this.logType == 0) this.goIndexByPassWord(value);
                if(this.logType == 1) this.goIndexByDx(value);
            },
            goIndexByPassWord(value){
                let that = this;
                this.$post('/sharePlatform-auth/auth/user/switchRegion',{
                    userName:that.$store.state.userName || localStorage.getItem('userName'),
                    password:that.$store.state.password || localStorage.getItem('password'),
                    targetRegionId : value
                }).then(res => {
                    console.log(res);
                    // 存储权限
                    this.$store.state.auth = res.data.permissions
                    localStorage.setItem('auth',JSON.stringify(res.data.permissions));
                    this.$router.push(`/index?id=${value}`)
                })
            },
            goIndexByDx(value){
                let that = this;
                this.$post('/sharePlatform-auth/auth/user/switchRegionByPhone',{
                    mobile:that.$store.state.password || localStorage.getItem('login_mobile'),
                    targetRegionId : value
                }).then(res => {
                    console.log(res);
                    // 存储权限
                    this.$store.state.auth = res.data.permissions
                    localStorage.setItem('auth',JSON.stringify(res.data.permissions));
                    this.$router.push(`/index?id=${value}`)
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }

    .g-btns {
        padding: 0 px2rem(15px);
        div.item {
            margin-top: 0.625rem;
            height: max-content;
            min-height: 2.5rem;
            border: none;
            color: #333;
            text-align: left;
            line-height: 2.5rem;
            word-break: break-all;
            padding: 0 0.625rem;
            border-left: 5px solid #a753ff;
            -moz-box-shadow: 2px 2px 2px #eee;
            -webkit-box-shadow: 2px 2px 2px #eee;
            box-shadow: 2px 2px 2px #eee;
        }
    }

</style>
