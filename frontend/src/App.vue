<template>
  <div>
    <Header></Header>
    <RouterView></RouterView>
  </div>
</template>
<script>
import header from './components/Header.vue';
import { RouterView } from 'vue-router';

export default {
  data() {
    return {

    }
  },
  components: {
    Header: header,
    RouterView
  }
}

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR&family=Noto+Sans+KR&display=swap');

#app {
  font-family:'IBM Plex Sans KR', 'Noto Sans KR', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
