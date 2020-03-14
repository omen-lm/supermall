<template>
    <scroll ref="scroll">
      <div>
        <!-- <li v-for="(item,index) in cartList" :key="index">{{item}}</li> -->
        <cart-list-item v-for="(item,index) in cartList" :key="index" :itemInfo="item"></cart-list-item>
      </div>
    </scroll>
</template>

<script>
import Scroll from '../../../components/common/scroll/Scroll'
import CartListItem from './CartListItem'

import { mapGetters } from 'vuex'

export default {
  name:"CartList",
  components:{
    Scroll,
    CartListItem
  },
  computed:{
    ...mapGetters(['cartList'])
  },
  activated(){
    this.$refs.scroll.refresh()
  }
}
</script>

<style scoped>

</style>