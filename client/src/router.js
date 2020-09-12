import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Profile from "./views/Profile.vue";
import Standings from "./views/Standings.vue";
import StandingsTable from "./views/StandingsTable.vue";
import CreateGroup from "./views/CreateGroup.vue";
import SportSelect from "./views/SportSelect.vue";
import SearchGroup from "./views/SearchGroup.vue";
import Sport from "./views/Sport.vue";
import LoginError from "./views/LoginError.vue";
import Register from "./views/Register.vue";
import LoginCallback from "./views/LoginCallback.vue";
import Terms from "./views/Terms.vue";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "gameSelect",
      component: SportSelect,
      meta: {
        title: "Sports"
      }
    },
    {
      path: "/terms",
      component: Terms
    },
    {
      path: "/callback/:token",
      component: LoginCallback
    },
    {
      path: "/register",
      component: Register,
      meta: {
        title: "Register"
      }
    },
    {
      path: "/errors",
      component: LoginError
    },
    {
      path: "/:sportName",
      component: Sport,
      children: [
        {
          path: "",
          component: Home,
          name: "home",
          meta: {
            title: "Home"
          }
        },
        {
          path: "standings",
          component: Standings,
          children: [
            {
              path: "",
              component: StandingsTable
            },
            {
              path: "overall",
              component: StandingsTable,
              name: "overall",
              meta: {
                title: "Standings"
              }
            },
            {
              path: "groups/:groupId",
              component: StandingsTable,
              name: "groups",
              meta: {
                title: "Group"
              }
            },
            {
              path: "create",
              component: CreateGroup,
              name: "create",
              meta: {
                title: "Create Group"
              }
            },
            {
              path: "find",
              component: SearchGroup,
              name: "search",
              meta: {
                title: "Search Group"
              }
            }
          ]
        },
        {
          path: "profile/:profileId",
          name: "profile",
          meta: {
            title: "My Profile"
          },
          component: Profile
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `DoxGoat - ${to.meta.title}` : "DoxGoat";
  next();
});

export default router;
