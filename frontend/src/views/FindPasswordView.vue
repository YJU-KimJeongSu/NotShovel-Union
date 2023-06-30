<template>
  <div class="container right-panel-active">
    <h4>비밀번호 재설정</h4>
    <div class="form">
      <span><input type="password" class="input" id="password" name="password" placeholder="새 비밀번호" @keyup="" v-model="password"></span>
      <span><input type="password" class="input" id="passwordCheck" name="passwordCheck" placeholder="새 비밀번호 확인" @keyup="" v-model="passwordCheck"></span>
      <button class="btn" v-if="isActive" @click="updatePassword()">수정</button>
      <div @click="passwordNotEq()"><button class="btn" v-if="!isActive" disabled>수정</button></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: null,
      password: null,
      passwordCheck: null,
    }
  },
  computed: {
    isActive() {
      return (this.password == this.passwordCheck) && (this.password != null);
    }
  },
  methods: {
    passwordNotEq() {
      alert('비밀번호를 확인해주세요');
    },
    async updatePassword() {
      try {
        const data = {
          email: this.email,
          password: this.password,
        }
        const res = await axios.patch(`https://${process.env.VUE_APP_SERVER_URL}/api/member/passwordReset`, data);
        alert('비밀번호가 정상적으로 변경되었습니다. 다시 로그인해주세요')
        location.href = '/';
      } catch (error) {
        console.log(error);
        alert('비밀번호 변경 중 문제가 발생했습니다.');
      }
    }
  },
  mounted() {
    this.email = this.$store.getters.getUserEmail;
  },
}
</script>

<style scoped>
.container {
  background-color: #d9d9d9;
  border-radius: 0.7rem;
  box-shadow: 0 0.9rem 1.7rem rgba(0, 0, 0, 0.25),
    0 0.7rem 0.7rem rgba(0, 0, 0, 0.22);
  height: auto;
  max-width: 780px;
  overflow: hidden;
  width: 100%;
  transform: translate(0%, max(calc((100vh - 560px) / 2), 108px));
  padding: 30px 0 30px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 25%;
}

.container > h4 {
  margin: 0.7rem 0 2rem 0;
}

.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form > span {
  margin: 20px 0 20px 0;
}

.label {
  width: 100px;
  font-size: 20px;
}

.input {
  background-color: #fff;
  font-size: 17px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
  width: 400px;
}

input:focus::placeholder {
  color: transparent;
  transition: color 0.3s ease-in-out;
}

.form > p {
  text-align: center;
  align-self: center;
  color: red;
  font-weight: 600;
  font-size: 16px;
  margin-top: 2rem;
}

.btn {
  background-color: #666;
  background-image: linear-gradient(90deg, #777 0%, #444 74%);
  border-radius: 20px;
  border: 0px;
  color: #fff;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.1rem;
  padding: 0.6rem 2rem;
  text-transform: uppercase;
  /* transition: transform 80ms ease-in; */
  transition: .75s;
  align-self: center;
  margin-top: 20px;
}

.btn:hover {
  background-color: #333;
  color: #ccc;
  background-image: none;
}

.btn:active {
  transform: scale(0.95);
}

.btn:focus {
  outline: none;
}
</style>