module.exports = {
    publicPath: './',
    outputDir: 'sharing-platform',
    devServer: {
        proxy: 'http://t.erp.95081.com'
        // proxy: {
        //
        //     '/login': {
        //         target: "http://t.erp.95081.com",
        //         changOrigin:true,
        //         pathRewrite:{
        //             '^/login':'/'
        //         }
        //     },
        //     '/sea': {
        //         target: "http://192.168.10.143:9992",
        //         changOrigin:true,
        //         pathRewrite:{
        //             '^/sea':'/'
        //         }
        //     },
        //     '/order': {
        //         target: "http://192.168.10.143:9991",
        //         changOrigin:true,
        //         pathRewrite:{
        //             '^/order':'/'
        //         }
        //     },
        //     '/pay': {
        //         target: "http://192.168.10.143:9993",
        //         changOrigin:true,
        //         pathRewrite:{
        //             '^/pay':'/'
        //         }
        //     },
        //     '/customer': {
        //         target: "http://192.168.10.143:9990",
        //         changOrigin:true,
        //         pathRewrite:{
        //             '^/customer':'/'
        //         }
        //     },
        //     '/test': {
        //         target: "http://10.10.54.34:9991",
        //         changOrigin:true,
        //         pathRewrite:{
        //             '^/test':'/'
        //         }
        //     }
        // }
    }
}
