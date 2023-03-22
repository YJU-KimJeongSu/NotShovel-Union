<template>
    <div>
        <h1>회원가입</h1>
        이메일 <input type="text" v-model="email">
        비밀번호 <input type="password" v-model="password">
        이름 <input type="text" v-model="name">
        <button @click="signUp">회원가입</button>
    </div>
    
</template>
<script>
import axios from 'axios';

export default {
    data() {
        return {
            email: null,
            password: null,
            name: null
        }
    },
    methods:{
        signUp(){
            axios.post("/api/user/signup",{
                email: this.email,
                password: this.password,
                name: this.name,
            })
            .then((res)=>{
                console.log(res);
            })
            .catch((err)=>{
                console.log(err);
            })
        },
        logIn(){
            axios.post("/api/user/login",{
                email: this.email,
                password: this.password
            })
            .then((res)=>{
                if(res.data == 'wrong'){
                    alert('비밀번호가 틀렸습니다.');
                }
                else {
                    console.log(res.data.name);
                    alert('로그인 성공');
                    sessionStorage.setItem('name', res.name);
                }
            })
            .catch((err)=>{
                console.log(err);
                alert('없는 아이디입니다.');
            })
        }
    }
}
</script>