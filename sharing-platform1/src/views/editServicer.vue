<template>
    <div>
        <mt-header title="服务人员信息修改">
            <mt-button slot="left" icon="back" @click="back">返回</mt-button>
            <!--<mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>
        <div class="g-list">
            <div class="item">
                <span><i style="color:#f00;">*</i>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:</span>
                <input disabled v-model="form.userName" type="text">
            </div>
            <div class="item">
                <span><i style="color:#f00;">*</i>身份证号:</span>
                <input disabled @input="checkIdCardNum" v-model="form.idCardNum" maxlength="18" type="text">
            </div>
            <div class="item" style="height: max-content;">
                <span><i style="color:#f00;">*</i>工&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;种:</span>
<!--
                <mt-checklist v-model="workIdValue" :options="workIdOption" :aria-disabled="true" style="display: inline-table;width: 16.5rem;">
-->
                <mt-checklist v-model="workIdValue" :options="workIdOption"  style="display: inline-table;width: 16.5rem;">
                </mt-checklist>
                <!--<input @click="showWorkType" v-model="workType" type="text">-->
            </div>
            <div class="item">
                <span><i style="color:#f00;">*</i>工作城市:</span>
                <input v-model="totalCity" type="text" readonly @click="showCityPicker()">
            </div>
            <div class="item">
                <span><i style="color:#f00;">*</i>手机号码:</span>
                <input disabled maxlength="11" @input="checkMobile" v-model="form.mobile" type="text">
            </div>
            <div class="item">
                <span><i style="color:#f00;">*</i>籍&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贯:</span>
                <input v-model="totalHome"  @click="showHomePicker()" type="text">
<!--                <input disabled v-model="totalHome"  type="text">-->
            </div>
            <div class="item">
                <span><i style="color:#fff;">*</i>家庭地址:</span>
                <input v-model="form.address" type="text"  placeholder="最多输入50字" maxlength="50">
            </div>
            <div class="item">
                <span><i style="color:#fff;">*</i>工作年限:</span>
                <input v-model="form.workingLife" type="text" maxlength="2" oninput="this.value=this.value.replace(/\D/g,'')">
            </div>
            <div class="item" style="display: flex;height: max-content;margin-bottom: 0.5rem">
                <span>介&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;绍:</span>
                <textarea v-model="form.introduction"  placeholder="最多输入50字" maxlength="50" class="text" name="" id="" cols="30" rows="10"></textarea>
            </div>
            <div class="item2">
                <div class="left">
                    <span class="title">身&nbsp;&nbsp;份&nbsp;&nbsp;证:</span>
                    <!--<span class="subtitle">点击重置</span>-->
                </div>
                <div class="right">
                    <input @change="changeIdCard1" ref="idcard2" type="file" hidden accept="image/*" multiple>
                    <input @change="changeIdCard2" ref="idcard1" type="file" hidden accept="image/*" multiple>
                    <span class="img" @click="uploadIdCard('1')" id="IDim">

                        <img :src="idcard2" alt=""  >
                    </span>
                    <span class="img" @click="uploadIdCard('2')" id="IDim2">
                        <img :src="idcard1" alt="">
                    </span>
                </div>
            </div>
            <div class="item2">
                <div class="left">
                    <span class="title">健&nbsp;&nbsp;康&nbsp;&nbsp;证:</span>
                    <!--<span class="subtitle">点击重置</span>-->
                </div>
                <div class="right">
                    <input @change="changeCert1" ref="cert1" type="file" accept="image/*" multiple hidden>
                    <input @change="changeCert2" ref="cert2" type="file" accept="image/*" multiple  hidden>
                    <span class="img" @click="uploadCert('1')">
                    上传正面
                        <img :src="cert1" alt="">
                    </span>
                    <span class="img" @click="uploadCert('2')">
                        <img :src="cert2" alt="">
                    上传反面
                    </span>
                </div>
            </div>
            <div class="item2">
                <div class="left">
                    <span class="title">头&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;像:</span>
                    <!--<span class="subtitle">点击重置</span>-->
                </div>
                <div class="right">
                    <input @change="changeAvatar" ref="avatar" type="file" hidden accept="image/*" multiple>
                    <span class="img" @click="uploadAvatar('3')">
                    上传头像
                        <img :src="avatar" alt="">
                    </span>

                </div>
            </div>
            <button @click="saveDetails">保存</button>
        </div>
        <!--工作城市二级联动-->
        <mt-popup v-model="popupVisible" position="bottom" class="g-cityPicker">
            <div class="buttons">
                <button class="cancel" @click="showCityPicker">
                    取消
                </button>
                <button class="select" @click="showCityPicker">
                    确认
                </button>
            </div>
            <mt-picker :slots="serviceCitySlots" valueKey="name" @change="addressChange"></mt-picker>
        </mt-popup>
        <!--籍贯三级联动-->
        <mt-popup v-model="popupVisibleHome" position="bottom" class="g-homePicker">
            <div class="buttons">
                <button class="cancel" @click="showHomePicker">
                    取消
                </button>
                <button class="select" @click="showHomePicker">
                    确认
                </button>
            </div>
            <mt-picker :slots="myAddressSlots" valueKey="name" @change="homeChange"></mt-picker>
        </mt-popup>
        <mt-popup v-model="popupVisibleWorkType" position="bottom" class="g-workType">
            <div class="buttons">
                <button class="cancel" @click="showWorkType">
                    取消
                </button>
                <button class="select" @click="showWorkType">
                    确认
                </button>
            </div>
            <mt-picker :slots="myWorkType" valueKey="name" @change="workTypeChange"></mt-picker>
        </mt-popup>
    </div>
