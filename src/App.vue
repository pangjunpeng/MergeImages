<template>
  <div id="app">
    <img :src="posterImg" class="poster" alt="">
  </div>
</template>

<script>
import MergeImage from './MergeImages'
export default {
  name: 'app',
  data () {
    return {
      posterImg: ''
    }
  },
  created(){
    new MergeImage({
      bgImg: {
          url: require('./assets/poster.jpg')
      },
      otherImgs: [
          {
              url: 'https://upload-images.jianshu.io/upload_images/11264410-aa1c751a5a01b400.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/490/format/webp',
              isCircle: true, //为true时宽高不生效
              radius: 0.1, // 半径
              x: 0.076, // 左偏移量
              y: 0.11 // 垂直距离偏移量
          },
          {
              url: 'https://upload-images.jianshu.io/upload_images/11264410-2936b8a76d1c96f8.jpg',
              width: 0.2534, // 宽
              height: 0.2534, // 高
              x: 0.7, // 左偏移量
              y: 1.3 // 垂直距离偏移量
          }
      ],
      finally: res => {
        this.posterImg = res
      },
  });
  }
}
</script>

<style lang="scss">
.poster {
  width: 100%
}
</style>
