<template>
  <div class="logic-tree">
    <TreeNode :node="tree.getRoot()" />
  </div>
</template>

<script>
import TreeNode from '~/components/TreeNode.vue';
import { LogicTree, Node } from '~/models/LogicTree'; // モデル部分のインポート

export default {
  name: 'LogicTree',
  components: {
    TreeNode,
  },
  data() {
    return {
      tree: (()=>{
        // モデル部分のインスタンス化
        let root = new Node('Root');
        let child1= new Node('Child1');
        let child11= new Node('Child11');
        let child12= new Node('Child12');
        let child2= new Node('Child2');
        let child21= new Node('Child21');
        let child22= new Node('Child22');
        
        let tree = new LogicTree(root);
        tree.addNode(root,child1);
        tree.addNode(child1,child11);
        tree.addNode(child1,child12);
        tree.addNode(root,child2);
        tree.addNode(child2,child21);
        tree.addNode(child2,child22);
        return tree;
      })()
    };
  },
};
</script>

<style scoped>
.logic-tree {
  margin-top: 20px;
}
</style>

