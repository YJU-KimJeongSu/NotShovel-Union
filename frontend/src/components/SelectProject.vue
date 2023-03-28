<template>
    <div class="inner">
        <Flicking :options="{ circular: true }" :plugins="plugins">
            <div class="card-panel flicking-panel">CONTENTS OF PANEL 0</div>
            <div class="card-panel flicking-panel">CONTENTS OF PANEL 1</div>
            <div class="card-panel flicking-panel">CONTENTS OF PANEL 2</div>
            <span slot="viewport" class="flicking-arrow-prev"></span>
            <span slot="viewport" class="flicking-arrow-next"></span>
        </Flicking>
    </div>
</template>
<script>
import { Flicking } from "@egjs/vue-flicking";
import { Arrow } from "@egjs/flicking-plugins";

export default {
  components: {
    Flicking
  },
  data() {
    return {
      plugins: [new Arrow()]
    }
  }
}
</script>
<style>
@import url("/node_modules/@egjs/vue-flicking/dist/flicking.css");
@import url("/node_modules/@egjs/flicking-plugins/dist/arrow.css");

.flicking-panel {
    width: 250px;
    height: 250px;
    background-color: gray;
    border-radius: 50%;
    margin: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.inner{
    width: 80%;
}
.flicking-arrow-next::before,
.flicking-arrow-prev::before,
.flicking-arrow-next::after,
.flicking-arrow-prev::after {
    background-color: black;
}

.flicking-arrow-disabled::after,
.flicking-arrow-disabled::before {
    background-color: rgb(220, 220, 220);
}
</style>