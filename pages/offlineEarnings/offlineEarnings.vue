<template>
	<view class="mybalance">
		<!-- hader -->
		<commonHeader headerTitl="线下账单"></commonHeader>
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
		<view class="mybalance-content" v-if="listData.length">
			<view class="mybalance-content-item" v-for="item in listData" :key="item.id">
				<view class="content">
					<text class="left">
						<text class="iconfont icon-shouzhimingxicaifuhongbaoyue"></text>
					</text>
					<view class="right">
						<view class="top">
							<view class="name">
								<text>{{item.NUMBER}}</text>
							</view>
							<view class="price">
								-￥{{item.ORIGINALPRICE}}
							</view>
						</view>
						<view class="bottom">
							{{item.CREATETIME}} {{ payType(item.TYPES) }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else style="text-align: center;padding-top: 80px;color: #999;font-size: 30rpx;">暂无数据</view>
		<!-- 提示内容 -->
		<view class="mybalance-tips" style="color: #666;textAlign: center;" :class="tipsState?'tipsState':''">
			暂无信息哟！
		</view>
		<!-- tabbar -->
		<tabbar></tabbar>
	</view>
</template>

<script>
	// header
	import commonHeader from "@/components/common-header/common-header";
	// tabbar
	import tabbar from "@/components/common-tabbar/common-tabbar";
	import {
		userlist
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
				// 提示信息
				tipsState: true
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
			this.getList(0)
		},
		methods: {
			payType(TYPES) {
				return TYPES == 0 && '余额支付' || TYPES == 1 && '微信支付' || TYPES == 2 && '支付宝支付'
			},
			// 日期选择
			bindDateChange: function(e) {
				var arr = e.detail.value.split('-');
				this.date = `${arr[0]}-${arr[1]}-${arr[2]}`;
				this.getList(1)
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					// year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			getList(start) {
				uni.getStorage({
					key: 'USERINFO_ID',
					success: (res) => {
						uni.showLoading({
							title: '加载中'
						})
						userlist({
							USERINFO_ID: res.data,
							CREATETIME: (start == 0 ? '' : this.date)
						}).then(res => {
							this.listData = res.varList
							
						}).catch(err => {
							uni.showToast({
								title: '网络出错啦!',
								icon: 'none'
							})
						}).finally(() => uni.hideLoading())
					},


				})
			}
		},

	}
</script>

<style lang="less" scoped>
	.mybalance {
		color: #333;
		padding-top: 95rpx;
		/* #ifdef APP-PLUS */
		padding-top: 130rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-top: 130rpx;
		/* #endif */
		padding-bottom: 100rpx;

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
			z-index: 100;

			text {
				font-size: 20rpx;
				color: #999;
				margin-left: 15rpx;
			}
		}

		.mybalance-content {
			padding-left: 30rpx;
			padding-top: 90rpx;

			.mybalance-content-item {
				border-bottom: 1px solid #E0E0E0;
				padding: 30rpx;
				padding-left: 0;

				.content {
					display: flex;
					align-items: center;

					.left {
						width: 60rpx;
						height: 60rpx;
						background: #f8f5f8;
						border-radius: 50%;
						border: 1px solid #E0E0E0;
						display: flex;
						justify-content: center;
						align-items: center;
						margin-right: 20rpx;

						text {
							font-size: 40rpx;
							color: #FF5A32;
						}
					}

					.right {
						flex: 1;
						position: relative;

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
								position: absolute;
								right: 20rpx;
								margin-top: 15rpx;
							}
						}

						.bottom {
							margin-top: 10rpx;
							font-size: 24rpx;
							color: #999;
						}
					}
				}
			}
		}

		.tipsState {
			display: none;
		}
	}
</style>
