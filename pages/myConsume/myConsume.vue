<template>
	<view class="mybalance">
		<!-- hader   我的消费金 -->
		<commonHeader headerTitl="我的消费金" xingHide=true></commonHeader>
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
					<text class="left">
						<image :src="imgBaseUrl + item.faceicon" mode="" v-if="item.faceicon.length> 10"></image>
						<text class="iconfont icon-shouzhimingxicaifuhongbaoyue" v-else></text>

					</text>
					<view class="right">
						<view class="top">
							<view class="name">
								<text>{{item.orderno ? item.orderno : '线下支付'}}</text>
								<view v-if="item.goodsName">
									{{item.goodsName}}
								</view>
							</view>
							<view class="price">
								<!-- {{item.paytype == 0 ? '+' : '-'}} -->  ￥ {{item.actualPay}}
							</view>
						</view>
						<view class="bottom">
							{{item.createTime}} 到期时间：{{ item.endtime }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else style="text-align: center;color: #999;padding-top: 150rpx;">改天没有记录哦！</view>
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
		myConsume,
		imgBaseUrl
	} from '@/common/apis.js';
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				imgBaseUrl: imgBaseUrl,
				listData: [],
				// 日期选择
				date: currentDate,
				timeStamp: ''
			}
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
							"USERINFO_ID": res.data,
							"CREATETIME": timeStamp ? timeStamp : ''
						}
						// obj 传参过去不得行
						uni.showLoading({
							title: '加载中',
							mask: true
						})
						myConsume(obj).then(res => {
							this.listData = res.returnMsg.varList
						}).catch(err => uni.showToast({
							title: '请求失败！',
							icon: 'none'
						})).finally(() => uni.hideLoading())
					}
				})
			}
		},
		components: {
			commonHeader,
			tabbar
		},
		mixins: [share],
		onLoad() {
			this.otherPage();
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

					.left {
						width: 60rpx;
						height: 60rpx;
						// line-height: 60rpx;
						background: #f8f5f8;
						border-radius: 50%;
						border: 1px solid #E0E0E0;
						display: flex;
						justify-content: center;
						align-items: center;
						margin-right: 20rpx;

						image {
							width: 45rpx;
							height: 45rpx;
							border-radius: 50%;
							margin-top: 10rpx;
							border: none;
							display: inline-block;
						}

						text {
							font-size: 40rpx;
							color: #FF5A32;
						}
					}

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
							font-size: 24rpx;
							color: #999;
						}
					}
				}
			}
		}
	}
</style>
