<template>
    <div class="home">
        <!-- <div class="inner">포트폴리오 들어갈 자리</div> -->
        <SelectProject></SelectProject>
    </div>
</template>
<script>
import SelectProject from '@/components/SelectProject.vue';


export default {
    components :{
        SelectProject
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