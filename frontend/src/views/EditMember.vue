<template>
  <div class="container right-panel-active">
    <h2>회원정보 수정</h2>
    <div class="form">
      <span><label for="password" class="label">Password</label><input type="password" class="input" id="password" name="password" @keyup="checkInput()" v-model="password"></span>
      <span><label for="passwordCheck" class="label">PasswordCheck</label><input type="password" class="input" id="passwordCheck" name="passwordCheck" @keyup="checkInput()" v-model="passwordCheck"></span>
      <span><label for="name" class="label">Name</label><input type="text" class="input" id="name" name="name" @keyup="checkInput()" v-model="name"></span>
      <span><label for="phone" class="label">Phone</label><input type="text" class="input" id="phone" name="phone" @keyup="checkInput()" v-model="phone_number"></span>
      <span><label for="profile" class="label">Profile</label><input class="form-control image-form" ref="image" accept="image/*" type="file" id="profile"></span>
      <p>{{ checkingText }}</p>
      <button class="btn" @click="editUserInfo()">수정</button>
      <button class="delete-btn" @click="deleteUser()">회원 탈퇴</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: null,
      password: null,
      passwordCheck: null,
      phone_number: null,
      checkingText: '비어있는 칸이 있습니다',
      member_id: sessionStorage.getItem('member_id'),
    }
  },
  methods: {
    async editUserInfo() {
      const filename = await this.saveImage();
      if (this.checkingText === '비어있는 칸이 있습니다') {
        alert('비어있는 칸이 있습니다');
      } else if (this.checkingText === '비밀번호를 확인해주세요') {
        alert('비밀번호를 확인해주세요');
      } else if (this.checkingText === '　') {
        axios.patch("/api/member/edit", {
          member_id: this.member_id,
          name: this.name,
          password: this.password,
          phone_number: this.phone_number,
          image: filename,
        })
          .then((res) => {
            console.log(res);
            alert('정상적으로 수정되었습니다.');
            sessionStorage.setItem('member_name', res.data.name);
            sessionStorage.setItem('member_image', res.data.image);
            location.href = '/';
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
          this.checkingText = '비어있는 칸이 있습니다';
        } else if (this.password !== this.passwordCheck) {
          this.checkingText = '비밀번호를 확인해주세요';
        } else {
          this.checkingText = '　';
        }
    },
    deleteUser() {
      if (this.checkingText === '비어있는 칸이 있습니다') {
        alert('비어있는 칸이 있습니다');
      } else if (this.checkingText === '비밀번호를 확인해주세요') {
        alert('비밀번호를 확인해주세요');
      } else if (this.checkingText === '　') {
        axios.delete('/api/member/delete', {
          // delete 요청은 payload body를 사용하지 않고 url 파라미터를 사용함
          // 단 현재 보안 토큰 등의 개념이 부족하므로 payload body를 사용하기 위해 data 속성을 따로 추가해서 넣음
          data: {
            member_id: this.member_id,
            password: this.password
          },
        })
          .then(() => {
            alert('정상적으로 탈퇴 처리가 되었습니다.');
            sessionStorage.removeItem('member_name');
            sessionStorage.removeItem('member_id');
            location.href = '/';
          })
          .catch((err) => {
            console.log(err);
            if (err.response.status === 404) {
              alert('잘못된 비밀번호입니다');
            } else {
              alert('탈퇴에 실패했습니다.')
            }
          })
      }
    },
    async saveImage() {
      const image = this.$refs['image'].files[0];
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        const header = { headers: { 'Content-Type': 'multipart/form-data' } };
        const { data: { filename } } = await axios.post('/api/member/image', formData, header);
        return filename;
      }
    }
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

.image-form {
  display: inline;
  width: 400px;
  margin-left: 60px;
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

.delete-btn {
  background-color: #f00;
  border-radius: 10px;
  border: 0px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.1rem;
  padding: 0.3rem 1rem;
  margin-top: 1rem;
  text-transform: uppercase;
  /* transition: transform 80ms ease-in; */
  align-self: center;
}
</style>