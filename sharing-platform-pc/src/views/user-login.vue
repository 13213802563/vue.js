<template>
    <div>
        <el-row>
            <el-col :span="24" class="g-wrap">
                <div class="login">
                    <el-input prefix-icon="el-icon-user" v-model="username" placeholder="请输入用户名"
                              class="u-login-input"></el-input>
                    <el-input prefix-icon="el-icon-lock" type="password" v-model="userPassword" placeholder="请输入密码"
                              class="u-login-input" ></el-input>
                    <div>
                        <el-button class="u-login-button" @click="resetUserInputContents">重置</el-button>
                        <el-button class="u-login-button" type="primary" @click="selectArea">登录</el-button>
                    </div>
                </div>
                <el-dialog
                        title="请选择行政区域"
                        :visible.sync="dialogVisible"
                        width="30%"
                        >
                    <span>
                        <div v-for="(item,index) in areaDatas" :key="index">
                            <p style="text-align: left;cursor: pointer;font-weight: bold;color: #2ea1ff" @click="login(item.bmsAdminRegionId)">{{index+1}}、{{item.bmsAdminRegionName}}</p>
                        </div>
                    </span>
                    <span slot="footer" class="dialog-footer">
                     <el-button @click="areaCancel">取 消</el-button>
                         </span>
                </el-dialog>

            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "user-login",
        data() {
            return {
                username: '',
                userPassword: '',
                $elementMessageStatus: '',
                dialogVisible:false,
                areaDatas:[]
            }
        },
        methods: {
            resetUserInputContents() {
                this.username = '';
                this.userPassword = '';
            },
            selectArea(){
                if (!this.username && !this.userPassword) {
                    /**
                     * $elementMessageStatus存储每次message的实例，每次调用message先调用预存
                     * 实例的close()避免多个message重叠显示。
                     */
                    if (this.$elementMessageStatus) this.$elementMessageStatus.close();

                    // 判断用户名和密码非空
                    this.$elementMessageStatus = this.$message.error('用户名或密码不能为空');
                    return false;
                }
                // 登录接口
                let self = this;
                this.$postNoToken('/sharePlatform-auth/auth/guest/login', {
                    userName: self.username,
                    password: self.userPassword
                })
                    .then( res => {
                        if (res.code === 'I1-00-001') {
                            localStorage.setItem('username',this.username);
                            self.areaDatas = res.data.regions;
                            sessionStorage.setItem('token', res.data['jzpt-token'])
                            self.dialogVisible = true;


                            localStorage.setItem('companyId',res.data.regions[0].bmsAdminRegionId);
                            // // 存储分区值
                            self.$store.state.areas = res.data.regions;
                            localStorage.setItem('areas',JSON.stringify(res.data.regions));
                            // that.$router.push('/areas')
                        } else {
                            self.$elementMessageStatus = self.$message.error(res.msg);
                        }

                    })
            },
            login(orgId) {
                let that = this;
                sessionStorage.setItem('orgId', orgId)
                this.$post('/sharePlatform-auth/auth/user/switchRegion',{
                    userName:that.username,
                    password:that.userPassword,
                    targetRegionId:orgId
                }).then((res) => {
                    this.$post('/sharePlatform-auth/auth/getUserCheckStatus',{
                    }).then((res) => {
                        localStorage.setItem("userId",res.data.bmsUserId);
                        this.$router.push('/index')
                    })

                })
            },
            areaCancel(){
                this.dialogVisible = false;
                sessionStorage.clear();
                this.resetUserInputContents()

            }
        }, created() {
            sessionStorage.clear()
        }
    }
</script>

<style scoped lang="scss">
    .g-wrap {
        height: 100vh;
        background: #0a76a4;

        .login {
            width: 500px;
            height: 200px;
            background: #fff;
            position: absolute;
            left: calc(50% - 250px);
            top: calc(25%);
            border-radius: 5px;

            .u-login-input {
                width: 200px;
                display: block;
                margin: 20px auto 0 auto;
            }

            .u-login-button {
                margin-top: 20px;
            }

            &:after {
                content: 'Copyright ©2019-2020 北京易盟天地信息技术股份有限公司';
                color: #fff;
                position: absolute;
                bottom: -22px;
                left: 0;
                width: 100%;
            }
        }
    }
</style>
