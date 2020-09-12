<template>
  <div>
    <vue-good-table
      :columns="columns"
      :rows="standings"
      max-height="540px"
      @on-row-click="onRowClick"
      :search-options="{
          enabled: false,
        }"
      :pagination-options="{
          enabled: false,
        }"
      :rowStyleClass="rowStyle"
      styleClass="vgt-table"
      :fixed-header="true"
    />

    <div class="row mt-4">
      <div class="col-md-4"></div>
      <div class="text-center col-md-4">
        <input placeholder="Search Name" v-model="search">
      </div>
      <div class="col-md-4"></div>
    </div>

    <h6 v-if="lastUpdated" class="strong mt-4">Last Updated: {{lastUpdated | hour}}</h6>

    <div v-if="groupId" class="row mt-4">
      <div class="col-md-6">
        <GroupRules :groupId="groupId"/>
      </div>
      <div class="col-md-6">
        <div v-if="!isOverall && group" class="text-center">
          <div v-if="isGroupCompleted()">
            <div class="remaining">Completed</div>
            <h4 class="mt-4">Winner</h4>
            <h3 class="mt-4">{{ getWinner() }}</h3>
          </div>
          <div v-else>
            <div class="remaining">{{ getGroupDaysLeft() }}</div>
            <h4>Days Left</h4>
            <button class="mt-4" v-if="!inGroup()" @click="setGroup(groupId)">Join Group</button>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-8">
      <div class="col-md-6">
        <transition name="fade">
          <Button @click="createGroup">Create a Group</Button>
        </transition>
      </div>
      <br>
      <div class="col-md-6">
        <Button @click="gotoFind">Find a Group</Button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import { mapMutations, mapState } from "vuex";
import moment from "moment";
import axios from "axios";
import AuthService from "@/services/AuthService";
import GroupRules from "@/components/GroupRules.vue";
import Button from "@/components/Button.vue";
import router from "../router";

