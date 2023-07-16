<template>
  <div class="logic-tree">
    <TreeNode 
       :nodeId="model.rootNode" />
  </div>
</template>

<script>
import TreeNode from '~/components/TreeNode.vue';
import { NuxtAdapterProvider } from '~/models/NuxtAdapter.ts'

export default {
  name: 'LogicTree',
  components: {
    TreeNode
  },
  data(){
    return {
      model: NuxtAdapterProvider.get()
    }
  },
};
</script>

<style scoped>
.logic-tree {
  margin-top: 20px;
}
</style>

