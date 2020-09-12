<template>
  <div>
    <vue-good-table
      :columns="columns"
      :rows="allGroups"
      :fixed-header="true"
      max-height="540px"
      @on-row-click="onRowClick"
      :search-options="{
          enabled: false,
        }"
      :pagination-options="{
          enabled: false,
        }"
      styleClass="vgt-table"
    ></vue-good-table>
    <div class="row mt-4">
      <div class="col-md-3"></div>
      <div class="text-center col-md-6">
        <input placeholder="Search Group" v-model="search">
      </div>
      <div class="col-md-3"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { mapMutations, mapState } from "vuex";
import AuthService from "@/services/AuthService";

export default {
  name: "my-component",
  components: {},
  methods: {
    ...mapMutations(["addGroup", "setGroupToJoin"]),
    async refreshGroups() {
      const { data: groups } = await axios.get(
        `/api/sports/${this.$route.params.sportName}/groups`
      );
      this.rows = groups.map(player => ({
        ...player,
        groupSize: player.__meta__.users_count
      }));
    },
    alreadyInGroup(group) {
      return !AuthService.token || this.userGroups.indexOf(group.id) !== -1;
    },
    onNoJoin() {
      this.groupToJoin = null;
    },
    async onJoin() {
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
        this.groupToJoin = null;
      } catch (err) {
        if (err.response.data.message === "group full") {
          this.joinError = "group is full";
        } else if (
          err.response.data.message ===
          "you have re-joined this group too many times"
        ) {
          this.joinError =
            "you have been blocked from joining this group since you have rejoined too many times";
        } else {
          this.joinError = "invalid group password";
        }
      }
    },
    onRowClick(params) {
      this.setGroupToJoin(params.row);
    }
  },
  destroyed() {
    clearInterval(this.refreshInterval);
  },
  async mounted() {
    if (AuthService.token) {
      const { data: userGroups } = await axios.get(
        `/api/sports/${this.$route.params.sportName}/users/${
          this.userId
        }/groups`
      );
      this.userGroups = userGroups.map(g => g.id);
    }

    this.refreshInterval = setInterval(() => {
      this.refreshGroups();
    }, 60000);

    this.refreshGroups();
  },
  computed: {
    allGroups() {
      return this.rows
        .filter(group => !moment().isAfter(moment(group.endDate), "day"))
        .filter(group => this.userGroups.indexOf(group.id) === -1)
        .filter(
          group =>
            this.search === "" ||
            group.name.toUpperCase().indexOf(this.search.toUpperCase()) !== -1
        );
    },
    ...mapState(["userId"])
  },
  data() {
    return {
      refreshInterval: null,
      joinError: null,
      search: "",
      userGroups: [],
      groupToJoin: null,
      joinPassword: null,
      columns: [
        {
          label: "Group Name",
          field: "name"
        },
        {
          label: "# of Players",
          field: "groupSize",
          tdClass: "text-center",
          thClass: "text-center"
        },
        {
          label: "Join Status",
          field: "groupStatus",
          tdClass: "text-center",
          thClass: "text-center"
        },
        {
          label: "Start Date",
          field: "startDate",
          type: "date",
          dateInputFormat: "YYYY-MM-DD",
          dateOutputFormat: "MMM Do",
          tdClass: "text-center",
          thClass: "text-center"
        },
        {
          label: "End Date",
          field: "endDate",
          dateInputFormat: "YYYY-MM-DD",
          dateOutputFormat: "MMM Do",
          type: "date",
          tdClass: "text-center",
          thClass: "text-center"
        }
      ],
      rows: []
    };
  }
};
</script>

<style scoped>
input {
  border: 1px;
  outline: none;
  border-bottom: 1px solid #fafafa;
  padding-left: 100px;
  padding-right: 100px;
  text-align: center;
}

button {
  background: none;
  border: none;
  cursor: pointer;
}

button:hover {
  color: #333;
}

.col-md-6 {
  font-size: 14px;
}

div {
  font-family: "Montserrat";
  font-size: 13px;
  font-weight: 300;
}

h3 {
  font-size: 18px;
  padding-bottom: 20px;
}

h6 {
  font-size: 14px;
}
</style>
