<template>
  <div class="rules" v-if="group">
    <h5>Group Rules</h5>
    <div><b>Start Date: {{group.startDate | month}}</b></div>
    <div><b>Final End Date: {{group.endDate | month}}</b></div>
    <div>Join Status: {{group.groupStatus}}</div>
    <div>Current Group Size: {{group.__meta__.users_count || 'None'}}</div>
    <div>Group Size Limit: {{group.maxGroupSize || 'None'}}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: [
    'groupId',
  ],
  data() {
    return {
      group: null,
    };
  },
  watch: {
    groupId: {
      immediate: true,
      async handler(groupId) {
        if (groupId) {
          const { data: group, } = await axios.get(`/api/groups/${groupId}`);
          this.group = group;
        }
      },
    },
  },
};
</script>

<style scoped>
.rules {
  text-align: left;
}
</style>
