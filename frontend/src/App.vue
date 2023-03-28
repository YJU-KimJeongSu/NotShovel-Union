<template>
  <div>
    <Header></Header>
    <RouterView></RouterView>
    <Footer></Footer>
  </div>
</template>
<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { RouterView } from 'vue-router';

export default {
  data(){
    return{

    }
  },
  components: {
    Header,
    Footer,
    RouterView
}
}

</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
