<template>
     <div>
        <h1>로그인</h1>
        이메일 <input type="text" v-model="email">
        비밀번호 <input type="password" v-model="password">
        <button @click="signIn">로그인</button>
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
        signIn(){
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
