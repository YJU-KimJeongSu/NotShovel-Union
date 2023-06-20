<template>
  <!-- <div class="container right-panel-active"></div> -->
  <div class="container" :class="{active: isActive}">
    <!-- Sign Up -->
    <div class="container__form container--signup">
      <form action="#" class="form" id="form1">
        <h2 class="form__title">Sign Up</h2>
        <div class="user-box">
          <input type="email" placeholder="Email" class="input" v-model="signup.email" @keydown="authReset()" />
          <input type="password" placeholder="Password" class="input" v-model="signup.password" />
          <input type="password" placeholder="PasswordCheck" class="input" v-model="signup.passwordCheck" />
          <input type="text" placeholder="Name" class="input" v-model="signup.name" />
          <input type="text" placeholder="Phone" class="input" v-model="signup.phone_number">
          <a href="#" v-if="authState == 0" @click="emailAuth()" class="authBtn">인증 메일 전송</a>
          <input type="text" v-if="authState == 1" v-model="inputAuthCode" class="input" style="width: 40%; text-align: center;">
          <a href="#" v-if="authState == 1" @click="authCheck()" class="authBtn">인증</a>
          <p v-if="authState == 3" class="authBtn">메일 전송중입니다...</p>
        </div>
        <button class="btn" @click="signUp()">Sign Up</button>
      </form>
    </div>

    <!-- Sign In -->
    <div class="container__form container--signin">
      <form action="#" class="form" id="form2">
        <h2 class="form__title">Sign In</h2>
        <div class="user-box">
          <input type="email" placeholder="Email" class="input" v-model="signin.email" />
          <input type="password" placeholder="Password" class="input" v-model="signin.password" />
        </div>
        <a href="/prefindpassword" class="link">Forgot your password?</a>
        <button class="btn" @click="signIn()">Sign In</button>
      </form>
    </div>

    <!-- Overlay -->
    <div class="container__overlay">
      <div class="overlay">
        <div class="overlay__panel overlay--left">
          <!-- <button class="btn" id="signIn" @click="overlay__panelChange1()">Sign In</button> -->
          <button class="btn" id="signIn" @click="panelChange()">Sign In</button>
        </div>
        <div class="overlay__panel overlay--right">
          <!-- <button class="btn" id="signUp" @click="overlay__panelChange2()">Sign Up</button> -->
          <button class="btn" id="signUp" @click="panelChange()">Sign Up</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router';
import axios from 'axios';

export default {
  data() {
    return {
      isActive: false,
      signup: {
        name: null,
        email: null,
        password: null,
        passwordCheck: null,
        phone_number: null,
      },
      signin: {
        email: null,
        password: null,
      },
      _emailAuthCode: null,
      authState: 0,  // 0 = 전송 전, 1 = 전송 후, 2 = 인증 성공, 3 = 로딩
      inputAuthCode: null,
    }
  },
  methods: {
    // overlay__panelChange1() {
    //   document.querySelector(".container").classList.remove("right-panel-active");
    // },
    // overlay__panelChange2() {
    //   document.querySelector(".container").classList.add("right-panel-active");
    // },
    panelChange() {
      this.isActive = !this.isActive;
    },
    async signUp() {
      if (this.signup.password != this.signup.passwordCheck) {
        alert('비밀번호를 다시 확인해주세요');
      } else if (
        this.signup.name == null ||
        this.signup.email == null ||
        this.signup.password == null ||
        this.signup.phone_number == null ||
        this.signup.name == '' ||
        this.signup.email == '' ||
        this.signup.password == '' ||
        this.signup.phone_number == ''
      ) {
        alert('비어있는 칸이 있습니다.');
      } else if (this.authState != 2) {
        alert('이메일 인증을 진행해주세요');
      } else {
        await axios.post(`http://${process.env.VUE_APP_SERVER_URL}/api/auth/signup`, {
          name: this.signup.name,
          email: this.signup.email,
          password: this.signup.password,
          phone_number: this.signup.phone_number
        })
          .then((res) => {
            console.log(res);
            alert('회원가입에 성공했습니다.');
            router.go(0);
          })
          .catch((err) => {
            if (err.response.status === 409) {
              const error = err.response.data.error;
              console.log(error);
              if (error === 'duplicate email') alert('회원가입에 실패했습니다.\n사유 : 중복된 아이디');
              else if (error === 'duplicate phone') alert('회원가입에 실패했습니다.\n사유 : 중복된 휴대폰 번호');
            } else {
              console.log(err);
              alert('회원가입에 실패했습니다.');
            }
          })
      }
    },
    async signIn() {
      if (
        this.signin.email == null ||
        this.signin.password == null ||
        this.signin.email == '' ||
        this.signin.password == ''
      ) {
        alert('비어있는 칸이 있습니다');
      } else {
        await axios.post(`http://${process.env.VUE_APP_SERVER_URL}/api/auth/signin`, {
          email: this.signin.email,
          password: this.signin.password,
        })
          .then((res) => {
            sessionStorage.setItem('member_id', res.data.member_id);
            sessionStorage.setItem('member_name', res.data.name);
            sessionStorage.setItem('member_image', res.data.image);
            this.$store.dispatch('login', res.data.token);
            location.href = '/';
          })
          .catch((err) => {
            if (err.response.status == 401) {
              alert('잘못된 이메일 혹은 비밀번호 입니다.');
            } else if (err.response.status == 404) {
              alert('회원 탈퇴 처리된 아이디입니다.');
            } else {
              console.log(err);
              alert('로그인에 실패했습니다.');
            }
          })
      }
    },
    async emailAuth() {
      this.authState = 3; // 0 = 전송 전, 1 = 전송 후, 2 = 인증 성공, 3 = 로딩
      await axios.get(`http://${process.env.VUE_APP_SERVER_URL}/api/member/emailAuth?email=` + this.signup.email) // 이메일 전송하기
        .then((res) => {
          this._emailAuthCode = res.data.num;
          this.authState = 1; // 0 = 전송 전, 1 = 전송 후, 2 = 인증 성공, 3 = 로딩
        })
        .catch((err => {
          console.log(err);
          alert('메일 전송에 실패했습니다. 이메일을 확인해주세요.');
          this.authState = 0; // 0 = 전송 전, 1 = 전송 후, 2 = 인증 성공, 3 = 로딩
        }))
    },
    authCheck() {
      if (this.inputAuthCode == this._emailAuthCode) {
        this.authState = 2; // 0 = 전송 전, 1 = 전송 후, 2 = 인증 성공, 3 = 로딩
        alert('이메일 인증에 성공했습니다');
      } else {
        if (confirm('인증코드가 잘못되었습니다. 다시 전송할까요?')) this.emailAuth();
      }
    },
    authReset() {
      this.authState = 0; // 0 = 전송 전, 1 = 전송 후, 2 = 인증 성공, 3 = 로딩
      this.authState = false;
    },
  },
}
</script>

