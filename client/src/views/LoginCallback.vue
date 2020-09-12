<template>
  <div></div>
</template>

<script>
import AuthService from '@/services/AuthService';

export default {
  mounted() {
    AuthService.setToken(this.$route.params.token);
    this.$router.push('/');
  },
};
</script>

<style>

</style>
