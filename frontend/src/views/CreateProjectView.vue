<template>
  <div class="form">
    <!-- 프로젝트 생성 -->
    <div class="mb-3 project-form" v-if="createState == false">
      <h2>프로젝트 생성</h2>
      <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="프로젝트 이름" v-model="name">
      <textarea class="form-control" id="exampleFormControlTextarea1" placeholder="프로젝트 설명" rows="3"
        v-model="description"></textarea>
      <p class="select-file">프로젝트 대표 이미지
        <input class="form-control" ref="image" accept="image/*" type="file" id="formFile" @change="saveImage()">
      </p>
      <button type="button" class="btn btn-secondary" @click="save()">생성</button>
    </div>

    <!-- 초대링크 -->
    <div class="mb-3 project-form" v-else>
      <h2>생성 완료</h2>
      <div :style="`background-image: url(${image})`" class="project-photo">
        <p class="name">{{ name.length > 5 ? name.slice(0, 5) + '...' : name }}</p>
      </div>
      <p style="text-align: center;">{{ name.length > 30 ? name.slice(0, 30) + '...' : name }} <br>프로젝트가 생성 완료되었습니다!</p>
      <p>초대링크
        <input type="text" v-model="link"  class="link">
        <button type="button" @click="linkCopy" class="manage-btn">복사</button>
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
      image: 'https://notshovel-union-bucket.s3.ap-northeast-2.amazonaws.com/dafaultImage.png',
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
        if (this.description == null) {
          alert('프로젝트 설명을 입력해주세요.');
          return;
        }
        const requestData = {
          name: this.name,
          description: this.description,
          image: this.image,
          member_id: this.member_id,
        };
        const { data: { id } } = await axios.post(`${process.env.VUE_APP_SERVER_URL}/api/project`, requestData, { 
          headers: this.$store.getters.headers
        });
        this.link = `https://www.notshovel.works/register?id=${id}`;
        this.createState = !!!this.createState;
      } 
      catch (err) {
        console.error(err);
        if (err.response.status === 404) {
          alert('존재하지 않는 회원입니다. 다시 로그인해주세요');
        } 
        else if (err.response.status === 419) {
          this.$store.dispatch('handleTokenExpired');
        } 
        else {
          alert('프로젝트 추가 실패');
        }
      }
    },

    async saveImage() {
      try {
        const selectedFile = this.$refs.image.files[0];
        const maxSize = 5 * 1024 * 1024;
        const fileSize = selectedFile.size;
        if (fileSize > maxSize) {
          alert("첨부파일 사이즈는 5MB 이내로 등록 가능합니다.");
          return;
        }
        const filename = selectedFile.name;
        const res = await axios.get(`${process.env.VUE_APP_SERVER_URL}/api/s3/url`, {
          params: { filename },
          headers: this.$store.getters.headers
        });
        const encodedFileName = res.data.encodedFileName;
        const presignedUrl = res.data.presignedUrl;

        await axios.put(presignedUrl, selectedFile)
          .then((res) => {
            this.image = 'https://notshovel-union-bucket.s3.ap-northeast-2.amazonaws.com/public/' + encodedFileName;
            // console.log(res);
          })

        console.log('이미지 업로드 완료');
      } catch (error) {
        if (err.response.status === 419) {
          this.$store.dispatch('handleTokenExpired');
        } 
        else console.error('이미지 업로드 오류:', error);
      }
    },
    linkCopy() {
      this.$copyText(this.link);
      alert(this.link + ' 복사 완료!');
    }
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

.project-form {
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

.project-photo {
  padding: 20px;
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background-color: gray;
  display: flex;
  justify-content: center;
  align-items: center;
}

.project-photo::before{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
}


.name {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80%;
  z-index: 1;
  font-size: 32px;
  font-weight: 600;
}

.select-file,
.btn {
  width: 100%;
}

.link {
  width: 300px;
  border-radius: 3px;
  border: 1px solid #ccc;
  padding: 5px 10px;
}

.manage-btn {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin-left: 10px;
}

.manage-btn:hover {
  background-color: white;
}
</style>