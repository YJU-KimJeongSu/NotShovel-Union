<template>
  <div class="home">
    <div class="inner" v-if="loginState == false">포트폴리오 들어갈 자리</div>
    <SelectProject v-else></SelectProject>
  </div>
</template>
<script>
import selectProject from '@/components/SelectProject.vue';

export default {
    data(){
        return {
            loginState: false // false면 로그아웃 상태, true면 로그인 상태
        }
    },
    mounted(){
        if(sessionStorage.getItem('member_id')){
            this.loginState = true;
        }
    },
    components :{
         SelectProject: selectProject
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

.inner {
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>