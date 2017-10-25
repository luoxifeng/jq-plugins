# SwiperSlider 滑动轮播图
    滑动轮播图，支持pc,移动端，支持自动播放，移动端滑动，自由切换，支持多图片，优雅处理图片个数为偶数个切换效果的突兀感，可配制自动播放，播放间隔，缩放比例间隔，适应不同业务场景

## Quick Links
[ScreenShots(各种场景效果截图)](#ScreenShots)

[Usage(引用以及用法)](#Usage)

[Config(配置以及说明)](#Config)

## <sapn id="ScreenShots">ScreenShots</span>
1. pc端

    1. 正常情况 （奇数个）
        ![](./imgs/pc_odd.gif)
    2. 非对称  （偶数个）
        ![2个图片](./imgs/pc_even_2.gif)
        ![4个图片](./imgs/pc_even_4.gif)
    > 非对称优化,由于偶数个图片切换的时候原本的效果会在某一边来回切换，效果显得乖乖的，优化后再自动切换的时候，会在两个方向上切换，显得友好一些，`手动切换的时候会按照原本效果，因为手动切换是带有方向性的，不可能点击上一个的时候，图片还向左，点击下一个也是同样的道理`


2. 移动端

    1. 正常情况 （奇数个）
        ![](./imgs/mobile_odd.gif)
    2. 非对称  （偶数个）
        ![2个图片](./imgs/mobile_even_2.gif)
        ![4个图片](./imgs/mobile_even_4.gif)
    > 非对称优化,和pc端一样原理

## <span id ="Usage">Usage</span>

```html
<html>
    <head>
        <link rel="stylesheet" href="swiperslider/index.css">
        <style>
            /* 需要设置容的宽高 */
            .wrapper {
                margin: 0 auto;
                height: 400px;
                width: 1200px;
            }
        </style>
    </head>
    <body>
        <!-- 插件的容器 -->
        <div id="slider" class="wrapper"></div>

        <!-- 引入插件脚本 -->
        <script src="swiperslider/index.js"></script>
        <!-- 用法 -->
        <script>
            var imgs = ["./imgs/01.jpg", "./imgs/02.jpg","./imgs/03.jpg", "./imgs/04.jpg", "./imgs/05.jpg"];
            var slider  =  new SwiperSlider({
                selector: "#slider",
                imgs: imgs,
                autoplay: true,
                interval: 2000,
                scale: 0.1,
                touch: true
            });
        </script>
    </body>
    
<html>
```

## <sapn id="Config">Config</span>
| 配置项    | 说明      | 默认值    |
| --------- | :------: | :-------: |
| selector  | 插件容器  | `无`      |
