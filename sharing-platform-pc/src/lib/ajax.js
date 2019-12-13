import qs from 'qs'
import axios from 'axios'

const ajax = {
    post: function (url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify(data,{arrayFormat: 'repeat'}),{
                headers:{
                    'platform':'sharePlatform-pc',
                    'jzpt-token':sessionStorage.getItem('token')? sessionStorage.getItem('token'):'',
                }
            }).then(function (res) {
                resolve(res.data)
            }).catch(function (err) {
                reject(err)
            })
        })
    },
    postwc: function (url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, data,{
                headers:{
                    'platform':'sharePlatform-pc',
                    'jzpt-token':sessionStorage.getItem('token')? sessionStorage.getItem('token'):'',
                    'Content-Type':'application/json'
                }
            }).then(function (res) {
                resolve(res.data)
            }).catch(function (err) {
                reject(err)
            })
        })
    },
    get: function (url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.get(url, {params: qs.stringify(data)}).then(function (res) {
                resolve(res.data)
            }).catch(function (err) {
                reject(err)
            })
        })
    },
    postNoToken:function (url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify(data,{arrayFormat: 'repeat'}),{
                headers:{
                    'platform':'sharePlatform-pc',
                    'jzpt-token':''
                }
            }).then(function (res) {
                resolve(res.data)
            }).catch(function (err) {
                reject(err)
            })
        })
    },
    // postFile: function (file,url) {
    //     let formData = new FormData();
    //     formData.append('multipartFile', file);
    //     let _url = url;
    //     return new Promise((resolve, reject) => {
    //         axios.post(_url, formData, {
    //             headers: {'Content-Type': 'multipart/form-data'}
    //         }).then(function (res) {
    //             resolve(res.data)
    //         }).catch(function (err) {
    //             reject(err)
    //         })
    //     })
    // }
    postFile: function (url, file,orgid) {
        return new Promise((resolve, reject) => {
            let formData = new FormData();
            formData.append('multipartFile', file);
            if(orgid){
                formData.append('companyId',orgid)
            }
            axios.post(url, formData,{
                headers:{
                    'platform':'sharePlatform-pc',
                    'jzpt-token':sessionStorage.getItem('token')? sessionStorage.getItem('token'):'',
                    'Content-Type': 'multipart/form-data'
                }
            }).then(function (res) {
                resolve(res.data)
            }).catch(function (err) {
                reject(err)
            })
        })
    }
};
export default ajax;
