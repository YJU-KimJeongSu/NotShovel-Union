<template>
  <div class="home">
    <PortFolio v-if="!this.$store.getters.getToken"></PortFolio>
    <SelectProject v-else></SelectProject>
  </div>
</template>
<script>
import selectProject from '@/components/SelectProject.vue';
import portFolio from '@/components/Portfolio.vue';

export default {
    mounted(){
        sessionStorage.removeItem('project_id');
        sessionStorage.removeItem('currentView');
        sessionStorage.removeItem('project_description');
        sessionStorage.removeItem('project_name');
    },
    components :{
         SelectProject: selectProject,
         PortFolio: portFolio
    },
  }
</script>
<style scoped>
.home {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

</style>