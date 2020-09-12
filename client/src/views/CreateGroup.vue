<template>
  <div class="create-group">
    <div class="row">
      <div class="col-md-10">
        <div class="row">
          <div class="col-md-4">
            <h6 class="mb-4 text-right strong">Group Name:</h6>
          </div>
          <div class="col-md-8">
            <input v-model="form.name">
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <h6 class="mb-4 text-right strong">Start Date:</h6>
          </div>
          <div class="col-md-8">
            <datepicker format="MMMM dsu" v-model="form.startDate"></datepicker>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <h6 class="mb-4 text-right strong">End Date:</h6>
          </div>
          <div class="col-md-8">
            <datepicker format="MMMM dsu" v-model="form.endDate"></datepicker>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <h6 class="mb-4 text-right strong">Group Size:</h6>
          </div>
          <div class="col-md-8">
            <input placeholder="Leave Blank for unlimited" v-model="form.maxGroupSize">
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <h6 class="mb-4 text-right strong">Group Status:</h6>
          </div>
          <div class="col-md-8">
            <button
              :class="{'bold': form.groupStatus === 'private'}"
              @click="form.groupStatus = 'private'"
            >Private</button>
            |
            <button
              :class="{'bold': form.groupStatus === 'public'}"
              @click="form.groupStatus = 'public'"
            >Public</button>
          </div>
        </div>

        <div class="row" v-if="form.groupStatus === 'private'">
          <div class="col-md-4">
            <h6 class="mb-4 text-right strong">Password:</h6>
          </div>
          <div class="col-md-8">
            <input v-model="form.password">
          </div>
        </div>
      </div>

      <div class="col-md-2"></div>
    </div>
    <div class="row mt-4">
      <div class="col">
        <div v-if="createError" class="alert alert-danger" role="alert">{{createError}}</div>
        <button
          @click="!creatingGroup && createGroup()"
          class="strong"
        >Create {{form.groupStatus | titleCase}} Group</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import axios from "axios";
import moment from "moment";
import Datepicker from "vuejs-datepicker";

import badWords from "@/assets/swear";
import Button from "@/components/Button.vue";
import router from "../router";
import AuthService from "../services/AuthService";

export default {
  data() {
    return {
      form: {
        name: null,
        startDate: null,
        endDate: null,
        maxGroupSize: null,
        groupStatus: "private",
        password: null,
        sport: this.$route.params.sportName
      },
      createError: null,
      creatingGroup: null
    };
  },
  mounted() {
    if (!AuthService.token) {
      this.$router.push("/");
    }
  },
  methods: {
    ...mapMutations(["addGroup"]),
    async createGroup() {
      this.createError = null;

      if (!this.form.name) {
        this.createError = "name must be set";
        return;
      }

      this.form.name = this.form.name.trim().replace(/\s+/g, " ");

      if (this.form.name.length > 16) {
        this.createError = "name must be less than 16 characters";
        return;
      }

      if (!this.form.startDate) {
        this.createError = "start date must be defined";
        return;
      }

      if (!this.form.endDate) {
        this.createError = "end date must be defined";
        return;
      }

      if (this.form.name.toLowerCase().trim() === "overall") {
        this.createError = "Please pick a different group name.";
        return;
      }

      const hasBadWords = badWords.some(word => {
        return this.form.name.toLowerCase().indexOf(word.toLowerCase()) !== -1;
      });

      if (hasBadWords) {
        this.createError =
          "Please refrain from profanity and pick a different group name.";
        return;
      }

      if (this.form.groupStatus === "private" && !this.form.password) {
        this.createError = "password must be defined";
        return;
      }

      if (this.form.maxGroupSize && parseInt(this.form.maxGroupSize, 10) <= 1) {
        this.createError = "the group size must be greater than 1";
        return;
      }

      if (moment(this.form.endDate).isBefore(moment(), "day")) {
        this.createError = "the end date must be after the current date";
        return;
      }

      if (moment(this.form.startDate).isBefore(moment(), "day")) {
        this.createError = "the start date must come after the current date";
        return;
      }

      if (
        moment(this.form.startDate).isAfter(moment(this.form.endDate), "day")
      ) {
        this.createError = "the start date must come before the end date";
        return;
      }
      this.creatingGroup = true;
      try {
        const { data: group } = await axios.post("/api/groups", this.form);
        await axios.post("/api/groups_users", {
          userId: this.userId,
          groupId: group.id,
          sport: this.$route.params.sportName,
          password: this.form.password
        });
        this.addGroup(group);
        router.push(
          `/${this.$route.params.sportName}/standings/groups/${group.id}`
        );
      } catch (err) {
        if (err.response.data.message === "group name already exists") {
          this.createError = "this group name is already in use";
        }
      } finally {
        this.creatingGroup = false;
      }
    }
  },
  computed: {
    ...mapState(["userId"])
  },
  components: {
    Datepicker,
    Button
  }
};
</script>

<style scoped>
.bold {
  font-weight: 500;
}

.strong {
  font-weight: 500;
}

datepicker {
  width: 100%;
}

.create-group {
  padding-bottom: 200px;
}
</style>
