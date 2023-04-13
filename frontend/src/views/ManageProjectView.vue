<template>
  <div class="form">
    <div class="manage-form" v-if="!select">
      <button class="manage-btn" v-if="member_id == admin_id" @click="selectProjectMenu('project')">프로젝트 관리</button>
      <button class="manage-btn" @click="selectProjectMenu('member')">회원 관리</button>
    </div>

    <div class="manage-form-small" v-else>
      <button class="manage-btn-small" v-if="member_id == admin_id" @click="selectProjectMenu('project')">프로젝트 관리</button>
      <button class="manage-btn-small" @click="selectProjectMenu('member')">회원 관리</button>
    </div>

    <div>
      <div class="mb-3 project-form" v-if="menu === 'project'">
        <button class="manage-btn" @click="selectProjectMenu('projectDelete')">프로젝트 삭제</button>
        <button class="manage-btn" @click="selectProjectMenu('projectUpdate')">프로젝트 수정</button>
      </div>

      <div v-if="menu === 'projectUpdate'" class="mb-3 project-form">
        <h2>프로젝트 수정</h2>
        <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="프로젝트 이름"
          v-model="project.name">
        <textarea class="form-control" id="exampleFormControlTextarea1" placeholder="프로젝트 설명" rows="3"
          v-model="project.description"></textarea>
        <p class="select-file">프로젝트 대표 이미지
          <input class="form-control" ref="image" accept="image/*" type="file" id="formFile" @change="saveImage()">
        </p>
        <button type="button" class="btn btn-secondary" @click="updateProject()">수정</button>
      </div>

      <div v-if="menu === 'projectDelete'" class="mb-3 project-form">
        <h2>프로젝트 삭제</h2>
        <p>본인 확인을 위해 프로젝트 관리자 본인의 비밀번호를 입력해주세요.</p>
        <input type="password" class="form-control" id="exampleFormControlInput1" placeholder="관리자 비밀번호"
          v-model="admin_pw">
        <button type="button" class="btn btn-secondary" @click="deleteProject()">프로젝트 삭제</button>
      </div>
    </div>

    <div class="mb-3 project-form" v-if="menu === 'member'">
      <h2>멤버 관리</h2>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      select: false,
      menu: 'default',
      project: {
        id: null,
        name: null,
        description: null,
        image: 'default.jpg',
      },
      member_id: null,
      admin_pw: null,
      admin_id: null,
      manager_ids: [],
      members: []
    }
  },
  created() {
    this.project.id = sessionStorage.getItem('project_id');
    this.project.name = sessionStorage.getItem('project_name');
    this.project.description = sessionStorage.getItem('project_description');
    this.member_id = sessionStorage.getItem('member_id');
  },
  mounted() {
    axios.get('/api/project/authority/', {
      params: {
        member_id: sessionStorage.getItem('member_id')
      }
    })
    .then((res) => {
        const authData = res.data;
        this.admin_id = authData.admin_id;
        this.manager_ids = authData.manager_ids;
        console.log("result: " +  this.admin_id);
     })
     .catch((err) => console.log(err));


  },
  methods: {
    selectProjectMenu(arg) {
      this.menu = arg;
      this.select = true;
    },
    async updateProject() {
      try {
        if (this.project.name == null) {
          alert('프로젝트 이름을 입력해주세요.');
          return;
        }
        await axios.patch('/api/project', {
          name: this.project.name,
          description: this.project.description,
          image: this.project.image,
          project_id: this.project.id,
        });
        this.menu = 'default';
        alert('변경이 완료되었습니다.');
        sessionStorage.setItem('project_name', this.project.name);
        sessionStorage.setItem('project_description', this.project.description);

      } catch (err) {
        console.error(err);
        alert('프로젝트 추가 실패');
      }
    },

    async saveImage() {
      const formData = new FormData();
      const image = this.$refs['image'].files[0];
      formData.append('image', image);

      const { data: { filename } } = await axios.post('/api/project/upload',
        formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      this.project.image = filename;
    },

    async chkPw(){
      try {
         await axios.post("/api/member/chkPw", {
            id: this.admin_id,
            password: this.admin_pw
        })
        console.log('비밀번호 확인 완료');
      } catch {
        alert('비밀번호가 일치하지 않습니다.');
        throw err;
      }
    },

    async deleteProject() {
      try {
        const chk = confirm('정말 프로젝트를 삭제하시겠습니까?');
        if (chk) {
          await this.chkPw();
          await axios.delete('/api/project', {
            data: { project_id: this.project.id },
          });
          alert('삭제가 완료되었습니다.');
          sessionStorage.setItem('project_id', null);
          sessionStorage.setItem('project_name', null);
          sessionStorage.setItem('project_description', null);
          sessionStorage.setItem('project_image', null);
          this.$router.push('/');
        }
        else alert('프로젝트 삭제 실패');
      } catch (err) {
        console.error(err);
        alert('프로젝트 삭제 실패');
      }
    },

    // async getMember() {
    //   await axios.get('/api/project/members', {
    //     params: {
    //       project_id: this.project.id
    //     }
    //   })
    //     .then((res) => {
    //       // this.email = res.data.email;
    //       // this.name =  res.data.name;
    //       // =res.data.phone_number;

    //     })
    //     .catch((err) => console.log(err));
    // }
  }
}
</script>

<style>
.manage-form {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 1000px;
  height: 500px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.manage-form-small {
  display: flex;
  width: 1200px;
  height: 100px;
  position: absolute;
  top: 50%;
  transform: translate(0%, -50%);
}

.manage-btn {
  width: 300px;
  height: 200px;
  border: 1px solid gray;
}

.manage-btn:hover {
  background-color: white;
}

.manage-btn-small {
  width: 120px;
  height: 50px;
  margin-right: 10px;
  border: 1px solid gray;
}

.manage-btn-small:hover {
  background-color: white;
  border: none;
}

</style>