<template>
    <div class="c-servicer_manage_system">
        <div class="g-query_wrap">
            <div class="m-items">
                <span>姓名：</span>
                <el-input class="u-input" v-model="inputSelectedData.servicerName" @input="resetPagination"></el-input>
            </div>
            <div class="m-items">
                <span>身份证号：</span>
                <el-input class="u-input" v-model="inputSelectedData.idCard" input="resetPagination" maxlength="18" @input="checkIdCardNum"></el-input>
            </div>
            <div class="m-items">
                <span>手机号码：</span>
                <el-input class="u-input" v-model="inputSelectedData.servicerMobile" input="resetPagination" maxlength="11" @input="checkMobile"></el-input>
            </div>
            <!--<div class="m-items">-->
                <!--<span>工种：</span>-->
                <!--<el-select class="u-input" v-model="inputSelectedData.worktype" placeholder="请选择" input="resetPagination">-->
                    <!--<el-option-->
                            <!--v-for="item in inputRenderData.renderWorkType"-->
                            <!--:key="item.allId"-->
                            <!--:label="item.name"-->
                            <!--:value="item.allId">-->
                    <!--</el-option>-->
                <!--</el-select>-->
            <!--</div>-->

        </div>
        <div>
            <div class="m-items m-query" >
                <el-button @click="resetQueryParams">重置</el-button>
                <el-button @click="getTableInfo" type="primary">查询</el-button>
                <el-button @click="openAddServicerModel" type="primary">新增服务人员</el-button>
            </div>
        </div>
        <div class="g-table_wrap">
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="userName"
                        label="姓名"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="idCardNum"
                        label="身份证号"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="手机号码"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="workerName"
                        label="工种"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="serviceCityStr"
                        label="工作城市"
                        width="120">
                </el-table-column>
                <!--<el-table-column-->
                        <!--prop="userCity"-->
                        <!--label="籍贯"-->
                        <!--width="120">-->
                <!--</el-table-column>-->
                <el-table-column
                        prop="address"
                        label="家庭地址"
                        >
                </el-table-column>
                <el-table-column
                        prop="workingLife"
                        label="工作年限"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="introduction"
                        label="介绍"
                        width="120">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="openEditServicerModel(tableData[scope.$index].personnelId)" type="text" size="small">编辑</el-button>
                        <el-button @click.native.prevent="openDetailsServicerModel(tableData[scope.$index].personnelId)" type="text" size="small">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    layout="prev, pager, next,sizes,jumper"
                    :total="pagination.totalRecord"
                    :page-sizes="[10, 20, 50]"
                    :page-size="pagination.pageSize"
                    :current-page="pagination.currentPage"
                    @next-click="pagination.currentPage++"
                    @prev-click="pagination.currentPage--"
                    @size-change="handleSizeChange"
                    @current-change="tablePaginationChangeCurPage"
            >
            </el-pagination>
        </div>

        <!--        新增服务人员模态框-->
        <el-dialog
                title="新增服务人员"
                :visible.sync="newServicerModel.dialogVisible"
                width="800px"
                class="g-new_servicer_model"
                :close-on-click-modal="false"
                @close="newServicerModelClose"
                @closed="newServicerModelClosed"
        >
            <div class="m-item">
                <span class="title"><i class="f-must">* </i>姓名:</span>
                <el-input v-model="newServicerModelParams.name" placeholder="请输入内容"></el-input>
            </div>
            <div class="m-item">


            <span class="title"><i class="f-must">* </i>身份证号:</span>
                <div class="el-input">
                    <input  maxlength="18"  v-model="newServicerModelParams.idCard" type="text" class="el-input__inner" @input="idCardInputing">
                </div>
                <el-button :disabled="newServicerModel.hasIdCardChecked" :loading="newServicerModel.checkButtonState" type="primary" class="u-verify_idcard" @click="newServicerVerifyIdCard">{{newServicerModel.checkIdCardButtonText}}</el-button>
            </div>
            <div class="m-item">
                <span class="title"><i class="f-must">* </i>工种:</span>
                <el-checkbox-group v-model="newServicerModelParams.workType" class="u-work_type">
                    <template v-for="item in newServicerModelWorkType">
                        <el-checkbox :label="item.allId" :key="item.allId">{{item.name}}</el-checkbox>
                    </template>
                </el-checkbox-group>
            </div>
            <div class="m-item">
                <span class="title"><i class="f-must">* </i>工作城市</span>
                <el-cascader
                        ref="newServicerWorkCityPicker"
                        :options="countryList"
                        v-model="newServicerModelParams.workCity"
                        @change="newServicerWorkCityChange"
                        >
                </el-cascader>
            </div>
            <p v-if=" newServicerModelParams.workCityLabel.join(' / ') !== ''" class="u-city_notice">{{'您选择的是: ' + newServicerModelParams.workCityLabel.join(' / ')}}</p>
            <div class="m-item">
                <span class="title"><i class="f-must">* </i>手机号码:</span>
                <div class="el-input">
                    <input maxlength="13" oninput="this.value=this.value.replace(/\D/g,'')" v-model="newServicerModelParams.mobile" type="text" class="el-input__inner">
                </div>
