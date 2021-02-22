<template>
	<view class="cart">
		<!-- 顶部 -->
		<commonHeader :headerTitl="headerTitl" xingHide=true lingHide=true></commonHeader>
		<!-- 购物内容 -->
		<view class="cart-content" v-if="cartList.length>0">
			<view class="cart-content-item" v-for="(item,index) in cartList" :key="index">
				<!-- 标题 -->
				<view class="cart-content-item-title">
					<label class="radio">
						
						<!-- :checked="" -->
						<!-- <radio value="" :checked="item.checked"  @click="changeQuan(item,index)" /> -->
						<view class="" @click="changeQuan(item,index)" >
							<image class="card-check" :src="item.checked ? '/static/images/cardCheck.png' : '/static/images/cardNotCheck.png'" mode=""></image>
						</view>
						<image :src="imgBaseUrl + item.shopImg " mode=""></image>
						<text>{{item.shopName}}</text>
					</label>
				</view>
				<!-- 内容 -->
				<view class="cart-content-item-content" v-for="(goods, $goods) in item.goodsList" :key="$goods">
					<label class="radio">
						<!-- <radio value="" :checked="goods.checked" @tap="changeRadio(goods,index)" /> -->
						<view class="" @tap="changeRadio(item, index, goods,index)" >
							<image class="card-check" :src="goods.checked ? '/static/images/cardCheck.png' : '/static/images/cardNotCheck.png'" mode=""></image>
						</view>
						<image :src="imgBaseUrl + goods.SHOP_IMG" mode="" @tap="goShopDetails(goods)"></image>
						<view class="text" @tap="goShopDetails(goods)">
							<text class="title">{{goods.GOODS_NAME}}</text>
							<view class="num">
								<text>数量: {{ goods.COUNTS }}</text>
								<text>好评率: {{ goods.BETTER * 100 }}%</text>
							</view>
							<text class="price">
								¥{{goods.PRICE}}
							</text>
						</view>
					</label>
					<!-- 数量加减 -->
					<view class="changeNum">
						<view class="left">
		
						</view>
						<view class="right">
							<text class="iconfont icon-jian" @tap="changeNun(-1,index,$goods, goods)"></text>
							{{goods.COUNTS}}
							<text class="iconfont icon-jia" @tap="changeNun(1,index,$goods, goods)"></text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else style="text-align: center;color: #999;padding-top: 130rpx;">暂无数据！</view>
		<!-- 底部结算 -->
		<view class="cart-footer">
			<label class="radio">
				<!-- <radio value="" :checked="allChecked" @tap="changeAllChecked" /><text>全选</text> -->
			</label>
			<view class="right">
				<view class="price">
					合计：<text>{{allTotal}}</text>
				</view>
				<div class="total" @tap="settlement">去结算</div>
			</view>
		</view>
		<!-- tabbar -->
		<tabbar active="3"></tabbar>
	</view>
</template>

