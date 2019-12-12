<template>
    <div>
        <mt-header title="查看公海服务人员" style="z-index: 999">
            <!--<router-link to="/index" slot="left">-->
            <!--<mt-button icon="back">返回</mt-button>-->
            <mt-button icon="back" @click="goBack" slot="left">返回</mt-button>
            <!--</router-link>-->
        </mt-header>
        <van-search
                v-model="searchVal"
                placeholder="输入姓名、手机号进行搜索"
                show-action
                shape="round"
                @search="onSearch"
        >
            <div slot="action" @click="onSearch">搜索</div>
        </van-search>
        <div>
            <div class="item searchs" style="touch-action: none;">
                <div>
                    <span>工种：</span>
                    <input v-model="workType" type="text" readonly @click="showWorkType()">
                </div>
                <div>
                    <span>城市：</span>
                    <input v-model="totalCity" type="text" readonly @click="showCityPicker()">
                </div>

            </div>
            <div class="item" searchs style="touch-action: none;">


            </div>
        </div>
        <div v-show="!loadingimg" style="overflow: scroll; height: 100vh;position: fixed;left: 0;right: 0;top: 8rem;">
            <div class="g-list" v-if="list.length > 0" v-infinite-scroll="scrollAll" :infinite-scroll-disabled="loading"
                 infinite-scroll-distance="50">
                <template v-for="value in list">
                    <div class="item">
                        <div class="part" style="float:right">
                            <img :src="value.headPic" alt="" style="width: 70px; height: 70px;border-radius:50%">
                        </div>
                        <div class="part">
                            <span class="u-text-title">姓名:</span>
                            <span class="u-text-des">{{value.userName}}</span>
                        </div>

                        <div class="part">
                            <span class="u-text-title">性别：</span>
                            <span class="u-text-des">{{value.sexStr}}</span>
                        </div>
                        <!--<div class="part">-->
                        <!--<span class="u-text-title">管家手机：</span>-->
                        <!--<span class="u-text-des">{{value.mobile.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")}}</span>-->
                        <!--</div>-->
                        <!--                        <div class="part">-->
                        <!--                            <span class="u-text-title">身份证号：</span>-->
                        <!--                            <span class="u-text-des" v-if="value.companyId == value.source">{{value.idCardNum}}</span>-->
                        <!--                            <span class="u-text-des" v-else>{{addStar(value.idCardNum)}}</span>-->
                        <!--                        </div>-->
                        <div class="part">
                            <span class="u-text-title">年龄：</span>
                            <span class="u-text-des">{{value.age}}</span>
                            <!--<span class="u-text-title" style="margin-left: 1rem">工种：</span>-->
                            <!--<span class="u-text-des" style="flex: 1;">{{value.workerName}}</span>-->
                        </div>

                        <div class="part">
                            <span class="u-text-title">工种：</span>
                            <span class="u-text-des" style="flex: 1;">{{value.workerName}}</span>
                            <span class="u-text-title">工作城市：</span>
                            <span class="u-text-des">{{value.serviceCityStr}}</span>
                        </div>
                        <div class="part">
                            <span class="u-text-title">管家手机：</span>
                            <span class="u-text-des">{{value.mobile.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")}}</span>
                        </div>
                        <!--<div class="part" style="position: relative">-->
                        <!--<span class="u-text-title">工作城市：</span>-->
                        <!--<span class="u-text-des">{{value.serviceCityStr}}</span>-->
                        <!--</div>-->
                        <div class="part" style="position: relative">
                            <span class="u-text-title">公司名称：</span>
                            <span class="u-text-des">{{value.companyName}}</span>
                        </div>
                        <!--<div class="part" style="position: relative">-->
                        <!--<span class="u-text-company">公司名称：</span>-->
                        <!--<span class="u-text-companydes">{{value.serviceCityStr}}</span>-->
                        <!--</div>-->
                        <div class="part" style="text-align: left;display: block;">
                            <button class="edit" @click.stop="details(value)">查看
                            </button>
                            <button class="edit" style="margin-left: 0.5rem;" @click.stop="checkOrder(value)">我要合单
                            </button>

                        </div>


                    </div>
                </template>
            </div>
            <div class="no-list" v-if="searchState && list.length <= 0">
                <img src="../assets/no-data.png" alt="">
            </div>
        </div>

        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa"/>
        </section>
        <section v-if="loadingimgBottom">
            <div class="dataLoading">加载中...</div>
        </section>
        <!--工作城市二级联动-->
        <mt-popup v-model="popupVisible" position="bottom" class="g-cityPicker">
            <div class="buttons">
                <button class="cancel" @click="hideCityPicker">
                    重置
                </button>
                <button class="select" @click="queryCityPicker">
                    确认
                </button>
            </div>
            <mt-picker :slots="serviceCitySlots" valueKey="name" @change="addressChange" id="u-workPicker"></mt-picker>
        </mt-popup>
        <!--工种-->
        <mt-popup v-model="popupVisibleWorkType" position="bottom" class="g-workType">
            <div class="buttons">
                <button class="cancel" @click="hideWorkType">
                    重置
                </button>
                <button class="select" @click="queryWorkType">
                    确认
                </button>
            </div>
            <mt-picker :slots="myWorkType" valueKey="name" @change="workTypeChange"></mt-picker>
        </mt-popup>

    </div>
</template>

<script>
    import {Loading} from 'vant';
    import {Dialog} from 'vant';
    import {Toast} from 'vant';
    import {Tab, Tabs} from 'vant';
    import threeLevelAddress from '../api/CityCode.json'
    import BScroll from 'better-scroll'

    export default {
        name: "queryAllServicePersonnel",
        data() {
            return {
                list: [],
                listState: 0,
                obj: {},
                // searchWorkerName:'',
                // searchServiceCity:'',
                loading: false,
                allPage: false,
                onScroll: false,
                loadingimg: true,
                loadingimgBottom: false,
                currentPage: 0,
                onScurrentPage: 0,
                noData: false,
                searchVal: '',
                isWorkType: false,
                isCitys: false,
                //审核状态 0:未上传执照，待审核，1:审核通过，2:审核未通过，3：已上传执照，审核中
                approvalStatus: 0,
                searchState: true,
                serviceCitySlots: [
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
                myWorkType: [
                    {
                        flex: 1,
                        values: this.getWorkType(),
                        className: 'slot6',
                        textAlign: 'center',

                    }
                ],
                popupVisible: false,
                popupVisibleWorkType: false,
                workIdValue: [],
                workType: '',
                workIdOption: this.tempWorkIdArr(),
                serverWorkerId: this.getWorkType(),
            }
        },
        components: {
            [Loading.name]: Loading,
            [Toast.name]: Toast
        },
        computed: {
            searchStates() {
                let that = this;
                return that.searchState = false
            },
            totalCity() {

                return this.cityPicker.city + ' ' + this.cityPicker.county
            },
            getWorkerId() {
                var that = this;
                let arr = []
                for (let i in that.workIdValue) {
                    for (let j in that.serverWorkerId) {
                        if (that.serverWorkerId[j].name == that.workIdValue[i]) {
                            arr.push(that.serverWorkerId[j].allId)
                        }
                    }
                }
                return arr.toString();
            }
        },
        mounted() {

            if (localStorage.getItem('lastWorkType') != null || localStorage.getItem('lastWorkCity') != null) {
                this.workType = localStorage.getItem('lastWorkType') != null ? localStorage.getItem('lastWorkType') : '全部';
                this.cityPicker.cityCode = localStorage.getItem('lastWorkCity') != null ? localStorage.getItem('lastWorkCity') : "请选择 ";
                this.cityPicker.city = localStorage.getItem('lastWorkCityName') != null ? localStorage.getItem('lastWorkCityName') : "请选择 ";
                this.list = [];
                this.openFilter()
            }
            else {
                this.list = [];
                this.viewPool()
            }
            let that = this;
            pushHistory()
            that.gotoURL(function () {
                pushHistory()
                let obj = JSON.parse(localStorage.getItem('obj'))
                localStorage.removeItem('lastWorkType');
                localStorage.removeItem('lastWorkCity');
                localStorage.removeItem('lastWorkCityName')
                that.$router.push('/index');
            })

        },
        watch: {
            searchVal: function (val, oldVal) {
                let that = this
                that.allPage = false;
                that.onScroll = false;
                that.searchState = false;
                that.currentPage = 0;
                if (val == '') {
                    that.list = [];
                    that.viewPool()
                    console.log(that.list)
                }
            }

        },
        methods: {
            // router-link to="/index" slot="left">-->
            goBack() {
                 localStorage.removeItem('lastWorkType');
                 localStorage.removeItem('lastWorkCity');
                 localStorage.removeItem('lastWorkCityName')

                this.$router.push('/index');
            },
            hideCityPicker() {
                this.isCitys = true
                if (this.popupVisible === false) {
                    this.popupVisible = true
                    this.workCityState = new BScroll('#u-workPicker')
                } else {
                    this.popupVisible = false
                    this.workCityState.destroy()
                }
                this.cityPicker.city = "请选择 "
                this.onScurrentPage = 0
                this.list = []
                localStorage.removeItem("lastWorkCity");
                localStorage.removeItem("lastWorkCityName");
                this.openFilter()
            },
            hideWorkType() {
                this.isWorkType = true

                if (this.popupVisibleWorkType === false) {
                    this.popupVisibleWorkType = true
                    // this.workCityState = new BScroll('#u-workPicker')
                } else {
                    this.popupVisibleWorkType = false
                    // this.workCityState.destroy()
                }
                this.workType = '全部';
                localStorage.removeItem("lastWorkType");
                this.onScurrentPage = 0
                this.list = []
                this.openFilter()
            },
            scrollAll() {
                if (this.workType != '全部' || this.totalCity != "请选择 ") {
                    this.openFilter()
                } else {
                    this.viewPool()
                    //this.openFilter()
                }
            },
            viewPool() {
                let that = this;
                that.loading = true;
                if (that.allPage === true) {
                    return false;
                }
                if (that.onScroll === true) {
                    return false;
                }
                that.loadingimgBottom = true;
                that.onScroll = true;
                setTimeout(() => {
                    that.currentPage++;
                    that.$post('/sharePlatform-person/personnel/queryAllServicePersonnel', {
                        currentPage: that.currentPage,
                        pageSize: '5'
                    }).then(res => {
                        that.loadingimg = false;
                        if (res.code === 'W3-01-0001') {
                            that.$toast('登录状态已失效');
                            that.$router.push('/')
                        }
                        that.list = that.list.concat(res.data.list)

                        that.loading = false;
                        if (res.data.list.length < 5) {
                            that.allPage = false;
                            that.onScroll = true;
                        } else {
                            that.onScroll = false;
                        }
                        that.loadingimgBottom = false;

                    })
                }, 300)
            },
            details(item) {
                let that = this;
                that.$post('/sharePlatform-auth/auth/getUserCheckStatus', {}).then(res => {
                    that.loadingimg = false;
                    sessionStorage.setItem('merType',res.data.merType);
                    if (res.data.approvalStatus === 1) {
                        /*成功*/
                        this.$router.push('/index/servicerManagerment/servicerDetails?personnelId=' + item.personnelId + '&isInPool=2&seeNum=0&type=1')

                    }
                    if (res.data.approvalStatus === 0) {
                        Dialog.confirm({
                            title: '',
                            message: '您需完善企业信息并通过审核后，才可进行本操作',
                            confirmButtonText: '去完善信息'
                        }).then(() => {
                            that.$router.push({path: '/information', query: {url: '/index/queryAllServicePersonnel'}});
                        }).catch(() => {
                            // on cancel
                            that.isBtns = false;
                        });
                    }
                    if (res.data.approvalStatus === 2) {
                        Dialog.confirm({
                            title: '',
                            message: '企业注册信息被驳回，请修改信息并通过审核后，才可进行本操作\n 驳回原因：' + res.data.reason,
                            confirmButtonText: '去完善信息'
                        }).then(() => {
                            // on confirm
                            console.log(1)
                            that.$router.push({path: '/information', query: {url: '/index/queryAllServicePersonnel'}});
                        }).catch(() => {
                            // on cancel
                            that.isBtns = false;
                        });
                    }
                    if (res.data.approvalStatus === 3) {
                        this.$toast('已上传执照，审核中，请耐心等待');
                        that.isBtns = false;
                    }
                })
            },
            /*我要合单*/
            checkOrder(val) {
                let that = this;
                that.$post('/sharePlatform-auth/auth/getUserCheckStatus', {}).then(res => {
                    that.loadingimg = false;
                    sessionStorage.setItem('merType',res.data.merType);
                    if (res.data.approvalStatus === 1) {
                        /*成功*/
                        that.$post('/sharePlatform-person/personnel/pushOrderList', {
                            companyId: val.companyId
                        }).then(res => {
                            that.loadingimg = false;
                            if (res.code === 'W3-01-0001') {
                                that.$toast('登录状态已失效');
                                that.$router.push('/')
                            } else if (res.code == 'I1-00-2007') {
                                this.$toast(res.msg);
                            } else if (res.code == 'I1-00-9999') {
                                if (!res.data.data) {
                                    // that.$toast(res.data.msg);
                                    Dialog.confirm({
                                        title: '',
                                        message: '您暂无可推送的订单，请录入订单后再来合单',
                                        confirmButtonText: '去录单'
                                    }).then(() => {
                                        that.$router.push({
                                                path: '/index/orderManagerment/addOrder',
                                                query: {
                                                    name: "queryAllServicePersonnel"
                                                }
                                            }
                                        );
                                    }).catch(() => {
                                        // on cancel
                                        that.isBtns = false;
                                    });
                                } else {
                                    localStorage.setItem('obj', JSON.stringify(res.data.data.list))

                                    this.$router.push({
                                        path: '/index/addOrderList',
                                        query: {
                                            //dataList:JSON.stringify(res.data.data.list),
                                            personnelId: val.personnelId,
                                            orderTypeName: val.workerName,
                                            confirmBy: val.createBy
                                        }
                                    })
                                    // that.$router.push('/index/addOrderList')
                                }
                            }

                            // that.list = that.list.concat(res.data.list)
                            that.loading = false;
                            that.onScroll = false;
                        })
                            .catch(e => {
                                console.log(e)
                            })
                    }
                    if (res.data.approvalStatus === 0) {
                        Dialog.confirm({
                            title: '',
                            message: '您需完善企业信息并通过审核后，才可进行本操作',
                            confirmButtonText: '去完善信息'
                        }).then(() => {
                            that.$router.push({path: '/information', query: {url: '/index/queryAllServicePersonnel'}});
                        }).catch(() => {
                            // on cancel
                            that.isBtns = false;
                        });
                    }
                    if (res.data.approvalStatus === 2) {
                        Dialog.confirm({
                            title: '',
                            message: '企业注册信息被驳回，请修改信息并通过审核后，才可进行本操作\n 驳回原因：' + res.data.reason,
                            confirmButtonText: '去完善信息'
                        }).then(() => {
                            // on confirm
                            that.$router.push({path: '/information', query: {url: '/index/queryAllServicePersonnel'}});
                        }).catch(() => {
                            // on cancel
                            that.isBtns = false;
                        });
                    }
                    if (res.data.approvalStatus === 3) {
                        this.$toast('已上传执照，审核中，请耐心等待');
                        that.isBtns = false;
                    }
                })


            },
            onSearch() {
                let that = this;
                that.loading = true;
                console.log(that.searchVal)
                if (that.allPage === true) {
                    return false;
                }
                if (that.onScroll === true) {
                    return false;
                }
                that.loadingimgBottom = false;
                that.onScroll = true;


                setTimeout(() => {

                    that.$post('/sharePlatform-person/personnel/openSearch', {

                        searchValue: that.searchVal
                    }).then(res => {
                        that.loadingimg = false;
                        if (res.code === 'W3-01-0001') {
                            that.$toast('登录状态已失效');
                            that.$router.push('/')
                        }
                        that.list = res.data;
                        if (that.list.length > 0) {

                            that.allPage = false;
                            that.onScroll = true;
                            that.loadingimgBottom = false;
                        } else {
                            that.searchState = true
                        }


                    })
                }, 300)

            },
            openFilter(type, backType) {
                let that = this;

                if (localStorage.getItem('lastWorkCity') != 'null') {
                    that.obj.serviceCity = localStorage.getItem('lastWorkCity');
                }
                if (localStorage.getItem('lastWorkType') != null) {
                    that.obj.workerName = localStorage.getItem('lastWorkType');
                }
                if (that.workType != '全部' && that.totalCity != "请选择  ") {
                    if (that.workType != 'null') {
                        that.obj.workerName = that.workType
                    }

                    if (that.cityPicker.cityCode != '0000') {
                        that.obj.serviceCity = that.cityPicker.cityCode
                        localStorage.setItem('lastWorkType', that.workType)
                        localStorage.setItem('lastWorkCity', that.cityPicker.cityCode)
                        localStorage.setItem('lastWorkCityName', this.totalCity)
                    }

                } else {
                    if (that.workType != '全部') {
                        that.obj.workerName = that.workType
                        localStorage.setItem('lastWorkType', that.workType)
                    } else {
                        that.obj.workerName = ''
                    }
                    if (this.totalCity == "请选择  " || that.cityPicker.cityCode == '0000') {
                        that.obj.serviceCity = ''


                    } else {
                        that.obj.serviceCity = that.cityPicker.cityCode
                        localStorage.setItem('lastWorkCity', that.cityPicker.cityCode)
                        localStorage.setItem('lastWorkCityName', this.totalCity)
                    }

                }
                that.onScurrentPage++;
                that.obj.currentPage = that.onScurrentPage
                that.obj.pageSize = '5'
                that.$post('/sharePlatform-person/personnel/openFilter', that.obj).then(res => {
                    that.loadingimg = false;
                    if (res.code === 'W3-01-0001') {
                        that.$toast('登录状态已失效');
                        that.$router.push('/')
                    }
                    if (!type) {
                        that.list = that.list.concat(res.data.list);
                    } else {
                        that.list = res.data.list
                    }
                    // if(that.list.length>0){
                    //
                    //     that.allPage = false;
                    //     that.onScroll = true;
                    //     that.loadingimgBottom = false;
                    // }
                    // else{
                    //     that.searchState=true
                    // }
                })
            },
            // 城市层控制
            showCityPicker() {
                // this.popupVisible = !this.popupVisible;
                let that = this;
                this.isCitys = true
                if (this.popupVisible === false) {
                    this.popupVisible = true
                    this.workCityState = new BScroll('#u-workPicker')
                } else {
                    this.popupVisible = false
                    this.workCityState.destroy()
                }

            },
            // 工种层控制
            showWorkType() {
                let that = this;
                that.popupVisibleWorkType = !that.popupVisibleWorkType;
                that.isWorkType = true;

            },
            queryCityPicker() {
                let that = this
                that.noData=false
                let checkValue = that.listState
                if (this.totalCity != "请选择 ") {
                    this.onScurrentPage = 0
                    localStorage.setItem('lastWorkCity', that.cityPicker.cityCode)
                    localStorage.setItem('lastWorkCityName', this.totalCity)
                    that.openFilter(true)
                    that.listState = 1
                    that.popupVisible = false

                } else {
                    if (this.workType == "全部" && this.totalCity == "请选择 ") {

                        that.viewPool()
                        that.listState = 0
                        that.popupVisible = false
                    } else {
                        that.obj.workerName = ''

                        this.onScurrentPage = 0
                        that.openFilter(true)
                        that.listState = 1
                        that.popupVisible = false
                    }
                }
                that.list = []
            },
            queryWorkType() {
                let that = this
                that.noData=false
                let checkValue = that.listState
                if (that.workType != "全部") {
                    this.onScurrentPage = 0
                    that.list = []
                    localStorage.setItem('lastWorkType', that.workType)

                    that.openFilter()
                    that.listState = 1
                    that.popupVisibleWorkType = false

                } else {
                    if (that.workType == "全部" && that.totalCity == "请选择 ") {
                        that.viewPool()
                        that.listState = 0
                        that.popupVisibleWorkType = false
                    } else {
                        that.obj.workerName = ''
                        this.onScurrentPage = 0
                        that.openFilter(true)
                        that.listState = 1
                        that.popupVisibleWorkType = false
                        // that.listState = 1
                    }

                }
                that.list = []
                if (checkValue !== that.listState) {
                    that.list = []
                }

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
                        tmpArr.unshift({
                            allId: -1,
                            createBy: 0,
                            createTime: "2019-05-10 00:00:02",
                            log: "",
                            name: "全部",
                            updateBy: 0,
                            updateTime: "",
                            valid: 0,
                            version: 0,
                        })
                    }
                });
                return tmpArr;
            },
            // 工作城市弹出层切换事件
            addressChange(picker, values) {

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
            // 工种弹出层切换
            workTypeChange(picker, values) {
                // let name =sessionStorage.getItem('lastWorkType')!=null?sessionStorage.getItem('lastWorkType'):'全部';
                // if(sessionStorage.getItem('lastWorkType')!=null){
                //     this.workTypeCode = -1
                //     this.workType = sessionStorage.getItem('lastWorkType')
                // }else{
                this.workTypeCode = values[0]["allId"]
                this.workType = values[0]["name"]
                // }


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
            tempWorkIdArr() {
                let arr = this.getWorkType()
                let result = []
                for (let i in arr) {
                    result.push(arr[i].name)
                }
                console.log(result)
                return result;
            },
        }
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }

    .mint-popup-bottom {
        width: 100%;
    }

    .searchs {
        display: flex;
        align-items: center;
        justify-content: space-around;

        div {
            text-align: center;

            input {
                border: 1px solid #ccc;
                border-radius: 0.2rem;
                width: 60%;
                text-align: center;
                padding: 0.2rem 0;
            }
        }

    }

    .g-cityPicker, .g-workType {
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

    .g-list {
        padding: 0 px2rem(15px);
        padding-bottom: 8.8rem;

        .item {
            width: 100%;
            min-height: 8.875rem;
            height: max-content;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 7px 20px 0px rgba(0, 0, 0, 0.08);
            border-radius: 6px;
            margin-bottom: 1rem;
            margin-top: 1rem;
            border: 1px solid #ddd;
            padding-bottom: 0.5rem;

            .part {
                padding: 0 px2rem(15px);
                margin-top: px2rem(15px);
                display: flex;

                span {
                    display: inline-block;
                }

                .u-text-title {
                    font-weight: bold;
                    font-size: px2rem(15px);


                }

                .u-text-des {
                    font-size: px2rem(15px);
                }

                saveOrderList
                    /*.u-text-company {*/
                    /*    font-weight: bold;*/
                    /*    font-size: px2rem(15px);*/
                    /*}*/
                    /*.u-text-companydes {*/
                    /*    font-size: px2rem(15px);*/
                    /*}*/
                .u-text-worktitle {

                    /*.u-text-companydes{*/
                    /*    font-size: px2rem(15px);*/
                    /*}*/

                }

                .u-text-workdes {


                }

                .edit {
                    background: #c89efc;
                    font-size: px2rem(14px);
                    font-weight: bold;
                    color: #fff;
                    border: none;
                    padding: px2rem(8px) px2rem(10px);
                }
            }
        }
    }

    .no-list {
        padding: px2rem(65px) px2rem(15px) 0;
        text-align: center;
        font-size: px2rem(15px);

        img {
            width: px2rem(260px);
        }
    }

    .loading {
        padding-top: 6rem;

        div {
            margin: 0 auto;
        }
    }

    .dataLoading {
        position: fixed;
        bottom: 0;
        display: flex;
        justify-content: center;
        z-index: 21;
        left: 40%;
    }
</style>