export default {
  name: "my-component",
  components: {
    GroupRules,
    Button,
  },
  watch: {
    $route: {
      immediate: true,
      async handler(route) {
        clearInterval(this.refreshInterval);
        this.refreshStandings(route);
        this.refreshInterval = setInterval(() => {
          this.refreshStandings(route);
        }, 60000);
      },
    },
    "$route.params": {
      immediate: true,
      async handler({ groupId }) {
        this.groupId = groupId;

        if (groupId) {
          axios.get(`/api/groups/${groupId}`).then(({ data: group }) => {
            this.group = group;
          });
        }
      },
    },
  },
  computed: {
    standings() {
      return this.rows.filter(
        (standing) =>
          this.search === "" ||
          standing.name.toUpperCase().indexOf(this.search.toUpperCase()) !== -1
      );
    },
    ...mapState(["userId", "groups"]),
  },
  destroyed() {
    clearInterval(this.refreshInterval);
  },
  methods: {
    ...mapMutations(["openLoginModal", "setGroupToJoin"]),
    async refreshStandings(route) {
      let rows;
      let rowPromise = Promise.resolve();
      // if (/\/[a-z]+\/standings\/overall$/.test(route.path)) {
      //   rowPromise = axios.get(
      //     `/api/sports/${this.$route.params.sportName}/standings/overall`
      //   );
      //   this.isOverall = true;
      // } else {
      //   this.isOverall = false;
      //   rowPromise = axios.get(
      //     `/api/sports/${this.$route.params.sportName}/groups/${
      //       route.params.groupId
      //     }/standings`
      //   );
      // }
      rowPromise.then(() => {
        const rows = [
          {
            points: 33,
            name: "Bob",
            rank: 0,
            wins: 5,
            losses: 10,
            winPercent: 0.9,
          },
          {
            points: 623,
            name: "Rick",
            rank: 3,
            wins: 2,
            losses: 10,
            winPercent: 0.34,
          },
          {
            points: 2,
            name: "RKelly",
            rank: 0,
            wins: 4,
            losses: 3,
            winPercent: 0.5,
          },
          {
            points: 3,
            name: "Rex",
            rank: 0,
            wins: 2,
            losses: 1,
            winPercent: 0.7,
          },
          {
            points: 4,
            name: "Cody",
            rank: 0,
            wins: 5,
            losses: 10,
            winPercent: 0.3,
          },
          {
            points: 23,
            name: "Roger",
            rank: 0,
            wins: 5,
            losses: 10,
            winPercent: 0.7,
          },
          {
            points: 6,
            name: "Nick",
            rank: 0,
            wins: 5,
            losses: 10,
            winPercent: 0.1,
          },
          {
            points: 10,
            name: "Yang",
            rank: 0,
            wins: 5,
            losses: 10,
            winPercent: 0.7,
          },
        ];
        rows.sort((a, b) => b.points - a.points);
        const rowsWithPositions = rows.map((row, i) => ({
          ...row,
          position: i + 1,
        }));
        this.rows = rowsWithPositions.map((r) => ({
          ...r,
          streak: this.getStreakString(r),
        }));
      });

      axios.get("/api/status").then(({ data: status }) => {
        this.lastUpdated = status.lastUpdate;
      });
    },
    async setGroup(groupId) {
      axios.get(`/api/groups/${groupId}`).then(({ data: group }) => {
        this.setGroupToJoin(group);
      });
    },
    inGroup() {
      return (
        this.$route.params.groupId &&
        this.groups.find(
          (g) => g.id === parseInt(this.$route.params.groupId, 10)
        )
      );
    },
    getGroupDaysLeft() {
      return moment(this.group.endDate).diff(moment(), "days");
    },
    isGroupCompleted() {
      return moment().isAfter(moment(this.group.endDate), "day");
    },
    gotoFind() {
      this.$router.push(`/${this.$route.params.sportName}/standings/find`);
    },
    getWinner() {
      return this.rows.find((standing) => standing.rank === 1).name;
    },
    rowStyle(row) {
      if (row.userId === this.userId) {
        return "owns";
      }
      return "";
    },
    createGroup() {
      if (AuthService.token) {
        this.$router.push(`/${this.$route.params.sportName}/standings/create`);
      } else {
        this.openLoginModal();
      }
    },
    getStreakString(r) {
      const diff = r.wins - r.losses;
      if (diff === 0) {
        return "-";
      }
      return diff > 0 ? `W${diff}` : `L${Math.abs(diff)}`;
    },
    onRowClick(params) {
      router.push(
        `/${this.$route.params.sportName}/profile/${params.row.userId}`
      );
    },
  },
  data() {
    return {
      refreshInterval: null,
      group: null,
      lastUpdated: null,
      isOverall: false,
      groupId: null,
      search: "",
      columns: [
        {
          label: "Name",
          field: "name",
        },
        {
          label: "Rank",
          field: "rank",
          type: "number",
          tdClass: "text-center",
          thClass: "text-center",
        },
        {
          label: "Win",
          field: "wins",
          type: "number",
          tdClass: "text-center",
          thClass: "text-center",
        },
        {
          label: "Loss",
          field: "losses",
          type: "number",
          tdClass: "text-center",
          thClass: "text-center",
        },
        {
          label: "Win %",
          field: "winPercent",
          width: "120px",
          type: "percentage",
          formatFn(value) {
            return Math.round(value * 100);
          },
          tdClass: "text-center",
          thClass: "text-center",
        },
        {
          label: "Points",
          field: "points",
          type: "number",
          tdClass: "text-center points",
          thClass: "text-center",
          formatFn(value) {
            return value.toFixed(1);
          },
        },
        {
          label: "Streak",
          field: "streak",
          tdClass: "text-center",
          thClass: "text-center",
        },
      ],
      rows: [],
    };
  },
};
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.2";

div {
  font-family: "Montserrat";
  font-size: 13px;
  font-weight: 300;
}

button {
  font-size: 15px;
  font-weight: 600;
}

h6 {
  font-size: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.remaining {
  color: orange;
  font-size: 40px;
}

table.vgt-table tr {
  margin-bottom: 10px;
}
</style>
