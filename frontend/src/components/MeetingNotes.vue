<template>
  <div>
    <div class="select-menu">
        <div class="select-btn" @click="clickSelectBtn">
          <span class="sBtn-text">Select your option</span>
          <i class="bx bx-chevron-down"></i>
        </div>
      
        <ul class="options">
          <li class="option">
            <i class="bx bxl-github" style="color: #171515;"></i>
            <span class="option-text">Github</span>
          </li>
          <li class="option">
            <i class="bx bxl-instagram-alt" style="color: #E1306C;"></i>
            <span class="option-text">Instagram</span>
          </li>
          <!-- <li class="option">
            <i class="bx bxl-linkedin-square" style="color: #0E76A8;"></i>
            <span class="option-text">Linkedin</span>
          </li>
          <li class="option">
            <i class="bx bxl-facebook-circle" style="color: #4267B2;"></i>
            <span class="option-text">Facebook</span>
          </li>
          <li class="option">
            <i class="bx bxl-twitter" style="color: #1DA1F2;"></i>
            <span class="option-text">Twitter</span>
          </li> -->
        </ul>
      </div>


    <table height="200px">
        <thead>
          <tr>
            <th colspan="">No.</th>
            <th colspan="">Title</th>
            <th colspan="" id="x">Date</th>
          </tr>
          
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Start Union Project!</td>
            <td>
              <i class="material-icons button edit">2022-03-07</i>
              
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>Start Story Board!</td>
            <td>
              <i class="material-icons button edit">2023-01-10</i>
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td>Start Coding!</td>
            <td>
              <i class="material-icons button edit">2023-03-15</i>
            </td>
          </tr>
        </tbody>
      </table>
  </div>
</template>

<script>

export default {
  methods: {
    clickSelectBtn: function() {
      const optionMenu = document.querySelector(".select-menu");
      const options = optionMenu.querySelectorAll(".option");
      optionMenu.classList.toggle("active");
      options.forEach(option =>{
        option.addEventListener("click", ()=> {
          let selectedOption = option.querySelector(".option-text").innerText;
          sBtn_text.innerText = selectedOption;
          optionMenu.classList.remove("active");
        });
      });
    },

  }
}
</script>

<style scoped>
@import url('../assets/css/tableStyle.css');
@import url('../assets/css/selectStyle.css');
@import url('https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css');

</style>