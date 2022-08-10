<template>
  <view>
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
    <!-- :indicator-dots:轮播图小圆点  :autoplay="true"：自动轮播  :interval="3000" 间隔3秒轮播一次  :duration="1000" 循环过程1秒  :circular="true" 衔接轮播 最后一张接第一张-->
        <!-- 循环渲染轮播图的 item 项 -->
        <swiper-item v-for="(item, i) in swiperList" :key="i">
          <!-- 点击轮播图跳转商品详情页 -->
          <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
              <!-- 动态绑定图片的 src 属性 -->
              <image :src="item.image_src"></image>
          </navigator>
        </swiper-item>
    </swiper>
    
    <!-- 分类导航区域  点击第一项，切换到分类页面-->
    <view class="nav-list">
       <view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)">
         <image :src="item.image_src" class="nav-img"></image>
       </view>
    </view>
    
    <!-- 楼层区域 -->
    <view class="floor-list">
      <!-- 楼层 item 项 -->
      <view class="floor-item" v-for="(item, i) in floorList" :key="i">
        <!-- 楼层标题 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧大图片的盒子 -->
          <navigator class="left-img-box" :url="product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
          </navigator>
          <!-- 右侧 4 个小图片的盒子 -->
          <view class="right-img-box">
            <navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0" :url="item2.url">
              <image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 1. 轮播图的数据列表，默认为空数组
        swiperList: [],
        // 1. 分类导航的数据列表
        navList: [],
        // 1. 楼层的数据列表
        floorList: [],
      }
    },
    onLoad() {
        // 2. 在 onLoad 生命周期函数中(小程序页面刚加载的时候)，调用获取轮播图数据的方法
        this.getSwiperList()
        // 2. 在 onLoad 中调用获取数据的方法
        this.getNavList()
        // 2. 在 onLoad 中调用获取楼层数据的方法
        this.getFloorList()
      },
      methods: {
          // 3. 获取轮播图数据的方法
          async getSwiperList() {
            // 3.1 发起请求
            const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata')
            // 3.2 请求失败
            if (res.meta.status !== 200) return uni.$showMsg()
            // 3.3 请求成功，为 data 中的数据赋值
            this.swiperList = res.message
          },
          // 3. 在 methods 中定义获取分类数据的方法
          async getNavList() {
            const { data: res } = await uni.$http.get('/api/public/v1/home/catitems')
            if (res.meta.status !== 200) return uni.$showMsg()
            this.navList = res.message
          },
          // nav-item 项被点击时候的事件处理函数
          navClickHandler(item) {
            // 判断点击的是哪个 nav
            if (item.name === '分类') {
              uni.switchTab({
                url: '/pages/cate/cate'
              })
            }
          },
          // 3. 定义获取楼层列表数据的方法
          async getFloorList() {
            const { data: res } = await uni.$http.get('/api/public/v1/home/floordata')
            if (res.meta.status !== 200) return uni.$showMsg()
            // 通过双层 forEach 循环，处理 URL 地址
            res.message.forEach(floor => {
              floor.product_list.forEach(prod => {
                prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1] // 按逗号进行拆分，拆分后会形成一个字符串的数组,从这个数组中取到第二个元素
              })
            })
            this.floorList = res.message
          },
        },
  }
</script>

<style lang="scss">
  swiper {
   height: 330rpx;
  
   .swiper-item,
   image {
     width: 100%;
     height: 100%;
   }
  }
  
  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15px 0;
  
    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }
  
  .floor-title {
    height: 60rpx;
    width: 100%;
    display: flex;
  }
  
  .right-img-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  
  .floor-img-box {
    display: flex;
    padding-left: 10rpx;
  }
</style>
