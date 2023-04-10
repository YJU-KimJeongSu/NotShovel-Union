<template>
    <nav class="navbar">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand"><img src="../assets/logo2.png" width="120"></router-link>
        <p v-if="mamber_name" class="name">{{ mamber_name }}님 환영합니다!</p>
        <form class="d-flex" role="search">
          <button v-if="!loginState" class="btn btn-outline-light" @click="$router.push('signinup')" >로그인</button>
          <button v-if="loginState" class="btn btn-outline-light" @click="$router.push('editmember')" >회원정보 수정</button>
          <button v-if="loginState" class="btn btn-outline-light" @click="logout()" >로그아웃</button>
        </form>
      </div>
    </nav>

</template>

<script>
import router from '@/router';

export default {
  name: 'Header',

  data() {
    return {
      loginState: false, // false면 로그아웃 상태, true면 로그인 상태
      mamber_name: sessionStorage.getItem('mamber_name'),
    }
  },
  methods: {
    logout() {
      sessionStorage.removeItem('member_id');
      sessionStorage.removeItem('mamber_name');
      this.loginState = false;
      this.mamber_name = null;
      router.go(0);
    },
  },
  mounted() {
    if (!sessionStorage.getItem('member_id')) {
      this.loginState = false;
    } else {
      this.loginState = true;
    }
  }
}
</script>

<style scoped>
.header{
  padding: 0;
  margin: 0;
}
.navbar{
  padding: 5px 0;
  width: 100%;
  background-color: #11101D;
}
.container-fluid{
  width: 70%;
}
.btn {
  margin-left: 10px;
  height: 35px;
}

.name {
  color: #fff;
  /* margin: 0 0 0 40%; */
  margin-top: 9px;
}
</style>
