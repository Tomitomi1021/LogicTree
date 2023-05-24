<template>
  <div class="tree-node">
    <div class="node-label">{{ node.label }}</div>
    <div class="children">
      <TreeNode v-for="childNode in node.children" :key="childNode.id" :node="childNode" />
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
};
</script>

<style scoped>
.tree-node {
  margin-left: 20px;
}

.node-label {
  font-weight: bold;
}

.children {
  margin-top: 10px;
}
</style>