</template>

<script>
    import threeLevelAddress from '../api/CityCode.json'
    export default {
        name: "editServicer",
        data() {
            let that = this;
            return {
                serverWorkerId:this.getWorkType(),
                workCityReback:'',
                isBtns:false,
                workProvinceIndex:1,
                workIdValue:[],
                deletePicId:'',
                workChangeValue:[],
                workIdOption:this.tempWorkIdArr(),
                popupVisible: false,
                popupVisibleHome: false,
                popupVisibleWorkType: false,
                popupVisibleSex: false,
                serviceCitySlots:[{
                    flex: 1,
                    values: this.getProvinceArr(),
                    className: 'slot1',
                    textAlign: 'center',
                    defaultIndex:0
                }, {
                    divider: true,
                    content: '-',
                    className: 'slot2'
                }, {
                    flex: 1,
                    values: this.getCityArr("请选择"),
                    className: 'slot3',
                    textAlign: 'center',
                    defaultIndex:0
                }],
                myAddressSlots: [
                    {
                        flex: 1,
                        values: this.getProvinceArr(),
                        className: 'slot1',
                        textAlign: 'center',
                        defaultIndex:0
                    }, {
                        divider: true,
                        content: '-',
                        className: 'slot2'
                    }, {
                        flex: 1,
                        values: this.getCityArr("请选择"),
                        className: 'slot3',
                        textAlign: 'center',
                        defaultIndex:0
                    }, {
                        divider: true,
                        content: '-',
                        className: 'slot4'
                    }, {
                        flex: 1,
                        values: this.getCountyArr("请选择", "请选择"),
                        className: 'slot5',
                        textAlign: 'center',
                        defaultIndex:0
                    }
                ],
                myWorkType: [
                    {
                        flex: 1,
                        values: this.getWorkType(),
                        className: 'slot6',
                        textAlign: 'center',

                    }
                ],
                cityPicker: {
                    region: '',//三级地址
                    province: '',//省
                    city: '',//市
                    county: '',//县
                    provinceCode: '',//省级代码
                    cityCode: '', //市级代码
                    countyCode: '',//县级代码
                    regionVisible: false,//弹出框是否可见
                    regionInit: false
                },
                homePicker: {
                    region: '',//三级地址
                    province: '',//省
                    city: '',//市
                    county: '',//县
                    provinceCode: '',//省级代码
                    cityCode: '', //市级代码
                    countyCode: '',//县级代码
                    regionVisible: false,//弹出框是否可见
                    regionInit: false
                },
                workTypeCode: '',
                workType: '',
                form: {
                    userName: '',
                    mobile: '',
                    idCardNum: '',
                    address: '',
                    introduction: '',
                    workingLife: '',
                },
                headPic:'',
                idcard2:'',
                idcard1:'',
                cert1:'',
                cert2:'',
                avatar:'',
                picArr:[],
                picArrNew:[],
                defaultAjaxData:[]
            }
        },
        methods: {

            back () {
                let obj=JSON.parse(sessionStorage.getItem('obj'))
                if(obj.type=='1'){//服务人员详情
                    if(this.$route.query.type=='1'){
                        this.$router.push('/index/servicerManagerment/servicerDetails'+'?personnelId='+obj.personnelId+'&seeNum='+obj.seeNum+'&isInPool='+obj.isInPool+'&type=1');

                    }else{
                        this.$router.push('/index/servicerManagerment/servicerDetails'+'?personnelId='+obj.personnelId+'&seeNum='+obj.seeNum+'&isInPool='+obj.isInPool);

                    }
                }else{
                    this.$router.push('/index/servicerManagerment');
                }
            },
            // 工作城市弹出层切换事件
            addressChange(picker, values) {
                //取值并赋值

                this.cityPicker.region = values[0]["name"] + values[1]["name"] //+ values[2]["name"];
                this.cityPicker.province = values[0]["name"];
                this.cityPicker.city = values[1]["name"];
                // this.cityPicker.county = values[2]["name"];
                this.cityPicker.provinceCode = values[0]["code"];
                this.cityPicker.cityCode = values[1]["code"];
                // this.cityPicker.countyCode = values[2]["code"];

                //给市、县赋值
                picker.setSlotValues(1, this.getCityArr(values[0]["name"]));
                picker.setSlotValues(2, this.getCountyArr(values[0]["name"], values[1]["name"]));
            },
            // 籍贯弹出层切换事件
            homeChange(picker, values) {
                //取值并赋值
                this.homePicker.region = values[0]["name"] + values[1]["name"] + values[2]["name"];
                this.homePicker.province = values[0]["name"];
                this.homePicker.city = values[1]["name"];
                this.homePicker.county = values[2]["name"];
                this.homePicker.provinceCode = values[0]["code"];
                this.homePicker.cityCode = values[1]["code"];
                this.homePicker.countyCode = values[2]["code"];

                //给市、县赋值
                picker.setSlotValues(1, this.getCityArr(values[0]["name"]));
                picker.setSlotValues(2, this.getCountyArr(values[0]["name"], values[1]["name"]));
            },
            // 工种弹出层切换
            workTypeChange(picker, values) {

                this.workTypeCode = values[0]["allId"]
                this.workType = values[0]["name"]
            },
            // 省级对象数组
            getProvinceArr() {
                let provinceArr = [];
                threeLevelAddress.forEach(function (item) {
                    let obj = {};
                    obj.name = item.cityName;
                    obj.code = item.cityCode;
                    provinceArr.push(obj);
                });
                return provinceArr;
            },
            // 市级对象数组
            getCityArr(province,city) {
                let cityArr = [];
                threeLevelAddress.forEach(function (item) {
                    if (item.cityName === province) {
                        item.childList.forEach(function (args) {
                            let obj = {};
                            obj.name = args.cityName;
                            obj.code = args.cityCode;
                            cityArr.push(obj);
                        });
                    }
                });
                return cityArr;
            },
            // 区级对象数组
            getCountyArr(province, city) {
                let countyArr = [];
                threeLevelAddress.forEach(function (item) {
                    if (item.cityName === province) {
                        item.childList.forEach(function (args) {
                            if (args.cityName === city) {
                                args.childList.forEach(function (param) {
                                    let obj = {};
                                    obj.name = param.cityName;
                                    obj.code = param.cityCode;
                                    countyArr.push(obj);
                                })
                            }
                        });
                    }
                });
                return countyArr;
            },
            showAddressPicker() {
                this.cityPicker.regionVisible = true;
            },
            // 城市层控制
            showCityPicker() {
                this.popupVisible = !this.popupVisible;
            },
            // 籍贯层控制
            showHomePicker() {
                document.activeElement.blur()
                this.popupVisibleHome = !this.popupVisibleHome;
            },
            // 工种层控制
            showWorkType() {
                let that = this;
                that.popupVisibleWorkType = !that.popupVisibleWorkType;
            },
            // 获取工种
            getWorkType() {
                let tmpArr = []
                $.ajax({
                    type: 'post',
                    url: '/sharePlatform-person/workTypeAll/queryWorkTypeAll',
                    data: {},
                    dataType: 'json',
                    async: false,
                    headers: {
                        "platform": "sharePlatform-weixin",
                        "jzpt-token": localStorage.getItem('token')
                    },
                    success(res) {
                        // for(let i in res.data){
                        //     a.push(res.data[i])
                        // }
                        tmpArr = res.data
                    }
                });
                return tmpArr;
            },
            // 提交
            async saveDetails() {
                let that = this;
                if(that.isBtns)return;
                that.isBtns=true;

                if(!that.form.userName){
                    that.$toast('请输入姓名')
                    that.isBtns=false;
                    return false;
                }
                if(!that.form.idCardNum){
                    that.$toast('请输入身份证号')
                    that.isBtns=false;
                    return false;
                }
                if(!that.form.mobile){
                    that.$toast('请输入手机号码')
                    that.isBtns=false;
                    return false;
                }
                if(that.cityPicker.cityCode === '0000'){
                    that.$toast('请选择工作城市')
                    that.isBtns=false;
                    return false;
                }
                if(that.workIdValue.length === 0){
                    that.$toast('请选择工种')
                    that.isBtns=false;
                    return false;
                }
                var payReg = /^[1-9]\d*$/
                if (that.form.workingLife && !payReg.test(that.form.workingLife)) {
                    that.$toast('工作年限只能是正整数')
                    that.isBtns=false;
                    return false;
                }
                if((that.idcard2&&!that.idcard1)||(!that.idcard2&&that.idcard1)){
                    that.$toast('请上传完整的身份证照片')
                    that.isBtns=false;
                    return false;
                }
                // 识别身份证正面
                let OcrValueFront =  await new Promise(resolve => {
                    if(!that.idcard2){
                        resolve(true)
                        return
                    }
                    that.$post('http://erp.95081.com/public-service/ocr/idCardOCR',{
                        imgURL:that.idcard2
                    })
                        .then(res => {
                            if(res.status === 0){
                                let _result = JSON.parse(res.data).result
                                if(_result.issue){
                                    //that.$toast('身份证识背面识别成功')
                                    resolve(true)
                                }else{

                                    that.$toast('身份证国徽面识别遇到未知错误')

                                    resolve(false)
                                }
                            }else{

                                that.$toast(res.msg)

                                resolve(false)
                            }
                        })
                        .catch(e => {

                            that.$toast('请求超时，请稍后再试')

                            resolve(false)
                        })

                });

                if( !OcrValueFront){

                    //that.$toast('身份证照片正面核验有误，请您核对已填写的身份证号和已上传的身份证正反面是否正确')
                    that.idcard2=''
                    that.isBtns=false;
                    return  false;
                }

                // 识别身份证背面
                let OcrValueBack =  await new Promise(resolve => {
                    if(!that.idcard1){
                        resolve(true)
                        return
                    }
                    that.$post('http://erp.95081.com/public-service/ocr/idCardOCR',{
                        imgURL:that.idcard1
                    })
                        .then(res => {
                            if(res.status === 0){
                                let _result = JSON.parse(res.data).result

                                if(_result.number){
                                    if(_result.number.toString() !== that.form.idCardNum.toString()){
                                        that.$toast('请上传正确的身份证照片')
                                        resolve(false)

                                    }else{

                                        //that.$toast('身份证识正面识别成功')
                                        resolve(true)
                                    }

                                }else{

                                    that.$toast('身份证人像面识别遇到未知错误')

                                    resolve(false)
                                }
                            }else{

                                that.$toast('身份证识人像面识别错误，原因:' +  res.msg)

                                resolve(false)
                            }
                        })
                        .catch(e => {
                            that.$toast('请求超时，请稍后再试')

                            resolve(false)
                        })
                });


                if( !OcrValueBack){

                    //that.$toast('身份证照片背面核验有误，请您核对已填写的身份证号和已上传的身份证正反面是否正确')

                    that.isBtns=false;
                    return  false;
                }

                let str = JSON.stringify([
                    {
                        url:that.idcard1,
                        suffix: that.idcard1.substring(that.idcard1.length - 3),
                        type:1,
                        filename:that.idcard1.replace(/.*(\/|\\)/, "").replace(/[^.]+$/,"").replace('.','')
                    },
                    {
                        url:that.idcard2,
                        suffix: that.idcard2.substring(that.idcard2.length - 3),
                        type:2,
                        filename:that.idcard2.replace(/.*(\/|\\)/, "").replace(/[^.]+$/,"").replace('.','')
                    },
                    {
                        url:that.cert1,
                        suffix: that.cert1.substring(that.cert1.length - 3),
                        type:3,
                        filename:that.cert1.replace(/.*(\/|\\)/, "").replace(/[^.]+$/,"").replace('.','')
                    },
                    {
                        url:that.cert2,
                        suffix: that.cert2.substring(that.cert2.length - 3),
                        type:4,
                        filename:that.cert2.replace(/.*(\/|\\)/, "").replace(/[^.]+$/,"").replace('.','')
                    }
                ])

                await that.$post('/sharePlatform-person/personnel/updatePersonnel', {
                    personnelId: that.$route.query.personnelId,
                    userName: that.form.userName,
                    idCardNum: that.form.idCardNum,
                    mobile: that.form.mobile,
                    deleteId:that.deleteId,
                    workerId:that.getWorkerId,

                     deleteTypeId:that.defaultAjaxData.workerId,
                    userId:that.defaultAjaxData.userId,
                    // deletePicId:that.deletePicId?that.deletePicId.substring(0,that.deletePicId.length-1):"",
                    address: that.form.address,
                    userProvince: that.homePicker.provinceCode,
                    userCity: that.homePicker.cityCode,
                    userArea: that.homePicker.countyCode,
                    introduction: that.form.introduction,
                    workingLife: that.form.workingLife,
                    picStr: str,
                    deletePic:that.picStr,
                    headPic:that.avatar,
                    serviceCity: that.cityPicker.cityCode
                }).then(res => {
                    if (res.code == 'I1-00-9999') {
                        this.$toast('修改成功');
                        this.$router.push({
                            name: 'servicerManagerment'
                        })
                    } else {
                        this.$toast(res.msg);
                        that.isBtns=false;
                    }
                })
            },
            // 点击图片上传身份证事件分发
            uploadIdCard(value){
                switch (value) {
                    case '1':
                        this.$refs['idcard1'].click()
                        break;
                    case '2':
                        this.$refs['idcard2'].click()
                        break;
                    default:
                        break;
                }
            },
            // 上传身份证正面
            changeIdCard1(e){
                let that = this;
                console.log(e.target.files[0])
                this.$file(e.target.files[0])
                    .then(res => {
                        console.log(res)
                        that.idcard1 = res.reUrl[0];
                        for(let i in that.picArr){
                            if(that.picArr[i].type === 1){
                                that.$refs['idcard1'].dataset.tableid = that.picArr[i].picId
                            }
                        }
                        console.log(that.picStr)
                    })
            },
            // 上传身份证反面
            changeIdCard2(e){
                let that = this;
                console.log(e.target.files[0])
                this.$file(e.target.files[0])
                    .then(res => {
                        console.log(res)
                        that.idcard2 = res.reUrl[0];
                        for(let i in that.picArr){
                            if(that.picArr[i].type === 2){
                                that.$refs['idcard2'].dataset.tableid = that.picArr[i].picId
                            }
                        }
                    })
            },
            // 上传健康证的事件分发
            uploadCert(value){
                switch (value) {
                    case '1':
                        this.$refs['cert1'].click()
                        break;
                    case '2':
                        this.$refs['cert2'].click()
                        break;
                    default:
                        break;
                }
            },
            // 上传健康证正面
            changeCert1(e){
                let that = this;
                this.$file(e.target.files[0])
                    .then(res => {
                        console.log(res)
                        that.cert1 = res.reUrl[0];
                        for(let i in that.picArr){
                            if(that.picArr[i].type === 3){
                                that.$refs['cert1'].dataset.tableid = that.picArr[i].picId
                            }
                        }
                    })
            },
            // 上传健康证反面
            changeCert2(e){
                let that = this;
                this.$file(e.target.files[0])
                    .then(res => {
                        console.log(res)
                        that.cert2 = res.reUrl[0];
                        for(let i in that.picArr){
                            if(that.picArr[i].type === 4){
                                that.$refs['cert2'].dataset.tableid = that.picArr[i].picId
                            }
                        }
                    })
            },
            // 上传头像的事件分发
            uploadAvatar(value){
                this.$refs['avatar'].click()
            },
            //上传头像
            changeAvatar(e){
                let that = this;
                this.$file(e.target.files[0])
                    .then(res => {
                        console.log(res)
                        that.avatar = res.reUrl[0];
                    })
            },
            // 身份证号输入限制
            checkIdCardNum(e){
                e.target.value = e.target.value.replace(/\D/g,'')

            },
            // 手机号输入限制
            checkMobile(e){
                e.target.value = e.target.value.replace(/\D/g,'')
            },
            tempWorkIdArr(){
                let arr = this.getWorkType()
                let result = []
                for(let i in arr){
                    // result.push({label:arr[i].name,value:arr[i].name,disabled:true})
                    result.push({label:arr[i].name,value:arr[i].name})
                }
                console.log(result)
                return result;
            },
            // 根据code获取省名称或索引
            getProvinceFromCode(code,index){
                let c = code || this.workCityReback
                for(let i in threeLevelAddress){
                    if(threeLevelAddress[i].cityCode === code.toString().substr(0,6)){
                        if(!index){
                            return threeLevelAddress[i].cityName
                        }else{
                            return i;
                        }
                    }
                }
            },
            // 根据code获取市名称或索引
            getCityFromCode(code,index){
                for(let i in threeLevelAddress){
                    if(threeLevelAddress[i].cityCode === code.toString().substr(0,6)){
                        for(let j in threeLevelAddress[i].childList){
                            if(threeLevelAddress[i].childList[j].cityCode === code.toString().substr(0,9)){
                                if(!index){
                                    return threeLevelAddress[i].childList[j].cityName
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
                    if(threeLevelAddress[i].cityCode === code.toString().substr(0,6)){
                        for(let j in threeLevelAddress[i].childList){
                            if(threeLevelAddress[i].childList[j].cityCode === code.toString().substr(0,9)){
                                for(let k in threeLevelAddress[i].childList[j].childList){
                                    if(threeLevelAddress[i].childList[j].childList[k].cityCode === code.toString().substr(0,12)){
                                        if(!type){
                                            return threeLevelAddress[i].childList[j].childList[k].cityName
                                        }else{
                                            return k
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        mounted(){
            let that=this
            pushHistory()
            that.gotoURL(function () {
                pushHistory()
                let obj=JSON.parse(sessionStorage.getItem('obj'))
                if(obj.type=='1'){//服务人员详情
                    that.$router.push('/index/servicerManagerment/servicerDetails'+'?personnelId='+obj.personnelId+'&seeNum='+obj.seeNum+'&isInPool='+obj.isInPool);
                }else{
                    that.$router.push('/index/servicerManagerment');
                }
            })
        },
        created() {
            let that = this;

            that.$post('/sharePlatform-person/workTypeAll/queryWorkTypeAll',{
            }).then(res => {
                console.log(res)
            })

            that.$post('/sharePlatform-person/personnel/loadPersonnel',{
                personnelId:that.$route.query.personnelId
            }).then(res => {
                that.defaultAjaxData = res.data
                that.form.address = res.data.address
                that.form.userName = res.data.userName
                that.form.mobile = res.data.mobile
                that.form.idCardNum = res.data.idCardNum

                var workingLife = res.data.workingLife;
                workingLife == '-1' ? that.form.workingLife = '' : that.form.workingLife = workingLife
                that.form.introduction = res.data.introduction
                that.picArr = res.data.listPic
                if(res.data.headPic=='http://erp.95081.com/img/headphoto/2019/10/10/762c64c381cc497daa957836c589b5c5.png'||res.data.headPic=='http://erp.95081.com/img/headphoto/2019/10/10/5249bbfce52a4970be46743084106981.png'){
                    that.avatar =''
                }else{
                    that.avatar =res.data.headPic
                }
                //that.avatar = res.data.headPic=='http://erp.95081.com/img/headphoto/2019/10/10/762c64c381cc497daa957836c589b5c5.png'?'':res.data.headPic
                that.workCityReback = res.data.serviceCity
                for(let i in that.picArr){
                    console.log(that.picArr[i].picId)
                    that.deletePicId+=that.picArr[i].picId+','
                    switch (that.picArr[i].type) {
                        case 1:
                            that.idcard1 = that.picArr[i].url
                        break;
                        case 2:
                            that.idcard2 = that.picArr[i].url
                            break;
                        case 3:
                            that.cert1 = that.picArr[i].url
                            break;
                        case 4:
                            that.cert2 = that.picArr[i].url
                            break;

                    }
                }
                that.workIdValue = res.data.workerName.split(',')
                that.workChangeValue = res.data.workerName.split(',')
                //回显工作城市
                console.log(res.data.serviceCity)
                that.serviceCitySlots[0].defaultIndex = parseInt(that.getProvinceFromCode(res.data.serviceCity?res.data.serviceCity:"0000",true))
                let _cityName = that.getProvinceFromCode(res.data.serviceCity?res.data.serviceCity:"0000")
                that.serviceCitySlots[2].values = that.getCityArr(_cityName)
                console.log(that.getCityArr(_cityName))
                that.serviceCitySlots[2].defaultIndex = parseInt(that.getCityFromCode(res.data.serviceCity?res.data.serviceCity:"0000",true))
                //回显籍贯
                that.myAddressSlots[0].defaultIndex = parseInt(that.getProvinceFromCode(res.data.userArea,true))
                let $ProvinceName = that.getProvinceFromCode(res.data.userArea)
                that.myAddressSlots[2].values = that.getCityArr($ProvinceName)
                that.myAddressSlots[2].defaultIndex = parseInt(that.getCityFromCode(res.data.userArea,true))
                let $cityName = that.getCityFromCode(res.data.userArea)
                let $areaName = that.getAreaFromCode(res.data.userArea)
                that.myAddressSlots[4].values = that.getCountyArr($ProvinceName,$cityName)
                that.myAddressSlots[4].defaultIndex = parseInt(that.getAreaFromCode(res.data.userArea,true))
                //回显头像
                that.form.headPic = res.data.headPic
            })



        },
        computed: {
            totalCity() {
                return this.cityPicker.province + ' ' + this.cityPicker.city + ' ' + this.cityPicker.county
            },
            totalHome() {
                return this.homePicker.province + ' ' + this.homePicker.city + ' ' + this.homePicker.county
            },
            picStr(){
                let that =this;
                let arr = [
                    {
                        url:that.idcard1,
                        suffix: that.idcard1.substring(that.idcard1.length - 3),
                        type:1,
                        filename:that.idcard1.replace(/.*(\/|\\)/, "").replace(/[^.]+$/,"").replace('.','')
                    },
                    {
                        url:that.idcard2,
                        suffix: that.idcard2.substring(that.idcard2.length - 3),
                        type:2,
                        filename:that.idcard2.replace(/.*(\/|\\)/, "").replace(/[^.]+$/,"").replace('.','')
                    },
                    {
                        url:that.cert1,
                        suffix: that.cert1.substring(that.cert1.length - 3),
                        type:3,
                        filename:that.cert1.replace(/.*(\/|\\)/, "").replace(/[^.]+$/,"").replace('.','')
                    },
                    {
                        url:that.cert2,
                        suffix: that.cert2.substring(that.cert2.length - 3),
                        type:4,
                        filename:that.cert2.replace(/.*(\/|\\)/, "").replace(/[^.]+$/,"").replace('.','')
                    }
                ]
                for(let i in that.$refs){
                    switch (i) {
                        case 'idcard1':
                            if(that.$refs['idcard1'].dataset.tableid){
                                for(let j in arr){
                                    if(arr[j].type === 1){
                                        arr[j].picId = that.$refs['idcard1'].dataset.tableid
                                    }
                                }
                            }
                        break;
                        case 'idcard2':
                            if(that.$refs['idcard2'].dataset.tableid){
                                for(let j in arr){
                                    if(arr[j].type === 2){
                                        arr[j].picId = that.$refs['idcard2'].dataset.tableid
                                    }
                                }
                            }
                        break;
                        case 'cert1':
                            if(that.$refs['cert1'].dataset.tableid){
                                for(let j in arr){
                                    if(arr[j].type === 3){
                                        arr[j].picId = that.$refs['cert1'].dataset.tableid
                                    }
                                }
                            }
                        break;
                        case 'cert2':
                            if(that.$refs['cert2'].dataset.tableid){
                                for(let j in arr){
                                    if(arr[j].type === 4){
                                        arr[j].picId = that.$refs['cert2'].dataset.tableid
                                    }
                                }
                            }
                        break;
                    }
                }
                var delArr = []
                var norArr = []
                arr.forEach(function (value) {
                    if(Reflect.has(value,'picId')){
                        delArr.push(value.picId)
                    }else{
                        norArr.push(value)
                    }
                })
                return delArr.toString()

            },
            // 计算删除的工种
            deleteId(){
                let that = this;
                let arr = []
                let arr2 = []
                for(let i = 0; i < that.workChangeValue.length; i++){
                    if(that.workIdValue.indexOf(that.workChangeValue[i]) === -1){
                        arr.push(that.workChangeValue[i])
                    }
                }
                for(let i in arr){
                    for(let j in that.serverWorkerId){
                        if(that.serverWorkerId[j].name == arr[i]){
                            arr2.push(that.serverWorkerId[j].allId)
                        }
                    }
                }
                return arr2.toString();
            },
            // 计算已选工种
            getWorkerId(){
                var that = this;
                let arr = []
                for(let i in that.workIdValue){
                    for(let j in that.serverWorkerId){
                        if(that.serverWorkerId[j].name == that.workIdValue[i]){
                            arr.push(that.serverWorkerId[j].allId)
                        }
                    }
                }
                return arr.toString();
            }
        }
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }
#IDim{
    background-image: url("../assets/fan.png");
    background-size: 100%;
    background-repeat: no-repeat;
}
    #IDim2{
        background-image: url("../assets/zheng.png");
        background-size: 100%;
        background-repeat: no-repeat;
    }
    .g-list {
        padding: 0 px2rem(15px);

        .item2 {
            border-bottom: 1px solid #eee;
            padding-bottom: 0.5rem;
            margin-top: 0.5rem;

            div {
                span {
                    vertical-align: top;
                    display: inline-block;
                }
            }

            div.left {
                display: table-cell;
                position: relative;

                span.title {
                    width: 5rem;
                    text-align: right;
                }
                span.subtitle {
                    position: absolute;
                    width: 5rem;
                    left: 1.5rem;
                    top: 1.5rem;
                    font-size: 0.5rem;
                    color: #999;
                }
            }

            div.right {
                display: table-cell;

                span.img {
                    width: 7rem;
                    height: 5rem;
                    background: #eee;
                    line-height: 5rem;
                    text-align: center;
                    position: relative;
                    margin: 0 0.5rem 0.5rem 0.5rem;

                    img {
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        left: 0;
                        z-index: 50;
                    }

                }
            }

        }

        .item {
            height: px2rem(44px);
            padding-top: px2rem(7px);
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

    .g-cityPicker {
        width: 100%;
        height: 10rem;

        div.buttons {
            position: relative;

            button {
                width: 6rem;
                height: 2rem;
                border: none;
                color: #00b7ee;
                background: #fff;
                z-index: 999;
                outline: none;
            }

            .cancel {
                position: absolute;
                left: 0;
                width: 50%;
                text-align: left;
                padding-left: 2rem;
            }

            .select {
                position: absolute;
                right: 0;
                width: 50%;
                text-align: right;
                padding-right: 2rem;
            }
        }
    }

    .g-homePicker {
        width: 100%;
        height: 10rem;

        div.buttons {
            position: relative;

            button {
                width: 6rem;
                height: 2rem;
                border: none;
                color: #00b7ee;
                background: #fff;
                z-index: 999;
                outline: none;
            }

            .cancel {
                position: absolute;
                left: 0;
                width: 50%;
                text-align: left;
                padding-left: 2rem;
            }

            .select {
                position: absolute;
                right: 0;
                width: 50%;
                text-align: right;
                padding-right: 2rem;
            }
        }
    }

    .g-workType {
        width: 100%;
        height: 10rem;

        div.buttons {
            position: relative;

            button {
                width: 6rem;
                height: 2rem;
                border: none;
                color: #00b7ee;
                background: #fff;
                z-index: 999;
                outline: none;
            }

            .cancel {
                position: absolute;
                left: 0;
                width: 50%;
                text-align: left;
                padding-left: 2rem;
            }

            .select {
                position: absolute;
                right: 0;
                width: 50%;
                text-align: right;
                padding-right: 2rem;
            }
        }
    }
</style>
