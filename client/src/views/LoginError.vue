<template>
  <div class="container">
    <div class="row mt-12">
      <div class="col text-center">
        <h1>DoxGoat</h1>
      </div>
    </div>

    <div class="row mt-12">
      <div class="col-md-12">
        <h3>Login Error</h3>
        <p>An error has occured trying to login.  Please contact an administrator</p>
        <router-link to="/">Go Back to Home</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
};
</script>

<style>
h1 {
  margin-top: 5%;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  font-size: 50px;
  letter-spacing: 8px;
}
</style>