<style scoped>
.authBtn {
  text-decoration: none;
  margin: 5px;
  color: black;
  font-weight: 600;
}

.form__title {
  font-weight: 300;
  margin: 0;
  margin-bottom: 1.25rem;
}

.link {
  color: #333;
  font-size: 0.9rem;
  margin: 1rem 0;
  text-decoration: none;
  transition: 0.7s;
}

.link:hover {
  color: black;
  font-size: 1rem;
}

.container {
  background-color: #d9d9d9;
  border-radius: 0.7rem;
  box-shadow: 0 0.9rem 1.7rem rgba(0, 0, 0, 0.25),
    0 0.7rem 0.7rem rgba(0, 0, 0, 0.22);
  height: 520px;
  /* height: 620px; */
  max-width: 758px;
  overflow: hidden;
  position: relative;
  width: 100%;
  transform: translate(0%, max(calc((100vh - 690px) / 2), 59px));
}

.container__form {
  height: 100%;
  position: absolute;
  top: 0;
  transition: all 0.6s ease-in-out;
}

.container--signin {
  left: 0;
  width: 50%;
  z-index: 2;
}

.container.active .container--signin {
  transform: translateX(100%);
}

.container--signup {
  left: 0;
  opacity: 0;
  width: 50%;
  z-index: 1;
}

.container.active .container--signup {
  /* animation: show 0.6s; */
  opacity: 1;
  transform: translateX(100%);
  z-index: 5;
}

.container__overlay {
  height: 100%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 0;
  transition: transform 0.6s ease-in-out;
  width: 50%;
  z-index: 100;
}

.container.active .container__overlay {
  transform: translateX(-100%);
}

.overlay {
  background-color: #11101C;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  left: -100%;
  position: relative;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  width: 200%;
}

.container.active .overlay {
  transform: translateX(50%);
}

.overlay__panel {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  position: absolute;
  text-align: center;
  top: 0;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  width: 50%;
}

.overlay--left {
  transform: translateX(-20%);
}

.container.active .overlay--left {
  transform: translateX(0);
}

.overlay--right {
  right: 0;
  transform: translateX(0);
}

.container.active .overlay--right {
  transform: translateX(20%);
}

.btn {
  background-color: #666;
  background-image: linear-gradient(90deg, #777 0%, #444 74%);
  border-radius: 20px;
  border: 0px;
  color: #fff;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 0.1rem;
  padding: 0.9rem 4rem;
  text-transform: uppercase;
  /* transition: transform 80ms ease-in; */
  transition: .75s;
}

.form>.btn {
  margin-top: 1.5rem;
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

.form {
  background-color: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 3rem;
  height: 100%;
  text-align: center;
}

.input {
  background-color: #fff;
  border: none;
  padding: 0.6rem 0.6rem;
  margin: 0.1rem 0;
  width: 100%;
}

.user-box {
  position: relative;
}

.user-box input {
  width: 100%;
  padding: 7px 0;
  font-size: 16px;
  margin-bottom: 12px;
  margin-top: 12px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}

input:focus::placeholder {
  color: transparent;
  transition: color 0.3s ease-in-out;
}

@keyframes show {

  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }

  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}
</style>