<template>
	<!-- 加载用户须知 -->
	<view class="userAgreem">
		<!-- header -->
		<commonHeader headerTitl="新手指南" xingHide=true lingHide=true fenxiangHide=true></commonHeader>
		<view v-html="htmlText" class="content">
			
		</view>
	</view>
</template>

<script>
	import { getNewUserInfo } from '@/common/apis.js'
	
	import commonHeader from"@/components/common-header/common-header";
	export default {
		data() {
			return {
				htmlText: ''
			};
		},
		components:{
			commonHeader
		},
		mounted () {
			this.getInitData()
		},
		methods: {
			async getInitData () {
				const res = await getNewUserInfo()
				this.htmlText = res.returnMsg.SYSSET_VALUE
			}
		}
	}
</script>

<style lang="less">
	.userAgreem{
		height: 100%;
		padding-top: 120rpx;
		.content{
			padding: 20rpx;
		}
	}
</style>
