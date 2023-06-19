<template>
  <div class="inner-form">
    <div class="portfolio-form">
      <div class="form-top">
        <img src="https://avatars.githubusercontent.com/u/86811808?v=4" class="profile-img" width="150" height="150">
        <p class="name">김정원😊</p>
        <p class="content">kimwonny8@gmail.com</p>
        <p class="region">SOUTH KOREA, DAEGU</p>
      </div>
      <div class="form-bottom">
        <p class="content">긍정적인 마음으로 도전하며 꾸준히 성장하는 개발자가 되겠습니다.</p>
        <a href="https://github.com/kimwonny8" class="link">Github</a>
      </div>
    </div>
    <div class="portfolio-form">
      <div class="form-top">
        <img src="@/assets/ys.jpg" class="profile-img" width="150" height="150">
        <p class="name">반영서🤔</p>
        <p class="content">jamesban01@gmail.com</p>
        <p class="region">SOUTH KOREA, GYEUNGGI</p>
      </div>
      <div class="form-bottom">
        <p class="content">어제의 자신을 넘어, 더욱 높을 곳을 추구하는 개발자 반영서입니다.</p>
        <a href="https://github.com/bys096" class="link">Github</a>
      </div>
    </div>
    <div class="portfolio-form">
      <div class="form-top">
        <img src="@/assets/js.jpg" class="profile-img" width="150" height="150">
        <p class="name">김정수🧐</p>
        <p class="content">ique45@naver.com</p>
        <p class="region">SOUTH KOREA, DAEGU</p>
      </div>
      <div class="form-bottom">
        <p class="content">기초를 탄탄히 하며, 보이지 않는 것에도 신경 쓰는 꼼꼼한 개발자가 되겠습니다.</p>
        <a href="https://github.com/YJU-KimJeongSu" class="link">Github</a>
      </div>
    </div>
  </div>
</template>
<script>

</script>
<style scoped>
.inner-form {
  margin-top: 4%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.portfolio-form {
  margin-right: 3%;
  box-shadow: 0 8px 16px rgba(64, 60, 67, .16);
  /* box-shadow: 0 8px 16px rgba(0,0,0,0.07),
                0 16px 32px rgba(0,0,0,0.07), 
                0 32px 64px rgba(0,0,0,0.07); */
  border-radius: 10px;
  width: 350px;
  height: 550px;
  padding: 1%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.form-top {
  height: 65%;
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.form-bottom {
  height: 35%;
  width: 80%;
  border-top: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.name {
  font-weight: bold;
  font-size: 25px;
  color: #11101D;
}

.content {
  font-size: 16px;
  color: rgb(77, 77, 77);
}

.region {
  font-weight: bold;
  color: rgb(158, 158, 158);
  font-size: 14px;
}

.link {
  color: black;
  text-decoration: none;
}

.profile-img {
  box-shadow: 0 2px 5px 1px rgba(64, 60, 67, .16);
  border-radius: 50%;
  margin: 10px 0;
}
</style>