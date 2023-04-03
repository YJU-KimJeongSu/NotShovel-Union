<template>
  <div class="inner">
    <!-- 프로젝트 있을 때 -->
    <div class="inner2" v-if="projects.length != 0">
      <Flicking :options="{ circular: true }" :plugins="plugins">
        <div class="card-panel" v-for="(project, index) in projects" :key="index"> 
          {{ project.name }}
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

export default {
  components: {
    Flicking
  },
  data() {
    return {
      plugins: [new Perspective({ rotate: 0.5 })],
      projects: [],
    }
  },
  mounted() {
    axios.get('/api/project', {
      params: {
        member_id: sessionStorage.getItem('member_id')
      }
    })
      .then((res) => {
        // console.log(res.data);
        this.projects = res.data;
        // for (let i in this.projects) {
        //   console.log(this.projects[i].name);
        // }

      })
      .catch((err) => console.log(err));
  }
}
</script>
<style>
@import url("/node_modules/@egjs/vue-flicking/dist/flicking.css");
@import url("/node_modules/@egjs/flicking-plugins/dist/arrow.css");

.card-panel {
  width: 300px;
  height: 300px;
  background-color: gray;
  border-radius: 50%;
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}
.card-panel:hover {
  opacity: 0.7;
}

.inner2{
  width: 100%;
}
.inner {
  width: 80%;
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
}</style>