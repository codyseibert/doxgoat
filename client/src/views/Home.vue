
<template>
  <div class="home">
    <Clock/>

    <h2 class="no-events" v-if="!events.length">No Events Today</h2>

    <div class="space"></div>

    <div class="row mb-12" v-for="event in events" :key="event.id">
      <div class="col-md-1"></div>
      <div
        :class="{
          'selectable': isSelectable(event),
          'selected': event.selected === event.homeTeam.id
        }"
        class="col-md-3 team pt-2"
        @click="selectTeam(event, event.homeTeam)"
      >
        <h4>{{event.homeTeam.city}} {{event.homeTeam.name}}</h4>
        <h6>{{event.homeTeam.wins}}-{{event.homeTeam.losses}}</h6>
        <div class="team-image" :style="getTeamImageSvg(event.homeTeam.name, event.homeTeam.sport)"></div>
        <div
          class="illustrated"
          style="color: rgb(160, 160, 160); padding-bottom: 20px;"
          v-if="getIllustrator(event.homeTeam.name, event.homeTeam.sport)"
        >ART BY {{getIllustrator(event.homeTeam.name, event.homeTeam.sport)}}</div>
      </div>
      <div class="col-md-4">
        <div class="info">
          <div class="line">
            <hr>
            <i class="heart"></i>
            <hr>
          </div>
          <h5>{{event.homeTeam.abbr}} vs. {{event.awayTeam.abbr}}</h5>
          <h6 class="normal final" v-if="isCompleted(event)">
            <b>FINAL</b>
          </h6>
          <h6 class="normal live" v-else-if="event.isInProgress">
            <div>LIVE</div>
            <div style="position: relative; height: 14px; top: -10px; ">
              <svg width="40" height="3" style="left: -5px;">
                <rect fill="#8eb6ba" x="0" y="0" width="0" height="5">
                  <animate
                    attributeType="CSS"
                    attributeName="x"
                    keyTimes="0; 0.5; 1"
                    keySplines="0.6 0.09 0.91 0.3; 0.6 0.09 0.91 0.3"
                    calcMode="spline"
                    values="0; 100%; 0"
                    dur="7s"
                    repeatCount="indefinite"
                  ></animate>
                  <animate
                    attributeType="CSS"
                    attributeName="width"
                    keyTimes="0; 0.5; 1"
                    keySplines="0.6 0.09 0.91 0.3; 0.6 0.09 0.91 0.3"
                    calcMode="spline"
                    values="0%; 100%; 0%"
                    dur="7s"
                    repeatCount="indefinite"
                  ></animate>
                </rect>
              </svg>
            </div>
          </h6>

          <h6 class="normal" v-else>{{event.datetime | hour}}</h6>
          <div v-if="event.isInProgress">
            <h6
              class="live-score"
              v-if="event.homeScore !== null"
            >{{event.homeScore}} : {{event.awayScore}}</h6>
            <h6 class="live-score" v-else>0 : 0</h6>
          </div>
          <div v-else>
            <h6
              class="live-score"
              v-if="event.homeScore !== null"
            >{{event.homeScore}} : {{event.awayScore}}</h6>
          </div>

          <div v-if="event.isInProgress" class="game-section">{{getSection(event)}}</div>

          <h6 class="mt-4">Odds</h6>
          <h6 class="oddsInfo">
            {{event.homeTeam.name}}
            <span
              :style="colorizeOdds(event.homeOdds, event.awayOdds)"
            >{{event.homeOdds}}</span>
          </h6>
          <h6 class="oddsInfo">
            {{event.awayTeam.name}}
            <span
              :style="colorizeOdds(event.awayOdds, event.homeOdds)"
            >{{event.awayOdds}}</span>
          </h6>
        </div>
      </div>
      <div
        :class="{
          'selectable': isSelectable(event),
          'selected': event.selected === event.awayTeam.id
        }"
        class="col-md-3 team pt-2"
        @click="selectTeam(event, event.awayTeam)"
      >
        <h4>{{event.awayTeam.city}} {{event.awayTeam.name}}</h4>
        <h6>{{event.awayTeam.wins}}-{{event.awayTeam.losses}}</h6>
        <div class="team-image" :style="getTeamImageSvg(event.awayTeam.name, event.awayTeam.sport)"></div>
        <div
          class="illustrated"
          style="color: rgb(160, 160, 160); padding-bottom: 20px;"
          v-if="getIllustrator(event.awayTeam.name, event.awayTeam.sport)"
        >ART BY {{getIllustrator(event.awayTeam.name, event.awayTeam.sport)}}</div>
      </div>
      <div class="col-md-1"></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import axios from "axios";
