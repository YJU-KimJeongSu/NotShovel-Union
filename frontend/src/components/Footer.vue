<template>
  <div class="footer">
    <div class="footer-inner">
    <span>test1</span>
    <span>test2</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',

}
</script>

<style scoped>
.footer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.footer-inner{
  border-top: 1px solid #dddddd;
  color: #dddddd;
  width: 70%;
  display:flex;
  justify-content: space-between;
}
</style>
