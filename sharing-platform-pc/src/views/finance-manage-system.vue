<template>
    <div class="c-order_manage_system">
        <div class="g-query_wrap">
            <div class="m-items">
                <span>提现记录ID：&emsp;</span>
                <el-input class="u-input" v-model="inputSelectedData.accountWithdrawalId"></el-input>
            </div>
            <div class="m-items">
                <span>企业名称：&emsp;</span>
                <el-input class="u-input" v-model="inputSelectedData.merName"></el-input>
            </div>
            <div class="m-items">
                <span>提现状态：</span>
                <el-select class="u-input" v-model="inputSelectedData.worktype" placeholder="全部"
                           input="resetPagination">
                    <el-option
                            v-for="item in inputRenderData.renderWorkType"
                            :key="item.name"
                            :label="item.name"
                            :value="item.val">
                    </el-option>
                </el-select>
            </div>
            <div class="m-items">
                <div class="block">
                    <span class="demonstration">申请时间：</span>
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
            <div class="m-items">
                <span>企业联动账号：</span>
                <el-input class="u-input" v-model="inputSelectedData.ldUserId"></el-input>
            </div>
            <div class="m-items">
                <span>打款批次号：</span>
                <el-input class="u-input" v-model="inputSelectedData.payBatch"></el-input>
            </div>
            <div class="m-items">
                <span>商户类型：</span>
                <el-select class="u-input" v-model="inputSelectedData.businessType" placeholder="全部"
                           input="resetPagination">
                    <el-option
                            v-for="item in inputRenderData.renderBusinessType"
                            :key="item.val"
                            :label="item.name"
                            :value="item.val">
                    </el-option>
                </el-select>
            </div>
            <div class="m-items">
                <div class="block">
                    <span class="demonstration">打款时间：</span>
                    <el-date-picker
                            v-model="value2"
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
                <el-button v-if="operationShow" @click="review(1)" :loading="loading.successLoading">审核通过</el-button>
                <el-button v-if="operationShow" @click="rejection" >审核驳回</el-button>
                <el-button @click="exportData(1)" :loading="loading.exportTabLoading">导出审核表</el-button>
                <el-button v-if="financeShow" @click="exportData(2)" :loading="loading.exportLoading">导出数据</el-button>
                <el-button v-if="financeShow" @click="importData" :loading="loading.importLoading">导入数据</el-button>
<!--                <el-button v-if="financeShow" @click="fightingMoney" >确认打款联动</el-button>-->
                <el-button v-if="financeShow" @click="startIssuing" :loading="loading.startIssuingLoading">开始发放</el-button>
                <el-button @click="resetQueryParams">重置</el-button>
                <el-button @click="getTableInfo(1)" :loading="loading.getTableInfoLoading" type="primary">查询</el-button>
                <input type="file" hidden id="u-file" ref="u-file" @input="uploadExcelFile">
            </div>
        </div>
        <!--列表-->
        <div class="g-table_wrap">
            <el-table
                    :data="tableData"
                    :height="tableHeight"
                    border
                    style="width: 100%" ref="multipleTable" @row-click="handleCurrentChange" @selection-change="selsChange">

                <el-table-column
                        type="selection"
                        align="center"
                        width="55" >
                </el-table-column>

                <el-table-column
                    label="序号"
                    align="center"
                    type="index"
                    :index="indexMethod"
                    width="80">

                </el-table-column>

                <el-table-column
                        prop="accountWithdrawalId"
                        label="提现记录ID"
                        align="center"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="申请时间"
                        align="center"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="withdrawalState"
                        label="提现状态"
                        align="center"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="withdrawalAmount"
                        label="提现金额"
                        width="120"
                >
                </el-table-column>
                <el-table-column
                        prop="divideintoAmount"
                        label="提现分成金额"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="subcomAmount"
                        label="提现分佣金额"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="balance"
                        label="账户余额"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="merName"
                        label="企业名称"
                        width="230">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="企业电话"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="ldUserId"
                        label="企业联动账号"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="merType"
                        label="商户类型"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="oaNumber"
                        label="OA单号"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="payBank"
                        label="打款账号"
                        width="200">
                </el-table-column>


                <el-table-column
                        prop="payTime"
                        label="打款时间"
                        align="center"
                        width="180"
                >
                </el-table-column>
                <el-table-column
                        prop="payBatch"
                        label="打款批次号"
                        width="160">
                </el-table-column>
                <el-table-column
                        prop="checkRemark"
                        label="审核驳回原因"
                        width="160">
                </el-table-column>
                <el-table-column
                        prop="payRemark"
                        label="发放失败原因"
                        width="160">
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
            {{ $store.state.msg }}
        </div>
        <!--驳回弹框-->
        <el-dialog title="确认驳回此提现审核?" :visible.sync="dialogVisible" width="42%">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="驳回原因*">
                    <el-input type="textarea" :rows="5"  v-model="form.name" :maxLength="200" resize="none"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="review(2)" :loading="loading.refuseLoading">驳回</el-button>
        <el-button type="primary" @click="dialogVisible = false">取消</el-button>
      </span>
        </el-dialog>
        <!--确认打款联动弹框-->
