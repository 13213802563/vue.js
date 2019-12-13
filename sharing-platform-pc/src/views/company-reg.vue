<template>
    <div class="c-order_manage_system">
        <div class="g-query_wrap">
            <div class="m-items">
                <span>公司名称：</span>
                <el-input class="u-input" 
                    v-model="inputSelectedData.companyName">
                </el-input>
            </div>
            <div class="m-items">
                <span>手机号：</span>
                <el-input class="u-input" 
                    v-model="inputSelectedData.mobile" 
                    maxlength="11" 
                    @input="checkMobile" >
                </el-input>
            </div>
            <div class="m-items">
                <span>企业地址：</span>
                <el-input class="u-input" 
                    v-model="inputSelectedData.address" 
                    @input="checkMobile">
                </el-input>
            </div>
            <div class="m-items">
                <span>审核状态：</span>
                <el-select class="u-input" v-model="inputSelectedData.status" placeholder="请选择">
                    <el-option
                            v-for="item in inputRenderData.status"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="m-items" >
                <el-button @click="resetQueryParams">重置</el-button>
                <el-button @click="getTableInfo(1)" type="primary">查询</el-button>
            </div>
        </div>
        
        <div class="g-table_wrap" ref="table" style="width: 800px;">
             <!--:height="tableHeight"  -->
            <el-table
                    :data="tableData"
                    :height="tableHeight"
                    
                    highlight-current-row
                    border
                    ref="singleTable"
                    style="width: 100%">
                <el-table-column
                    label="序号"
                    align="center"
                    type="index"
                    :index="indexMethod"
                    width="50">
                </el-table-column>

                <el-table-column prop="companyName" label="公司名称" width="300" align="center"></el-table-column>
                <el-table-column prop="mobile" label="手机号" min-width="120" align="center"></el-table-column>
                <el-table-column
                    prop="status"
                    label="审核状态"
                    min-width="120"
                    align="center"
                    >
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 3" type="warning"  disable-transitions>待审核</el-tag>
                        <el-tag v-if="scope.row.status == 2" type="danger" disable-transitions>审核驳回</el-tag>
                        <el-tag v-if="scope.row.status == 1" type="success" disable-transitions>审核通过</el-tag>
                    </template>
                </el-table-column>
                <el-table-column 
                    prop="address" 
                    label="企业地址"
                    width="500"></el-table-column>
                <el-table-column label="营业执照" width="180" align="center">
                        <template slot-scope="scope">
                            <div class="demo-image__preview">
                                <img :src="scope.row.businessLicense" v-if="scope.row.businessLicense != ''" 
                                    @click="clickImg(scope.row.businessLicense)"
                                style="max-height: 60px;cursor: pointer;">
                                <div v-if="scope.row.businessLicense == ''" 
                                    style="color:red;line-height:80px;text-align:center;font-weight:blod;font-weight: bold;"> 未上传营业执照</div>
                                <!-- elemtntUI 图片预览组件 -->
                                <!-- <el-image fit="contain" style="height: 60px;"
                                    :src="scope.row.businessLicense" 
                                    :preview-src-list="[scope.row.businessLicense,scope.row.businessLicense]">
                                    <div slot="error" class="image-slot">
                                        <div style="color:red;line-height:80px;text-align:center;font-weight:blod;font-weight: bold;"> 未上传营业执照</div>
                                    </div>
                                </el-image> -->
                            </div>
                        </template>
                </el-table-column>
                <el-table-column  fixed="right" label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status != 1" @click="checkState(1,scope.row)" type="success" size="small">通过</el-button>
                        <el-button @click="checkState(2,scope.row)" type="warning" size="small">驳回</el-button>
                    </template>
                </el-table-column>
            </el-table>
             <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-size="pagination.pageSize"
                    :page-sizes="[10,20, 50, 100, 400]"
                    :current-page.sync="pagination.currentPage"
                    :total="pagination.total"
                    @current-change="getTableInfo"
                    @size-change="handleSizeChange"
                   >
            </el-pagination>
            <!-- 驳回提示框 -->
            <el-dialog title="提示" :visible.sync="dialogFormVisible" width="45%">

                <el-form :model="reasonForm" status-icon :rules="rules" ref="reasonForm">
                    <el-form-item label="请输入驳回原因：（最多50个汉字）" prop="reason">
                        <el-input v-model="reasonForm.reason" maxlength="50"></el-input>
                    </el-form-item>
                </el-form>
                
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="checkStateAjax(currentRow)">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 预览营业执照提示框 -->
            <el-dialog :visible.sync="dialogVisible" width="70%" height="100%">
                <img :src="imgSrc" alt="" style="max-width:100%;" :style="{'max-height':tableHeight - 20 + 'px'}">
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "company-reg",
        data(){
            var checkAge = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('驳回原因不能为空'));
                }
                callback();
            };
            return {
                inputSelectedData:{
                    companyName:'',
                    mobile:'',
                    address:'',
                    status:''
                },
                inputRenderData:{
                    status:[{
                        value: '',
                        label: '全部'
                    },{
                        value: '3',
                        label: '待审核'
                    },{
                        value: '1',
                        label: '审核通过'
                    },{
                        value: '2',
                        label: '审核驳回'
                    }],
                },
                //分页信息
                pagination:{
                    pageSize:10,
                    currentPage:1,
                    total:100
                },
                currentRow:{},  //存放选中行数据
                tableData: [],
                
                tableHeight: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 280,//（这里的240是减去表格上面导航和搜索条件的高度）

                dialogFormVisible: false,
                form: {
                    name: '',
                },
                reasonForm: {
                    reason: '',
                },
                rules: {
                    reason: [
                        { validator: checkAge, trigger: 'blur' }
                    ]
                },

                dialogVisible: false,
                imgSrc:'',

            }
        },
        methods:{
            clickImg(src){
                this.dialogVisible = true;
                this.imgSrc = src
            },
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.getTableInfo()
            },
            indexMethod(index){
                let num = index + 1;
               
                if(this.pagination.currentPage>1){
                    num = (this.pagination.currentPage - 1)*this.pagination.pageSize + index + 1;
                }
                return num
            },
            //操作通过驳回按钮  //type 1、通过 2、驳回
            checkState(type,val){
                val.type = type;
                if(type === 2){
                    this.currentRow = val;
                    this.reasonForm.reason = '';//清空驳回原因
                    this.dialogFormVisible = true;
                    return false;
                };
                val.reason = "审核通过"
                this.checkStateAjax(val);
            },
            //操作通过驳回按钮，调用接口
            checkStateAjax(val){
                if(val.type ==2 ){
                    val.reason = this.reasonForm.reason;
                    if(val.reason.trim().length == 0){
                        this.$message.closeAll();
                        this.$message.error('驳回原因不能为空');
                        return false;
                    }
                }
                
                this.dialogFormVisible = false;
                
                this.$postwc('/sharePlatform-auth/companyCheck/updateCompanyCheckState',{
                    companyId: val.companyId,
                    beforeState:val.status,
                    afterState: val.type,
                    reason:val.reason
                }).then(res =>{
                    let type = '';
                    if(res.code == 'I1-00-001'){
                        type = 'success';
                        this.getTableInfo();
                    }else{
                        type = 'warning'
                    }
                    this.$message({
                        type: type,
                        message: res.msg
                    });
                })
            },
            //重置
            resetQueryParams(){
                for(let i in this.inputSelectedData){
                    if(this.inputSelectedData.hasOwnProperty(i)){
                        this.inputSelectedData[i] = ''
                    }

                }
            },
            //获取公司列表
             getTableInfo(currentPage){
                if(currentPage == 1) this.pagination.currentPage = 1;//查询按钮调用该方法，页码设置为1

                if(this.inputSelectedData.mobile && !/^1[3456789]\d{9}$/.test(this.inputSelectedData.mobile)){
                    this.$message.closeAll();//关闭之前的提示
                    this.$message.error('手机号码格式不正确');
                    return false;
                }
                this.$postwc('/sharePlatform-auth/companyCheck/queryCompanyList',{
                    pageNum: this.pagination.currentPage,
                    pageSize: this.pagination.pageSize,
                    companyName:this.inputSelectedData.companyName.trim(),
                    mobile:this.inputSelectedData.mobile,
                    address:this.inputSelectedData.address.trim(),
                    status:this.inputSelectedData.status,
                    companyId:sessionStorage.getItem('orgId')

                }).then(res =>{
                    if(res.data)this.tableData = res.data.list;
                    this.pagination.total = res.data.total;
                    this.$refs.table.style.width = '100%'  //标签中设置width,表格绘制完新数据重新设置表格宽度，解决表头错位问题
                })
            },
            checkMobile(){
                if(this.inputSelectedData.mobile === '0'){
                    this.inputSelectedData.mobile = ''
                }
                this.inputSelectedData.mobile = this.inputSelectedData.mobile.replace(/\D/g,'')
            }
        },
        mounted() {
            window.onresize = () => { this.tableHeight = window.innerHeight - 280  };
            this.$refs.table.style.width = '100%'  //标签中设置width,表格绘制完新数据重新设置表格宽度，解决表头错位问题
            this.getTableInfo()
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