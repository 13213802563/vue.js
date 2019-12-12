<template>
    <div>
        <mt-header title="新增客户">
            <router-link to="/index/customerManagerment" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <!--<mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>
        <div class="g-list">
            <div class="item">
                <span><i>*</i>客户姓名:</span>
                <input type="text" v-model="detailInfo.realName">
            </div>
            <div class="item">
                <span><i>*</i>客户电话:</span>
                <input type="text" v-model="detailInfo.mobile">
            </div>
            <div class="item">
                <span>身份证号:</span>
                <input type="text" v-model="detailInfo.idCardNum" maxlength="18">
            </div>
            <div class="item">
                <span>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:</span>
                <van-radio-group v-model="sex" style="display: inline-block;margin-left: 0.6rem;">
                    <van-radio name="1" style="display: inline;margin-right: 0.6rem;">男</van-radio>
                    <van-radio name="2" style="display: inline;">女</van-radio>
                </van-radio-group>
            </div>
            <div class="item">
                <span>年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄:</span>
                <input type="text" v-model="detailInfo.age" maxlength="2" oninput="this.value=this.value.replace(/\D/g,'')">
            </div>
            <div class="item">
                <span><i>*</i>客户省 市 区:</span>
                <input type="text" readonly v-model="addre" @click="showPicker">
            </div>
            <div class="item" style="display: flex;height: max-content;margin-bottom: 0.5rem">
                <span>详细地址:</span>
                <textarea class="text" cols="30" rows="10" maxlength="250" v-model="detailInfo.address"></textarea>
            </div>
            <mt-popup v-model="haspick"  position="bottom" style="width: 100%;height: 12rem">
                <div style="height: 20px;line-height: 20px;padding:10px;">
                    <span style="color:#26a2ff;float: left;" @click="cancelAdd">取消</span>
                    <span style="color:#26a2ff;float: right;" @click="pickAdd">确定</span>
                </div>
                <mt-picker :slots="myAddressSlots" valueKey="name" @change="addressChange"></mt-picker>
            </mt-popup>
            <button @click="addCustomer">保存</button>
        </div>
    </div>
</template>


<script>
    import { Area, RadioGroup, Radio } from 'vant';
    import threeLevelAddress from '../api/CityCode.json';
    import { insertCustomer } from '@/api/order.js';
    export default {
        name: "addCustomer",
        data () {
            return {
                detailInfo: {},
                cityInfo: {},
                haspick: false,
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
                        values:  this.getCityArr("请选择"),
                        className: 'slot3',
                        textAlign: 'center'
                    },{
                        divider: true,
                        content: '-',
                        className: 'slot4'
                    }, {
                        flex: 1,
                        values:  this.getCountyArr("请选择","请选择"),
                        className: 'slot5',
                        textAlign: 'center'
                    }
                ],
                region:'',//三级地址
                province:'',//省
                city:'',//市
                county:'',//县
                provinceCode:'',//省级代码
                cityCode:'', //市级代码
                countyCode:'',//县级代码
                regionInit:false,
                sex: "1",
                area: ''
            }
        },
        computed: {
            addre () {
                return this.province + ' ' + this.city + ' ' + this.county
            }
        },
        components: {
            [Area.name]: Area,
            [RadioGroup.name]: RadioGroup,
            [Radio.name]: Radio
        },
        methods: {
            addressChange(picker, values){
                if (this.regionInit){
                    //取值并赋值
                    this.region = values[0]["name"] + values[1]["name"] + values[2]["name"];
                    this.province = values[0]["name"];
                    this.city = values[1]["name"];
                    this.county = values[2]["name"];
                    this.provinceCode = values[0]["code"];
                    this.cityCode = values[1]["code"];
                    this.countyCode = values[2]["code"];
                    //给市、县赋值
                    picker.setSlotValues(1, this.getCityArr(values[0]["name"]));
                    picker.setSlotValues(2, this.getCountyArr(values[0]["name"], values[1]["name"]));
                }else {
                    this.regionInit = true;
                }
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
            getCountyArr(province,city){
                let countyArr = [];
                threeLevelAddress.forEach(function(item){
                    if (item.cityName === province){
                        item.childList.forEach(function (args) {
                            if (args.cityName === city){
                                args.childList.forEach(function (param) {
                                    let obj = {};
                                    obj.name=param.cityName;
                                    obj.code=param.cityCode;
                                    countyArr.push(obj);
                                })
                            }
                        });
                    }
                });
                return countyArr;
            },
            showPicker () {
                this.haspick = !this.haspick
            },
            pickAdd () {
                if (this.province == '') {
                    return false
                }
                this.haspick = false
            },
            cancelAdd () {
                this.haspick = false
            },
            addCustomer () {
                var nameReg = /^[a-zA-Z\u4e00-\u9fa5]+$/
                if(!this.detailInfo.realName){
                    this.$toast('请输入姓名')
                    return false;
                }
                if (!nameReg.test(this.detailInfo.realName)) {
                    this.$toast('姓名只允许中英文')
                    return false;
                }
                var phoneReg = /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/
                if(!this.detailInfo.mobile){
                    this.$toast('请输入手机号码')
                    return false;
                }
                if (!phoneReg.test(this.detailInfo.mobile)) {
                    this.$toast('手机号格式不正确')
                    return false;
                }
                var idReg = /(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/
                if (this.detailInfo.idCardNum && !idReg.test(this.detailInfo.idCardNum)) {
                    this.$toast('身份证号格式不正确')
                    return false;
                }
                var ageReg = /^[0-9]*[1-9][0-9]*$/
                if (this.detailInfo.age && !ageReg.test(this.detailInfo.age)) {
                    this.$toast('年龄只能是正整数')
                    return false;
                }
                if(!this.province){
                    this.$toast('请选择省')
                    return false;
                }
                if(!this.city){
                    this.$toast('请选择市')
                    return false;
                }
                if(!this.county){
                    this.$toast('请选择区')
                    return false;
                }
                insertCustomer({
                    realName: this.detailInfo.realName,
                    idCardNum: this.detailInfo.idCardNum,
                    mobile: this.detailInfo.mobile,
                    age: this.detailInfo.age,
                    sex: this.sex,
                    userProvince: this.provinceCode,
                    userCity: this.cityCode,
                    userArea: this.countyCode,
                    address: this.detailInfo.address
                }).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        if(this.$route.query.mark == 1){
                            this.$toast('新增成功');
                            this.$router.push({
                                name: 'viewPublicOrders'
                            })
                        }else{
                            this.$toast('新增成功')
                            this.$router.push({
                                name: 'customerManagerment'
                            })
                        }
                    } else {
                        this.$toast(res.data.msg);
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }

    .g-list {
        padding: 0 px2rem(15px);

        .item {
            padding: px2rem(7px) 0;
            border-bottom: 1px solid #eee;
            i {
                color: red;
            }
            span {
                display: inline-block;
                width: 6rem;
                text-align: right;
                font-size: px2rem(14px);
            }

            input {
                border: 1px solid #ddd;
                height: px2rem(25px);
                input-height: px2rem(25px);
                width: 15rem;
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
</style>
