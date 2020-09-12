<template>
  <div @click="$emit('click')" class="svg-wrapper">
    <svg height="60" width="320" xmlns="http://www.w3.org/2000/svg">
      <rect class="shape" height="60" width="320" />
    </svg>
    <div class="text"><slot></slot></div>
  </div>
</template>

<script>
export default {
  props: [
    'title',
  ],
};
</script>

<style scoped>
html, body {
  background: #ffffff;
  height: 100%;
  overflow: hidden;
  text-align: center;
}

.svg-wrapper {
  cursor: pointer;
  height: 60px;
  margin: 0 auto;
  position: relative;
  transform: translateY(-50%);
  width: 320px;
}

.shape {
  fill: transparent;
  stroke-dasharray: 140 540;
  stroke-dashoffset: -467;
  stroke-width: 6px;
  stroke: #2f3542;
}

.text {
  color: #393E41;
  font-family: 'Montserrat';
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 1px;
  line-height: 36px;
  position: relative;
  top: -48px;
}

@keyframes draw {
  0% {
    stroke-dasharray: 140 540;
    stroke-dashoffset: -474;
    stroke-width: 6px;
  }
  100% {
    stroke-dasharray: 760;
    stroke-dashoffset: 0;
    stroke-width: 6px;
  }
}

.svg-wrapper:hover .shape {
  -webkit-animation: 0.5s draw linear forwards;
  animation: 0.5s draw linear forwards;
}
</style>
