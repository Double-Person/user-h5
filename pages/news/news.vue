<template>
	<view class="news">
		<commonHeader @finish="getVal" :headerTitl="headerTitl" xingHide=true lingHide=true></commonHeader>
		<!-- tab切换 -->
		<view class="news-title">
			<text :class="active?'active':''" @tap="setType(true)">平台公告</text>
			<text :class="active?'':'active'" @tap="setType(false)">客服通知</text>
		</view>
		<!-- 平台公告 -->
		<view class="news-gonggao new-common" :class="active?'':'hide'">
			<view class="news-gonggao-msg" v-for="item in guanggaoData" :key="item.MESSAGE_ID" @tap="goNotice(item.MESSAGE_ID, item.USERMESSAGE_ID)">
				<view class="news-gonggao-msg-left">
					<view class="logo">
						<text class="iconfont icon-yinlianglabashengyin"></text>
					</view>	
				</view>
				<view class="news-gonggao-msg-right">
					<view class="fl-between-center">
						<text>{{item.TITLE}}</text>
						<text>{{item.PUBLISHTIME}}</text>
					</view>
					<view class="fl-between-center">
						<text  class="content" :style="{color: item.COUNTENT.includes('img') ? 'red' : ''}">
							{{showMsg(item.COUNTENT)}}
						</text>
						<text class="num-ball" v-if="item.TYPES == 0">1</text>
					</view>
					
				
					
					
				</view>
			</view>
		</view>
		<!-- 客服通知 -->
		<view class="news-tongzhi new-common" :class="active?'hide':''">
			<view class="news-gonggao-msg" v-for="item in kefuData" :key="item.id" @tap="goNotice(item.MESSAGE_ID, item.USERMESSAGE_ID)">
				<view class="news-gonggao-msg-left">
					<view class="logo">
						<text class="iconfont icon-kefu"></text>
					</view>
					
				</view>
				<view class="news-gonggao-msg-right">
					<view class="fl-between-center">
						<text>{{item.TITLE}}</text>
						<text>{{item.PUBLISHTIME}}</text>
					</view>
					<view class="fl-between-center">
						<text  class="content" :style="{color: item.COUNTENT.includes('img') ? 'red' : ''}">
							{{showMsg(item.COUNTENT)}}
						</text>
						<text class="num-ball" v-if="item.TYPES == 0">1</text>
					</view>
		
				</view>
			</view>
		</view>
		<!-- tabbar -->
		<tabbar active="2"></tabbar>
	</view>
</template>

<script>
	import share from '@/mixin/share.js'
	// 引入tabbar
	import tabbar from "@/components/common-tabbar/common-tabbar";
	// 引入公用头部
	import commonHeader from "@/components/common-header/common-header";
	import {
		getMessage
	} from '@/common/apis.js'
	export default {
		data() {
			return {
				headerTitl: "消息",
				active: true,
				guanggaoData: [],

				kefuData: []

			};
		},
		mixins: [share],
		onLoad() {
			this.otherPage();
		},
		components: {
			commonHeader,
			tabbar
		},
		onShow() {
			this.getNewsList()
		},

		methods: {
			setType(type) {
				this.active = type
				this.getNewsList()
			},
			async getNewsList() {
				const {
					returnMsg
				} = await getMessage({
					USERINFO_ID: uni.getStorageSync('USERINFO_ID'),
					MESSAGETYPE: this.active ? 1 : 2
				})
				this[this.active ? 'guanggaoData' : 'kefuData'] = returnMsg
				this.kefuData = []; // 暂时不要客服通知数据
			},
			getVal(e) {
				console.log(e)
			},
			showMsg(str) {
				if (str.includes('img')) return '[图片]';
				else {
					let msg = str.replace(/\<\/p\>/g, "");
					let res = msg.replace(/\<p\>/g, "");
					return res
				}
			},
			// 查看公告详情
			goNotice(id, USERMESSAGE_ID) {
				uni.navigateTo({
					url: '../notice/notice?id=' + id + '&USERMESSAGE_ID=' + USERMESSAGE_ID
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.fl-between-center{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.content{
		width: 380rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.news {
		font-family: PingFangSC-Regular, PingFang SC;
		color: #333333;
		min-height: 100%;
		background: #f7f7f7;
		padding-bottom: 100rpx;

		.news-title {
			display: flex;
			justify-content: space-around;
			font-size: 32rpx;
			border-bottom: 1px solid #ccc;
			background: #fff;

			position: fixed;
			width: 100%;
			z-index: 99999;
			top: 90rpx;
			/* #ifdef APP-PLUS */
			top: 130rpx;
			/* #endif */
			/* #ifdef MP-WEIXIN */
			top: 130rpx;
			/* #endif */

			text {
				padding: 30rpx 0;
			}

			.active {
				font-weight: bold;
				border-bottom: 10rpx solid #FF5904;
			}
		}

		// 显示隐藏
		.hide {
			display: none;
		}

		// 通用模板（平台公告）
		.new-common {
			margin-top: 200rpx;
			/* #ifdef APP-PLUS */
			margin-top: 220rpx;
			/* #endif */
			/* #ifdef MP-WEIXIN */
			margin-top: 220rpx;
			/* #endif */
			padding-left: 30rpx;
			border-top: 20rpx solid #f8f6f9;
			background: #fff;

			.news-gonggao-msg {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 30rpx 30rpx 30rpx 0;
				border-bottom: 1px solid #ccc;

				.news-gonggao-msg-left {
					flex: 1;

					.logo {
						width: 90rpx;
						height: 90rpx;
						background: linear-gradient(100deg, rgba(75, 196, 250, 1) 0%, rgba(57, 169, 251, 1) 100%);
						color: #fff;
						border-radius: 50%;
						display: flex;
						justify-content: center;
						align-items: center;

						.iconfont {
							font-size: 50rpx;
						}
					}

				}

				.news-gonggao-msg-right {
					margin-top: -20rpx;
					flex: 5;
					.num-ball {
						width: 45rpx;
						height: 45rpx;
						background: #FF4B00;
						color: #fff;
						border-radius: 50%;
						line-height: 45rpx;
						text-align: center;
						font-size: 26rpx;
						margin-left: 30rpx;
						margin-top: 20rpx;
					}
					
					
					// .text {
					// 	margin-left: 30rpx;
					
					// 	text {
					// 		font-size: 30rpx;
					// 		font-weight: 550;
					// 		color: #9F3F01;
					// 	}
					
					// 	view {
					// 		color: #999;
					// 		font-size: 28rpx;
					// 		margin-top: 10rpx;
					// 	}
					// }

					text {
						color: #999;
						font-size: 28rpx;
						display: inline-block;
					}

					

				}
			}
		}

		// 客服通知
		.news-tongzhi {
			.news-gonggao-msg {
				.news-gonggao-msg-left {
					.logo {
						background: linear-gradient(100deg, rgba(250, 144, 75, 1) 0%, rgba(255, 109, 51, 1) 100%);

						.iconfont {
							font-size: 80rpx;
						}
					}

					.text {
						text {
							color: #333;
						}
					}
				}
			}
		}
	}
</style>
