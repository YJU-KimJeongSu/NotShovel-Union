<template>
  <div class="inner">
    <!-- 프로젝트 있을 때 -->
    <div class="inner2" v-if="projects.length != 0">
      <Flicking :options="{ circular: true }" :plugins="plugins">
        <!-- 해당 아이디가 소속한 프로젝트 도는 반복문 -->
        <div class="card-panel" v-for="(project, index) in projects" :key="index" @click="selectProject(project)"
          :style="`background-image: url(${project.image})`">
          <p class="name">{{ project.name.length > 30 ? project.name.slice(0, 30) + '...' : project.name }}</p>
        </div>
      </Flicking>
    </div>
    <!-- 프로젝트 없을 때 -->
    <div class="inner2" v-else>
      <p>가입된 프로젝트가 없습니다.</p>
    </div>
    <router-link to="/createproject">추가</router-link>
  </div>
</template>
<script>
import axios from "axios";
import { Flicking } from "@egjs/vue-flicking";
import { Perspective } from "@egjs/flicking-plugins";
import { eventBus } from '../main.js';

export default {
  components: {
    Flicking
  },
  data() {
    return {
      plugins: [new Perspective({ rotate: 0.5 })],
      projects: [ ],
    }
  },
  async mounted() {
    try {
      const member_id = sessionStorage.getItem('member_id');
      const res = await axios.get(`https://${process.env.VUE_APP_SERVER_URL}/api/project`, {
        params: {
          member_id: member_id
        },
        headers: this.$store.getters.headers
      });
      this.projects = res.data;
    } catch (err) {
      if (err.response.status === 419) {
        this.$store.dispatch('handleTokenExpired');
      }
      else console.error(err);
    }
  },
  methods: {
    selectProject(index) {
      eventBus.$emit('project', index);
      // 프로젝트 이름과 아이디는 세션에 저장
      sessionStorage.setItem('project_description', index.description);
      sessionStorage.setItem('project_id', index.id);
      sessionStorage.setItem('project_name', index.name);
      this.$router.push('/dashboard');
    },
  }
}
</script>
<style scoped>
@import url("/node_modules/@egjs/vue-flicking/dist/flicking.css");
@import url("/node_modules/@egjs/flicking-plugins/dist/arrow.css");

.card-panel {
  position: relative;
  width: 300px;
  height: 300px;
  background-color: gray;
  border-radius: 50%;
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  padding: 30px;
}

.card-panel::before {
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

.card-panel:hover {
  opacity: 0.7;
}

.inner2 {
  width: 100%;
  text-align: center;
}

.inner {
  width: 80%;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.flicking-viewport {
  width: 100%;
}

.flicking-arrow-next::before,
.flicking-arrow-prev::before,
.flicking-arrow-next::after,
.flicking-arrow-prev::after {
  background-color: black;
}

.flicking-arrow-disabled::after,
.flicking-arrow-disabled::before {
  background-color: rgb(220, 220, 220);
}

a {
  color: black;
  font-weight: 600;
  text-decoration: none;
}

a:hover {
  text-decoration: none;
  color: gray;
}
</style>