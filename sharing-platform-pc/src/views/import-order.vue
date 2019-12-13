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
            <div class="m-items m-query" >
                <el-button @click="getTableData(1)" type="primary">查询</el-button>
                <el-button @click="triggerUpload">导入订单</el-button>
                <el-button @click="downloadTemplate">下载导入模版</el-button>
                <input type="file" hidden id="u-file" ref="u-file" @input="uploadExcelFile">
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
                        prop="statusName"
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
                        prop="createName"
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
                    layout="total, prev, pager, next"
                    :page-size="pagination.pageSize"
                    :current-page.sync="pagination.currentPage"
                    :total="pagination.total"
                    @current-change="getTableData"
            >
            </el-pagination>

        </div>
    </div>
</template>

<script>
    export default {
        name: "import-order",
        data(){
            return {
                value1:'',
                inputExcelFile:'',
                tableData:[

                ],
                pagination:{
                    pageSize:10,
                    currentPage:1,
                    total:10
                },
            }
        },
        methods:{
            show(){
            },
            triggerUpload(){
                this.$refs['u-file'].click()
            },
            uploadExcelFile(e){
                let file = e.target.files[0]
                if(['.xls','.xlsx'].indexOf(file.name.substr(file.name.lastIndexOf('.'),file.name.length)) === -1){
                    this.$message.error('仅支持EXCEL格式文件上传');
                    e.target.value = '';
                    return false;
                }
                // if(file.name.substr(file.name.lastIndexOf('.'),file.name.length))
                this.$file('/sharePlatform-order/Order/importOrder',file,sessionStorage.getItem('orgId'))
                    .then(res => {
                        if(res.code === 'I1-00-001'){
                            this.$message.success('导入成功，预计2分钟后解析完毕');
                        }else{
                            this.$message.error(res.msg);
                        }
                        e.target.value = '';

                    })

            },
            downloadTemplate(){
                window.open('http://erp.95081.com/file/other/xls/2019/08/26/73f7bd4d4db64beb882c8843825bf265.xls')
            },
            getTableData(currentPage){
                if(currentPage == 1) this.pagination.currentPage = 1;//查询按钮调用该方法，页码设置为1
                let self = this
                this.$postwc('/sharePlatform-order/Order/queryImportOrderRecordList',{
                    pageNum:self.pagination.currentPage,
                    pageSize:10,
                    companyId:sessionStorage.getItem('orgId'),
                    beginTime:(self.value1 !== null && self.value1.length) ? self.value1[0]:'',
                    endTime:(self.value1 !== null && self.value1.length)? self.value1[1]:''
                }).then(res => {
                    if(res.code === 'I1-00-001'){
                        self.tableData = res.data.list;
                        this.pagination.total = res.data.total;
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