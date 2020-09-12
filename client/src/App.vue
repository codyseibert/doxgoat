<template>
  <div id="app">
    <transition name="fade">
      <router-view class="view"/>
    </transition>
    <LoginModal/>
    <JoinGroupModal/>
    <div class="footer">
      <div>
        <router-link tag="span" :to="'/'" style="cursor: pointer">Home</router-link>
        <span class="ml-2 mr-2">|</span>
        <router-link tag="span" :to="'/terms'" style="cursor: pointer">Terms & Privacy</router-link>
        <span class="ml-2 mr-2">|</span>
        <a href="mailto:support@paradoxicalissue.com">Contact Us</a>
      </div>
      <div class="mt-2 mb-4 smaller">© 2019 DoxGoat</div>
    </div>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import LoginModal from "@/components/LoginModal.vue";
import JoinGroupModal from "@/components/JoinGroupModal.vue";

export default {
  components: {
    Navigation,
    LoginModal,
    JoinGroupModal
  }
};
</script>


<style>
@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.2";
@import "../node_modules/vue2-scrollbar/dist/style/vue2-scrollbar.css";
@import "../node_modules/simplebar/dist/simplebar.min.css";

/* @import "../node_modules/vue-good-table/dist/vue-good-table.min.css"; */

.scroll-table {
  max-height: 400px;
}

.fade-enter-active {
  transition: opacity 2s;
}

.fade-enter {
  opacity: 0;
}

#app {
  font-family: "Montserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
}
#nav {
  padding: 30px;
}

.container {
  position: relative;
  overflow-y: hidden;
  overflow-x: hidden;
}

#nav a {
  font-weight: lighter;
  color: #000000;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.mt-8 {
  margin-top: 3rem;
}

.mb-8 {
  margin-bottom: 2.5rem;
}

.mt-12 {
  margin-top: 3rem;
}

.mb-12 {
  margin-bottom: 3rem;
}

.pt-8 {
  padding-top: 2.5rem;
}

.pb-8 {
  padding-bottom: 2.5rem;
}

.pt-12 {
  padding-top: 3rem;
}

.pb-12 {
  padding-bottom: 3rem;
}

table.vgt-table {
  width: 100%;
  text-align: left;
  border: none;
}

table.vgt-table thead {
  border-bottom: 1px solid #aaa;
}

.points {
  background-color: #fff1cb;
}

.vgt-table thead th {
  background: none;
}

table.vgt-table td {
  border-bottom: none;
}

table.vgt-table tr.owns td {
  font-weight: bold;
}

.normal {
  font-weight: normal;
}

.view {
  margin-bottom: 100px;
}

.row {
  padding-bottom: 0px;
}

input {
  font-size: 14px;
  font-weight: 400;
  border: none;
  outline: none;
  border-bottom: 1px solid rgb(240, 240, 240);
  text-align: center;
  width: 100%;
}

.strong {
  font-weight: 600;
}

button {
  background: none;
  border: none;
  cursor: pointer;
}

button:hover {
  color: #333;
}

button:focus {
  outline: 0;
}

.footer {
  background-color: white;
  position: fixed;
  bottom: 0px;
  width: 100%;
  padding-top: 10px;
  z-index: 1000;
  color: #a0a0a0;
  font-size: 14px;
}

.smaller {
  font-size: 12px;
}
</style>
