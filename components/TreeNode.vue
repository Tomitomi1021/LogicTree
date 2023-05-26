<template>
  <div class="tree-node">
    <div 
      class="node-label"
      tabindex='0'
      @keydown="handleKeyDown"
      ref="nodeLabel">{{ node.label }}</div>
    <div class="children">
      <TreeNode 
        v-for="(childNode,index) in node.children" 
        :node="childNode" 
        @activePrevSibling="()=>activateChildNode(index-1)"
        @activeNextSibling="()=>activateChildNode(index+1)"
        ref="childrenComponent"/>
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
      isActive:false
    }
  },
  methods: {
    handleKeyDown(event) {
      if (event.key === 'h') {
        this.activateParentNode();
      } else if (event.key === 'l') {
        this.activateFirstChildNode();
      } else if (event.key === 'k') {
        this.activatePreviousSiblingNode();
      } else if (event.key === 'j') {
        this.activateNextSiblingNode();
      }
    },
    activate(){
      this.$refs.nodeLabel.focus();
    },
    activateChildNode(index){
      if(index<0||this.$refs.childrenComponent.length<=index)return;

      const firstChildNode = this.$refs.childrenComponent[index];
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
      const firstChildNode = this.$refs.childrenComponent[0];
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
  margin-left: 20px;
}

.node-label {
  font-weight: bold;
}

.node-label:focus{
  font-weight: bold;
  background-color: yellow;
}

.node-label-active{
  font-weight: bold;
  background-color: yellow;
}

.children {
  margin-top: 10px;
}
</style>

