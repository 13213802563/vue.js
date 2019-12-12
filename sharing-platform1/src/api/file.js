import axios2 from "axios";

var ajax = {
    postFile: function (file) {
        let formData = new FormData();
        formData.append('type', 'ORIGINAL');
        formData.append('files', file);
        let _url = '/img_service/ul/uploadImg.action';
        return new Promise((resolve, reject) => {
            axios2.post(_url, formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            }).then(function (res) {
                resolve(res.data)
            }).catch(function (err) {
                reject(err)
            })
        })
    }
};
export default ajax;
