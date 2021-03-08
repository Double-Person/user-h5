<template>
	<view class="oraderDetails">
		<!-- header -->
		<commonHeader headerTitl="订单详情" xingHide=true lingHide=true></commonHeader>
		<!-- 内容开始 -->
		<view class="oraderDetails-content">
			<view class="oraderDetails-content-message">
				<view class="left">
					<text class="iconfont icon-dingwei"></text>
				</view>
				<view class="right">
					<view class="right-title">
						<view>
							{{orderData.NAME}}
						</view>
						<text>{{orderData.phone}}</text>
					</view>
					<view class="right-address">
						{{orderData.address}}
					</view>
				</view>
			</view>
			<view class="oraderDetails-content-content" v-for="(item,index) in goodsList" :key="index">
				<view class="left">
					<image v-if="item.goodsImg && item.goodsImg.length" :src="imgBaseUrl + item.goodsImg[0].IMG" mode=""></image>
					<view>
						<text class="left-title">
							{{item.goodsName}}
						</text>
						<view class="left-date">
							下单时间：{{orderData.createtime}}
						</view>
						<view class="left-price">
							单价：￥{{item.price}}
						</view>
					</view>
				</view>
				<view class="right">
					X{{item.count}}
				</view>
			</view>
			<view class="oraderDetails-content-total">
				<view>
					共计{{computedLength(goodsList)}}件商品
					<text>合计 ￥<text>{{computedLTotal(goodsList)}}</text></text>
				</view>
			</view>
			<view class="oraderDetails-content-cause">
				<view>
					退款原因:
				</view>
				<textarea value="" v-model="cause" style="text-indent: 30rpx;background: #f7f7f7;marginTop: 30rpx;width: 650rpx;height: 171rpx;borderRadius: 20rpx;paddingTop:20rpx;" placeholder="请输入退款原因"  placeholder-style="color:#999"/>
			</view>
			<view class="oraderDetails-content-code">
				订单编号：<text>{{orderData.orderSummaryId}}</text>
			</view>
			<view class="oraderDetails-content-pay">
				付款方式：<text>{{orderData.payType== 0 &&'微信' || orderData.payType==1&&'支付宝' || orderData.payType==3&&'银行卡' || orderData.payType==2&&'余额支付'}}</text>
			</view>
			<view class="oraderDetails-content-shop">
				联系商家：<text @click="callPhone(orderData.shopPhone)">{{orderData.shopPhone}}</text>
			</view>
			<view class="oraderDetails-content-btn">
				<text @click="backPay(orderData.orderSummaryId)">退款</text>
			</view>
		</view>
		<!-- 内容结束 -->
		<!-- tabbar -->
		<tabbar></tabbar>
	</view>
</template>

<script>
	import share from '@/mixin/share.js'
	// header
	import commonHeader from "@/components/common-header/common-header";
	// tabbar 
	import tabbar from "@/components/common-tabbar/common-tabbar";
    import {queryOrder,godaddy, imgBaseUrl} from "@/common/apis.js"
	export default {
		data() {
			return {
				imgBaseUrl: imgBaseUrl,
				orderData:{},
                goodsList:[],
         
                cause:''
			};
		},
		components:{
			commonHeader
			,tabbar
		},
		mixins: [share],
	
        methods:{
			computedLength (list) {
				
				if(list.length === 0) {
					return 0
				}
				let sum = 0;
				for (let item of list) {
					sum += item.count*1
				}
			
				return sum
			},
			computedLTotal (list) {
				if(list.length === 0) {
					return 0
				}
				let sum = 0;
				for (let item of list) {
					sum += item.count* item.price
				}
				return sum
			},
			// 拨打电话
			callPhone(phoneNumber) {
				uni.makePhoneCall({
					phoneNumber
				});
			},
            // 申请退款
            backPay(orderId){
                if(!this.cause) {
                    uni.showToast({
                        title:"请输入退款原因！",
                        icon:'none'
                    })
                    return false
                }
                godaddy({ORDERSUMMARY_ID:orderId,refund:this.cause}).then(res => {
                    console.log(res)
                    if(res.returnMsg.status == '00'){
                      uni.showToast({
                          title:"申请退款成功！",
                          duration:2000
                      })
                      setTimeout(()=>{
                          uni.navigateTo({
                              url:'../myOrder/myOrder'
                          })
                      },2000)
                    }else if(res.returnMsg.status == '01'){
                        uni.showToast({
                            title:"订单不存在！",
                            icon:'none',
                            duration:2000
                        })
                    }else if(res.returnMsg.status == '02'){
                        uni.showToast({
                            title:"您已收货成功，无法退款！",
                            icon:'none',
                            duration:2000
                        })
                    }else if(res.returnMsg.status == '03'){
                        uni.showToast({
                            title:"订单还未支付哟！",
                            icon:'none',
                            duration:2000
                        })
                    }
                })
            }
        },
        onLoad(e) {
			this.otherPage();
           queryOrder({ORDERSUMMARY_ID:e.orderID}).then(res => {

			   this.orderData = res.returnMsg.order
			   this.goodsList = res.returnMsg.orderGoods
           }) 
        }
	}