import moment from "moment";
import { mapMutations, mapState } from "vuex";

import Clock from "@/components/Clock.vue";
import AuthService from "@/services/AuthService";
import { getEvents } from "@/services/EventsService";

let selectionIdMap = {};
let selectionMap = {};

export default {
  name: "home",
  data() {
    return {
      refreshInterval: null,
      time: moment(),
      interval: null,
      events: [],
    };
  },
  destroyed() {
    clearInterval(this.interval);
    clearInterval(this.refreshInterval);
  },
  async mounted() {
    if (this.userId) {
      await axios.post(`/api/users/${this.userId}/activity`);
    }

    this.interval = setInterval(() => {
      this.time = moment();
    }, 1000);

    this.refreshInterval = setInterval(() => {
      this.refreshEvents();
    }, 60000);

    this.refreshEvents();
  },
  methods: {
    ...mapMutations(["openLoginModal"]),
    getSection(event) {
      if (this.$route.params.sportName === "nhl") {
        return (
          {
            "1": "1st Period",
            "2": "2nd Period",
            "3": "3rd Period",
            "4": "Overtime (OT)",
            "5": "Shootout (SO)",
          }[`${event.currentSection}`] || "1st Period"
        );
      } else {
        return event.currentSection;
      }
    },
    async refreshEvents() {
      // const { data: events } = await axios.get(
      //   `/api/events/${this.$route.params.sportName}`
      // );
      const events = getEvents();
      console.log(events);
      const sortedEvents = events.sort((a, b) =>
        moment(a.datetime).diff(moment(b.datetime))
      );

      selectionMap = {};
      selectionIdMap = {};
      if (this.userId) {
        const { data: selections } = await axios.get(
          `/api/users/${this.userId}/selections`
        );
        selections.forEach((selection) => {
          selectionMap[selection.eventId] = selection.teamId;
          selectionIdMap[selection.eventId] = selection.id;
        });
      }

      const preprocessed = sortedEvents.map((event) => {
        const selected = selectionMap[event.id];
        return {
          ...event,
          selected,
          homeOdds: this.convertOdds(event.homeOdds),
          awayOdds: this.convertOdds(event.awayOdds),
        };
      });

      const other = preprocessed.filter((event) => !this.isCompleted(event));
      const completed = preprocessed.filter(this.isCompleted);

      this.events = [...other, ...completed];
    },
    isCompleted(event) {
      return (
        event.isCompleted || (!event.isInProgress && event.homeScore !== null)
      );
    },
    convertOdds(value) {
      if (!value) {
        return "N/A";
      }
      if (value > 0) {
        return (value / 100.0 + 1.0).toFixed(2);
      }
      return (100.0 / Math.abs(value) + 1).toFixed(2);
    },
    getIllustrator(team, sport) {
      if (sport === "nba") {
        return "MYKOWU";
      } else {
        return null;
      }
    },
    getTeamImageSvg(team, sport = "nhl") {
      return {
        "background-image": `url('${this.getImage(team, sport)}')`,
      };
    },
    getImage(team, sport = "nhl") {
      if (sport === "nhl") {
        return (
          {
            Ducks: "icons/NHL_ANADucks.svg",
            Bruins: "icons/NHL_BOSBruins.svg",
            Sabres: "icons/NHL_BUFSabres.svg",
            Flames: "icons/NHL_CGYFlames.svg",
            Hurricanes: "icons/NHL_CARHurricanes.svg",
            Blackhawks: "icons/NHL_CHIBlackhawks.svg",
            Avalanche: "icons/NHL_COLAvalanche.svg",
            "Blue Jackets": "icons/NHL_COLBlueJackets.svg",
            Stars: "icons/NHL_DALStars.svg",
            "Red Wings": "icons/NHL_DETRedWings.svg",
            Oilers: "icons/NHL_EDMOilers.svg",
            Panthers: "icons/NHL_FLOPanthers.svg",
            Kings: "icons/NHL_LAKings.svg",
            Wild: "icons/NHL_MINWild.svg",
            Canadiens: "icons/NHL_MTLCanadiens.svg",
            Predators: "icons/NHL_NSHPredators.svg",
            Devils: "icons/NHL_NJDevils.svg",
            Islanders: "icons/NHL_NYIslanders.svg",
            Rangers: "icons/NHL_NYRangers.svg",
            Senators: "icons/NHL_OTTSenators.svg",
            Flyers: "icons/NHL_PHILFlyers.svg",
            Coyotes: "icons/NHL_ARICoyotes.svg",
            Penguins: "icons/NHL_PITPenguins.svg",
            Sharks: "icons/NHL_SJSharks.svg",
            Blues: "icons/NHL_STLBlues.svg",
            Lightning: "icons/NHL_TBLightning.svg",
            "Maple Leafs": "icons/NHL_TORLeafs.svg",
            Canucks: "icons/NHL_VANCanucks.svg",
            Capitals: "icons/NHL_WSHCapitals.svg",
            Jets: "icons/NHL_WPGJets.svg",
            "Golden Knights": "icons/NHL_VGKGolden.svg",
          }[team] || "icons/GoldenTrashBag.svg"
        );
      } else if (sport === "nba") {
        return (
          {
            Lakers: "icons/nba/NBA_LALakers.svg",
            // Warriors: "icons/",
            Rockets: "icons/nba/NBA_HOU_Rockets.svg",
            Celtics: "icons/nba/NBA_BOS_Celtics.svg",
            Pelicans: "icons/nba/NBA_NOP_Pelicans.svg",
            // Cavaliers: "",
            "76ers": "icons/nba/NBA_PHI_76ers.svg",
            Jazz: "icons/nba/NBA_UTA_Jazz.svg",
            Pacers: "icons/nba/NBA_IND_Pacers.svg",
            Bucks: "icons/nba/NBA_MIL_Bucks.svg",
            Raptors: "icons/nba/NBA_TOR_Raptors.svg",
            // Wizards: "",
            Thunder: "icons/nba/NBA_OKC_Thunder.svg",
            Timberwolves: "icons/nba/NBA_MIN_Timberwolves.svg",
            Spurs: "icons/nba/NBA_SAS_Spurs.svg",
            Heat: "icons/nba/NBA_MIA_Heat.svg",
            // "Trail Blazers": "",
            Bulls: "icons/nba/NBA_CHI_Bulls.svg",
            // Nets: "",
            Hornets: "icons/nba/NBA_CHA_Hornets.svg",
            // Hawks: "",
            Mavericks: "icons/nba/NBA_DAL_Mavericks.svg",
            // Nuggets: "",
            // Pistons: "",
            // Clippers: "",
            // Grizzlies: "",
            Lakers: "icons/nba/NBA_LAL_Lakers.svg",
            // Knicks: "",
            // Suns: "",
            // Magic: "",
            // Kings: ""
          }[team] || "icons/GoldenTrashBag.svg"
        );
      }
    },
    isSelectable(event) {
      return (
        true ||
        this.time.isBefore(
          moment.tz(event.datetime.replace("Z", "-05:00"), "America/New_York")
        )
      );
    },
    colorizeOdds(home, away) {
      const color = parseFloat(home) > parseFloat(away) ? "#55efc4" : "#fab1a0";
      return {
        color,
      };
    },
    async selectTeam(event, team) {
      // if (!this.isSelectable(event)) {
      //   return;
      // }
      // if (!AuthService.token) {
      //   this.openLoginModal();
      //   return;
      // }
      if (event.selected === team.id) {
        // await axios.delete(`/api/selections/${selectionIdMap[event.id]}`);
        event.selected = null;
        delete selectionIdMap[event.id];
      } else {
        // const { data: selection } = await axios.post("/api/selections", {
        //   userId: this.userId,
        //   eventId: event.id,
        //   teamId: team.id,
        // });
        selectionIdMap[event.id] = Math.random();
        event.selected = team.id;
      }
    },
  },
  computed: {
    ...mapState(["userId"]),
  },
  components: {
    Clock,
  },
};
</script>

