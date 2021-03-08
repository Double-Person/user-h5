<template>
	<view class="preferencesPage">
		<!-- header -->
		<commonHeader headerTitl="我的订单" xingHide=true lingHide=true></commonHeader>
		<!-- 宣传图片 -->
		<view class="preferencesPage-img">
			<image src="../../static/images/youhui.png" mode=""></image>
		</view>
		<!-- 热门推荐 -->
		<view class="preferencesPage-hot">
			<view class="preferencesPage-hot-title">
				<text class="iconfont icon-dian"></text>热门推荐
			</view>
			<view @click="goShop(item.shopId)" class="preferencesPage-hot-item" v-for="item in hotList" :key="item.shopId">
				<view class="left">
					<image :src="item.img" mode=""></image>
				</view>
				<view class="right">
					<text class="right-title">{{item.name}}</text>
					<view class="right-text">
						{{item.details}}
					</view>
					<view class="right-score">
						<!-- 不可点击状态 -->
						<uni-rate disabled="true" :value="item.score" active-color="#FF5D06" size="18"></uni-rate>
						<text>{{item.score}}分</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import share from '@/mixin/share.js'
	import commonHeader from"@/components/common-header/common-header";
	// 评分组件
	import uniRate from '@/components/uni-rate/uni-rate.vue';
	import {shops} from '@/common/apis.js';
	export default {
		data() {
			return {
				hotList:[],
                USERINFO_ID:''
			}
		},
		
		mixins: [share],
		onLoad() {
			this.otherPage();
		},
		
		methods: {
            // 前往商家
			goShop(shopId){
                uni.navigateTo({
                   url:'../shopPage/shopPage?shopId='+ shopId
                })
            }
		},
		components:{
			commonHeader,
			uniRate
		},
		mounted() {
            uni.getStorage({
                key:'USERINFO_ID',
                success:res => this.USERINFO_ID = res.data
            })
			shops({USERINFO_ID: this.USERINFO_ID}).then(res=>{
				if (res.returnMsg.status == '00') {
					this.hotList = res.returnMsg.shop;
				}
			}).catch(err=>{
				uni.showToast({
					title:'数据请求失败！',
					icon:'none'
				})
			})
		}
	}
</script>

<style lang="less">
	.preferencesPage{
		padding-top: 90rpx;
		height: 100%;
		color: #333;
		.preferencesPage-img{
			height: 100%;
			width: 100%;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.preferencesPage-hot{
			background: #AB5B18;
			.preferencesPage-hot-title{
				padding: 30rpx;
				color: #fff;
				font-size: 32rpx;
				display: flex;
				align-items: center;
				text{font-size: 45rpx;}
			}
			.preferencesPage-hot-item{
				display: flex;
				border-radius: 20rpx;
				height: 180rpx;
				width: 90%;
				background: #fff;
				margin: auto;
				margin-bottom: 20rpx;
				padding: 20rpx;
				.left{
					width: 213rpx;
					height: 181rpx;
					border-radius: 20rpx;
					image{width: 100%;height: 100%;}
				}
				.right{
					flex: 1;
					margin-left: 20rpx;
					.right-title{
						font-size: 30rpx;
						font-weight: bold;
					}
					.right-text{
						font-size: 24rpx;
						color: #666;
						width: 277rpx;
					}
					.right-score{
						margin-top: 20rpx;
						display: flex;
						align-items: center;
						font-size: 24rpx;
						color: #FF5A2C;
						text{
							margin-top: -10rpx;
							margin-left: 10rpx;
						}
					}
				}
			}
			.preferencesPage-hot-item:last-child{
				margin-bottom: 0;
			}
		}
	}
</style>