</script>

<style lang="less">
	.oraderDetails{
		min-height: 100%;
		background: #f6f7f8;
		padding: 120rpx 0;
		/* #ifdef APP-PLUS */
		padding-top: 160rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-top: 160rpx;
		/* #endif */
		.oraderDetails-content{
			width: 90%;
			margin: auto;
			padding: 0 20rpx;
			background: #fff;
			border-radius: 20rpx;
			font-size: 30rpx;
			color: #333;
			.oraderDetails-content-message{
				display: flex;
				padding: 20rpx 0;
				align-items: center;
				border-bottom: 1px solid #e0e0e0;
				.left{
					width:66rpx;
					height:66rpx;
					background:linear-gradient(143deg,rgba(255,119,43,1) 0%,rgba(255,91,52,1) 100%);
					display: flex;
					align-items: center;
					justify-content: center;
					color: #fff;
					border-radius: 50%;
					margin-right: 20rpx;
					text{
						font-size: 40rpx;
					}
				}
				.right{
					flex: 1;
					.right-title{
						display: flex;
						justify-content: space-between;
						view{
							font-size: 32rpx;
							font-weight: bold;
						}
						text{color: #666;}
					}
					.right-address{
						margin-top: 20rpx;
						line-height:42rpx;
					}
				}
			}
			.oraderDetails-content-content{
				display: flex;
				padding: 30rpx 0;
				justify-content: space-between;
				.left{
					display: flex;
					image{
						width: 180rpx;
						height: 152rpx;
						border-radius: 20rpx;
						margin-right: 20rpx;
					}
					>view{
						.left-title{
							font-size: 32rpx;
						}
						view{
							font-size: 28rpx;
							color: #666;
							margin-top: 10rpx;
						}
					}
				}
				.right{
					font-size: 28rpx;
					color: #666;
				}
			}
			.oraderDetails-content-total{
				display: flex;
				justify-content: flex-end;
				padding: 20rpx 0;
				view{
					>text{margin-left: 40rpx;
						color: #666;
					text{color: #FF5904;}}
				}
			}
			.oraderDetails-content-cause{
				padding: 30rpx 0;
			}
			.oraderDetails-content-code,.oraderDetails-content-pay,.oraderDetails-content-shop{
				padding: 20rpx 0;
				text{
					margin-left: 30rpx;
					color: #666;
				}
			}
			.oraderDetails-content-shop{
				text{color: #0E88FF;}
			}
			.oraderDetails-content-btn{
				display: flex;
				justify-content: flex-end;
				padding: 30rpx 0;
				text{
					padding: 10rpx 40rpx;
					border: 1px solid #999;
					color: #999;
					font-size: 24rpx;
					border-radius: 40rpx;
				}
			}
		}
	}
</style>
