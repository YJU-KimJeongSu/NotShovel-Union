<template>
  <div class="container right-panel-active">
    <h4>이메일 확인</h4>
    <div class="form">
      <span><input type="email" class="input" id="email" name="email" placeholder="회원 가입 시 입력한 이메일"
          v-model="email" @keyup="emailChanged()"></span>
      <button class="btn" @click="sendFindPasswordEmail()">메일 전송</button>
      <br><br>
      <div v-if="isSend" class="auth-num">
        <input type="text" class="input" placeholder="인증번호 입력" v-model="inputNum">
        <br>
        <button class="btn" @click="checkNum()">인증번호 확인</button>
      </div>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: null,
      isSend: false,
      _emailAuthCode: null,
      inputNum: null,
    }
  },
  methods: {
    async sendFindPasswordEmail() {
      try {
        this.isSend = false;
        const res = await axios.get('/api/member/chkEmail?email=' + this.email);
        this._emailAuthCode = res.data.num;
        this.isSend = true;
      } catch (error) {
        console.log(error);
        alert('메일 전송에 실패했습니다. 이메일을 확인해주세요');
      }
    },
    async checkNum() {
      if ((this._emailAuthCode != null) && (this._emailAuthCode == this.inputNum)) {
        this.$store.commit('setUserEmail', this.email);
        location.href = '/findpassword';
      } else {
        alert('잘못된 인증번호입니다.');
      }
    },
    emailChanged() {
      this.isSend = false;
      this._emailAuthCode = null;
    }
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
  padding: 30px 0 0 0;
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
  font-size: 17px;
}

.input {
  background-color: #fff;
  font-size: 17px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
  width: 400px;
  margin-bottom: 20px;
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
  /* margin-top: 20px; */
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

.auth-num {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.auth-num>.input {
  font-size: 16px;
  text-align: center;
  width: 60%;
  margin: 0;
}

.auth-num>.btn {
  width: 70%;
  height: 20%;
  font-size: 16px;
  padding-left: 5%;
  text-align: center;
  margin-bottom: 50px;
}
</style>