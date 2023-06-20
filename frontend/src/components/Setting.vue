<template>
  <div class="form">
    <div v-if="isLoading" id="load">
      <div class="spinner"></div>
    </div>
    <div class="menu-form">
      <div class="menu-left">
        <input type="text" v-model="link" class="link">
        <button type="button" @click="linkCopy" class="manage-btn">복사</button>
      </div>
      <div class="menu-right" v-if="member_id == propsdata.admin_id">
        <button class="manage-btn" @click="selectProjectMenu('memberUD')">회원 관리</button>
        <button class="manage-btn" @click="selectProjectMenu('projectDelete')">프로젝트 삭제</button>
        <button class="manage-btn" @click="selectProjectMenu('projectUpdate')">프로젝트 수정</button>
      </div>
    </div>
    <div v-if="menu === 'memberUD'" class="manage-contents-member">
      <h2>회원 관리</h2>
      <table>
        <thead>
          <tr>
            <th>이메일</th>
            <th>이름</th>
            <th>휴대폰번호</th>
            <th>등급</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="manager in managers" :key="manager.id">
            <td>{{ manager.email }}</td>
            <td>{{ manager.name }}</td>
            <td>{{ manager.phone }}</td>
            <td>
              매니저
              <select id="managerSelect">
                <option value="manager" disabled>매니저</option>
                <option value="member">일반회원</option>
              </select>
              <button @click="changeGrade('manager', manager.id)" class="btn">변경</button>
            </td>
          </tr>
          <tr v-for="member in members" :key="member.id">
            <td>{{ member.email }}</td>
            <td>{{ member.name }}</td>
            <td>{{ member.phone }}</td>
            <td>
              일반 회원
              <select id="memberSelect">
                <option value="manager">매니저</option>
                <option value="member" disabled>일반회원</option>
              </select>
              <button @click="changeGrade('member', member.id)" class="btn">변경</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="menu === 'projectUpdate'" class="manage-contents-project">
      <div class="mb-3 project-form">
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
    </div>
    <div v-else-if="menu === 'projectDelete'" class="manage-contents-project">
      <div class="mb-3 project-form">
        <h2>프로젝트 삭제</h2>
        <p style="color: red;">프로젝트 삭제시, 모든 데이터의 복구는 불가능합니다.</p>
        <p>본인 확인을 위해 <br> 프로젝트 관리자 본인의 비밀번호를 입력해주세요.</p>
     
        <input type="password" class="form-control" id="exampleFormControlInput1" placeholder="관리자 비밀번호"
          v-model="admin_pw">
        <input type="password" class="form-control" id="exampleFormControlInput1" placeholder="관리자 비밀번호 재확인"
          v-model="admin_pw2">
        <button type="button" class="btn btn-secondary" @click="deleteProject()">프로젝트 삭제</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      isLoading: true,
      menu: 'memberUD',
      grade: null,
      project: {
        id: null,
        name: null,
        description: null,
        image: null,
        link: null
      },
      member_id: null, // 회원 본인 아이디
      admin_pw: null,
      admin_pw2: null,
      manager_ids: [],
      allMembers: [], // 해당 프로젝트에 불러온 전체 회원들 정보(admin, manager 포함)
      managers: [], // 불러온 매니저들 정보
      members: [] // 불러온 일반 회원들 정보
    }
  },
  props: ['propsdata'],
  async created() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
    this.project.id = sessionStorage.getItem('project_id');
    this.project.name = sessionStorage.getItem('project_name');
    this.project.description = sessionStorage.getItem('project_description');
    this.member_id = sessionStorage.getItem('member_id');
    this.link = `http://localhost:8080/register?id=${this.project.id}`;

    await axios.get('/api/project/authority', {
      params: {
        project_id: this.project.id
      },
      headers: this.$store.getters.headers
    })
      .then((res) => {
        console.log(res);
        const authData = res.data;
        this.admin_id = authData.admin_id;
        this.manager_ids = authData.manager_ids;
        console.log("result: " + this.admin_id);
      })
      .catch((err) => {
        if (err.response.status === 419) {
          this.$store.dispatch('handleTokenExpired');
        }
        console.log(err)
      });
    await this.getMember();
  },
  methods: {
    selectProjectMenu(arg) {
      this.menu = arg;

      if (arg == 'memberUD') {
        this.getMember();
      }
    },
    async updateProject() {
      try {
        if (this.project.name == null || this.project.name == '') {
          alert('프로젝트 이름을 입력해주세요.');
          return;
        }
        if (this.project.description == null || this.project.description == '') {
          alert('프로젝트 설명을 입력해주세요.');
          return;
        }

        await axios.patch('/api/project', {
          name: this.project.name,
          description: this.project.description,
          image: this.project.image,
          project_id: this.project.id,
        }, {
          headers: this.$store.getters.headers
        });
        this.menu = 'default';
        this.select = false;
        alert('변경이 완료되었습니다.');
        sessionStorage.setItem('project_name', this.project.name);
        sessionStorage.setItem('project_description', this.project.description);
      } catch (err) {
        if (err.response.status === 419) {
          this.$store.dispatch('handleTokenExpired');
        }
        else {
          console.error(err);
          alert('프로젝트 수정 실패');
        }
      }
    },
    linkCopy() {
      this.$copyText(this.link);
      alert(this.link + ' 복사 완료!');
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

        const { data } = await axios.get('/api/s3/url', {
          params: { filename },
          headers: this.$store.getters.headers
        });

        const encodedFileName = data.encodedFileName;
        const presignedUrl = data.presignedUrl;

        await axios.put(presignedUrl, selectedFile);

        this.project.image = `https://notshovel-union-bucket.s3.ap-northeast-2.amazonaws.com/public/${encodedFileName}`;

        console.log('이미지 업로드 완료');
      } catch (error) {
        console.error('이미지 업로드 오류:', error);
        if (error.response && error.response.status === 419) {
          this.$store.dispatch('handleTokenExpired');
        }
      }
    },
    async chkPw() {
      try {
        await axios.post("/api/member/chkPw", {
          id: this.propsdata.admin_id,
          password: this.admin_pw
        }, {
          headers: this.$store.getters.headers
        })
        console.log('비밀번호 확인 완료');
      } catch {
        if (error.response && error.response.status === 419) {
          this.$store.dispatch('handleTokenExpired');
        }
        else alert('비밀번호가 일치하지 않습니다.');
        throw err;
      }
    },
    async deleteProject() {
      if(this.admin_pw !== this.admin_pw2) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      try {
        const chk = confirm('정말 프로젝트를 삭제하시겠습니까?');
        if (chk) {
          await this.chkPw();
          await axios.delete('/api/project', {
            data: { project_id: this.project.id },
          }, {
            headers: this.$store.getters.headers
          });
          alert('삭제가 완료되었습니다.');
          sessionStorage.setItem('project_id', null);
          sessionStorage.setItem('project_name', null);
          sessionStorage.setItem('project_description', null);
          sessionStorage.setItem('project_image', null);
          this.$router.push('/');
        }
        else alert('프로젝트 삭제가 취소되었습니다.');
      } catch (error) {
        if (error.response && error.response.status === 419) {
          this.$store.dispatch('handleTokenExpired');
        }
        else {
          console.error(err);
          alert('서버 오류로 프로젝트 삭제에 실패하였습니다.');
        }
      }
    },
    async getMember() {
      try {
        const response = await axios.get('/api/project/members', {
          params: {
            project_id: this.project.id
          },
          headers: this.$store.getters.headers
        });

        this.allMembers = response.data.map(member => {
          return {
            id: member.id,
            email: member.email,
            name: member.name,
            phone: member.phone,
          };
        });

        // 일반 회원, 매니저 회원 구분
        this.managers = this.allMembers.filter(member => this.manager_ids.includes(member.id) && member.id !== this.$props.propsdata.admin_id);
        console.log(this.allMembers);
        this.members = this.allMembers.filter(member => member.id !== this.$props.propsdata.admin_id && !this.manager_ids.includes(member.id));
        console.log(this.members);
      } catch (error) {
        console.error(error);
      }
    },

    async changeGrade(currentGrade, id) {
      const changeGrade = (currentGrade === 'member') ? document.querySelector("#memberSelect").value : document.querySelector("#managerSelect").value;
      try {
        const result = await axios.post('/api/project/grade', {
          project_id: this.project.id,
          member_id: id,
          grade: changeGrade,
        }, {
          headers: this.$store.getters.headers
        });
        alert(result.data.msg);
        this.menu = 'default';
        this.select = false;
        this.$router.go();
      } catch (error) {
        if (error.response && error.response.status === 419) {
          this.$store.dispatch('handleTokenExpired');
        }
        else {
          console.error(error);
          alert('등급 변경 실패');
        }
      }
    }
  }
}
</script>