<script>
	// 引入tabbar
	import tabbar from "@/components/common-tabbar/common-tabbar";
	// 引入公用头部
	import commonHeader from "@/components/common-header/common-header";
	import {
		cartList, deletecarts, imgBaseUrl
	} from "@/common/apis.js"
	export default {
		name: 'ShopCart',
		data() {
			return {
				toastTitle: '每次只能购买同一商家的商品',
				imgBaseUrl: imgBaseUrl,
				headerTitl: "购物车",
				cartList: [],
				allChecked: false,
				userId: '',
				quancheckde: false,
				goodsindex: 0,
				
			};
		},
		components: {
			commonHeader,
			tabbar
		},
		mounted() {
		
			this.goodCarts()
		},
	
		methods: {
			goodCarts() {
				uni.getStorage({
					key: 'USERINFO_ID',
					success: res => {
						cartList({
							userId: res.data
						}).then(res => {
							if (res.returnMsg.status == '00') {
								this.cartList = res.returnMsg.carts
								this.cartList.forEach(ele => {
									ele.checked = false
									ele.childCheck = false // 判断当前商家下面是否有选中的商品
								});
							}
						}).catch()
					}
				})
			},
			
			// 单个商品全选按钮
			changeQuan(shop, index) {
				let checks = this.cartList.some(ele => ele.checked);
				let {shopId} = shop;
				let checkShop = this.cartList.filter(ele => ele.checked); 
				let checkShopId = checkShop.length && checkShop[0].shopId;  // 选中的店铺
				
				// 当前点击的店铺是否已经被勾选
				if(shopId !=checkShopId && checkShopId) {
					if(checks) {
						this.cartList[index].checked = false;
						return uni.showToast({ title: this.toastTitle, icon: 'none' })
					}		
				}
				let childCheck = this.cartList.some(ele => ele.childCheck);
				let arr = this.cartList.filter(ele => ele.childCheck);
				if(arr.length) {
					let childCheckShopId = arr[0].shopId
					// 其他店铺下方是否有被勾选的商品
					if(childCheckShopId && childCheckShopId != shopId ) {
						return uni.showToast({ title: this.toastTitle, icon: 'none' })
					}
				}
				
				
				// shop.checked = !shop.checked
				this.cartList[index].checked = !this.cartList[index].checked 
				if (this.cartList[index].checked == true) {
					this.cartList[index].goodsList.forEach((item) => item.checked = true)
				} else {
					this.cartList[index].goodsList.forEach((item) => item.checked = false)
				}

			},
			// // 改变单选状态
			changeRadio(shop, shopIndex, goods, i) {
				let chechIndex = this.cartList.findIndex(ele => ele.checked);
				// 判断除当前店铺下有其他商品是否有被选中
				if(chechIndex != -1 && chechIndex != shopIndex) {
					return uni.showToast({ title: this.toastTitle, icon: 'none' })
				}
				let shopchildCheck = this.cartList.filter(ele => ele.childCheck); 
				if(shopchildCheck.length) {
					let [{ shopId }] = shopchildCheck;
					if(shopId != shop.shopId) {
						return uni.showToast({ title: this.toastTitle, icon: 'none' })
					}
				}
				
				this.goodsindex = i
				goods.checked = !goods.checked;
				let someCheck = shop.goodsList.some(ele => ele.checked)
				
				this.cartList[shopIndex].childCheck = someCheck;
				
				let index = this.cartList[i].goodsList.findIndex(item => {
					return item.checked == false;
				});
				if (index != -1) {
					this.allChecked = false;
					this.cartList[i].checked = false;
				} else {
					this.allChecked = true;
					this.cartList[i].checked = true;
				}
			},

			// 全选改变状态
			changeAllChecked() {
				this.allChecked = !this.allChecked
				// this.allChecked ? this.allChecked = false : this.allChecked = true;
				this.cartList.map(item => {
					item.goodsList.forEach((item) => {

						item.checked = this.allChecked;
					})
					item.checked = this.allChecked;
					return item
				})
			},
			// 改变数量
			changeNun(num, index1, index2, goodsInfo) {
				this.cartList.forEach((item, index) => {
					if (index === index1) {
						item.goodsList.forEach((goods, $goods) => {
							if ($goods == index2) {
								goods.COUNTS = Number(goods.COUNTS) + num
								if (goods.COUNTS < 1) {
									item.goodsList.splice($goods, 1)
									deletecarts({GOODS_ID: goodsInfo.GOODS_ID})
								}
							}
						})
					}
				})
			},
			// 结算
			settlement() {
				if (!this.cartList.length) {
					return uni.showToast({ title: '没有商品!', icon: 'none' });		 
				}
				var arr = [];
				// 全部商品选中过滤
				let arr1 = this.cartList //this.cartList.filter(item => item.checked)
				let temp = [];
				for (let i = 0; i < arr1.length; i++) {
					temp = arr1[i].goodsList.filter(item => item.checked)
					arr.push(...temp)
				}
				
				// return false;
				
				if (arr.length==0) {
					uni.showToast({ title: '请先选择商品!', icon: 'none' });
				} else {
					let shopId = arr[this.goodsindex].SHOP_ID || arr[this.goodsindex].shopId;
					let stringifyArr = JSON.stringify(arr);

					uni.navigateTo({
						url: "../settlement/settlement?item=" + stringifyArr + "&allNum=" + this.allTotal + '&page=cart' +"&shopId=" + shopId
					})
				}
				
			},
			// 前往商品详情
			goShopDetails(item) {
				uni.navigateTo({
					url: "../goodsDetails/goodsDetails?shopId=" + item.GOODS_ID
				})
			}
		},
		computed: {
			allTotal() {
				// 总价
				let countMoney = 0;
				//  总数量
				let countMum = 0;
				//  单个数量
				var tabbarNum = 0;
				// 没转换的数字
				let newMoney = 0;
				
				for (let i = 0; i < this.cartList.length; i++) {
					// this.cartList && this.cartList[0] && 
					this.cartList[i].goodsList.forEach(item => {
						if (item.checked == true) {
							newMoney += item.COUNTS *item.PRICE;
							countMoney = newMoney.toFixed(2);
							countMum++;
						}
					});
				}
				
				return countMoney;
			}
			
		}
	}
