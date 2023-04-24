<template>
     <div class="section" v-bind:class="{open: props}">
        <div class="gant-form">
            <h3>간트차트</h3>
            <p>시작일: <input type="date" v-model="activity.activity_start_date"></p>
            <p>기간: <input type="number" v-model="activity.activity_duration"> 일</p>
            <p>내용: <input type="text"  v-model="activity.activity_name"></p>
            <p>진행도: <input type="number" v-model="activity.activity_progress" value="0"> %</p>
            <button @click="addActivity()">추가</button>
            <ul>
                <li v-for="index in activityList">
                    {{ index.activity_start_date }}
                    ({{ index.activity_duration }}일)
                    - {{ index.activity_name }}
                    - {{ index.activity_progress }} %
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
            board_name: null,
            board_order: 1, // 임시 
            activity : {
                activity_name: null,
                activity_start_date: null,
                activity_duration: null,
                activity_progress: 0,
            },
            // activity_manager : null
            activityList: []
        }
    },
    created() {
        this.project_id = sessionStorage.getItem('project_id');
        this.board_name = sessionStorage.getItem('currentView');
        // this.board_order = sessionStorage.getItem('board_order');
    },
    methods: {
        addActivity(){
            this.activityList.push({
                activity_name: this.activity.activity_name,
                activity_start_date: this.activity.activity_start_date,
                activity_duration: this.activity.activity_duration,
                activity_progress: this.activity.activity_progress
            });
            this.activity = {
                activity_name: null,
                activity_start_date: null,
                activity_duration: null,
                activity_progress: 0,
            };
            console.log(this.activityList);
        },
        async saveActivity(){
            axios.post('/api/gantt', {
                project_id: this.project_id,
                board_name: this.board_name,
                // board_order: this.board_order,
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