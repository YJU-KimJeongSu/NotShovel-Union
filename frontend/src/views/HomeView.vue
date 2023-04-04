<template>
    <div class="home">
        <div class="inner" v-if="loginState==false">포트폴리오 들어갈 자리</div>
        <SelectProject v-else></SelectProject>
        <button @click="test()">세션추가</button>
    </div>
</template>
<script>
import SelectProject from '@/components/SelectProject.vue';

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
        SelectProject
    },
    methods:{
        test(){
            sessionStorage.setItem('member_id','642aaa6b16ec02acf4f7c7fd');
            history.go(0);
        }
    }
}
</script>
<style scoped>
.home{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.inner{
    width: 70%;
    height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>