<template>
  <div class="esign-wrapper">
    <canvas ref="canvasRef" :width="width" :height="height" style="border:1px solid #ccc;"></canvas>
    <div  v-show="showBtn" className="sign-btnWrap">
            <span  @click="cancel" className="sign-btn">清除</span>
            <span  @click="save" className="sign-btn primary">保存</span>
          </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted,onUnmounted } from "vue";
interface IProps {
    /**
     * @description   画布宽度
     * @default       400
     */
     width?: number;
     /**
      * @description   画布高度
      * @default       200
      */
     height?: number;
     /**
      * @description   线宽
      * @default       4
     */
     lineWidth?: number;
     /**
      * @description   线段颜色
      * @default       'red'
     */
     strokeColor?: string;
     /**
      * @description   设置线条两端圆角
      * @default       'round'
     */
     lineCap?: string;
     /**
      * @description   线条交汇处圆角
      * @default       'round'
     */
     lineJoin?: string;
     /**
      * @description   画布背景颜色
      * @default       'transparent'
     */
     bgColor?: string;
     /**
      * @description   true
     */
     showBtn?: boolean;
     /**
     * @description   当保存时的回调, blob为生成的图片bob
     * @default       -
     */
     onSave?: (blob: Blob) => void;
    /**
     * @description   当画布清空时的回调, 参数为画布的上下文对象,可以直接使用canvas的api
     * @default       -
     */
     onClear?: (canvasContext: CanvasRenderingContext2D) => void;
     /**
     * @description   当画布结束时的回调
     * @default       -
     */
     onDrawEnd?: (canvas: HTMLCanvasElement) => void;
  }

const props = withDefaults(defineProps<IProps>(), {
  width: 400,
  height: 200,
  lineWidth:4,
  strokeColor:'green',
  lineCap:'round',
  lineJoin:'round',
  bgColor:'transparent',
  showBtn:true
});

const {
  width,
  height,
  lineWidth,
  strokeColor,
  lineCap,
  lineJoin,
  bgColor,
  showBtn,
  onSave,
  onClear,
  onDrawEnd
} = props;

   const canvasRef = ref<any>(null);
    const ctxRef = ref<any>(null);

   // 保存上次绘制的 坐标及偏移量
   const client = ref<any>({
              offsetX: 0, // 偏移量
              offsetY: 0,
              endX: 0, // 坐标
              endY: 0
          })
  

 // 判断是否为移动端
 const mobileStatus = (/Mobile|Android|iPhone/i.test(navigator.userAgent));

   // 取消-清空画布
   const cancel = () => {
    // 清空当前画布上的所有绘制内容
    if(canvasRef.value) {
      const canvasCtx = canvasRef.value.getContext("2d");
      canvasCtx.clearRect(0, 0, width, height);
      
      onClear && onClear(canvasRef.value)
    }
  }

  // 保存-将画布内容保存为图片
  const save = () => {
    // 将canvas上的内容转成blob流
    canvasRef.value.toBlob((blob: any) => {
        // 获取当前时间并转成字符串，用来当做文件名
        const date = Date.now().toString()
        // 创建一个 a 标签
        const a = document.createElement('a')
        // 设置 a 标签的下载文件名
        a.download = `${date}.png`
        // 设置 a 标签的跳转路径为 文件流地址
        a.href = URL.createObjectURL(blob)
        // 手动触发 a 标签的点击事件
        a.click()
        // 移除 a 标签
        a.remove()

        onSave && onSave(blob);
    })
  }

   // 绘制
   const draw = (event: { changedTouches?: any; pageX?: any; pageY?: any; }) => {
        // 获取当前坐标点位
        const { pageX, pageY } = mobileStatus ? event.changedTouches[0] : event
        // 获取canvas 实例
        const canvas:HTMLCanvasElement = canvasRef.value as any;
        
        const { x, y } = canvas.getBoundingClientRect();
        // 修改最后一次绘制的坐标点
        client.value.endX = pageX
        client.value.endY = pageY
        // 根据坐标点位移动添加线条
        ctxRef.value.lineTo(pageX - x, pageY - y)

        // 绘制
        ctxRef.value .stroke()
    };

   // 初始化
   const init = (event: { changedTouches?: any; offsetX?: any; offsetY?: any; pageX?: any; pageY?: any; }) => {
        // 获取偏移量及坐标
        const { offsetX, offsetY, pageX, pageY } = mobileStatus ? event.changedTouches[0] : event;
        const canvas:HTMLCanvasElement = canvasRef.value as any;

        const { x, y } = canvas.getBoundingClientRect();
     


        client.value.offsetX = offsetX
        client.value.offsetY = offsetY
        client.value.endX = pageX
        client.value.endY = pageY

        // 清除以上一次 beginPath 之后的所有路径，进行绘制
        ctxRef.value.beginPath()
        // 根据配置文件设置相应配置
        ctxRef.value.lineWidth = lineWidth
        ctxRef.value.strokeStyle = strokeColor
        ctxRef.value.lineCap = lineCap
        ctxRef.value.lineJoin = lineJoin
        // 设置画线起始点位
        ctxRef.value.moveTo(client.value.endX - x, client.value.endY - y)
        // 监听 鼠标移动或手势移动
        window.addEventListener(mobileStatus ? "touchmove" : "mousemove", draw)
    };
  // 结束绘制
  const closeDraw = () => {
         console.log(ctxRef.value);
        // 结束绘制
        ctxRef.value.closePath()
        // 移除鼠标移动或手势移动监听器
        window.removeEventListener("mousemove", draw)
        onDrawEnd && onDrawEnd(canvasRef.current)
    };
  const initCanvas =()=>{
       // 获取canvas 实例
       const canvas:HTMLCanvasElement = canvasRef.value as any;
          // 设置宽高
          canvas.width = width;
          canvas.height = height;
          // 创建上下文
          const ctx:any = canvas.getContext('2d');
          ctxRef.value = ctx;
          // 设置填充背景色
          ctxRef.value.fillStyle = bgColor;
          // 绘制填充矩形
          ctxRef.value.fillRect(
              0, // x 轴起始绘制位置
              0, // y 轴起始绘制位置
              width, // 宽度
              height // 高度
          );
  }
  const  addEventListener=()=>{
     // 创建鼠标/手势按下监听器
     window.addEventListener(mobileStatus ? "touchstart" : "mousedown", init);
      // 创建鼠标/手势 弹起/离开 监听器
    window.addEventListener(mobileStatus ? "touchend" : "mouseup", closeDraw);
    
  }
  const  removeEventListener=()=>{
     // 创建鼠标/手势按下监听器
     window.removeEventListener(mobileStatus ? "touchstart" : "mousedown", init);
      // 创建鼠标/手势 弹起/离开 监听器
    window.removeEventListener(mobileStatus ? "touchend" : "mouseup", closeDraw);
    
  }
  

const initEsign=()=>{
     initCanvas();
     addEventListener();
    
  }

  onMounted(() => {
    initEsign();
});

onUnmounted(()=>{
  removeEventListener();
});


</script>

<style scoped lang="less">
.esign-wrapper {
  border: 1px solid #ccc;
  .sign-btnWrap {
    margin-top: 10px;
    .sign-btn {
      display: inline-block;
      border-radius: 6px;
      padding: 4px 12px;
      font-size: 14px;
      background-color: #ccc;
      margin-right: 12px;
      margin-bottom: 10px;
      margin-left:10px;
      &.primary {
        color: #fff;
        background-color: #1677ff;
      }
    }
  }
}
</style>