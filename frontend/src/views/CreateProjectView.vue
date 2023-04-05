<template>
  <div class="form">
    <!-- create -->
    <div class="mb-3 project_form" v-if="createState == false">
      <h2>프로젝트 생성</h2>
      <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="프로젝트 이름" v-model="name">
      <textarea class="form-control" id="exampleFormControlTextarea1" placeholder="프로젝트 설명" rows="3"
        v-model="description"></textarea>
      <p class="select_file">프로젝트 대표 이미지
        <input class="form-control" ref="image" accept="image/*" type="file" id="formFile">
      </p>
      <button type="button" class="btn btn-secondary" @click="save()">생성</button>
    </div>

    <!-- 초대링크 -->
    <div class="mb-3 project_form" v-else>
      <h2>생성 완료</h2>
      <div class="project_photo"></div>
      <!-- <img :src='`${image}`' class="project_photo"> -->
      <p>{{ this.name }} 프로젝트가 생성 완료되었습니다!</p>
      <p>초대링크
        <input type="text" v-model="link">
        <button type="button" @click="linkCopy">복사</button>
      </p>
      <router-link to="/">홈으로</router-link>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      createState: false, // 생성 버튼 누르면 true로 변경, 컴포넌트 변경
      name: null,
      description: null,
      member_id: sessionStorage.getItem('member_id'),
      image: null,
      link: null,
    }
  },
  methods: {
    async save() {
      try {
        if (this.name == null) {
          alert('프로젝트 이름을 입력해주세요.');
          return;
        }
        const formData = new FormData();
        const image = this.$refs['image'].files[0];
        formData.append('image', image);

        const { data: { filename } } = await axios.post('/api/project/upload', 
        formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const { data: { id } } = await axios.post('/api/project', {
          name: this.name,
          description: this.description,
          image: filename,
          member_id: this.member_id,
        });

        // 임시 링크
        this.link = `http://localhost:3000/register?id=${id}`;
        this.createState = !!!this.createState;
      } catch (err) {
        console.error(err);
        alert('프로젝트 추가 실패');
      }
    },


    linkCopy() {
      this.$copyText(this.link);
      alert(this.link + ' 복사 완료!');
    }
    // // blob url 저장
    // upload(e) {
    //   var file = e.target.files;
    //   let url = URL.createObjectURL(file[0]);
    //   this.image = url;
    // },
  }
}

</script>
<style scoped>
.form {
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.project_form {
  width: 500px;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border: 1px solid rgb(205, 205, 205);
  border-radius: 10px;
  padding: 30px;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.project_photo {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  /* background-color: gray; */
}

.select_file,
.btn {
  width: 100%;
}
</style>