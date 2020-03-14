<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"  
                    @titleClick="titleClick" 
                    ref="nav"
                    :current-index="currentIndex"></detail-nav-bar>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3"
            @scroll="contentScroll">
      <div>
        <detail-swiper :top-images="topImages"></detail-swiper>
        <detail-base-info :goods="goods"></detail-base-info>
        <detail-shop-info :shop="shop"></detail-shop-info>
        <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
        <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
        <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
        <detail-recommend-info ref="recommend" :recommend-list="recommendList"></detail-recommend-info>
      </div>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailRecommendInfo from './childComps/DetailRecommendInfo'
import DetailBottomBar from './childComps/DetailBottomBar'
import BackTop from '../../components/content/backTop/BackTop'

import Scroll from '../../components/common/scroll/Scroll'
import {debounce} from '../../common/utils'

import {getDetail, getRecommend, Goods, Shop, GoodsParam} from 'network/detail'
import {itemListenerMixin, backTopMixin} from '../../common/mixin'

export default {
  name:"Detail",
  components:{
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailRecommendInfo,
    DetailBottomBar,
    Scroll,
    BackTop,
  },
  mixins:[itemListenerMixin, backTopMixin],
  data(){
    return{
      iid:null,
      topImages:[],
      goods:{},
      shop:{},
      detailInfo:{},
      paramInfo: {},
      commentInfo: {},
      recommendList: [],
      themeTopYs: [],
      getThemeTopY:null,
      currentIndex: 0
    }
  },
  created(){
    //1.获取iid
    this.iid = this.$route.params.iid
    //2.请求详情数据
    getDetail(this.iid).then(res => {
      console.log(res);
      //2.1.获取顶部的图片轮播数据
      const data = res.result
      this.topImages = data.itemInfo.topImages

      //2.2.获取商品信息
      this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

      //2.3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)

      //2.4.保存商品的详情数据
      this.detailInfo = data.detailInfo

     //2.5.保存参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

    // 2.6.保存参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
    // 2.7.保存评论信息
    if (data.rate.list) {
      this.commentInfo = data.rate.list[0];
     }
    })
    // 3.请求推荐数据
    getRecommend().then((res, error) => {
      if (error) return
      this.recommendList = res.data.list 
      // console.log(this.recommendList);         
        }),
    //4.给getThemeTopY赋值    
    this.getThemeTopY = debounce(()=>{
      this.themeTopYs = []
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      this.themeTopYs.push(Number.MAX_VALUE)
      console.log(this.themeTopYs);
      
    })
  },
  methods:{
    imageLoad(){
      this.$refs.scroll.refresh()
      this.getThemeTopY()
    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500)
      },
    contentScroll(position){
      this.isShowBackTop = position.y <-1000

      const positionY = -position.y
      let length = this.themeTopYs.length
      for(let i=0;i<length-1;i++){
        if(this.currentIndex !==i && (positionY>=this.themeTopYs[i] && positionY<this.themeTopYs[i+1])){
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
    },
    addToCart(){
      //  alert('添加购物车成功')
      //1.获取购物车需要展示的信息
      const product = {}
      product.iid = this.iid
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      //2.添加到store中
      // this.$store.commit('addCart',product)
      this.$store.dispatch('addCart',product).then(res=>{
        // console.log(res);
        this.$toast.show(res)
        
      })
      
    }
  },
  mounted(){
  },
  destroyed(){
    this.$bus.$off('itemImageLoad',this.itemImgListener)
  }
}
</script>

<style scoped>
  #detail{
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
    
  }

  /* .content{
    height: calc(100%-44px);
  } */
  .content {
    position: absolute;
    top: 44px;
    bottom: 60px;
  }
</style>