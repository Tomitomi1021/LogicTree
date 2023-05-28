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
          :node="childNode" 
          @activePrevSibling="()=>activateChildNode(index-1)"
          @activeNextSibling="()=>activateChildNode(index+1)"
          @addPrevSibling="()=>addChildNode(index)"
          @addNextSibling="()=>addChildNode(index+1)"
          @deleteMe="()=>deleteChildNode(index)"/>
      </div>
    </div>

    <input 
      ref="nodeLabel" 
      v-model="node.label"
      @keydown="handleKeyDown"
      @input="adjustContentWidth"
      @blur="onEditorBlur"
      tabindex="0"
      class="node-label"
      :readonly="!editMode"
      :style="{width:contentWidth+'px'}"
      type="text">

    <div class="flex">
      <div :style="{width:contentWidth+'px'}" ></div>
      <div class="line"></div>
      <div class="children">
        <TreeNode 
          ref="childrenComponentSecondHalf"
          v-for="(childNode,index) in node.children.slice(midIndex,nodeCount)" 
          :node="childNode" 
          @activePrevSibling="()=>activateChildNode(index+midIndex-1)"
          @activeNextSibling="()=>activateChildNode(index+midIndex+1)"
          @addPrevSibling="()=>addChildNode(index+midIndex)"
          @addNextSibling="()=>addChildNode(index+midIndex+1)"
          @deleteMe="()=>deleteChildNode(index+midIndex)"/>
      </div>
    </div>
    <div class="padding"></div>
  </div>
</template>

<script>

export default {
  name: 'TreeNode',
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  data(){
    return {
      isActive:false,
      editMode:false,
      contentWidth:0,
    }
  },
  mounted(){
    this.adjustContentWidth();
  },
  computed:{
    midIndex(){
      if(this.node.children.length==0){
        return 0;
      }

      const nodeCounts = this.node.children.map(child => {
        function count(n){
          if(n.children.length==0){
            return 1;
          }else{
            return n.children
                  .map((c)=>count(c))
                  .reduce((a,x)=>a+x);
          }
        }
        return count(child);
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
      if(this.editMode){
        if (event.key === 'Escape' || event.key === 'Enter'){
          this.deactivateEditMode();
        }
      }else{
        if (event.key === 'h') {
          this.activateParentNode();
        } else if (event.key === 'l') {
          this.activateFirstChildNode();
        } else if (event.key === 'k') {
          this.activatePreviousSiblingNode();
        } else if (event.key === 'j') {
          this.activateNextSiblingNode();
        } else if (event.key === 'i') {
          this.activateEditMode();
        } else if (event.key === 'o') {
          this.addNextSiblingNode();
        } else if (event.key === 'O') {
          this.addPrevSiblingNode();
        } else if (event.key === '>') {
          this.addChildNode();
        } else if (event.key === 'd'){
          this.deleteThisNode();
        } else if (event.key === 'D'){
          this.deleteThisNodeForce();
        }
      }
    },
    childrenComponent(index){
      if(index < this.midIndex){
        return this.$refs.childrenComponentFirstHalf[index];
      }else{
        return this.$refs.childrenComponentSecondHalf[index-this.midIndex];
      }
    },
    adjustContentWidth(){
      const editor = this.$refs.nodeLabel;
      this.contentWidth= 0;
      this.$nextTick(()=>{
        this.contentWidth = editor.scrollWidth-5;
      });
    },
    deleteThisNodeForce(){
      this.$emit("deleteMe");
    },
    deleteThisNode(){
      if(this.node.children.length==0){
        this.$emit("deleteMe");
      }
    },
    deleteChildNode(index){
      let target = this.childrenComponent(index).node;
      this.node.removeChild(target);
      this.$nextTick(()=>{
        if(this.node.children.length == 0){
          this.activate();
        }else if(index == this.node.children.length){
          this.childrenComponent(index-1).activate();
        }else{
          this.childrenComponent(index).activate();
        }
      });
    },
    addPrevSiblingNode(){
      this.$emit("addPrevSibling");
    },
    addNextSiblingNode(){
      this.$emit("addNextSibling");
    },
    addChildNode(newNodeIndex = this.node.children.length){
      this.node.newChild(newNodeIndex,"new node");

      this.$nextTick(()=>{
        this.childrenComponent(newNodeIndex).activate();
      })
    },
    onEditorBlur(){
      this.editMode=false;
    },
    activate(){
      this.$refs.nodeLabel.focus();
      this.adjustContentWidth();
    },
    activateEditMode(){
      this.editMode=true;
      this.$nextTick(()=>{
        this.$refs.nodeLabel.focus();
      });
      this.adjustContentWidth();
    },
    deactivateEditMode(){
      this.editMode=false;
      this.$nextTick(()=>{
        this.$refs.nodeLabel.focus();
      });
    },
    activateChildNode(index){
      if(index<0||this.node.children.length<=index)return;

      const firstChildNode = this.childrenComponent(index);
      if (firstChildNode && firstChildNode.activate) {
        firstChildNode.activate();
      }
    },
    activateParentNode() {
      const parentNode = this.$parent;
      if (parentNode && parentNode.activate) {
        parentNode.activate();
      }
    },
    activateFirstChildNode() {
      const firstChildNode = this.childrenComponent(0);
      if (firstChildNode && firstChildNode.activate) {
        firstChildNode.activate();
      }
    },
    activatePreviousSiblingNode() {
      this.$emit("activePrevSibling");
    },
    activateNextSiblingNode() {
      this.$emit("activeNextSibling");
    }
  }
};
</script>

<style scoped>
.tree-node {
}

.node-label {
  font-weight: bold;
  margin:0;
  padding-top:0;
  padding-bottom:0;
  border: solid black 1px;
  border-radius: 5px;
  padding-left:5px;
  padding-right:5px;
  height:1.5em;
  width:fit-content;
  font-size:16pt;
  font-family: "Noto Sans", sans-serif;
}

.node-label:focus{
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

