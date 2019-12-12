import connection from "./connect";

//查询订单详情
export const getOrderinfo = (data) => {
    return connection.post(`/sharePlatform-order/Order/queryOrderDetailById`, data, {
        'Content-Type': 'application/json'
    })
}

//查询订单分页
export const getOrderlist = (data) => {
    return connection.post(`/sharePlatform-order/Order/queryOrderList`, data, {
        'Content-Type': 'application/json'
    })

    // return connection.post(`/sharePlatform-order/OrderConsume/queryOrderList`, data, {
    //     'Content-Type': 'application/json'
    // })
}

// 查询工种类型
export const getOrderType = (data) => {
    return connection.post(`/sharePlatform-person/workTypeAll/queryWorkTypeAll`, data, {
        'Content-Type': 'application/json'
    })
}

//新增订单
export const addOrder = (data) => {
    return connection.post(`/sharePlatform-order/Order/insertOrderAndDetail`, data, {
        'Content-Type': 'application/json'
    })
}

//更新订单
export const updateOrder = (data) => {
    return connection.post(`/sharePlatform-order/Order/updateOrderAndDetail`, data, {
        'Content-Type': 'application/json'
    })
}

//移入公海
export const moveToBroadOcean = (data) => {
    return connection.post(`/sharePlatform-order/Order/moveToBroadOcean`, data, {
        'Content-Type': 'application/json'
    })
}

//公海
//查询订单
export const getSeaList = (data) => {
    return connection.post(`/sharePlatform-pool/orderPool/listOrderPool`, data, {
        'Content-Type': 'application/json'
    })
}

//从订单池捞取订单(别人)
export const getOrderFromPool = (data) => {
    return connection.post(`/sharePlatform-pool/orderPool/getOrderFromPool`, data, {
        'Content-Type': 'application/json'
    })

    // return connection.post(`/sharePlatform-pool/orderConsumePool/getOrderFromPool`, data, {
    //     'Content-Type': 'application/json'
    // })
}


//从订单池收回订单(自己)
export const retrieveOrderFromPool = (data) => {
    return connection.post(`/sharePlatform-pool/orderPool/retrieveOrderFromPool`, data, {
        'Content-Type': 'application/json'
    })
}

export const queryOrderInterviewList = (data) => {
    return connection.post(`/sharePlatform-order/Order/queryOrderInterviewList`, data, {
        'Content-Type': 'application/json'
    })
}

// 客户
// 客户列表
export const queryCustomer = (data) => {
    return connection.post(`/sharePlatform-customer/customer/queryCustomer`, data, {
        'Content-Type': 'application/json'
    })
}

// 客户详情
export const queryIdCustomer = (data) => {
    return connection.post(`/sharePlatform-customer/customer/loadCustomer`, data, {
        'Content-Type': 'application/json'
    })
}

// 新增客户
export const insertCustomer = (data) => {
    return connection.post(`/sharePlatform-customer/customer/insertCustomer`, data, {
        'Content-Type': 'application/json'
    })
}

// 修改客户
export const updateCustomer = (data) => {
    return connection.post(`/sharePlatform-customer/customer/updateCustomer`, data, {
        'Content-Type': 'application/json'
    })
}

// 查询城市
export const queryCity = (data) => {
    return connection.post(`/sharePlatform-customer/customer/queryCity`, data, {
        'Content-Type': 'application/json'
    })
}

// 服务人员公海池
//查询列表
export const getlistPersonPool = (data) => {
    return connection.post(`/sharePlatform-personPool/empPersonnel/listPersonPool`, data, {
        'Content-Type': 'application/json'
    })
}

//服务人员订单里收回
export const moveFromBroadOcean = (data) => {
    return connection.post(`/sharePlatform-personPool/empPersonnel/moveFromBroadOcean`, data, {
        'Content-Type': 'application/json'
    })
}

//服务人员移入公海
export const moveToBroadOceanService = (data) => {
    return connection.post(`/sharePlatform-personPool/empPersonnel/moveToBroadOcean`, data, {
        'Content-Type': 'application/json'
    })
}

//服务人员公海池收回
export const retrievePersonFromPool = (data) => {
    return connection.post(`/sharePlatform-personPool/empPersonnel/retrievePersonFromPool`, data, {
        'Content-Type': 'application/json'
    })
}

//公海池捞取服务人员
export const getPersonFromPool = (data) => {
    return connection.post(`/sharePlatform-personPool/empPersonnel/getPersonFromPool`, data, {
        'Content-Type': 'application/json'
    })
}

