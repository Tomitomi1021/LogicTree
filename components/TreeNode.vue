<template>
  <div class="tree-node">
    <div class="flex">
      <div class="padding"></div>
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

    <pre
      ref="nodeLabel"
      v-show="!editMode"
      @keydown="handleKeyDownAtNormalMode"
      class="node-label"
      tabindex='0'>{{ node.label }}</pre>
    <input 
      ref="nodeLabelEditor" 
      v-show="editMode"
      v-model="node.label"
      @keydown="handleKeyDownAtEditMode"
      @input="adjustContentWidth"
      @blur="onEditorBlur"
      class="node-label"
      :style="{width:contentWidth+'px'}"
      type="text">

    <div class="flex">
      <div class="padding"></div>
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
      contentWidth:0
    }
  },
  computed:{
    midIndex(){
      return Math.floor(this.node.children.length/2);
    },
    nodeCount(){
      return this.node.children.length;
    }
  },
  methods: {
    handleKeyDownAtNormalMode(event) {
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
    },
    childrenComponent(index){
      if(index < this.midIndex){
        return this.$refs.childrenComponentFirstHalf[index];
      }else{
        return this.$refs.childrenComponentSecondHalf[index-this.midIndex];
      }
    },
    adjustContentWidth(){
      const editor = this.$refs.nodeLabelEditor;
      this.contentWidth= 0;
      this.$nextTick(()=>{
        this.contentWidth = editor.scrollWidth - 9 ;
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
    handleKeyDownAtEditMode(event){
      if (event.key === 'Escape' || event.key === 'Enter'){
        this.deactivateEditMode();
      }
    },
    activate(){
      this.$refs.nodeLabel.focus();
    },
    activateEditMode(){
      this.editMode=true;
      this.$nextTick(()=>{
        this.$refs.nodeLabelEditor.focus();
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

.flex{
  display:flex;
}

.padding{
  width:90px;
}
</style>

