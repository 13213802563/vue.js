<template >
    <div>
        <el-container class="g-main-warp">
            <el-aside width="200px">
                <aside-bar></aside-bar>
            </el-aside>
            <el-container>
                <el-header>
                    <headerBar></headerBar>
                </el-header>
                <el-main style="height: 100%;width: 100%">
                    <router-view />
                </el-main>
            </el-container>
        </el-container>

    </div>
</template>

<script>
    export default {
        name: "index",
        components:{
            headerBar:() => import('@/components/header.vue'),
            asideBar:()=> import('@/components/aside.vue')

        },
        beforeCreate() {
            if(!sessionStorage.getItem('token')){
                this.$router.push('/')
            }
        }
    }
</script>

<style scoped>

    .g-main-warp {
        height: max-content;
        min-height: 100vh;
    }

    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
        padding: unset!important;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
    }

    .el-main {
        flex: unset!important;
        flex-basis: unset!important;
        overflow: unset!important;
    }

</style>
