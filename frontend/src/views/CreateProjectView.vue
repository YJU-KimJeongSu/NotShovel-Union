<template>
  <div class="form">
    <!-- create -->
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
      <img :src="image"  class="project-photo">
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
        if(this.description == null) {
          alert('프로젝트 설명을 입력해주세요.');
          return;
        }

        const { data: { id } } = await axios.post('/api/project', {
          name: this.name,
          description: this.description,
          image: this.image,
          member_id: this.member_id,
        }, {
          headers: {
        Authorization: `Bearer ${this.$store.state.token}` // 헤더에 토큰 추가
      }
        })
          .catch((err) => {
            if (err.response.status === 404) {
              alert('존재하지 않는 회원입니다. 다시 로그인해주세요');
            }
          });

        // 임시 링크
        this.link = `http://localhost:8080/register?id=${id}`; // 원래 3000번으로 연결되어 있었으나, 백엔드 서버에 바로 접속하는건 안좋을 것 같아서 수정
        this.createState = !!!this.createState;
      } catch (err) {
        console.error(err);
        alert('프로젝트 추가 실패');
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
        const type = filename.split('.').pop().toLowerCase();
        
        const res = await axios.get('/api/s3/url', {
          params: { filename },
          headers: {
        Authorization: `Bearer ${this.$store.state.token}` // 헤더에 토큰 추가
      }
        });
        const encodedFileName = res.data.encodedFileName;
        const presignedUrl = res.data.presignedUrl;
        
        await axios.put(presignedUrl, selectedFile)
        .then((res) => {
          this.image = 'https://notshovel-union-bucket.s3.ap-northeast-2.amazonaws.com/public/'+encodedFileName;
          
          // console.log(res);
        })

        console.log('이미지 업로드 완료');
      } catch (error) {
        console.error('이미지 업로드 오류:', error);
      }
    },

    // async saveImage(){
    //   const formData = new FormData();
    //     const image = this.$refs['image'].files[0];
    //     formData.append('image', image);

    //     const { data: { filename } } = await axios.post('/api/project/upload', 
    //     formData, {
    //       headers: { 'Content-Type': 'multipart/form-data' }
    //     });
    //     this.image = filename;
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
  width: 170px;
  height: 170px;
  border-radius: 50%;
  /* background-color: gray; */
}

.select-file,
.btn {
  width: 100%;
}
</style>