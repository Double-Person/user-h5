<template>
	<view class="mybalance">
		<!-- hader -->
		<commonHeader :headerTitl="headerTitl" xingHide=true></commonHeader>
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
				<view class="left">
					<text class="icon">
						<text class="iconfont icon-xingxing"></text>
					</text>

					<view class="text">
						<text>
							{{item.TYPES == 'STRATEGIC_EXCHANGE' && '星币兑换'||item.TYPES == 'PAY_PAID' && '购物' || item.TYPES == 'STRATEGIC_DIVIDEND' && '分利' || item.TYPES == 'STRATEGIC_AFFIRM' && '星币退款'}}
						</text>
						<view v-if="item.CHARGE">
							手续费 {{ computedPoundage(item.COINS, item.CHARGE, item.TYPES) }}
						</view>
						<view>
							{{item.TRADETIME}}
						</view>
					</view>
				</view>
				<view class="right">
					{{ item.TYPES == 'STRATEGIC_DIVIDEND' ? '+':'-' }}￥{{item.COINS}}
				</view>
			</view>
		</view>
		<view v-else style="text-align: center;color: #999;padding-top: 150rpx;">改天没有记录哦！</view>
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
		myPentacle
	} from "@/common/apis.js";
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				headerTitl: "我的星币",
				listData: [],
				// 日期选择
				date: currentDate,
				timeStamp: ''
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
		},
		methods: {
			computedPoundage(count, charge, type) {
				let endwith = charge.toString().endsWith('%');
				let str = '';
				let result = 0;
				if (endwith) {
					str = charge.toString().slice(0, charge.toString().length - 1)
				} else {
					if (charge == '0') {
						return result;
					}
					str = charge
				}
				// result = (count / ( 1 - str / 100 )) - count;
				// result = count - count / ( 1 + str / 100 );
				// result = count * (str / 100);
				if (type == 'STRATEGIC_EXCHANGE') { // 星币兑换
					result = count * (str / 100);
					return result.toFixed(8)
				} else if (type == 'PAY_PAID') { // 购物
					result = count - count / (1 + str / 100);
					return result.toFixed(8)
				} else {
					return 0
				}


			},
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
					// year = year + 2; 
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			getData(timeStamp) {
				uni.getStorage({
					key: 'USERINFO_ID',
					success: res => {
						var obj = {
							"USERINFO_ID": res.data,
							"TRADETIME": this.timeStamp ? this.timeStamp : ''
						}
						uni.showLoading({
							title: "加载中",
							mask: true
						})
						myPentacle(obj).then(res => {
							this.listData = res.returnMsg.varList
						}).catch(err => {
							uni.showToast({
								title: '请求失败',
								icon: 'none'
							})
						}).finally(() => uni.hideLoading())
					}
				})
			}
		},

	}
</script>

<style lang="less" scoped>
	.mybalance {
		color: #333;
		padding-top: 95rpx;
		padding-bottom: 150rpx;
		/* #ifdef MP-WEIXIN */
		padding-top: 135rpx;
		/* #endif */
		/* #ifdef APP-PLUS */
		padding-top: 135rpx;

		/* #endif */
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

			.mybalance-content-item {
				display: flex;
				justify-content: space-between;
				border-bottom: 1px solid #E0E0E0;
				padding: 30rpx;
				padding-left: 0;

				.left {
					display: flex;
					align-items: center;

					.icon {
						width: 60rpx;
						height: 60rpx;
						background: #f8f5f8;
						border-radius: 50%;
						border: 1px solid #E0E0E0;
						display: flex;
						justify-content: center;
						align-items: center;

						text {
							font-size: 40rpx;
							color: #FFAC47;
						}
					}

					.text {
						margin-left: 20rpx;
						font-size: 30rpx;

						view {
							font-size: 26rpx;
							color: #999;
							margin-top: 10rpx;
						}
					}
				}

				.right {
					font-weight: bold;
					font-size: 36rpx;
				}
			}
		}
	}
</style>
