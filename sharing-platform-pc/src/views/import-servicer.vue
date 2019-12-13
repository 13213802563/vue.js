<template>
    <div class="c-import_servicer">
        <div class="g-query_wrap">
            <div class="m-items">
                <div class="block">
                    <span class="demonstration">创建日期：</span>
                    <el-date-picker
                            v-model="value1"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            @change="show"
                            value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                </div>
            </div>
            <div class="m-items m-query">
                <el-button @click="getTableData" type="primary">查询</el-button>
                <el-button @click="triggerUpload"> 导入服务人员</el-button>

                <el-button @click="downloadTemplate">下载导入模版</el-button>
<!--                <el-button @click="IdCardUpload" :before-upload="uploadIdCaed">导入身份证</el-button>-->
<!--                <span style="font-size: 12px;">-->
<!--                    注：-->
<!--                        1.导入身份证图片，命名要求：<span style="color: #fc4949;">【身份证号-国徽面】、【身份证号-人像面】</span>；-->
<!--                        2.上传身份证图片压缩包，格式要求：<span style="color: #fc4949;">【.rar】、【.zip】</span>。3.上传文件不得超过50M</span>-->
                <input type="file" hidden id="u-file" ref="u-file" @input="uploadExcelFile">
                <input type="file" hidden id="u-idCard" ref="u-idCard" @input="uploadIdCaed">
            </div>
        </div>
        <div class="g-table_wrap">
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%">

                <el-table-column
                        prop="fileName"
                        label="导入文件"
                        >
                </el-table-column>
                <el-table-column
                        prop="statusStr"
                        label="导入状态"
                        >
                </el-table-column>
                <el-table-column
                        prop="successCount"
                        label="导入成功条数"
                        >
                </el-table-column>
                <el-table-column
                        prop="failCount"
                        label="导入失败条数"

                >
                </el-table-column>
                <el-table-column
                        prop="scoreCount"
                        label="导入可获得积分条数"
                        >
                </el-table-column>
                <el-table-column
                        prop="userName"
                        label="导入人"
                >
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="导入时间"
                >
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看导入详情</el-button>

                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-size="pagination.pageSize"
                    :current-page="pagination.currentPage"
                    @next-click="pagination.currentPage++"
                    @current-change="getTableData"
                    @prev-click="pagination.currentPage--"
            >
            </el-pagination>

        </div>
    </div>
</template>

<script>
    export default {
        name: "import-servicer",
        data(){
            return {
                value1:'',
                inputExcelFile:'',
                tableData:[

                ],pagination:{
                    pageSize:10,
                    currentPage:1
                },
            }
        },
        methods:{
            show(){
            },
            triggerUpload(){
                this.$refs['u-file'].click()
            },
            IdCardUpload(){
                this.$refs['u-idCard'].click()
            },

            uploadExcelFile(e){
                let file = e.target.files[0]

                if(['.xls','.xlsx'].indexOf(file.name.substr(file.name.lastIndexOf('.'),file.name.length)) === -1){
                    this.$message.error('仅支持EXCEL格式文件上传');
                    e.target.value = '';
                    return false;
                }
                const loading = this.$loading({
                    lock: true,
                    text: '正在导入文件:' + file.name + '...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                // setTimeout(() => {
                //     loading.close();
                // }, 2000);
                this.$file('/sharePlatform-person/personnel/excelBatchImportPersonnel',file,sessionStorage.getItem('orgId'))
                    .then(res => {
                        if(res.code === 'I1-00-9999'){
                            this.$message.success('导入成功，预计2分钟后解析完毕');

                            loading.close();
                        }else{
                            this.$message.error(res.msg);

                            loading.close();
                        }
                        e.target.value = '';

                    })
            },
            uploadIdCaed(e){

                let file = e.target.files[0]

                if(['.zip','.rar'].indexOf(file.name.substr(file.name.lastIndexOf('.'),file.name.length)) === -1){
                    this.$message.error('仅支持zip格式或rar格式文件上传');
                    e.target.value = '';
                    return false;
                }
                let size = e.target.files[0].size;
                size = size/(1024*1024);

                if(size > 50){
                    this.$message.error('文件不能超过50M');
                    return false
                }
                const loading = this.$loading({
                    lock: true,
                    text: '正在导入文件:' + file.name + '...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                // setTimeout(() => {
                //     loading.close();
                // }, 2000); // 这个注释是什么鬼？
                this.$file('/sharePlatform-person/personnel/validatIDAndSave',file,)
                    .then(res => {
                        if(res.code === 'I1-00-9999'){
                            this.$message.success('导入成功，预计2分钟后解析完毕');
                            loading.close();
                        }else{
                            this.$message.error(res.msg);

                            loading.close();
                        }
                        e.target.value = '';

                    })
            },
            downloadTemplate(){
                window.open('http://erp.95081.com/file/other/xls/2019/09/25/902c3223d938422a8ddc3c8f814b84b1.xls')
            },
            getTableData(){
                let self = this
                this.$post('/sharePlatform-person/personnel/queryImportLog',{
                    currentPage:self.pagination.currentPage,
                    pageSize:10,
                    companyId:sessionStorage.getItem('orgId'),
                    beginTime:(self.value1 !== null && self.value1.length) ? self.value1[0]:'',
                    endTime:(self.value1 !== null && self.value1.length)? self.value1[1]:'',
                    type:'2'
                }).then(res => {
                    if(res.code === 'I1-00-9999'){
                        self.tableData = res.data
                    }
                })
            },
            handleClick(data){
                window.open(data.path)
            }


        },
        mounted() {
            this.getTableData()
        }
    }
</script>

<style scoped lang="scss">
    .g-query_wrap {
        text-align: left;
        .el-col {
            width: max-content;
        }
        .m-items {
            display: inline-block;
            margin-right: 20px;
            margin-bottom: 15px;
            span {
                line-height: 40px;
            }

            .u-input {
                width: 200px;
            }
        }

        .m-items.m-query {
            display: block;text-align: left;margin-top: 15px
        }
    }

    .g-table_wrap {
        margin-top: 15px;
    }
</style>