<template>
    <div>
        <mt-header title="增加管家">
            <router-link to="/index/userList" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <!--<mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>
        <div class="g-list">
            <div class="item">
                <span>账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号:</span>
                <input v-model="username" type="text" @blur="checkCompanyName" maxlength="16">
            </div>
            <div class="item">
                <span>手&nbsp;&nbsp;机&nbsp;&nbsp;号:</span>
                <input v-model="mobile" maxlength="11">
            </div>
            <div class="item">
                <span>密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码:</span>
                <input v-model="password" type="password" maxlength="16">
            </div>
            <div class="item" style="height: max-content;">
                <span>角&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;色:</span>
                <mt-radio v-model="roleID" :options="roleArr" style="display: inline-table;width: 16.5rem;">
                </mt-radio>
                <!--<input @click="showWorkType" v-model="workType" type="text">-->
            </div>
            <div class="g-buttons">
                <mt-button type="primary" size="large" @click="saveInfo">保存</mt-button>
                <mt-button type="primary" size="large" @click.native="reset" style="margin-top: 1rem">重置</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "addUser",
        data(){
          return {
              username:'',
              mobile:'',
              password:'',
              roleID:'',
              roleArr:[],
              roleFullArr:[]
          }
        },
        methods:{
            checkCompanyName () {
                if(!this.username){
                    this.$toast('账号不能为空')
                    return false;
                }
                this.$post('/sharePlatform-auth/auth/guest/vertifyUserName',{
                    userName:this.username
                }).then(res =>{
                    if(res.code === 'W3-01-0006'){

                    }else{
                        this.username = ''
                        this.$toast(res.msg)
                    }
                })
            },
            saveInfo(){
                let that = this;
                var reg = /^[0-9a-zA-Z_-]{1,}$/
                var reg2 = /^\d+?.*$/
                let vegCN = /[\u4e00-\u9fa5]/ig
                let regUserName = /^[a-zA-Z0-9_-]{5,16}$/;
                console.log(this.password.length);
                if (this.username == '') {
                    that.$toast('账号不能为空')
                    return false;
                }else if (!regUserName.test(this.username)) {
                    that.$toast('账号只能是字母、数字、下划线、中划线，且长度最短为5位，长度最长为16位');
                    return false;
                } else if (reg2.test(this.username)) {
                    that.$toast('账号不能以数字开头');
                    return false;
                }
                //===========手机号=============================
                let mobileReg = /0?(13|14|15|18|16|17|18|19)[0-9]{9}/ig;
                if (this.mobile == '') {
                    this.$toast('手机号不能为空');
                    this.isBtns=false;
                    return false;
                }else if(!mobileReg.test(this.mobile)){
                    this.$toast('手机号不合法')
                    this.isBtns=false;
                    return false;
                }
                //==============密码===========================

                else if (this.password == '') {
                    that.$toast('密码不能为空')
                    return
                } else if (!reg.test(this.password)) {
                    that.$toast('密码只能是字母、数字、下划线');
                    return
                } else if (reg2.test(this.password)) {
                    that.$toast('密码不能以数字开头');
                    return
                } else if(this.password.length < 5){
                    that.$toast('密码长度最短为5位');
                    return
                }
                //==============角色==========================
                else if (this.roleID == '') {
                    that.$toast('角色不能为空')
                    return
                }
                that.$post('/sharePlatform-auth/auth/user/addUser',{
                    userName:that.username,
                    password:that.password,
                    roleId:that.getRoleID,
                    mobile:that.mobile
                }).then(res => {
                    if(res.code === 'I1-00-001'){
                        that.$toast('管家添加成功');
                        that.$router.push('/index/userList');
                    }else{
                        that.$toast(res.msg)
                    }
                })
            },
            reset () {
                this.username = ''
                this.password = ''
                this.roleID = ''
            },

        },mounted() {
            let that = this;
            that.$post('/sharePlatform-auth/auth/user/getRolesWithRegionId',{
            }).then(res => {
                if(res){
                    for(let i in res.data.roles){
                        that.roleArr.push(res.data.roles[i].bmsRoleName)
                    }
                    that.roleFullArr = res.data.roles
                }
            })
        },computed:{
            getRoleID(){
                let that = this;
                for(let i in that.roleFullArr){
                    if(that.roleFullArr[i].bmsRoleName === that.roleID){
                        return that.roleFullArr[i].bmsRoleId
                    }
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
            padding: px2rem(7px) 0;
            border-bottom: 1px solid #eee;

            span {
                display: inline-block;
                width: 5rem;
                text-align: right;
            }

            input {
                border: 1px solid #ddd;
                height: px2rem(25px);
                line-height: px2rem(25px);
                width: 16rem;
                outline: none;
            }

            .text {
                resize: none;
                border: 1px solid #ddd;
                height: 5rem;
                width: 16rem;
                outline: none;
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
</style>
