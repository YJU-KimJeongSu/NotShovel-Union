<template>
     <div class="section" v-bind:class="{open: props}">
        <div class="gant-form">
            <h3>간트차트</h3>
            <p>시작일: <input type="date" v-model="activity.activity_start_date"></p>
            <p>기간: <input type="number" v-model="activity.activity_duration"> 일</p>
            <p>내용: <input type="text"  v-model="activity.activity_name"></p>
            <p>진행도: <input type="number" v-model="activity.activity_progress" value="0"> %</p>
            <p>담당자: <input type="text" v-model="activity.activity_manager"></p>
            <button @click="addActivity()">추가</button>
            <ul>
                <li v-for="index in activityList">
                    {{ index.activity_start_date }}
                    ({{ index.activity_duration }}일)
                    - {{ index.activity_name }}
                    - {{ index.activity_progress }} %
                    - 담당 : [ {{ index.activity_manager }} ] 
                </li>
            </ul>
            <button @click="saveActivity()">저장</button>
        </div>
       
     </div>
</template>
<script>
import axios from "axios";

export default {
    props: ['props'],
    data() {
        return {
            project_id: null,
            board_id: null,
            activity : {
                activity_name: null,
                activity_start_date: null,
                activity_duration: null,
                activity_progress: 0,
                activity_manager: null,
            },
            activityList: []
        }
    },
    created() {
        this.project_id = sessionStorage.getItem('project_id');
        this.board_id = sessionStorage.getItem('board_id');
    },
    methods: {
        addActivity(){
            this.activityList.push({
                activity_name: this.activity.activity_name,
                activity_start_date: this.activity.activity_start_date,
                activity_duration: this.activity.activity_duration,
                activity_progress: this.activity.activity_progress,
                activity_manager: this.activity.activity_manager
            });
            this.activity = {
                activity_name: null,
                activity_start_date: null,
                activity_duration: null,
                activity_progress: 0,
                activity_manager: null,
            };
            console.log(this.activityList);
        },
        async saveActivity(){
            axios.post('/api/gantt', {
                board_id: this.board_id,
                activityList: this.activityList
            })
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        }
    }
}

</script>
<style scoped>
.gant-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>