<style scoped lang="scss">
$anime-time: 20s;

$box-size: 300px;
$clip-distance: 0.03;
$clip-size: $box-size * (1 + $clip-distance * 2);
$path-width: 3px;

$main-color: #d3ffe9;

%full-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

@keyframes clipMe {
  0%,
  100% {
    clip: rect(0px, $clip-size, $path-width, 0px);
  }
  25% {
    clip: rect(0px, $path-width, $clip-size, 0px);
  }
  50% {
    clip: rect($clip-size - $path-width, $clip-size, $clip-size, 0px);
  }
  75% {
    clip: rect(0px, $clip-size, $clip-size, $clip-size - $path-width);
  }
}

.team-image {
  height: 260px;
  background-size: contain;
  background-repeat: no-repeat;
}

img {
  width: 80%;
  display: inline-block;
}

.hr {
  z-index: -2;
  position: absolute;
  top: 12px;
  width: 100%;
}

.box {
  z-index: -1;
  position: absolute;
  top: 20px;
  width: 50%;
  height: 40px;
  display: inline-block;
  background-color: white;
}

.info {
  position: relative;
  margin-top: 80px;
}

.line {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 10px;
  color: #55efc4;
}

hr {
  border: 0;
  border-top: 1px solid #aaa;
  flex: 1;
  z-index: 1;
}

