<template>
  <div>
    <Clock/>

    <div class="space"></div>

    <div class="row content">
      <div class="col-md-9" id="standings">
        <router-view/>
      </div>
      <div class="col-md-3 mt-4">
        <div id="groups">
          <div
            :class="{'selected': $route.path.indexOf('overall') !== -1}"
            class="group text-left overall"
          >
            <router-link
              tag="span"
              :to="`/${$route.params.sportName}/standings/overall`"
            >Overall Standings</router-link>
          </div>

          <div
            :class="{'selected': selectedGroup === group.id}"
            @click="selectGroup(group)"
            class="group text-left mb-2"
            v-for="group in groups"
            :key="group.id"
          >
            {{group.name}} Standings
            <i @click="leaveGroup(group)" class="fa fa-close ml-4"></i>
          </div>
        </div>
      </div>
    </div>

    <Modal v-if="isConfirmModalDisplayed" @close="isConfirmModalDisplayed = false">
      <h3 slot="header" class="text-center">Confirmation</h3>
      <div slot="body">Are you sure you want to leave this group?
        <br>
        <br>
        <h3 class="mb-9">{{groupToLeave.name}}</h3>
      </div>

      <div slot="footer">
        <button class="mr-4" @click="confirmLeave">YES</button>
        <button class="mr-4" @click="isConfirmModalDisplayed = false">NO</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import axios from "axios";
import moment from "moment";
import Modal from "@/components/Modal.vue";
import Clock from "@/components/Clock.vue";
import router from "../router";
import AuthService from "../services/AuthService";

export default {
  methods: {
    leaveGroup(group) {
      this.groupToLeave = group;
      this.isConfirmModalDisplayed = true;
    },
    selectGroup(group) {
      router.push(
        `/${this.$route.params.sportName}/standings/groups/${group.id}`
      );
    },
    ...mapMutations(["setGroups", "removeGroup"]),
    async confirmLeave() {
      await axios.delete(
        `/api/groups_users/${this.groupToLeave.id}/users/${this.userId}`
      );
      this.isConfirmModalDisplayed = false;
      this.removeGroup(this.groupToLeave);
      this.$router.push(`/${this.$route.params.sportName}/standings/overall`);
    }
  },
  computed: {
    ...mapState(["groups", "userId"])
  },
  watch: {
    $route: {
      immediate: true,
      handler(route) {
        if (/\/[a-z]+\/standings$/.test(route.path)) {
          router.push(`/${this.$route.params.sportName}/standings/overall`);
        } else if (/\/[a-z]+\/standings\/overall$/.test(route.path)) {
          this.selectedGroup = null;
        }
      }
    },
    "$route.params": {
      immediate: true,
      handler({ groupId }) {
        if (groupId) {
          this.selectedGroup = parseInt(groupId, 10);
        } else {
          this.selectedGroup = null;
        }
      }
    }
  },
  data() {
    return {
      selectedGroup: null,
      isConfirmModalDisplayed: false
    };
  },
  async mounted() {
    const standings = document.getElementById("standings");
    const groups = document.getElementById("groups");
    groups.style.left = standings.getBoundingClientRect().width;
    groups.style.top = standings.getBoundingClientRect().height;

    if (AuthService.token) {
      axios
        .get(
          `/api/sports/${this.$route.params.sportName}/users/${
            this.userId
          }/groups`
        )
        .then(({ data: groups }) => {
          this.setGroups(
            groups.filter(group =>
              moment(group.endDate).isSameOrAfter(moment(), "day")
            )
          );
        });
    } else {
      this.setGroups([]);
    }
  },
  components: {
    Clock,
    Modal
  }
};
</script>

<style scoped>
.group {
  cursor: pointer;
}

#groups {
  position: fixed;
}

.selected {
  font-weight: 600;
}

.content {
  margin-top: 165px;
  padding-top: 0px;
  /* padding-left: 55px; */
  overflow-y: hidden;
}

.space {
  height: 100px;
}

.col-md-9 {
  padding-right: 0px;
}

.col-md-3 {
  padding-left: 70px;
}

.text-center {
  font-size: 16px;
  font-weight: 600;
}

.mb-9 {
  text-align: center;
  padding-bottom: 10px;
  padding-top: 10px;
}

.mr-4 {
  padding-left: 25px;
  text-align: center;
  width: 20%;
  font-size: 18px;
  font-weight: 600;
}

.overall {
  margin-bottom: 24px;
}
</style>
