<template>
	<div class="banner-container">
		<!-- <swiper :style="{width: '100vw', height: '410rpx'}" :indicator-dots="swiperConfig.indicatorDots" :indicator-color="swiperConfig.indicatorColor"
		 :indicator-active-color="swiperConfig.indicatorActiveColor" :autoplay="swiperConfig.autoplay" :interval="swiperConfig.interval"
		 :duration="swiperConfig.duration" :circular="swiperConfig.circular" :previous-margin="swiperConfig.previousMargin"
		 :next-margin="swiperConfig.nextMargin" @change="swiperChange" @animationfinish="animationfinish">
			<swiper-item v-for="(item, i) in bannerList" :key="i"> -->
				<!-- 1.当前展示为第1项时，bannerList最后一项和第二项的justifyContent值分别为flex-end和flex-start，其余项值为center -->
				<!-- 2.当前展示为最后一项时，bannerList倒数第2项和第1项的justifyContent值分别为flex-end和flex-start，其余项值为center -->
				<!-- 3.当前展示为其他项（非第1和最后1项）时，bannerList当前项的前1项和后1项的justifyContent值分别为flex-end和flex-start，其余项值为center -->
				<!-- 4.padding值也需要根据不同项设定不同值，但理同justifyContent -->
			
			<!-- 	<div class="image-container" :class="[curIndex===0?((i===listLen-1)?'item-left':(i===1?'item-right':'item-center')):(curIndex===listLen-1?(i===0?'item-right':(i===listLen-2?'item-left':'item-center')):(i===curIndex-1?'item-left':(i===curIndex+1?'item-right':'item-center')))]">
					<image :src="imgBaseUrl + item.picture" class="slide-image" :style="{
              transform: curIndex===i?'scale(' + scaleX + ',' + scaleY + ')':'scale(1,1)',
              transitionDuration: '.3s',
              transitionTimingFunction: 'ease'
            }"
					 @click="getBannerDetail(item)" />
				</div>
			</swiper-item>
		</swiper> -->
		
		<view class="page-section-spacing">
			<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="2000" :duration="500">
				<swiper-item  v-for="(item, i) in bannerList" :key="i">
					<image :src="imgBaseUrl + item.picture" class="slide-image-img" @click="getBannerDetail(item)"> </image>
				</swiper-item>
				
			</swiper>
		</view>
		
		
	</div>
</template>
<script>
	import {
		imgBaseUrl
	} from "@/common/apis.js"
	export default {
		name: "specialBanner",
		props: {
			bannerList: {
				type: Array,
				default () {
					return []
				}
			},
			swiperConfig: {
				type: Object,
				default () {
					return {
						indicatorDots: true,
						indicatorColor: 'rgba(255, 255, 255, .4)',
						indicatorActiveColor: 'rgba(255, 255, 255, 1)',
						autoplay: false,
						interval: 3000,
						duration: 300,
						circular: true,
						previousMargin: '58rpx',
						nextMargin: '58rpx'
					}
				}
			},
			scaleX: {
				type: String,
				default: (634 / 550).toFixed(4)
			},
			scaleY: {
				type: String,
				default: (378 / 328).toFixed(4)
			}
		},
		computed: {
			listLen() {
				return this.bannerList.length
			}
		},
		data() {
			return {
				imgBaseUrl: imgBaseUrl,
				curIndex: 0,
				descIndex: 0,
				isDescAnimating: false
			}
		},
		methods: {
			swiperChange(e) {
				const that = this
				this.curIndex = e.mp.detail.current
				this.isDescAnimating = true
				let timer = setTimeout(function() {
					that.descIndex = e.mp.detail.current
					clearTimeout(timer)
				}, 150)
			},
			animationfinish(e) {
				this.isDescAnimating = false
			},
			getBannerDetail(item) {
				if (item.types == 0 ) { // 外部
					window.open(item.path)
				}
				if (item.types == 1) { // 商家 
					uni.navigateTo({
						url: '../shopPage/shopPage?shopId=' + item.shopId,
					})
				}

			}
		}
	}
</script>
<style lang="scss" scoped>
	.slide-image-img{
		width: 710rpx;
		height: 330rpx;
		
		border: none;
	}
	.banner-container {
		padding: 0;
		width: 100vw;
		// height: 524rpx;
		// height: 426rpx;
		height: 330rpx;
	}
</style>
