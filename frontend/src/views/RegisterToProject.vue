<template>

</template>
<script>
import axios from 'axios';

export default {
  async mounted() {
    const id = this.$route.query.id;

    if (!sessionStorage.getItem('member_id')) {
      alert('로그인을 먼저 진행해주세요.');
      this.$router.push('/');
    } else {
      await axios.patch('http://process.env.SERVER_URL/api/project/register', {
        member_id: sessionStorage.getItem('member_id'),
        project_id: id,
      },{
        headers: this.$store.getters.headers
      })
        .then(() => {
          alert('프로젝트에 성공적으로 가입되었습니다.');
          this.$router.push('/');
        })
        .catch((err) => {
          if (err.response.status === 409) {
            alert('이미 가입되어 있는 프로젝트입니다.');
          }
          else if (err.response.status === 419) {
            this.$store.dispatch('handleTokenExpired');
          } 
          else {
            alert('서버 오류입니다. 잠시 후 다시 시도해주세요.');
          }
          
          this.$router.push('/');
        });
    }
  },
}
</script>