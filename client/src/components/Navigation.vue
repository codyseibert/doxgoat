<template>
  <div>
    <nav
      class="navbar fixed-top navbar-expand-lg navbar-light">
      <div class="container">
        <router-link class="navbar-brand" to="/">DoxGoat</router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="nav navbar-nav flex-row justify-content-between ml-auto">
            <li
              class="nav-item active"
              :class="{selected: selectedRoute === 'home'}"
            >
              <router-link class="nav-link" :to="`/${$route.params.sportName}`">Home</router-link>
            </li>
            <li
              class="nav-item active"
              :class="{
                selected: selectedRoute === 'groups' ||
                selectedRoute === 'overall' ||
                selectedRoute === 'create' ||
                selectedRoute === 'search'
              }"
            >
              <router-link
                class="nav-link"
                :to="`/${$route.params.sportName}/standings`">Standings</router-link>
            </li>
            <li
              v-if="isLoggedIn"
              class="nav-item active"
              :class="{selected: selectedRoute === 'profile'}"
            >
              <router-link
                class="nav-link"
                :to="`/${$route.params.sportName}/profile/${userId}`">My Profile</router-link>
            </li>
            <li v-if="!isLoggedIn" class="nav-item active">
              <button
                class="nav-link"
                @click="openLoginModal">Login / Sign Up</button>
            </li>
            <li v-if="isLoggedIn" class="nav-item active">
              <button
                class="nav-link"
                @click="logout">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState, mapMutations, } from 'vuex';

import Modal from '@/components/Modal.vue';
import AuthService from '../services/AuthService';

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  computed: {
    isLoggedIn() {
      return AuthService.token;
    },
    ...mapState([
      'isLoginModalOpen',
      'userId',
    ]),
  },
  watch: {
    '$route.name': {
      immediate: true,
      handler(name) {
        this.selectedRoute = name;
      },
    },
  },
  methods: {
    ...mapMutations([
      'openLoginModal',
      'closeLoginModal',
    ]),
    clickedOutside() {
      this.closeLoginModal();
    },
    logout() {
      AuthService.setToken(null);
      this.$router.push('/');
    },
    async login() {
      const { data: info, } = await axios.post('/api/auth/login', {
        email: this.email,
        password: this.password,
      });
      AuthService.setToken(info.token);
      this.closeLoginModal();
      this.$router.push('/');
    },
  },
  components: {
    Modal,
  },
};
</script>

<style scoped>
.nav-item {
  padding-top: 50px;
  margin-right: 15px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
}

.navbar-brand {
  padding-top: 50px;
  font-family: 'Montserrat', sans-serif;
  font-size: 25px;
}

.top {
  position: relative;
  padding-top: 20px;
}

h3 {
  font-weight: 300px;
}

nav {
  background-color: white;
}

.selected {
  font-weight: 600;
}

.panda {
  position: absolute;
  z-index: 15;
  top: -193px;
  width: 200px;
  left: 100px;
}

.social {
  color: white;
}

.social button {
  border: 1px solid #DDD;
  border-radius: 5px;
  padding: 20px;
  padding-left: 120px;
  padding-right: 40px;
  font-size: 12px;
  font-weight: bold;
  text-align: left;
  position: relative;
  width: 80%;
  box-shadow: 1px 1px 1px #DDD;
}

.social i {
  margin-right: 10px;
  position: absolute;
  left: 35px;
  top: 16px;
  font-size: 26px;
}

.fa-facebook {
  color: #3B5998;
}

.fa-google-plus {
  color: #d34836;
}
</style>
