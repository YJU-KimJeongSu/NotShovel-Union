<template>
  <div class="inner-form">
    <div class="portfolio-form">
      <div class="form-top">
        <img src="@/assets/profile.jpg" class="profile-img" width="150" height="150">
        <p class="name">이름</p>
        <p class="content">a@a.com</p>
        <p class="region">SOUTH KOREA, DAEGU</p>
      </div>
      <div class="form-bottom">
        <p class="content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita at modi laborum. Eius,
          nesciunt
          sapiente reiciendis ex tenetur voluptates molestiae animi asperiores minus ab ea obcaecati. Doloribus
          dicta quaerat molestiae!</p>
        <a href="#" class="link">Github</a>
      </div>
    </div>
    <div class="portfolio-form">
      <div class="form-top">
        <img src="@/assets/profile.jpg" class="profile-img" width="150" height="150">
        <p class="name">이름</p>
        <p class="content">a@a.com</p>
        <p class="region">SOUTH KOREA, DAEGU</p>
      </div>
      <div class="form-bottom">
        <p class="content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita at modi laborum. Eius,
          nesciunt
          sapiente reiciendis ex tenetur voluptates molestiae animi asperiores minus ab ea obcaecati. Doloribus
          dicta quaerat molestiae!</p>
        <a href="#" class="link">Github</a>
      </div>
    </div>
    <div class="portfolio-form">
      <div class="form-top">
        <img src="@/assets/profile.jpg" class="profile-img" width="150" height="150">
        <p class="name">이름</p>
        <p class="content">a@a.com</p>
        <p class="region">SOUTH KOREA, DAEGU</p>
      </div>
      <div class="form-bottom">
        <p class="content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita at modi laborum. Eius,
          nesciunt
          sapiente reiciendis ex tenetur voluptates molestiae animi asperiores minus ab ea obcaecati. Doloribus
          dicta quaerat molestiae!</p>
        <a href="#" class="link">Github</a>
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
  height: 55%;
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.form-bottom {
  height: 45%;
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
}</style>