</script>

<style lang="less" scoped>
	.card-check{
		width: 40rpx !important;
		height: 40rpx !important;
	}
	.cart-content-item{
		position: relative;
	}
	.cart {
		color: #333;
		min-height: 100%;
		background: #f7f7f7;
		padding-bottom: 100rpx;
		/* #ifdef MP-WEIXIN */
		padding-top: 40rpx;
		/* #endif */
		/* #ifdef APP-PLUS */
		padding-top: 40rpx;

		/* #endif */
		// 购物内容
		.cart-content {
			margin-top: 100rpx;
			background: #f8f6f9;
			padding: 20rpx 0;
			margin-bottom: 100rpx;

			.cart-content-item {
				width: 90%;
				margin: auto;
				padding: 20rpx;
				background: #fff;
				border-radius: 20rpx;
				margin-bottom: 20rpx;

				.cart-content-item-title {
					display: flex;
					border-bottom: 1px solid #ccc;
					padding-bottom: 30rpx;
					font-size: 32rpx;
					font-weight: 600;

					.radio {
						display: flex;
						align-items: center;

						image {
							width: 50rpx;
							height: 50rpx;
							margin: 0 15rpx;
						}
					}
				}

				.cart-content-item-content {
					padding-top: 40rpx;

					.radio {
						display: flex;
						align-items: center;

						image {
							width: 180rpx;
							height: 152rpx;
							border-radius: 20rpx;
							margin: 0 20rpx;
						}

						.text {
							margin-top: -20rpx;
							height: 152rpx;

							.title {
								font-size: 28rpx;
								font-weight: 600;
							}

							.num {
								margin: 20rpx 0;
								font-size: 24rpx;
								color: #999;

								text {
									margin-right: 40rpx;
								}
							}

							.price {
								color: #FF5A32;
							}
						}
					}

					.changeNum {
						display: flex;
						align-items: center;
						justify-content: space-between;

						text {
							font-size: 60rpx;
							color: #FF5A32;
							margin-left: 30rpx;
						}

						text:not(:last-child) {
							margin-right: 30rpx;
						}
					}
				}
			}
		}

		// 底部结算
		.cart-footer {
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: #f8f8f8;
			height: 100rpx;
			position: fixed;
			width: 100%;
			font-size: 28rpx;
			bottom: 90rpx;

			.radio {
				margin-left: 30rpx;
			}

			.right {
				display: flex;

				.price {
					line-height: 100rpx;
					margin-right: 30rpx;

					text {
						color: #FF6B37;
					}
				}

				.total {
					background: #FF6B37;
					height: 100rpx;
					width: 220rpx;
					color: #fff;
					font-size: 32rpx;
					line-height: 100rpx;
					text-align: center;
				}
			}
		}
	}
</style>
