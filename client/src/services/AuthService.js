import * as jwt from 'jsonwebtoken';

import store from '../store';

export default {
  token: null,
  setToken(token) {
    this.token = token;
    if (!token) {
      store.commit('setUserId', null);
      window.localStorage.removeItem('token');
    } else {
      store.commit('setUserId', jwt.decode(token).uid);
      window.localStorage.setItem('token', token);
    }
  },
};
