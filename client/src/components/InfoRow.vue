<template>
  <div class="row mt-2">
    <div class="col-md-6">
      <h6 class="text-left">{{label}}</h6>
    </div>
    <div class="col-md-6">
      <h6 class="text-left">{{value}}</h6>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'label',
    'value',
  ],
};
</script>

<style>

</style>