<!--        <el-dialog title="确认打款联动" :visible.sync="moneyVisible" width="42%">-->
<!--            <el-form ref="fightingM" :model="fightingM" label-width="80px">-->
<!--                <el-form-item label="打款账户*">-->
<!--                    <el-radio disabled v-model="fightingM.radio" label="1"> </el-radio>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="打款联动金额*">-->
<!--                    <el-input v-model="fightingM.input" placeholder="请输入内容"></el-input>                </el-form-item>-->
<!--                <el-form-item label="打款联动日期*">-->
<!--                    <el-date-picker-->
<!--                            v-model="fightingM.value3"-->
<!--                            type="date"-->
<!--                            placeholder="选择日期">-->
<!--                    </el-date-picker>-->
<!--                </el-form-item>-->
<!--            </el-form>-->
<!--            <span slot="footer" class="dialog-footer">-->
<!--        <el-button @click="subMoney" :loading="loading.moneyLoading">确认</el-button>-->
<!--        <el-button type="primary" @click="moneyVisible = false">取消</el-button>-->
<!--      </span>-->
<!--        </el-dialog>-->
    </div>
</template>

<script>
    export default {
        name: "finance-manage-system",
        data() {
            return {
                financeShow:false,
                operationShow:false,
                arrID:[],
                checked:true,
                checkRemark:'',
                dialogVisible:false,
                moneyVisible:false,
                fightingM:{
                    radio: '1',
                    input: '',
                    value3: '',

                },
                form: {
                    name: '',
                },
                obj:{},
                inputSelectedData: {
                    accountWithdrawalId: '',
                    merName: '',
                    ldUserId: '',
                    payBatch: '',
                    businessType: '',
                    worktype: ''
                },
                inputRenderData: {
                    renderWorkType: [
                        {
                            name: '全部',
                            val: '1'
                        }, {
                            name: '申请中',
                            val: '1'
                        }, {
                            name: '打款中',
                            val: '2'
                        }, {
                            name: '提现成功',
                            val: '3'
                        }, {
                            name: '提现失败',
                            val: '4'
                        }, {
                            name: '失败已修改',
                            val: '5'
                        }, {
                            name: '审核通过',
                            val: '6'
                        }, {
                            name: '驳回',
                            val: '7'
                        }, {
                            name: '发放中',
                            val: '8'
                        },
                    ],
                    renderBusinessType: [
                        {
                            name: '个人',
                            val: '1'
                        }, {
                            name: '个体工商户',
                            val: '2'
                        }, {
                            name: '企业商户',
                            val: '3'
                        },
                    ]
                },
                value1: '',
                value2: '',
                inputExcelFile: '',
                tableData: [],
                //分页信息
                pagination: {
                    pageSize: 10,
                    currentPage: 1,
                    total: 100,
                },
                loading:{
                    successLoading:false,
                    refuseLoading:false,
                    exportTabLoading:false,
                    exportLoading:false,
                    importLoading:false,
                    moneyLoading:false,
                    startIssuingLoading:false,
                    getTableInfoLoading:false,
                 },
                tableHeight: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 360,//（这里的240是减去表格上面导航和搜索条件的高度）
            }
        },

        methods: {

            // 点击事情
            handleCurrentChange(row){
                var same=false;
                if(this.arrID.length > 0){
                    for(var i=0; i<this.arrID.length ;i++){
                        if(this.arrID[i]==row.accountWithdrawalId){
                            same=true;
                            this.removeByValue(this.arrID, row.accountWithdrawalId);
                            break;
                        }
                    }
                    if(same==true){
                        this.$refs.multipleTable.toggleRowSelection(row,false);
                    }else{
                        this.$refs.multipleTable.toggleRowSelection(row,true);
                        this.arrID.push(row.accountWithdrawalId);
                    }
                }
                // else{
                //     this.$refs.multipleTable.toggleRowSelection(row,true);
                //     this.arrID.push(row.accountWithdrawalId);
                // }
            },
            selsChange(val){
                var valId=[];
                for(var i=0;i<val.length;i++){
                    valId.push(val[i].accountWithdrawalId);
                }
                this.arrID=valId;
            },
            /*审核驳回*/
            rejection(){
                let self=this;
                if(self.arrID.length==0){
                    self.$message({
                        type: '',
                        message:'请选择驳回数据'
                    });
                }else if(self.arrID.length==1){
                    self.dialogVisible = true;
                    self.form.name=''
                }else{
                    self.$message({
                        type: '',
                        message:'只能有一条驳回数据'
                    });
                }

            },
            /*审核通过/审核驳回*/
            review(val){
                let self=this;
                if(val=='1'){
                    self.loading.successLoading = true;
                    const h = this.$createElement;
                    self.$msgbox({
                        title: '',
                        message: h('p', null, [
                            h('span', null, '确认通过此提现审核？ '),
                            h('i', { style: 'color: teal' }, '')
                        ]),
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                                instance.confirmButtonLoading = true;
                                instance.confirmButtonText = '执行中...';
                                setTimeout(() => {
                                    done();
                                    self.loading.successLoading = false;
                                    setTimeout(() => {
                                        instance.confirmButtonLoading = false;
                                    }, 300);
                                }, 300);
                            } else {
                                /*取消*/
                                done();

                                self.loading.successLoading = false;
                            }
                        }
                    }).then(() => {
                        self.reviewAjax(val)
                    }).catch(() => {

                        self.loading.successLoading = false;
                    });

                }else{
                    /*审核驳回*/
                    self.loading.refuseLoading = true;
                    self.dialogVisible = true;
                    self.reviewAjax(val)

                }
            },
            /*reviewAjax*/
            reviewAjax(val){
                let self=this;
                if(val=='1'){
                    self.obj={
                        flag:val,
                        userId:localStorage.getItem('userId'),
                        accountWithdrawalId:self.arrID.join(",")
                    }
                }else{
                    self.obj={
                        flag:val,
                        userId:localStorage.getItem('userId'),
                        checkRemark:self.form.name,
                        accountWithdrawalId:self.arrID,
                    }
                    if(!self.form.name){
                        this.$message({
                            type: '',
                            message:'驳回原因不能为空'
                        });
                        self.loading.refuseLoading = false;
                        return
                    }
                }

                self.$post('/service-account/check/audit', self.obj).then(res =>{
                    if(res.code=='0'){
                        if(val=='1'){
                            this.$message({
                                type: '',
                                message:'审核成功'
                            });
                        }else{
                            this.$message({
                                type: '',
                                message:'审核驳回成功'
                            });
                            self.dialogVisible = false;
                        }
                    }else{
                        this.$message({
                            type: '',
                            message:res.msg
                        });
                    }

                })
                if(val=='1'){
                    self.loading.successLoading = false;
                }else{

                    self.loading.refuseLoading = false;
                }
            },

            /*导出审核表/导出数据*/
            exportData(val){
                let self=this;
                if(val=='1'){
                    self.loading.exportTabLoading = true
                }else{
                    self.loading.exportLoading = true
                }

                self.$post('/service-account/check/export', {
                    isChange: val,
                    userId:localStorage.getItem('userId'),
                }).then(res => {
                    window.open('http://192.168.10.143:10028/service-account/'+res.data.fileName)
                    if(val=='1'){
                        self.loading.exportTabLoading = false
                    }else{
                        self.loading.exportLoading = false
                    }

                })
            },
            /*导入数据*/
            importData() {
                let self=this;
                self.loading.importLoading = true
                this.$refs['u-file'].click()
            },
            uploadExcelFile(e) {
                let file = e.target.files[0]
                if (['.xls', '.xlsx'].indexOf(file.name.substr(file.name.lastIndexOf('.'), file.name.length)) === -1) {
                    this.$message.error('仅支持EXCEL格式文件上传');
                    e.target.value = '';
                    this.loading.importLoading = false
                    return false;
                }
                const loading = this.$loading({
                    lock: true,
                    text: '正在导入文件:' + file.name + '...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.$file('/service-account/check/importWithdrawal?userId='+localStorage.getItem('userId'), file, )
                    .then(res => {
                        this.loading.importLoading = false
                        if (res.code === '0') {
                            this.$message.success('导入成功，预计2分钟后解析完毕');
                            loading.close();
                        } else {
                            this.$message.error(res.msg);

                            loading.close();
                        }
                        e.target.value = '';

                    })
            },
            /*确认打款联动*/
            // fightingMoney(){
            //     let self=this;
            //     self.moneyVisible = true;
            //     self.form.input='';
            //     self.form.value3='';
            //
            // },
            /*subMoney(){
                let self=this;
                self.loading.moneyLoading = true;
                self.$post('/service-account/transfer/uploadUmfFtpFile', {
                    inUserId:'00100095',
                    money:self.fightingM.input,
                    merDate:self.fightingM.value3,
                }).then(res => {
                    if(res.code==0){self.moneyVisible = false;
                        self.loading.moneyLoading = false;

                    }else if(res.code==400){
                        self.loading.moneyLoading = false;
                    }
                })
            },*/
            /*开始发放*/
            startIssuing(){
                let self=this;
                self.loading.startIssuingLoading = true;
                self.$post('/service-account/transfer/commissionGrant', {
                     accountWithdrawalIds:'"'+self.arrID.join(",")+'"',
                    userId:localStorage.getItem('userId'),
                }).then(res => {
                    if(res.code==0){
                        self.loading.startIssuingLoading = false;

                    }else if(res.code==400){
                        self.loading.startIssuingLoading = false;
                    }
                })
            },
            show() {
            },
            indexMethod(index) {
                let that=this;
                let num = index + 1;
                if (that.pagination.currentPage > 1) {
                    num = (that.pagination.currentPage - 1) * that.pagination.pageSize + index + 1;
                }

                return num
            },
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.getTableInfo()
            },
            resetQueryParams() {
                for (let i in this.inputSelectedData) {
                    if (this.inputSelectedData.hasOwnProperty(i)) {
                        this.inputSelectedData[i] = ''
                        this.value1=''
                        this.value2=''
                    }
                }
            },
            // 获取列表
            getTableInfo(currentPage) {
                if (currentPage == 1) this.pagination.currentPage = 1;//查询按钮调用该方法，页码设置为1
                this.$post('/service-account/check/withdrawRecordsQueryWithPage', {
                            pageNum: this.pagination.currentPage,
                            pageSize: this.pagination.pageSize,
                            accountWithdrawalId: this.inputSelectedData.accountWithdrawalId,
                            merName: this.inputSelectedData.merName,
                            ldUserId: this.inputSelectedData.ldUserId,
                            payBatch: this.inputSelectedData.payBatch,
                            merType: this.inputSelectedData.businessType,
                            withdrawalState: this.inputSelectedData.worktype,
                            startCreattime:(this.value1 !== null && this.value1.length) ? this.value1[0]:'',
                            endCreattime:(this.value1 !== null && this.value1.length)? this.value1[1]:'',
                            startPaytime:(this.value2 !== null && this.value2.length) ? this.value2[0]:'',
                            endPaytime:(this.value2 !== null && this.value2.length)? this.value2[1]:'',
                        }).then(res => {
                    if (res.data) this.tableData = res.data.list;
                    this.indexMethod()
                    this.tableData.forEach(function (value) {
                        switch (value.withdrawalState) {
                            case 1:
                                value.withdrawalState = '申请中'
                                break;
                            case 2:
                                value.withdrawalState = '打款中'
                                break;
                            case 3:
                                value.withdrawalState = '提现成功'
                                break;
                            case 4:
                                value.withdrawalState = '提现失败'
                                break;
                            case 5:
                                value.withdrawalState = '失败已修改'
                                break;
                            case 6:
                                value.withdrawalState = '审核通过'
                                break;
                            case 7:
                                value.withdrawalState = '驳回'
                                break;

                            default:
                                value.withdrawalState = '发放中'
                                break;
                        }
                        switch (value.merType) {
                            case 1:
                                value.merType = '个人'
                                break;
                            case 2:
                                value.merType = '个体工商户'
                                break;
                            default:
                                value.merType = '企业商户'
                                break;
                        }
                    });
                    this.pagination.total = res.total;
                })

            },
        },
        mounted() {
            this.getTableInfo()
            window.onresize = () => {
                this.tableHeight = window.innerHeight - 280
            };
            if(localStorage.getItem('userId')=='361259899771354'){//财务
                // 展示导出审核表、导出数据、导入数据、确认打款联动、开始发放
                this.financeShow=true;
                this.operationShow=false;
            }else{
                this.financeShow=false;
                this.operationShow=true;
            }

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
            display: block;
            text-align: left;
            margin-top: 15px
        }
    }

    .g-table_wrap {
        margin-top: 15px;
    }
</style>