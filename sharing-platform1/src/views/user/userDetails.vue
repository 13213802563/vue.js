<template>
    <div>
        <mt-header title="管家详情">
            <router-link to="/index/userList" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <!--<mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>
        <div class="g-list">
            <div class="item">
                <span class="u-text-title">账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号:</span>
                <span class="u-text-des">{{user.bmsUserName}}</span>
            </div>
             <div class="item">
                <span class="u-text-title">手&nbsp;&nbsp;机&nbsp;&nbsp;号:</span>
                <span class="u-text-des">{{user.mobile}}</span>
            </div>
             <div class="item">
                <span class="u-text-title">角&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;色:</span>
                <span class="u-text-des">{{user.roleName}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "addUser",
        data(){
          return {
              user:{}
          }
        },
        methods:{

        },
        mounted() {
            this.$postwc('/sharePlatform-auth/userManage/queryUser',{
                bmsUserId:this.$route.query.bmsUserId
            }).then(res => {
                console.log(res);
                if(res.status == 0){
                    this.user = res.data
                }
            })
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
                width: 7rem;

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
