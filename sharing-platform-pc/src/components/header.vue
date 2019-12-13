<template>
    <div>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" :router="router">
            <el-menu-item index="/index">处理中心</el-menu-item>
            <el-menu-item index="/">退出登录</el-menu-item>

        </el-menu>
    </div>
</template>

<script>
    export default {
        name: "headerBar",
        data(){
            return {
                activeIndex:'/index',
                router:true,

            }
        },
        methods:{
            handleSelect(val){
            }
        }
    }
</script>

<style scoped>

</style>