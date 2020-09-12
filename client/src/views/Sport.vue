<template>
  <div>
    <Navigation />
    <div class="container">
      <transition :name="transitionName">
        <router-view class="child-view" />
      </transition>
    </div>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue';

export default {
  data() {
    return {
      transitionName: 'slide-left',
    };
  },
  beforeRouteUpdate(to, from, next) {
    const toDepth = to.path.split('/').length;
    const fromDepth = from.path.split('/').length;
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
    next();
  },
  components: {
    Navigation,
  },
};
</script>

<style lang="scss">

.child-view {
  position: relative;
  transition: all 0.3s linear;/*cubic-bezier(.55,0,.1,1);*/
}

.slide-left-enter, .slide-right-leave-active {
  opacity: 0;
  position: absolute;
  top: 0px;
  -webkit-transform: translate(100%, 0%);
  transform: translate(100%, 0%);
}

.slide-left-leave-active, .slide-right-enter {
  opacity: 0;
  position: absolute;
  top: 0px;
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100%, 0);
}
</style>
