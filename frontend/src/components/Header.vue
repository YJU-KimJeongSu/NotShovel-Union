<template>
    <nav class="navbar">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand"><img src="../assets/logo2.png" width="120"></router-link>
        <form class="d-flex" role="search">
          <button class="btn btn-outline-light" @click="$router.push('signin')" >로그인</button>
          <button class="btn btn-outline-light" @click="$router.push('signup')">회원가입</button>
        </form>
      </div>
    </nav>

</template>

<script>
export default {
  name: 'Header',

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
</style>
