<template>
  <div class="logic-tree">
    <div class="projectMenu">
      <div @click="saveButton" class="button">save</div>
      <label for="loadButton" class="button">load</label>
      <div @click="changeProjectName" class="projectname" >{{ projectName }}</div>
      <input id="loadButton" @input="loadButton" type="file" accept="application/json" style="opacity:0">
    </div>

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
      model: NuxtAdapterProvider.get(),
      projectName: "untitled"
    }
  },
  methods:{
    changeProjectName(){
      const projectName = window.prompt("プロジェクト名を決めてください．",this.projectName);
      if(projectName != null){
        this.projectName = projectName;
      }
    },
    saveButton(){
      const storage = this.model.instanceStorage.getStorage();
      const json = JSON.stringify({
        projectName: this.projectName,
        root: this.model.rootNode,
        storage: storage
      });
      const blob = new Blob([json], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', this.projectName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    loadButton(e){
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = ()=>{
        const data = JSON.parse(reader.result);
        this.model.instanceStorage.setStorage(data.storage);
        this.model.rootNode = data.root;
        this.model.cursor = data.root;
        this.projectName = data.projectName;
      };

      reader.readAsText(file);
    }
  }
};
</script>

<style scoped>
.logic-tree {
  margin-top: 20px;
}

.projectMenu{
  display:flex;
  align-items: center;
  margin:0;
  margin-bottom: 2em;
  padding-bottom:1em;
  border-bottom: solid black 1px;
}

.button{
  border: solid black 1px;
  border-radius: 5px;
  padding-left:0.5em;
  padding-right:0.5em;
  margin-left:0.5em;
}

.projectname{
  margin-left:auto;
  margin-right:auto;
  font-size:20pt;
  font-weight:bold;
  width:fit-content;
}

#loadButton{ 
  width:0;
}
</style>

