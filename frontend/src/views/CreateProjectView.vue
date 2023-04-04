<template>
  <div class="form">
    <!-- create -->
    <div class="mb-3 project_form" v-if="createState == false">
      <h2>프로젝트 생성</h2>
      <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="프로젝트 이름" v-model="name">
      <textarea class="form-control" id="exampleFormControlTextarea1" placeholder="프로젝트 설명" rows="3" v-model="description"></textarea>
      <p class="select_file">프로젝트 대표 이미지
        <input class="form-control" ref="image" accept="image/*" type="file" id="formFile">
      </p>
      <button type="button" class="btn btn-secondary" @click="save()">생성</button>
    </div>

    <!-- 초대링크 -->
    <div class="mb-3 project_form" v-else>
      <h2>생성 완료</h2>
      <div class="project_photo"></div>
      <p>{{ this.name }} 프로젝트가 생성 완료되었습니다!</p>
      <p>초대링크
        <input type="text" v-model="link">
        <button type="button" @click="linkCopy">복사</button>
      </p>
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
      picture: null,
      link: null,
    }
  },
  methods: {
    save() {
      if (this.name == null) {
        alert('프로젝트 이름을 입력해주세요.')
      }
      else {
        axios.post('/api/project', {
          name: this.name,
          description: this.description,
          picture: this.picture,
          member_id: this.member_id,
        })
          .then((res) => {
            console.log(res.data.id);
            // 임시로 만들어둔 초대링크 
            this.link = `http://localhost:3000/register?id=${res.data.id}`;
            this.createState = !!!this.createState;
          })
          .catch((err) => {
            console.log(err);
            alert('프로젝트 생성에 실패하였습니다.')
          });
      }
    },
    // // 업로드 진행중
    // uploadImage() {
    //   let form = new FormData()
    //   let image = this.$refs['image'].files[0]

    //   form.append('image', image)

    //   axios.post('/api/project/image', form, {
    //     header: { 'Content-Type': 'multipart/form-data' }
    //   }).then(({ data }) => {
    //     this.images = data
    //   })
    //     .catch(err => console.log(err))
    // },
    linkCopy() {
      this.$copyText(this.link);
      alert(this.link + ' 복사 완료!');
    }
  }
}

</script>
<style scoped>
.form {
  margin-top: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
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
}

.project_photo {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background-color: gray;
}

.select_file,
.btn {
  width: 100%;
}
</style>