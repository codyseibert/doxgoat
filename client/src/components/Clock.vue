<template>
  <div class="clock">
    <div class="row">
      <div class="col">
        <h5>{{time | hourRaw}}</h5>
        <h6>{{time | monthRaw}}</h6>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: new Date().toISOString(),
      interval: null
    };
  },
  mounted() {
    this.interval = setInterval(() => {
      this.time = new Date().toISOString();
    }, 1000);
  },
  unmounted() {
    clearInterval(this.interval);
  }
};
</script>

<style scoped>
.clock {
  width: 100%;
  position: fixed;
  left: 0px;
  top: 105px;
  padding-top: 45px;
  background-color: white;
  z-index: 10;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
}

h5 {
  font-size: 24px;
  letter-spacing: 4px;
}

h6 {
  font-size: 14px;
}
</style>
