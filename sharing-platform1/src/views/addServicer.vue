<template>
    <div >
        <mt-header title="新增服务人员">
            <!--<router-link to="/index/servicerManagerment" slot="left">-->
            <mt-button icon="back" @click="goBack" slot="left">返回</mt-button>
            <!--</router-link>-->
            <!--<mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>
        <div class="g-list">
            <div class="item">
                <span><i style="color:#f00;">*</i>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:</span>
                <input v-model="form.userName" @focus="checkStart" @blur="checkEnd"  type="text" :disabled="nameInput">
            </div>
            <div class="item" style="display: flex">
                <span style="    line-height: 1.7rem;"><i style="color:#f00;">*</i>身份证号:</span>
                <input style="flex:1" oninput="this.value = this.value" v-model="form.idCardNum" maxlength="18" type="text" :disabled="IDInput">
                <button :disabled="verifyIdCardState" style="height: 1.7rem;width: 2.7rem;margin-top: 0;" @click="verifyIdCard">{{checkIdCardButtonText}}</button>

            </div>

            <div class="item" style="height: max-content;display: flex">
                <span><i style="color:#f00;">*</i>工&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;种:</span>
                <!--<mt-checklist v-model="workIdValue" :options="workIdOption" style="display: inline-table;width: 16.5rem;">-->
                <!--</mt-checklist>-->
                <van-checkbox-group v-model="workIdValue">
                    <van-checkbox
                            v-for="(item, index) in workIdOption"
                            :key="item"
                            :name="item"
                    >
                        {{ item }}
                    </van-checkbox>
                </van-checkbox-group>
                <!--<input @click="showWorkType" v-model="workType" type="text">-->
            </div>
            <div class="item" style="touch-action: none;">
                <span><i style="color:#f00;">*</i>工作城市:</span>
                <input v-model="totalCity" type="text" readonly @click="showCityPicker()">
            </div>
            <div class="item">
                <span><i style="color:#f00;">*</i>手机号码:</span>
                <input maxlength="11" @input="checkMobile" v-model="form.mobile" type="text">
            </div>
            <div class="item" style="touch-action: none;">
                <span><i style="color:#f00;">*</i>籍&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贯:</span>
                <input v-model="totalHome" readonly @click="showHomePicker()" type="text">
            </div>
            <div class="item">
                <span>家庭地址:</span>
                <input v-model="form.address" type="text" placeholder="最多输入50字" maxlength="50">
            </div>
            <div class="item">
                <span>工作年限:</span>
                <input v-model="form.workingLife"  type="text" oninput="this.value=this.value.replace(/\D/g,'')" maxlength="2">
            </div>
            <div class="item" style="display: flex;height: max-content;margin-bottom: 0.5rem">
                <span>介&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;绍:</span>
                <textarea v-model="form.introduction" placeholder="最多输入50字" class="text" name="" id="" cols="30" maxlength="50" rows="10"></textarea>
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

                        <img :src="idcard2" alt="">
                    </span>
                    <span class="img" @click="uploadIdCard('2')"  id="IDim2">
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
                    <input @change="changeCert1" ref="cert1" type="file" hidden accept="image/*" multiple>
                    <input @change="changeCert2" ref="cert2" type="file" hidden accept="image/*" multiple>
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
            <mt-picker :slots="serviceCitySlots" valueKey="name" @change="addressChange" id="u-workPicker"></mt-picker>
        </mt-popup>
        <!--籍贯三级联动-->
        <mt-popup v-model="popupVisibleHome" position="bottom" class="g-homePicker" id="g-homePicker">
            <div class="buttons">
                <button class="cancel" @click="showHomePicker">
                    取消
                </button>
                <button class="select" @click="showHomePicker">
                    确认
                </button>
            </div>
            <mt-picker :slots="myAddressSlots" valueKey="name" @change="homeChange" id="u-homePicker" style=""></mt-picker>
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
    import BScroll from 'better-scroll'

    export default {
        name: "addServicer",
        data() {
            return {
                urlParams:this.$route.query,
                nameInput:false,
                IDInput:false,
                workIdValue:[],
                workIdOption:this.tempWorkIdArr(),
                serverWorkerId:this.getWorkType(),
                popupVisible: false,
                isBtns: false,
                popupVisibleHome: false,
                popupVisibleWorkType: false,
                popupVisibleSex: false,
                myAddressSlots: [
                    {
                        flex: 1,
                        values: this.getProvinceArr(),
                        className: 'slot1',
                        textAlign: 'center'
                    }, {
                        divider: true,
                        content: '-',
                        className: 'slot2'
                    }, {
                        flex: 1,
                        values: this.getCityArr("请选择"),
                        className: 'slot3',
                        textAlign: 'center'
                    }, {
                        divider: true,
                        content: '-',
                        className: 'slot4'
                    }, {
                        flex: 1,
                        values: this.getCountyArr("请选择", "请选择"),
                        className: 'slot5',
                        textAlign: 'center'
                    }
                ],
                serviceCitySlots:[
                    {
                        flex: 1,
                        values: this.getProvinceArr(),
                        className: 'slot1',
                        textAlign: 'center'
                    }, {
                        divider: true,
                        content: '-',
                        className: 'slot2'
                    }, {
                        flex: 1,
                        values: this.getCityArr("请选择"),
                        className: 'slot3',
                        textAlign: 'center'
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
                idcard2:'',
                idcard1:'',
                cert1:'',
                cert2:'',
                avatar:'',
                hasBeenVerify: false,
                checkIdCardButtonText:'验证',
                verifyIdCardState:false,
                isVerify:false,
                homeCityState:'',
                workCityState:''
            }
        },
        methods: {
            checkChinese(){
                this.form.userName=this.form.userName.replace(/[^\u4E00-\u9FA5]/g, '')
            },
            checkStart(){
                this.checkInterval=setInterval(this.checkChinese,100)
            },
            checkEnd(){
                clearInterval(this.checkInterval)
            },
            // inputChange(e) {
            //     const o = e.target;
            //     o.value = o.value.replace(/[^\u4E00-\u9FA5]/g, ''); // 清除除了中文以外的输入的字符
            //     this.name = o.value;
            // },
            // 验证身份证号码
            verifyIdCard(){
                let self = this;
                if(self.isVerify){
                    return false;
                }
                self.isVerify = true
                if(!self.form.userName){
                    self.$toast('请输入姓名')
                    self.isVerify = false
                    return false;
                }
                if(!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/.test(self.form.idCardNum)){
                    self.$toast('身份证号不合法')
                    self.isVerify = false
                    return false;
                }
                self.$post('/sharePlatform-person/authen/idCardNum',{
                    userName: self.form.userName,
                    idCardNum:self.form.idCardNum,
                })
                    .then(res => {
                        if(res.code === 'I1-00-9999'){
                            if(res.data.code === 1){
                                self.$toast('身份证信息核验成功');
                                self.checkIdCardButtonText = '通过';
                                self.hasBeenVerify = true;
                                self.verifyIdCardState = true;
                                self.nameInput=true;
                                self.IDInput=true;
                            }else{
                                self.$toast('身份证信息核验失败,原因:' + res.data.message);
                                self.isVerify = false
                            }
                        }else{
                            self.$toast('请求超时，请稍后再试');
                            self.isVerify = false
                        }
                    })

            },
            // 工作城市弹出层切换事件
            addressChange(picker, values) {
                // if (this.cityPicker.regionInit) {
                //     //取值并赋值
                //     this.cityPicker.region = values[0]["name"] + values[1]["name"] + values[2]["name"];
                //     this.cityPicker.province = values[0]["name"];
                //     this.cityPicker.city = values[1]["name"];
                //     this.cityPicker.county = values[2]["name"];
                //     this.cityPicker.provinceCode = values[0]["code"];
                //     this.cityPicker.cityCode = values[1]["code"];
                //     this.cityPicker.countyCode = values[2]["code"];
                //
                //     //给市、县赋值
                //     picker.setSlotValues(1, this.getCityArr(values[0]["name"]));
                //     picker.setSlotValues(2, this.getCountyArr(values[0]["name"], values[1]["name"]));
                // } else {
                //     this.cityPicker.regionInit = true;
                // }
                //取值并赋值
                console.log(values)
                this.cityPicker.region = values[0]["name"] + values[1]["name"] // + values[2]["name"];
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
            getCityArr(province) {
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
                // this.popupVisible = !this.popupVisible;
                if(this.popupVisible === false){
                    this.popupVisible = true
                    this.workCityState = new BScroll('#u-workPicker')
                }else{
                    this.popupVisible = false
                    this.workCityState.destroy()
                }
            },
            // 籍贯层控制
            showHomePicker() {
                // this.popupVisibleHome = !this.popupVisibleHome;
                document.activeElement.blur()
                if(this.popupVisibleHome === false){
                    this.popupVisibleHome = true
                    this.homeCityState = new BScroll('#u-homePicker')
                }else{
                    this.popupVisibleHome = false
                    this.homeCityState.destroy()
                }

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
                if(!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/.test(that.form.idCardNum)){
                    that.$toast('身份证号不合法')
                    that.isBtns=false;
                    return false;
                }
                if(!that.hasBeenVerify){
                    that.$toast('请先验证身份证号码')
                    that.isBtns=false;
                    return false;
                }
                if(!that.form.mobile){
                    that.$toast('请输入手机号码')
                    that.isBtns=false;
                    return false;
                }

                if(!/0?(13|14|15|16|17|18|19)[0-9]{9}/.test(that.form.mobile)){
                    that.$toast('手机号码不合法')
                    that.isBtns=false;
                    return false;
                }
                if(that.cityPicker.cityCode === '0000'){
                    that.$toast('请选择工作城市')
                    that.isBtns=false;
                    return false;
                }
                if(that.homePicker.countyCode === '0000'){
                    that.$toast('请选择籍贯')
                    that.isBtns=false;
                    return false;
                }
                if(!that.getWorkerId.length){
                    that.$toast('请选择工种')
                    that.isBtns=false;
                    return false;
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

                // 识别身份证正面
                let OcrValueFront =  await new Promise(resolve => {
                    if(!that.idcard2){
                        resolve(true)
                        return
                    }else{
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

                    }

                });

                if( !OcrValueFront){

                    // that.$toast('身份证照片正面核验有误，请您核对已填写的身份证号和已上传的身份证正反面是否正确')
                    that.idcard2=''

                    that.isBtns=false;
                    return  false;
                }
                // 识别身份证背面
                let OcrValueBack =  await new Promise(resolve => {

                        if(!that.idcard1){

                            resolve(true)
                        return
                    }else{
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
                    }

                });


                if( !OcrValueBack){

                    // that.$toast('身份证照片背面核验有误，请您核对已填写的身份证号和已上传的身份证正反面是否正确')
                    that.idcard1=''
                    that.isBtns=false;
                    return  false;
                }

                if((that.idcard2&&!that.idcard1)||(!that.idcard2&&that.idcard1)){
                    that.$toast('请上传完整的身份证照片')
                    that.isBtns=false;
                    return false;
                }
                await that.$post('/sharePlatform-person/personnel/insertPersonnel', {

                    userName: that.form.userName,
                    mobile: that.form.mobile,
                    idCardNum: that.form.idCardNum,
                    workerId: that.getWorkerId,
                    userProvince: that.homePicker.provinceCode,
                    userCity: that.homePicker.cityCode,
                    userArea: that.homePicker.countyCode,
                    address: that.form.address,
                    introduction: that.form.introduction,
                    serviceCity: that.cityPicker.cityCode=='0000'?'':that.cityPicker.cityCode,
                    workingLife: that.form.workingLife,
                    picStr: str,
                    headPic:that.avatar
                }).then(res => {
                    if(res.code === "I1-00-9999"){
                        console.log(that.urlParams)
                        const {mark} = that.urlParams
                        if(that.urlParams=='1'){
                            that.$router.push('/index/viewPublicOrders')
                        }else {that.$toast('保存成功')
                            that.$router.push('/index/servicerManagerment')

                        }
                    }else{
                        that.$toast(res.msg)
                        that.isBtns=false;
                    }
                })
            },
            // 点击图片上传身份证事件分发
            uploadIdCard(value){
                let that = this;
                var timeout = null;
                if (timeout !== null) {
                    return false
                }else{
                    timeout = true;
                    if(value == '1'){
                        that.$refs['idcard1'].click()
                        timeout = null
                    }
                    if(value == '2'){
                        that.$refs['idcard2'].click()
                    }
                }


            },
            compressFiles(files,callback){
                let that = this;
                let fileObj = files //上传文件的对象
                let compressRatio = 1.414 ;
                if(fileObj.size > 10000000){
                    that.$toast('照片过大,无法上传')
                    return false;
                }else if(fileObj.size < 10000000 && fileObj.size > 5000000){
                    compressRatio = 3.162
                    // 压缩20倍
                }else if(fileObj.size < 5000000 && fileObj.size > 1000000){
                    compressRatio = 2.739
                    // 压缩15倍
                }else if(fileObj.size < 1000000 && fileObj.size > 500000){

                    compressRatio = 2
                    // 压缩8
                }else if(fileObj.size < 500000 && fileObj.size > 100000){
                    compressRatio = 1.414
                    // 压缩5
                }else {
                    compressRatio = 1
                    // 压缩2
                };
                console.log(compressRatio.toString())
                let reader = new FileReader()
                reader.readAsDataURL(fileObj)
                reader.onload = function(e) {
                    let image = new Image() //新建一个img标签（还没嵌入DOM节点)
                    image.src = e.target.result
                    image.onload = function() {
                        let canvas = document.createElement('canvas'),
                            context = canvas.getContext('2d'),
                            imageWidth = image.width / compressRatio,    //压缩后图片的大小
                            imageHeight = image.height / compressRatio,
                            data = ''

                        canvas.width = imageWidth
                        canvas.height = imageHeight
                        context.drawImage(image, 0, 0, imageWidth, imageHeight)
                        data = canvas.toDataURL('image/jpeg')
                        let arr = data.split(','), mime = arr[0].match(/:(.*?);/)[1],
                            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                        while(n--){
                            u8arr[n] = bstr.charCodeAt(n);
                        }
                        let files = new window.File([new Blob([u8arr], {type:mime})], 'test.jpeg', {type: 'image/jpeg'})
                        console.log(files)
                        callback(files)

                    }
                }


            },
            // 上传身份证正面
            changeIdCard1(e){
                let that = this;
                that.compressFiles(e.target.files[0],function (files) {
                    that.$file(files)
                        .then(res => {
                            that.idcard1 = res.reUrl[0];
                        })
                })
            },
            // 上传身份证反面
            changeIdCard2(e){
                let that = this;
                that.compressFiles(e.target.files[0],function (files) {
                    that.$file(files)
                        .then(res => {
                            that.idcard2 = res.reUrl[0];
                        })
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
                that.compressFiles(e.target.files[0],function (files) {
                    that.$file(files)
                        .then(res => {
                            that.cert1 = res.reUrl[0];
                        })
                })

            },

            // 上传健康证反面
            changeCert2(e){
                let that = this;
                that.compressFiles(e.target.files[0],function (files) {
                    that.$file(files)
                        .then(res => {
                            that.cert2 = res.reUrl[0];
                        })
                })

            },
            // 上传头像的事件分发
            uploadAvatar(value){
                this.$refs['avatar'].click()
            },
            //上传头像
            changeAvatar(e){
                let that = this;
                that.compressFiles(e.target.files[0],function (files) {
                    that.$file(files)
                        .then(res => {
                            that.avatar = res.reUrl[0];
                        })
                })
            },
            // 身份证号输入限制
            checkIdCardNum(e){
                console.log(e)
                 e.target.value = e.target.value

            },
            // 手机号输入限制
            checkMobile(e){
                e.target.value = e.target.value.replace(/\D/g,'')
            },
            tempWorkIdArr(){
                let arr = this.getWorkType()
                let result = []
                for(let i in arr){
                    result.push(arr[i].name)
                }
                console.log(result)
                return result;
            },
            debounce(fn, wait) {
                var timeout = null;
                return function () {
                    if (timeout !== null) clearTimeout(timeout);
                    timeout = setTimeout(fn, wait);
                }
            },

            goBack(){
                if( this.$route.query.mark== 1){
                    this.$router.push('/index/viewPublicOrders')
                }else{
                    this.$router.push('/index/servicerManagerment')
                }
            }
        },
        // mounted() {
        //     pushHistory()
        //     that.gotoURL(function () {
        //         pushHistory()
        //         that.$router.go(-2)
        //     })
        // },
        computed: {
            totalCity() {
                return this.cityPicker.province + ' ' + this.cityPicker.city + ' ' + this.cityPicker.county
            },
            totalHome() {
                return this.homePicker.province + ' ' + this.homePicker.city + ' ' + this.homePicker.county
            },
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
    .mint-popup{
        touch-action: none;
    }
    .van-checkbox {
        margin-bottom: 1rem;
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
        height: 12rem;

        div.buttons {
            position: relative;
            height: 2rem;

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
        height: 12rem;

        div.buttons {
            position: relative;
            height: 2rem;

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
