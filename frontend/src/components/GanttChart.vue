<template>
  <div class="section" v-bind:class="{ open: props }">
    <div class="menu">
      <h4>{{ board_name }}</h4>
      <button @click="saveActivity()" class="btn btn-outline-primary">저장</button>
    </div>
    <div class="container" ref="gantt">
      <div class="left-container" :tasks="tasks">
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { gantt } from 'dhtmlx-gantt';

export default {
  props: ['props'],

  data() {
    return {
      project_id: null,
      board_name: null,
      board_id: null,
      activity_list: [],
      tasks: {
        data: [],
        links: []
      },
    }
  },
  created() {
    this.project_id = sessionStorage.getItem('project_id');
    this.board_name = sessionStorage.getItem('board_name');
    this.board_id = sessionStorage.getItem('board_id');
  },
  async mounted() {
    gantt.config.xml_date = '%Y-%m-%d';
    gantt.init(this.$refs.gantt);

    await this.fetchGanttData();
    this.$nextTick(() => {
      gantt.clearAll();
      gantt.parse(this.tasks);
    });
  },
  methods: {
    async fetchGanttData() {
      try {
        const res = await axios.get(`http://${process.env.VUE_APP_SERVER_URL}/api/gantt/${this.board_id}`, {
          headers: this.$store.getters.headers
        });
        const ganttData = res.data;
        this.tasks.data = ganttData.gantt_data.data.map(item => ({
          id: item.id,
          text: item.activity_name,
          start_date: item.activity_start_date,
          duration: item.activity_duration,
          progress: item.activity_progress,
          parent: item.parent
        }));
        this.tasks.links = ganttData.gantt_data.links;
        // console.log(this.tasks);
      } catch (err) {
        if (err.response.status === 419) {
          this.$store.dispatch('handleTokenExpired');
        }
        else console.error(err);
      }
    },

    async saveActivity() {
      this.activity_list = [];

      const taskDataStore = gantt.getDatastore("task");
      taskDataStore.eachItem((task) => {
        const activity = {
          id: task.id, // 고유한 ID
          activity_name: task.text,
          activity_start_date: task.start_date,
          activity_duration: task.duration,
          activity_progress: task.progress,
          parent: task.parent
        };

        this.activity_list.push(activity);
      });
      console.log(this.activity_list);

      await axios.post(`http://${process.env.VUE_APP_SERVER_URL}/api/gantt`, {
        board_id: this.board_id,
        gantt_data: {
          data: this.activity_list,
          links: gantt.getLinks()
        }
      }, {
        headers: this.$store.getters.headers
      })
        .then((res) => {
          alert('저장 완료!');
          this.activity_list = [];
          console.log(res)
          this.$router.go();
        })
        .catch((err) => {
          if (err.response.status === 419) {
            this.$store.dispatch('handleTokenExpired');
          }
          else {
            alert('서버 문제로 저장에 실패하였습니다. 잠시 후 다시 시도해주세요');
            console.log(err);
          }
        });
    }
  }

}
</script>
<style scoped>
@import "~dhtmlx-gantt/codebase/dhtmlxgantt.css";

@media all and (max-width: 768px) {
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .left-container {
    overflow: hidden;
    position: relative;
    height: 100%;
  }
}

.menu {
  margin-top: 10px;
  height: 5vh;
  width: 65%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.container {
  margin-top: 30px;
  height: 80vh;
}

.section {
  position: relative;
  animation-name: close;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

.section.open {
  position: relative;
  animation-name: open;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

@keyframes open {
  from {
    left: 0;
  }

  to {
    left: 9%;
  }
}

@keyframes close {
  from {
    left: 9%;
  }

  to {
    left: 0;
  }
}

.section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>