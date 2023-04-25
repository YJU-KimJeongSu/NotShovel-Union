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
      await axios.patch('/api/project/register', {
        member_id: sessionStorage.getItem('member_id'),
        project_id: id,
      })
        .then(() => {
          alert('프로젝트에 성공적으로 가입되었습니다.');
          this.$router.push('/');
        })
        .catch((err) => {
          if (err.response.status === 409) {
            alert('이미 가입되어 있는 프로젝트입니다.');
          } else {
            alert('알 수 없는 에러 발생');
          }
          
          this.$router.push('/');
        });
    }
  },
}
</script>