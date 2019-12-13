<template>
    <div class="c-order_manage_system">
        <div class="g-query_wrap">
            <div class="m-items">
                <span>客户姓名：</span>
                <el-input class="u-input" v-model="inputSelectedData.customerName" ></el-input>
            </div>
            <div class="m-items">
                <span>客户手机：</span>
                <el-input class="u-input" v-model="inputSelectedData.customerMobile" maxlength="11" @input="checkMobile" ></el-input>
            </div>
            <!-- <div class="m-items">
                <span>性别：</span>
                <el-select class="u-input" v-model="inputSelectedData.customerSex" placeholder="请选择">
                    <el-option
                            v-for="item in inputRenderData.renderSex"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div> -->
            <div class="m-items">
            <span>订单类型：</span>
            <el-select class="u-input" v-model="inputSelectedData.worktype" placeholder="全部" input="resetPagination">
            <el-option
                v-for="item in inputRenderData.renderWorkType"
                :key="item.allId"
                :label="item.name"
                :value="item.allId">
            </el-option>
            </el-select>
            </div>
            <!--<div class="m-items">-->
                <!--<span>订单类型：</span>-->
                <!--<el-input class="u-input" v-model="inputSelectedData.customerMobile" ></el-input>-->
            <!--</div>-->
            <div class="m-items m-query" >
                <el-button @click="resetQueryParams">重置</el-button>
                <el-button @click="getTableInfo(1)" type="primary">查询</el-button>
                <el-button @click="orderrModelOpen(null)" type="primary">新增</el-button>
            </div>
        </div>
        <div class="g-table_wrap">
            <el-table
                    :data="tableData"
                    :height="tableHeight"
                    border
                    
                    style="width: 100%">
                <!-- <el-table-column
                    label="序号"
                    align="center"
                    type="index"
                    :index="indexMethod"
                    width="50">
                </el-table-column> -->

                <el-table-column
                        prop="userName"
                        label="姓名"
                        align="center"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="sex"
                        label="性别"
                        align="center"
                        width="60">
                </el-table-column>
                <el-table-column
                        prop="userMobile"
                        label="客户手机"
                        align="center"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="userCityStr"
                        label="客户省市区"
                        min-width="300"
                        >
                </el-table-column>
                <el-table-column
                        prop="userAddress"
                        label="服务地址"
                        min-width="300">
                </el-table-column>
                <el-table-column
                        prop="startTime"
                        label="开始时间"
                        align="center"
                        width="180"
                        >
                </el-table-column>
                <el-table-column
                        prop="endTime"
                        label="结束时间"
                        align="center"
                        width="180"
                        >
                </el-table-column>
                <el-table-column
                        prop="orderTypeName"
                        label="订单类型"
                        align="center"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="totalPay"
                        label="支付金额"
                        align="center"
                        width="120">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click.native.prevent="orderrModelOpen(tableData[scope.$index].orderId,false)">编辑</el-button>
                        <el-button  type="text" size="small" @click.native.prevent="orderrModelOpen(tableData[scope.$index].orderId,true)">详情</el-button>
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

        </div>
        <el-dialog
            title="订单详情"
            :visible.sync="orderDetailes.dialogVisible"
            width="800px" height="100%" top = "10vh"
            :close-on-click-modal="false"
            @close="OrderrModelClose"
            @closed="OrderrModelClosed"
        >
            <el-form ref="ruleForm"
                :model="orderDetailes.data" :rules="orderDetailes.rules" :disabled="ModelFormDisable" 
                label-width="100px" label-position="right" class="demo-ruleForm" size="mini"  style="text-align:left;">
                <el-divider content-position="left">1、客户信息</el-divider>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客户姓名" prop="userName">
                            <el-input clearable v-model="orderDetailes.data.userName" maxlength="10"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                         <el-form-item label="客户性别" prop="sex">
                            <el-radio-group v-model="orderDetailes.data.sex">
                                <el-radio :label="1">男</el-radio>
                                <el-radio :label="2">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客户手机" prop="userMobile">
                            <el-input clearable v-model="orderDetailes.data.userMobile" maxlength="11" oninput="this.value=this.value.replace(/\D/g,'')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户地址" prop="userCityArray" :inline="false">
                            <el-cascader
                                    ref="newServicerWorkCityPicker"
                                    :options="cityList"
                                    v-model="orderDetailes.data.userCityArray"
                                    @change="changeCity"
                                    style="width:100%;"
                                    v-if="orderDetailes.dialogVisible"
                                    >
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-divider content-position="left">2、订单详情</el-divider>
                <el-form-item label="订单类型" prop="orderTypeCode">
                    <el-radio-group v-model="orderDetailes.data.orderTypeCode" @change="changeOrderType" :disabled="orderTypeCodeDisabled">
                        <el-radio  v-for="item in renderWorkTypeNotAll"
                            :key="item.allId"
                            :label="String(item.allId)">
                            {{item.name}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="支付金额" prop="totalPay">
                    <el-input v-model="orderDetailes.data.totalPay" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="订单时间" prop="dateTimeRange">
                    <el-date-picker
                        v-model="orderDetailes.data.dateTimeRange" @change="changeOrderTime"
                        :default-time="['12:00:00', '12:00:00']"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="服务地址" prop="address">
                    <el-input type="textarea" v-model="orderDetailes.data.address" maxlength="50" show-word-limit></el-input>
                </el-form-item>
               
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="orderDetailes.data.remark" maxlength="150" show-word-limit></el-input>
                </el-form-item>
                <el-divider content-position="left">3、服务人员要求</el-divider>
                <el-form-item label="学历" prop="education">
                    <el-radio-group v-model="orderDetailes.data.education">
                        <el-radio  v-for="item in eduBg" :label="item.index" :key="item.index">{{item.text}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                            <el-form-item label="最小年龄" prop="minAge">
                                <el-input v-model.number="orderDetailes.data.minAge" maxlength="3"></el-input>
                            </el-form-item>
                    </el-col>
                    <el-col :span="12">
                            <el-form-item label="最大年龄" prop="maxAge">
                                <el-input v-model.number="orderDetailes.data.maxAge" maxlength="3"></el-input>
                            </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer" v-if="!ModelFormDisable">
               <el-button @click="orderDetailes.dialogVisible = false;">取 消</el-button>
               <el-button type="primary" @click="orderSubmit()" :disabled="!orderDetailes.dialogVisible">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import threeLevelAddress from '../lib/CityCode.json';
    export default {
        name: "order-manage-system",
        data(){
            return {
                inputSelectedData:{
                    customerName:'',
                    customerMobile:'',
                    customerSex:'',
                    worktype:''
                },
                inputRenderData:{
                    renderSex:[{
                        value: '1',
                        label: '男'
                    },{
                        value: '2',
                        label: '女'
                    }],
                    renderWorkType:[]
                },
                eduBg: [
                    {
                        index: 'ed0',
                        text: '小学'
                    },
                    {
                        index: 'ed1',
                        text: '初中'
                    },
                    {
                        index: 'ed2',
                        text: '高中'
                    },
                    {
                        index: 'ed3',
                        text: '本科'
                    },
                    {
                        index: 'ed4',
                        text: '硕士'
                    }
                ],
                //分页信息
                pagination:{
                    pageSize:10,
                    currentPage:1,
                    total:100
                },
                tableData: [],
                tableHeight: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 280,//（这里的240是减去表格上面导航和搜索条件的高度）
                // 城市列表
                cityList:threeLevelAddress,
                // 详情订单模态框
                orderDetailes:{
                    dialogVisible:false,
                    data:{
                        orderId:'',
                        userId:'',
                        userName:'',
                        userMobile:'',
                        userProvince:'',
                        userCity:'',
                        userArea:'',
                        orderTypeCode:'',
                        orderTypeName:'',
                        totalPay:'',
                        userId:'',
                        sex:'',
                        address:'',
                        education:'',
                        startTime:'',
                        endTime:'',
                        maxAge:'',
                        minAge:'',
                        remark:'',

                        userCityArray:'',//存放拼接后的地址数组
                        dateTimeRange:'' //存放订单时间范围
                    },
                    rules: {
                        userName: {   
                            required: true ,
                            validator: (rule, value, callback)=>{
                                let nameReg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
                                if(value.length == 0){
                                    callback(new Error('请输入客户姓名'));
                                };
                                if (!nameReg.test(value)) {
                                    callback(new Error('姓名只允许中英文'));
                                };
                                callback();//验证通过必须回调一下返回
                            }
                        },
                        sex:{ required: true, message:'请选择性别' },
                        userMobile:{ 
                            required: true,trigger: 'blur', 
                            validator: (rule, value, callback)=>{
                                let phoneReg = /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/;
                                if(value.length == 0){
                                    callback(new Error('请输入客户手机号'));
                                };
                                if (!phoneReg.test(value)) {
                                    callback(new Error('手机号格式不正确'));
                                };
                                callback();//验证通过必须回调一下返回
                            } 
                        },
                        userCityArray:{ required: true, message:'请选择客户省市区' },
                        orderTypeCode:{ required: true, message:'请选择订单类型' },
                        totalPay:{ required: true, validator:(rule, value, callback) => {
                                if (value.length == 0) {
                                    callback(new Error('请输入支付金额'));
                                }
                                var ageReg = /[0-9]/;
                                var payReg = /^\d+(\.\d{1,2})?$/
                                if (!ageReg.test(value)) {
                                    callback(new Error('支付金额必须为数字值'));
                                }
                                else if (value <= 0) {
                                        callback(new Error('支付金额必须大于零'));
                                }
                                else if (!payReg.test(Number(value))) {
                                    callback(new Error('支付金额只能输入两位小数'));
                                }else{
                                    callback();
                                }
                            }
                        },
                        dateTimeRange:{ required: true, message:'请选择订单时间' },
                        address:{ required: true, message: '请输入服务地址'},
                        remark:{},//不写无法清空表单
                        minAge: { 
                            validator:(rule, value, callback) => {
                                if(value.length == 0){
                                    callback();
                                }
                                var ageReg = /[0-9]/;
                                if (!ageReg.test(value)) {
                                    callback(new Error('最小年龄必须为数字值'));
                                } else {
                                    if (value <= 18) {
                                        callback(new Error('最小年龄必须大于18岁'));
                                    };
                                    if(this.orderDetailes.data.maxAge){
                                        if (value >=  this.orderDetailes.data.maxAge) {
                                            callback(new Error('最小年龄必须小于最大年龄'));
                                        }
                                    }
                                };
                                callback();//验证通过必须回调一下返回
                            }
                        },
                        maxAge:{ 
                            validator:(rule, value, callback) => {
                                if(value.length == 0){
                                    callback();
                                }
                                var ageReg = /[0-9]/;
                                if (!ageReg.test(value)) {
                                    callback(new Error('最大年龄必须为数字值'));
                                } else {
                                    if (!this.orderDetailes.data.minAge) {
                                        callback(new Error('输入最大年龄前必须输入最小年龄'));
                                    };
                                    if (value <=  this.orderDetailes.data.minAge) {
                                        callback(new Error('最大年龄必须大于最小年龄'));
                                    }
                                };
                                callback();//验证通过必须回调一下返回
                            }
                        }
                    }
                },
                ModelFormDisable:true,
                orderId:'',

                orderTypeCodeDisabled:false  //不允许编辑订单类型
            }
        },
        computed:{
            renderWorkTypeNotAll(){
                let arry = JSON.parse(JSON.stringify(this.inputRenderData.renderWorkType));
                if(this.inputRenderData.renderWorkType.length>0) arry.shift();
                return arry;
            }
        },
        methods:{
            // indexMethod(index){
            //     let num = index + 1;
               
            //     if(this.pagination.currentPage>1){
            //         num = (this.pagination.currentPage - 1)*this.pagination.pageSize + index + 1;
            //     }
            //     return num
            // },
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.getTableInfo()
            },
            resetQueryParams(){
                for(let i in this.inputSelectedData){
                    if(this.inputSelectedData.hasOwnProperty(i)){
                        this.inputSelectedData[i] = ''
                    }
                }
            },
            getWorkType(){
                this.$post('/sharePlatform-person/workTypeAll/queryWorkTypeAll',{
                }).then(res => {
                    let typeAll = {"valid":0,"createBy":0,"allId":"","createTime":"","log":"","updateBy":0,"name":"全部","updateTime":"","version":0};
                    this.inputRenderData.renderWorkType = res.data;
                    if(res.data){
                        this.inputRenderData.renderWorkType.unshift(typeAll);
                    }
                })
            },
            getTableInfo(currentPage){
                if(currentPage == 1) this.pagination.currentPage = 1;//查询按钮调用该方法，页码设置为1
                if(this.inputSelectedData.customerMobile && !/^1[3456789]\d{9}$/.test(this.inputSelectedData.customerMobile)){
                    this.$message.closeAll();//关闭之前的提示
                    this.$message.error('手机号码格式不正确');
                    return false;
                }
                // 获取订单
                this.$postwc('/sharePlatform-order/OrderConsume/queryOrderListPC',{
                    pageNum: this.pagination.currentPage,
                    pageSize: this.pagination.pageSize,
                    userName:this.inputSelectedData.customerName.trim(),
                    userMobile:this.inputSelectedData.customerMobile,
                    //sex:this.inputSelectedData.customerSex,
                    orderType:this.inputSelectedData.worktype,
                    companyId:sessionStorage.getItem('orgId')
                }).then(res =>{
                    if(res.code == 'I1-00-001'){
                        if(res.data)this.tableData = res.data.list;
                        this.tableData.forEach((value) => {
                            switch (value.sex) {
                                case 1:
                                    value.sex = '男'
                                    break;
                                case 2:
                                    value.sex = '女'
                                    break;
                                default:
                                    value.sex = '未知'
                                    break;
                            }
                            //拼接表格地址
                            if(value.userProvince){
                                value.userCityStr = this.getProvinceFromCode(value.userProvince);
                                if(value.userCity){
                                    value.userCityStr += '/' +  this.getCityFromCode(value.userCity);
                                    if(value.userArea){
                                        value.userCityStr += '/' +  this.getAreaFromCode(value.userArea);
                                    }
                                }
                            }else{
                                value.userCityStr = ''
                            }
                        
                        });
                        
                        this.pagination.total = res.data.total;
                    }else{
                        this.tableData = [];
                    }
                })
            },
            // 根据code获取省名称或索引
            getProvinceFromCode(code,index){
                let c = code || this.workCityReback
                for(let i in threeLevelAddress){
                    if(threeLevelAddress[i].value === code.toString().substr(0,6)){
                        if(!index){
                            return threeLevelAddress[i].label
                        }else{
                            return i;
                        }
                    }
                }
            },
            // 根据code获取市名称或索引
            getCityFromCode(code,index){
                for(let i in threeLevelAddress){
                    if(threeLevelAddress[i].value === code.toString().substr(0,6)){
                        for(let j in threeLevelAddress[i].children){
                            if(threeLevelAddress[i].children[j].value === code.toString().substr(0,9)){
                                if(!index){
                                    return threeLevelAddress[i].children[j].label
                                }else{
                                    return j
                                }
                            }
                        }
                    }
                }
            },
            // 根据code获取区名称
            getAreaFromCode(code,type){
                for(let i in threeLevelAddress){
                    if(threeLevelAddress[i].value === code.toString().substr(0,6)){
                        for(let j in threeLevelAddress[i].children){
                            if(threeLevelAddress[i].children[j].value === code.toString().substr(0,9)){
                                for(let k in threeLevelAddress[i].children[j].children){
                                    if(threeLevelAddress[i].children[j].children[k].value === code.toString().substr(0,12)){
                                        if(!type){
                                            return threeLevelAddress[i].children[j].children[k].label
                                        }else{
                                            return k
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            checkMobile(){
                if(this.inputSelectedData.customerMobile === '0'){
                    this.inputSelectedData.customerMobile = ''
                }
                this.inputSelectedData.customerMobile = this.inputSelectedData.customerMobile.replace(/\D/g,'')
            },
            //拼接修改后接口需要的地址字段
            changeCity(value){
                if(value){
                    this.orderDetailes.data.userProvince = value[0];
                    this.orderDetailes.data.userCity = value[1];
                    this.orderDetailes.data.userArea = value[2];
                }else{
                    this.orderDetailes.data.userProvince = 
                    this.orderDetailes.data.userCity = 
                    this.orderDetailes.data.userArea = '';
                }
            },
            //拼接修改接口需要的订单名称
            changeOrderType(value){
                this.renderWorkTypeNotAll.forEach( (item)=>{
                    if(Number(value) == item.allId){
                        this.orderDetailes.data.orderTypeName = item.name;
                    }
                })
            },
            //拼接修改后接口需要的时间字段
            changeOrderTime(value){
                if(value){
                    var d = new Date(value[0]);
                    var a = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + this.addZero(d.getMinutes());
                    this.orderDetailes.data.startTime = a;

                    var d = new Date(value[1]);
                    var a = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + this.addZero(d.getMinutes());
                    this.orderDetailes.data.endTime = a;
                }else{
                    this.orderDetailes.data.startTime = '';
                    this.orderDetailes.data.endTime = '';
                }
            },
            addZero (m) {
                return m < 10 ? '0'+m : m;
            },
            //打开订单详情  1、新增时order为null  ,2、查看详情时 disabled为true禁用表单
            orderrModelOpen(orderId,disabled){
                this.orderId = orderId;
                this.ModelFormDisable = disabled;
                let orderDetaildata = this.orderDetailes.data;
                orderDetaildata.dateTimeRange = [];
                orderDetaildata.userCityArray = [];  //解决地址回显问题
                this.orderDetailes.dialogVisible = true;
                this.orderTypeCodeDisabled  = false;
                //没有orderId的情况下清空对象
                if(!orderId){
                    let data = orderDetaildata;
                    //for(let index in data){ data[index] = ''};
                    return false;
                };
                if(disabled == false){
                    this.orderTypeCodeDisabled = true;
                }

                this.$postwc('/sharePlatform-order/Order/queryOrderDetailById',{
                    orderId:orderId
                }).then(res => {
                    orderDetaildata.orderId = res.data.orderId;
                    orderDetaildata.sex = res.data.sex;
                    orderDetaildata.address = res.data.address;
                    orderDetaildata.education = res.data.education;
                    orderDetaildata.startTime = res.startTime;
                    orderDetaildata.endTime = res.data.endTime;
                    orderDetaildata.maxAge = res.data.maxAge == 0 ? '' : res.data.maxAge;
                    orderDetaildata.minAge = res.data.minAge == 0 ? '' : res.data.minAge;
                    orderDetaildata.remark = res.data.remark;
                    //order下的数据
                    orderDetaildata.userId = res.data.order.userId;
                    orderDetaildata.userName = res.data.order.userName;
                    orderDetaildata.userMobile = res.data.order.userMobile;
                    orderDetaildata.userProvince = res.data.order.userProvince;
                    orderDetaildata.userCity = res.data.order.userCity;
                    orderDetaildata.userArea = res.data.order.userArea;
                    orderDetaildata.orderTypeCode = res.data.order.orderType;
                    orderDetaildata.orderTypeName = res.data.order.orderTypeName;
                    orderDetaildata.totalPay = res.data.order.totalPay == 0 ? '': res.data.order.totalPay;
                    orderDetaildata.userId = res.data.order.userId;
                    //回显时间
                    orderDetaildata.dateTimeRange= [new Date(res.data.startTime), new Date(res.data.endTime)];
                    //回显地址
                    orderDetaildata.userCityArray = [res.data.order.userProvince,res.data.order.userCity,res.data.order.userArea];
                    
                })
            },
            //关闭订单详情，关闭前清空表单，避免再次打开时有遗留数据 
            OrderrModelClose(){
                this.$refs.ruleForm.resetFields();
            },
            //关闭订单详情 
            OrderrModelClosed(){
                this.orderDetailes.dialogVisible = false;
            },
            //保存订单详情
            orderSubmit(){
                if(this.orderId){
                    var url = '/sharePlatform-order/Order/updateOrderAndDetail';
                    var message = '修改成功';
                }else{
                    var url = '/sharePlatform-order/Order/insertOrderAndDetail'
                    var message = '保存成功';
                };
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        let params = this.orderDetailes.data;
                        this.orderDetailes.dialogVisible = false;
                        this.$postwc(url,{
                            orderId: params.orderId,
                            sex: params.sex,
                            address: params.address.trim(),
                            education: params.education,
                            startTime: params.startTime,
                            endTime: params.endTime,
                            minAge: params.minAge,
                            maxAge: params.maxAge,
                            remark: params.remark.trim(),
                            order: {
                                userId: params.userId,
                                userName: params.userName.trim(),
                                userMobile: params.userMobile.trim(),
                                userProvince: params.userProvince,
                                userCity: params.userCity,
                                userArea: params.userArea,
                                orderType: params.orderTypeCode,
                                orderTypeName: params.orderTypeName,
                                totalPay: params.totalPay,
                                userId:params.userId,
                                companyId: sessionStorage.getItem('orgId'),//新增接口需要传递参数
                                source: sessionStorage.getItem('orgId')//新增接口需要传递参数
                            }
                            
                        }).then(res => {
                            this.$message.closeAll();
                            if (res.code == 'I1-00-001') {
                                this.$message({type: 'success',message: message});
                                this.getTableInfo();
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            }
        },
        mounted() {
            window.onresize = () => { this.tableHeight = window.innerHeight - 280  };
            this.getTableInfo()
            this.getWorkType()
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