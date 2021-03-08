<template>
	<view class="mybalance">
		<!-- hader -->
		<commonHeader headerTitl="提现记录" xingHide=true></commonHeader>
		<view class="mybalance-date">
			<!-- 日期选择 -->
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-db">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="uni-input">{{date}}</view>
						</picker>
					</view>
				</view>
			</view>
			<text class="iconfont icon-zuishao"></text>
		</view>
	
		<view class="mybalance-content" v-if="listData.length>0">
			<view class="mybalance-content-item" v-for="item in listData" :key="item.id">
				<view class="content">
				
					<view class="right">
						<view class="top">
							<view class="name">
								<text>提现 （{{ item.ACCOUNT_TYPE == 1 ? '支付宝' : '微信' }}）</text>
								<view>
									{{item.CREATION_TIME}}
								</view>
							</view>
							<view class="price">
								-￥{{item.MONEY}}
							</view>
						</view>
						<view class="bottom">
							{{item.createTime}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else style="text-align: center;color: #999;padding-top: 150rpx;">暂时没有记录哦！</view>
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

	import {
		withdrawalInfo
	} from '@/common/apis.js';
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {

				listData: [],
				// 日期选择
				date: currentDate,
				timeStamp: ''
			}
		},
		
		mixins: [share],
		onLoad() {
			this.otherPage();
		},
		
		methods: {

			// 日期选择
			bindDateChange: function(e) {
				var arr = e.detail.value.split('-');
				this.date = `${arr[0]}年${arr[1]}月${arr[2]}日`;
				// this.timeStamp = new Date(`${arr[0]}-${arr[1]}-${arr[2]}`).getTime()
				this.timeStamp = `${arr[0]}-${arr[1]}-${arr[2]}`
				this.getData(this.timeStamp)
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				this.timeStamp = new Date(`${year}-${month}-${day}`).getTime()
				// return `${year}年${month}月${day}日`;
				return `${year}-${month}-${day}`;
			},
			getData(timeStamp) {
				uni.getStorage({
					key: 'USERINFO_ID',
					success: res => {

						var obj = {
							"userinfo_id": res.data,
							"time": timeStamp?timeStamp:'',
							TYPES: 0 // 0 用户 1 商家
						}
						withdrawalInfo(obj).then(res => {
							this.listData = res.returnMsg
						}).catch(err => {
							uni.showToast({
								title: '请求失败！',
								icon: 'none'
							})
						})
					}
				})
			}
		},
		components: {
			commonHeader,
			tabbar
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		mounted() {
			this.getData()
		}
	}
</script>

<style lang="less" scoped>
	.mybalance {
		color: #333;
		padding-top: 95rpx;
		padding-bottom: 150rpx;

		.mybalance-date {
			height: 100rpx;
			background: #f8f6f9;
			padding-left: 30rpx;
			line-height: 100rpx;
			font-size: 36rpx;
			display: flex;
			position: fixed;
			top: 90rpx;
			/* #ifdef APP-PLUS */
			top: 130rpx;
			/* #endif */
			/* #ifdef MP-WEIXIN */
			top: 130rpx;
			/* #endif */
			width: 100%;

			text {
				font-size: 20rpx;
				color: #999;
				margin-left: 15rpx;
			}
		}

		.mybalance-content {
			padding-left: 30rpx;
			padding-top: 90rpx;
			/* #ifdef APP-PLUS */
			padding-top: 130rpx;
			/* #endif */
			/* #ifdef MP-WEIXIN */
			padding-top: 130rpx;
			/* #endif */

			.mybalance-content-item {
				border-bottom: 1px solid #E0E0E0;
				padding: 30rpx;
				padding-left: 0;

				.content {
					display: flex;
					align-items: center;

					.right {
						flex: 1;

						.top {
							display: flex;
							justify-content: space-between;
							font-size: 30rpx;

							.name {
								view {
									font-size: 26rpx;
									color: #999;
									margin: 10rpx 0;
								}
							}

							.price {
								font-size: 36rpx;
							}
						}

						.bottom {
							font-size: 30rpx;
							color: #999;
						}
					}
				}
			}
		}
	}
</style>
