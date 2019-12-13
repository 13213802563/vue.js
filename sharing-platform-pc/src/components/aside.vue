<template>
    <div>
        <el-row class="tac">
            <el-col :span="24">
                <el-menu
                        :default-active="active"
                        class="el-menu-vertical-demo"
                        @open="handleOpen"
                        @close="handleClose"
                        :router="router"
                        unique-opened
                >
                    <el-submenu index="1" v-if="financeHide">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>管理系统</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/index/servicer-manage-system">服务人员管理系统</el-menu-item>
                            <el-menu-item index="/index/order-manage-system">订单管理系统</el-menu-item>
                            <el-menu-item v-if="companyReg" index="/index/company-reg">公司注册审核</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="2" v-if="financeHide">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>数据导入</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/index/import-servicer">导入服务人员</el-menu-item>
                            <el-menu-item index="/index/import-order">导入订单</el-menu-item>
                            <el-menu-item index="/index/import-idcard">导入身份证</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="3" v-if="financeShow">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>财务系统</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/index/finance-manage-system">财务管理系统</el-menu-item>

                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "asideBar",
        data(){
            return {
                router:true,
                active:'/index/servicer-manage-system',
                companyReg:false,
                financeShow:false,
                financeHide:false
            }
        },
        methods: {
            handleOpen() {
                //console.log(key, keyPath);
            },
            handleClose() {
                //console.log(key, keyPath);
            }
        },
        created(){
            if(localStorage.getItem('username')  == 'bjymtd'){
                this.companyReg = true
            }
        },
        mounted() {
            if(localStorage.getItem('userId')=='554092901353690'||localStorage.getItem('userId')=='361259899771354'){
                this.financeShow=true;
                this.financeHide=false;
            }else{
                this.financeShow=false
                this.financeHide=true
            }
            this.active = this.getPageIndex() === '/index'? this.active:this.getPageIndex();
        }
    }
</script>

<style scoped>
    .tac {
        text-align: left;
    }
</style>