i:after {
  color: black;
  padding-right: 70px;
  padding-left: 70px;
  content: "    ";
  display: inline-block;
}

.team.selectable {
  cursor: pointer;
}

.team.selectable:hover {
  background-color: #eee;
}

.team > .illustrated {
  opacity: 0;
}

.team:hover > .illustrated {
  opacity: 1;
}

.team.selected {
  background-color: rgba(#d3ffe9, 0.2);
  cursor: default;
  animation: clipMe $anime-time linear infinite;

  &::before,
  &::after {
    @extend %full-fill;
    content: "";
    z-index: -1;
    margin: -1 * $clip-distance * 100%;
    box-shadow: inset 0 0 0 $path-width $main-color;
    animation: clipMe $anime-time linear infinite;
  }

  &::before {
    animation-delay: $anime-time * -0.5;
  }
}

.team.selectable.selected {
  cursor: pointer;
}

.space {
  height: 250px;
}

.mt-8 {
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  padding-top: 90px;
}

.no-events {
  margin-top: 260px;
}

.normal {
  color: rgb(80, 80, 80);
  font-size: 12px;
  font-weight: 300;
}
h4 {
  color: #2d3436;
  font-weight: 600;
  letter-spacing: 1px;
  font-size: 16px;
}

h5 {
  font-size: 15px;
  font-weight: 500;
  padding-top: 8px;
}

h6 {
  font-size: 12px;
}

.oddsInfo {
  font-weight: 500;
  font-size: 13px;
  float: left;
  width: 50%;
}

span {
  padding-top: 5px;
  float: right;
  width: 100%;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 2px;
}

.mt-4 {
  font-weight: 500;
  font-size: 14px;
}

.live-score {
  font-size: 24px;
  font-weight: 600px;
  letter-spacing: 3px;
  color: #8eb6ba;
}

.live {
  color: #8eb6ba;
  font-weight: 600;
  font-size: 17px;
  margin-bottom: 0px;
}

.game-section {
  color: #8eb6ba;
  font-size: 14px;
}

.final {
  font-weight: 600;
  font-size: 17px;
}
</style>
