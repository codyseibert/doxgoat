<template>
  <Modal
    v-if="isLoginModalOpen"
    @close="clickedOutside">
    <h3 slot="header" class="text-center top">
      <img class="panda" />
      Sign In
    </h3>
    <div slot="body">
      <div class="form">
        <input v-model="email" placeholder="Email" />
        <input
          v-model="password"
          placeholder="Password"
          type="password"
          autocomplete="new-password" />
        <div v-if="loginError" class="alert alert-danger" role="alert">
          {{loginError}}
        </div>
        <button @click="login"><b>Login</b></button>
        <div class="mt-4 or">OR</div>
      </div>
      <div class="mt-4">
        <a href="/api/login/facebook" class="social">
          <button tag="button">
            <i class="fa fa-facebook"></i>SIGN IN USING FACEBOOK
          </button>
        </a>
      </div>

      <div class="mt-4 mb-8">
        <a href="/api/login/google" class="social">
          <button tag="button">
            <i class="fa fa-google-plus"></i>SIGN IN USING GOOGLE+
          </button>
        </a>
      </div>
      <hr>
      <div>
        Don't have an account?
        <button @click="toRegister">
          <span class="bold">Sign Up Here</span>
        </button>
      </div>
    </div>
  </Modal>
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
      loginError: null,
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
  methods: {
    ...mapMutations([
      'openLoginModal',
      'closeLoginModal',
    ]),
    toRegister() {
      this.closeModal();
      this.$router.push('/register');
    },
    closeModal() {
      this.loginError = null;
      this.closeLoginModal();
    },
    clickedOutside() {
      this.closeModal();
    },
    logout() {
      AuthService.setToken(null);
      this.$router.push('/');
    },
    async login() {
      try {
        const { data: info, } = await axios.post('/api/auth/login', {
          email: this.email,
          password: this.password,
        });
        AuthService.setToken(info.token);
        this.closeModal();
        this.$router.push('/');
      } catch (err) {
        this.loginError = 'Sign Ups via Email is currently disabled. Please Sign Up / Log in via Facebook or Google Account option below.';
      }
    },
  },
  components: {
    Modal,
  },
};
</script>

<style scoped>

input{
  text-align: left;
  padding-top: 30px;
  margin-bottom: 30px;
  border-color:#d6d6d6;
}

.form {
  color: #d34836;
  font-size: 15px;
}

div {
  color: #050505;
  font-size: 13px;

}

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
  letter-spacing: 2px;
  font-weight: 100px;
}

nav {
  background-color: white;
}

.panda {
  position: absolute;
  z-index: 15;
  top: -205px;
  width: 240px;
  left: 95px;
}

.social {
  color: white;
}

.social button {
  border: 1px solid #DDD;
  border-radius: 5px;
  padding: 20px;
  padding-left: 110px;
  padding-right: 40px;
  font-size: 11px;
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

.or {
  font-size: 12px;
}

.bold {
  font-weight: bold;
}

input {
  font-size: 15px;
  background-color: none;
  background: none;
}

.v.model {
  font-size: 12px;
}

.form {
  max-width: 300px;
  margin: 0 auto;
}

.mt-4 {
  font-size: 12px
}

button {
  font-weight: 500;
}

.button-login {
  padding-top: 50px;
  padding-bottom: 50px;
}
</style>
