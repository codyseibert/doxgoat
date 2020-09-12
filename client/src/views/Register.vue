<template>
  <div class="container">
    <div class="row mt-12">
      <router-link to="/"><div class="fa fa-close"></div></router-link>
      <div class="col-md-6">
        <h4 class="mb-2">Join our Community</h4>
        <div class="mb-4">Simply Sign up or log in Below</div>
        <center><div class="signup_input">
          <input class="mt-4" v-model="email" placeholder="Email" />
          <input v-model="username" placeholder="Username" />
          <input
            v-model="password"
            placeholder="Password"
            type="password"
            autocomplete="new-password" />
          <div v-if="registerError" class="alert alert-danger" role="alert">
          {{registerError}}
          </div>

        </div>
         </center>
        <button @click="register" class="signUp">SIGN UP</button>
        <div class="text-center mb-4">OR</div>
        <div>
          <a href="/api/login/facebook" class="social">
            <button tag="button">
              <i class="fa fa-facebook"></i>SIGN IN USING FACEBOOK
            </button>
          </a>
        </div>

        <div class="mt-4">
          <a href="/api/login/google" class="social">
            <button tag="button">
              <i class="fa fa-google-plus"></i>SIGN IN USING GOOGLE+
            </button>
          </a>
        </div>
        <hr>
        <div>
          Already have an account?
          <button @click="openLoginModal"><b>Sign In Here</b></button>
        </div>

      </div>
      <div class="col-md-6 pt-4">
        <img class="fox" src="New-Logos/SignUp_FoxForest600.jpg" />
      </div>
    </div>

  </div>
</template>

<script>
import { mapMutations, } from 'vuex';
import axios from 'axios';
import AuthService from '../services/AuthService';

export default {
  data() {
    return {
      email: '',
      username: '',
      password: '',
      registerError: null,
    };
  },
  mounted() {
    this.closeLoginModal();
  },
  methods: {
    ...mapMutations([
      'openLoginModal',
      'closeLoginModal',
    ]),
    async register() {
      try {
        const { data: response, } = await axios.post('/api/auth/register', {
          email: this.email,
          username: this.username,
          password: this.password,
        });
        AuthService.setToken(response.token);
        this.$router.push('/');
      } catch (err) {
        this.registerError = 'Sign Ups via Email is currently disabled. Please Sign Up / Log in via Facebook or Google Account option below.';
      }
    },
  },
};
</script>

<style scoped>
.social {
  color: white;
}

button {
  font-weight: 500;
}

.social button {
  border: 2px solid rgba(161, 160, 160, 0.171);
  border-radius: 6px;
  padding: 25px;
  margin-left: 30px;
  padding-left: 40px;
  padding-right: 20px;
  font-size: 12px;
  font-weight: bold;
  position: relative;
  text-align: center justify;
  width: 80%;
  box-shadow: 1px 1px 1px rgba(184, 184, 184, 0.705);
}

.social i {
  margin-right: 10px;
  position: absolute;
  left: 45px;
  top: 20px;
  font-size: 26px;
}

.fa-facebook {
  color: #3B5998;
}

.fa-google-plus {
  letter-spacing: 2px;
  color: #d34836;
}

.signup_input {
  align-content: center;
  font-size: 10px;
  width: 300px;
}

input {
  font-size: 13px;
  color:#000000;
  text-align: left;
  margin-bottom: 40px;
  border-color: #DDD;
}

.fox {
  -webkit-transform: scale(1.1);
  -moz-transform: scale(1.1);
  margin-top: 80px;
  margin-left: 10px;
  width: 100%;
  display: inline-block;
}

.mb-2 {
  margin-top: 40px;
  letter-spacing: 1px;
}

.mb-4 {
  text-align: center;
  margin-top: 20px;
  padding-bottom: 15px;
  font-weight: 600;
  font-size: 13px;
  color: #000000c9;
}

.fa-close {
  position: absolute;
  right: 30px;
  top: 20px;
  font-size: 30px;
  cursor: pointer;
}

hr {
  margin-top: 50px;
  margin-bottom: 20px;
  width: 400px;
}

div {
  font-size: 13px;
}

.mt-4 {
  font-weight: 400;
}

.signUp {
  font-size: 18px;
  font-weight: 600;
  padding-bottom: 40px;
  color:#141414;
}
</style>
