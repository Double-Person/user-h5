// 引入封装的request   用户端
// import request from './request.js';
import request from './ajax.js';
import { COMMON_URL } from './commonConfig.js'

export const baseUrl = COMMON_URL;
export const imgBaseUrl = COMMON_URL + '/'




// 1.公众号签名   完成
export const autograph = params => request.post('/api/ordersummary/official/sign', params);
// 2.账号密码登录   完成
export const login = data => request.post('/api/ordersummary/login/account', data);
// 3.微信登陆    完成
export const wxLogin = params => request.post('/api/ordersummary/wx/login', params);

// 获取openid接口：/api/user/wxwebLogin   参数：code
export const wxwebLogin = params => request.post('/api/user/wxwebLogin', params);


//  绑定手机
export const wxTel = data => request.post('/api/ordersummary/wx/tel', data);
// 4.手机验证码发送    完成
export const sendCode = params => request.post('/api/ordersummary/mobile', params);
// 5.支付宝支付  
export const alipay = params => request.post('/api/ordersummary/ali/pay', params);
// 6.微信支付
export const wxpay = params => request.post('/api/ordersummary/wx/pay', params);
// 余额支付
export const yepay = params => request.post('/api/ordersummary/balancelog/pay', params);
// 7.账号注册   完成
export const register = params => request.post('/api/ordersummary/register', params);
// 8.根据用户位置推送最近商家   待测试
export const pushShop = params => request.post('/api/ordersummary/push/newvendor', params);
// 9.商品详情  待测试
export const shopDetails = params => request.post('/api/ordersummary/shop/id', params);
// 10.订单结算	待测试
export const orderPay = params => request.post('/api/ordersummary/pay', params);
// 11.我的订单   待测试
export const myOrder = params => request.post('/api/ordersummary/myOrder', params);
// 12.设置密码、编辑头像用户名、手机号变更
export const setPassword = params => request.post('/api/ordersummary/userinfo/edit', params);
// 13.忘记密码  完成
export const forgetPwd = params => request.post('/api/ordersummary/forget', params);
// 14.推荐商家列表
export const shops = params => request.post('/api/ordersummary/vendor/push', params);
// 15.根据商家ID查询商家热销和优惠
export const shopList = params => request.post('/api/ordersummary/vendor/shop', params);
// 16.我的消费金
export const myConsume = params => request.post('/api/ordersummary/me/consumption', params);
// 17.我的星币
export const myPentacle = params => request.post('/api/ordersummary/starcoinslog/list', params);
// 18.我的余额
export const myBalance = params => request.post('/api/ordersummary/balancelog/list', params);
// 19.获取个人资料
export const personalData = params => request.post('/api/ordersummary/me/data', params);
// 20.删除评价
export const delEvaluate = params => request.post('/api/ordersummary/evaluate/delete', params);
// 21.添加评价
export const addEvaluate = params => request.post('/api/ordersummary/evaluate/add', params);
// 22.我的评价列表
export const evaluateList = params => request.post('/api/ordersummary/evaluate', params);
// 23.个人中心
export const personal = params => request.post('/api/ordersummary/me', params);
// 24.购物车列表
export const cartList = params => request.post('/api/ordersummary/me/carts', params);
// 25.查询收货列表
export const getAddress = params => request.post('/api/ordersummary/me/address', params);
// 26.新增收货地址
export const addAddress = params => request.post('/api/ordersummary/address/add', params);
// 27.我的卡券
export const myCard = params => request.post('/api/ordersummary/me/coupons', params);
// 28.实名认证
export const Authentication = params => request.post('/api/ordersummary/authorize', params);
// 29.会员等级兑换星币规则
export const level = params => request.post('/api/ordersummary/level', params);
// 30.星币兑换
export const starcoinslog = params => request.post('/api/ordersummary/starcoinslog', params);
// 31.手机号更换
export const changePhone = params => request.post('/api/ordersummary/mobile/modify', params);
// 32.收藏店铺列表
export const collections = params => request.post('/api/ordersummary/me/collections', params);
// 33.修改交易密码
export const transaction = params => request.post('/api/ordersummary/transaction/modify', params);
// 34.忘记交易密码
export const passwordback = params => request.post('/api/ordersummary/retrieve', params);
// 35.取消收藏
export const delCollec = params => request.post('/api/ordersummary/collections/delete', params);


//  32 绑定银行
export const addShopBank = params => request.get('/api/merchant/addShopBank', {params});
// 36.绑定支付宝
export const bandApliy = params => request.post('/api/ordersummary/ali/account', params);
// 37.绑定微信
export const bandWX = params => request.post('/api/ordersummary/wx/account', params);
// 38.解绑微信
export const unbindWX = params => request.post('/api/ordersummary/wx/unbind', params);
// 39.解绑支付宝
export const unbindApliy = params => request.post('/api/ordersummary/ali/unbind', params);


// 获取银行卡信息  参数 /api/merchant/backCardInfo
export const backCardInfo = params => request.get('/api/merchant/backCardInfo', {
	params
})

// 33 绑定收款微信账号
export const wxAccount = params => request.post('/api/ordersummary/wx/account', params)
// 34 绑定收款支付宝账号
export const aliAccount = params => request.post('/api/ordersummary/ali/account', params)
// 35 判断是否绑定银行卡
export const shopBank = params => request.get('/api/merchant/shopBank', {params});
// 36 解绑银行卡
export const updeteShopBank = params => request.get('/api/merchant/updeteShopBank', {params});



