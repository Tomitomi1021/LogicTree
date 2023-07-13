<template>
  <div>
    <!--FOR DEBUG-->
    <!--
    <div class="startBox" :style="{left:startRect.x+'px',top:startRect.y+'px',width:startRect.w+'px',height:startRect.h+'px'}"/>
    <div class="endBox" :style="{left:endRect.x+'px',top:endRect.y+'px',width:endRect.w+'px',height:endRect.h+'px'}"/>
    <div class="viewRect" :style="{left:viewRect.x+'px',top:viewRect.y+'px',width:viewRect.w+'px',height:viewRect.h+'px',background:(viewRect.flow==='Right-Top')?'red':'blue'}">
    </div>
    -->
    <div 
      v-if="line1Style.isValid"
      class="LeaderLine HorizontalLine" 
      :style="{left:line1Style.x+'px',top:line1Style.y+'px',width:line1Style.length+'px'}">
    </div>
    <div 
      v-if="line2Style.isValid"
      class="LeaderLine VerticalLine" 
      :style="{left:line2Style.x+'px',top:line2Style.y+'px',height:line2Style.length+'px'}">
    </div>
    <div 
      v-if="line3Style.isValid"
      class="LeaderLine HorizontalLine" 
      :style="{left:line3Style.x+'px',top:line3Style.y+'px',width:line3Style.length+'px'}">
    </div>
  </div>
</template>
<script>

export default {
  name: 'LeaderLine',
  props: {
    start: {
      type: Object,
      required: false
    },
    end: {
      type: Object,
      required: false
    },
  },
  data:()=>{
    return {
      startRect: {
        x: 0,
        y: 0,
        w: 0,
        h: 0
      },
      endRect: {
        x: 0,
        y: 0,
        w: 0,
        h: 0
      },
    };
  },
  computed:{


    viewRectX(){
      const sx = this.startRect.x;
      const sw = this.startRect.w;
      const ex = this.endRect.x;
      const ew = this.endRect.w;

      //sx+sw < ex : startRectが左，endRectが右
      //ex+ew < sx : endRectが左，startRectが右
      //それ以外の場合はx軸だけで見ると重なっている．
      //現状，x軸方向が重なっている状態は考えないものとする．

      const leftX   = (sx+sw < ex)? sx + sw : (ex+ew < sx)? ex + ew : null;
      const rightX  = (sx+sw < ex)? ex : (ex+ew < sx)? sx : null;

      if(leftX===null  || rightX===null){
        return {
          isValid:false
        };
      }else{
        return {
          isValid:true,
          leftX:leftX,
          rightX:rightX
        };
      }
    },


    viewRectY(){
      const sy = this.startRect.y;
      const sh = this.startRect.h;
      const ey = this.endRect.y;
      const eh = this.endRect.h;

      // sy+sh/2とey+eh/2で比較
      // 小さい方がtopY，大きい方がbottomY
      const topY    = (sy+sh/2 < ey+eh/2)? sy+sh/2 : ey+eh/2;
      const bottomY = (sy+sh/2 > ey+eh/2)? sy+sh/2 : ey+eh/2;

      //高さが全く同じ場合は考えないものとする．
      if(topY==bottomY){
        return {
          isValid: false
        };
      }else{
        return {
          isValid: true,
          topY: topY,
          bottomY: bottomY
        };
      }
    },


    viewRectFlow(){
      const sx = this.startRect.x;
      const sy = this.startRect.y;
      const sw = this.startRect.w;
      const sh = this.startRect.h;
      const ex = this.endRect.x;
      const ey = this.endRect.y;
      const ew = this.endRect.w;
      const eh = this.endRect.h;

      // 位置関係
      // rightXで値が用いられているRectが，
      // topYで値を用いられているなら右上
      // bottomYで値を用いられているなら右下
      if(sx+sw < ex){
        //endRectが右の場合
        if(ey+eh/2 < sy+sh/2){
          //右上
          return {
            isValid: true,
            flow: "Right-Top"
          };
        }else{
          //右下
          return {
            isValid: true,
            flow:"Right-Bottom"
          };
        }
      }else if(ex+ew < sx){
        //startRectが右の場合
        if(sy+sh/2 < ey+eh/2){
          //右上
          return {
            isValid: true,
            flow: "Right-Top"
          };
        }else{
          //右下
          return {
            isValid: true,
            flow:"Right-Bottom"
          };
        }
      }else{
        //例外
        return {
          isValid: false
        };
      }
    },


    viewRect(){
      const X = this.viewRectX;
      const Y = this.viewRectY;
      const F = this.viewRectFlow;

      if(X.isValid && Y.isValid && F.isValid){
        return {
          isValid: true,
          flow: F.flow,
          x: X.leftX,
          y: Y.topY,
          w: X.rightX  - X.leftX,
          h: Y.bottomY - Y.topY
        };
      }else{
        return {
          isValid: false
        };
      }
    },


    line1Style(){
      const rect = this.viewRect;
      if(rect.isValid){
        if(rect.flow === "Right-Top"){
          return {
            isValid: true,
            x: rect.x,
            y: rect.y+rect.h,
            length: rect.w/2
          };
        }else if(rect.flow === "Right-Bottom"){
          return {
            isValid: true,
            x: rect.x,
            y: rect.y,
            length: rect.w/2
          };
        }else{
          return {
            isValid: false,
            x: 0,
            y: 0,
            length: 0
          };
        }
      }else{
        return {
          isValid: false,
          x: 0,
          y: 0,
          length: 0
        };
      }
    },


    line2Style(){
      const rect = this.viewRect;
      if(rect.isValid){
          return {
            isValid: true,
            x: rect.x + rect.w/2,
            y: rect.y,
            length: rect.h
          };
      }else{
        return {
          isValid: false,
          x: 0,
          y: 0,
          length: 0
        };
      }
    },


    line3Style(){
      const rect = this.viewRect;
      if(rect.isValid){
        if(rect.flow === "Right-Top"){
          return {
            isValid: true,
            x: rect.x+rect.w/2,
            y: rect.y,
            length: rect.w/2
          };
        }else if(rect.flow === "Right-Bottom"){
          return {
            isValid: true,
            x: rect.x+rect.w/2,
            y: rect.y+rect.h,
            length: rect.w/2
          };
        }else{
          return {
            isValid: false,
            x: 0,
            y: 0,
            length: 0
          };
        }
      }else{
        return {
          isValid: false,
          x: 0,
          y: 0,
          length: 0
        };
      }
    }

  },
  methods:{
    update(){
      if(this.start !== undefined){
        const rect = this.start.getBoundingClientRect();
        this.startRect = {
          x: window.pageXOffset + rect.left,
          y: window.pageYOffset + rect.top,
          w: rect.right - rect.left,
          h: rect.bottom - rect.top
        };
      }
      if(this.end !== undefined){
        const rect = this.end.getBoundingClientRect();
        this.endRect = {
          x: window.pageXOffset + rect.left,
          y: window.pageYOffset + rect.top,
          w: rect.right - rect.left,
          h: rect.bottom - rect.top
        };
      }
    }
  }
}
</script>

<style>
.startBox{
  position: absolute;
  border: 1px solid green;
}

.endBox{
  position: absolute;
  border: 1px solid red;
}

.viewRect{
  position: absolute;
  border: 1px solid blue;
}

.LeaderLine{
  position: absolute;
  border: 1px solid black;
  margin: 0;
  padding: 0;
}

.HorizontalLine{
  height:0;
}

.VerticalLine{
  width:0;
}
</style>
