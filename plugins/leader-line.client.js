import LeaderLine from 'leader-line-vue';

export default defineNuxtPlugin(()=>{
  return {
    provide: {
      setLine(start,end,option={}){
        LeaderLine.setLine(start,end,option);
      }
    }
  }
});