<!--                <el-input v-model="newServicerModelParams.mobile" placeholder="请输入内容"></el-input>-->
            </div>
            <div class="m-item">
                <span class="title"><i class="f-must">* </i>籍贯</span>
                <el-cascader
                        ref="newServicerBornCityPicker"
                        :options="cityList"
                        v-model="newServicerModelParams.bornCity"
                        @change="newServicerBornCityChange"
                >
                </el-cascader>
            </div>
            <p v-if=" newServicerModelParams.bornCityLabel.join(' / ') !== ''" class="u-city_notice">{{'您选择的是: ' + newServicerModelParams.bornCityLabel.join(' / ')}}</p>
            <div class="m-item">
                <span class="title"><i class="f-default">* </i>家庭地址:</span>
                <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        maxlength="50"
                        v-model="newServicerModelParams.homeAddress">
                </el-input>
            </div>
            <div class="m-item">
                <span class="title"><i class="f-default">* </i>工作年限:</span>
                <div class="el-input">
                    <input  maxlength="2" oninput="this.value=this.value.replace(/\D/g,'')" v-model="newServicerModelParams.workYear" type="text" class="el-input__inner">
                </div>
            </div>
            <div class="m-item">
                <span class="title"><i class="f-default">* </i>介绍:</span>
                <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        maxlength="50"
                        v-model="newServicerModelParams.introduction">
                </el-input>
            </div>
            <div class="m-item">
                <span class="title">
                    <i class="f-default">* </i>
                    头像:
                </span>
                <el-upload
                        :on-remove="newServicerRemoveHeadpic"
                        class="avatar-uploader"
                        action="/img_service/ul/uploadImg.action"
                        list-type="picture-card"
                        :file-list="newServicerModel.headpic"
                        name="files"
                        :limit="1"
                        :on-exceed="newServicerModelUploadOverflow"
                        :data="uploadPicFormData"
                        :on-success="newServicerUploadOnSuccessHeadpic"
                        :class="{'f-upload_hide':newServicerModelParams.hideUploadIdHeadpic}"
                        :on-change="newServicerChangeHeadpic"
                        :before-upload="imgBeforeUpload"
                >
                    <i  class="el-icon-plus avatar-uploader-icon">
                        <p style="font-size: 14px;margin-top: 10px">上传头像</p>
                    </i>
                </el-upload>
            </div>
            <div class="m-item" style="width: 100%">
                <span class="title"><i class="f-default">* </i>身份证:</span>
                <el-upload
                        :on-remove="newServicerRemoveIdCardFront"
                        class="avatar-uploader"
                        action="/img_service/ul/uploadImg.action"
                        list-type="picture-card"
                        :file-list="newServicerModel.idCardFront"
                        name="files"
                        :limit="1"
                        :on-exceed="newServicerModelUploadOverflow"
                        :data="uploadPicFormData"
                        :on-success="newServicerUploadOnSuccessIdCardFront"
                        :class="{'f-upload_hide':newServicerModelParams.hideUploadIdCardFront}"
                        :on-change="newServicerChangeIdCardFront"
                        :before-upload="imgBeforeUpload"
                >
                    <i  class="el-icon-plus avatar-uploader-icon">
                        <p style="font-size: 14px;margin-top: 10px">身份证国徽面</p>
                    </i>
                </el-upload>
                <el-upload
                        :on-remove="newServicerRemoveIdCardBack"
                        class="avatar-uploader"
                        action="/img_service/ul/uploadImg.action"
                        list-type="picture-card"
                        :file-list="newServicerModel.idCardBack"
                        name="files"
                        :limit="1"
                        :on-exceed="newServicerModelUploadOverflow"
                        :data="uploadPicFormData"
                        :on-success="newServicerUploadOnSuccessIdCardBack"
                        :class="{'f-upload_hide':newServicerModelParams.hideUploadIdCardBack}"
                        :on-change="newServicerChangeIdCardBack"
                        :before-upload="imgBeforeUpload"
                >
                    <i  class="el-icon-plus avatar-uploader-icon">
                        <p style="font-size: 14px;margin-top: 10px">身份证人像面</p>
                    </i>
                </el-upload>



            </div>
            <div class="m-item" style="width: 100%">
                <span class="title"><i class="f-default">* </i>健康证:</span>
                <el-upload
                        :on-remove="newServicerRemoveHealthFront"
                        class="avatar-uploader"
                        action="/img_service/ul/uploadImg.action"
                        list-type="picture-card"
                        :file-list="newServicerModel.healthFront"
                        name="files"
                        :limit="1"
                        :on-exceed="newServicerModelUploadOverflow"
                        :data="uploadPicFormData"
                        :on-success="newServicerUploadOnSuccessHealthFront"
                        :class="{'f-upload_hide':newServicerModelParams.hideUploadHealthFront}"
                        :on-change="newServicerChangeHealthFront"
                        :before-upload="imgBeforeUpload"
                >
                    <div class="el-upload__tip" slot="tip"></div>
                    <i  class="el-icon-plus avatar-uploader-icon">
                        <p style="font-size: 14px;margin-top: 10px">健康证正面</p>
                    </i>
                </el-upload>
                <el-upload
                        :on-remove="newServicerRemoveHealthBack"
                        class="avatar-uploader"
                        action="/img_service/ul/uploadImg.action"
                        list-type="picture-card"
                        :file-list="newServicerModel.healthBack"
                        name="files"
                        :limit="1"
                        :on-exceed="newServicerModelUploadOverflow"
                        :data="uploadPicFormData"
                        :on-success="newServicerUploadOnSuccessHealthBack"
                        :class="{'f-upload_hide':newServicerModelParams.hideUploadHealthBack}"
                        :on-change="newServicerChangeHealthBack"
                        :before-upload="imgBeforeUpload"
                >
                    <i  class="el-icon-plus avatar-uploader-icon">
                        <p style="font-size: 14px;margin-top: 10px">健康证反面</p>
                    </i>
                </el-upload>
            </div>


            <span slot="footer" class="dialog-footer">
                <el-button @click="newServicerModel.dialogVisible = false">取 消</el-button>
                <el-button type="primary" :loading="newServicerModelParams.saveButtonLoading" @click="newSerivicer">确 定</el-button>
            </span>
        </el-dialog>
        <!--        编辑服务人员模态框-->
        <el-dialog
            title="编辑服务人员"
            :visible.sync="editServicerModel.dialogVisible"
            width="800px"
            class="g-new_servicer_model"
            :close-on-click-modal="false"
            @close="editServicerModelClose"
            @closed="editServicerModelClosed"
    >
        <div class="m-item">
            <span class="title"><i class="f-must">* </i>姓名:</span>
            <el-input v-model="editServicerModelParams.name" disabled placeholder="请输入内容"></el-input>
        </div>
        <div class="m-item">
            <span class="title"><i class="f-must">* </i>身份证号:</span>

            <el-input maxlength="18" v-model="editServicerModelParams.idCard" disabled placeholder="请输入内容"></el-input>
        </div>
        <div class="m-item">
            <span class="title"><i class="f-must">* </i>工种:</span>
            <el-checkbox-group v-model="editServicerModelParams.workType" class="u-work_type">
               <div v-for="(item,index) in newServicerModelWorkType" :key="index">
                       <el-checkbox  :label="item.allId" >{{item.name}}</el-checkbox>
               </div>

            </el-checkbox-group>
        </div>
        <div class="m-item">
            <span class="title"><i class="f-must">* </i>工作城市</span>
            <el-cascader
                    ref="editServicerWorkCityPicker"
                    :options="countryList"
                    v-model="editServicerModelParams.workCity"
                    @change="editServicerWorkCityChange"
            >
            </el-cascader>
        </div>
        <p v-if=" editServicerModelParams.workCityLabel.join(' / ') !== ''" class="u-city_notice">{{'您选择的是: ' + editServicerModelParams.workCityLabel.join(' / ')}}</p>
        <div class="m-item">
            <span class="title"><i class="f-must">* </i>手机号码:</span>

                            <el-input disabled v-model="editServicerModelParams.mobile" placeholder="请输入内容"></el-input>
        </div>
        <div class="m-item">
            <span class="title"><i class="f-must">* </i>籍贯</span>
            <el-cascader
                    ref="editServicerBornCityPicker"
                    :options="cityList"
                    v-model="editServicerModelParams.bornCity"
                    @change="editServicerBornCityChange"
            >
            </el-cascader>
        </div>
        <p v-if=" editServicerModelParams.bornCityLabel.join(' / ') !== ''" class="u-city_notice">{{'您选择的是: ' + editServicerModelParams.bornCityLabel.join(' / ')}}</p>
        <div class="m-item">
            <span class="title"><i class="f-default">* </i>家庭地址:</span>
            <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    maxlength="50"
                    v-model="editServicerModelParams.homeAddress">
            </el-input>
        </div>
        <div class="m-item">
            <span class="title"><i class="f-default">* </i>工作年限:</span>
            <div class="el-input">
                <input  maxlength="2" oninput="this.value=this.value.replace(/\D/g,'')" v-model="editServicerModelParams.workYear" type="text" class="el-input__inner">
            </div>
        </div>
        <div class="m-item">
            <span class="title"><i class="f-default">* </i>介绍:</span>
            <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    maxlength="50"
                    v-model="editServicerModelParams.introduction">
            </el-input>
        </div>
            <div class="m-item">
                <span class="title">
                    <i class="f-default">* </i>
                    头像:
                </span>
                <el-upload
                        :on-remove="editServicerRemoveHeadpic"
                        class="avatar-uploader"
                        action="/img_service/ul/uploadImg.action"
                        list-type="picture-card"
                        :file-list="editServicerModel.headpic"
                        name="files"
                        :limit="1"
                        :on-exceed="editServicerModelUploadOverflow"
                        :data="uploadPicFormData"
                        :on-success="editServicerUploadOnSuccessHeadpic"
                        :class="{'f-upload_hide':editServicerModelParams.hideUploadIdHeadpic}"
                        :on-change="editServicerChangeHeadpic"
                        :before-upload="imgBeforeUpload"
                >
                    <i  class="el-icon-plus avatar-uploader-icon">
                        <p style="font-size: 14px;margin-top: 10px">上传头像</p>
                    </i>
                </el-upload>
            </div>
        <div class="m-item" style="width: 100%">
            <span class="title"><i class="f-default">* </i>身份证:</span>
            <el-upload
                    :on-remove="editServicerRemoveIdCardFront"
                    class="avatar-uploader"
                    action="/img_service/ul/uploadImg.action"
                    list-type="picture-card"
                    :file-list="editServicerModel.idCardFront"
                    name="files"
                    :limit="1"
                    :on-exceed="editServicerModelUploadOverflow"
                    :data="uploadPicFormData"
                    :on-success="editServicerUploadOnSuccessIdCardFront"
                    :class="{'f-upload_hide':editServicerModelParams.hideUploadIdCardFront}"
                    :on-change="editServicerChangeIdCardFront"
                    :before-upload="imgBeforeUpload"
            >
                <i  class="el-icon-plus avatar-uploader-icon">
                    <p style="font-size: 14px;margin-top: 10px">身份证国徽面</p>
                </i>
            </el-upload>
            <el-upload
                    :on-remove="editServicerRemoveIdCardBack"
                    class="avatar-uploader"
                    action="/img_service/ul/uploadImg.action"
                    list-type="picture-card"
                    :file-list="editServicerModel.idCardBack"
                    name="files"
                    :limit="1"
                    :on-exceed="editServicerModelUploadOverflow"
                    :data="uploadPicFormData"
                    :on-success="editServicerUploadOnSuccessIdCardBack"
                    :class="{'f-upload_hide':editServicerModelParams.hideUploadIdCardBack}"
                    :on-change="editServicerChangeIdCardBack"
                    :before-upload="imgBeforeUpload"
            >
                <i  class="el-icon-plus avatar-uploader-icon">
                    <p style="font-size: 14px;margin-top: 10px">身份证人像面</p>
                </i>
            </el-upload>

        </div>
        <div class="m-item" style="width: 100%">
            <span class="title"><i class="f-default">* </i>健康证:</span>
            <el-upload
                    :on-remove="editServicerRemoveHealthFront"
                    class="avatar-uploader"
                    action="/img_service/ul/uploadImg.action"
                    list-type="picture-card"
                    :file-list="editServicerModel.healthFront"
                    name="files"
                    :limit="1"
                    :on-exceed="editServicerModelUploadOverflow"
                    :data="uploadPicFormData"
                    :on-success="editServicerUploadOnSuccessHealthFront"
                    :class="{'f-upload_hide':editServicerModelParams.hideUploadHealthFront}"
                    :on-change="editServicerChangeHealthFront"
                    :before-upload="imgBeforeUpload"
            >
                <i  class="el-icon-plus avatar-uploader-icon">
                    <p style="font-size: 14px;margin-top: 10px">健康证正面</p>
                </i>
            </el-upload>
            <el-upload
                    :on-remove="editServicerRemoveHealthBack"
                    class="avatar-uploader"
                    action="/img_service/ul/uploadImg.action"
                    list-type="picture-card"
                    :file-list="editServicerModel.healthBack"
                    name="files"
                    :limit="1"
                    :on-exceed="editServicerModelUploadOverflow"
                    :data="uploadPicFormData"
                    :on-success="editServicerUploadOnSuccessHealthBack"
                    :class="{'f-upload_hide':editServicerModelParams.hideUploadHealthBack}"
                    :on-change="editServicerChangeHealthBack"
                    :before-upload="imgBeforeUpload"
            >
                <i  class="el-icon-plus avatar-uploader-icon">
                    <p style="font-size: 14px;margin-top: 10px">健康证反面</p>
                </i>
            </el-upload>
        </div>


        <span slot="footer" class="dialog-footer">
                <el-button @click="editServicerModelClose">取 消</el-button>
                <el-button type="primary" @click="editServicer">确 定</el-button>
            </span>
    </el-dialog>
        <!--        详情服务人员模态框-->
        <el-dialog
                title="服务人员详情"
                :visible.sync="detailsServicerModel.dialogVisible"
                width="800px"
                class="g-new_servicer_model"
                :close-on-click-modal="false"
                @close="detailsServicerModelClose"
                @closed="detailsServicerModelClosed"
        >
            <div class="m-item">
                <span class="title"><i class="f-default">* </i>姓名:</span>
                <el-input disabled v-model="detailsServicerModelParams.name" placeholder="请输入内容"></el-input>
            </div>
            <div class="m-item">
                <span class="title"><i class="f-default">* </i>身份证号:</span>
                <el-input
                        type="text"
                        placeholder="请输入内容"
                        disabled
                        v-model="detailsServicerModelParams.idCard">
                </el-input>
            </div>
            <div class="m-item">
                <span class="title"><i class="f-default">* </i>工种:</span>
                <el-checkbox-group v-model="detailsServicerModelParams.workType" class="u-work_type">
                    <div v-for="(item,index) in newServicerModelWorkType" :key="index">
                            <el-checkbox disabled :label="item.allId" >{{item.name}}</el-checkbox>
                    </div>

                </el-checkbox-group>
            </div>
            <div class="m-item">
                <span class="title"><i class="f-default">* </i>工作城市</span>
                <el-cascader
                        ref="detailsServicerWorkCityPicker"
                        :options="countryList"
                        v-model="detailsServicerModelParams.workCity"
                        @change="detailsServicerWorkCityChange"
                        disabled
                >
                </el-cascader>
            </div>
            <p v-if=" detailsServicerModelParams.workCityLabel.join(' / ') !== ''" class="u-city_notice">{{'您选择的是: ' + detailsServicerModelParams.workCityLabel.join(' / ')}}</p>
            <div class="m-item">
                <span class="title"><i class="f-default">* </i>手机号码:</span>

                <el-input
                        type="text"
                        placeholder="请输入内容"
                        disabled
                        v-model="detailsServicerModelParams.mobile">
                </el-input>
                <!--                <el-input disabled v-model="editServicerModelParams.mobile" placeholder="请输入内容"></el-input>-->
            </div>
            <div class="m-item">
                <span class="title"><i class="f-default">* </i>籍贯</span>
                <el-cascader
                        ref="detailsServicerBornCityPicker"
                        :options="cityList"
                        v-model="detailsServicerModelParams.bornCity"
                        @change="detailsServicerBornCityChange"
                        disabled
                >
                </el-cascader>
            </div>
            <p v-if=" detailsServicerModelParams.bornCityLabel.join(' / ') !== ''" class="u-city_notice">{{'您选择的是: ' + detailsServicerModelParams.bornCityLabel.join(' / ')}}</p>
            <div class="m-item">
                <span class="title"><i class="f-default">* </i>家庭地址:</span>
                <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        maxlength="50"
                        disabled
                        v-model="detailsServicerModelParams.homeAddress">
                </el-input>
            </div>
            <div class="m-item">
                <span class="title"><i class="f-default">* </i>工作年限:</span>

                <el-input
                        type="text"
                        placeholder="请输入内容"
                        disabled
                        v-model="detailsServicerModelParams.workYear">
                </el-input>

            </div>
            <div class="m-item">
                <span class="title"><i class="f-default">* </i>介绍:</span>
                <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        maxlength="50"
                        disabled
                        v-model="detailsServicerModelParams.introduction">
                </el-input>
            </div>
            <div class="m-item">
                <span class="title">
                    <i class="f-default">* </i>
                    头像:
                </span>
                <el-upload
                        :on-remove="detailsServicerRemoveHeadpic"
                        class="avatar-uploader"
                        action="/img_service/ul/uploadImg.action"
                        list-type="picture-card"
                        :file-list="detailsServicerModel.headpic"
                        name="files"
                        disabled
                        :limit="1"
                        :on-exceed="detailsServicerModelUploadOverflow"
                        :data="uploadPicFormData"
                        :on-success="detailsServicerUploadOnSuccessHeadpic"
                        :class="{'f-upload_hide':detailsServicerModelParams.hideUploadIdHeadpic}"
                        :on-change="detailsServicerChangeHeadpic"
                        :before-upload="imgBeforeUpload"
                >
                    <i  class="el-icon-plus avatar-uploader-icon">
                        <p style="font-size: 14px;margin-top: 10px">上传头像</p>
                    </i>
                </el-upload>
            </div>
            <div class="m-item" style="width: 100%">
                <span class="title"><i class="f-default">* </i>身份证:</span>
                <el-upload
                        :on-remove="detailsServicerRemoveIdCardFront"
                        class="avatar-uploader"
                        action="/img_service/ul/uploadImg.action"
                        list-type="picture-card"
                        :file-list="detailsServicerModel.idCardFront"
                        name="files"
                        :limit="1"
                        disabled
                        :on-exceed="detailsServicerModelUploadOverflow"
                        :data="uploadPicFormData"
                        :on-success="detailsServicerUploadOnSuccessIdCardFront"
                        :class="{'f-upload_hide':detailsServicerModelParams.hideUploadIdCardFront}"
                        :on-change="detailsServicerChangeIdCardFront"
                >
                    <i  class="el-icon-plus avatar-uploader-icon">
                        <p style="font-size: 14px;margin-top: 10px">身份证国徽面</p>
                    </i>
                </el-upload>
                <el-upload
                        :on-remove="detailsServicerRemoveIdCardBack"
                        class="avatar-uploader"
                        action="/img_service/ul/uploadImg.action"
                        list-type="picture-card"
                        :file-list="detailsServicerModel.idCardBack"
                        name="files"
                        :limit="1"
                        disabled
                        :on-exceed="detailsServicerModelUploadOverflow"
                        :data="uploadPicFormData"
                        :on-success="detailsServicerUploadOnSuccessIdCardBack"
                        :class="{'f-upload_hide':detailsServicerModelParams.hideUploadIdCardBack}"
                        :on-change="detailsServicerChangeIdCardBack"
                >
                    <i  class="el-icon-plus avatar-uploader-icon">
                        <p style="font-size: 14px;margin-top: 10px">身份证人像面</p>
                    </i>
                </el-upload>



            </div>
            <div class="m-item" style="width: 100%">
                <span class="title"><i class="f-default">* </i>健康证:</span>
                <el-upload
                        :on-remove="detailsServicerRemoveHealthFront"
                        class="avatar-uploader"
                        action="/img_service/ul/uploadImg.action"
                        list-type="picture-card"
                        :file-list="detailsServicerModel.healthFront"
                        name="files"
                        :limit="1"
                        disabled
                        :on-exceed="detailsServicerModelUploadOverflow"
                        :data="uploadPicFormData"
                        :on-success="detailsServicerUploadOnSuccessHealthFront"
                        :class="{'f-upload_hide':detailsServicerModelParams.hideUploadHealthFront}"
                        :on-change="detailsServicerChangeHealthFront"
                >
                    <i  class="el-icon-plus avatar-uploader-icon">
                        <p style="font-size: 14px;margin-top: 10px">健康证正面</p>
                    </i>
                </el-upload>
                <el-upload
                        :on-remove="detailsServicerRemoveHealthBack"
                        class="avatar-uploader"
                        action="/img_service/ul/uploadImg.action"
                        list-type="picture-card"
                        :file-list="detailsServicerModel.healthBack"
                        name="files"
                        :limit="1"
                        disabled
                        :on-exceed="detailsServicerModelUploadOverflow"
                        :data="uploadPicFormData"
                        :on-success="detailsServicerUploadOnSuccessHealthBack"
                        :class="{'f-upload_hide':detailsServicerModelParams.hideUploadHealthBack}"
                        :on-change="detailsServicerChangeHealthBack"
                >
                    <i  class="el-icon-plus avatar-uploader-icon">
                        <p style="font-size: 14px;margin-top: 10px">健康证反面</p>
                    </i>
                </el-upload>
            </div>


            <span slot="footer" class="dialog-footer">
