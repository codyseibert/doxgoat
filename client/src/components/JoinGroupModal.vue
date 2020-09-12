<template>
  <Modal v-if="groupToJoin" @close="onNoJoin">
    <div slot="header">
      <div v-if="!alreadyInGroup(groupToJoin)">
        <h3 class="text-center">Confirmation</h3>
      </div>
      <div v-else>
        <h3 class="text-center"></h3>
      </div>
    </div>
    <div slot="body">
      <h6
        v-if="!alreadyInGroup(groupToJoin)"
        class="normal mb-4"
      >Are you sure you want to join this group?</h6>

      <h3 class="mb-4">{{groupToJoin.name}}</h3>

      <div class="row">
        <div class="col-md-6">
          <h6 class="normal">Start Date:</h6>
          <h6 class="normal">End Date:</h6>
          <h6 class="normal">Group Size:</h6>
        </div>
        <div class="col-md-6">
          <h6 class="normal">{{groupToJoin.startDate | month}}</h6>
          <h6 class="normal">{{groupToJoin.endDate | month}}</h6>
          <h6 class="normal">{{groupToJoin.maxGroupSize || 'No Limit'}}</h6>
        </div>
      </div>
    </div>
    <div slot="footer">
      <div v-if="!alreadyInGroup(groupToJoin)">
        <div v-if="joinError" class="alert alert-danger" role="alert">{{joinError}}</div>
        <input
          v-if="groupToJoin.groupStatus === 'private'"
          class="mb-4"
          v-model="joinPassword"
          placeholder="password"
        >
        <button :disabled="joining" :class="{disabled: joining}" class="mr-4" @click="onJoin">YES</button>
        <button :disabled="joining" :class="{disabled: joining}" class="mr-4" @click="onNoJoin">NO</button>
      </div>
      <div v-else>
        <button @click="onNoJoin">CLOSE</button>
      </div>
    </div>
  </Modal>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from "axios";
import Modal from "@/components/Modal.vue";
import AuthService from "@/services/AuthService";

export default {
  computed: {
    ...mapState(["groupToJoin", "groups", "userId"])
  },
  data() {
    return {
      joinError: null,
      joinPassword: null,
      joining: false
    };
  },
  components: {
    Modal
  },
  methods: {
    ...mapMutations(["addGroup", "setGroupToJoin"]),
    alreadyInGroup(group) {
      return (
        !AuthService.token ||
        this.groups.map(g => g.id).indexOf(group.id) !== -1
      );
    },
    onNoJoin() {
      this.joinError = null;
      this.setGroupToJoin(null);
    },
    async onJoin() {
      if (this.joining) return;
      this.joining = true;
      this.joinError = null;
      try {
        await axios.post("/api/groups_users", {
          groupId: this.groupToJoin.id,
          userId: this.userId,
          password: this.joinPassword
        });
        this.addGroup(this.groupToJoin);
        this.$router.push(
          `/${this.$route.params.sportName}/standings/groups/${
            this.groupToJoin.id
          }`
        );
        this.setGroupToJoin(null);
      } catch (err) {
        if (err.response.data.message === "group full") {
          this.joinError = "group is full";
        } else if (err.response.data.message === "already part of group") {
          this.joinError = "already part of group";
        } else if (
          err.response.data.message ===
          "you have re-joined this group too many times"
        ) {
          this.joinError =
            "you have been blocked from joining this group since you have rejoined too many times";
        } else {
          this.joinError = "invalid group password";
        }
      } finally {
        this.joining = false;
      }
    }
  }
};
</script>

<style scoped>
.text-center {
  font-size: 16px;
  font-weight: 600;
}

.mb-4 {
  padding-bottom: 15px;
  text-align: center;
}

.normal {
  font-size: 14px;
  font-weight: 500;
}

.mr-4 {
  padding-left: 20px;
  text-align: center;
  width: 20%;
  font-size: 18px;
  font-weight: 600;
}

.disabled:hover {
  cursor: default;
}

.disabled:hover {
  color: gray;
}
</style>
