import { queryAdminList, removeAdmin, addAdmin, updateAdmin, adminLogin } from './service';

export default {
  namespace: 'admin',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryAdminList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.list) ? response.list : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryAdminList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response.list) ? response.list : [],
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeAdmin : updateAdmin;
      } else {
        callback = addAdmin;
      }
      const res = yield call(callback, payload); // post
      const response = yield call(queryAdminList);
      yield put({
        type: 'queryList',
        payload: response.list,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};