<!--                <el-button @click="detailsServicerModelClose">取 消</el-button>-->
<!--                <el-button type="primary" @click="detailsServicer">确 定</el-button>-->
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import cityCode from '../lib/CityCode.json'
    import countryCode from '../lib/CityCodeCountry.json'
    export default {
        name: "servicer-manage-system",
        data(){

            return {
                // 新增服务人员模态框
                newServicerModel:{
                    dialogVisible:false,
                    idCardFront:[],
                    idCardBack:[],
                    healthFront:[],
                    healthBack:[],
                    headpic:[],
                    checkIdCardButtonText:'验证',
                    hasIdCardChecked: false,
                    checkButtonState: false
                },
                // 新增服务人员信息
                newServicerModelParams:{
                    name:'',
                    idCard:'',
                    workType:[],
                    workCity:'',
                    workCityLabel:[],
                    mobile:'',
                    bornCity:[],
                    bornCityLabel:[],
                    homeAddress:'',
                    workYear:'',
                    introduction:'',
                    hideUploadIdCardFront:false,
                    hideUploadIdCardBack:false,
                    hideUploadHealthFront:false,
                    hideUploadHealthBack:false,
                    hideUploadIdHeadpic:false,
                    saveButtonLoading:false
                },
                // 编辑服务人员模态框
                editServicerModel:{
                    dialogVisible:false,
                    idCardFront:[],
                    idCardBack:[],
                    healthFront:[],
                    healthBack:[],
                    headpic:[],

                },

                // 编辑服务人员信息
                editServicerModelParams:{
                    name:'',
                    idCard:'',
                    workType:[],
                    workCity:'',
                    workCityLabel:[],
                    mobile:'',
                    bornCity:[],
                    bornCityLabel:[],
                    homeAddress:'',
                    workYear:'',
                    introduction:'',
                    hideUploadIdCardFront:false,
                    hideUploadIdCardBack:false,
                    hideUploadHealthFront:false,
                    hideUploadHealthBack:false,
                    hideUploadIdHeadpic:false,
                    saveButtonLoading:false,
                    personalId:''
                },
                // 详情服务人员模态框
                detailsServicerModel:{
                    dialogVisible:false,
                    idCardFront:[],
                    idCardBack:[],
                    healthFront:[],
                    healthBack:[],
                    headpic:[]
                },

                // 详情服务人员信息
                detailsServicerModelParams:{
                    name:'',
                    idCard:'',
                    workType:[],
                    workCity:'',
                    workCityLabel:[],
                    mobile:'',
                    bornCity:[],
                    bornCityLabel:[],
                    homeAddress:'',
                    workYear:'',
                    introduction:'',
                    hideUploadIdCardFront:false,
                    hideUploadIdCardBack:false,
                    hideUploadHealthFront:false,
                    hideUploadHealthBack:false,
                    hideUploadIdHeadpic:false,
                    saveButtonLoading:false,
                    personalId:''
                },
                // 新增服务人员模态框工种信息
                newServicerModelWorkType:[],
                // 城市列表
                cityList:cityCode,
                countryList:countryCode,
                // 表单输入信息
                inputSelectedData:{
                    servicerName:'',
                    servicerMobile:'',
                    //worktype:'',
                    idCard:''
                },
                // 表单渲染信息
                inputRenderData:{
                    renderWorkType:[]
                },
                // 表格渲染信息
                tableData:[],
                //分页信息
                pagination:{
                    pageSize:10,
                    currentPage:1,
                    totalRecord:0
                },
                uploadPicFormData:{
                    type:'ORIGINAL'
                }
            }
        },methods:{
            tablePaginationChangeCurPage(val){
              this.pagination.currentPage = val;
              this.getTableInfo()
            },
            idCardInputing(){
                this.newServicerModel.checkIdCardButtonText = '验证'
                this.newServicerModel.hasIdCardChecked = false
                this.newServicerModel.checkButtonState = false

            },
            // 123新增服务人员页面上传身份证国徽面成功后为upload添加隐藏类
            detailsServicerChangeIdCardFront(){
                this.detailsServicerModelParams.hideUploadIdCardFront = this.detailsServicerModel.idCardFront.length !== 0
            },
            detailsServicerChangeHeadpic(){
                this.detailsServicerModelParams.hideUploadIdHeadpic = this.detailsServicerModel.headpic.length !== 0
            },

            // 新增服务人员页面上传身份证国徽面成功后为upload添加隐藏类
            detailsServicerChangeIdCardBack(){
                this.detailsServicerModelParams.hideUploadIdCardBack = this.detailsServicerModel.idCardBack.length !== 0
            },
            // 新增服务人员页面上传健康证正面成功后为upload添加隐藏类
            detailsServicerChangeHealthFront(){
                this.detailsServicerModelParams.hideUploadHealthFront = this.detailsServicerModel.healthFront.length !== 0
            },
            // 新增服务人员页面上传健康证反面成功后为upload添加隐藏类
            detailsServicerChangeHealthBack(){
                this.detailsServicerModelParams.hideUploadHealthBack = this.detailsServicerModel.healthBack.length !== 0
            },

            // 123新增服务人员页面上传身份证国徽面成功后为upload添加隐藏类
            newServicerChangeIdCardFront(){
                this.newServicerModelParams.hideUploadIdCardFront = this.newServicerModel.idCardFront.length !== 0
            },
            // 123新增服务人员页面上传头像成功后为upload添加隐藏类
            newServicerChangeHeadpic(){
                this.newServicerModelParams.hideUploadIdHeadpic = this.newServicerModel.headpic.length !== 0
            },
            // 图片格式检查
            imgBeforeUpload(file){
                let suffix = file.name.substr(file.name.lastIndexOf('.'),file.name.length).replace('.','');
                if(['png','jpg','jpeg','bmp','gif','webp'].indexOf(suffix) === -1){
                    this.$message.error('只能上传图片格式文件');
                    return false;
                }
            },
            // 新增服务人员页面上传身份证国徽面成功后为upload添加隐藏类
            newServicerChangeIdCardBack(){
                this.newServicerModelParams.hideUploadIdCardBack = this.newServicerModel.idCardBack.length !== 0
            },
            // 新增服务人员页面上传健康证正面成功后为upload添加隐藏类
            newServicerChangeHealthFront(){
                this.newServicerModelParams.hideUploadHealthFront = this.newServicerModel.healthFront.length !== 0
            },
            // 新增服务人员页面上传健康证反面成功后为upload添加隐藏类
            newServicerChangeHealthBack(){
                this.newServicerModelParams.hideUploadHealthBack = this.newServicerModel.healthBack.length !== 0
            },
            // 编辑服务人员页面上传身份证国徽面成功后为upload添加隐藏类
            editServicerChangeIdCardFront(){
                this.editServicerModelParams.hideUploadIdCardFront = this.editServicerModel.idCardFront.length !== 0
            },
            // 编辑服务人员页面上传身份证国徽面成功后为upload添加隐藏类 头像
            editServicerChangeHeadpic(){

                this.editServicerModelParams.hideUploadIdHeadpic = this.editServicerModel.headpic.length !== 0
            },
            // 编辑服务人员页面上传身份证国徽面成功后为upload添加隐藏类
            editServicerChangeIdCardBack(){
                this.editServicerModelParams.hideUploadIdCardBack = this.editServicerModel.idCardBack.length !== 0
            },
            // 编辑服务人员页面上传健康证正面成功后为upload添加隐藏类
            editServicerChangeHealthFront(){
                this.editServicerModelParams.hideUploadHealthFront = this.editServicerModel.healthFront.length !== 0
            },
            // 编辑服务人员页面上传健康证反面成功后为upload添加隐藏类
            editServicerChangeHealthBack(){
                this.editServicerModelParams.hideUploadHealthBack = this.editServicerModel.healthBack.length !== 0
            },
            handleClick(){
            },
            handleSizeChange(val){
                this.pagination.pageSize = val;
                this.getTableInfo()
            },
            handleCurrentChange(val){
              this.pagination.currentPage = val
              this.getTableInfo()
            },
            // 获取表格内容
            getTableInfo(){
                if(this.inputSelectedData.servicerMobile && !/^1[3456789]\d{9}$/.test(this.inputSelectedData.servicerMobile)){
                    this.$message.error('手机号码格式不正确');
                    return false;
                }
                if(this.inputSelectedData.idCard && !/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.inputSelectedData.idCard)){
                    this.$message.error('身份证号格式错误');
                    return false;
                }
                // 获取服务人员
                this.$post('/sharePlatform-person/personnel/queryPersonnel',{
                    currentPage: this.pagination.currentPage,
                    pageSize: this.pagination.pageSize,
                    idCardNum:this.inputSelectedData.idCard,
                    mobile:this.inputSelectedData.servicerMobile,
                    userName:this.inputSelectedData.servicerName,
                    companyId:sessionStorage.getItem('orgId')
                }).then(res =>{
                    this.tableData = res.data.list
                    this.pagination.totalRecord = res.data.total

                })
            },
            // 获取工种
            getWorkType(){
                this.$post('/sharePlatform-person/workTypeAll/queryWorkTypeAll',{
                }).then(res => {
                    this.newServicerModelWorkType = res.data
                })
            },
            // 重置筛选内容
            resetQueryParams(){
                for(let i in this.inputSelectedData){
                    if(this.inputSelectedData.hasOwnProperty(i)){
                        this.inputSelectedData[i] = ''
                    }

                }
            },
            // 重置分页
            resetPagination(){
                this.pagination.currentPage = 1;
                this.pagination.pageSize = 10;
            },
            // 检查父页面搜索组件手机号
            checkMobile(){
                if(this.inputSelectedData.servicerMobile === '0'){
                    this.inputSelectedData.servicerMobile = ''
                }
                this.inputSelectedData.servicerMobile = this.inputSelectedData.servicerMobile.replace(/\D/g,'')
            },
            // 检查父页面搜索组件身份证号
            checkIdCardNum(){
                if(this.inputSelectedData.idCard === '0'){
                    this.inputSelectedData.idCard = ''
                }
                this.inputSelectedData.idCard = this.inputSelectedData.idCard.replace(/\D/g,'')

            },
            // 打开新增服务人员模态框
            openAddServicerModel(){
                this.newServicerModel.dialogVisible = true;
            },
            // 关闭新增服务人员模态框
            newServicerModelClose(){
                this.newServicerModel.dialogVisible = false;
            },
            // 关闭新增服务人员模态框后的回调
            newServicerModelClosed(){
                const m = this.newServicerModelParams
                m.name = ''
                m.idCard = ''
                m.workType = []
                m.workCity = ''
                m.workCityLabel = []
                m.mobile = ''
                m.bornCity = []
                m.bornCityLabel = []
                m.homeAddress = ''
                m.workYear = ''
                m.introduction = ''
                m.hideUploadIdCardFront = false
                m.hideUploadIdCardBack = false
                m.hideUploadHealthFront = false
                m.hideUploadHealthBack = false
                m.hideUploadIdHeadpic = false

                const n = this.newServicerModel
                n.idCardFront = []
                n.idCardBack = []
                n.healthFront = []
                n.healthBack = []
                n.headpic = []
                n.checkIdCardButtonText = '验证';
                n.hasIdCardChecked = false;
                n.checkButtonState = false;
                this.newServicerModelParams.saveButtonLoading = false
            },
            // 关闭详情服务人员模态框
            detailsServicerModelClose(){
                this.detailsServicerModel.dialogVisible = false;
            },
            // 关闭详情服务人员模态框后的回调
            detailsServicerModelClosed(){
                const m = this.detailsServicerModelParams
                m.name = '';
                m.idCard = '';
                m.workType = [];
                m.workCity = '';
                m.workCityLabel = [];
                m.mobile = '';
                m.bornCity = [];
                m.bornCityLabel = [];
                m.homeAddress = '';
                m.workYear = '';
                m.introduction = '';
                m.hideUploadIdCardFront = false;
                m.hideUploadIdCardBack = false;
                m.hideUploadHealthFront = false;
                m.hideUploadHealthBack = false;
                m.hideUploadIdHeadpic = false;

                const n = this.detailsServicerModel
                n.idCardFront = []
                n.idCardBack = []
                n.healthFront = []
                n.healthBack = []
                n.headpic = []
            },
            // 每次选择工作城市后，显示用户选择的标签文字
            detailsServicerWorkCityChange(){
                this.detailsServicerModelParams.workCityLabel = this.$refs['detailsServicerWorkCityPicker'].getCheckedNodes()[0].pathLabels
            },
            // 每次选择籍贯城市后，显示用户选择的标签文字
            detailsServicerBornCityChange(){
                this.detailsServicerModelParams.bornCityLabel = this.$refs['detailsServicerBornCityPicker'].getCheckedNodes()[0].pathLabels

            },
            detailsServicerUploadOnSuccessIdCardFront(res,file,fileList){
                this.detailsServicerModel.idCardFront = fileList
            },
            detailsServicerUploadOnSuccessHeadpic(res,file,fileList){
                this.detailsServicerModel.headpic = fileList
            },
            detailsServicerUploadOnSuccessIdCardBack(res,file,fileList){
                this.detailsServicerModel.idCardBack = fileList
            },
            detailsServicerUploadOnSuccessHealthFront(res,file,fileList){
                this.detailsServicerModel.healthFront = fileList
            },
            detailsServicerUploadOnSuccessHealthBack(res,file,fileList){
                this.detailsServicerModel.healthBack = fileList
            },

            detailsServicerRemoveIdCardFront(file,fileList){
                this.detailsServicerModel.idCardFront = fileList
                this.detailsServicerModelParams.hideUploadIdCardFront = this.detailsServicerModel.idCardFront.length !== 0
            },

            detailsServicerRemoveHeadpic(file,fileList){
                this.detailsServicerModel.headpic = fileList
                this.detailsServicerModelParams.hideUploadIdHeadpic = this.detailsServicerModel.headpic.length !== 0
            },

            detailsServicerRemoveIdCardBack(file,fileList){
                this.detailsServicerModel.idCardBack = fileList
            },
            detailsServicerRemoveHealthFront(file,fileList){
                this.detailsServicerModel.healthFront = fileList
            },
            detailsServicerRemoveHealthBack(file,fileList) {
                this.detailsServicerModel.healthBack = fileList
            },

            // 每次选择工作城市后，显示用户选择的标签文字
            newServicerWorkCityChange(){
                this.newServicerModelParams.workCityLabel = this.$refs['newServicerWorkCityPicker'].getCheckedNodes()[0].pathLabels
            },
            // 每次选择籍贯城市后，显示用户选择的标签文字
            newServicerBornCityChange(){
                this.newServicerModelParams.bornCityLabel = this.$refs['newServicerBornCityPicker'].getCheckedNodes()[0].pathLabels

            },
            // 新增页面上传身份证国徽面成功后回调
            newServicerUploadOnSuccessIdCardFront(res,file,fileList){
                this.newServicerModel.idCardFront = fileList
            },
            // 新增页面上传身份证国徽面成功后回调
            newServicerUploadOnSuccessHeadpic(res,file,fileList){
                this.newServicerModel.headpic = fileList
            },
            // 新增页面
            newServicerUploadOnSuccessIdCardBack(res,file,fileList){
                this.newServicerModel.idCardBack = fileList
            },
            newServicerUploadOnSuccessHealthFront(res,file,fileList){
                this.newServicerModel.healthFront = fileList
            },
            newServicerUploadOnSuccessHealthBack(res,file,fileList){
                this.newServicerModel.healthBack = fileList
            },
            // 新增页面删除头像回调
            newServicerRemoveHeadpic(file,fileList){
                this.newServicerModel.headpic = fileList
                this.newServicerModelParams.hideUploadHeadpic = this.newServicerModel.headpic.length !== 0
            },
            // 新增页面删除身份证国徽面回调
            newServicerRemoveIdCardFront(file,fileList){
                this.newServicerModel.idCardFront = fileList
                this.newServicerModelParams.hideUploadIdCardFront = this.newServicerModel.idCardFront.length !== 0
            },
            // 新增页面删除身份证背面回调
            newServicerRemoveIdCardBack(file,fileList){
                this.newServicerModel.idCardBack = fileList
                this.newServicerModelParams.hideUploadIdCardBack = this.newServicerModel.idCardBack.length !== 0
            },
            // 新增页面删除健康证正面回调
            newServicerRemoveHealthFront(file,fileList){
                this.newServicerModel.healthFront = fileList
                this.newServicerModelParams.hideUploadHealthFront = this.newServicerModel.healthFront.length !== 0
            },
            // 新增页面删除健康证背面回调
            newServicerRemoveHealthBack(file,fileList){
                this.newServicerModel.healthBack = fileList
                this.newServicerModelParams.hideUploadHealthBack = this.newServicerModel.healthBack.length !== 0
            },
            // 新增页面上传超过指定数量
            newServicerModelUploadOverflow(){
                this.$message({
                    message: '当前只能上传一张,您需要删除前一张才可以继续上传。',
                    type: 'warning'
                });
                return false;
            },
            // 打开编辑服务人员模态框
            openEditServicerModel(personnelId){
                let self = this;
                this.editServicerModel.dialogVisible = true;
                this.editServicerModelParams.personalId = personnelId
                this.$post('/sharePlatform-person/personnel/loadPersonnel',{
                    personnelId:personnelId
                }).then(res => {

                    self.editServicerModelParams.name = res.data.userName;
                    self.editServicerModelParams.idCard = res.data.idCardNum;
                    self.editServicerModelParams.workType = res.data.workerId.split(',').map(function (value) {
                        return Number(value)
                    });
                    self.editServicerModelParams.workCity = [
                        res.data.serviceCity.substr(0,6),
                        res.data.serviceCity
                    ]
                    self.editServicerModelParams.mobile = res.data.mobile
                    self.editServicerModelParams.bornCity = [
                        res.data.userArea.substr(0,6),
                        res.data.userArea.substr(0,9),
                        res.data.userArea
                    ]
                    self.editServicerModelParams.homeAddress  =  res.data.address
                    self.editServicerModelParams.workYear = res.data.workingLife < 0 ? '':res.data.workingLife
                    self.editServicerModelParams.introduction = res.data.introduction

                    let headPic = res.data.headPic
                    self.editServicerModel.headpic = [
                        {
                            name:'1',
                            url:headPic,
                            response:{
                                reUrl:[headPic]
                            }
                        }
                    ]

                    let listPic = res.data.listPic
                    for(let i in listPic){
                        switch (listPic[i].type) {
                            case 2:
                                self.editServicerModel.idCardFront =
                                    [
                                        {
                                            name:listPic[i].filename,
                                            url:listPic[i].url,
                                            response:{
                                                reUrl:[listPic[i].url]
                                            }
                                        }
                                    ]
                                break;
                            case 1:
                                self.editServicerModel.idCardBack =
                                    [
                                        {
                                            name:listPic[i].filename,
                                            url:listPic[i].url,
                                            response:{
                                                reUrl:[listPic[i].url]
                                            }
                                        }
                                    ]
                                break;
                            case 3:
                                self.editServicerModel.healthFront =
                                    [
                                        {
                                            name:listPic[i].filename,
                                            url:listPic[i].url,
                                            response:{
                                                reUrl:[listPic[i].url]
                                            }
                                        }
                                    ]
                                break;
                            case 4:
                                self.editServicerModel.healthBack =
                                    [
                                        {
                                            name:listPic[i].filename,
                                            url:listPic[i].url,
                                            response:{
                                                reUrl:[listPic[i].url]
                                            }
                                        }
                                    ]
                                break;
                            default:
                                break;

                        }
                    }
                    self.editServicerChangeIdCardFront()
                    self.editServicerChangeIdCardBack()
                    self.editServicerChangeHealthFront()
                    self.editServicerChangeHealthBack()
                    self.editServicerChangeHeadpic()

                    self.editServicerWorkCityChange()
                    self.editServicerBornCityChange()
                    localStorage.setItem('deleteTypeId',res.data.workerId)
                })
            },
            // 编辑页面关闭服务人员模态框
            editServicerModelClose(){
                this.editServicerModel.dialogVisible = false;
            },
            // 编辑页面关闭服务人员模态框后的回调
            editServicerModelClosed(){
                const m = this.editServicerModelParams
                m.name = ''
                m.idCard = ''
                m.workType = []
                m.workCity = ''
                m.workCityLabel = []
                m.mobile = ''
                m.bornCity = []
                m.bornCityLabel = []
                m.homeAddress = ''
                m.workYear = ''
                m.introduction = ''
                m.hideUploadIdCardFront = false
                m.hideUploadIdCardBack = false
                m.hideUploadHealthFront = false
                m.hideUploadHealthBack = false
                m.hideUploadIdHeadpic = false

                const n = this.editServicerModel
                n.idCardFront = []
                n.idCardBack = []
                n.healthFront = []
                n.healthBack = []
                n.headpic = []
            },
            // 编辑页面每次选择工作城市后，显示用户选择的标签文字
            editServicerWorkCityChange(){
                if(this.$refs['editServicerWorkCityPicker'].getCheckedNodes()[0]){
                    this.editServicerModelParams.workCityLabel = this.$refs['editServicerWorkCityPicker'].getCheckedNodes()[0].pathLabels

                }
            },
            // 编辑页面每次选择籍贯城市后，显示用户选择的标签文字
            editServicerBornCityChange(){
                if(this.$refs['editServicerBornCityPicker'].getCheckedNodes()[0]){
                    this.editServicerModelParams.bornCityLabel = this.$refs['editServicerBornCityPicker'].getCheckedNodes()[0].pathLabels

                }
            },
            // 编辑页面上传身份证国徽面成功后回调
            editServicerUploadOnSuccessIdCardFront(res,file,fileList){

                this.editServicerModel.idCardFront = fileList
            },
            // 编辑页面上传头像成功后回调
            editServicerUploadOnSuccessHeadpic(res,file,fileList){
                this.editServicerModel.headpic = fileList
            },
            // 编辑页面上传身份证背面成功后回调
            editServicerUploadOnSuccessIdCardBack(res,file,fileList){
                this.editServicerModel.idCardBack = fileList
            },
            // 编辑页面上传健康证正面成功后回调
            editServicerUploadOnSuccessHealthFront(res,file,fileList){
                this.editServicerModel.healthFront = fileList
            },
            // 编辑页面上传健康证背面成功后回调
            editServicerUploadOnSuccessHealthBack(res,file,fileList){
                this.editServicerModel.healthBack = fileList
            },
            // 编辑页面删除头像回调
            editServicerRemoveHeadpic(file,fileList){
                this.editServicerModel.headpic = fileList
                this.editServicerModelParams.hideUploadIdHeadpic = this.editServicerModel.headpic.length !== 0
            },
            // 编辑页面删除身份证国徽面回调
            editServicerRemoveIdCardFront(file,fileList){
                this.editServicerModel.idCardFront = fileList
                this.editServicerModelParams.hideUploadIdCardFront = this.editServicerModel.idCardFront.length !== 0
            },
            // 编辑页面删除身份证背面回调
            editServicerRemoveIdCardBack(file,fileList){
                this.editServicerModel.idCardBack = fileList
                this.editServicerModelParams.hideUploadIdCardBack = this.editServicerModel.idCardBack.length !== 0
            },
            // 编辑页面删除健康证正面回调
            editServicerRemoveHealthFront(file,fileList){
                this.editServicerModel.healthFront = fileList
                this.editServicerModelParams.hideUploadHealthFront = this.editServicerModel.healthFront.length !== 0
            },
            // 编辑页面删除健康证背面回调
            editServicerRemoveHealthBack(file,fileList){
                this.editServicerModel.healthBack = fileList
                this.editServicerModelParams.hideUploadHealthBack = this.editServicerModel.hnpmealthBack.length !== 0
            },
            // 编辑页面上传超过指定数量提示
            editServicerModelUploadOverflow(){
                this.$message({
                    message: '当前只能上传一张,您需要删除前一张才可以继续上传。',
                    type: 'warning'
                });
                return false;
            },
            // 打开详情服务人员模态框
            openDetailsServicerModel(personnelId){
                let self = this;
                this.detailsServicerModel.dialogVisible = true;
                this.$post('/sharePlatform-person/personnel/loadPersonnel',{
                    personnelId:personnelId
                })
                    .then(res => {
                    self.detailsServicerModelParams.name = res.data.userName;
                    self.detailsServicerModelParams.idCard = res.data.idCardNum;
                    self.detailsServicerModelParams.workType = res.data.workerId.split(',').map(function (value) {
                        return Number(value)
                    });
                    self.detailsServicerModelParams.workCity = [
                        res.data.serviceCity.substr(0,6),
                        res.data.serviceCity
                    ]
                    self.detailsServicerModelParams.mobile = res.data.mobile
                    self.detailsServicerModelParams.bornCity = [
                        res.data.userArea.substr(0,6),
                        res.data.userArea.substr(0,9),
                        res.data.userArea
                    ]
                    self.detailsServicerModelParams.homeAddress  =  res.data.address
                    self.detailsServicerModelParams.workYear = res.data.workingLife < 0 ? '':res.data.workingLife
                    self.detailsServicerModelParams.introduction = res.data.introduction

                    let headPic = res.data.headPic
                    self.detailsServicerModel.headpic = [
                        {
                            name:'1',
                            url:headPic,
                            response:{
                                reUrl:[headPic]
                            }
                        }
                    ]

                    let listPic = res.data.listPic
                    for(let i in listPic){
                        switch (listPic[i].type) {
                            case 2:
                                self.detailsServicerModel.idCardFront =
                                    [
                                        {
                                            name:listPic[i].filename,
                                            url:listPic[i].url,
                                            response:{
                                                reUrl:[listPic[i].url]
                                            }
                                        }
                                    ]
                                break;
                            case 1:
                                self.detailsServicerModel.idCardBack =
                                    [
                                        {
                                            name:listPic[i].filename,
                                            url:listPic[i].url,
                                            response:{
                                                reUrl:[listPic[i].url]
                                            }
                                        }
                                    ]
                                break;
                            case 3:
                                self.detailsServicerModel.healthFront =
                                    [
                                        {
                                            name:listPic[i].filename,
                                            url:listPic[i].url,
                                            response:{
                                                reUrl:[listPic[i].url]
                                            }
                                        }
                                    ]
                                break;
                            case 4:
                                self.detailsServicerModel.healthBack =
                                    [
                                        {
                                            name:listPic[i].filename,
                                            url:listPic[i].url,
                                            response:{
                                                reUrl:[listPic[i].url]
                                            }
                                        }
                                    ]
                                break;
                            default:
                                break;

                        }
                    }
                    self.detailsServicerChangeIdCardFront()
                    self.detailsServicerChangeIdCardBack()
                    self.detailsServicerChangeHealthFront()
                    self.detailsServicerChangeHealthBack()
                    self.detailsServicerChangeHeadpic()


                })
            },
            // 详情页面上传超过指定数量提示 无用待删
            detailsServicerModelUploadOverflow(){
                this.$message({
                    message: '当前只能上传一张,您需要删除前一张才可以继续上传。',
                    type: 'warning'
                });
                return false;
            },
            // 上传图片前检查图片文件格式
            checkImg(file){
                if(['.png','.jpg','.bmp'].indexOf(file.name.substr(file.name.lastIndexOf('.'))) === -1){
                    this.$message({
                        showClose: true,
                        message: '只能上传图片类型文件',
                        type: 'warning'
                    });
                    return false;
                }
            },
            // 新增服务人员
            async newSerivicer(){
                let self = this;
                self.newServicerModelParams.saveButtonLoading = true
                if(!self.newServicerModelParams.name){
                    self.$message({
                        showClose: true,
                        message: '请填写姓名',
                        type: 'warning'
                    });
                    self.newServicerModelParams.saveButtonLoading = false
                    return false;
                }
                if(!self.newServicerModelParams.idCard){
                    self.$message({
                        showClose: true,
                        message: '请填写身份证号',
                        type: 'warning'
                    });
                    self.newServicerModelParams.saveButtonLoading = false
                    return false;
                }
                if(self.newServicerModel.checkIdCardButtonText === '验证' && self.newServicerModel.hasIdCardChecked === false){
                    self.$message({
                        showClose: true,
                        message: '请先验证身份证号',
                        type: 'warning'
                    });
                    self.newServicerModelParams.saveButtonLoading = false
                    return false;
                }
                if(self.newServicerModelParams.workCity === ''){
                    self.$message({
                        showClose: true,
                        message: '请选择工作城市',
                        type: 'warning'
                    });
                    self.newServicerModelParams.saveButtonLoading = false
                    return false;
                }
                if(!self.newServicerModelParams.workType.join()){
                    self.$message({
                        showClose: true,
                        message: '请选择工种',
                        type: 'warning'
                    });
                    self.newServicerModelParams.saveButtonLoading = false
                    return false;
                }
                if(!self.newServicerModelParams.mobile){
                    self.$message({
                        showClose: true,
                        message: '请填写手机号',
                        type: 'warning'
                    });
                    self.newServicerModelParams.saveButtonLoading = false
                    return false;
                }
                if(self.newServicerModelParams.mobile && !/^1[3456789]\d{9}$/.test(self.newServicerModelParams.mobile)){
                    self.$message({
                        showClose: true,
                        message: '手机号码格式不正确',
                        type: 'warning'
                    });
                    self.newServicerModelParams.saveButtonLoading = false;
                    return false;
                }
                if(self.newServicerModelParams.bornCity.length === 0){
                    self.$message({
                        showClose: true,
                        message: '请选择籍贯',
                        type: 'warning'
                    });
                    self.newServicerModelParams.saveButtonLoading = false
                    return false;
                }

                // 识别身份证国徽面
               let OcrValueFront =  await new Promise(resolve => {
                   if(self.newServicerModel.idCardFront.length === 0){
                       resolve(true)
                   }else{
                       self.$post('http://erp.95081.com/public-service/ocr/idCardOCR',{
                           imgURL:self.newServicerModel.idCardFront[0].response.reUrl[0]
                       })
                           .then(res => {
                               if(res.status === 0){
                                   let _result = JSON.parse(res.data).result
                                   if(_result.issue){
                                       self.$message({
                                           showClose: true,
                                           message: '身份证识国徽面识别成功',
                                           type: 'success'
                                       });
                                       resolve(true)
                                   }else{
                                       self.$message({
                                           showClose: true,
                                           message: '身份证国徽面识别遇到未知错误' ,
                                           type: 'error'
                                       });
                                       self.newServicerModelParams.saveButtonLoading = false
                                       resolve(false)
                                   }
                               }else{
                                   self.$message({
                                       showClose: true,
                                       message: '身份证识国徽面识别错误，原因:' +  res.msg,
                                       type: 'warning'
                                   });
                                   self.newServicerModelParams.saveButtonLoading = false
                                   resolve(false)
                               }
                           })
                           .catch(() => {
                               self.$message({
                                   showClose: true,
                                   message: '请求超时，请稍后再试' ,
                                   type: 'error'
                               });

                               self.newServicerModelParams.saveButtonLoading = false
                               resolve(false)
                           })

                   }

                });

                // 识别身份证背面
                let OcrValueBack =  await new Promise(resolve => {
                    if(self.newServicerModel.idCardBack.length === 0){
                        resolve(true)
                    }else{
                        self.$post('http://erp.95081.com/public-service/ocr/idCardOCR',{
                            imgURL:self.newServicerModel.idCardBack[0].response.reUrl[0]
                        })
                            .then(res => {
                                if(res.status === 0){
                                    let _result = JSON.parse(res.data).result
                                    if(_result.number){
                                        if(_result.number.toString() !== self.newServicerModelParams.idCard.toString()){
                                            self.$message({
                                                showClose: true,
                                                message: '您上传的身份证人像面与您填写的身份证号不匹配',
                                                type: 'error'
                                            });

                                            self.newServicerModelParams.saveButtonLoading = false
                                            resolve(false)
                                        }else{
                                            self.$message({
                                                showClose: true,
                                                message: '身份证识人像面识别成功',
                                                type: 'success'
                                            });
                                            resolve(true)
                                        }

                                    }else{
                                        self.$message({
                                            showClose: true,
                                            message: '身份证人像面识别遇到未知错误' ,
                                            type: 'error'
                                        });
                                        self.newServicerModelParams.saveButtonLoading = false
                                        resolve(false)
                                    }
                                }else{
                                    self.$message({
                                        showClose: true,
                                        message: '身份证识人像面识别错误，原因:' + res.msg,
                                        type: 'warning'
                                    });
                                    self.newServicerModelParams.saveButtonLoading = false
                                    resolve(false)
                                }
                            })
                            .catch(() => {
                                self.$message({
                                    showClose: true,
                                    message: '请求超时，请稍后再试' ,
                                    type: 'error'
                                });

                                self.newServicerModelParams.saveButtonLoading = false
                                resolve(false)
                            })
                    }

                });

                if(!OcrValueFront || !OcrValueBack){
                    self.$message({
                        showClose: true,
                        message: '身份证照片核验有误，请您核对已填写的身份证号和已上传的身份证两面是否正确' ,
                        type: 'error'
                    });
                    self.newServicerModel.idCardBack = []
                    self.newServicerModel.idCardFront = []
                    self.newServicerChangeIdCardFront()
                    self.newServicerChangeIdCardBack()
                    self.newServicerModelParams.saveButtonLoading = false
                    return  false;
                }

                await self.$post('/sharePlatform-person/personnel/insertPersonnel',{
                    userName: self.newServicerModelParams.name,
                    mobile:self.newServicerModelParams.mobile,
                    idCardNum:self.newServicerModelParams.idCard,
                    workerId:self.newServicerModelParams.workType.join(),
                    userProvince:self.newServicerModelParams.bornCity[0],
                    userCity:self.newServicerModelParams.bornCity[1],
                    userArea:self.newServicerModelParams.bornCity[2],
                    address:self.newServicerModelParams.homeAddress,
                    introduction:self.newServicerModelParams.introduction,
                    serviceCity:self.newServicerModelParams.workCity[1],
                    workingLife:self.newServicerModelParams.workYear,
                    picStr:JSON.stringify(self.c_newServicerImgs),
                    companyId:sessionStorage.getItem('orgId'),
                    headPic:self.newServicerModel.headpic.length > 0 ?self.newServicerModel.headpic[0].response.reUrl[0]:''
                }).then(res => {
                    if(res.code === 'I1-00-9999'){
                        self.newServicerModelParams.saveButtonLoading = false
                        self.newServicerModel.dialogVisible = false;
                        self.$message({
                            showClose: true,
                            message: '新增服务人员成功',
                            type: 'success'
                        });
                        self.getTableInfo()
                    }else{
                        self.newServicerModelParams.saveButtonLoading = false
                        self.$message({
                            showClose: true,
                            message: '新增服务人员失败，原因：' + res.msg,
                            type: 'error'
                        });
                    }

                })
                    .catch(() => {
                        self.newServicerModelParams.saveButtonLoading = false
                        self.$message({
                            showClose: true,
                            message: '请求超时，请稍后再试',
                            type: 'error'
                        });
                    })
            },
            // 编辑服务人员
            async editServicer(){

                let self = this
                self.newServicerModelParams.saveButtonLoading = true


                if(!self.editServicerModelParams.workType.join()){
                    self.$message({
                        showClose: true,
                        message: '请选择工种',
                        type: 'warning'
                    });
                    self.newServicerModelParams.saveButtonLoading = false
                    return false;
                }

                // 识别身份证国徽面
                let OcrValueFront =  await new Promise(resolve => {
                    if(self.editServicerModel.idCardFront.length === 0){
                        resolve(true)
                    }else{
                        self.$post('http://erp.95081.com/public-service/ocr/idCardOCR',{
                            imgURL:self.editServicerModel.idCardFront[0].response.reUrl[0]
                        })
                            .then(res => {
                                if(res.status === 0){
                                    let _result = JSON.parse(res.data).result
                                    if(_result.issue){
                                        self.$message({
                                            showClose: true,
                                            message: '身份证识国徽面识别成功',
                                            type: 'success'
                                        });
                                        resolve(true)
                                    }else{
                                        self.$message({
                                            showClose: true,
                                            message: '身份证国徽面识别遇到未知错误' ,
                                            type: 'error'
                                        });
                                        self.editServicerModelParams.saveButtonLoading = false
                                        resolve(false)
                                    }
                                }else{
                                    self.$message({
                                        showClose: true,
                                        message: '身份证识国徽面识别错误，原因:' +  res.msg,
                                        type: 'warning'
                                    });
                                    self.editServicerModelParams.saveButtonLoading = false
                                    resolve(false)
                                }
                            })
                            .catch(() => {
                                self.$message({
                                    showClose: true,
                                    message: '请求超时，请稍后再试' ,
                                    type: 'error'
                                });

                                self.editServicerModelParams.saveButtonLoading = false
                                resolve(false)
                            })
                    }

                });

                // 识别身份证背面
                let OcrValueBack =  await new Promise(resolve => {
                    if(self.editServicerModel.idCardBack.length === 0){
                        resolve(true)
                    }else{
                        self.$post('http://erp.95081.com/public-service/ocr/idCardOCR',{
                            imgURL:self.editServicerModel.idCardBack[0].response.reUrl[0]
                        })
                            .then(res => {
                                if(res.status === 0){
                                    let _result = JSON.parse(res.data).result
                                    if(_result.number){
                                        if(_result.number.toString() !== self.editServicerModelParams.idCard.toString()){
                                            self.$message({
                                                showClose: true,
                                                message: '您上传的身份证人像面与您填写的身份证号不匹配',
                                                type: 'error'
                                            });

                                            self.editServicerModelParams.saveButtonLoading = false
                                            resolve(false)
                                        }else{
                                            self.$message({
                                                showClose: true,
                                                message: '身份证识人像面识别成功',
                                                type: 'success'
                                            });
                                            resolve(true)
                                        }

                                    }else{
                                        self.$message({
                                            showClose: true,
                                            message: '身份证人像面识别遇到未知错误' ,
                                            type: 'error'
                                        });
                                        self.editServicerModelParams.saveButtonLoading = false
                                        resolve(false)
                                    }
                                }else{
                                    self.$message({
                                        showClose: true,
                                        message: '身份证识人像面识别错误，原因:' +  res.msg,
                                        type: 'warning'
                                    });
                                    self.editServicerModelParams.saveButtonLoading = false
                                    resolve(false)
                                }
                            })
                            .catch(() => {
                                self.$message({
                                    showClose: true,
                                    message: '请求超时，请稍后再试' ,
                                    type: 'error'
                                });

                                self.editServicerModelParams.saveButtonLoading = false
                                resolve(false)
                            })

                    }

                });

                if(!OcrValueFront || !OcrValueBack){
                    self.$message({
                        showClose: true,
                        message: '身份证照片核验有误，请您核对已填写的身份证号和已上传的身份证两面是否正确' ,
                        type: 'error'
                    });
                    self.editServicerModel.idCardBack = []
                    self.editServicerModel.idCardFront = []
                    self.editServicerChangeIdCardFront()
                    self.editServicerChangeIdCardBack()
                    self.editServicerModelParams.saveButtonLoading = false
                    return  false;
                }


                await self.$post('/sharePlatform-person/personnel/updatePersonnel',{
                    userName: self.editServicerModelParams.name,
                    mobile:self.editServicerModelParams.mobile,
                    idCardNum:self.editServicerModelParams.idCard,
                    workerId:self.editServicerModelParams.workType.join(),
                    deleteTypeId:localStorage.getItem('deleteTypeId'),
                    userProvince:self.editServicerModelParams.bornCity[0],
                    userCity:self.editServicerModelParams.bornCity[1],
                    userArea:self.editServicerModelParams.bornCity[2],
                    address:self.editServicerModelParams.homeAddress,
                    introduction:self.editServicerModelParams.introduction,
                    serviceCity:self.editServicerModelParams.workCity[1],
                    workingLife:self.editServicerModelParams.workYear,
                    picStr:JSON.stringify(self.c_editServicerImgs),
                    personnelId: self.editServicerModelParams.personalId,
                    headPic:self.editServicerModel.headpic.length > 0 ?self.editServicerModel.headpic[0].response.reUrl[0]:''

                }).then(res => {
                    if(res.code === 'I1-00-9999'){
                        self.$message({
                            showClose: true,
                            message: '修改成功',
                            type: 'success'
                        });
                        self.editServicerModel.dialogVisible = false;
                        self.getTableInfo()

                    }else{
                        self.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'error'
                        });
                    }
                })
                    .catch(() => {
                        self.$message({
                            showClose: true,
                            message: '请求超时，请稍后再试',
                            type: 'error'
                        });
                    })
            },

            newServicerVerifyIdCard(){
                let self = this;
                if(self.newServicerModel.checkIdCardButtonText === '通过' && self.newServicerModel.hasIdCardChecked === true){
                    self.$message({
                        showClose: true,
                        message: '您已通过验证，请不要重复验证。',
                        type: 'warning'
                    });
                    return false;
                }
                self.newServicerModel.checkButtonState = true
                self.$post('/sharePlatform-person/authen/idCardNum',{
                    userName: self.newServicerModelParams.name,
                    idCardNum:self.newServicerModelParams.idCard,
                })
                    .then(res => {
                        if(res.code === 'I1-00-9999'){
                            if(res.data.code === 1){
                                self.$message({
                                    showClose: true,
                                    message: '身份证信息核验成功',
                                    type: 'success'
                                });
                                self.newServicerModel.checkIdCardButtonText = '通过';
                                self.newServicerModel.hasIdCardChecked = true
                                self.newServicerModel.checkButtonState = false
                            }else{
                                self.$message({
                                    showClose: true,
                                    message: '身份证信息核验失败,原因:' + res.data.message,
                                    type: 'error'
                                });
                                self.newServicerModel.checkButtonState = false

                            }
                        }else{
                            self.$message({
                                showClose: true,
                                message: '请求超时，请稍后再试',
                                type: 'warning'
                            });
                            self.newServicerModel.checkButtonState = false
                        }
                    })
            },

        },

        computed:{
            c_newServicerImgs(){
                let obj = this.newServicerModel;
                let fileNameReg = /.png|.jpg|.gif|.jpeg|.bmp/ig
                return [
                    {
                        url:obj.idCardFront.length !== 0 ? obj.idCardFront[0].response.reUrl[0] : '',
                        suffix: obj.idCardFront.length !== 0 ? obj.idCardFront[0].response.reUrl[0].substr(obj.idCardFront[0].response.reUrl[0].lastIndexOf('.')).replace('.',''):'',
                        type:2,
                        filename: obj.idCardFront.length !== 0 ? obj.idCardFront[0].response.reUrl[0].substring(obj.idCardFront[0].response.reUrl[0].lastIndexOf('/')+1).replace(fileNameReg,''):''
                    },
                    {
                        url:obj.idCardBack.length !== 0 ? obj.idCardBack[0].response.reUrl[0] : '',
                        suffix: obj.idCardBack.length !== 0 ? obj.idCardBack[0].response.reUrl[0].substr(obj.idCardBack[0].response.reUrl[0].lastIndexOf('.')).replace('.',''):'',
                        type:1,
                        filename: obj.idCardBack.length !== 0 ? obj.idCardBack[0].response.reUrl[0].substring(obj.idCardBack[0].response.reUrl[0].lastIndexOf('/')+1).replace(fileNameReg,''):''
                    },{
                        url:obj.healthFront.length !== 0 ? obj.healthFront[0].response.reUrl[0] : '',
                        suffix: obj.healthFront.length !== 0 ? obj.healthFront[0].response.reUrl[0].substr(obj.healthFront[0].response.reUrl[0].lastIndexOf('.')).replace('.',''):'',
                        type:3,
                        filename: obj.healthFront.length !== 0 ? obj.healthFront[0].response.reUrl[0].substring(obj.healthFront[0].response.reUrl[0].lastIndexOf('/')+1).replace(fileNameReg,''):''
                    },
                    {
                        url:obj.healthBack.length !== 0 ? obj.healthBack[0].response.reUrl[0] : '',
                        suffix: obj.healthBack.length !== 0 ? obj.healthBack[0].response.reUrl[0].substr(obj.healthBack[0].response.reUrl[0].lastIndexOf('.')).replace('.',''):'',
                        type:4,
                        filename: obj.healthBack.length !== 0 ? obj.healthBack[0].response.reUrl[0].substring(obj.healthBack[0].response.reUrl[0].lastIndexOf('/')+1).replace(fileNameReg,''):''
                    }

                ]

            },
            c_editServicerImgs(){
                let obj = this.editServicerModel;
                let fileNameReg = /.png|.jpg|.gif|.jpeg|.bmp/ig
                return [
                    {
                        url:obj.idCardFront.length !== 0 ? obj.idCardFront[0].response.reUrl[0] : '',
                        suffix: obj.idCardFront.length !== 0 ? obj.idCardFront[0].response.reUrl[0].substr(obj.idCardFront[0].response.reUrl[0].lastIndexOf('.')).replace('.',''):'',
                        type:2,
                        filename: obj.idCardFront.length !== 0 ? obj.idCardFront[0].response.reUrl[0].substring(obj.idCardFront[0].response.reUrl[0].lastIndexOf('/')+1).replace(fileNameReg,''):''
                    },
                    {
                        url:obj.idCardBack.length !== 0 ? obj.idCardBack[0].response.reUrl[0] : '',
                        suffix: obj.idCardBack.length !== 0 ? obj.idCardBack[0].response.reUrl[0].substr(obj.idCardBack[0].response.reUrl[0].lastIndexOf('.')).replace('.',''):'',
                        type:1,
                        filename: obj.idCardBack.length !== 0 ? obj.idCardBack[0].response.reUrl[0].substring(obj.idCardBack[0].response.reUrl[0].lastIndexOf('/')+1).replace(fileNameReg,''):''
                    },{
                        url:obj.healthFront.length !== 0 ? obj.healthFront[0].response.reUrl[0] : '',
                        suffix: obj.healthFront.length !== 0 ? obj.healthFront[0].response.reUrl[0].substr(obj.healthFront[0].response.reUrl[0].lastIndexOf('.')).replace('.',''):'',
                        type:3,
                        filename: obj.healthFront.length !== 0 ? obj.healthFront[0].response.reUrl[0].substring(obj.healthFront[0].response.reUrl[0].lastIndexOf('/')+1).replace(fileNameReg,''):''
                    },
                    {
                        url:obj.healthBack.length !== 0 ? obj.healthBack[0].response.reUrl[0] : '',
                        suffix: obj.healthBack.length !== 0 ? obj.healthBack[0].response.reUrl[0].substr(obj.healthBack[0].response.reUrl[0].lastIndexOf('.')).replace('.',''):'',
                        type:4,
                        filename: obj.healthBack.length !== 0 ? obj.healthBack[0].response.reUrl[0].substring(obj.healthBack[0].response.reUrl[0].lastIndexOf('/')+1).replace(fileNameReg,''):''
                    }

                ]

            }
        },
        mounted() {
            this.getTableInfo();
            this.getWorkType()
        },

    }
</script>

<style scoped lang="scss">
.u-work_type{
    display: flex;
    div{
        margin-left: 10px;
    }
}
    .g-query_wrap {
        text-align: left;
        display: flex;
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

    .g-new_servicer_model {
        .m-item {
            display: flex;
            line-height: 40px;
            width: 600px;
            margin-bottom: 15px;
            position: relative;

            .u-verify_idcard {
                margin-left: 10px;
            }
            .u-work_type {
                text-align: left;
            }
            span.title {
                width: 100px;
                min-width: 100px;
                text-align: left;
            }

            i.f-must {
                color: #f00;
            }

            i.f-default {
                visibility: hidden;
            }

            .m-input {
                flex: 1;
            }

            .u-bottom_text {
                position: absolute;
                bottom: -30px;
                left: 130px;
            }

            .avatar-uploader {
                margin-right: 10px;
            }

        }

        p.u-city_notice {
            text-align: left;
            padding-left: 100px;
            color: #999;
            margin-bottom: 15px;
        }
    }
</style>