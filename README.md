<!-- 加载 demo 组件 start -->
<script setup>
import demo from './demo.vue'
</script>
<!-- 加载 demo 组件 end -->

<!-- 正文开始 -->

# 基于Vue3的电子签名

简单轻量的电子签名组件

## 基础用法
<Preview comp-name="ESign" demo-name="demo">
  <demo />
</Preview>

## 属性
参数 | 说明 | 类型 | 可选值 | 默认值 | 是否必填
:-: | :-: | :-: | :-: | :-: | :-:
`width` | canvas 宽度 | number | - | `default` | 320 
`height` | canvas 高度 | number | - | `default` | 160
`lineWidth` | 线宽 | number | - | `default` | 4
`strokeColor` | 线段颜色 | string | - | `default` | green
`lineCap` | 设置线条两端圆角 | string | - | `default` | round
`lineJoin` | 线条交汇处圆角 | string | - | `default` | round
`bgColor` | 画布背景颜色 | string | - | `default` | transparent
`showBtn` | true | boolean | - | `default` | true



## 事件
事件名 | 说明 | 参数列表 | 参数说明
:-: | :-: | :-: | :-:
`onSave` | 当保存时的回调, blob为生成的图片bob | (blob: Blob) => void | -
`onClear` | 当画布清空时的回调, 参数为画布的上下文对象,可以直接使用canvas的api | (canvasContext: CanvasRenderingContext2D) => void | -
`onDrawEnd` | 当画布结束时的回调 | (canvas: HTMLCanvasElement) => void | -




## 赞助 | Sponsored

开源不易, 有了您的赞助, 我们会做的更好~

<img src="http://cdn.dooring.cn/dr/WechatIMG2.jpeg" width="180px" />

## 技术反馈和交流群 | Technical feedback and communication

微信：beautifulFront

<img src="http://cdn.dooring.cn/dr/qtqd_code.png" width="180px" />
