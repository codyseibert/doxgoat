import moment from 'moment';
import 'moment-timezone';
import Vue from 'vue';

import VueGoodTable from 'vue-good-table';

import App from './App.vue';
import router from './router';
import store from './store';
import AuthService from './services/AuthService';

const token = window.localStorage.getItem('token');
AuthService.setToken(token);

Vue.config.productionTip = false;

Vue.use(VueGoodTable);

Vue.filter('datetime', function (value) {
  return moment
    .tz(String(value.replace('Z', '-05:00')), 'America/New_York')
    .format('MM/DD/YYYY h:mm A, z');
});

Vue.filter('monthRaw', function (value) {
  return moment.tz(value, moment.tz.guess()).format('MMM Do, YYYY');
});

Vue.filter('hourRaw', function (value) {
  return moment.tz(value, moment.tz.guess()).format('h:mm A, z');
});

Vue.filter('hour', function (value) {
  return moment
    .tz(value.replace('Z', '-05:00'), 'America/New_York')
    .format('h:mm A, z');
});

Vue.filter('month', function (value) {
  return moment
    .tz(value.replace('Z', '-05:00'), 'America/New_York')
    .format('MMM Do, YYYY');
});

Vue.filter('day', function (value) {
  return moment
    .tz(String(value.replace('Z', '-05:00')), 'America/New_York')
    .format('MMM Do');
});

Vue.filter('fromNow', function (value) {
  return moment(value).fromNow();
});

Vue.filter('titleCase', function (str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