// 40.首页商品分类
export const getItem = params => request.post('/api/ordersummary/shop/category', params);
// 41.根据商家名或者商品名搜索
export const search = params => request.post('/api/ordersummary/search', params);
// 42.确认收货
export const submitOrder = params => request.post('/api/ordersummary/order/take', params);
// 43.根据订单ID查询订单详情
export const queryOrder = params => request.post('/api/ordersummary/order/id', params);

// 44.申请退款
export const godaddy = params => request.post('/api/ordersummary/me/refund', params);

// 订单退款(不同意)
export const orderAffirm = params => request.post('/api/ordersummary/order/affirm', params);



// 45.删除收货地址
export const delAddress = params => request.post('/api/ordersummary/address/delete', params);
// 46.修改收货地址
export const editAddress = params => request.post('/api/ordersummary/address/edit', params);
// 47.设置默认地址
export const setDeAdress = params => request.post('/api/ordersummary/address/default', params);
// 48.收藏店铺
export const collectionShop = params => request.post('/api/ordersummary/collections/add', params);
// 49.查询商家是否存在
export const getShopPay = params => request.post('/api/ordersummary/shop/check', params);
// 50.根据分类查询banner图
export const getBanner = params => request.get('/api/ordersummary/banner', { params });
// 51.本地优惠
export const getPush = params => request.post('/api/ordersummary/vendor/push', params);
// 52.微信公众号支付
export const miniPay = params => request.post('/api/ordersummary/pay/mini', params);

export const paymini = params => request.post('/api/ordersummary/offlinetrading/paymini', params);



// 53.支付宝提现
export const transfer = params => request.post('/api/ordersummary/ali/transfer', params);
// 54.关于我们
export const getAboutInfo = params => request.post('/api/user/sysSet/aboutUs', params);
// 55.新手指南
export const getNewUserInfo = params => request.post('/api/user/sysSet/newbieGuide', params)
// 56 查看更多
export const getMoreShopInfo = params => request.post('/api/user/shop/viewMore', params)
// 57 添加购物车
export const setCarts = parmas => request.post('/api/user/carts/addCarts', params)
// 58 消息列表接口
export const getMessage = params => request.post('/api/user/message/myMessage', params)
// 58 消息详情
export const getMessageDetail = params => request.post('/api/user/message/messageDetail', params)
// 59 消息已读
export const getMessageActive = params => request.post('/api/user/message/readMessage', params)



// 60 商家入驻
export const shopAuth = params => request.post('/api/merchant/shopAuth', params)
// 分类列表
export const categoryList = params => request.post('/api/ordersummary/list', params)



// 获取首页分类（综合商家等）
export const homePage = () => request.get('/api/ordersummary/homePage')

// 获取首页活动详情
export const shopActivityGoods = params => request.get('/api/ordersummary/shopActivityGoods', { params })

// 余额支付
export const shopBygoodList = params => request.get('/api/ordersummary/balance/pay', { params })

//  删除购物车
export const deletecarts = params => request.post('/api/ordersummary/me/deletecarts', params)


// 提现接口     
export const withdrawal = params => request.get('/api/merchant/withdrawal', {
	params
})
// 提现记录接口   参数 userinfo_id ==========
export const withdrawalInfo = params => request.get('/api/merchant/withdrawalInfo', {
	params
})




//  37 添加到购物车
export const addCarts = params => request.post('/api/user/carts/addCarts', params);
// 判断是否有交易密码
export const pwdInfo = params => request.get('/api/ordersummary/pwdInfo', {params});




//  修改用户头像，用户名
export const editInfo = params => request.post('/api/ordersummary/editInfo', params);
// 撤销退款
export const orderRepeal = params => request.post('/api/ordersummary/order/repeal', params);

export const uploadImag = params => request.post('/api/ordersummary/upload/imag', params);

// 扫码 订单结算
export const offlinetradingService = params => request.post('/api/ordersummary/offlinetradingService', params);

// 扫码 支付
export const offlinetradingServicePay = params => request.post('/api/ordersummary/offlinetradingService/pay', params);
// 微信提现
/**
 * money 金额  types  0用户、1商家   id 用户或商家的id   openid  
 */
export const wxtx = params => request.post('/api/tx/wxtx', params);

/** 支付宝提现
 * money 提现金额
* types 提现类型 0用户、1商家
* id  用户或商家的id 
* zfb 
* name 名字
 */
export const alitx = params => request.post('/api/tx/ali/pay', params);

// 删除待付款订单
export const orderDelete = params => request.post('/api/ordersummary/order/delete', params);
// 线下支付
export const userlist = params => request.post('/api/merchant/offlinetrading/userlist', params);





// * CITY  市
// * AREA  区
export const area = params => request.post('/api/ordersummary/activity/area', params);

// ACTIVITY_ID  
export const findById = params => request.post('/api/ordersummary/activity/findById', params);


export const evaluateSelect = params => request.post('/api/ordersummary/evaluate/select', params);






// export const upload = (data) => {
// 	const token = uni.getStorageSync('token')
// 	uni.request({
// 		url: 'https://yflh.hkzhtech.com/qufl/uploads/',
// 		data: data,
// 		header: {
// 			'Authorization': 'Bearer ' + token,
// 			"Content-Type": "application/x-www-form-urlencoded"
// 		}

// 	})
// }