<style scoped>


.link {
  width: 300px;
  border-radius: 3px;
  border: 1px solid #ccc;
  padding: 5px 10px;
}

.form {
  height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

#load {
  height: 80vh;
  width: 80%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  z-index: 99;
}

#load > .spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}


.project-form {
  width: 500px;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  border: 1px solid rgb(205, 205, 205);
  border-radius: 10px;
  padding: 30px;
}

.manage-contents-member {
  padding: 10px;
  width: 900px;
  height: 70vh;
  border: 1px solid #ccc;
  text-align: center;
  overflow-y: scroll;
}

.manage-contents-member::-webkit-scrollbar {
  width: 10px;
}

.manage-contents-member::-webkit-scrollbar-thumb {
  background-color: gray;
  border-radius: 10px;
  background-clip: padding-box;
  border: 2px solid transparent;
}

.manage-contents-member::-webkit-scrollbar-track {
  background-color: #ccc;
  border-radius: 10px;
  box-shadow: inset 0px 0px 5px white;
}

.manage-contents-project {
  padding: 10px;
  width: 900px;
  height: 70vh;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

table {
  width: 100%;
  border: 1px solid #ccc;
  text-align: center;

}

th {
  border: 1px solid #ccc;
  background-color: #2f2f2f;
  color: white;
}

tbody>tr>td {
  border: 1px solid #ccc;
}

.menu-form {
  display: flex;
  width: 900px;
  align-items: center;
  justify-content: space-between;
  margin: 30px 0;
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

.select-file {
  width: 100%;
}
</style>