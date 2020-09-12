<template>
  <div>
    <div class="row space">
      <div class="col-md-6">
        <img src="man.png">
      </div>
      <div class="col-md-1"></div>
      <div class="col-md-5">
        <h3 class="text-left mb-8">{{profile.name}}</h3>

        <InfoRow label="Overall Rank:" :value="profile.position"/>
        <InfoRow label="Total Games:" :value="profile.totalGames"/>
        <InfoRow label="Win / Loss %:" :value="profile.winLossPercent + '%'"/>
        <InfoRow label="Most Picked Team:" :value="profile.mostPickedTeam"/>
        <InfoRow label="Least Picked Team:" :value="profile.leastPickedTeam"/>
        <InfoRow v-if="profile.groups" label="Groups Participated:" :value="profile.groups.length"/>

        <div class="row mt-4">
          <div class="tabs">
            <div
              class="tab col-md-4"
              :class="{selected: selectedTab === 'history'}"
              @click="selectedTab = 'history'"
            >Picks History</div>
            <div
              class="tab col-md-4"
              :class="{selected: selectedTab === 'active'}"
              @click="selectedTab = 'active'"
            >Active Groups</div>
            <div
              class="tab col-md-4"
              :class="{selected: selectedTab === 'past'}"
              @click="selectedTab = 'past'"
            >Past Groups</div>
          </div>

          <div style="width: 100%;" v-if="selectedTab === 'history'">
            <table style="width: 100%; margin-top: 10px;">
              <tr>
                <th>Date</th>
                <th>Games</th>
                <th>Points Awarded</th>
              </tr>
            </table>
            <simplebar style="max-height: 300px;" data-simplebar-auto-hide="true">
              <div style="width: 100%;">
                <table style="width: 100%">
                  <tr v-for="point in points" :key="point.id">
                    <td>{{point.date}}</td>
                    <td>
                      <span :class="{winner: point.winner === point.home}">{{point.home}}</span> -
                      <span :class="{winner: point.winner === point.away}">{{point.away}}</span>
                    </td>
                    <td :style="colorizePoints(point.points)">
                      <b>{{point.points > 0 ? '+' : ''}}{{point.points}}</b>
                    </td>
                  </tr>
                </table>

                <div
                  style="width: 100%; font-size: 14px;"
                  class="mt-4 text-center"
                >*Team that won is bolded</div>
              </div>
            </simplebar>
          </div>

          <div v-if="selectedTab === 'active'" class="mt-4" style="width: 100%;">
            <simplebar style="max-height: 300px;" data-simplebar-auto-hide="true">
              <div v-for="group in groups.current" :key="group.id">
                <router-link
                  :to="`/${$route.params.sportName}/standings/groups/${group.id}`"
                  tag="button"
                >{{group.name}}</router-link>
              </div>
            </simplebar>
          </div>

          <div v-if="selectedTab === 'past'" class="mt-4" style="width: 100%;">
            <simplebar style="max-height: 300px;" data-simplebar-auto-hide="true">
              <div v-for="group in groups.past" :key="group.id">
                <router-link
                  :to="`/${$route.params.sportName}/standings/groups/${group.id}`"
                  tag="button"
                >{{group.name}}</router-link>
              </div>
            </simplebar>
          </div>
        </div>

        <div class="mt-12">Last Active: {{profile.lastActive | fromNow}}</div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import axios from "axios";
import moment from "moment";
import simplebar from "simplebar-vue";

import InfoRow from "@/components/InfoRow.vue";

export default {
  data() {
    return {
      profile: {},
      selectedTab: "history",
      points: [],
      refreshInterval: null,
      groups: {
        past: [],
        current: []
      }
    };
  },
  watch: {
    "$route.params.profileId": {
      immediate: true,
      async handler(profileId) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = setInterval(() => {
          this.refreshProfile(profileId);
        }, 60000);
        this.refreshProfile(profileId);
      }
    }
  },
  destroyed() {
    clearInterval(this.refreshInterval);
  },
  methods: {
    colorizePoints(points) {
      const color = points > 0 ? "#55efc4" : "#fab1a0";
      return {
        color
      };
    },
    async refreshProfile(profileId) {
      axios
        .get(`/api/sports/${this.$route.params.sportName}/users/${profileId}`)
        .then(({ data: profile }) => {
          this.profile = profile;
        });

      axios
        .get(
          `/api/sports/${
            this.$route.params.sportName
          }/users/${profileId}/groups`
        )
        .then(({ data: groups }) => {
          this.groups.past = groups.filter(group =>
            moment(group.endDate).isBefore(moment(), "day")
          );
          this.groups.current = groups.filter(group =>
            moment(group.endDate).isSameOrAfter(moment(), "day")
          );
        });

      axios
        .get(
          `/api/sports/${
            this.$route.params.sportName
          }/users/${profileId}/points`
        )
        .then(({ data: points }) => {
          this.points = points;
          this.points.sort((a, b) => moment(b.date).diff(moment(a.date)));
        });
    }
  },
  components: {
    InfoRow,
    simplebar
  }
};
</script>

<style scoped>
img {
  width: 100%;
  display: inline-block;
}

.space {
  margin-top: 120px;
}

.tabs {
  border-bottom: 1px solid #ddd;
  width: 100%;
}

.tab {
  display: inline-block;
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0);
  position: relative;
  top: 1px;
}

.tab:hover {
  border-bottom: 1px solid #333;
}

table tr {
  text-align: left;
}

table tr th {
  width: 33%;
  text-align: center;
}

table tr td {
  width: 33%;
  text-align: center;
}

.selected {
  font-weight: 600;
  border-bottom: 1px solid #333;
}

.winner {
  font-weight: 600;
}
</style>
