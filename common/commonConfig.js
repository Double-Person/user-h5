
// 查看详情地址导航到店铺
// export const KEY = '363f73cc6d1cd03f815332fc5ed430e9';
export const KEY = '89a84c49cfc4d87d88fa77be5ecee145';
// export const KEY = '148fb247ef74f3818a6ffb4a7ec7f40b';

// 地址转换为经纬度
// export const CONVERSION_KEY = '60ca6302ddbfc1545c05fed7e8fff834';
export const CONVERSION_KEY = '89a84c49cfc4d87d88fa77be5ecee145';

// 首页Key
// export const INDEX_KEY = 'f0d8604522a34fea7af419d353f98e8f';
// export const INDEX_KEY = '148fb247ef74f3818a6ffb4a7ec7f40b';
export const INDEX_KEY = '1fd0191b0e9bd8c444dba98677e737ef';





let urls = 'https://qfl.qfl168.cn/qflhadmin/#';

export const COMMON_URL = 'https://qfl.qfl168.cn/qufl';
// export const COMMON_URL = 'http://192.168.0.110:8081';

// 微信公众号appid
export const APPID = 'wxcd3e4c058be3dd03';



export const REDIRECT_URI = urls + '/pages/login/login';

export const REDIRECT_URI_COMMON = urls;

// 分享文件配置
export const SHARE_CONFIG = {
	href: "https://qfl.qfl168.cn/qflhadmin",
	// href: `https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI4NjExNTQyOA==&scene=123&uin=&key=&devicetype=Windows+10+x64&version=63010043&lang=zh_CN&a8scene=1&fontgear=2`,
	
	title: "趣分利",
	summary: "我正在使用趣分利，赶紧跟我一起来体验！",
	imageUrl: require('@/static/images/logo.png'),
	miniProgram: {
		id: 'wx9a062afb3e6ff487',
		path: '/pages/index/index',
		webUrl: "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI0ODY3NzQ3MQ==&scene=124#wechat_redirect",//'http://uniapp.dcloud.io'
	},
	link: 'https://qfl.qfl168.cn/static/#/pages/news/news',  // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致  h5分享 
}