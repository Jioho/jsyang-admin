import { changepasswd } from './service';
export default {
  namespace: 'changepasswd',
  state: {},
  effects: {
    *changepasswd({ payload }, { call, put }) {
      console.log('*changepasswd -> changepasswd');
      const response = yield call(changepasswd, payload);
      console.log('*appendFetch -> response', response);
    },
  },
};
