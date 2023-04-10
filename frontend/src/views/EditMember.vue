<template>
  <div class="container right-panel-active">
    <h2>회원정보 수정</h2>
    <div class="form">
      <span class="span"><label for="" class="label">Email</label><input type="text" class="input"></span>
      <span><label for="" class="label">Password</label><input type="text" class="input"></span>
      <span><label for="" class="label">PasswordCheck</label><input type="text" class="input"></span>
      <span><label for="" class="label">Name</label><input type="text" class="input"></span>
      <span><label for="" class="label">Phone</label><input type="text" class="input"></span>
      <p>나는 행복합니다</p>
      <button class="btn">수정</button>
    </div>
  </div>
</template>

<script>
import router from '@/router';
import axios from 'axios';

export default {
  data() {
    return {
      name: null,
      email: null,
      password: null,
      passwordCheck: null,
      phone_number: null,
    }
  },
  methods: {

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
  visibility: hidden;
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