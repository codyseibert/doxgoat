<template>
  <div class="container">
    <div class="row mt-12">
      <div class="col text-center">
        <h1>DoxGoat</h1>
      </div>
    </div>

    <div class="row mt-12">
      <div class="col-md-4">
        <router-link to="/nba"><img class="clickable" src="NBA_N.jpg"></router-link>
        <h5 class="normal mt-4">NBA</h5>
      </div>

      <div class="col-md-4">
        <router-link to="/nhl"><img class="clickable" src="NHL_N.jpg"></router-link>
        <h5 class="normal mt-4">NHL</h5>
      </div>

      <div class="col-md-4">
        <router-link to="/mlb"><img class="clickable" src="MLB_N.jpg"></router-link>
        <h5 class="normal mt-4">MLB</h5>
      </div>
      <!-- SOCIAL MEDIA ICONS
        <div class="smIcons">
          <a href="https://www.facebook.com/Doxgoat/">
            <button tag="button">
              <i class="fa fa-facebook fa-lg"></i>
            </button>
          </a>

          <a href="https://www.instagram.com/doxgoats/">
            <button tag="button">
              <i class="fa fa-instagram fa-lg"></i>
            </button>
          </a>

          <a href="https://twitter.com/DoxGoat">
            <button tag="button">
              <i class="fa fa-twitter fa-lg"></i>
            </button>
          </a>
        </div>
     <SOCIAL MEDIA ICONS -->
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState, } from 'vuex';

export default {
  async mounted() {
    if (this.userId) {
      await axios.post(`/api/users/${this.userId}/activity`);
    }
  },
  computed: {
    ...mapState([
      'userId',
    ]),
  },
};
</script>

<style scoped>

.smIcons {
  position: fixed;
  max-width: 100%;
  left: 0;
  right: 0;
  bottom: 10px;
  align-items: center;
  margin-bottom: 50px;
}

img {
  width: 100%;
  display: inline-block;
  opacity: 0.4;
  margin-top: 40px;
}

img.clickable {
  cursor: pointer;
}

img.clickable:hover {
  opacity: 1.0;
}

h1 {
  margin-top: 5%;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  font-size: 50px;
  letter-spacing: 8px;
}

h5 {
  font-size: 15px;
  font-family: 'Montserrat', sans-serif;
  margin-bottom: 10px;
}

h5 {
  font-weight: 300;
}

</style>
