<template>
  <div class="logic-tree">
    <TreeNode :node="tree.getRoot()" />
  </div>
</template>

<script>
import TreeNode from '~/components/TreeNode.vue';
import { LogicTree } from '~/models/LogicTree'; // モデル部分のインポート

export default {
  name: 'LogicTree',
  components: {
    TreeNode,
  },
  data() {
    return {
      tree: new LogicTree(), // モデル部分のインスタンス化
    };
  },
};
</script>

<style scoped>
.logic-tree {
  margin-top: 20px;
}
</style>

