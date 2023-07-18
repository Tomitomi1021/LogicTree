<template>
  <div class="tree-node">
    <div class="padding"></div>
    <div class="flex">

      <div v-if="node.parent!==null" class="lines">
        <LeaderLine 
          ref="leaderLine" 
          :start="startPoint" 
          :end="endPoint"/> 
      </div>

      <div class="node">
        <input 
          ref="nodeLabel" 
          v-model="node.label"
          @compositionstart="compositionStart"
          @compositionend="compositionEnd"
          @compositionupdate="compositionUpdate"
          @keydown="handleKeyDown"
          @click="activate()"
          @blur="onEditorBlur"
          tabindex="0"
          :class="['node-label',(isEditMode)?'node-label-editing':(isOnCursor)?'node-label-oncursor':'']"
          :readonly="!isEditMode"
          :style="{width:contentWidth+'px'}"
          type="text">
      </div>

      <div class="children">
        <TreeNode 
          ref="childrenComponents"
          v-for="(childNode,index) in node.children.slice(0,node.children.length)" 
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
      model: NuxtAdapterProvider.get(),
      inputtingData: ""
    }
  },
  updated(){
    if(this.$refs.leaderLine!==undefined){
      this.$refs.leaderLine.update();
    }
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
    },
    contentWidth(newValue,oldValue){
      this.parentContentWidthChanged();
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
      const width = context.measureText(
                      this.node.label+this.inputtingData).width;

      return width;
    },
  },
  methods: {
    compositionStart(){
      this.inputtingData = "";
    },
    compositionEnd(){
      this.inputtingData = "";
    },
    compositionUpdate(e){
      this.inputtingData = e.data;
    },
    parentContentWidthChanged(){
      this.$forceUpdate();
      if(this.$refs.childrenComponents!== undefined){
        this.$refs.childrenComponents.forEach((child)=>{
          child.parentContentWidthChanged();
        });
      }
    },
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
          setTimeout(()=>{
            this.model.activateEditMode();
          },1);
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
.padding{
  height:0.5em;
}

.flex{
  display:flex;
  align-items:center;
}

.lines{
  width:40px;
  height:auto;
  margin:0;
  padding:0;
}

.node {
}

.children {
}

.node-label {
  padding-top:0;
  padding-bottom:0;
  padding-left:5px;
  padding-right:10px;

  border: solid black 1px;
  border-radius: 5px;

  height:1.5em;

  font-weight: bold;
  font-size:16pt;
  font-family: "Noto Sans", sans-serif;
}

.node-label-oncursor {
  background-color: yellow;
}

.node-label-editing {
  background-color: aquamarine;
}

</style>

