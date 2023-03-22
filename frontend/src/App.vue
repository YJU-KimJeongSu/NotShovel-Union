<template>
  <div>
    <Header></Header>

    <!-- mongoose 테스트 위한 임시 회원가입/로그인 -->
    <SignIn v-if="!signup"></SignIn>
    <SignUp v-else></SignUp>
    <button @click="signup=!signup">체인지</button>

    <Footer></Footer>
  </div>
</template>
<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import SignIn from './components/SignIn.vue';
import SignUp from './components/SignUp.vue';

export default {
  data(){
    return{
      signup: false
    }
  },
  components: {
    Header,
    Footer,
    SignIn,
    SignUp
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

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
