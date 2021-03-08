<template>
	<view class="notice">
		<!-- header -->
		<commonHeader headerTitl="公告" xingHide=true lingHide=true></commonHeader>
		
		<!-- 内容开始 -->
		<view class="notice-content">
			
			<view class="text">
				<view class="notice-title">
					{{info.TITLE}}
				</view>
				<view class="text-item" v-html="info.COUNTENT"></view>	
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
	// 引入tabbar
	import tabbar from "@/components/common-tabbar/common-tabbar";
	import { getMessageDetail, getMessageActive } from '@/common/apis.js'
	export default {
		data() {
			return {
				info: {}
			};
		},
		components:{
			commonHeader,
			tabbar
		},
		mixins: [share],
		
		onLoad(option) {
			let {id, USERMESSAGE_ID} = option
			this.getMessageInfo(id)
			this.readMsg(USERMESSAGE_ID)
			this.otherPage();
		},
		methods : {
			getMessageInfo(id) {
				getMessageDetail({MESSAGE_ID:id}).then(res=> {
					this.info = res.returnMsg
				})
			},
			readMsg(USERMESSAGE_ID) {
				getMessageActive({USERMESSAGE_ID})
			}
		}
	}
</script>

<style lang="less">
	.notice{
		background: #F7F7F7;
		height: 90%;
		padding-top: 130rpx;
		/* #ifdef APP-PLUS */
		padding-top: 170rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-top: 170rpx;
		/* #endif */
		font-size: 30rpx;
		color: #333;
		.notice-content{
			width: 85%;
			background: #fff;
			border-radius: 20rpx;
			margin: auto;
			height: 100%;
			padding: 20rpx;
			image{
				width: 100%;
				height: 269rpx;
			}
			.text{
				margin-top: 30rpx;
				.notice-title{
					text-align: center;
					font-size: 36rpx;
					font-weight: bold;
					margin-bottom: 50rpx;
				}
				.text-item{
					line-height: 1.5em;
					overflow-x: hidden;
				}
			}
		}
	}
</style>
