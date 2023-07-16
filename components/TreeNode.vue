<template>
  <div class="tree-node">
    <div class="padding"></div>
    <div class="flex">
      <div :style="{width:contentWidth+'px'}" ></div>
      <div class="line"></div>
      <div class="children">
        <TreeNode 
          ref="childrenComponentFirstHalf"
          v-for="(childNode,index) in node.children.slice(0,midIndex)" 
          :nodeId="childNode" />
      </div>
    </div>

    <LeaderLine ref="leaderLine" :start="startPoint" :end="endPoint"/> 
    <input 
      ref="nodeLabel" 
      v-model="node.label"
      @keydown="handleKeyDown"
      @click="activate()"
      @blur="onEditorBlur"
      tabindex="0"
      :class="(isOnCursor)?'node-label-oncursor':'node-label'"
      :readonly="!isEditMode"
      :style="{width:contentWidth+'px'}"
      type="text">

    <div class="flex">
      <div :style="{width:contentWidth+'px'}" ></div>
      <div class="line"></div>
      <div class="children">
        <TreeNode 
          ref="childrenComponentSecondHalf"
          v-for="(childNode,index) in node.children.slice(midIndex,nodeCount)" 
          :nodeId="childNode" />
      </div>
    </div>
    <div class="padding"></div>
  </div>
</template>

<script>

import { NuxtAdapterProvider } from '~/models/NuxtAdapter.ts'

export default {
  name: 'TreeNode',
  props: {
    nodeId: {
      type: String,
      required: true,
    }
  },
  data(){
    return {
      node: NuxtAdapterProvider.get().instanceStorage.getInstance(this.nodeId),
      startPoint: undefined,
      endPoint: undefined,
      model: NuxtAdapterProvider.get()
    }
  },
  updated(){
    this.$refs.leaderLine.update();
    if(this.isOnCursor){
      this.$refs.nodeLabel.focus();
    }
  },
  mounted(){
    this.$nextTick(()=>{
      if(this.$parent.$refs.nodeLabel!==undefined){
        this.startPoint = this.$parent.$refs.nodeLabel;
        this.endPoint   = this.$refs.nodeLabel;
      }
    });
    if(this.isOnCursor){
      this.$refs.nodeLabel.focus();
    }
  },
  watch:{
    nodeId(newValue,oldValue){
      this.node = NuxtAdapterProvider.get().instanceStorage.getInstance(this.nodeId);
    }
  },
  computed:{
    isOnCursor(){
      return this.model.cursor === this.nodeId;
    },
    isEditMode(){
      return this.model.editMode && this.isOnCursor;
    },
    contentWidth(){
      const canvas = document.createElement("canvas");
      const context = canvas.getContext('2d');
      
      context.font = "bold 16pt 'Noto Sans','sans-serif'"
      const width = context.measureText(this.node.label).width;

      return width;
    },
    midIndex(){
      if(this.node.children.length==0){
        return 0;
      }

      const nodeCounts = this.node.children.map(childId => {
        function count(nodeId,model){
          const children = model.getChildren(nodeId);
          if(children.length==0){
            return 1;
          }else{
            return children
                    .map((c)=>count(c,model))
                    .reduce((a,x)=>a+x);
          }
        }
        return count(childId,this.model);
      });

      const nodeCountSum = nodeCounts.reduce((a,x)=>a+x);

      let nodeCountCumulativeSum = 0;
      for(let i=0;i<nodeCounts.length;i++){
        nodeCountCumulativeSum += nodeCounts[i];
        if(nodeCountCumulativeSum > nodeCountSum-nodeCountCumulativeSum){
          return i;
        }
      }
      return this.node.children.length;
    },
    nodeCount(){
      return this.node.children.length;
    }
  },
  methods: {
    handleKeyDown(event) {
      if(this.model.editMode){
        if (event.key === 'Escape' || event.key === 'Enter'){
          this.model.deactivateEditMode();
        }
      }else{
        if (event.key === 'h') {
          this.model.controller.cursorMoveToParent();
        } else if (event.key === 'l') {
          this.model.controller.cursorMoveToChild();
        } else if (event.key === 'k') {
          this.model.controller.cursorMoveToPrevSibling();
        } else if (event.key === 'j') {
          this.model.controller.cursorMoveToNextSibling();
        } else if (event.key === 'i') {
          this.model.activateEditMode();
        } else if (event.key === 'o') {
          this.model.controller.addNextSiblingNode();
        } else if (event.key === 'O') {
          this.model.controller.addPrevSiblingNode();
        } else if (event.key === '>') {
          this.model.controller.addChildNode();
        } else if (event.key === 'd'){
          this.model.controller.deleteThisNode();
        } else if (event.key === 'D'){
          this.model.controller.deleteThisNodeForce();
        }
      }
    },
    onEditorBlur(){
      this.model.deactivateEditMode();
      if(this.isOnCursor){
        this.$refs.nodeLabel.focus();
      }
    },
    activate(){
      this.model.setCursor(this.nodeId);
    }
  }
};
</script>

<style scoped>
.tree-node {
}

.node-label {
  margin:0;
  padding-top:0;
  padding-bottom:0;
  border: solid black 1px;
  border-radius: 5px;
  padding-left:5px;
  padding-right:10px;
  height:1.5em;
  width:fit-content;
  font-weight: bold;
  font-size:16pt;
  font-family: "Noto Sans", sans-serif;
}

.node-label-oncursor {
  margin:0;
  padding-top:0;
  padding-bottom:0;
  border: solid black 1px;
  border-radius: 5px;
  padding-left:5px;
  padding-right:10px;
  height:1.5em;
  width:fit-content;
  font-weight: bold;
  font-size:16pt;
  font-family: "Noto Sans", sans-serif;
  font-weight: bold;
  background-color: yellow;
}

.children {
}

.padding{
  height:5px;
}

.flex{
  display:flex;
}

.line{
  width:3em;
}
</style>

