<template>
  <div class="container right-panel-active">
    <h2>회원정보 수정</h2>
    <div class="form">
      <span><label for="password" class="label">Password</label><input type="password" class="input" id="password" name="password" @keyup="checkInput()" v-model="password"></span>
      <span><label for="passwordCheck" class="label">PasswordCheck</label><input type="password" class="input" id="passwordCheck" name="passwordCheck" @keyup="checkInput()" v-model="passwordCheck"></span>
      <span><label for="name" class="label">Name</label><input type="text" class="input" id="name" name="name" @keyup="checkInput()" v-model="name"></span>
      <span><label for="phone" class="label">Phone</label><input type="text" class="input" id="phone" name="phone" @keyup="checkInput()" v-model="phone_number"></span>
      <p>{{ checkingText }}</p>
      <button class="btn" @click="editUserInfo()">수정</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      password: null,
      passwordCheck: null,
      phone_number: null,
      checkingText: '비어있는 칸이 있습니다',
    }
  },
  methods: {
    editUserInfo() {
      if (this.checkingText === '비어있는 칸이 있습니다') {
        alert('비어있는 칸이 있습니다');
      } else if (this.checkingText === '비밀번호를 확인해주세요') {
        alert('비밀번호를 확인해주세요');
      } else if (this.checkingText === '　') {
        axios.patch("/api/member/edit", {
          member_id: sessionStorage.getItem('member_id'),
          name: this.name,
          password: this.password,
          phone_number: this.phone_number,
        })
        .then((res) => {
          console.log(res);
          alert('정상적으로 수정되었습니다.');
          sessionStorage.setItem('mamber_name', res.data.name);
          location.href='/';
          })
          .catch((err) => {
            console.log(err);
            alert('수정에 실패했습니다.');
          })
      }
    },
    checkInput() {
      if (this.name == null ||
        this.password == null ||
        this.passwordCheck == null ||
        this.phone_number == null ||
        this.name == '' ||
        this.password == '' ||
        this.passwordCheck == '' ||
        this.phone_number == '') {
          console.log(1);
          this.checkingText = '비어있는 칸이 있습니다';
        } else if (this.password !== this.passwordCheck) {
          console.log(2);
          this.checkingText = '비밀번호를 확인해주세요';
        } else {
          console.log(3);
          this.checkingText = '　';
        }
    },
  },
}
</script>

<style scoped>
.container {
  background-color: #c0c0c0;
  border-radius: 0.7rem;
  box-shadow: 0 0.9rem 1.7rem rgba(0, 0, 0, 0.25),
    0 0.7rem 0.7rem rgba(0, 0, 0, 0.22);
  height: auto;
  max-width: 780px;
  overflow: hidden;
  width: 100%;
  transform: translate(0%, max(calc((100vh - 780px) / 2), 59px));
  padding: 30px 0 30px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.container > h2 {
  margin: 0.7rem 0 2rem 0;
}

.form {
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
  font-size: 20px;
  /* font-weight: 550; */
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
  width: 400px;
  margin-left: 60px;
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
  padding: 0.8rem 3rem;
  text-transform: uppercase;
  /* transition: transform 80ms ease-in; */
  transition: .75s;
  align-self: center;
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