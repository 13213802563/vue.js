<template>
    <div>
        <mt-header title="账户与安全" style="z-index: 999;">
            <mt-button icon="back" @click="$router.push('/index/per-center')" slot="left">返回</mt-button>
        </mt-header>
        <div class="content">
            <van-cell title="修改密码" is-link @click="$router.push('/index/passWordEdit')"></van-cell>
            <van-cell title="绑定手机号" is-link @click="$router.push({path:'/index/per-center-mobile', query: { mobile:mobile,bmsUserId:bmsUserId }})">
            <!-- <van-cell title="绑定手机号" is-link @click="$router.push({path:'/index/per-center-mobile'})"> -->
                <!-- <van-tag type="danger">未绑定</van-tag> -->
                <span>{{mobile}}</span>
            </van-cell>
        </div>
    </div>
</template>
<script>
    export default {
        name: "accountSecurity",
        data () {
            return {
                mobile:'未绑定',
                bmsUserId:'',
                loadingimg: false,
            }
        },
        created () {
            let params = {};
            let url = '/sharePlatform-auth/accountSafe/queryPhoneByAccount';
            this.$postwc(url,params).then(res => {
                if(res.status == 0){
                    if(res.data.mobile){
                        this.mobile = res.data.mobile;
                    }
                    this.bmsUserId = res.data.bmsUserId;
                }
            });
        },
        methods:{

        }
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }
    .content{
        padding:1rem 0rem 2rem;position: absolute;top: 40px;bottom: 0;left: 0;right: 0;overflow: auto;
    }
    
    .van-cell:after {
        content: ' ';
        position: absolute;
        pointer-events: none;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        left: 15px;
        right: 0;
        bottom: 0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        border-bottom: 1px solid #ebedf0;
    }
</style>
