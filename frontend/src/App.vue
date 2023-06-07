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
        test: 'null?'
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
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* 가로 스크롤 숨김 */
}
body::-webkit-scrollbar {
  width: 10px;
}

body::-webkit-scrollbar-thumb {
  background-color: gray;
  border-radius: 10px;
  background-clip: padding-box;
  border: 2px solid transparent;
}

body::-webkit-scrollbar-track {
  background-color: #ccc;
  border-radius: 10px;
  box-shadow: inset 0px 0px 5px white;
}
#app {
  font-family:'IBM Plex Sans KR', 'Noto Sans KR', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
